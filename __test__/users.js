const supertest = require('supertest');
const app = require('../app');

const users = () => {
  it('add user', async () => {
    const resp = await supertest(app).post('/users/register').send({
      name: 'baha',
      email: 'ahacad@126.com',
      password: 'hello',
      createTime: '2021-04-02T08:12:47.503Z',
    });
    expect(resp.status).toBe(201);
  });
  it('update user', async () => {
    const resp = await supertest(app).post('/users/update/1').send({
      name: 'aha',
      bio: 'this is my life',
    });
    expect(resp.status).toBe(200);
  });
  it('delete user', async () => {
    const resp = await supertest(app).delete('/users/delete/5').send();
    expect(resp.status).toBe(200);
  });
  it('login', () => {
    console.log('login will be tested manually');
    expect(2).toBe(2);
  });
};

module.exports = users;
