const postService = require('../services/postService');
const userService = require('../services/userService');

const postController = {
  create: async (req, res) => {
    const { title, content, categoryIds } = await postService.validateBody(req.body);
    await postService.checkCategoryExists(categoryIds);
    const { authorization } = req.headers;
    const userId = await userService.getUserId(authorization);

    const post = await postService.create({ title, content, categoryIds, userId });

    res.status(201).json(post);
  },

  list: async (_req, res) => {
    const posts = await postService.list();

    res.status(200).json(posts);
  },

  get: async (req, res) => {
    const { id } = req.params;

    const post = await postService.get(id);

    res.status(200).json(post);
  },

  search: async (req, res) => {
    const { q } = req.query;

    const posts = await postService.search(q);

    res.status(200).json(posts);
  },

  edit: async (req, res) => {
    const { title, content } = await postService
      .validateBodyLessCategory(req.body);
    const { authorization } = req.headers;
    const userId = await userService.getUserId(authorization);
    const { id } = req.params;

    await postService.checkUserAllowance({ userId, id });

    await postService.edit({ id, title, content });

    const editedPost = await postService.get(id);

    res.status(200).json(editedPost);
  },

  delete: async (req, res) => {
    const { authorization } = req.headers;
    const userId = await userService.getUserId(authorization);
    const { id } = req.params;

    await postService.get(id);

    await postService.checkUserAllowance({ userId, id });

    await postService.delete(id);

    res.sendStatus(204);
  },
};

module.exports = postController;