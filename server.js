const express = require('express');
const methodOverride = require('method-override');
const app = express.Router();
const port = 3000
require('./db/db.js');

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));



app.listen(port, () => {
    console.log('Listening on port ' + port)
})