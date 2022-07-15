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

  findByEmail: async (email) => {
    const user = await connection.User.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { email },
    });

    return !!user;
  },

  create: async (data) => {
    const userExists = this.findByEmail(data.email);

    if (userExists) {
      const err = new Error('User already registered');
      err.name = 'ConflictError';
      throw err;
    }

    await connection.User.create(data);

    const token = jwtService.createToken(data);

    return token;
  },
};

module.exports = userService;