const user = require('../controllers/user');

const routes = (server) => {
  server.get('/users', user.list);

  server.post('/users', user.create);
};

module.exports = routes;
