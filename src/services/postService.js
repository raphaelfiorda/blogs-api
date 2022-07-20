const Joi = require('joi');
const { Op } = require('sequelize');
const connection = require('../database/models');
const jwtService = require('./jwtService');

const postService = {
  validateBody: (data) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      categoryIds: Joi.array().items(Joi.number()).required(),
    });

    const { error, value } = schema.validate(data);
    if (error) {
      error.message = 'Some required fields are missing';
      throw error;
    }
    return value;
  },

  validateBodyLessCategory: (data) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
    });

    const { error, value } = schema.validate(data);
    if (error) {
      error.message = 'Some required fields are missing';
      throw error;
    }
    return value;
  },

  checkCategoryExists: async (categoryIds) => {
    const { count } = await connection.User.findAndCountAll({ where: { id: categoryIds } });
    
    if (count !== categoryIds.length) {
      const err = new Error('"categoryIds" not found');
      err.name = 'ValidationError';
      throw err;
    }
  },

  getUserId: async (token) => {
    const { email } = jwtService.decodeToken(token);

    const { id } = await connection.User.findOne({
      attributes: ['id'],
      where: { email },
    });

    return id;
  },
  
  create: async ({ title, content, categoryIds, userId }) => {
    const post = await connection.BlogPost.create({ title, content, userId });

    const catPostArray = await categoryIds.map((catId) => (
      {
        postId: post.id,
        categoryId: catId,
      }
    ));

    await connection.PostCategory.bulkCreate(catPostArray);

    return post;
  },

  // Eager loading
  list: async () => {
    const posts = await connection.BlogPost.findAll({
      include: [{
        model: connection.User,
        as: 'user',
        attributes: { exclude: ['password'] },
      }, {
        model: connection.Category,
        as: 'categories',
        through: { attributes: [] }, // [] exclui da query os dados da junction table
      }],
    });

    return posts;
  },

  get: async (id) => {
    const post = await connection.BlogPost.findByPk(id, {
      include: [{
        model: connection.User,
        as: 'user',
        attributes: { exclude: ['password'] },
      }, {
        model: connection.Category,
        as: 'categories',
        through: { attributes: [] }, // [] exclui da query os dados da junction table
      }],
    });

    if (!post) {
      const err = new Error('Post does not exist');
      err.name = 'NotFoundError';
      throw err;
    }

    return post;
  },

  edit: async ({ id, title, content, userId }) => {
    const isUserAllowed = await connection.BlogPost.findOne({
      where: { [Op.and]: [{ userId }, { id }] },
    });

    if (!isUserAllowed) {
      const err = new Error('Unauthorized user');
      err.name = 'UnauthorizedError';
      throw err;
    }
    
    await connection.BlogPost.update({ title, content },
      { where: { id }, fields: ['title', 'content'] });
  },
};

module.exports = postService;