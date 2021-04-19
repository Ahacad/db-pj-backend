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

-- user_type: 0 admin, 1 user

CREATE TABLE contents (
    id SERIAL UNIQUE, 
    content varchar(10000),
    PRIMARY KEY(id)
);

CREATE TABLE posts (
    id SERIAL UNIQUE,
    userid int,
    title varchar(200),
    create_time timestamp NOT NULL,
    replycount int,
    likecount int,
    reply_userid int,
    last_reply_time timestamp,
    content_id int,
    PRIMARY KEY(id),
    FOREIGN KEY(userid) REFERENCES users(id),
    FOREIGN KEY(content_id) REFERENCES contents(id)
);


CREATE TABLE replies (
    id SERIAL UNIQUE,
    userid int,
    post_id int,
    create_time timestamp,
    likecount int,
    content_id int,
    PRIMARY KEY(id),
    FOREIGN KEY(content_id) REFERENCES contents(id),
    FOREIGN KEY(post_id) REFERENCES posts(id)
);

-- mock data

-- users
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test1', 'test1@foo.com', '5cd9c504f153b87f33ec38a69f7c36f175ff452b705dc72a5906f7bd0a1d138c777923200341a0ef03c55c86fb8ebe08df26dec9084f3b722e4318f1c8b8f1e2', '2021-04-04T11:19:57.563Z', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test2', 'test2@foo.com', '38b2d4bb61258c4a5646887f65b3f7c3ae2412812a735801edcf003ae41f7a3f943ea5adc105e0bac96f5a1cc490329889fcd6204568211221d490b849e52ec4', '2021-04-04T11:19:57.563Z', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test3', 'test3@foo.com', '35c403d3d680075ade37cf89d61e5ad4a5ba0314d84708d7d473ddcd7aa7b4eabed67ea7b4b6bd7e34636133d7169cee6759a966754b835b912cdbb7145d483d', '2021-04-04T11:19:57.563Z', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test4', 'test4@foo.com', '6fc584b985ef4eb261295a15610207a7a81a072a35371cb0e1728cb62661f0b8a64d251602feca0b8ff63a857ce7e76666beba842287166ac8f07da2a92462fd', '2021-04-04T11:19:57.563Z', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test5', 'test5@foo.com', '83d251a1f94b5ca97cb6169bb39f851a2efed29b312aa8f40b97ff106518f16d90a25346d0600e24795765227e1c430c027a56143e4c621cdbc04401c628d635', '2021-04-04T11:19:57.563Z', 1);

-- contents
INSERT INTO contents (content) VALUES ('content1');
INSERT INTO contents (content) VALUES ('content2');
INSERT INTO contents (content) VALUES ('content3');
INSERT INTO contents (content) VALUES ('content4');

INSERT INTO contents (content) VALUES ('reply1');
INSERT INTO contents (content) VALUES ('reply2');
INSERT INTO contents (content) VALUES ('reply3');
INSERT INTO contents (content) VALUES ('reply4');

-- posts
INSERT INTO posts (userid, create_time, content_id, title) VALUES (1, '2021-04-04T11:19:57.563Z', 1, 'What does “>_” mean in run command?');
INSERT INTO posts (userid, create_time, content_id, title) VALUES (1, '2021-04-04T11:19:57.563Z', 2, 'Sourcing bash file to set environment variables (Linux)');
INSERT INTO posts (userid, create_time, content_id, title) VALUES (1, '2021-04-04T11:19:57.563Z', 3, 'Help me please with ” Association Rule (Apriori algorithm) ” in Python');
INSERT INTO posts (userid, create_time, content_id, title) VALUES (1, '2021-04-04T11:19:57.563Z', 4, 'Help regarding Discord Bot cloning (Beginner)');

-- replies
INSERT INTO replies (userid, post_id, create_time, likecount, content_id) VALUES (1, 1, '2021-04-04T11:19:57.563Z', 1, 5);
INSERT INTO replies (userid, post_id, create_time, likecount, content_id) VALUES (1, 1, '2021-04-04T11:19:57.563Z', 1, 6);
INSERT INTO replies (userid, post_id, create_time, likecount, content_id) VALUES (1, 2, '2021-04-04T11:19:57.563Z', 1, 7);
INSERT INTO replies (userid, post_id, create_time, likecount, content_id) VALUES (1, 2, '2021-04-04T11:19:57.563Z', 1, 8);
