const { poolwrite, poolread } = require("../pool");

const addPost = async (req, resp) => {
  const { userId, title, content, departmentId } = req.body;
  const createTime = new Date().toISOString();
  try {
    const [contentId] = await poolwrite("contents").insert({
      content,
    });

    const res = await poolwrite("posts").insert({
      userid: userId,
      title,
      create_time: createTime,
      content_id: contentId,
      department_id: departmentId,
    });

    resp.status(201).json(res);
  } catch (err) {
    console.error(err);
    resp.status(400).send();
  }
};

const addReply = async (req, resp) => {
  const postId = parseInt(req.params.id, 10);
  const { userId, content } = req.body;
  const createTime = new Date().toISOString();
  try {
    const [contentId] = await poolwrite("contents").insert({
      content,
    });
    const res = await poolwrite("replies").insert({
      userid: userId,
      post_id: postId,
      create_time: createTime,
      content_id: contentId,
    });
    const [tmp] = await poolread("posts")
      .where("id", postId)
      .select("replycount");
    await poolwrite.where("id", postId).update({
      replycount: tmp.replycount + 1,
    });

    resp.status(201).json(res);
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  }
};

const editReply = async (req, resp) => {
  const { replyId, content } = req.body;
  try {
    const contentId = (
      await poolread("relies").where("id", replyId).select("content_id")
    )[0].content_id;
    await poolwrite("replies").where("id", contentId).update({
      content,
    });
    resp.status(200).send();
  } catch (err) {
    console.error(err);
    resp.status(400).send(err);
  }
};

const getPosts = async (req, resp) => {
  try {
    const res = await poolread("posts")
      .join("contents", "posts.content_id", "contents.id")
      .join("users", "posts.userid", "users.id")
      .select("posts.*", "contents.content", "users.name");

    resp.status(200).json(res);
  } catch (err) {
    console.error(err);
  }
};

// get a post and its replies (together called a thread) by post id
const getThreadById = async (req, resp) => {
  const postId = parseInt(req.params.id, 10);
  try {
    // TODO select post and replise

    const res = [];
    const [post] = await poolread("posts")
      .join("contents", "posts.content_id", "posts.id")
      .where("posts.id", postId)
      .select("posts.*", "contents.content");

    const replies = await poolread("replies")
      .join("contents", "replies.content_id", "contents.id")
      .join("users", "replies.userid", "users.id")
      .where("replies.post_id", postId)
      .select("replies.*", "contents.content", "users.name");

    res.push(post);
    replies.forEach((reply) => {
      res.push(reply);
    });
    resp.status(200).json(res);
  } catch (err) {
    console.error(err);
  }
};

const deletePost = async (req, resp) => {
  const { userId, postId } = req.body;

  try {
    const userType = (
      await poolread("users").where("id", userId).select("user_type")
    )[0].user_type;

    if (userType === 0) {
      // admin
      const repliesContentId = await poolwrite("replies")
        .where("post_id", postId)
        .del();

      // FIXME: logic error here, repliesContentId not array by knex
      // FIXME: logic error here, knex del only returns number of items
      // deleted
      await repliesContentId.forEach((replyContentId) => {
        poolwrite("contents").where("id", replyContentId).del();
      });

      const postContentId = await poolwrite("posts").where("id", postId).del();

      await poolwrite("contents").where("id", postContentId).del();
      resp.status(200).send();
    } else {
      const postUserId = (
        await poolread("posts").where("id", postId).select("userid")
      )[0].userid;

      if (postUserId === userId) {
        const repliesContentId = await poolwrite("replies")
          .where("post_id", postId)
          .del();
        await repliesContentId.forEach((replyContentId) => {
          // FIXME: logic error here, repliesContentId not array by
          // knex
          poolwrite("contents").where("id", replyContentId).del();
        });

        const postContentId = await poolwrite("posts")
          .where("id", postId)
          .del();
        await poolwrite("contents").where("id", postContentId).del();
        resp.status(200).send();
      } else {
        resp.status(401).json(postUserId);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const likePost = async (req, resp) => {
  const postId = parseInt(req.params.id, 10);
  const { userId } = req.body;
  try {
    await Promise.all([
      async () => {
        const likes = (
          await poolread("posts").where("id", postId).select("likecount")
        )[0].likecount;
        poolwrite("posts")
          .where("id", postId)
          .update({
            likecount: likes + 1,
          });
      },
      poolwrite("post_likes").insert({
        userid: userId,
        postid: postId,
      }),
    ]);
    resp.status(200).send();
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  }
};

const likeReply = async (req, resp) => {
  const { replyId, userId } = req.body;
  try {
    await Promise.all([
      async () => {
        const likes = (
          await poolread("replies").where("id", replyId).select("likecount")
        )[0].likecount;
        poolwrite("replies")
          .where("id", replyId)
          .update({
            likecount: likes + 1,
          });
      },
      poolwrite("reply_likes").insert({
        userid: userId,
        replyid: replyId,
      }),
    ]);
    resp.status(200).send();
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  }
};
const unlikeReply = async (req, resp) => {
  const { replyId, userId } = req.body;
  try {
    await Promise.all([
      async () => {
        const likes = (
          await poolread("replies").where("id", replyId).select("likecount")
        )[0].likecount;
        poolwrite("replies")
          .where("id", replyId)
          .update({
            likecount: likes - 1,
          });
      },
      poolwrite("reply_likes")
        .where({ userid: userId, replyid: replyId })
        .del(),
    ]);

    resp.status(200).send();
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  }
};
const unlikePost = async (req, resp) => {
  const postId = parseInt(req.params.id, 10);
  const { userId } = req.body;
  try {
    await Promise.all([
      async () => {
        const likes = (
          await poolread("posts").where("id", replyId).select("likecount")
        )[0].likecount;
        poolwrite("posts")
          .where("id", postId)
          .update({
            likecount: likes - 1,
          });
      },
      poolwrite("post_likes").where({ userid: userId, postid: postId }).del(),
    ]);

    resp.status(200).send();
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
  }
};

const deleteReply = async (req, resp) => {
  const postId = parseInt(req.params.id, 10);
  const { replyId } = req.body;
  try {
    const contentId = (
      await poolread("replies").where("id", replyId).select("content_id")
    )[0].content_id;
    poolwrite("replies").where("id", replyId).del();

    await Promise.all([
      poolwrite("contents").where("id", contentId).del(),
      async () => {
        const replies = (
          await poolread("posts").where("id", postId).select("replycount")
        )[0].replycount;
        poolwrite("posts")
          .where("id", postId)
          .update({
            replycount: replies - 1,
          });
      },
    ]);
    resp.status(200).json({ replyId, contentId, message: "DELETED" });
  } catch (err) {
    console.trace(err);
    resp.status(400).send(err);
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
