const request = require('supertest');
const knex = require('knex');
const server = require('../src/server');

const db = knex(require('../knexfile').test);

const truncate = table => db.raw(`TRUNCATE TABLE ${table}`);

beforeAll(() => {
  console.log('=> TRUNCATE');
  return truncate('users');
});

const email = () => `${Date.now()}@mail.com`;

test('Should return status code 200 and []', () => request(server).get('/users')
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  }));

test('Should insert a user', () => request(server).post('/users')
  .send({ name: 'Walter Mitty', email: email(), password: '123456' })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Walter Mitty');
  }));

test('Should list all users', () => request(server).get('/users')
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  }));

test('Should not save if name is null', () => request(server).post('/users')
  .send({ email: email(), password: '123456' })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('23502');
    expect(res.body.error.message).toBe('name not-null');
  }));

test('Should not save if name is empty', () => request(server).post('/users')
  .send({ name: '', email: email(), password: '123456' })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('NA');
    expect(res.body.error.message).toBe('all attributes are required');
  }));
