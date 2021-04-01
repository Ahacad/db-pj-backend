

### TODOS

- [ ] decide what the project is about: (a forum, perhaps)

- [ ] authentication for different **types** of users
- [ ] detailed design of the database 
- [ ] real-world meaning of the project

- [x] Docker 
- [ ] deploy backend to cloud
- [ ] deploy frontend to vercel

## 项目说明

### 数据库设计

### 后端

后端采用 express 轻量搭建。

#### 启动服务 (docker)

后端使用 docker 启动，分为数据库 postgresql 镜像和后端 express 服务镜像。

##### 1. 启动数据库

首先确认已经安装 docker 并启动，然后在后端文件目录下使用 `docker-compose up`
(可能需要 root 权限) 启动 postgresql 镜像，再输入下面一行命令导入数据。

```bash
PGPASSWORD=root psql -d api -U ahacad -f infile.sql -h localhost
```

##### 2. 启动后端


#### 后端 API 列表

##### 

### 前端

前端采用 create-react-app 生成，使用 react 全家桶 (react, react-router,
redux)；ui 框架选择了 material ui 和 tailwindcss；还有一些小的辅助库比如 axios 等等。

详细直接见代码，总体比较简单。

#### 启动服务 (yarn)

在前端目录下使用 `yarn start` 即可启动服务。
