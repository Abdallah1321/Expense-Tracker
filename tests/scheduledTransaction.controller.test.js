
const request = require('supertest');
const jwt = require('jsonwebtoken')
const app = require('../index');
const User = require('../models/user.model')
const Wallet = require('../models/wallet.model')
const Schedule = require('../models/scheduledTransaction.model')

// const randtoken1 = crypto.randomBytes(32).toString('hex')
const mongoose = require("mongoose");
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

const ScheduledTransaction1 = {
    _id: TransactionID1,
    walletID: walletID1,
    value: 100,
    description: "test",
    type: "expense",
    NextTransactionDate: Date.now(),
    Recurring: false
};

const ScheduledTransaction2 = {
    _id: TransactionID2,
    walletID: walletID2,
    value: 100,
    description: "test",
    type: "e",
    NextTransactionDate: Date.now(),
    Recurring: false
};

const RecurringTransaction1 = {
    _id: TransactionID4,
    walletID: walletID1,
    value: 100,
    description: "test",
    type: "expense",
    NextTransactionDate: Date.now(),
    Recurring: true,
    typeScheduledTransaction: "weekly",
    transactionLength: 50
};


const RecurringTransaction3 = {
    _id: TransactionID3,
    walletID: walletID1,
    value: 100,
    description: "test",
    type: "expense",
    NextTransactionDate: Date.now(),
    Recurring: true,
    typeScheduledTransaction: "abc",
    transactionLength: 50
};



const RecurringTransaction5 = {
    value: "250",
    walletID: walletID1 ,
    description: "testcron 4",
    type: "expense",
    NextTransactionDate:"16380604100",
    Recurring: true
}



beforeAll(async () => {
    await User.deleteMany()
    await Wallet.deleteMany()
    await Schedule.deleteMany()
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
    Schedule.deleteMany()
})

beforeEach(async ()=> {
    await Schedule.deleteMany()
    await request(app).post('/auth/login').send({email : User1.email, password: User1.password})
})



test('should create scheduled transaction,', async () => {
    await
        request(app)
            .post('/scheduled/new')
            .auth(token, {type: 'bearer'})
            .send(ScheduledTransaction1)
            .expect(200)
})

test('should create recurring transaction,', async () => {
    await
        request(app)
            .post('/scheduled/new')
            .auth(token, {type: 'bearer'})
            .send(RecurringTransaction1)
            .expect(200)
})

test('should have error recurring transaction, missing length', async () => {
    await
        request(app)
            .post('/scheduled/new')
            .auth(token, {type: 'bearer'})
            .send(RecurringTransaction5)
            .expect(400)
})

test('should have error recurring transaction, invalid recurring type', async () => {
    await
        request(app)
            .post('/scheduled/new')
            .auth(token, {type: 'bearer'})
            .send(RecurringTransaction3)
            .expect(400)
})

test('should have error transaction, need to be in SharedAccounts', async () => {
    await
        request(app)
            .post('/scheduled/new')
            .auth(token, {type: 'bearer'})
            .send(ScheduledTransaction2)
            .expect(400)
})

test('get normal transaction', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .get(`/scheduled/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(200)
})


test('get transaction error must be valid ID', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .get(`/scheduled/${TransactionID2}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})


test('get transaction error must be in viewAccounts', async () => {
    await Schedule.create(ScheduledTransaction2)

    await
        request(app)
            .get(`/scheduled/${TransactionID2}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})

test('delete normal transaction', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .delete(`/scheduled/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(200)
})

test('delete error transaction, not valid ID', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .delete(`/scheduled/${TransactionID2}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})

test('delete error transaction, need to be in SharedAccounts', async () => {
    await Schedule.create(ScheduledTransaction2)

    await
        request(app)
            .delete(`/scheduled/${TransactionID2}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})

test('get all transactions', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .get(`/scheduled/all/${walletID1}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(200)
})


test('get all transactions err, must be in viewAccounts', async () => {
    await Schedule.create(ScheduledTransaction2)

    await
        request(app)
            .get(`/scheduled/all/${walletID2}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})

test('get all transactions err, must be valid ID', async () => {
    await Schedule.create(ScheduledTransaction2)

    await
        request(app)
            .get(`/scheduled/all/${walletID3}`)
            .auth(token, {type: 'bearer'})
            .send()
            .expect(400)
})

test('patch normal transaction', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .patch(`/scheduled/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send({description: "abc"})
            .expect(200)
})

test('patch  transaction, become recurring', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .patch(`/scheduled/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send({Recurring: true, typeScheduledTransaction: "daily", transactionLength: 50})
            .expect(200)
})


test('patch err transaction, must be in viewAccounts', async () => {
    await Schedule.create(ScheduledTransaction2)

    await
        request(app)
            .patch(`/scheduled/${TransactionID2}`)
            .auth(token, {type: 'bearer'})
            .send({description: "abc"})
            .expect(400)
})


test('patch err transaction, cannot update walletID ', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .patch(`/scheduled/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send({walletID: walletID1})
            .expect(400)
})

test('patch err transaction, insufficient info to become recurring', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .patch(`/scheduled/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send({Recurring: true})
            .expect(400)
})

test('patch err transaction, invalid typeScheduledTransaction to become recurring', async () => {
    await Schedule.create(ScheduledTransaction1)

    await
        request(app)
            .patch(`/scheduled/${TransactionID1}`)
            .auth(token, {type: 'bearer'})
            .send({Recurring: true, typeScheduledTransaction: "abc", transactionLength: 50})
            .expect(400)
})

//tests design : 
//CREATE TRANSACTION: create normal transaction, can create a recurring transaction, cannot create invalid recurring (missing recurring type or length)
// must be in sharedAccounts in wallet to do scheduled transactions
// UPDATE TRANSACTION: update normal transaction, cannot update walletID or _id in transactions, cannot update into recurring without (recurring type or length)
// must be in sharedAccounts in wallet to do scheduled transactions
// DELETE: must be valid ID, must be in sharedAccounts.
// GET: must be valid ID, must be in ViewAccounts
// GETALL: must be valid ID, must be in ViewAccounts


