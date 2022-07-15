const userService = require('../services/userService');

const userController = {
  create: async (req, res) => {
    const { displayName, email, password, image } = await userService.validateBody(req.body);

    const token = await userService.create(displayName, email, password, image);

    res.status(201).json(token);
  },
};

module.exports = userController;