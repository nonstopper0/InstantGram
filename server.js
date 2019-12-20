const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
const port = 3000
require('./db/db.js');

app.use(session({
    secret: 'InstantGram',
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    if(req.session.logged){
        res.redirect('/home');
    } else {
        res.redirect('/user/login');
    }
})
const photoController = require('./controllers/photos.js');
app.use('/home', photoController);
const userController = require('./controllers/users.js')
app.use('/user', userController);

app.listen(port, () => {
    console.log('Listening on port ' + port)
})