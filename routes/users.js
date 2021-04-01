const { Router } = require('express');
const usersClient = require('../api/users');

const users = new Router();

users.post('/register', usersClient.createUser);

module.exports = users;
