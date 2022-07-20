const Joi = require('joi');
const connection = require('../database/models');
const jwtService = require('./jwtService');
const runSchema = require('./schemaValidator');
const errorThrower = require('./helpers');

const userService = {
  validateBody: runSchema(Joi.object({
    displayName: Joi.string().required().min(8),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    image: Joi.string().required(),
  })),

  validateParamsId: runSchema(Joi.object({
    id: Joi.number().required().integer().positive(),
  })),

  checkConflict: async (email) => {
    const user = await connection.User.findOne({ where: { email } });
    
    if (user) errorThrower('User already registered', 'ConflictError');
  },

  getUserId: async (token) => {
    const { email } = jwtService.decodeToken(token);

    const { id } = await connection.User.findOne({
      attributes: ['id'],
      where: { email },
    });

    return id;
  },
  
  get: async (id) => {
    const user = await connection.User.findByPk(id, {
      attributes: {
        exclude: 'password',
      },
    });

    if (!user) errorThrower('User does not exist', 'NotFoundError');

    return user;
  },

  list: async () => {
    const users = await connection.User.findAll({ 
      attributes: {
        exclude: 'password',
      },
    });

    return users;
  },

  create: async ({ displayName, email, password, image }) => {
    await connection.User.create({ displayName, email, password, image });

    const token = jwtService.createToken({ displayName, email });

    return token;
  },

  delete: async (id) => {
    await connection.User.destroy({
      where: { id },
    });
  },
};

module.exports = userService;