const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Photo = require('../models/photo');

//Login Create
router.post('/login', async(req, res) => {
    try {
        const foundUser = await User.findOne({username: req.body.username});
        if(foundUser) {
            if(bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.logged = true;
                req.session.message = '';
                req.session.username = foundUser.username;
                res.redirect('/home');
            } else {
                req.session.message = 'Youve entered the wrong username or password';
                res.redirect('/');
            }
        } else {
            req.session.message = 'Youve entered the wrong username or password';
            res.redirect('/');
        }
    } catch(err) {
        res.send(err);
    }
})
router.post('/registration', async(req, res) => {
    const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    const userDbEntry = {
        username: (req.body.username).toLowerCase(),
        password: passwordHash,
        email: (req.body.email).toLowerCase()
    }
    try {
        const createdUser = await User.create(userDbEntry);
        req.session.username = req.body.username;
        req.session.logged = true;
        res.redirect('/home');
    } catch(err) {
        res.redirect('/user/registration');
        req.session.message = "This username or email is already in our system"
    }
});

router.put('/:id/edit', async(req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/user/' + req.params.id);
    } catch(err) {
        res.render('error.ejs', {
            error: err
        })
    }
})

router.get('/login', (req, res) => {
    res.render('user/login.ejs', {
        message: req.session.message
    })
})

router.get('/registration', (req, res) => {
    res.render('user/registration.ejs');
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            res.send(err);
        } else {
            res.redirect('/');
        }
    })
})

router.get('/:id/edit', async(req, res) => {
    try {
        const foundUser = await User.findById(req.params.id);
        const foundPhotos = await Photo.find({user_username: foundUser.username});
        if(req.session.username == foundUser.username) {
            res.render('user/profileEdit.ejs', {
                user: foundUser,
                photos : foundPhotos
            })
        } else {
            res.redirect('/user/login');
        }
    } catch(err) {
        res.render('error.ejs', {
            error: err
        })
    }
})

router.get('/:id', async(req, res) => {
    try {
        const foundUser = await User.findById(req.params.id);
        const foundPhotos = await Photo.find({user_username: foundUser.username});
        let matchedType = false;
        console.log('getting');
        console.log(req.session.username);
        console.log(foundUser.username);
        const isMatched = () => {
            return (req.session.username == foundUser.username);
        }
        if(await isMatched()) {
            matchedType = true;
        }
        res.render('user/profile.ejs', {
            user: foundUser,
            photos: foundPhotos,
            matched: matchedType
        })
    } catch(err) {
        res.render('error.ejs', {
            error: err
        });
    }
})

router.get('/', async(req, res) => {
    if (req.session.logged) {
        let foundUser = await User.findOne({username: req.session.username});
        res.redirect(`/user/${foundUser._id}`)
    } else {
        res.redirect('/user/login');
    }
})



module.exports = router;