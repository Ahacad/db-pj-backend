const { Router } = require('express');
const postsClient = require('../api/posts');

const posts = new Router();

posts.post('/new', postsClient.addPost);

module.exports = posts;
