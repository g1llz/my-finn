const request = require('supertest');
const server = require('../src/server');

test('Should list all users', () => request(server).get('/users')
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('name', 'Bruce Wayne');
  }));

test('Should insert a user', () => request(server).post('/users')
  .send({ name: 'Walter Mitty', email: 'walter@mitty.com' })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Walter Mitty');
  }));
