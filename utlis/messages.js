/**
 * 成功消息
 */
const success = (res, message = '', data = {}) => {
    return res.json({
        code: 20000,
        message,
        data
    })
}

/**
 * 错误消息
 */
const error = (res, message = '', code = 50001) => {
    return res.json({
        code: code,
        message,
    })
}

module.exports = {
    success,
    error
}
