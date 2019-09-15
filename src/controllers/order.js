const required = require('../helpers/required');

module.exports = db => ({
  list: async (req, res) => {
    try {
      const result = await db('orders').select();
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
  listById: async (req, res) => {
    const { id } = req.params;
    const noMatch = !id.match(/[^0-9]/g);

    if (noMatch) {
      try {
        const order = await db('orders').where('id', Number(id));
        if (order.length) {
          res.status(200).json(order);
        } else {
          res.status(400)
            .json({
              error: true,
              code: 400,
              message: 'order not found',
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
    const keys = ['user_id', 'service_id'];

    try {
      const validate = await required(keys, data);
      if (typeof validate === 'boolean' && validate) {
        try {
          const result = await db('orders').insert(data, '*');
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
    const noMatch = !id.match(/[^0-9]/g);

    if (noMatch) {
      try {
        const affectedRows = await db('orders').where('id', Number(id)).del();
        if (affectedRows > 0) {
          res.status(200)
            .json({
              error: false,
              code: 200,
              message: 'order removed',
            });
        } else {
          res.status(400)
            .json({
              error: true,
              code: 400,
              message: 'order not removed',
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
