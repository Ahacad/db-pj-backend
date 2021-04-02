const supertest = require('supertest');
const app = require('../app');

describe('testing the users API', () => {
  it('test the add user api', async () => {
    const resp = await supertest(app).post('/users/register').send({
      name: 'baha',
      email: 'ahacad@126.com',
      password: 'hello',
      createTime: '2016-06-22 19:10:25-07',
    });
    expect(resp.status).toBe(201);
  });
});
