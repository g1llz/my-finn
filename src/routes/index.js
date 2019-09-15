const knex = require('knex');
const db = knex(require('../../knexfile')[process.env.DB_ENV]);

const user = require('../controllers/user')(db);
const order = require('../controllers/order')(db);
const service = require('../controllers/service')(db);

// TODO: fix migrations timestamps localzone (-3);

const routes = (server) => {
  // user
  server.get('/users', user.list);
  server.get('/users/:id', user.listById);
  server.post('/users', user.create);
  server.delete('/users/:id', user.remove);

  // service
  server.get('/services', service.list);
  server.get('/services/:id', service.listById);
  server.post('/services', service.create);
  server.delete('/services/:id', service.remove);

  // order
  server.get('/orders', order.list);
  server.get('/orders/:id', order.listById);
  server.post('/orders', order.create);
  server.delete('/orders/:id', order.remove);
};

module.exports = routes;
