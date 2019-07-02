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
    try {
      const result = await db('users').insert(req.body, '*');
      res.status(201).json(result[0]);
    } catch (error) {
      console.log(error);
    }
  },
});
