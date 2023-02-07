const express = require('express');
const router = express.Router();
const models = require('../../models');
const {success, error} = require("../../utlis/messages")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")

/**
 * POST /admin/auth
 * 登录
 */
router.post("/", async function (req, res, next) {
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

        // 通过用户名查询用户是否是管理员和用户是否存在
        const user = await models.User.findOne({ where: { username } })
        if (!user || !user.admin) {
            return error(res, "用户不存在，请联系管理员！")
        }

        // 再比对密码是否正确
        if (!bcrypt.compareSync(password, user.password)) {
            return error(res, "密码错误！")
        }

        // token包生产token
        const token = jwt.sign({
            //对user的id和admin进行加密
            user: {
                id: user.id,
                admin: user.admin
            }
        }, process.env.SECRET, { expiresIn: "7d" });
        //  env.SECRET在环境变量中定义
        success(res, "登录成功", { token })
    } catch (err) {
        error(res, err)
    }
});

module.exports = router;
