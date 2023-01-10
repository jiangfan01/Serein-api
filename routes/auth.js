const express = require('express');
const router = express.Router();
const models = require('../models');
const {success, error} = require("../utlis/messages")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");


/**
 * POST /auth/sign_up
 * 注册
 */
router.post("/sign_up", async function (req, res, next) {
    try {

        //获取账号密码进行验证
        const username = req.body.username
        const password = req.body.password

        if (!username) {
            return error(res, "用户名必须填写！")
        }

        if (!password) {
            return error(res, "密码必须填写！")
        }

        // 1、生成盐 2、对密码进行加密
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = await models.User.create({
            ...req.body,
            password: hash,
            admin: false
        })
        success(res, "注册成功", { user })
    } catch (err) {
        error(res, err)
    }
});

/**
 * POST /auth/sign_in
 * 登录
 */
router.post("/sign_in", async function (req, res, next) {
    try {
        const username = req.body.username
        const password = req.body.password

        if (!username) {
            return error(res, "用户名必须填写！")
        }

        if (!password) {
            return error(res, "密码必须填写！")
        }

        // 先通过用户名查询
        const user = await models.User.findOne({ where: { username } })
        if (!user) {
            return error(res, "用户不存在，请联系管理员！")
        }

        // 再比对密码是否正确
        if (!bcrypt.compareSync(password, user.password)) {
            return error(res, "密码错误！")
        }

        const token = jwt.sign({
            user: {
                id: user.id,
                admin: user.admin
            }
        }, process.env.SECRET, { expiresIn: "7d" });

        success(res, "登录成功", { token })
    } catch (err) {
        error(res, err)
    }
});
module.exports = router;
