const { Pool } = require('pg');

const pool = new Pool({
  user: 'ahacad',
  password: 'root',
  host: 'localhost',
  database: 'api',
  port: 5432,
});

const getUsers = (req, resp) => {
  pool.query('SELECT * FROM user ORDER BY id ASC', (err, res) => {
    if (err) {
      console.error(err);
    }
    resp.status(200).json(res.rows);
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

const createUser = (req, resp) => {
  const {
    name, password, email, createTime,
  } = req.body;
  pool.query(
    'INSERT INTO user (name, email, password, create_time) VALUES ($1, $2, $3, $4)',
    // TODO: salt password
    [name, email, password, createTime],
    (err, res) => {
      if (err) {
        console.error(err);
      }
      resp.status(201).send('user inserted');
    },
  );
};

const updateUser = (req, resp) => {
  const id = parseInt(req.params.id, 10);
  const { name, bio } = req.body;
  pool.query('UPDATE user SET name = $1, bio = $2', [name, bio], (err, res) => {
    if (err) {
      console.error(err);
    }
    resp.status(200).send(`user ${id} info updated`);
  });
};

const deleteUser = (req, resp) => {
  const id = parseInt(req.params.id, 10);

  pool.query('DELETE FROM user WHERE id = $1', [id], (err, res) => {
    if (err) {
      console.error(err);
    }
    resp.status(200).send(`User deleted, id: ${id}`);
  });
};

const usersClient = {
  getUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};

module.exports = usersClient;
