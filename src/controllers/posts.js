const Post = require('../models/post');


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

}

module.exports = new Posts();
