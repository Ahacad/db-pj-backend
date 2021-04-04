const pool = require('../pool');

const addPost = (req, resp) => {
  const { userid, title, content } = req.body;
  const createTime = new Date().toISOString();
  pool
    .connect()
    .then((client) => client
      .query('INSERT INTO contents (content) VALUES ($1) RETURNING id;', [
        content,
      ])
      .then((res) => {
        client.release();
        pool.query(
          'INSERT INTO posts (userid, title, create_time, content_id) VALUES ($1, $2, $3, $4)',
          // TODO: insert into post
        );
      }))
    .catch((err) => {
      console.error(err);
    });
};

const postsClient = { addPost };

module.exports = postsClient;
