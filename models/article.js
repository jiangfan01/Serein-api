'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "标题必须填写" },
        notEmpty: { msg: "标题不能为空字符串" },
        len: { args: [2, 10], msg: "长度必须是2~10之间" }
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "内容必须填写" },
        notEmpty: { msg: "内容不能为空字符串" },
      },
    },
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};
