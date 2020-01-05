const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const Photo = require('../models/photo.js');
const User = require('../models/user.js');

let upload = multer({dest: 'public/uploads/' });

// starts at '/home'
// Photo create route, assigns owner id according to who is currently logged in
router.post('/create', upload.single('img'), async(req, res) => {
    try {
        const foundUser = await (await User.findOne({username: req.session.username}))
        const photoParams = {
            img: {data: fs.readFileSync(req.file.path), contentType: req.file.mimetype},
            description: req.body.description,
            user_id: foundUser._id,
            user_username: foundUser.username
        }
        console.log(photoParams);
        await Photo.create(photoParams);
        res.redirect('/home');
    }catch(err) {
        console.log(err);
        res.render('error.ejs', {
            error: err
        })
    }

})

router.post('/:id', (req, res) => {
    try {
        console.log(req.query);
    }catch(err) {
        res.render('error.ejs', {
            error: err
        })
    }
})

router.put('/:id', async(req, res) => {
    try {
        const photo = await Photo.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/home/${req.params.id}`)
    } catch(err) {
        res.render('error.ejs', {
            error: err
        })
    }
})

// check if user is logged in while visiting home page
router.get('/', async(req, res) => {
    if(req.session.logged) {
        let foundPhotos = await Photo.find();
        let userID = await User.findOne({'username': req.session.username})
        res.render('home.ejs', {
            user: userID,
            photos: foundPhotos,
        })
    } else {
        res.redirect('/user/login');
    }
})

// render create page
router.get('/create', async(req, res) => {
    if(req.session.logged) {
    try{
        let foundUser = await User.find({username: req.session.username});
        res.render('photo/create.ejs', {
            founduser: foundUser
        })
    } catch(err) {
        res.render('error.ejs', {
            error: err
        })
    }
} else {
    res.redirect('/user/login');
}})

router.get('/:id/edit', async(req, res) => {
    try {
        const userp = await User.findOne({'username': req.session.username});
        const foundPhotoById = await Photo.findById(req.params.id);
        res.render('photo/edit.ejs', {
            photo: foundPhotoById,
            user: userp
        })
    }catch(err) {
        res.redirect(`/home/${req.params.id}`);
    }
})

router.get('/:id', async(req, res) => {
    try {
        let matched = false;
        const user = await req.session.username
        const foundPhoto = await Photo.findById(req.params.id);
        const photoOwner = await foundPhoto.user_username;
        const foundUser = await User.findById(foundPhoto.user_id);
        if (user == photoOwner) {
            matched = true;
        }
        res.render('photo/show.ejs', {
            photo: foundPhoto,
            user: foundUser,
            matched: matched
        })
    } catch(err) {
        res.send(err);
    }
});




module.exports = router;