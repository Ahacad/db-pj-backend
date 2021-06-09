CREATE TABLE users (
    id int UNIQUE AUTO_INCREMENT,
    name varchar(40) NOT NULL,
    email varchar(40) NOT NULL,
    password varchar(1000) NOT NULL,
    bio varchar(60) DEFAULT '',
    create_time timestamp NOT NULL,
    user_type smallint NOT NULL,
    PRIMARY KEY(id)
);

-- user_type: 0 admin, 1 user

CREATE TABLE contents (
    id int UNIQUE AUTO_INCREMENT, 
    content varchar(10000),
    PRIMARY KEY(id)
);

CREATE TABLE departments ( 
    id int UNIQUE AUTO_INCREMENT, 
    name varchar(200),
    description varchar(2000),
    PRIMARY KEY(id)
);

CREATE TABLE posts (
    id int UNIQUE AUTO_INCREMENT, 
    userid int NOT NULL,
    title varchar(200) NOT NULL,
    create_time timestamp NOT NULL,
    replycount int DEFAULT 0,
    likecount int DEFAULT 0,
    reply_userid int,
    last_reply_time timestamp ,
    content_id int NOT NULL,
    department_id int NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userid) REFERENCES users(id),
    FOREIGN KEY(content_id) REFERENCES contents(id),
    FOREIGN KEY(department_id) REFERENCES departments(id)
);


CREATE TABLE replies (
    id int UNIQUE AUTO_INCREMENT, 
    userid int NOT NULL,
    post_id int NOT NULL,
    create_time timestamp NOT NULL,
    likecount int DEFAULT 0,
    content_id int NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(content_id) REFERENCES contents(id),
    FOREIGN KEY(post_id) REFERENCES posts(id)
);
CREATE TABLE post_likes (
    id int UNIQUE AUTO_INCREMENT, 
    userid int NOT NULL,
    postid int NOT NULL,
    UNIQUE(userid, postid),
    PRIMARY KEY(id),
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);
CREATE TABLE reply_likes (
    id int UNIQUE AUTO_INCREMENT, 
    userid int NOT NULL,
    replyid int NOT NULL,
    UNIQUE(userid, replyid),
    PRIMARY KEY(id),
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (replyid) REFERENCES replies(id)
);

-- mock data

-- users
INSERT INTO users (name, email, password, create_time, user_type, bio) VALUES ('test1', 'test1@foo.com', '5cd9c504f153b87f33ec38a69f7c36f175ff452b705dc72a5906f7bd0a1d138c777923200341a0ef03c55c86fb8ebe08df26dec9084f3b722e4318f1c8b8f1e2', '2020-01-01 10:10:10', 1, 'I am an awesome man!');
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test2', 'test2@foo.com', '38b2d4bb61258c4a5646887f65b3f7c3ae2412812a735801edcf003ae41f7a3f943ea5adc105e0bac96f5a1cc490329889fcd6204568211221d490b849e52ec4', '2020-01-01 10:10:10', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test3', 'test3@foo.com', '35c403d3d680075ade37cf89d61e5ad4a5ba0314d84708d7d473ddcd7aa7b4eabed67ea7b4b6bd7e34636133d7169cee6759a966754b835b912cdbb7145d483d', '2020-01-01 10:10:10', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test4', 'test4@foo.com', '6fc584b985ef4eb261295a15610207a7a81a072a35371cb0e1728cb62661f0b8a64d251602feca0b8ff63a857ce7e76666beba842287166ac8f07da2a92462fd', '2020-01-01 10:10:10', 1);
INSERT INTO users (name, email, password, create_time, user_type) VALUES ('test5', 'test5@foo.com', '83d251a1f94b5ca97cb6169bb39f851a2efed29b312aa8f40b97ff106518f16d90a25346d0600e24795765227e1c430c027a56143e4c621cdbc04401c628d635', '2020-01-01 10:10:10', 1);
-- admin user
INSERT INTO users (id, name, email, password, create_time, user_type) VALUES (0, 'admin', 'admin@foo.com', '986996a3086c3e49eec3b143c0633d605ae7b654a5426727783a1daa366875faf3ea9401b9482bbcf787795dd412ec51ac2353e52b197d60fe8af8735e8fb76f', '2020-01-01 10:10:10', 0);


-- contents
INSERT INTO contents (content) VALUES ('content1');
INSERT INTO contents (content) VALUES ('content2');
INSERT INTO contents (content) VALUES ('content3');
INSERT INTO contents (content) VALUES ('content4');
INSERT INTO contents (content) VALUES ('content5');
INSERT INTO contents (content) VALUES ('content6');
INSERT INTO contents (content) VALUES ('content7');
INSERT INTO contents (content) VALUES ('content8');

INSERT INTO contents (content) VALUES ('reply1');
INSERT INTO contents (content) VALUES ('reply2');
INSERT INTO contents (content) VALUES ('reply3');
INSERT INTO contents (content) VALUES ('reply4');

-- departments
INSERT INTO departments (name, description) VALUES ('Programming', 'A forum for programming');

-- posts
INSERT INTO posts (department_id, userid, create_time, content_id, title) VALUES (1, 1, '2020-01-01 10:10:10', 1, 'What does “>_” mean in run command?');
INSERT INTO posts (department_id, userid, create_time, content_id, title) VALUES (1, 1, '2020-01-01 10:10:10', 2, 'Sourcing bash file to set environment variables (Linux)');
INSERT INTO posts (department_id, userid, create_time, content_id, title) VALUES (1, 1, '2020-01-01 10:10:10', 3, 'Help me please with ” Association Rule (Apriori algorithm) ” in Python');
INSERT INTO posts (department_id, userid, create_time, content_id, title) VALUES (1, 1, '2020-01-01 10:10:10', 4, 'Help regarding Discord Bot cloning (Beginner)');
INSERT INTO posts (department_id, userid, create_time, content_id, title) VALUES (1, 2, '2020-01-01 10:10:10', 5, '[BUG] Jobs output should return a list for a matrix job');
INSERT INTO posts (department_id, userid, create_time, content_id, title) VALUES (1, 2, '2020-01-01 10:10:10', 6, '/repos/{owner}/{repo}/code-scanning/alerts returns empty list');
INSERT INTO posts (department_id, userid, create_time, content_id, title) VALUES (1, 2, '2020-01-01 10:10:10', 7, '[GitHub Apps] Restrict the installation to Organizations only');
INSERT INTO posts (department_id, userid, create_time, content_id, title) VALUES (1, 2, '2020-01-01 10:10:10', 8, '[GitHub Apps] Restrict the installation to Organizations only');

-- replies
INSERT INTO replies (userid, post_id, create_time, likecount, content_id) VALUES (1, 1, '2020-01-01 10:10:10', 1, 5);
INSERT INTO replies (userid, post_id, create_time, likecount, content_id) VALUES (1, 1, '2020-01-01 10:10:10', 1, 6);
INSERT INTO replies (userid, post_id, create_time, likecount, content_id) VALUES (1, 2, '2020-01-01 10:10:10', 1, 7);
INSERT INTO replies (userid, post_id, create_time, likecount, content_id) VALUES (1, 2, '2020-01-01 10:10:10', 1, 8);

-- likes
INSERT INTO reply_likes (userid, replyid) VALUES (1, 1);

INSERT INTO post_likes (userid, postid) VALUES (1, 1);
