const express = require('express');
const router = express.Router();
const models = require('../../models');
const Op = models.Sequelize.Op
const {success, error} = require("../../utlis/messages")

/**
 * GET /admin/courses
 * 课程列表
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

        // 查询推荐课程
        const recommended = req.query.recommended;
        if (recommended) {
            where.recommended = {
                [Op.eq]: recommended === "true"
            }
        }

        // 查询入门课程
        const introductory = req.query.introductory;
        if (introductory) {
            where.introductory = {
                [Op.eq]: introductory === "true"
            }
        }

        // 分页器
        const currentPage = parseInt(req.query.currentPage) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // 使用findAndCountAll方法返回结果
        const result = await models.Course.findAndCountAll({
            order: [["id",]],
            where: where,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        })
        // 数据处理
        const data = {
            courses: result.rows,
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
 * GET /admin/courses/:id
 * 单条课程
 */
router.get('/:id', async function (req, res, next) {
    try {
        // 查询单条
        const course = await models.Course.findByPk(req.params.id)
        if (!course) {
            return error(res, "课程不存在")
        }
        success(res, "查询成功", {course})
    } catch (e) {
        error(res, e.message)
    }
})

/**
 * POST /admin/courses
 * 新增课程
 */
router.post('/', async function (req, res, next) {
    try {

        //验证分类是否存在
        const category = await models.Category.findByPk(req.body.categoryId)
        if (!category) {
            return error(res, "分类不存在")
        }

        //验证用户是否存在
        const user = await models.User.findByPk(req.body.userId)
        if (!user) {
            return error(res, "所选择的用户不存在")
        }

        const course = await models.Course.create(req.body)
        success(res, "新增成功", {course})
    } catch (e) {
        const message = e.errors.map(error => error.message)
        error(res, message)
    }

})

/**
 * PUT /admin/courses
 * 修改课程
 */
router.put('/:id', async function (req, res, next) {
    try {
        //验证课程是否存在
        const course = await models.Course.findByPk(req.params.id);
        if (!course) {
            return error(res, "课程不存在")
        }
        //验证分类是否存在
        const category = await models.Category.findByPk(req.body.categoryId)
        if (!category) {
            return error(res, "分类不存在")
        }
        //验证用户是否存在
        const user = await models.User.findByPk(req.body.userId)
        if (!user) {
            return error(res, "所选择的用户不存在")
        }

        course.update(req.body)
        success(res, "修改成功", course)
    } catch (e) {
        error(res, e.message)
    }

})

/**
 * DELETE /admin/courses/:id
 * 删除课程
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const id = req.params.id
        const course = await models.Course.findByPk(id);
        if (!course) {
            return error(res, "课程不存在")
        }

        const chaptersCount = await models.Chapter.count({where: {"courseId": id}})
        if (chaptersCount > 0) {
            return error(res, "当前课程有章节，无法删除。请先将对应章节删除后，再来操作！")
        }

        course.destroy()
        success(res, "删除成功",)
    } catch (e) {
        error(res, e.message)
    }

})

module.exports = router;
