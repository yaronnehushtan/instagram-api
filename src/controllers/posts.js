const Post = require('../models/post');
const ObjectId = require('mongodb').ObjectId;

class Posts {

    async create(req,res) {
        const post = new Post ({
            userId: req.user._id,
            image: req.file.filename,
            description: req.body.description
        })

        try {
            const createdPost = await post.save();
            res.status(201).json(createdPost);
        } catch(err) {
            res.status(400).json(err);
        }

    }

    getAll(req,res) {
        Post.find().sort( { createdAt : -1 } )
            .then(posts => res.json(posts))
            .catch(err => res.status(500).json(err));
    }

    async like(req,res) {
        const postId = ObjectId(req.params.id);
        const userId = req.body;
        try {
            const post= await Post.findOne({
                _id: postId
            });
            if (!post) {
                res.sendStatus(401);
                return;
            }
            // success
            post.likes.push(userId);
            await post.save();
            res.status(201).json(userId);
        } catch(err) {
            res.sendStatus(500)
        }
        return;

    }

    async unlike(req,res) {
        const postId = ObjectId(req.params.id);
        const userId = req.params.userId;
        try {
            const post= await Post.findOne({
                _id: postId
            });
            if (!post) {
                res.sendStatus(401);
                return;
            }
            // success
            const index=post.likes.findIndex((element) => element._id ==  userId);
            // console.log(index);
            if (index===-1) {
                res.sendStatus(400);
                return;
            }
            post.likes.splice(index, 1);
            await post.save();
            res.status(200).json(userId);
        } catch(err) {
            res.sendStatus(500)
        }
        return;

    }
}

module.exports = new Posts();
