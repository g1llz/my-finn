const request = require('supertest');
const server = require('../src/server');

test('should be response on /', () => request(server).get('/')
  .then(res => expect(res.status).toBe(200)));
