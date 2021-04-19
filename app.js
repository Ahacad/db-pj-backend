const express = require('express');
const bodyParser = require('body-parser');

const mountRoutes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'content-type,xfilecategory,xfilename,xfilesize',
  );
  next();
});

app.get('/', (req, resp) => {
  resp.json({ info: 'Node.js, api' });
});

mountRoutes(app);

module.exports = app;
