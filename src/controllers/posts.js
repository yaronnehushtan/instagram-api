const Post = require('../models/post');
const ObjectId = require('mongodb').ObjectId;

class Posts {

    async create(req,res) {
        const post = new Post ({
            user: req.user._id,
            image: req.file.filename,
            description: req.body.description
        })

        try {
            const createdPost = await post.save();
            console.log(createdPost);
            res.status(201).json(createdPost);
        } catch(err) {
            res.status(400).json(err);
        }

    }

    async getAll(req,res) {
        try{
            const posts = await Post.find()
                .populate('user', ['avatar','username' ])  //instead of bringing all filed - bring only avatar, username and the id which is automatincly
                // .sort( { createdAt : -1 } )
                .sort( { createdAt : req.query.sort } )
            res.json(posts)
        } catch (err) {
            res.sendStatus(400);
        }
    }

    async getPost(req,res){
        try {
            const post = await Post
                .findById(req.params.id)
                .populate('user', ['avatar','username']);
            if (!post){
                res.status(401)
            }
            res.json(post)
        } catch (err) {
            res.status(500).json(err)
        }
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
            res.status(201).json(post.likes);
        } catch(err) {
            res.sendStatus(500)
        }
        return;

    }

    async unlike(req,res) {
        const postId = (req.params.id);
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
            res.status(200).json(post.likes);
        } catch(err) {
            res.sendStatus(500)
        }
        return;

    }


}

module.exports = new Posts();
