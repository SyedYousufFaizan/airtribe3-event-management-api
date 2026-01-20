const request = require('supertest');
const app = require('../src/app');

let organizerToken;
let attendeeToken;
let eventId;

beforeAll(async () => {
  // Organizer
  await request(app).post('/register').send({
    name: 'Organizer',
    email: 'org@test.com',
    password: 'password',
    role: 'organizer'
  });

  const orgLogin = await request(app).post('/login').send({
    email: 'org@test.com',
    password: 'password'
  });

  organizerToken = orgLogin.body.token;

  // Attendee
  await request(app).post('/register').send({
    name: 'Attendee',
    email: 'att@test.com',
    password: 'password',
    role: 'attendee'
  });

  const attLogin = await request(app).post('/login').send({
    email: 'att@test.com',
    password: 'password'
  });

  attendeeToken = attLogin.body.token;
});

describe('Event Management', () => {
  it('creates an event', async () => {
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Test Event',
        description: 'Test Desc',
        date: '2026-01-20',
        time: '18:00'
      });

    expect(res.statusCode).toBe(201);
  });

  it('fetches all events', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    eventId = res.body[0].id;
  });

  it('updates an event', async () => {
    const res = await request(app)
      .put(`/events/${eventId}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Updated Event'
      });

    expect(res.statusCode).toBe(200);
  });

  it('prevents attendee from updating event', async () => {
    const res = await request(app)
      .put(`/events/${eventId}`)
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({
        title: 'Hack Attempt'
      });

    expect(res.statusCode).toBe(403);
  });
});

describe('Event Registration', () => {
  it('registers user for event', async () => {
    const res = await request(app)
      .post(`/events/${eventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);

    expect(res.statusCode).toBe(201);
  });


});
