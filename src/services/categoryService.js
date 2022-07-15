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

  // ESBOÇO DO ENDPOINT GET /categories
  // list: async () => {
  //   const users = await connection.User.findAll({ 
  //     attributes: {
  //       exclude: 'password',
  //     },
  //   });

  //   return users;
  // },
};

module.exports = userService;