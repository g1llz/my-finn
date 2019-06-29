module.exports = {
  list: (req, res) => {
    const users = [
      {
        name: 'Bruce Wayne',
        email: 'batman@gothan.com',
      },
    ];
    res.status(200).json(users);
  },
  create: (req, res) => {
    res.status(201).json(req.body);
  },
};
