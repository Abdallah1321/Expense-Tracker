class ApiError extends Error {
    constructor(statusCode, message, name,stack='', ...params) {
        super(message)
        this.statusCode = statusCode
        this.name = this.constructor.name
        console.log('name: ', this.message)
        if(stack){
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

        this.toJSON = function() {
            return {
                statusCode: this.statusCode,
                error: {
                    message: this.message.replace('ApiError: ', ''),
                }
            }
        }
    }
}

module.exports = ApiError