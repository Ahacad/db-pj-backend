CREATE TABLE users (
    id SERIAL UNIQUE,
    name varchar(40),
    email varchar(40),
    password varchar(1000) NOT NULL,
    bio varchar(60),
    create_time timestamp NOT NULL,
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
    create_time timestamp NOT NULL,
    replycount int,
    likecount int,
    reply_userid int,
    last_reply_time timestamp,
    content_id int,
    PRIMARY KEY(id),
    FOREIGN KEY(userid) REFERENCES users(id)
    FOREIGN KEY(content_id) REFERENCES contents(id),
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

-- mock data
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test1', 'test1@foo.com', 'test1', '2021-04-04T11:19:57.563Z', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test2', 'test2@foo.com', 'test2', '2021-04-04T11:19:57.563Z', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test3', 'test3@foo.com', 'test3', '2021-04-04T11:19:57.563Z', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test4', 'test4@foo.com', 'test4', '2021-04-04T11:19:57.563Z', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test5', 'test5@foo.com', 'test5', '2021-04-04T11:19:57.563Z', 1);

INSERT INTO contents (content) VALUES ('content1');
INSERT INTO contents (content) VALUES ('content2');
INSERT INTO contents (content) VALUES ('content3');
INSERT INTO contents (content) VALUES ('content4');

INSERT INTO posts (userid, create_time, content_id, title) VALUES (1, '2021-04-04T11:19:57.563Z', 1, 'title1')
INSERT INTO posts (userid, create_time, content_id, title) VALUES (1, '2021-04-04T11:19:57.563Z', 2, 'title2')
INSERT INTO posts (userid, create_time, content_id, title) VALUES (1, '2021-04-04T11:19:57.563Z', 3, 'title3')
INSERT INTO posts (userid, create_time, content_id, title) VALUES (1, '2021-04-04T11:19:57.563Z', 4, 'title4')
