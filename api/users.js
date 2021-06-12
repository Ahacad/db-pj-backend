const crypto = require('crypto');
const {poolwrite, poolread} = require('../pool');

// const salt = crypto.randomBytes(16).toString('hex');
// TODO: change salt to rnadom string or secret in runtime
const salt = 'helloworld';

const getUsers = (_, resp) => {
    try {
        const res = await poolread('users').orderby('id').select('*');
        resp.status(200).json(res);
    } catch (err) {
        console.error(err);
    }
};

const login = (req, resp) => {
    const {email, password} = req.body;
    const saltedPassword =
        crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    try {
        const res = await poolread(users).where('email', email).select('*');
        if (res[0] === undefined) {
            resp.status(404).send('user not found');
        } else if (res[0].password !== saltedPassword) {
            console.log(res[0]);
            resp.status(403).send('password wrong');
        } else {
            resp.status(200).send(res[0]);
        }

    } catch (err) {
        console.error(err)
    }
};

const createUser = async (req, resp) => {
    const {name, password, email} = req.body;
    const createTime = new Date().toISOString();
    const saltedPassword =
        crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    // TODO: there can only be one distinct email in database
    try {
        const res = poolwrite('users').insert({
            name,
            email,
            password: saltedPassword,
            create_time: createTime,
            user_type: 1,
        })
        resp.status(201).json('inserted');
    } catch (err) {
        console.error(err);
        resp.status(400).send();
    }
};

const updateUser = (req, resp) => {
    const id = parseInt(req.params.id, 10);
    const {name, bio} = req.body;
    if (name === undefined || bio === undefined) {
        resp.status(400).send('cannot have empty name or bio');
        return;
    }
    try {
        poolwrite('users').where('id', id).update({
            name,
            bio,
        })
        resp.status(200).send(`${res.rows}`);
    } catch (err) {
        console.error(err)
    }
};

const deleteUser = (req, resp) => {
    const id = parseInt(req.params.id, 10);

    try {
        poolwrite('users').where('id', id).del();
        resp.status(200).send(`deleted`);
    } catch (err) {
        console.error(err);
    };
};

const getLikedPosts = async (req, resp) => {
    const userId = parseInt(req.params.id, 10);
    try {
        const queries =
            await poolread('post_likes').where('userid', userId).select('*');

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
    const client = await poolread.connect();
    const userId = parseInt(req.params.id, 10);
    try {
        const queries =
            await poolread('reply_likes').where('userid', userId).select('*');
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
    const {userId, bio} = req.body;
    try {
        await poolwrite('users').where('id', userId).update({bio})
        resp.status(200).send();
    } catch (err) {
        console.trace(err);
        resp.status(400).send(err);
    }
};
const getPosts = async (req, resp) => {
    const userId = parseInt(req.params.id, 10);
    try {
        const res = await poolread('posts')
                        .join('users', 'posts.userid', 'users.id')
                        .where('users.id', userId)
                        .select('posts.*')

        resp.status(200).json(res);
    } catch (err) {
        console.trace(err);
        resp.status(400).send(err);
    }
};
const getReplies = async (req, resp) => {
    const userId = parseInt(req.params.id, 10);
    try {
        const res = await poolread('replies')
                        .join('users', 'replies.userid', 'users.id')
                        .where('users.id', userId)
                        .select('replies.*');

        resp.status(200).json(res);
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
