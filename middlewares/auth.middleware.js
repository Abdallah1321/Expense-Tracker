const jwt = require('jsonwebtoken')
const status = require('http-status')
const passport = require('passport')
const User = require('../models/user.model')
const ApiError = require('../utils/ApiError')

const auth = async(req,res,next) => {
    try{
        const token = req.header('Authorization').split[' '][1]
        const decoded = jwt.verify(token,'privatekey')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
        if(!user){
            throw new Error()
        }

        req.user = user
        next()

    } catch(e) {
        res.status(401).send({error: 'please auth'})
    }
}

const authPassport = (req,res,next) => {
    try {
        if(req.isAuthenticated()){
            next()
        }
        else {
            throw new ApiError(status.UNAUTHORIZED, "You are not authorized to view this resource")
        }
    } catch (e) {
        res.status(e.statusCode).send(e)
    }
}

const requireSignin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err || !user) {
            // err.code = 'CP_SI_ValidationFailed';
            return res.status(401).json({
                "statusCode": 401,
                "error": {
                    "message": "Username and/or password are incorrect"
                }
            }); // send the error response to client
        }

        req.logIn(user, (err) => {
            if(!user.isEmailVerified) {
                return res.status(403).json({
                    "statusCode": 401,
                    "error": {
                        "message": "Email not verified"
                    }
                })
            }
            next()
        })

        // else if(!user.isEmailVerified) {
        //     return res.status(403).json({
        //         "message": "Email not verified"
        //     })
        // }
        // return next(); // continue to next middleware if no error.
    })(req, res, next);
}

const requireAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false },(err, user, info) => {
        if(err || !user) {
            console.log(err)
            // err.code = 'CP_SI_ValidationFailed';
            return res.status(401).json({
                "statusCode": 401,
                "error": {
                    "message": "Unauthorized"
                }
            }); // send the error response to client
        }
        return next(); // continue to next middleware if no error.
    })(req, res, next);
}

module.exports = {
    auth, authPassport, requireAuth, requireSignin
}