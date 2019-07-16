module.exports = db => ({
  create: async (req, res) => {
    const data = req.body;
    console.log(data);
    // FIXME: is there a better way to validade this?
    for (const prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop) && data[prop] === '') {
        res.status(400);
        res.json({ error: { code: 400, message: `${prop} can not be empty` } });
        return;
      }
    }
    try {
      const result = await db('accounts').insert(req.body, '*');
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
