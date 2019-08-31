const request = require('supertest');
const knex = require('knex');
const server = require('../src/server');
const db = knex(require('../knexfile').test);

const MAIN_ROUTE = '/users';

const truncate = table => db.raw(`TRUNCATE TABLE ${table} CASCADE`);

beforeAll(() => truncate('users'));

afterAll(() => truncate('users'));

const email = () => `${Date.now()}@mail.com`;

test('Should return status code 200 and []', () => request(server).get(MAIN_ROUTE)
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  }));

test('Should not save if name is null/undefined', () => request(server).post(MAIN_ROUTE)
  .send({ name: undefined, email: email(), password: '123456' })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('name not exists in object');
  }));

test('Should not save if name is empty', () => request(server).post(MAIN_ROUTE)
  .send({ name: '', email: email(), password: '123456' })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('name can not be empty or null');
  }));

test('Should not save if email is null', () => request(server).post(MAIN_ROUTE)
  .send({ name: 'Walter Mitty', email: null, password: '123456' })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('email can not be empty or null');
  }));

test('Should not save if email is empty', () => request(server).post(MAIN_ROUTE)
  .send({ name: 'Walter Mitty', email: '', password: '123456' })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('email can not be empty or null');
  }));

test('Should not save if password is null', () => request(server).post(MAIN_ROUTE)
  .send({ name: 'Walter Mitty', email: email(), password: null })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('password can not be empty or null');
  }));

test('Should not save if password is empty', () => request(server).post(MAIN_ROUTE)
  .send({ name: 'Walter Mitty', email: email(), password: '' })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(400);
    expect(res.body.error.message).toBe('password can not be empty or null');
  }));

test('Should insert a user', () => request(server).post(MAIN_ROUTE)
  .send({ name: 'Walter Mitty', email: email(), password: '123456' })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Walter Mitty');
  }));
