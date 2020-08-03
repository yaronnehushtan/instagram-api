const mongoose = require('mongoose');

const User = new mongoose.model('User', {
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: String,
    createdAt: {
        type: Date,
        default: ()=>  new Date()
    },
    bio:String
})

module.exports = User;
