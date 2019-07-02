const request = require('supertest');
const server = require('../src/server');

const email = `${Date.now()}@mail.com`;

test('Should return status code 200 and []', () => request(server).get('/users')
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  }));

test('Should insert a user', () => request(server).post('/users')
  .send({ name: 'Walter Mitty', email, password: '123456' })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Walter Mitty');
  }));

test('Should list all users', () => request(server).get('/users')
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  }));
