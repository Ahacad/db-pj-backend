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

// get a post and its replies (together called a thread) by post id
const getThreadById = async (req, resp) => {
  const client = await pool.connect();
  const postId = parseInt(req.params.id, 10);
  try {
    // TODO select post and replise
    const res = [];
    const post = (
      await client.query(
        'SELECT posts.*, contents.content FROM posts, contents WHERE posts.content_id = contents.id AND posts.id = $1',
        [postId],
      )
    ).rows[0];
    const replies = (
      await client.query(
        'SELECT replies.*, contents.content FROM replies, contents WHERE replies.post_id = $1 AND replies.content_id = contents.id',
        [postId],
      )
    ).rows;

    res.push(post);
    replies.forEach((reply) => {
      res.push(reply);
    });
    resp.status(200).json(res);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

const deletePost = async (req, resp) => {
  const { userId, postId } = req.body;

  const client = await pool.connect();
  try {
    const userType = await client.query(
      'SELECT user_type FROM users WHERE id = $1;',
      [userId],
    );
    if (userType === 0) {
      // admin
      const repliesContentId = await client.query(
        'DELETE FROM replies WHERE post_id = $1 RETURNING content_id;',
        [postId],
      );
      repliesContentId.rows.forEach(async (replyContentId) => {
        await client.query('DELETE FROM contents WHERE id = $1;', [
          replyContentId.content_id,
        ]);
      });
      const postContentId = (
        await client.query(
          'DELETE FROM posts WHERE id = $1 RETURNING content_id;',
          [postId],
        )
      ).rows[0].content_id;
      client.query('DELETE FROM contents WHERE id = $1;', [postContentId]);
      resp.status(200).send();
    } else {
      const postUserId = (
        await client.query('SELECT userid FROM posts WHERE id = $1;', [postId])
      ).rows[0].userid;
      if (postUserId === userId) {
        const repliesContentId = await client.query(
          'DELETE FROM replies WHERE post_id = $1 RETURNING content_id;',
          [postId],
        );
        repliesContentId.rows.forEach(async (replyContentId) => {
          await client.query('DELETE FROM contents WHERE id = $1;', [
            replyContentId.content_id,
          ]);
        });
        const postContentId = (
          await client.query(
            'DELETE FROM posts WHERE id = $1 RETURNING content_id;',
            [postId],
          )
        ).rows[0].content_id;
        client.query('DELETE FROM contents WHERE id = $1;', [postContentId]);
        resp.status(200).send();
      } else {
        resp.status(401).json(postUserId);
      }
    }
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

const postsClient = {
  getPosts,
  addPost,
  deletePost,
  getThreadById,
};

module.exports = postsClient;
