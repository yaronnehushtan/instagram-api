const Comment = require('../models/comment');
const ObjectId = require('mongodb').ObjectId;

class Comments {

    async create(req,res) {

        console.log('enter to create post')
        const comment = new Comment ({
            user: req.user._id,
            postId: ObjectId(req.params.id),
            content: req.body.content
        })
        try {
            const createdComment = await comment.save()
            await createdComment.populate('user', ['avatar','username' ])
                .execPopulate();
            // try{
            //     const comments = await Comment.find({
            //         postId: req.params.id
            //     })
            //         .populate('user', ['avatar','username' ])
            //     res.status(201).json(comments);
            // } catch (err) {
            //     res.sendStatus(400);
            // }
            res.status(201).json(createdComment);
        } catch(err) {
            res.status(400).json(err);
        }

    }

    async getComments(req,res) {
        try{
            const comments = await Comment.find({
                postId: req.params.id
            })
                .populate('user', ['avatar','username' ])  //instead of bringing all filed - bring only avatar, username and the id which is automatincly
            res.json(comments)
        } catch (err) {
            res.sendStatus(400);
        }
    }

    async like(req,res) {
        const commentId = ObjectId(req.params.id);
        const userId = req.body;
        try {
            const comment= await Comment.findOne({
                _id: commentId
            });
            if (!comment) {
                res.sendStatus(401);
                return;
            }
            // success
            comment.likes.push(userId);
            await comment.save();
            res.status(201).json(comment.likes);
        } catch(err) {
            res.sendStatus(500)
        }
        return;

    }

    async unlike(req,res) {
        const commentId = (req.params.id);
        const userId = req.params.userId;
        try {
            const comment = await Comment.findOne({
                _id: commentId
            });
            if (!comment) {
                res.sendStatus(401);
                return;
            }
            // success
            const index = comment.likes.findIndex((element) => element._id == userId);
            // console.log(index);
            if (index === -1) {
                res.sendStatus(400);
                return;
            }
            comment.likes.splice(index, 1);
            await comment.save();
            res.status(200).json(comment.likes);
        } catch (err) {
            res.sendStatus(500)
        }
        return;
    }



}

module.exports = new Comments();
