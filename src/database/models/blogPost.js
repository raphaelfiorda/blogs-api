const sequelize = require('sequelize');

const createBlogPost = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    published: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'BlogPosts',
    timestamps: false,
  });

  BlogPost.associate = (connection) => {
    BlogPost.belongsTo(connection.User,
      { foreignKey: 'userId', as: 'user' });
  }

  return BlogPost;
};

module.exports = createBlogPost;