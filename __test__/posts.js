const supertest = require('supertest');
const app = require('../app');

const posts = () => {
  it('add post', async () => {
    const resp = await supertest(app).post('/posts/new').send({
      userId: '1',
      title: 'test post',
      content: 'hello testing',
    });
    expect(resp.status).toBe(201);
  });
  it('get posts', async () => {
    const resp = await supertest(app).get('/posts');
    console.log(resp.body);
    expect(resp.status).toBe(200);
  });
};

module.exports = posts;
