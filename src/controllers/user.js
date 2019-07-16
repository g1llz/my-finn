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
    // FIXME: is there a better way to validade this?
    for (const prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop) && data[prop] === '') {
        res.status(400);
        res.json({ error: { code: 400, message: `${prop} can not be empty` } });
        return;
      }
    }
    try {
      const result = await db('users').insert(req.body, '*');
      res.status(201).json(result[0]);
    } catch (error) {
      if (error.code === '23502') {
        res.status(400);
        res.json({ error: { code: error.code, message: `${error.column} not-null` } });
        return;
      }
      res.status(400);
      res.json({ error: { code: error.code, detail: error.detail } });
    }
  },
});
