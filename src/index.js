const app = require('../src/server');

app.listen(process.env.PORT || 3001, () => {
  console.log('Ready on %d', process.env.PORT || 3001);
});
