const { Router } = require('express');
const postsClient = require('../api/posts');

const posts = new Router();

posts.post('/new', postsClient.addPost);
posts.post('/:id/newreply', postsClient.addReply);
posts.post('/:id/reply/like', postsClient.likeReply);
posts.post('/:id/like', postsClient.likePost);
posts.get('/:id', postsClient.getThreadById);
posts.post('/delete', postsClient.deletePost);
posts.get('/', postsClient.getPosts);

module.exports = posts;
