const supertest = require('supertest');
const app = require('../app');

describe('testing dummy', () => {
  it('tesing...', async () => {
    const resp = await supertest(app).get('/');
    expect(resp.status).toBe(200);
  });
});
