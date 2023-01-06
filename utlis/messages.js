/**
 * 成功消息
 */
const success = (res, message = "", data = {}) => {
    return res.json({
        code: 20000,
        message,
        data
    })
}

/**
 * 错误消息
 */
const error = (res, err = "", code = 50000) => {
    let message = []

    // 如果是字符串，说明是用户直接传递的错误消息过来
    if (typeof err === "string") {
        message.push(err)
    }
    // 如果是模型验证错误
    else if (err.name === "SequelizeValidationError") {
        message = err.errors.map(item => item.message)
    }
    // 如果是其他异常，例如数据库缺少必须字段等
    else {
        message.push(err.message)
    }

    return res.json({
        code,
        message,
    })
}

module.exports = {
    success,
    error
}
