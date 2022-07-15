const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtService = {
  createToken: (data) => {
    const token = jwt.sign({ data }, process.env.JWT_SECRET);

    return token;
  },

  validateToken: (token) => {
    if (!token) {
      const err = new Error('Token not found');
      err.name = 'UnauthorizedError';
      throw err;
    }

    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      err.message = 'Expired or invalid token';
      err.name = 'UnauthorizedError';
      throw err;
    }
  },
};

module.exports = jwtService;