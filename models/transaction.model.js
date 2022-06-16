const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

console.log('transaction model date.now: ', Date.now)

const transactionSchema = mongoose.Schema({
    value: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    TransactionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    walletID: {
        type: mongoose.Types.ObjectId,
        ref: 'wallet',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        default: []
    }
});

transactionSchema.methods.toJSON = function () {
    const transaction = this;
    const transactionObj = transaction.toObject();
    return transactionObj;
  };

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;