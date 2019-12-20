const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    url: {type: String, required: true},
    description: {type: String, required: true},
    dislikes: Number,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user"
    }
}, {timestamps: true})

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;