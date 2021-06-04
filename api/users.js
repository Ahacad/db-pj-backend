const crypto = require("crypto");
const { pool } = require("../pool");

// const salt = crypto.randomBytes(16).toString('hex');
// TODO: change salt to rnadom string or secret in runtime
const salt = "helloworld";

const getUsers = (_, resp) => {
  pool
    .connect()
    .then((client) =>
      client.query("SELECT * FROM users ORDER BY id ASC").then((res) => {
        client.release();
        resp.status(200).json(res.rows);
      })
    )
    .catch((err) => {
      console.error(err);
    });
};

const login = (req, resp) => {
  const { email, password } = req.body;
  const saltedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  pool
    .connect()
    .then((client) =>
      client
        .query("SELECT * FROM users WHERE email = $1", [email])
        .then((res) => {
          client.release();
          if (res.rows[0] === undefined) {
            resp.status(404).send("user not found");
            // TODO: test manually
          } else if (res.rows[0].password !== saltedPassword) {
            console.log(res.rows[0]);
            resp.status(403).send("password wrong");
          } else {
            resp.status(200).send(res.rows[0]);
          }
        })
    )
    .catch((err) => {
      console.error(err);
    });
};

const createUser = async (req, resp) => {
  const { name, password, email } = req.body;
  const createTime = new Date().toISOString();
  const saltedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  // TODO: there can only be one distinct email in database
  const client = await pool.connect();
  try {
    const res = await client.query(
      "INSERT INTO users (name, email, password, create_time, user_type) VALUES ($1, $2, $3, $4, 1) RETURNING id;",
      [name, email, saltedPassword, createTime]
    );
    resp.status(201).json(res.rows);
  } catch (err) {
    console.error(err);
    resp.status(400).send();
  } finally {
    client.release();
  }
};

const updateUser = (req, resp) => {
  const id = parseInt(req.params.id, 10);
  const { name, bio } = req.body;
  if (name === undefined || bio === undefined) {
    resp.status(400).send("cannot have empty name or bio");
    return;
  }
  pool
    .connect()
    .then((client) =>
      client
        .query(
          "UPDATE users SET name = $1, bio = $2 WHERE id = $3 RETURNING id;",
          [name, bio, id]
        )
        .then((res) => {
          client.release();
          resp.status(200).send(`${res.rows}`);
        })
    )
    .catch((err) => {
      console.error(err);
    });
};

const deleteUser = (req, resp) => {
  const id = parseInt(req.params.id, 10);

  pool
    .connect()
    .then((client) =>
      client
        .query("DELETE FROM users WHERE id = $1 RETURNING id;", [id])
        .then((res) => {
          client.release();
          resp.status(200).send(`${res.rows}`);
        })
    )
    .catch((err) => {
      console.error(err);
    });
};

const getLikedPosts = async (req, resp) => {
  const client = await pool.connect();
  const userId = parseInt(req.params.id, 10);
  try {
    const queries = (
      await client.query("SELECT * FROM post_likes WHERE userid = $1", [userId])
    ).rows;
    const res = [];
    queries.forEach((query) => {
      res.push(query.postid);
    });
    resp.status(200).json(res);
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};

const getLikedReplies = async (req, resp) => {
  const client = await pool.connect();
  const userId = parseInt(req.params.id, 10);
  try {
    const queries = (
      await client.query("SELECT * FROM reply_likes WHERE userid = $1", [
        userId,
      ])
    ).rows;
    const res = [];
    queries.forEach((query) => {
      res.push(query.replyid);
    });
    resp.status(200).json(res);
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};
const edit = async (req, resp) => {
  const { userId, bio } = req.body;
  const client = await pool.connect();
  try {
    await client.query("UPDATE users SET bio = $1 WHERE id = $2;", [
      bio,
      userId,
    ]);
    resp.status(200).send();
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};
const getPosts = async (req, resp) => {
  const userId = parseInt(req.params.id, 10);
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT posts.* FROM posts, users WHERE posts.userid = users.id AND users.id = $1",
      [userId]
    );
    resp.status(200).json(res.rows);
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};
const getReplies = async (req, resp) => {
  const userId = parseInt(req.params.id, 10);
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT replies.* FROM replies, users WHERE replies.userid = users.id AND users.id = $1",
      [userId]
    );
    resp.status(200).json(res.rows);
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};

// const getUserByEmail = (req, resp) => {
// const { email } = req.params;
// pool
// .connect()
// .then((client) => client
// .query('SELECT * FROM user WHERE email = $1', [email])
// .then((res) => {
// client.release();
// resp.status(200).json(res.rows);
// }))
// .catch((err) => {
// console.error(err);
// });
// };

// const getUserById = (req, resp) => {
// const id = parseInt(req.params.id, 10);
// pool
// .connect()
// .then((client) => client.query('SELECT * FROM user WHERE id = $1',
// [id]).then((res) => { client.release(); resp.status(200).json(res.rows);
// }))
// .catch((err) => {
// console.error(err);
// });
// };

// const getUserByName = (req, resp) => {
// const { name } = req.params;
// pool
// .connect()
// .then((client) => client.query('SELECT * FROM user WHERE name = $1',
// [name]).then((res) => { client.release(); resp.status(200).json(res.rows);
// }))
// .catch((err) => {
// console.error(err);
// });
// };

const usersClient = {
  createUser,
  login,
  edit,
  updateUser,
  deleteUser,
  getUsers,
  getLikedPosts,
  getLikedReplies,
  getPosts,
  getReplies,
};

module.exports = usersClient;
