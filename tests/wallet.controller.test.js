
const { TestWatcher } = require('jest');
const request = require('supertest');
const jwt = require('jsonwebtoken')
const crypto = require("crypto");
const app = require('../index');
const User = require('../models/user.model')
const Wallet = require('../models/wallet.model')
const Transaction = require('../models/transaction.model')

// const randtoken1 = crypto.randomBytes(32).toString('hex')
const mongoose = require("mongoose");
const { EXPECTATION_FAILED } = require('http-status');
const walletID1 = mongoose.Types.ObjectId();
const walletID2 = mongoose.Types.ObjectId();
const walletID3 = mongoose.Types.ObjectId();
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


const Wallet1 = {
    _id : walletID1,
    name: "wallet1",
    transactions: [],
    createdBy: UserID1,
    sharedAccounts: [UserID1],
    viewAccounts: [UserID1],
    balance: 0,
    status: false,
    categories: ["123"]
}

const Wallet2 = {
    _id : walletID2,
    name: "wallet1",
    transactions: [],
    createdBy: UserID2,
    sharedAccounts: [UserID2],
    viewAccounts: [UserID2],
    balance: 0,
    status: false,
    categories: []
}




const WalletInput = {
    name: "wallet"
}


beforeAll(async () => {
    await User.deleteMany()
    await Wallet.deleteMany()
    await User.create(User1)
    await User.create(User2)
    await
        request(app)
            .post('/auth/login')
            .send({email : User1.email, password: User1.password})
})

afterAll(() => {
    User.deleteMany()
    Wallet.deleteMany()
})


beforeEach(async ()=> {
    await Wallet.deleteMany()
    await request(app).post('/auth/login').send({email : User1.email, password: User1.password})
})



test('should create wallet,', async () => {
    await
        request(app)
            .post('/wallet/new')
            .auth(token, {type: 'bearer'})
            .send(WalletInput)
            .expect(200)
})


test('should get wallet,', async () => {
    
    await Wallet.create(Wallet1)

    
    await
        request(app)
            .get(`/wallet/${walletID1}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(200)
})

test('need to be authorized get wallet,', async () => {
    
    await Wallet.create(Wallet2)

    
    await
        request(app)
            .get(`/wallet/${walletID2}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})

test('need valid id get wallet,', async () => {
    
    await Wallet.create(Wallet1)

    
    await
        request(app)
            .get(`/wallet/${walletID2}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})



test('delete wallet', async () => {
    await Wallet.create(Wallet1)

    await
        request(app)
            .delete(`/wallet/${walletID1}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(200)
})

test('need valid id to delete wallet', async () => {
    await Wallet.create(Wallet1)

    await
        request(app)
            .delete(`/wallet/${walletID2}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})

test('update wallet', async () => {
    await Wallet.create(Wallet1)

    await
        request(app)
            .patch(`/wallet/${walletID1}`)
            .auth(token, {type: 'bearer'})
            .send({ name : "wallet2"})
            .expect(200)
})

test('cannot update created by', async () => {
    await Wallet.create(Wallet1)

    await
        request(app)
            .patch(`/wallet/${walletID1}`)
            .auth(token, {type: 'bearer'})
            .send({ createdBy : UserID2})
            .expect(400)
})

test('add category', async () => {
    await Wallet.create(Wallet1)

    await
        request(app)
            .put(`/wallet/${walletID1}/newcategory`)
            .auth(token, {type: 'bearer'})
            .send({ category : "abc"})
            .expect(200)
})

test('remove category', async () => {
    await Wallet.create(Wallet1)

    await
        request(app)
            .patch(`/wallet/${walletID1}/deletecategory`)
            .auth(token, {type: 'bearer'})
            .send({ category : "123"})
            .expect(200)
})

test('cannot remove non existent category', async () => {
    await Wallet.create(Wallet1)

    await
        request(app)
            .patch(`/wallet/${walletID1}/deletecategory`)
            .auth(token, {type: 'bearer'})
            .send({ category : "hello"})
            .expect(404)
})



// test('delete profit', async () => {
//     await Transaction.create(Transaction3)

//     await
//         request(app)
//             .delete(`/transaction/profit/${TransactionID1}`)
//             .auth(token, {type: 'bearer'})
//             .send()
//             .expect(200)
// })

// test('delete profit error needs valid id', async () => {
//     await Transaction.create(Transaction3)

//     await
//         request(app)
//             .delete(`/transaction/profit/${TransactionID3}`)
//             .auth(token, {type: 'bearer'})
//             .send()
//             .expect(400)
// })

// test('delete expense error needs valid id', async () => {
//     await Transaction.create(Transaction3)

//     await
//         request(app)
//             .delete(`/transaction/expense/${TransactionID3}`)
//             .auth(token, {type: 'bearer'})
//             .send()
//             .expect(400)
// })



