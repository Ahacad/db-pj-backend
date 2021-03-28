const getUsers = (req, resp) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (err, res) => {
    if (err) {
      throw err;
    }
    resp.status(200).json(res.rows);
  });
};

const getUserById = (req, resp) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    resp.status(200).json(res.rows);
  });
};

const getUserByName = (req, resp) => {
  const name = req.params.name;

  pool.query("SELECT * FROM users WHERE name = $1", [name], (err, res) => {
    if (err) {
      throw err;
    }
    resp.status(200).json(res.rows);
  });
};

const createUser = (req, resp) => {
  const { name, email } = req.body;
  pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    [name, email],
    (err, res) => {
      if (err) {
        throw err;
      }
      resp.status(201).send(`user inserted, id: ${res.insertId}`);
    }
  );
};

const deleteUser = (req, resp) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    resp.status(200).send(`User deleted, id: ${id}`);
  });
};

const authClient = {
  getUsers,
  getUserById,
  getUserByName,
  createUser,
  deleteUser,
};

module.exports = authClient;
