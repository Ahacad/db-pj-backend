/*
 *postgresql pooling
 */
const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  user: 'ahacad',
  password: 'root',
  host: process.env.DB_HOST,
  database: 'api',
  port: 5432,
});
module.exports = pool;
