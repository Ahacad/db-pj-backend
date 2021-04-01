const users = require('./users');

const mountRoutes = (app) => {
  app.use('/users', users);
};

module.exports = mountRoutes;
