const express = require("express");
const router = express.Router();
const models = require("../models");
const Op = models.Sequelize.Op
const {success, error} = require("../utlis/messages")
const bcrypt = require("bcryptjs");

/**
 * GET /users/me
 * 查询当前登录的用户信息
 */
router.get("/me", async function (req, res, next) {
    try {
        const user = await models.User.findOne({
            where: {id: req.decoded.user.id},
            //不返回密码和管理员给前端
            attributes: {exclude: ["password", "admin"]}
        });
        success(res, "查询成功", {user})
    } catch (err) {
        error(res, err)
    }
});

/**
 * GET /users/likes
 * 查询当前登录的喜欢
 */
router.get("/likes", async function (req, res, next) {
    try {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await models.Like.findAndCountAll({
            order: [["id", "DESC"]],
            where: {userId: req.decoded.user.id},
            include: [
                {
                    model: models.Course,
                    as: "course",
                    attributes: ["id", "name", "image", "content", "createdAt"]
                }
            ],
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        })

        const courses = result.rows.map(item => item.course)
        success(res, "查询成功", {
            courses,
            pagination: {
                currentPage,
                pageSize,
                total: result.count
            }
        })
    } catch (err) {
        error(res, err)
    }
});

/**
 * GET /users/histories
 * 查询当前登录的浏览历史
 */
router.get("/histories", async function (req, res, next) {
    try {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await models.History.findAndCountAll({
            order: [["id", "DESC"]],
            where: {userId: req.decoded.user.id},
            include: [
                {
                    model: models.Course,
                    as: "course",
                    attributes: ["id", "name", "image", "content", "createdAt"]
                },
                {
                    model: models.Chapter,
                    as: "chapter",
                    attributes: ["id", "title"]
                },
            ],
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        })
        const histories = result.rows.map(item => ({course: item.course, chapter: item.chapter}))
        success(res, "查询成功", {
            histories,
            pagination: {
                currentPage,
                pageSize,
                total: result.count
            }
        })
    } catch (err) {
        error(res, err)
    }
});


module.exports = router;
