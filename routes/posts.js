const { Router } = require('express');
const postsClient = require('../api/posts');

const posts = new Router();

posts.post('/new', postsClient.addPost);
posts.post('/delete', postsClient.deletePost);
posts.get('/:id', postsClient.getThreadById);
posts.get('/', postsClient.getPosts);

module.exports = posts;
