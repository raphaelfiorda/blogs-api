const authService = require('../services/authService');

const authController = {
  login: async (req, res) => {
    const { email, password } = authService.validateBody(req.body);

    const token = await authService.login(email, password);

    res.status(200).json({ token });
  },

  validateToken: (req, _res, next) => {
    const { authorization } = req.headers;

    authService.validateToken(authorization);

    next();
  },
};

module.exports = authController;