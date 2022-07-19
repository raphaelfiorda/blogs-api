const sequelize = require('sequelize');

const createPostCategory = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define('PostCategory', {
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  }, {
    tableName: 'PostCategories',
    timestamps: false,
  });

  PostCategory.associate = (connection) => {
    connection.BlogPost.belongsToMany(connection.Category, {
      through: PostCategory,
      foreignKey: 'postId',
      otherKey: 'categoryId',
      as: 'categories' });

    connection.Category.belongsToMany(connection.BlogPost, {
      through: PostCategory,
      foreignKey: 'categoryId',
      otherKey: 'postId',
      as: 'blogPost' });
  }

  return PostCategory;
};

module.exports = createPostCategory;