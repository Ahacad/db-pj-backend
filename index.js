const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

const db = require("./queries");

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

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
