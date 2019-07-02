const knex = require('knex');
const db = knex(require('../../knexfile').test);
const user = require('../controllers/user')(db);


const routes = (server) => {
  server.get('/users', user.list);

  server.post('/users', user.create);
};

module.exports = routes;
