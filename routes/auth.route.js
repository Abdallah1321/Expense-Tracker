const express = require('express')
const router = express.Router()
const passport = require('passport')
const status = require('http-status')
const jwt = require('jsonwebtoken')
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')
const {authPassport, requireSignin, requireAuth} = require('../middlewares/auth.middleware')

router.get('/confirmation/resend/:email', async(req, res,next) => {
    try {
        res.send( await userController.resendLink(req.params.email, req.headers.host))
    } catch(e) {
        next(e)
    }

})

router.get('/confirmation/:email/:token', async(req,res, next) => {
    try {
        res.send(await userController.confirmEmail(req.params.email, req.params.token))
    } catch(e) {
        next(e)
    }
})

router.post('/login', requireSignin, async(req, res, next) => {
    try {
        const newUser = req.user
        const body = { _id: newUser._id };
        const token = jwt.sign({user: body}, process.env.JWT_SECRET, {
            expiresIn: 604800 // 604800 = one week,
            // expiresIn: 1 // 604800 = one week
        })

        await userController.addAccessToken(newUser._id, token)

        res.json({
            ...newUser.toJSON(),
            token
        })
    } catch(e) {
        next(e)
    }
})

router.post('/logout', requireAuth, (req,res, next) => {
   try {
       req.logout()
       res.send({
           message: "logged out successfully!"
       })
   } catch(e) {
       next(e)
   }
})

// router.get('/loginFailure', (req, res) => {
//     res.status(400).send({
//         message: "Login failure"
//     })
// })

// router.post('/check', requireAuth, (req, res) => {
//     res.status(200).send({
//         auth: true,
//         user: req.user,
//         cookies: req.cookies
//     })
// })

router.post('/signup', async(req, res, next) => {
    try{
        const user = await userController.createUser(req.body, req.headers.host)
        console.log('signed up!')
        // res.cookie('id', user.id, { signed: false, httpOnly: false });
        res.send({
            'message': 'signed up successfully!',
            user
        })
    } catch (e) {
        next(e)
    }
})

router.get('/test', requireAuth, (req,res) => {
    res.send("<h1>You reached a supersecret route</h1>")
})

// router.get('/login-failure', (req, res, next) => {
//     res.send('You entered the wrong password.');
// });

// Passport Google
// router.get('/google', passport.authenticate('google', {
//     scope: ["profile", "email"]
// }))
//
// //google callback
// router.get('/google/redirect', passport.authenticate("google"),(req,res) => {
//     res.send('you reached a callback uri')
// })

module.exports = router