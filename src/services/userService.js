const Joi = require('joi');
const connection = require('../database/models');
const jwtService = require('./jwtService');
const runSchema = require('./schemaValidator');

const userService = {
  validateBody: runSchema(Joi.object({
    displayName: Joi.string().required().min(8),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    image: Joi.string().required(),
  })),

  checkExists: async (email) => {
    const user = await connection.User.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { email },
    });

    if (user) {
      const err = new Error('User already registered');
      err.name = 'ConflictError';
      throw err;
    }
  },

  create: async ({ displayName, email, password, image }) => {
    await connection.User.create({ displayName, email, password, image });

    const token = jwtService.createToken({ displayName, email });

    return token;
  },
};

module.exports = userService;