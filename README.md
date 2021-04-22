

### TODOS

#### General
- [x] decide what the project is about: (a forum, perhaps)
- [x] read about the project requirement specifications (CRUD, usable,
  authority)
- [ ] learn jest, supertest, make unit tests working
- [ ] real-world meaning of the project
- [ ] detailed design of the database 

#### Backend
- [ ] data pagination
- [ ] authentication for different **types** of users

#### Deployment
- [x] Docker 
- [x] deploy backend to cloud (no need anymore with docker)
- [ ] deploy frontend to vercel



## 项目说明

### 第一部分: 场景设计

论坛系统，用来搭建论坛

功能需求：

- 用户注册、登录
- 查看帖子
- 查看帖子回复
- 回复帖子
- 发布帖子
- 对帖子作各种微回复（比如赞）

### 第二部分: 技术设计
#### 2.1 实验环境 
##### 2.1.1 后端
后端采用 express 轻量搭建。
###### 启动服务 (docker)
确认已经安装 docker 并启动。
若需要重新打包后端，请使用 `docker-compose build`。
在后端文件目录下使用 `docker-compose up` 启动数据库和后端服务；
下面一行 `shell` 命令可以导入数据:
```bash
PGPASSWORD=root psql -d api -U ahacad -f database.sql -h localhost
```
###### 测试
所有单元测试文件都在 `__test__` 里，运行 `yarn test` 即可调用 `Jest`
测试，注意测试需要启动数据库。
##### 2.1.2 前端
前端采用 create-react-app 生成，使用 react 全家桶 (react, react-router,
redux)；ui 框架选择了 material ui 和 tailwindcss；还有一些小的辅助库比如 axios 等等。
###### 启动服务 (yarn)
在前端目录下使用 `yarn install && yarn start` 即可启动服务 (需要安装
`yarn` 或者 `npm`)。
#### 2.2 设计亮点
#### 2.3 数据库设计
- TODO: 
#### 2.4 其它


#### 2.4.1 后端 API 列表

##### users 

###### `POST /users/register`

```typescript
interface Request {
  name: string;
  email: string;
  password: string
}
```

###### `POST /users/login` 

```typescript
interface Request {
  email: string;
  password: string;
}
```
###### `POST /users/update/:id`

```typescript
interface Request {
  name: string;
  bio: string;
}
```

###### `DELETE /users/delete/:id`

```typescript
interface Request {
}
```

##### posts

###### `POST /posts/new`

```typescript
interface Request {
  userId: string;
  title: string;
  content: string;
}
```
###### `POST /posts/:id/newreply`

```typescript
interface Request {
  userId: string;
  content: string;
}
```
###### `GET /posts`

```typescript
interface Request {
}

interface Response {
  userid: number;
  title: string;
  create_time: string;
  replycount: number;
  likecount: number;
  reply_userid: number;
  last_reply_time: string;
  content: string;
}
```
