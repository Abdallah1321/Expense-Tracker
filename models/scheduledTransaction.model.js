const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const scheduledTransactionSchema = mongoose.Schema({
    walletID: {
        type: mongoose.Types.ObjectId,
        ref: 'wallet',
        required: true
    },
    value: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    //expense or profit
    type: {
        type: String,
        required: true
    },
    NextTransactionDate: {
        type: Date,
        required: true,
    },
    //is transaction recurring
    Recurring: {
        type: Boolean,
        required: true,
    }, // daily, weekly ,monthly
    typeScheduledTransaction: {
        type: String,
    },
    transactionLength: {
        type: Number,
        min: 1
    }
});


scheduledTransactionSchema.methods.toJSON = function () {
    const transaction = this;
    const transactionObj = transaction.toObject();
    return transactionObj;
};


const scheduledTransaction = mongoose.model('scheduledTransaction', scheduledTransactionSchema);
module.exports = scheduledTransaction;