const { Router } = require('express');

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const router = Router();

router.use(authController.validateToken);

router.post('/', categoryController.create);

// router.get('/', categoryController.list);

module.exports = router;