const userService = require('../services/userService');

const userController = {
  create: async (req, res) => {
    const { displayName, email, password, image } = await userService.validateBody(req.body);

    await userService.checkConflict(email);

    const token = await userService.create({ displayName, email, password, image });

    res.status(201).json({ token });
  },

  list: async (_req, res) => {
    const users = await userService.list();

    res.status(200).json(users);
  },

  get: async (req, res) => {
    const { id } = await userService.validateParamsId(req.params);
    const user = await userService.get(id);

    res.status(200).json(user);
  },

  delete: async (req, res) => {
    const { authorization } = req.headers;
    const id = await userService.getUserId(authorization);

    await userService.delete(id);

    res.sendStatus(204);
  },
};

module.exports = userController;