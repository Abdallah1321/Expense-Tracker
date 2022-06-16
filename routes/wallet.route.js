const express = require('express')
const router = express.Router()
const {authPassport, requireAuth} = require('../middlewares/auth.middleware')
const walletController = require('../controllers/wallet.controller');
const ApiError = require("../utils/ApiError");

router.get('/fetchWallets', requireAuth, async(req,res, next) => {
    try {
        res.send(await walletController.getAllSharedExpenses(req.user._id))
    } catch (e) {
        next(e)
    }
})

router.get('/getAll', requireAuth,async(req, res, next) => {
    try {
        let ownTransactions = await walletController.getAllExpenses(req.user._id)
        let sharedTransactions = await walletController.getAllSharedExpenses(req.user._id)
        ownTransactions = []

        if(ownTransactions === {}){
            ownTransactions = []
        }
        if(sharedTransactions === {}){
            sharedTransactions = []
        }


        const result = [...new Set([...ownTransactions, ...sharedTransactions])]

        // console.log(ownTransactions)
        // console.log(sharedTransactions)
        // console.log(sharedTransactions)
        // const response = [...ownTransactions, ...sharedTransactions]
        res.send(result)
    } catch (e){
        console.log('get tra: ', e)
        next(e)
    }
})

router.get('/getAllShared', requireAuth, async(req, res, next) => {
   try {
       const walletDoc = await walletController.getAllSharedExpenses(req.user._id)
       res.send(walletDoc)
   } catch (e) {
       next(e)
   }
})

router.put('/invite', requireAuth, async(req,res, next) => {
    try {
        const username = req.body.username
        const walletID = req.body.walletID
        const userID = req.user._id
        const permission = req.body.permission
        let wallet

        // console.log(username)
        // console.log(walletID)
        // console.log(userID)
        // console.log(permission)

        if(parseInt(permission) === 444) {
            wallet = await walletController.addUserViewWallet(username, walletID, userID, req.headers.host)
        } else if(parseInt(permission) === 666) {
            wallet = await walletController.addUserToWallet(username, walletID, userID, req.headers.host)
        }

        // console.log('wallet: ', wallet.statusCode)
        //
        // if(wallet && wallet.statusCode === 404){
        //     throw new ApiError(wallet.statusCode, wallet.error.message)
        // }

        // wallet = wallet.toJSON()
        //
        // if(wallet && wallet.statusCode && wallet.statusCode !== 200){
        //     res.status(wallet.statusCode).send(wallet)
        // } else {
        //     res.send(wallet)
        // }

        res.send(wallet)

    } catch (e) {
        next(e)
    }


})


router.get("/viewUserAll", requireAuth, async (req, res, next) => {
    try {
        // console.log('req.user: ', req.user._id)
        // const walletsDoc = await walletController.getWallets(req.user._id.toString());

        const walletsDoc = await walletController.getWallets(req.user._id);
        res.send({ walletsDoc });
    } catch (e) {
        next(e)
        // res.status(e.statusCode).send(e);
    }
});

router.get("/viewAll", requireAuth, async (req, res, next) => {
    try {
        // console.log('req.user: ', req.user._id)
        // const walletsDoc = await walletController.getWallets(req.user._id.toString());

        res.send(await walletController.getSharedWallets(req.user._id));
    } catch (e) {
        next(e)
    }
});

router.get('/invite/tenant/:token', requireAuth, async(req,res, next) => {
    try {
        const doc = await walletController.manageInvitation(req.user._id, req.params.token)
        res.send({doc})
    } catch (e) {
        // res.status(e.statusCode).send(e)
        next(e)
    }
})

router.get('/:id', requireAuth, async(req, res, next) => {
    try {
        const walletDoc = await walletController.getWalletById(req.params.id, req.user._id)
        res.send({
            walletDoc
        })
    } catch (e) {
        // res.status(e.statusCode).send(e)
        next(e)
    }
});


router.put('/:wallet/permissions', requireAuth, async(req,res, next) => {
    try {
        res.send(await walletController.managePermissions(req.user._id, req.body.username, req.body.walletID,req.body.permission))
    } catch (e) {
        // res.status(e.statusCode).send(e)
        next(e)
    }
})

// passport.authenticate("jwt", {session: false})

router.post('/new', requireAuth,async(req, res, next) => {
    try{
        console.log('/new: ', req.user._id)
        const wallet = await walletController.createWallet(req.body, req.user._id)
        console.log('new wallet')
        res.send(wallet)
    } catch (e) {
        next(e)
    }
});

router.delete('/:id', requireAuth,async(req, res, next) => {
    try{
        const id = req.params.id;
        const deletedWallet = await walletController.deleteWalletById(id, req.user._id);
        res.send(deletedWallet);
    } catch (e) {
        next(e)
    }
});

router.patch('/:id', requireAuth, async(req, res, next) => {
    try{
        const id = req.params.id;
        const walletDoc = await walletController.updateWalletById(id, req.body, req.user._id)
        res.send(walletDoc)
    } catch (e) {
        next(e)
    }
});

router.put('/:id/newcategory/', requireAuth,async(req, res, next) => {
    try {
        const id = req.params.id;
        const category = req.body.category;
        const walletDoc = await walletController.addCategory(id, category, req.user._id);
        res.send(walletDoc)
    } catch (e) {
        next(e)
    }
});

router.patch('/:id/deletecategory/', requireAuth,async(req, res, next) => {
    try {
        const id = req.params.id;
        const category = req.body.category;
        const categoryDoc = await walletController.deleteCategory(id, category, req.user._id);
        res.send(categoryDoc)
    } catch(e) {
        next(e)
    }
});


module.exports = router
