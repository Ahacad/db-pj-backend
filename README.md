

### TODOS

- [ ] decide what the project is about: (a forum, perhaps)
- [ ] read about the project requirement specifications
- [ ] learn jest, supertest, make unit tests working

- [ ] authentication for different **types** of users
- [ ] detailed design of the database 
- [ ] real-world meaning of the project

- [x] Docker 
- [x] deploy backend to cloud (no need anymore with docker)
- [ ] deploy frontend to vercel

## 项目说明

### 数据库设计


- user_id 简写为 userid

### 后端

后端采用 express 轻量搭建。

#### 启动服务 (docker)

后端使用 docker 启动，分为数据库 postgresql 镜像和后端 express 服务镜像。

##### 1. 启动数据库

首先确认已经安装 docker 并启动，然后在后端文件目录下使用 `docker-compose up`
(可能需要 root 权限) 启动 postgresql 镜像，再输入下面一行命令导入数据。

```bash
PGPASSWORD=root psql -d api -U ahacad -f database.sql -h localhost
```

##### 2. 启动后端

```bash
docker build -t expressapp .         
```


#### 后端 API 列表

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

##### posts


### 前端

前端采用 create-react-app 生成，使用 react 全家桶 (react, react-router,
redux)；ui 框架选择了 material ui 和 tailwindcss；还有一些小的辅助库比如 axios 等等。

详细直接见代码，总体比较简单。

#### 启动服务 (yarn)

在前端目录下使用 `yarn start` 即可启动服务。
