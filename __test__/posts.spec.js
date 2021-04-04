const supertest = require('supertest');
const app = require('../app');

describe('posts API', () => {
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
});
