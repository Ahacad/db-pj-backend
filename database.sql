CREATE TABLE users (
    id SERIAL UNIQUE,
    name varchar(40),
    email varchar(40),
    password varchar(1000) NOT NULL,
    bio varchar(60),
    create_time timestamp,
    user_type smallint,
    PRIMARY KEY(id)
);

CREATE TABLE contents (
    id SERIAL UNIQUE, 
    content varchar(10000),
    PRIMARY KEY(id)
);

CREATE TABLE posts (
    id SERIAL UNIQUE,
    userid int,
    title varchar(60),
    create_time timestamp,
    replycount int,
    likecount int,
    reply_userid int,
    last_reply_time timestamp,
    content_id int,
    PRIMARY KEY(id),
    FOREIGN KEY(content_id) REFERENCES contents(id),
    FOREIGN KEY(userid) REFERENCES users(id)
);


CREATE TABLE replies (
    id SERIAL UNIQUE,
    userid int,
    post_id int,
    reply_time timestamp,
    likecount int,
    content_id int,
    PRIMARY KEY(id),
    FOREIGN KEY(content_id) REFERENCES contents(id),
    FOREIGN KEY(post_id) REFERENCES posts(id)
);
