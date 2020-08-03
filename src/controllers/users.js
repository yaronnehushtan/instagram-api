const md5 = require('md5');
const User = require('../models/user');
const Post = require('../models/post');
const config = require('../config/env/index');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const ERROR_DUPLICATE_VALUE=11000;
const DURATION_60D=60*60*24*60*1000;


class Users {

    async getAll(req,res) {
        const regex = new RegExp(req.query.username || '', 'i');
        try {
            const users = await User
                .find({username: regex})
                .select(['username', 'avatar', 'bio'])
                .limit(10)
            res.json(users)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async getUser(req,res){
        try {
            const user = await User
                .findById(req.params.id)
                .select(['username', 'bio', 'avatar', 'createdAt']);
            if (!user){
                res.status(401)
            }
            res.json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async create(req,res) {
        const newUser = new User(req.body);
        newUser.password = md5(newUser.password)
        try {
            const createdUser = await newUser.save()
            res.status(201).json(createdUser)
        } catch(err) {
            if (err.code === ERROR_DUPLICATE_VALUE) {
                res.sendStatus(409);
                return
            }
            res.status(400).json(err)
        }
    }

    async login(req,res) {
        const credentials= req.body
        try {
            const user= await User.findOne({
                username: credentials.username,
                password: md5(credentials.password)
            });
            if (!user) {
                res.sendStatus(401);
                return;
            } 
            // success
            const token = jwt.sign({id: user._id}, config.secret)
            res.cookie(config.cookieName, token, { maxAge: DURATION_60D }); //inject cookie
            // res.cookie(config.cookieName, user._id, { maxAge: DURATION_60D }); //inject cookie
            res.json(user).send();
        } catch(err) {
            res.sendStatus(500)
        }
       
    }

    async usernameValidation(req,res) {

        const credentials= req.body;

        try {
            const user= await User.findOne({
                username: credentials.username
            });
            // error-- user exist
            if (user) {
                res.status(401).send('false');
                return;
            }
            // success
            res.status(200).send('true');
        } catch(err) {
            res.sendStatus(500)
        }

    }

    async getUserPosts(req,res) {
        // const userId = ObjectId(req.params.id);
        try{
            const posts = await Post.find({
                user: req.params.id
            })
                .populate('user', ['avatar','username' ])
                .sort( { createdAt : req.query.sort } )
            res.json(posts);
        } catch (err) {
            res.sendStatus(400);
        }

    }

    async edit(req,res) {
        const newUserData= req.body;
        User.findOneAndUpdate(
            { _id: req.params.id },
            {   avatar: req.file.filename,
                bio: req.body.bio
            },
            {new: true},
            function (err, user) {
                if (err) {
                    res.status(401).send(err);
                }
                res.status(200).send(user);
            });

    }


    me(req,res){     
        res.json(req.user);
    }

        

}

module.exports = new Users();
