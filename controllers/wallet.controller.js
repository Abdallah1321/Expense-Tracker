const status = require("http-status");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");
const Invitation = require("../models/invites.model")
const userController = require("../controllers/user.controller")
const inviteEmail = require('../utils/InviteEmail')

const createWallet = async function(walletBody, userID) {
    try {
        const user = await Wallet.findById(userID)
        return await Wallet.create({
            ...walletBody,
            createdBy: userID,
            sharedAccounts: [userID],
            viewAccounts: [userID]
        });
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
};

// const addUserToWalletProvision = async(inviteeID, walletID, userID) => {
//
// }
const manageInvitation= async(userID, sentToken, action='accept') => {
    try {
        const hashedUserID = crypto.createHash("md5").update(userID.toString()).digest("hex")
        const token = sentToken.split('.')[1]

        console.log(userID)
        console.log('hashed: ',hashedUserID)
        console.log('token: ', token)

        if(hashedUserID === token){

            const invitation = await Invitation.findOne({
                inviteeID: userID,
                token: sentToken
            })

            console.log('userID: ', userID)
            console.log("invitation doc: ", invitation)

            if(invitation) {
                const wallet = await Wallet.findOne({
                    _id: invitation.walletID
                })
                console.log('inWall: ',invitation.walletID)
                console.log('walletDOc: ', wallet)
                console.log(userID)
                console.log('wallet: ', wallet.viewAccounts)

                if(!(wallet.viewAccounts.includes(userID))){
                    wallet.viewAccounts.push(userID);
                    await invitation.delete()
                    await wallet.save()
                    return 'success'
                }
                else {
                    return 'Already accessing'

                }
            } else {
                return 'Invalid token!!'
            }

        } else {
            return 'Invalid token'
        }

        // const token = await Invitation.findOne({
        //     inviteeID,
        //     inviterID,
        //     token,
        //     status: 'pending'
        // })

        // if(token?.length){
        //
        // }

    } catch (e) {

    }
}

const addUserToWallet = async(username, walletID, userID, host) => {
    try {

        console.log('username: ', username)

        const ogUser = await userController.getUserById(userID)
        const user = await userController.getUserbyUsername(username)

        if(user === null){
            throw new ApiError(status.NOT_FOUND, "Couldn't find this account")
        }

        const inviteeID = user._id
        const walletDoc = await Wallet.findOne({
            _id: walletID,
        })


        if(walletDoc == null){
            throw new ApiError(status.ERROR, 'Bad parameters')
        }

        // if(inviteeID === userID) {
        //     throw new ApiError(status.BAD_REQUEST, "You can't invite yourself")
        // }
        // console.log(user)

        console.log('walletDoc: ', walletDoc)
        console.log('User: ', user._id)
        console.log('og user: ', ogUser._id)

        if (walletDoc === null || user === null) {
            throw new ApiError(status.BAD_REQUEST, "Bad parameters")
        }
        else if(walletDoc.length === 0 || walletDoc.createdBy !== userID) {
            throw new ApiError(status.NOT_FOUND, "This wallet doesn't exist")
        }

            // TODO: Improvement
            // else if(!walletDoc.sharedAccounts.includes(inviteeID)){
            //     const token = crypto.randomBytes(16).toString('hex')
            //     const tokenDoc = await Invitation.create({
            //         inviteeID: userID,
            //         inviterID: ogUser._id,
            //         token: token,
            //         expireAt: 2.628e+9,
            //         permission: 'rw'
            //     })
            //     const email = await inviteEmail(ogUser.name,user.name,user.email,walletDoc.name,'localhost:3000','z/m/a',token)
            //     return 'User has been invited successfully'
        // }



        else if(!walletDoc.sharedAccounts.includes(inviteeID)){
            const token = crypto.randomBytes(16).toString('hex') + '.' + crypto.createHash("md5").update(inviteeID.toString()).digest("hex")
            const dbCheck = await Invitation.countDocuments({
                issuedBy: ogUser._id
            }).limit(1)
            if(parseInt(dbCheck) === 0){
                const tokenDoc = await Invitation.create({
                    inviteeID,
                    issuedBy: ogUser._id,
                    token: token,
                    walletID: walletDoc._id,
                    // expireAt: 2.628e+9,
                    permission: 'rw'
                })

                console.log(tokenDoc)

                if(tokenDoc){
                    const email = await inviteEmail(ogUser.name,user.name,user.email,walletDoc.name,host,'wallet/invite/tenant',token)
                    return 'User has been invited successfully'
                }
            } else {
                return 'An invite is already sent to this user'
            }

        }
            // else if(!(walletDoc.sharedAccounts.includes(inviteeID))) {
            //     walletDoc.sharedAccounts.push(inviteeID);
            //     if(!(walletDoc.viewAccounts.includes(inviteeID))){
            //         walletDoc.viewAccounts.push(inviteeID);
            //     }
            //     await walletDoc.save();
            //     const email = await inviteEmail(ogUseوr.name,user.name,user.email,walletDoc.name,'localhost:3000','z/m/a','123')
            //     if(email){
            //         return `User has been invited successfully`
            //     }
        // }
        else {
            throw new ApiError(status.NOT_FOUND, "User already have access")
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

const addUserViewWallet = async(username, walletID, userID, host) => {
    try {
        const user = await userController.getUserbyUsername(username)
        const inviteeID = user._id

        const walletDoc = await Wallet.findOne({
            _id: walletID
        })
        // if(inviteeID === userID) {
        //     throw new ApiError(status.BAD_REQUEST, "You can't invite yourself")
        // }
        if (walletDoc === null || user === null) {
            throw new ApiError(status.BAD_REQUEST, "Bad parameters")
        }
        else if(walletDoc.length === 0 || walletDoc.createdBy !== userID) {
            throw new ApiError(status.NOT_FOUND, "This wallet doesn't exist")
        } else if(!(walletDoc.viewAccounts.includes(inviteeID))) {
            walletDoc.viewAccounts.push(inviteeID);
            await walletDoc.save()
            return `User has been invited successfully`
        } else {
            throw new ApiError(status.NOT_FOUND, "User already have access")
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}





const getWalletById = async (id, UserID) => {
    try {
        const walletDoc = await Wallet.findById(id);
        if(walletDoc){
            if(walletDoc.viewAccounts.includes(UserID)){
                return walletDoc
            } else{
                throw new ApiError(status.UNAUTHORIZED, "Unauthorized access to this Wallet!")
            }

        } else {
            throw new ApiError(status.NOT_FOUND, "Wallet not found!")
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
};


const deleteWalletById = async(id, userID) => {
    try{
        const walletDoc = await Wallet.findOneAndRemove({_id: id , createdBy : userID})
        console.log(userID)
        if(walletDoc){
            const transactionDoc = await Transaction.deleteMany({walletID : id});
            if (!transactionDoc){
                console.log("No transactions for wallet")
            }
            return {
                "message": "Wallet deleted successfully",
                walletID: id
            }
        } else {
            throw new ApiError(status.NOT_FOUND, 'Wallet not found! or not Authorized to delete')
        }
        // await wallet.findOneAndRemove({id}, (err) => {
        //     if(err) {
        //         console.log('DWBI error: ', err)
        //         throw new ApiError(status.BAD_REQUEST, err)
        //     }
        //     else {
        //         console.log('DWBI success')
        //         return "Wallet deleted successfully"
        //     }
        // })
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e)
    }
}

// const deleteWalletById = async (id) => {
//     try{
//         wallet.findByIdAndRemove(id, () => {
//
//         })
//     } catch (e) {
//         throw new ApiError(status.BAD_REQUEST, "Wallet not found!");
//     }
// };

const updateWalletById = async (id,body, userID) => {
    try {
        console.log('id: ', id)
        const ops = Object.keys(body)
        if(ops.includes("sharedAccounts") || ops.includes("id") || ops.includes("_id") || ops.includes("userID") || ops.includes("viewAccounts")|| ops.includes("createdBy")){
            throw new ApiError(status.BAD_REQUEST, "Invalid parameters")
        }
        const walletDoc = await Wallet.findOneAndUpdate({_id: id, sharedAccounts : { $in : userID }}, body , {runValidators: true, new: true})
        // console.log('updateWalletById: ', body);
        console.log('updateWalletDoc: ', walletDoc)
        if(walletDoc){
            return walletDoc
        } else{
            throw new ApiError(status.NOT_FOUND, "Wallet not found or Not authorized to edit")
        }
    }
    catch (e) {
        console.log(e)
        throw new ApiError(status.BAD_REQUEST, e);
    }
};

const addCategory = async (id, category, userID) => {
    try {
        const new_wallet = await getWalletById(id, userID);
        if (!new_wallet.sharedAccounts.includes(userID))
        {
            throw new ApiError(status.UNAUTHORIZED, "Unauthorized editing to this Wallet!");
        }
        delete new_wallet.id
        if (!new_wallet.categories.includes(category)){
            new_wallet.categories.push(category);

            console.log('newWallet: ',new_wallet)

            await Wallet.findOneAndUpdate(id, new_wallet)
            return `${category} is added successfully`
        } else {
            throw new ApiError(status.NOT_FOUND, "Category already exists")
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e);
    }
}

const deleteCategory = async (id, body, userID) =>{
    try{
        const new_wallet = await getWalletById(id, userID);

        if (!new_wallet.sharedAccounts.includes(userID))
        {
            throw new ApiError(status.UNAUTHORIZED, "Unauthorized editing to this Wallet!");
        }

        if (new_wallet.categories.includes(body)){
            const index = new_wallet.categories.indexOf(body);
            new_wallet.categories.splice(index,1);
            Wallet.findOneAndUpdate(id, new_wallet, (error, data) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                    return `category is deleted successfully`
                }
            });
        } else {
            throw new ApiError(status.NOT_FOUND, "Category doesn't exist")
        }
    } catch (e) {
        throw new ApiError(status.NOT_FOUND, "Category doesn't exist")
    }
}

const getWallets = async (userID) => {
    try {

        console.log('user: ', userID)

        const walletsDoc = await Wallet.find({createdBy: userID});

        console.log(walletsDoc)

        if (walletsDoc) {
            return walletsDoc;
        } else {
            throw new ApiError(status.NOT_FOUND, "No wallets found!");
        }
    } catch (e) {
        return next(e)

        // throw new ApiError(status.BAD_REQUEST, e);
    }
};

const fetchAllWallets = async(userID) => {
    try {
        const wallets = await Wallet.find({

        })
    } catch (e) {
        throw new ApiError(e.statusCode,`Error: ${e}`)
    }
}

const getSharedWallets = async (userID) => {
    try {

        // console.log('user: ', userID)
        const walletsDoc = await Wallet.find({ viewAccounts : { $in : userID }})
            .populate('createdBy', 'name')
        console.log(walletsDoc)

        if (walletsDoc) {
            return walletsDoc;
        } else {
            throw new ApiError(status.NOT_FOUND, "No wallets found!");
        }
    } catch (e) {
        throw new ApiError(status.BAD_REQUEST, e);
    }
};

const managePermissions = async(userID, username, walletID, permission, role) => {
    const user = await userController.getUserbyUsername(username)
    const inviteeID = user._id
    const wallet = await Wallet.findOne({
        _id: walletID,
        createdBy: userID
    })

    if(wallet && user){
        if(parseInt(permission) === 666 && !(wallet.sharedAccounts.includes(inviteeID)) && wallet.viewAccounts.includes(inviteeID)){
            wallet.sharedAccounts.push(inviteeID)
        }
        else if(parseInt(permission) === 333 && (wallet.sharedAccounts.includes(inviteeID)) && wallet.viewAccounts.includes(inviteeID)){
            wallet.sharedAccounts = wallet.sharedAccounts.filter((id) => {
                return id.toString() !== userID.toString()
            })
        }
        wallet.save()
        return 'success'
    }
}

const getAllSharedExpenses = async(userID) => {
    let finalReq = []
    const expense = await Wallet.find({ viewAccounts : { $in : [userID] }
        // const expense = await Wallet.find({ viewAccounts : { $eq : "6197e03c716f13940b18b9c9" }
    })
        .populate("transactions")
    //     .populate({
    //     path: 'transactions',
    //     populate: {
    //         path: 'value',
    //     }
    // })
    //     .populate({
    //     path: 'transactions',
    //     populate: {
    //         path: 'categories'
    //     }
    // })
        .populate("createdBy")
    //     .populate({
    //     path: 'users',
    //     populate: {
    //         path: 'createdBy'
    //     }
    // })

    console.log('expense: ', expense)

    if(expense !== [] && expense) {
        expense.forEach((e) => {
            e.transactions.forEach((transaction) => {
                console.log('transactions: ', transaction)
                finalReq.push(transaction)
            })
        })
        // expense[0].transactions.forEach((tran) => {
        //     // if(tran.type === 'e'){
        //     console.log('allExpenseShared: ',tran)
        //     finalReq.push(tran)
        //     // }
        // })
    }

    return finalReq
    // return finalReq
}



const getAllExpenses = async(userID) => {
    try {
        let finalReq = []
        const expense = await Wallet.find({
            createdBy: userID
        })
        // .populate({
        //     path: 'transactions',
        //     populate: {
        //         path: 'value'
        //     }
        // })
        //     .populate('createdBy','name')


        if(expense?.length) {
            expense[0].transactions.forEach((tran) => {
                // if(tran.type === 'e'){
                console.log('allExpense: ',tran)
                finalReq.push(tran)
                // }
            })
        }

        return finalReq
    } catch (e) {
        return e
    }

}

const getAllProfit = async(userID) => {
    let finalReq = []
    const expense = await Wallet.find({
        _id: userID
    }).populate({
        path: 'transactions',
        populate: {
            path: 'value'
        }
    })

    expense[0].transactions.forEach((tran) => {
        delete tran.TransactionDate
        delete tran.walletID
        delete tran._id
        // if(tran.type === 'p'){
        finalReq.push(tran)
        // }

    })
    // console.log(finalReq)
    return finalReq
}

const getAllSharedProfit = async(userID) => {
    let finalReq = []
    const expense = await Wallet.find({ viewAccounts : { $in : userID }
    }).populate({
        path: 'transactions',
        populate: {
            path: 'value'
        }
    })

    expense[0].transactions.forEach((tran) => {
        delete tran.TransactionDate
        delete tran.walletID
        delete tran._id
        // if(tran.type === 'p'){
        finalReq.push(tran)
        // }

    })
    console.log(finalReq)
    return finalReq
}

module.exports = {
    createWallet,
    getWalletById,
    deleteWalletById,
    updateWalletById,
    addCategory,
    deleteCategory,
    getWallets,
    addUserToWallet,
    getAllExpenses,
    getAllProfit,
    getSharedWallets,
    getAllSharedProfit,
    getAllSharedExpenses,
    addUserViewWallet,
    manageInvitation,
    managePermissions
};
