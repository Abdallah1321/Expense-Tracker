const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20")
const LocalStrategy = require('passport-local')
// const jwt = require('jsonwebtoken')
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user.model')

const verifyCallback = async(email,pass,done) => {

    User.findOne({email})
        .then(async(user) => {

            console.log('verifyCallback: ', user)

            if(!user) {
                console.log('verifyCallback error')
                return done(null, false)
            }

            const validPass = await user.isPasswordMatch(pass)

            if(validPass) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
}

const jwtCallback = async(token, done) => {
    try {
        return done(null, token.user)
    } catch (e) {
        done(e)
    }
}

passport.serializeUser((user,done) => {
    done(null, user.id)
})

passport.deserializeUser(async(id,done) => {
    try {
        const user = await User.findById(id)
        if(user) {
            done(null, user)
        }
    } catch (e) {
        done(e)
    }
})

passport.use(new GoogleStrategy({
        // options
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // callback
        console.log(profile)
    })
)

passport.use(new LocalStrategy({
    usernameField: 'email'
}, verifyCallback))

passport.use(new JWTstrategy({
    secretOrKey: process.env.JWT_SECRET,
    // algorithms: ['HS256'],
    passReqToCallback: true,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, async(req, token, done) => {

    try{
        req.user = token.user
        return done(null, token.user)
    } catch (e) {
        done(e)
    }
}))