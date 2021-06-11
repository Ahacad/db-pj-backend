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
const poolread = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "ahacad",
    password: "mysql",
    database: "foo",
  },
});
const poolwrite = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "ahacad",
    password: "mysql",
    database: "foo",
  },
});

module.exports = {
  poolwrite,
  poolread,
};
