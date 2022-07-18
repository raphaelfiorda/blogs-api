const Joi = require('joi');
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

    const userId = await connection.User.findOne({
      attributes: ['id'],
      where: { email },
    });

    return userId;
  },
  
  create: async ({ title, content, categoryIds, id }) => {
    const post = await connection.BlogPost.create({ title, content, userId: id });

    const catPostArray = await categoryIds.map((catId) => (
      {
        postId: post.id,
        categoryId: catId,
      }
    ));

    await connection.PostCategory.bulkCreate(catPostArray);

    return post;
  },

  // list: async () => {
  //   const categories = await connection.Category.findAll();

  //   return categories;
  // },
};

module.exports = postService;