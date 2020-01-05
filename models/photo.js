const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    img: {data: Buffer, contentType: String},
    description: {type: String, required: true},
    dislikes: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    user_id: String,
    user_username: String,
}, {timestamps: true})

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;