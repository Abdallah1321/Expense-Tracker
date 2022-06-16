const status = require('http-status')
const nodemailer = require('nodemailer')
const crypto = require("crypto");

const ApiError = require('../utils/ApiError')
const User = require('../models/user.model')
const Token = require('../models/token.model')

let transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_APIKEY
    }
})

const createUser = async(userBody, host) => {
   try {
       // consola.info(userBody)
       // return
       if(await User.isUsernameUnique(userBody.username) || await User.isEmailUnique(userBody.email))
       {
           throw new ApiError(status.BAD_REQUEST, "Email/Username already taken")
       }
       else {
           console.log('user created')
           const user = await User.create(userBody)
           const token = await Token.create({
               userID: user._id,
               token: crypto.randomBytes(32).toString('hex'),
               controllerResponsible: 'userController'
           })

           const mailOptions = {
               from: 'no-reply@myitra.com',
               to: user.email,
               subject: 'Account Verification Link',
               text: 'Hello '+ userBody.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp://' + host + '/auth/confirmation/' + user.email + '/' + token.token + '\n\nThank You!\n'
           }

           const mail = await transporter.sendMail(mailOptions)

           if(mail) {
               return {
                   ...user.toJSON(),
                   message: `A verification email has been sent to ${user.email}. It will be expire after one day. If you didn't get the verification email. Click on Resend Verification Email.`
               }
           }
       }
   } catch (e) {
       throw new ApiError(status.BAD_REQUEST, e)
   }
    // return User
}

const confirmEmail = async(email, token) => {

    try {
        console.log(token)

        const tokenDoc = await Token.findOne({
            token: token
        })

        if(!tokenDoc) {
            throw new ApiError(status.FORBIDDEN, 'Your verification link may have expired. Please click on resend to verify your email')
        }

        const userDoc = await User.findOne({
            _id: tokenDoc.userID,
            email
        })

        if(!userDoc) {
            throw new ApiError(status.NOT_FOUND, "Couldn't fetch this resource")
        } else if(userDoc.isEmailVerified) {
            throw 'User is verified. Please log in'
        } else {
            console.log('isEmailVerified')
            userDoc.isEmailVerified = true
            userDoc.save()
            tokenDoc.remove()
            return 'User is verified'
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const resendLink = async(email, host) => {
    try {
        const userDoc = await User.findOne({
            email
        })

        if(!userDoc) {
            throw new ApiError(status.NOT_FOUND, "Couldn't fetch this resource")
        } else if(userDoc.isEmailVerified) {
            throw new ApiError(status.ACCEPTED, 'This account has been already verified. Please log in!')
        }

        await Token.deleteMany({
            userID: userDoc._id
        })

        const token = await Token.create({
            userID: userDoc._id,
            token: crypto.randomBytes(32).toString('hex'),
            controllerResponsible: 'userController'
        })

        const mailOptions = {
            from: 'no-reply@myitra.com',
            to: userDoc.email,
            subject: 'Account Verification Link',
            text: 'Hello '+ userDoc.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp://' + host + '/auth/confirmation/' + userDoc.email + '/' + token.token + '\n\nThank You!\n'
        }

        const mail = await transporter.sendMail(mailOptions)

        if(mail) {
            return {
                message: `A verification email has been sent to ${userDoc.email}. It will be expire after one day. If you didn't get the verification email. Click on Resend Verification Email.`
            }
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const addAccessToken = async(id, token) => {
    const user = await User.findById(id)
    user.tokens = user.tokens.concat({token})
    const docStatus = await user.save()
    if(docStatus) {
        return 200
    }
    return 500
}

const getUserById = async(id) => {
    return User.findById(id)
}

const getUserByEmail = async(email) => {
    return User.findOne({email})
}

const getUserbyUsername = async(username) => {
    return User.findOne({username: username})
}

module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    getUserbyUsername,
    confirmEmail,
    resendLink,
    addAccessToken
}