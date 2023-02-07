'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Course.belongsTo(models.Category,{as:"category",foreignKey:"categoryId"})
      models.Course.belongsTo(models.User,{as:"user",foreignKey:"userId"})
      models.Course.hasMany(models.Chapter,{as:"chapter"})
    }
  }
  Course.init({
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "分类必须填写" },
        notEmpty: { msg: "分类不能为空字符串" },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "分类必须选择" },
        notEmpty: { msg: "分类不能为空字符串" },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "名称必须填写" },
        notEmpty: { msg: "名称不能为空字符串" },
        len: { args: [2, 10], msg: "长度必须是2~10之间" }
      },
    },
    image: DataTypes.STRING,
    recommended: DataTypes.BOOLEAN,
    introductory: DataTypes.BOOLEAN,
    content: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};
