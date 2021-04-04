const supertest = require('supertest');
const app = require('../app');

describe('posts API', () => {
  it('add post', async () => {
    const resp = await supertest(app).post('/posts/new').send({
      userid: '1',
      title: 'test post',
      content: 'hello testing',
    });
    expect(resp.status).toBe(201);
  });
});
