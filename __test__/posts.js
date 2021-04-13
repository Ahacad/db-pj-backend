const supertest = require('supertest');
const app = require('../app');

const posts = () => {
  it('delete posts', async () => {
    const resp = await supertest(app).post('/posts/delete').send({
      userId: 1,
      postId: 1,
    });
    expect(resp.status).toBe(200);
  });
  it('add post', async () => {
    const resp = await supertest(app).post('/posts/new').send({
      id: 1,
      userId: 1,
      title: 'test post',
      content: 'hello testing',
    });
    expect(resp.status).toBe(201);
  });
  it('get posts', async () => {
    const resp = await supertest(app).get('/posts');
    expect(resp.status).toBe(200);
  });
};

module.exports = posts;
