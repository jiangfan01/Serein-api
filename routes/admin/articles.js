const express = require('express');
const router = express.Router();
const models = require('../../models');
const Op = models.Sequelize.Op
const {success, error} = require("../../utlis/messages")

/**
 * GET /admin/articles
 * 文章列表
 */
router.get('/', async function (req, res, next) {
    try {
        //  模糊搜索
        const where = {}
        // 定义搜索的关键词
        const title = req.query.title
        if (title) {
            where.title = {
                [Op.like]: `%${title}%`
            }
        }

        // 定义搜索的关键词
        const content = req.query.content
        if (content) {
            where.content = {
                [Op.like]: `%${content}%`
            }
        }

        // 分页器
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // 使用findAndCountAll方法返回结果
        const result = await models.Article.findAndCountAll({
            order: [["id",]],
            where: where,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        })
        // 数据处理
        const data = {
            articles: result.rows,
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
 * GET /admin/articles/:id
 * 单条文章
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询单条
        const article = await models.Article.findByPk(req.params.id)
        if (!article) {
            return error(res, "文章不存在")
        }
        success(res, "查询成功", {article})
    } catch (e) {
       error(res,e.message)
    }
})

/**
 * POST /admin/articles
 * 新增文章
 */
router.post('/', async function (req, res, next) {
    try{
        const article = await models.Article.create(req.body);
        const title = req.body.title
        const content = req.body.content
        if (!article) {
            return error(res, "文章不存在")
        }
        success(res,"新增成功", {article})
    }catch (e){
        const message = e.errors.map(error => error.message)
        error(res, message)
    }

})

/**
 * PUT /admin/articles
 * 修改文章
 */
router.put('/:id', async function (req, res, next) {
    try{
        const article = await models.Article.findByPk(req.params.id);
        const title = req.body.title
        const content = req.body.content
        if (!article){
            return error(res, "文章不存在")
        }
        article.update(req.body)
        success(res,"修改成功",article)
    }catch (e){
        error(res,e.message)
    }
})

/**
 * DELETE /admin/articles/:id
 * 删除文章
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const article = await models.Article.findByPk(req.params.id);
        article.destroy()
        success(res,"删除成功",)
    }catch (e){
        error(res,e.message)
    }

})

module.exports = router;
