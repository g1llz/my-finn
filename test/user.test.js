const request = require('supertest');
const knex = require('knex');
const server = require('../src/server');
const db = knex(require('../knexfile').test);

const MAIN_ROUTE = '/users';

const truncate = table => db.raw(`TRUNCATE TABLE ${table} CASCADE`);
const email = () => `${Date.now()}@mail.com`;

beforeAll(() => truncate('users'));

describe('List user', () => {
  it('Should return status code 200 and []', () => request(server).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    }));
});

describe('Create user', () => {
  it('Should not save if name is null/undefined', () => request(server).post(MAIN_ROUTE)
    .send({ name: undefined, email: email(), password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('name not exists in object');
    }));

  it('Should not save if name is empty', () => request(server).post(MAIN_ROUTE)
    .send({ name: '', email: email(), password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('name can not be empty or null');
    }));

  it('Should not save if email is null', () => request(server).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', email: null, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('email can not be empty or null');
    }));

  it('Should not save if email is empty', () => request(server).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', email: '', password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('email can not be empty or null');
    }));

  it('Should not save if password is null', () => request(server).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', email: email(), password: null })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('password can not be empty or null');
    }));

  it('Should not save if password is empty', () => request(server).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', email: email(), password: '' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('password can not be empty or null');
    }));

  it('Should insert a user', () => request(server).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', email: email(), password: '123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Walter Mitty');
    }));
});

describe('List user by ID', () => {
  it('Should list user if ID is correctly', async () => {
    const data = await db('users').insert({ name: 'Walter Mitty', email: email(), password: '123457' }, '*');
    const user = { ...data[0] };
    request(server).get(`${MAIN_ROUTE}/${user.id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
      });
  });

  it('Should failed if user not found', () => {
    request(server).get(`${MAIN_ROUTE}/1`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(true);
        expect(res.body.message).toBe('user not found');
      });
  });
});

describe('Remove user', () => {
  it('Should remove user', async () => {
    const data = await db('users').insert({ name: 'Walter Mitty', email: email(), password: '123457' }, '*');
    const user = { ...data[0] };
    request(server).delete(`${MAIN_ROUTE}/${user.id}`)
      .then((res) => {
        expect(res.error).toBe(false);
        expect(res.status).toBe(200);
        expect(res.message).toBe('user removed');
      });
  });

  it.skip('Should failed if user not exists', () => {
    request(server).delete(`${MAIN_ROUTE}/1`)
      .then((res) => {
        expect(res.error).toBe(true);
        expect(res.status).toBe(400);
        expect(res.message).toBe('user not removed');
      });
  });

  it('Should failed if id not an integer', () => {
    request(server).delete(`${MAIN_ROUTE}/xoxo`)
      .then((res) => {
        expect(res.error).toBe(true);
        expect(res.status).toBe(400);
        expect(res.message).toBe('id must be an integer');
      });
  });
});
