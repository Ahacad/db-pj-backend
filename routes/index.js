const users = require('./users');
const posts = require('./posts');

const mountRoutes = (app) => {
  app.use('/users', users);
  app.use('/posts', posts);
};

module.exports = mountRoutes;
