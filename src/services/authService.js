const connection = require('../database/models');
const jwtService = require('./jwtService');

const authService = {
  validateBody: (data) => {
    const { email, password } = data;
    if (!email || !password) {
      const err = new Error('Some required fields are missing');
      err.name = 'ValidationError';
      throw err;
    }

    return data;
  },

  login: async (email, password) => {
    const user = await connection.User.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { email },
    });

    if (!user || user.password !== password) {
      const err = new Error('Invalid fields');
      err.name = 'ValidationError';
      throw err;
    }

    const token = jwtService.createToken(user);

    return token;
  },
};

module.exports = authService;