const server = require('express')();
const routes = require('../routes');

server.use(require('body-parser').json());

server.get('/', (req, res) => {
  res.status(200).send();
});

routes(server);

module.exports = server;
