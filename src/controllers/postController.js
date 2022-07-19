const postService = require('../services/postService');

const postController = {
  create: async (req, res) => {
    const { title, content, categoryIds } = await postService.validateBody(req.body);
    await postService.checkCategoryExists(categoryIds);
    const { authorization } = req.headers;
    const { id } = await postService.getUserId(authorization);

    const post = await postService.create({ title, content, categoryIds, id });

    res.status(201).json(post);
  },

  list: async (_req, res) => {
    const posts = await postService.list();

    res.status(200).json(posts);
  },
};

module.exports = postController;