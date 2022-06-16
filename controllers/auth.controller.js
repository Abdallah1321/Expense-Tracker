const consola = require('consola')
const status = require('http-status')
const ApiError = require('../utils/ApiError')
const UserController = require('../controllers/user.controller')

const loginUser = async(userBody) => {
    const user = await UserController.getUserbyUsername(userBody.username)
    if(!user || !(await user.isPasswordMatch(userBody.password))){
        throw new ApiError(status.UNAUTHORIZED, "Incorrect email or password")
    }
    return user
}

module.exports = {
    loginUser
}