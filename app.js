const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mountRoutes = require("./routes");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3002");
  next();
});

app.get("/", (req, resp) => {
  resp.json({ info: "Node.js, api" });
});

const db = require("./api");
app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);

//app.listen(port, () => {
//console.log(`app running on port ${port}`);
//});

mountRoutes(app);
module.exports = app;
