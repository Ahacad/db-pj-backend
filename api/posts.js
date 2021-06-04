const { poolwrite, poolread } = require("../pool");

const addPost = async (req, resp) => {
  const { userId, title, content, departmentId } = req.body;
  const createTime = new Date().toISOString();
  const clientwrite = await poolwrite.connect();
  try {
    const contentId = (
      await clientwrite.query(
        "INSERT INTO contents (content) VALUES ($1) RETURNING id;",
        [content]
      )
    ).rows[0].id;
    const res = await clientwrite.query(
      "INSERT INTO posts (userid, title, create_time, content_id, department_id) VALUES ($1, $2, $3, $4, $5) RETURNING id;",
      [userId, title, createTime, contentId, departmentId]
    );
    resp.status(201).json(`${res.rows}`);
  } catch (err) {
    console.error(err);
    resp.status(400).send();
  } finally {
    client.release();
  }
};

const addReply = async (req, resp) => {
  const postId = parseInt(req.params.id, 10);
  const { userId, content } = req.body;
  const createTime = new Date().toISOString();
  const clientwrite = await poolwrite.connect();
  try {
    const contentId = (
      await clientwrite.query(
        "INSERT INTO contents (content) VALUES ($1) RETURNING id;",
        [content]
      )
    ).rows[0].id;
    const res = await clientwrite.query(
      "INSERT INTO replies (userid, post_id, create_time, content_id) VALUES ($1, $2, $3, $4) RETURNING id;",
      [userId, postId, createTime, contentId]
    );
    await clientwrite.query(
      "UPDATE posts SET replycount = replycount + 1 WHERE id = $1",
      [postId]
    );
    resp.status(201).json(res.rows);
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};

const editReply = async (req, resp) => {
  const { replyId, content } = req.body;
  const clientwrite = await poolwrite.connect();
  const clientread = await poolread.connect();
  try {
    const contentId = (
      await clientread.query("SELECT content_id FROM replies WHERE id = $1;", [
        replyId,
      ])
    ).rows[0].content_id;
    await clientwrite.query("UPDATE replies SET content = $1 WHERE id = $2;", [
      content,
      contentId,
    ]);
    resp.status(200).send();
  } catch (err) {
    console.error(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};

const getPosts = async (req, resp) => {
  const clientread = await poolread.connect();
  try {
    const res = await clientread.query(
      "SELECT posts.*, contents.content, users.name FROM posts, contents, users WHERE posts.content_id = contents.id AND posts.userid = users.id;"
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
  const clientread = await poolread.connect();
  const postId = parseInt(req.params.id, 10);
  try {
    // TODO select post and replise
    const res = [];
    const post = (
      await clientread.query(
        "SELECT posts.*, contents.content FROM posts, contents WHERE posts.content_id = contents.id AND posts.id = $1",
        [postId]
      )
    ).rows[0];
    const replies = (
      await clientread.query(
        "SELECT replies.*, contents.content, users.name FROM replies, contents, users WHERE replies.post_id = $1 AND replies.content_id = contents.id AND replies.userid = users.id;",
        [postId]
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

  const clientread = await poolread.connect();
  const clientwrite = await poolwrite.connect();
  try {
    const userType = await clientread.query(
      "SELECT user_type FROM users WHERE id = $1;",
      [userId]
    );
    if (userType === 0) {
      // admin
      const repliesContentId = await clientwrite.query(
        "DELETE FROM replies WHERE post_id = $1 RETURNING content_id;",
        [postId]
      );
      repliesContentId.rows.forEach(async (replyContentId) => {
        await clientwrite.query("DELETE FROM contents WHERE id = $1;", [
          replyContentId.content_id,
        ]);
      });
      const postContentId = (
        await clientwrite.query(
          "DELETE FROM posts WHERE id = $1 RETURNING content_id;",
          [postId]
        )
      ).rows[0].content_id;
      clientwrite.query("DELETE FROM contents WHERE id = $1;", [postContentId]);
      resp.status(200).send();
    } else {
      const postUserId = (
        await clientread.query("SELECT userid FROM posts WHERE id = $1;", [
          postId,
        ])
      ).rows[0].userid;
      if (postUserId === userId) {
        const repliesContentId = await clientwrite.query(
          "DELETE FROM replies WHERE post_id = $1 RETURNING content_id;",
          [postId]
        );
        repliesContentId.rows.forEach(async (replyContentId) => {
          await clientwrite.query("DELETE FROM contents WHERE id = $1;", [
            replyContentId.content_id,
          ]);
        });
        const postContentId = (
          await clientwrite.query(
            "DELETE FROM posts WHERE id = $1 RETURNING content_id;",
            [postId]
          )
        ).rows[0].content_id;
        clientwrite.query("DELETE FROM contents WHERE id = $1;", [
          postContentId,
        ]);
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

const likePost = async (req, resp) => {
  const postId = parseInt(req.params.id, 10);
  const { userId } = req.body;
  const clientwrite = await poolwrite.connect();
  try {
    await Promise.all([
      clientwrite.query(
        "UPDATE posts SET likecount = likecount + 1 WHERE id = $1",
        [postId]
      ),
      clientwrite.query(
        "INSERT INTO post_likes (userid, postid) VALUES ($1, $2)",
        [userId, postId]
      ),
    ]);
    resp.status(200).send();
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};

const likeReply = async (req, resp) => {
  const { replyId, userId } = req.body;
  const clientwrite = await poolwrite.connect();
  try {
    await Promise.all([
      clientwrite.query(
        "UPDATE replies SET likecount = likecount + 1 WHERE id = $1",
        [replyId]
      ),
      clientwrite.query(
        "INSERT INTO reply_likes (userid, replyid) VALUES ($1, $2);",
        [userId, replyId]
      ),
    ]);
    resp.status(200).send();
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};
const unlikeReply = async (req, resp) => {
  const { replyId, userId } = req.body;
  const clientwrite = await poolwrite.connect();
  try {
    await Promise.all([
      clientwrite.query(
        "UPDATE replies SET likecount = likecount - 1 WHERE id = $1;",
        [replyId]
      ),
      clientwrite.query(
        "DELETE FROM reply_likes WHERE userid = $1 AND replyid = $2;",
        [userId, replyId]
      ),
    ]);
    resp.status(200).send();
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};
const unlikePost = async (req, resp) => {
  const postId = parseInt(req.params.id, 10);
  const { userId } = req.body;
  const clientwrite = await poolwrite.connect();
  try {
    await Promise.all([
      clientwrite.query(
        "UPDATE posts SET likecount = likecount - 1 WHERE id = $1;",
        [postId]
      ),
      clientwrite.query(
        "DELETE FROM post_likes WHERE userid = $1 AND postid = $2;",
        [userId, postId]
      ),
    ]);
    resp.status(200).send();
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  } finally {
    client.release();
  }
};

const deleteReply = async (req, resp) => {
  const postId = parseInt(req.params.id, 10);
  const { replyId } = req.body;
  const clientwrite = await poolwrite.connect();
  try {
    const contentId = (
      await clientwrite.query(
        "DELETE FROM replies WHERE id = $1 RETURNING content_id;",
        [replyId]
      )
    ).rows[0].content_id;
    await Promise.all([
      clientwrite.query("DELETE FROM contents WHERE id = $1", [contentId]),
      clientwrite.query(
        "UPDATE posts SET replycount = replycount - 1 WHERE id = $1",
        [postId]
      ),
    ]);
    resp.status(200).json({ replyId, contentId, message: "DELETED" });
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
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
  addReply,
  editReply,
  likePost,
  likeReply,
  unlikePost,
  unlikeReply,
  deleteReply,
};

module.exports = postsClient;
