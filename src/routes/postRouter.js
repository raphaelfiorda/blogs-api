const { Router } = require('express');

const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = Router();

router.use(authController.validateToken);

router.post('/', postController.create);

router.get('/', postController.list);

router.get('/:id', postController.get);

router.put('/:id', postController.edit);

router.delete('/:id', postController.delete);

module.exports = router;