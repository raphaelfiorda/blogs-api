const categoryService = require('../services/categoryService');

const categoryController = {
  create: async (req, res) => {
    const { name } = await categoryService.validateBody(req.body);

    const category = await categoryService.create(name);

    res.status(201).json(category);
  },

  // ESBOÇO DO ENDPOINT GET /categories
  // list: async (_req, res) => {
  //   const users = await userService.list();

  //   res.status(200).json(users);
  // },
};

module.exports = categoryController;