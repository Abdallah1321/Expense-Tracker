const status = require("http-status");
const ApiError = require("../utils/ApiError");
const transaction = require("../models/transaction.model");
const wallet = require("../models/wallet.model")


const addExpense = async(body, userID) => {
    try {
        
        const old_wallet = await wallet.findById(body.walletID);

        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }

        if (!old_wallet.createdBy === userID){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        } else if(!old_wallet.sharedAccounts.includes(userID) && old_wallet.createdBy !== userID){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        } else {
            //console.log(body)
            //newDate = new Date(parseInt(body.transactionDate) * 1000)
            //console.log(newDate)
            const expense = await transaction.create({
                ...body,
                TransactionDate: new Date(body.TransactionDate).toISOString(),
                type: 'e'
            })

            await wallet.findOneAndUpdate({_id: body.walletID}, {
                $inc: {
                    "balance": -(expense.value)
                },
                $push: {
                    transactions: {
                        $each: [expense._id.toString()]
                    },
                }
            })
            return expense
        }

    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const updateExpense = async(id, userID ,body) => {
    try {
        const ops = Object.keys(body)
        if(ops.includes("walletID") || ops.includes("id") || ops.includes("_id") || ops.includes("userID") || ops.includes("type")){
            throw new ApiError(status.BAD_REQUEST,"Invalid parameters")
        }
        const doc = await transaction.findOne({
            _id: id,
            type: 'e'
        }).populate('walletID')
        if(!doc) {
            throw new ApiError(status.NOT_FOUND, "Transaction not found")
        }
        const old_wallet = await wallet.findById(doc.walletID);
        
        
        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }

        if (!old_wallet.sharedAccounts.includes(userID)){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        }
        
        if (body.hasOwnProperty("TransactionDate")){
            body.TransactionDate = new Date(body.TransactionDate * 1000)
        }

        if(ops.includes("value")) {
            const value = body.value
            const savedValue = doc.value
            doc.walletID.balance = (doc.walletID.balance + savedValue) - value
            doc.value = value
            ops.splice(ops.indexOf("value"),1)
        }

        ops.forEach((op) => {
            doc[op] = body[op]
        })
        doc.walletID.save()
        doc.save()
        return doc
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const deleteExpense = async(id, userID) => {
    try {
        const doc = await transaction.findOne({_id: id, 'type': 'e'}).populate('walletID')

        if(!doc) {
            throw new ApiError(status.NOT_FOUND, "Transaction not found")
        }

        const old_wallet = await wallet.findById(doc.walletID);
        
        
        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }

        if (!old_wallet.sharedAccounts.includes(userID)){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        }

        doc.walletID.balance = (doc.walletID.balance + doc.value)

        doc.walletID.transactions = doc.walletID.transactions.filter((id) => {
            return id !== doc.id
        })

        if (doc.walletID.transactions.includes(id)){
            const index = doc.walletID.transactions.indexOf(id);
            if (index !== -1) {
                doc.walletID.transactions.splice(index, 1);
            }
        }

        doc.walletID.save()
        const remove = doc.remove()

        if(remove){
            return doc
        } else {
            throw new ApiError(status.NOT_FOUND, 'Transaction not found!')
        }

    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const addProfit = async(body, userID) => {
    try {

        const old_wallet = await wallet.findById(body.walletID);
        
        
        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }

        if (!old_wallet.sharedAccounts.includes(userID) && old_wallet.createdBy !== userID){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        }

        const profit = await transaction.create({
            ...body,
            // TransactionDate: new Date(body.TransactionDate * 1000),
            TransactionDate: new Date(body.TransactionDate).toISOString(),
            type: 'p'
        })

        await wallet.findOneAndUpdate({_id: body.walletID}, {
            $inc: {
                "balance": profit.value
            },
            $push: {
                transactions: {
                    $each: [ profit._id.toString()]
                },
            }
        })

        return profit
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const updateProfit = async(id, userID, body) => {
    try {
        const ops = Object.keys(body)

        if(ops.includes("walletID") || ops.includes("id") || ops.includes("userID") || ops.includes("_id") || ops.includes("type")){
            throw new ApiError(status.BAD_REQUEST,"Invalid parameters")
        }

        const doc = await transaction.findOne({
            _id: id,
            type: 'p'
        }).populate('walletID')

        if(!doc) {
            throw new ApiError(status.NOT_FOUND, "Transaction not found")
        }
        const old_wallet = await wallet.findById(doc.walletID);
        
        
        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }

        if (!old_wallet.sharedAccounts.includes(userID)){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        }

        if (body.hasOwnProperty("TransactionDate")){
            body.TransactionDate = new Date(body.TransactionDate * 1000)
        }

        if(ops.includes("value")) {
            const value = body.value
            const savedValue = doc.value
            doc.walletID.balance = (doc.walletID.balance - savedValue) + value
            doc.value = value
            ops.splice(ops.indexOf("value"),1)
        }

        ops.forEach((op) => {
            doc[op] = body[op]
        })
        doc.walletID.save()
        doc.save()
        return doc
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const getTransaction = async(id, type) => {
    try {
        const doc = await transaction.findOne({_id: id})
        if(!doc) {
            throw new ApiError(status.NOT_FOUND, "Transaction not found")
        }
        return(doc)
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const deleteProfit = async(id, userID) => {
    try {
        const doc = await transaction.findOne({_id: id, 'type': 'p'}).populate('walletID')

        if(!doc) {
            throw new ApiError(status.NOT_FOUND, "Transaction not found")
        }

        const old_wallet = await wallet.findById(doc.walletID);
        
        
        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }

        if (!old_wallet.sharedAccounts.includes(userID) && old_wallet.createdBy !== userID){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        }

        doc.walletID.balance = (doc.walletID.balance - doc.value)

        doc.walletID.transactions = doc.walletID.transactions.filter((id) => {
            return id !== doc.id
        })
        if (doc.walletID.transactions.includes(id)){
            const index = doc.walletID.transactions.indexOf(id);
            if (index !== -1) {
                doc.walletID.transactions.splice(index, 1);
            }
        }
        

        doc.walletID.save()
        const remove = doc.remove()

        if(remove){
            return doc
        } else {
            throw new ApiError(status.NOT_FOUND, 'Transaction not found!')
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

module.exports = {
    addExpense,
    deleteExpense,
    updateExpense,
    addProfit,
    deleteProfit,
    updateProfit,
    getTransaction
}