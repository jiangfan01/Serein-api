const express = require("express");
const router = express.Router();
const models = require("../models");
const { success, error } = require("../utlis/messages")
const qiniu = require("qiniu")

/**
 * GET /uploads
 * 上传图片
 */
router.get('/', async function (req, res, next) {
    try {
        //七牛AccessKey密钥和secretKey密钥
        const accessKey = process.env.ACCESS_KEY;
        const secretKey = process.env.SECRET_KEY;
        const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        //options要上传到七牛的哪个空间
        const options = {
            scope: process.env.SCOPE,
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        //生成上传的token返回
        const uploadToken = putPolicy.uploadToken(mac);
        success(res, "生成上传 Token 成功", { uploadToken })
    } catch (err) {
        error(res, err)
    }
})


module.exports = router;
