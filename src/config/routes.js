const express = require('express');
const users = require('../controllers/users')
const posts = require('../controllers/posts')
const auth = require('../middlewares/auth')
const multer = require ('multer')
// const upload = multer({ dest: 'public/posts/' })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/posts')
    },
    filename: function (req, file, cb) {
        const nameArr = file.originalname.split('.');
        const extention = nameArr[nameArr.length-1];
        let filename = Math.random().toString(36).substr(2,9);
        cb(null, filename + '.' + extention);
    }
})

//Date.now() + '-' +

const upload = multer({ storage: storage });

const routes = express.Router();
routes.get('/users', users.getAll);
routes.put('/users', users.create);
routes.post('/users/login', users.login);
routes.post('/users/username-validation', users.usernameValidation);

routes.get('/users/me', auth, users.me);

routes.put('/posts', auth, upload.single('image'),posts.create);
routes.get('/posts', auth, posts.getAll);
routes.post('/posts/:id/likes', auth, posts.like);
routes.delete('/posts/:id/likes/:userId', auth, posts.unlike);



routes.get('/', (req,res)=>{
    res.send();
});

module.exports = routes;
