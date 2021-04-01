const getUsers = (req, resp) => {
  pool.query("SELECT * FROM user ORDER BY id ASC", (err, res) => {
    if (err) {
      throw err;
    }
    resp.status(200).json(res.rows);
  });
};

const getUserById = (req, resp) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM user WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    resp.status(200).json(res.rows);
  });
};

const getUserByName = (req, resp) => {
  const name = req.params.name;

  pool.query("SELECT * FROM user WHERE name = $1", [name], (err, res) => {
    if (err) {
      throw err;
    }
    resp.status(200).json(res.rows);
  });
};

const getUserByEmail = (req, resp) => {
  const email = req.params.email;
  pool.query("SELECT * FROM user WHERE email = $1", [email], (err, res) => {
    if (err) {
      throw err;
    }
    resp.status(200).json(res.rows);
  });
};

const createUser = (req, resp) => {
  const { name, password, email, create_time } = req.body;
  pool.query(
    "INSERT INTO user (name, email, password, create_time) VALUES ($1, $2, $3, $4)",
    // TODO: salt password
    [name, email, password, create_time],
    (err, res) => {
      if (err) {
        throw err;
      }
      resp.status(201).send(`user inserted, id: ${res.insertId}`);
    }
  );
};

const updateUser = (req, resp) => {
  const id = parseInt(request.params.id);
  const { name, bio } = request.body;
  pool.query(
    "UPDATE user SET name = $1, bio = $2",
    [name, bio],
    (err, resp) => {
      if (err) {
        throw err;
      }
      resp.status(200).send(`user ${id} info updated`);
    }
  );
};

const deleteUser = (req, resp) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM user WHERE id = $1", [id], (err, res) => {
    if (err) {
      throw err;
    }
    resp.status(200).send(`User deleted, id: ${id}`);
  });
};

const authClient = {
  getUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};

module.exports = authClient;
