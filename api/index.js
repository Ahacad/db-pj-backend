const { Pool } = require("pg");
const pool = new Pool({
  user: "ahacad",
  host: "localhost",
  database: "api",
  port: 5432,
});
const { authClient } = require("./users");

module.exports = {
  authClient,
};
