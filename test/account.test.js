const request = require('supertest');
const knex = require('knex');
const server = require('../src/server');
const db = knex(require('../knexfile').test);

const MAIN_ROUTE = '/accounts';
const email = () => `${Date.now()}@mail.com`;

let user;

beforeAll(async () => {
  const res = await db('users').insert({ name: 'Walter Mitty', email: email(), password: '123457' }, '*');
  user = { ...res[0] };
});

test('Should insert an account', () => request(server).post(MAIN_ROUTE)
  .send({ name: 'account_1', user_id: user.id })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('account_1');
  }));
