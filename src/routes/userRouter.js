const { Router } = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = Router();

router.post('/', userController.create);

router.use(authController.validateToken);

router.get('/', userController.list);

router.get('/:id', userController.get);

module.exports = router;