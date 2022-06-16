// import supertest from "supertest";
// import app from "../index.js";



const { TestWatcher } = require('jest');
const request = require('supertest');
const jwt = require('jsonwebtoken')
const crypto = require("crypto");
const app = require('../index');
const User = require('../models/user.model')


// const randtoken1 = crypto.randomBytes(32).toString('hex')
const mongoose = require("mongoose");
const { EXPECTATION_FAILED } = require('http-status');
const UserID1 = mongoose.Types.ObjectId();
const UserID2 = mongoose.Types.ObjectId();



const body = { _id: UserID1 };
// const body2 = {_id: UserID2}
const token = jwt.sign({user: body}, process.env.JWT_SECRET, {
    expiresIn: 604800 // 604800 = one week
})
const token2 = jwt.sign({user: body}, process.env.JWT_SECRET, {
    expiresIn: 604800 // 604800 = one week
})


const User1 = {
    _id: UserID1,
    username: "user",
    name: "user",
    password: "12345678",
    isEmailVerified: true,
    email: "user@123.com",
    tokens: [{token : token}],
    token: token
}

const User2 = {
    _id: UserID2,
    username: "user2",
    name: "user2",
    password: "12345678",
    isEmailVerified: true,
    email: "user2@123.com",
    tokens: [{token : token2}],
    token: token2
}

const UserInput = {
    username: "hami",
    name: "youssef",
    password: "12345678",
    email: "you@123.com"
}

const InvalidInput = {
    username: "hami",
    name: "youssef",
    password: "12345678",
}

beforeEach(async () => {
  await User.deleteMany({});
});


test('should sign up,', async () => {
    await
        request(app)
            .post('/auth/signup')
            .auth(token, {type: 'bearer'})
            .send(UserInput)
            .expect(200)
})


test('should not sign up, needs valid input', async () => {
    await
        request(app)
            .post('/auth/signup')
            .auth(token, {type: 'bearer'})
            .send(InvalidInput)
            .expect(400)
})

test('sign in, valid login', async () => {
    await User.create(User1)
    await request(app).post('/auth/login').send({email : User1.email, password: User1.password}).expect(200)
})

test('no sign in, invalid login', async () => {
    await User.create(User1)
    await request(app).post('/auth/login').send({email : User1.email, password: "abcdefg"}).expect(401)
})

test('logout successfully', async () => {
    await User.create(User1)
    await request(app).post('/auth/login').send({email : User1.email, password: User1.password})
    await request(app).post('/auth/logout').auth(token, {type: 'bearer'}).send().expect(200)
})


