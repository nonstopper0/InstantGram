const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    bio: {type: String, default: "Bio"},
    liked: {type: Array, default: []},
    disliked: {type: Array, default: []}
})

const User = mongoose.model('User', userSchema);

module.exports = User;