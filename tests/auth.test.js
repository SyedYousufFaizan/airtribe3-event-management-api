const request = require('supertest');
const app = require('../src/app');

describe('Authentication', () => {
  it('registers a user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Test User',
        email: 'testuser@test.com',
        password: 'password123',
        role: 'organizer'
      });

    expect(res.statusCode).toBe(201);
  });

  it('prevents duplicate registration', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        email: 'testuser@test.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(400);
  });

  it('logs in a user', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'testuser@test.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
