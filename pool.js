/*
 *postgresql pooling
 */
const mysql = require("mysql");

require("dotenv").config();

// const poolwrite = new Pool({
// user: "ahacad",
// password: "root",
// host: process.env.DB_HOST,
// database: "api",
// port: 5432,
//});
// const poolread = new Pool({
// user: "ahacad",
// password: "root",
// host: process.env.DB_HOST,
// database: "api",
// port: 5432,
//});

const poolwrite = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: "ahacad",
  password: "root",
  database: "api",
});
const poolread = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: "ahacad",
  password: "root",
  database: "api",
});

module.exports = {
  poolwrite,
  poolread,
};
