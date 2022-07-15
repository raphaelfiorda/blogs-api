const userService = require('../services/userService');

const userController = {
  create: async (req, res) => {
    const { displayName, email, password, image } = await userService.validateBody(req.body);

    await userService.checkExists(email);

    const token = await userService.create({ displayName, email, password, image });

    res.status(201).json({ token });
  },

  list: async (_req, res) => {
    const users = await userService.list();

    res.status(200).json(users);
  },
};

module.exports = userController;