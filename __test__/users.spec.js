const supertest = require('supertest');
const app = require('../app');

describe('testing the users API', () => {
  it('test the add user api', async () => {
    const resp = await supertest(app)
      .post('/users/register')
      .send({
        name: 'aha',
        email: 'ahacad@126.com',
        password: 'hello',
        createTime: '1000000',
      });
    expect(resp.status).toBe(200);
  });
});
