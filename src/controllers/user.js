const _ = require('lodash');
const required = require('../helpers/required');

module.exports = db => ({
  list: async (req, res) => {
    try {
      const result = await db('users').select();
      res.status(200).json(result);
    } catch (error) {
      res.status(400)
        .json({
          error: true,
          code: error.code,
          message: error.detail,
        });
    }
  },
  create: async (req, res) => {
    const data = req.body;
    const keys = ['name', 'email', 'password'];

    try {
      const validate = await required(keys, data);
      if (typeof validate === 'boolean' && validate) {
        try {
          const result = await db('users').insert(data, '*');
          res.status(201).json(result[0]);
        } catch (error) {
          res.status(400)
            .json({
              error: true,
              code: error.code,
              message: error.detail,
            });
        }
      }
    } catch (error) {
      res.status(400)
        .json({
          error: true,
          code: 400,
          message: error.message,
        });
    }
  },
  remove: async (req, res) => {
    const { id } = req.params;

    if (_.isNumber(id)) {
      try {
        const affectedRows = await db('users').where('id', id).del();
        if (affectedRows > 0) {
          res.status(200)
            .json({
              error: false,
              code: 200,
              message: 'user removed',
            });
        } else {
          res.status(400)
            .json({
              error: true,
              code: 400,
              message: 'user not removed',
            });
        }
      } catch (error) {
        res.status(400)
          .json({
            error: true,
            code: error.code,
            message: error.detail,
          });
      }
    } else {
      res.status(400)
        .json({
          error: true,
          code: 400,
          message: 'id must be an integer',
        });
    }
  },
});
