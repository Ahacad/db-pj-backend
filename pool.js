/*
 *postgresql pooling
 */
const knex = require("knex");

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

// const poolwrite = mysql.createPool({
// connectionLimit: 10,
// host: process.env.DB_HOST,
// user: "ahacad",
// password: "root",
// database: "api",
//});
// const poolread = mysql.createPool({
// connectionLimit: 10,
// host: process.env.DB_HOST,
// user: "ahacad",
// password: "root",
// database: "api",
//});

// FIXME: change database configs
const poolwrite = require("knex")({
  client: "mysql",
  connection: {
    host: "124.71.134.211",
    port: "3333",
    user: "root",
    password: "password",
    database: "api",
  },
});
const poolread = require("knex")({
  client: "mysql",
  connection: {
    host: "124.71.134.211",
    port: "3334",
    user: "root",
    password: "password",
    database: "api",
  },
});

module.exports = {
  poolwrite,
  poolread,
};
