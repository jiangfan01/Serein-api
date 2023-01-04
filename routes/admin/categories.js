const express = require('express');
const router = express.Router();
const models = require('../../models');
const Op = models.Sequelize.Op
const {success, error} = require("../../utlis/messages")

/**
 * GET /admin/categories
 * 文章列表
 */
router.get('/', async function (req, res, next) {
    try {
        //  模糊搜索
        const where = {}
        // 定义搜索的关键词
        const name = req.query.title
        if (name) {
            where.name = {
                [Op.like]: `%${name}%`
            }
        }

        const result = await models.Category.findAll()
        success(res, "查询成功", result)
    } catch (e) {
        const message = e.errors.map(error => error.message)
        error(res, message)
    }

})

/**
 * GET /admin/categories/:id
 * 单条文章
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询单条
        const category = await models.Category.findByPk(req.params.id)
        if (!category) {
            return error(res, "文章不存在")
        }
        success(res, "查询成功", {category})
    } catch (e) {
        error(res,e.message)
    }
})

/**
 * POST /admin/categories
 * 新增文章
 */
router.post('/', async function (req, res, next) {
    try{
        const category = await models.Category.create(req.body);
        const title = req.body.title
        const content = req.body.content
        if (!category) {
            return error(res, "请填写")
        }
        success(res,"新增成功", {category})
    }catch (e){
        const message = e.errors.map(error => error.message)
        error(res, message)
    }

})

/**
 * PUT /admin/categories
 * 修改文章
 */
router.put('/:id', async function (req, res, next) {
    try{
        const category = await models.Category.findByPk(req.params.id);
        category.update(req.body)
        success(res,"修改成功",category)
    }catch (e){
        error(res,e.message)
    }
})

/**
 * DELETE /admin/categories/:id
 * 删除文章
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const category = await models.Category.findByPk(req.params.id);
        category.destroy()
        success(res,"删除成功",)
    }catch (e){
        error(res,e.message)
    }

})

module.exports = router;
