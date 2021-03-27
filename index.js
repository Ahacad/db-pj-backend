const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

const options = {
  key: fs.readFileSync(__dirname + "/localhost-key.pem"),
  cert: fs.readFileSync(__dirname + "/localhost.pem"),
};

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

const db = require("./queries");
app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);

//app.listen(port, () => {
//console.log(`app running on port ${port}`);
//});

const server = https.createServer(options, app);
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
