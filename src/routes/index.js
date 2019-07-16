const knex = require('knex');
const db = knex(require('../../knexfile').test);
const user = require('../controllers/user')(db);
const account = require('../controllers/account')(db);


const routes = (server) => {
  server.get('/users', user.list);
  server.post('/users', user.create);

  server.post('/accounts', account.create);
};

module.exports = routes;
