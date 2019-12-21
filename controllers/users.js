const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

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
        username: req.body.username,
        password: passwordHash,
        email: req.body.email
    }
    try {
        const createdUser = await User.create(userDbEntry);
        req.session.username = req.body.username;
        req.session.logged = true;
        res.send(req.session);
    } catch(err) {
        res.send(err);
    }
    res.redirect('/home');
});

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

router.get('/:id', async(req, res) => {
    try {
        const foundUser = await User.findById(req.params.id);
        console.log(foundUser);
        res.render('user/profile.ejs', {
            user: foundUser
        })
    } catch(err) {
        res.send(err);
    }
})




module.exports = router;