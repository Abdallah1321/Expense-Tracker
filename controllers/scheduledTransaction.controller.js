const status = require("http-status");
const cron = require('node-cron');
const ApiError = require("../utils/ApiError");
const scheduledTransaction = require("../models/scheduledTransaction.model");
const mongoose = require('mongoose');
const wallet = require("../models/wallet.model");
const transaction = require("../models/transaction.model")
const acceptedTypes = ["daily", "weekly", "monthly"];
const transactionController = require('./transaction.controller')


const createScheduledTransaction = async function(scheduledTransactionBody, userID) {
    try {
        //verify validity
        if (scheduledTransactionBody.Recurring == false){
            if (scheduledTransactionBody.hasOwnProperty("typeScheduledTransaction")){
                delete scheduledTransactionBody.typeScheduledTransaction;
            }
            if (scheduledTransactionBody.hasOwnProperty("transactionLength")){
                delete scheduledTransactionBody.transactionLength;
            }
        } else {
            if (!scheduledTransactionBody.hasOwnProperty("typeScheduledTransaction") ||
                !scheduledTransactionBody.hasOwnProperty("transactionLength")){
                throw new ApiError(status.BAD_REQUEST,"Invalid parameters");
            }
        }
        //console.log(scheduledTransactionBody.typeScheduledTransaction)

        if (scheduledTransactionBody.hasOwnProperty("typeScheduledTransaction")){
            if (scheduledTransactionBody.typeScheduledTransaction != "daily" &&
                scheduledTransactionBody.typeScheduledTransaction != "weekly" &&
                scheduledTransactionBody.typeScheduledTransaction != "monthly"){
                throw new ApiError(status.BAD_REQUEST,"Invalid type of scheduled transaction");
            }
        }
        //console.log("transaction1")
        const old_wallet = await wallet.findById(scheduledTransactionBody.walletID);

        if (scheduledTransactionBody.type != "expense" && scheduledTransactionBody.type != "profit"){
            throw new ApiError(status.BAD_REQUEST, "Invalid type")
        }

        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }
        //verify privacy
        if (!old_wallet.sharedAccounts.includes(userID)){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        }
        //console.log("transaction2")
        return await scheduledTransaction.create({
            ...scheduledTransactionBody,
            NextTransactionDate: new Date(scheduledTransactionBody.NextTransactionDate * 1000)
        });
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
};

// const getScheduledTransactionById = async (id, userID) => {
//     console.log(1)
//     try {
//         const scheduledTransactionDoc = await scheduledTransaction.findById(id);
//         console.log(scheduledTransactionDoc)

//         if(!scheduledTransactionDoc){
//             return new ApiError(status.NOT_FOUND, "scheduled Transaction not found!")
//         }


//         const old_wallet = await wallet.findById(scheduledTransactionDoc.walletID);

//         if (!old_wallet.viewAccounts.includes(userID)){
//             return new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
//         }
//         return scheduledTransactionDoc
//     } catch (e) {
//         throw new ApiError(status.BAD_REQUEST, e)
//     }
// };

const getScheduledTransactionById = async(id, userID) => {
    try{

        const doc = await scheduledTransaction.findOne({_id: id})

        if(!doc) {
            throw new ApiError(status.NOT_FOUND, "Transaction not found")
        }

        const old_wallet = await wallet.findById(doc.walletID);


        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }

        if (!old_wallet.viewAccounts.includes(userID)){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        }

        return doc;

    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const deleteScheduledTransactionById = async(id, userID) => {
    try{

        const doc = await scheduledTransaction.findOne({_id: id})

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

        const remove = doc.remove()

        if(remove){
            return "Transaction has been deleted successfully"
        } else {
            throw new ApiError(status.NOT_FOUND, 'Transaction not found!')
        }


        // const scheduledTransactionDoc = await scheduledTransaction.findOneAndRemove({_id: id})

        // if(scheduledTransactionDoc){
        //     return "DWBI Success"
        // } else {
        //     return new ApiError(status.NOT_FOUND, 'scheduled Transaction not found!')
        // }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}



const updateScheduledTransactionById = async (id,body, userID) => {
    try {

        const ops = Object.keys(body)
        if(ops.includes("walletID") || ops.includes("id") || ops.includes("_id") || ops.includes("userID") || ops.includes("type")){
            throw new ApiError(status.BAD_REQUEST,"Invalid parameters")
        }
        InitialTransaction = await scheduledTransaction.findById(id)

        if (body.Recurring == false){
            if (body.hasOwnProperty("typeScheduledTransaction")){
                delete body.typeScheduledTransaction;
            }
            if (body.hasOwnProperty("transactionLength")){
                delete body.transactionLength;
            }
        }
        if (body.Recurring == true){
            if ((!body.hasOwnProperty("typeScheduledTransaction") &&  (!InitialTransaction.hasOwnProperty("typeScheduledTransaction"))) ||
                ((!body.hasOwnProperty("transactionLength")) &&   (!InitialTransaction.hasOwnProperty("transactionLength")))){
                throw new ApiError(status.BAD_REQUEST,"Invalid Change recurring without sufficient parameters");
            }
        }

        if (body.hasOwnProperty("typeScheduledTransaction")){
            if (body.typeScheduledTransaction != "daily" &&
                body.typeScheduledTransaction != "weekly" &&
                body.typeScheduledTransaction != "monthly"){
                throw new ApiError(status.BAD_REQUEST,"Invalid type of scheduled transaction");
            }
        }

        if (body.hasOwnProperty("NextTransactionDate")){
            body.NextTransactionDate = new Date(body.NextTransactionDate * 1000)
        }

        if (body.hasOwnProperty("type")){
            if (body.type != "expense" && body.type != "profit"){
                throw new ApiError(status.BAD_REQUEST, "Invalid type")
            }
        }

        const old_wallet = await wallet.findById(InitialTransaction.walletID);


        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }

        if (!old_wallet.sharedAccounts.includes(userID)){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to perform transaction")
        }

        //const scheduledTransactionDoc = await scheduledTransaction.findOneAndUpdate({_id: id}, body, {runValidators: true})
        const scheduledTransactionDoc = await scheduledTransaction.findOne({_id: id})
        if(!scheduledTransactionDoc){
            throw new ApiError(status.NOT_FOUND, "scheduled Transaction not found")
        }
        ops.forEach((op) => {
            scheduledTransactionDoc[op] = body[op]
        })
        scheduledTransactionDoc.save()
        // console.log('updateScheduledTransactionById: ', body);
        // console.log('updateScheduledTransactionDoc: ', scheduledTransactionDoc)
        if(scheduledTransactionDoc){
            return scheduledTransactionDoc
        } else{
            throw new ApiError(status.NOT_FOUND, "scheduled Transaction not found")
        }
    }
    catch (e) {
        // console.log(e)
        throw new ApiError(status.BAD_REQUEST, e);
    }
};

const getScheduledTransactionsByWalletId = async (walletId, userID) => {
    try {
        const old_wallet = await wallet.findById(walletId);
        if (!old_wallet){
            throw new ApiError(status.NOT_FOUND, "Wallet does not exist")
        }

        if (!old_wallet.sharedAccounts.includes(userID)){
            throw new ApiError(status.UNAUTHORIZED, "Not authorized to see transaction")
        }
        const scheduledTransactionDoc = await scheduledTransaction.find({ walletID: walletId })

        if(scheduledTransactionDoc){
            return scheduledTransactionDoc
        } else {
            throw new ApiError(status.NOT_FOUND, "scheduled Transaction not found!")
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
};

function addDays(date, days) {

    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

function addWeeks(date, weeks) {

    let result = new Date(date);
    result.setDate(result.getDate() + 7*weeks);
    return result;
};

function addMonths(date, months) {
    let result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

cron.schedule('*/5 * * * * *', async () => {
    const date = Date.now();
    try {
        const scheduledTransactionDoc = await scheduledTransaction.find({NextTransactionDate: { $lt: date}});
        if(scheduledTransactionDoc){
            for (i = 0; i< scheduledTransactionDoc.length; i++)
            {
                let new_wallet = await wallet.findById(scheduledTransactionDoc[i].walletID)
                
                if (scheduledTransactionDoc[i].type == 'expense')
                {
                    transactionController.addExpense({value : scheduledTransactionDoc[i].value,
                        description : scheduledTransactionDoc[i].description,
                        TransactionDate : scheduledTransactionDoc[i].NextTransactionDate,
                        walletID : scheduledTransactionDoc[i].walletID}, new_wallet.createdBy)
                

                } else {
                    transactionController.addProfit({value : scheduledTransactionDoc[i].value,
                        description : scheduledTransactionDoc[i].description,
                        TransactionDate : scheduledTransactionDoc[i].NextTransactionDate,
                        walletID : scheduledTransactionDoc[i].walletID}, new_wallet.createdBy)
                }
                await scheduledTransaction.findOneAndRemove({_id: scheduledTransactionDoc[i]._id})
                //deleteScheduledTransactionById(scheduledTransactionDoc[i]._id);
                if (scheduledTransactionDoc[i].Recurring == true)
                {
                    let NextDate = Date.now();
                    NextDate = scheduledTransactionDoc[i].NextTransactionDate;
                    switch(scheduledTransactionDoc[i].typeScheduledTransaction){
                        case "daily":
                            NextDate = addDays(NextDate, scheduledTransactionDoc[i].transactionLength);
                            break;
                        case "weekly":
                            NextDate = addWeeks(NextDate, scheduledTransactionDoc[i].transactionLength);
                            break;
                        case "monthly":
                            NextDate = addMonths(NextDate, scheduledTransactionDoc[i].transactionLength);
                            break;
                        default:
                            throw new ApiError(status.NOT_FOUND, "Type of Recurring Transaction not found!")
                    }

                    scheduledTransactionDoc[i].NextTransactionDate = NextDate;
                    scheduledTransaction.create({
                        walletID: scheduledTransactionDoc[i].walletID,
                        value: scheduledTransactionDoc[i].value,
                        description: scheduledTransactionDoc[i].description,
                        type: scheduledTransactionDoc[i].type,
                        NextTransactionDate: NextDate,
                        Recurring: scheduledTransactionDoc[i].Recurring,
                        typeScheduledTransaction: scheduledTransactionDoc[i].typeScheduledTransaction,
                        transactionLength: scheduledTransactionDoc[i].transactionLength
                    });
                }
            }
        } else {
            throw new ApiError(status.NOT_FOUND, "scheduled Transaction not found!")
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }

});


module.exports = {
    createScheduledTransaction,
    getScheduledTransactionsByWalletId,
    updateScheduledTransactionById,
    deleteScheduledTransactionById,
    getScheduledTransactionById
}