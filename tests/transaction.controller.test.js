
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
const TransactionID1 = mongoose.Types.ObjectId();
const TransactionID2 = mongoose.Types.ObjectId();
const TransactionID3 = mongoose.Types.ObjectId();
const TransactionID4 = mongoose.Types.ObjectId();


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
    categories: []
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

const Transaction1 = {
    _id: TransactionID1,
    walletID: walletID1,
    value: 100,
    description: "test",
    type: "e",
    TransactionDate: Date.now()
};

const Transaction3 = {
    _id: TransactionID1,
    walletID: walletID1,
    value: 100,
    description: "test",
    type: "p",
    TransactionDate: Date.now()
};

const Transaction2 = {
    _id: TransactionID2,
    walletID: walletID2,
    value: 100,
    description: "test",
    type: "e",
    TransactionDate: Date.now()
};


const TransactionInput = {
    value: "250",
    walletID: walletID1 ,
    description: "testcron 4",
    TransactionDate:"163806",
}

const TransactionInput2 = {
    value: "250",
    walletID: walletID2 ,
    description: "testcron 4",
    TransactionDate:"163806",
}

const InvalidInput = {
    walletID: walletID1 ,
    description: "testcron 4",
    TransactionDate:"163806",
}

beforeAll(async () => {
    await User.deleteMany()
    await Wallet.deleteMany()
    await Transaction.deleteMany()
    await User.create(User1)
    await Wallet.create(Wallet1)
    await User.create(User2)
    await Wallet.create(Wallet2)
    await
        request(app)
            .post('/auth/login')
            .send({email : User1.email, password: User1.password})
})

afterAll(() => {
    User.deleteMany()
    Wallet.deleteMany()
    Transaction.deleteMany()
})


beforeEach(async ()=> {
    await Transaction.deleteMany()
    await request(app).post('/auth/login').send({email : User1.email, password: User1.password})
})



test('should create expense transaction,', async () => {
    await
        request(app)
            .post('/transaction/expense')
            .auth(token, {type: 'bearer'})
            .send(TransactionInput)
            .expect(200)
})

test('should create profit transaction,', async () => {
    await
        request(app)
            .post('/transaction/profit')
            .auth(token, {type: 'bearer'})
            .send(TransactionInput)
            .expect(200)
})

test('error invalid profit transaction,', async () => {
    await
        request(app)
            .post('/transaction/profit')
            .auth(token, {type: 'bearer'})
            .send(InvalidInput)
            .expect(400)
})

test('error invalid expense transaction,', async () => {
    await
        request(app)
            .post('/transaction/expense')
            .auth(token, {type: 'bearer'})
            .send(InvalidInput)
            .expect(400)
})

test('should have error expense, need to be in SharedAccounts', async () => {
    await
        request(app)
            .post('/transaction/expense')
            .auth(token, {type: 'bearer'})
            .send(TransactionInput2)
            .expect(400)
})

test('should have error profit, need to be in SharedAccounts', async () => {
    await
        request(app)
            .post('/transaction/expense')
            .auth(token, {type: 'bearer'})
            .send(TransactionInput2)
            .expect(400)
})



test('get normal transaction', async () => {
    await Transaction.create(Transaction1)

    await
        request(app)
            .get(`/transaction/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(200)
})

test('error need valid id to get transaction', async () => {
    await Transaction.create(Transaction1)

    await
        request(app)
            .get(`/transaction/${TransactionID3}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})




test('delete expense', async () => {
    await Transaction.create(Transaction1)

    await
        request(app)
            .delete(`/transaction/expense/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(200)
})

test('delete profit', async () => {
    await Transaction.create(Transaction3)

    await
        request(app)
            .delete(`/transaction/profit/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(200)
})

test('delete profit error needs valid id', async () => {
    await Transaction.create(Transaction3)

    await
        request(app)
            .delete(`/transaction/profit/${TransactionID3}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})

test('delete expense error needs valid id', async () => {
    await Transaction.create(Transaction3)

    await
        request(app)
            .delete(`/transaction/expense/${TransactionID3}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})



