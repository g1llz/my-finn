
module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '',
      database: 'my_finn_test',
    },
    migrations: {
      directory: 'src/migrations',
    },
  },
};
