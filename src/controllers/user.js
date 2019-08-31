const _ = require('lodash');

module.exports = db => ({
  list: async (req, res) => {
    try {
      const result = await db('users').select();
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },
  create: async (req, res) => {
    const data = req.body;
    const isRequired = ['name', 'email', 'password'];

    for (const prop of isRequired) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        if (_.isEmpty(data[prop])) {
          res.status(400)
            .json({ error: { code: 400, message: `${prop} can not be empty or null` } });
          return;
        }
      } else {
        res.status(400)
          .json({ error: { code: 400, message: `${prop} not exists in object` } });
        return;
      }
    }
    try {
      const result = await db('users').insert(data, '*');
      res.status(201).json(result[0]);
    } catch (error) {
      res.status(400)
        .json({ error: { code: error.code, detail: error.detail } });
    }
  },
});
