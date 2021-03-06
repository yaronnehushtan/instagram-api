const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;
const Post = new mongoose.model('Post', {
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    description: String,
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: ()=>  new Date()
    },
    likes: [ObjectId],
})

module.exports = Post;
