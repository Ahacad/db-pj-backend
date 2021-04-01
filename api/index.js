const { Pool } = require("pg");
const pool = new Pool({
  user: "ahacad",
  password: "root",
  host: "localhost",
  database: "api",
  port: 5432,
});
const { authClient } = require("./users");

module.exports = {
  authClient,
};
