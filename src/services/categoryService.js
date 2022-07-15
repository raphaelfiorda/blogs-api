const Joi = require('joi');
const connection = require('../database/models');
const runSchema = require('./schemaValidator');

const userService = {
  validateBody: runSchema(Joi.object({
    name: Joi.string().required(),
  })),
  
  create: async (name) => {
    const category = await connection.Category.create({ name });

    return category;
  },

  list: async () => {
    const categories = await connection.Category.findAll();

    return categories;
  },
};

module.exports = userService;