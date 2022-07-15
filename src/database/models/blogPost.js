const sequelize = require('sequelize');

const createBlogPost = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    published: DataTypes.DATE,
    updated: DataTypes.DATE,
  }, {
    tableName: 'BlogPosts',
    timestamps: false,
  });

  BlogPost.associate = (connection) => {
    BlogPost.belongsTo(connection.User,
      { foreignKey: 'userId', as: 'user' })
  }

  return BlogPost;
};

module.exports = createBlogPost;