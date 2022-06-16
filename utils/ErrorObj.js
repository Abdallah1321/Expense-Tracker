function errorObj(e) {
    return {
        statusCode: e.statusCode,
        error: {
            message: e.message
        }
    }
}
module.exports = errorObj