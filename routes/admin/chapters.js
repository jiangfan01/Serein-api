const express = require('express');
const router = express.Router();
const models = require('../../models');
const Op = models.Sequelize.Op
const {success, error} = require("../../utlis/messages")

/**
 * GET /admin/chapters
 * 文章列表
 */
router.get('/', async function (req, res, next) {
    try {
        //  模糊搜索
        const where = {}

        //查询当前课程对应的章节
        const courseId = req.query.courseId;
        if (courseId) {
            where.courseId = {
                [Op.eq]: courseId
            }
        }

        // 模糊搜索标题
        const title = req.query.title
        if (title) {
            where.title = {
                [Op.like]: `%${title}%`
            }
        }

        // 分页器
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // 使用findAndCountAll方法返回结果
        const result = await models.Chapter.findAndCountAll({
            order: [["id",]],
            where: where,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        })
        // 数据处理
        const data = {
            chapters: result.rows,
            pagination: {
                currentPage: currentPage,
                pageSize: pageSize,
                total: result.count
            }
        }
        success(res, "查询成功", data)
    } catch (err) {
        error(res, err)
    }

})

/**
 * GET /admin/chapters/:id
 * 单条文章
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询单条
        const chapter = await models.Chapter.findByPk(req.params.id)
        if (!chapter) {
            return error(res, "文章不存在")
        }
        success(res, "查询成功", {chapter})
    } catch (err) {
        error(res, err)
    }
})

/**
 * POST /admin/chapters
 * 新增文章
 */
router.post('/', async function (req, res, next) {
    try{
        const course = await models.User.findByPk(req.body.courseId)
        if (!course) {
            return error(res, "所选择的章节不存在")
        }
        const chapter = await models.Chapter.create(req.body)
        success(res,"新增成功", {chapter})
    }catch (err) {
        error(res, err)
    }

})

/**
 * PUT /admin/chapters
 * 修改文章
 */
router.put('/:id', async function (req, res, next) {
    try{
        // 验证章节是否存在
        const chapter = await models.Chapter.findByPk(req.params.id);
        if (!chapter){
            return error(res, "章节不存在")
        }



        //验证课程是否存在
        const course = await models.User.findByPk(req.body.courseId)
        if (!course) {
            return error(res, "所选择的章节不存在")
        }

        chapter.update(req.body)
        success(res,"修改成功", {chapter})
    }catch (err) {
        error(res, err)
    }
})

/**
 * DELETE /admin/chapters/:id
 * 删除文章
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const chapter = await models.Chapter.findByPk(req.params.id);
        if (!chapter){
            return error(res, "章节不存在")
        }
        chapter.destroy()
        success(res,"删除成功",)
    }catch (err) {
        error(res, err)
    }

})

module.exports = router;
