const request = require('supertest');
const knex = require('knex');
const server = require('../src/server');
const db = knex(require('../knexfile').test);

const MAIN_ROUTE = '/services';

const truncate = table => db.raw(`TRUNCATE TABLE ${table} CASCADE`);

beforeAll(() => truncate('services'));

describe('List services', () => {
  it('Should return status code 200 and []', () => request(server).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    }));
});

describe('Create service', () => {
  it('Should not save if description is null/undefined', () => request(server).post(MAIN_ROUTE)
    .send({ description: undefined, price: 40.00 })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('description not exists in object');
    }));

  it('Should not save if description is empty', () => request(server).post(MAIN_ROUTE)
    .send({ description: '', price: 35.90 })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('description can not be empty or null');
    }));

  it('Should not save if price is null', () => request(server).post(MAIN_ROUTE)
    .send({ description: 'Haircut', price: null })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('price can not be empty or null');
    }));

  it('Should not save if price is empty', () => request(server).post(MAIN_ROUTE)
    .send({ description: 'Haircut', price: '' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('price can not be empty or null');
    }));

  it('Should insert a service', () => request(server).post(MAIN_ROUTE)
    .send({ description: 'Haircut', price: 50.00 })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.description).toBe('Haircut');
    }));
});

describe('List serive by ID', () => {
  it('Should list service if ID is correctly', async () => {
    const data = await db('services').insert({ description: 'Cut the beard', price: 35.00 }, '*');
    const service = { ...data[0] };
    request(server).get(`${MAIN_ROUTE}/${service.id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
      });
  });

  it('Should failed if service not found', () => {
    request(server).get(`${MAIN_ROUTE}/1`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(true);
        expect(res.body.message).toBe('service not found');
      });
  });
});

describe('Remove service', () => {
  it('Should remove service', async () => {
    const data = await db('services').insert({ description: 'Wash the hair', price: 25.00 }, '*');
    const service = { ...data[0] };
    request(server).delete(`${MAIN_ROUTE}/${service.id}`)
      .then((res) => {
        expect(res.error).toBe(false);
        expect(res.status).toBe(200);
        expect(res.message).toBe('service removed');
      });
  });

  it.skip('Should failed if service not exists', () => {
    request(server).delete(`${MAIN_ROUTE}/1`)
      .then((res) => {
        expect(res.error).toBe(true);
        expect(res.status).toBe(400);
        expect(res.message).toBe('service not removed');
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
