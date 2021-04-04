const { Router } = require('express');
const usersClient = require('../api/users');

const users = new Router();

users.post('/register', usersClient.createUser);
users.post('/login', usersClient.login);
users.post('/update/:id', usersClient.updateUser);
users.delete('/delete/:id', usersClient.deleteUser);
users.get('/', usersClient.getUsers); // FIXME: remove this route after testing

module.exports = users;
