const errorThrower = (message, name) => {
  const error = new Error(message);
  error.name = name;
  throw error;
};

module.exports = errorThrower;