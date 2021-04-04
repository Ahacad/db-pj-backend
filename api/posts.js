const pool = require('../pool');

const addPost = async (req, resp) => {
  const { userId, title, content } = req.body;
  const createTime = new Date().toISOString();
  const client = await pool.connect();
  try {
    const contentId = (
      await client.query(
        'INSERT INTO contents (content) VALUES ($1) RETURNING id;',
        [content],
      )
    ).rows[0].id;
    const res = await client.query(
      'INSERT INTO posts (userid, title, create_time, content_id) VALUES ($1, $2, $3, $4) RETURNING id;',
      [userId, title, createTime, contentId],
    );
    resp.status(201).send(`${res.rows}`);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

const getPosts = async (req, resp) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT posts.*, contents.content, users.name FROM posts, contents, users WHERE posts.content_id = contents.id AND posts.userid = users.id;',
    );

    resp.status(200).json(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

// TODO: deletePost api

// FIXME: delete this part after finishing api
// const client = await pool.connect();
// try {
// } catch (err) {
// console.error(err);
// } finally {
// client.release();
// }

const postsClient = { getPosts, addPost };

module.exports = postsClient;
