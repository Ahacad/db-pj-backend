const crypto = require('crypto');
const pool = require('../pool');

// const salt = crypto.randomBytes(16).toString('hex');
// TODO: change salt to rnadom string or secret in runtime
const salt = 'helloworld';

// TODO: rewrite and test all connections using pooling clientss

const getUsers = (req, resp) => {
  pool
    .connect()
    .then((client) => client.query('SELECT * FROM users ORDER BY id ASC').then((res) => {
      client.release();
      resp.status(200).json(res.rows);
    }))
    .catch((err) => {
      console.error(err);
    });
};

const getUserById = (req, resp) => {
  const id = parseInt(req.params.id, 10);

  pool.query('SELECT * FROM user WHERE id = $1', [id], (err, res) => {
    if (err) {
      console.error(err);
    }
    resp.status(200).json(res.rows);
  });
};

const getUserByName = (req, resp) => {
  const { name } = req.params;

  pool.query('SELECT * FROM user WHERE name = $1', [name], (err, res) => {
    if (err) {
      console.error(err);
    }
    resp.status(200).json(res.rows);
  });
};

const getUserByEmail = (req, resp) => {
  const { email } = req.params;
  pool.query('SELECT * FROM user WHERE email = $1', [email], (err, res) => {
    if (err) {
      console.error(err);
    }
    resp.status(200).json(res.rows);
  });
};

const login = (req, resp) => {
  const { email, password } = req.body;
  const saltedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, res) => {
    if (err) {
      console.error(err);
    }
    if (res.rows[0] === undefined) {
      resp.status(404).send('user not found');
      // TODO: test manually
    } else if (res.rows[0].password !== saltedPassword) {
      console.log(res.rows[0]);
      resp.status(403).send('password wrong');
    } else {
      resp.status(200).send(res.rows[0]);
    }
  });
};

const createUser = (req, resp) => {
  const { name, password, email } = req.body;
  const createTime = new Date().toISOString();
  const saltedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  // TODO: one email only
  pool.query(
    'INSERT INTO users (name, email, password, create_time) VALUES ($1, $2, $3, $4) RETURNING id;',
    [name, email, saltedPassword, createTime],
    (err, res) => {
      if (err) {
        console.error(err);
      }
      resp.status(201).json(res.rows[0]);
    },
  );
};

const updateUser = (req, resp) => {
  const id = parseInt(req.params.id, 10);
  const { name, bio } = req.body;
  if (name === undefined || bio === undefined) {
    resp.status(400).send('cannot have empty name or bio');
    return;
  }
  pool.query(
    'UPDATE users SET name = $1, bio = $2 WHERE id = $3;',
    [name, bio, id],
    (err, res) => {
      if (err) {
        console.error(err);
      }
      resp.status(200).send(`user ${id} info updated`);
    },
  );
};

const deleteUser = (req, resp) => {
  const id = parseInt(req.params.id, 10);

  pool.query('DELETE FROM users WHERE id = $1;', [id], (err, res) => {
    if (err) {
      console.error(err);
    }
    resp.status(200).send(`user deleted, id: ${id}`);
  });
};

const usersClient = {
  getUsers,
  getUserByEmail,
  login,
  createUser,
  updateUser,
  deleteUser,
};

module.exports = usersClient;
