const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const mountRoutes = require('./routes');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, resp) => {
  resp.json({ info: 'Node.js, api' });
});

mountRoutes(app);
module.exports = app;
