const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid email!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
    },
   {
        timestamps: true
    }
)

userSchema.statics.isEmailUnique = async function(email, excludedUserId) {
    // this = user instance of the schema
    const user = await this.findOne({ email, _id: { $ne: excludedUserId } })
    // console.log(!!user)
    return !!user
}

userSchema.statics.isUsernameUnique = async function(username, excludedUserId) {
    const user = await this.findOne({username, _id: {$ne: excludedUserId } })
    // console.log('isUsernameUnique: ', user)
    // console.log(!!user)
    return !!user
}

userSchema.methods.generateJWT = async function() {

}

userSchema.methods.isPasswordMatch = async function(password) {
    const user = this
    const isMatch = await bcrypt.compare(password, user.password)
    return isMatch
}

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    return userObj
}

const User = mongoose.model('user', userSchema)

module.exports = User