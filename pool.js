/*
 *postgresql pooling
 */
const { Pool } = require('pg');

const pool = new Pool({
  user: 'ahacad',
  password: 'root',
  host: 'db',
  database: 'api',
  port: 5432,
});
module.exports = pool;
