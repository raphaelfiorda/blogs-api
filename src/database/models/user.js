const sequelize = require('sequelize');

const createUser = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    displayName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    tableName: 'Users',
    timestamps: false,
  });

  User.associate = (connection) => {
    User.hasMany(connection.BlogPost,
      { foreignKey: 'userId', as: 'blogPost' })
  }

  return User;
};

module.exports = createUser;