const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;
const Post = new mongoose.model('Post', {
    userId: {
        type: ObjectId,
        required: true
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
