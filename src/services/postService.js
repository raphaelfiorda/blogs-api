const Joi = require('joi');
const { Op } = require('sequelize');
const connection = require('../database/models');
const errorThrower = require('./helpers');

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
      return errorThrower('"categoryIds" not found', 'ValidationError');
    }
  },

  checkUserAllowance: async ({ userId, id }) => {
    const isUserAllowed = await connection.BlogPost.findOne({
      where: { [Op.and]: [{ userId }, { id }] },
    });

    if (!isUserAllowed) errorThrower('Unauthorized user', 'UnauthorizedError');
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

    if (!post) errorThrower('Post does not exist', 'NotFoundError');

    return post;
  },

  edit: async ({ id, title, content }) => {
    await connection.BlogPost.update({ title, content },
      { where: { id }, fields: ['title', 'content'] });
  },

  delete: async (id) => {
    await connection.BlogPost.destroy({
      where: { id },
    });
  },
};

module.exports = postService;