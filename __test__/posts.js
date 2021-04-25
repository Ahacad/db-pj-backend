const supertest = require('supertest');
const app = require('../app');

const posts = () => {
  // delete will be tested manually
  // it('delete posts', async () => {
  // const resp = await supertest(app).post('/posts/delete').send({
  // userId: 1,
  // postId: 3,
  // });
  // expect(resp.status).toBe(200);
  // });
  it('/posts/new   add post', async () => {
    const resp = await supertest(app).post('/posts/new').send({
      id: 1,
      userId: 1,
      title: 'test post',
      content: 'hello testing',
      departmentId: 1,
    });
    expect(resp.status).toBe(201);
  });
  it('get posts', async () => {
    const resp = await supertest(app).get('/posts');
    expect(resp.status).toBe(200);
  });
  it('get thread by post id', async () => {
    const resp = await supertest(app).get('/posts/1');
    expect(resp.status).toBe(200);
  });
  it('/posts/:id/newreply   add reply to post', async () => {
    const resp = await supertest(app).post('/posts/1/newreply').send({
      userId: 1,
      content: 'jiriguara',
    });
    expect(resp.status).toBe(201);
  });
  it('/posts/:id/like   like post', async () => {
    const resp = await supertest(app).post('/posts/1/like', {});
    expect(resp.status).toBe(200);
  });
  it('/posts/:id/reply/like   like reply', async () => {
    const resp = await supertest(app).post('/posts/1/reply/like', {
      replyId: 1,
    });
    expect(resp.status).toBe(200);
  });
};

module.exports = posts;
