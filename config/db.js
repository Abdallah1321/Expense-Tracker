const mongoose = require('mongoose')

// const clientP = mongoose.createConnection('mongodb://localhost:27017/myitraLocal').asPromise()

const clientP = mongoose.connect(process.env.MONGODB_URL).then((m) => {
    console.log('Connected to db!')
    return m.connection.getClient()
}).catch(e => console.log(`DB Connection Error: ${e}`))
module.exports = clientP
