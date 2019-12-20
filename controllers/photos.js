const express = require('express');
const router = express.Router();

const Photo = require('../models/photo.js');
const User = require('../models/user.js');

// Photo create route, assigns owner id according to who is currently logged in
router.post('/create', async(req, res) => {
    try {
        const foundUser = await (await User.findOne({username: req.session.username}))
        const photoParams = {
            url: req.body.url,
            description: req.body.description,
            user_id: foundUser._id
        }
        await Photo.create(photoParams);
        res.redirect('/home');
    }catch(err) {
        res.send(err);
    }

})

// check if user is logged in while visiting home page
router.get('/', (req, res) => {
    if(req.session.logged) {
        res.render('home.ejs', {
            username: req.session.username
        })
    } else {
        res.redirect('/user/login');
    }
})

// render create page
router.get('/create', (req, res) => {
    try{
        res.render('photo/create.ejs')
    } catch(err) {
        res.send(err);
    }

})
module.exports = router;