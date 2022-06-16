const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const walletSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transaction',
      required: true,
      default: []
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    // sharedAccounts: [
    //   {
    //     userID: {
    //       type: mongoose.Types.ObjectId,
    //       unique: true,
    //       ref: 'User'
    //     },
    //   },
    // ],
    //accounts allowed to edit wallet
    sharedAccounts: [{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        default: []
    }],
    //accounts allowed to view wallet
    viewAccounts: [{
      type: mongoose.Types.ObjectId,
      ref: 'user',
      default: [],
  }],

    balance: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: Boolean,
      default: 0
    },
    categories: {
      type: Array,
      default: []
    },
  },
  {
    timestamps: true,
  }
);

// walletSchema.pre('save', async function(next) {
//     const wallet = this
//
//     next()
// })


walletSchema.methods.toJSON = function () {
  const wallet = this;
  const walletObj = wallet.toObject();
  return walletObj;
};

const Wallet = mongoose.model("wallet", walletSchema);

module.exports = Wallet;
