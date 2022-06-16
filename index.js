// require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const app = express()
const consola = require('consola')
const cors = require('cors')
const passport = require('passport')
const db =  require("./config/db")
const passportSetup = require('./config/passport')
const authRouter = require('./routes/auth.route')
const walletRouter = require('./routes/wallet.route')
const transactionRouter = require('./routes/transaction.route')
const recurringRouter = require('./routes/scheduledTransaction.route')
const secRouter = require('./routes/sec.route')
const handleError = require('./middlewares/error.middleware')

const session = require('express-session');
const MongoStore = require('connect-mongo')
const sessionStore =  MongoStore.create({
    clientPromise: db,
    collectionName: 'sessions'
})

// app.use(cookieSession({
//     name: "session",
//     keys: "supersecretkey",
//     maxAge: 24 * 60 * 60 * 100
// }))
//
// app.use(cookieParser());
// app.use(cors({
//     origin: "http://localhost:3001",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//     credentials: true
// }))

app.use(cors())

app.use(session({
    name: "session",
    secret: 'supersecrettoken',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        sameSite: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 2
    }
}))



// app.use((req,res, next) => {
//     console.log('session: ', req.session)
//     next()
// })

app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Home Page");
});

app.use('/transaction', transactionRouter)
app.use('/auth',authRouter);
app.use('/wallet',walletRouter);
app.use('/user', secRouter)
app.use('/scheduled', recurringRouter)

app.use((err,req,res, next) => {
    handleError(err, res)
})

module.exports = app