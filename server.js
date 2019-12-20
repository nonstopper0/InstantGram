const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
const port = 3000
require('./db/db.js');

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

const usersController = require('./controllers/users.js');
app.use('/auth', usersController);

app.listen(port, () => {
    console.log('Listening on port ' + port)
})