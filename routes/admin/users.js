const express = require('express');
const router = express.Router();
const models = require('../../models');
const Op = models.Sequelize.Op
const {success, error} = require("../../utlis/messages")
const bcrypt = require("bcryptjs");
const {where} = require("sequelize");


/**
 * GET /admin/users
 * 用户列表
 */
router.get('/', async function (req, res, next) {
    try {
        const where = {}
        // 模糊查询标题
        const username = req.query.username;

        if (username) {
            where.username = {
                [Op.like]: "%" + username + "%"
            }
        }

        // 分页器
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // 使用findAndCountAll方法返回结果
        const result = await models.User.findAndCountAll({
            order: [["id",]],
            where: where,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        })
        // 数据处理
        const data = {
            users: result.rows,
            pagination: {
                currentPage: currentPage,
                pageSize: pageSize,
                total: result.count
            }
        }
        success(res, "查询成功", data)
    } catch (e) {
        const message = e.errors.map(error => error.message)
        error(res, message)
    }
})

/**
 * GET /admin/users/me
 * 查询当前登录的用户信息
 */
router.get("/me", async function (req, res, next) {
    try {
        const user = await models.User.findByPk(req.decodead.user.id);
        success(res, "查询成功", {user})
    } catch (err) {
        error(res, err)
    }
});

/**
 * GET /admin/users/1
 * 查询单条
 */
router.get("/:id", async function (req, res, next) {
    try {
        const user = await models.User.findByPk(req.params.id);
        if (!user) {
            return error(res, "用户不存在")
        }
        success(res, "查询成功", {user})
    } catch (err) {
        error(res, err)
    }
});

/**
 * GET /admin/users/teacher
 * 查询当前登录的用户信息
 */
router.get("/teacher", async function (req, res, next) {
    try {
        const user = await models.User.findAll(

        );
        success(res, "查询成功", {user})
    } catch (err) {
        error(res, err)
    }
});

/**
 * POST /admin/users
 * 新增用户
 */
router.post("/", async function (req, res, next) {
    try {
        const password = req.body.password
        const passwordConfirm = req.body.passwordConfirm
        if (password !== passwordConfirm) {
            return error(res, "两次输入的密码不一致！")
        }

        // 1、生成盐 2、对密码进行加密
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = await models.User.create({
            ...req.body,
            password: hash
        })

        success(res, "新增成功", {user})
    } catch (err) {
        error(res, err)
    }
});


/**
 * PUT /admin/users
 * 修改用户
 */
router.put('/:id', async function (req, res, next) {
    try {
        const oldPassword = req.body.oldPassword
        const password = req.body.password
        const passwordConfirm = req.body.passwordConfirm
        const user = await models.User.findByPk(req.params.id)


        if (!oldPassword) {
            return error(res, "请输入原始密码")
        }

        if (password !== passwordConfirm) {
            return error(res, "两次密码不一致")
        }

        if (!bcrypt.compareSync(oldPassword, user.password)) {
            return error(res, "原始密码错误！")
        }

        if (!user) {
            return error(res, "当前用户不存在，无法修改！")
        }

        //取出加密后的密码
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        await user.update({
            ...req.body,
            password: hash
        })

        success(res, "修改成功", user)
    } catch (e) {
        error(res, e.message)
    }
})


module.exports = router;
