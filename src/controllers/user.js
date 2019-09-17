const bcrypt = require('bcrypt');
const _ = require('lodash');

const required = require('../helpers/required');

module.exports = db => ({
  list: async (req, res) => {
    try {
      const result = await db('users').select();
      const normalized = _.map(result, obj => _.omit(obj, ['password']));

      res.status(200)
        .json(normalized);
    } catch (error) {
      res.status(400)
        .json({
          error: true,
          code: error.code,
          message: error.detail,
        });
    }
  },
  listById: async (req, res) => {
    const { id } = req.params;
    const noMatch = !id.match(/[^0-9]/g);

    if (noMatch) {
      try {
        const users = await db('users').where('id', Number(id));
        if (users.length) {
          const normalized = _.map(users, obj => _.omit(obj, ['password']));

          res.status(200)
            .json(normalized);
        } else {
          res.status(400)
            .json({
              error: true,
              code: 400,
              message: 'user not found',
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
  create: async (req, res) => {
    const data = req.body;
    const keys = ['name', 'email', 'password'];

    try {
      const validate = await required(keys, data);
      if (typeof validate === 'boolean' && validate) {
        try {
          const { name, email, password } = data;
          bcrypt.hash(password, 10, async (err, hash) => {
            if (!err) {
              const result = await db('users').insert({ name, email, password: hash }, '*');
              const normalized = _.omit(result[0], ['password']);

              res.status(201)
                .json(normalized);
            } else {
              console.log(err);
            }
          });
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
    const noMatch = !id.match(/[^0-9]/g);

    if (noMatch) {
      try {
        const affectedRows = await db('users').where('id', Number(id)).del();
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
