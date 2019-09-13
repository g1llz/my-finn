const request = require('supertest');
const knex = require('knex');
const server = require('../src/server');
const db = knex(require('../knexfile').test);

const MAIN_ROUTE = '/accounts';

const truncate = table => db.raw(`TRUNCATE TABLE ${table} CASCADE`);
const email = () => `${Date.now()}@mail.com`;

let user;

beforeAll(async () => {
  truncate('users');

  const res = await db('users').insert({ name: 'Walter Mitty', email: email(), password: '123457' }, '*');
  user = { ...res[0] };
});

afterAll(() => truncate('users'));

test.skip('Should not insert if name is empty', () => request(server).post(MAIN_ROUTE)
  .send({ name: '', user_id: user.id })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('name can not be empty or null');
  }));

test.skip('Should not insert if name is null/undefined', () => request(server).post(MAIN_ROUTE)
  .send({ name: null, user_id: user.id })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('name can not be empty or null');
  }));

test.skip('Should not insert if user_id is null/undefined', () => request(server).post(MAIN_ROUTE)
  .send({ name: 'account_2', user_id: undefined })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('user_id not exists in object');
  }));

test.skip('Should insert an account', () => request(server).post(MAIN_ROUTE)
  .send({ name: 'account_1', user_id: user.id })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('account_1');
  }));
