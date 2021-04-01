CREATE TABLE users (
    id SERIAL UNIQUE,
    name varchar(40),
    email varchar(40),
    password varchar(64),
    bio varchar(60),
    create_at datetime,
    PRIMARY KEY(id)
);

CREATE TABLE posts (
    id int,
    userid int,
    title varchar(60),
    create_time datetime,
    replycount int,
    likecount int,
    reply_userid int,
    last_reply_time datetime
);

CREATE TABLE contents (
    id int, 
    content varchar(10000)
);

CREATE TABLE replies (
    id int,
    userid int,
    post_id int,
    reply_time datetime,
    likecount int
);
