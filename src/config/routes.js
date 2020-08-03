const express = require('express');
const users = require('../controllers/users')
const posts = require('../controllers/posts')
const comments = require('../controllers/comments')
const auth = require('../middlewares/auth')
const multer = require ('multer')
// const upload = multer({ dest: 'public/posts/' })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if(file.fieldname==='avatar') {
            cb(null, 'public/avatars')
        } else if (file.fieldname==='image'){
            cb(null, 'public/posts')
        } else {
            return
        }

    },
    filename: function (req, file, cb) {
        const nameArr = file.originalname.split('.');
        const extension = nameArr[nameArr.length-1];
        let filename = Math.random().toString(36).substr(2,9);
        cb(null, filename + '.' + extension);
    }
})

const upload = multer({ storage: storage });

const routes = express.Router();
routes.get('/users', users.getAll);
// routes.get('/users/:id', users.getUser);
routes.put('/users', users.create);
routes.post('/users/login', users.login);
routes.post('/users/username-validation', users.usernameValidation);
routes.get('/users/:id/posts', auth, users.getUserPosts);
routes.get('/users/me', auth, users.me);
routes.get('/users/:id', users.getUser);
routes.post('/users/:id', upload.single('avatar'), users.edit);


routes.put('/posts', auth, upload.single('image'),posts.create);
routes.get('/posts', posts.getAll);
routes.post('/posts/:id/likes', auth, posts.like);
routes.delete('/posts/:id/likes/:userId', auth, posts.unlike);
routes.get('/posts/:id',auth, posts.getPost);

routes.put('/posts/:id/comment', auth, comments.create);
routes.get('/posts/:id/comment', auth, comments.getComments);
routes.post('/comments/:id/likes', auth, comments.like);
routes.delete('/comments/:id/likes/:userId', auth, comments.unlike);




routes.get('/', (req,res)=>{
    res.send();
});

module.exports = routes;
