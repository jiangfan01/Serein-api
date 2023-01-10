'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chapter.init({
    courseId: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "标题必须填写" },
        notEmpty: { msg: "标题不能为空字符串" },
        len: { args: [2, 45], msg: "长度必须是2~45之间" }
      },
    },
    video: DataTypes.STRING,
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "排序必须填写" },
        notEmpty: { msg: "排序不能为空字符串" },
        len: { args: [2, 10], msg: "长度必须是2~10之间" },
        isInt: { msg: "排序必须是整数" },
      },
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};
