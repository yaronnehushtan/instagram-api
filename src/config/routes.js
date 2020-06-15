const express = require('express');
const users = require('../controllers/users')
const routes = express.Router();

routes.get('/users', users.getAll);
routes.put('/users', users.create);

routes.get('/', (req,res)=>{
    res.send();
});

module.exports = routes;