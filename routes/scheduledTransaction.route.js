const express = require('express')
const router = express.Router()
const {authPassport, requireAuth} = require('../middlewares/auth.middleware')
const scheduledTransactionController = require('../controllers/scheduledTransaction.controller');
const ScheduledTransaction = require('../models/scheduledTransaction.model');

router.post('/new', requireAuth ,async(req, res, next) => {
    try{
        const scheduledTransactions = await scheduledTransactionController.createScheduledTransaction(req.body, req.user._id)
        res.send({
            'message': 'new scheduled!',
            scheduledTransactions,
        })
    } catch (e) {
        // console.log('catched e: ', e)
        // res.status(e.statusCode).send(e)
        next(e)
    }
});

router.delete('/:id', requireAuth ,async(req, res, next) => {
    try{
        const id = req.params.id;
        const deletedScheduledTransaction = await scheduledTransactionController.deleteScheduledTransactionById(id ,req.user._id);
        res.send(deletedScheduledTransaction);
    } catch (e) {
        next(e)
        // res.status(e.statusCode).send(e)
    }
});

router.patch('/:id', requireAuth ,async(req, res,next) => {
    try{
        const id = req.params.id;
        const updateScheduledTransaction = await scheduledTransactionController.updateScheduledTransactionById(id, req.body, req.user._id);
        res.send(updateScheduledTransaction);
    } catch (e) {
        next(e)
    }
});



router.get("/:id", requireAuth, async (req, res,next) => {
    try {
        console.log(req.params.id, req.user._id)
        const scheduledTransactions = await scheduledTransactionController.getScheduledTransactionById(req.params.id, req.user._id)
        res.send( scheduledTransactions );
    } catch (e) {
        next(e)
    }
});

router.get("/all/:walletID", requireAuth, async (req, res,next) => {
    try {
        console.log(req.params.id, req.user._id)
        const scheduledTransactions = await scheduledTransactionController.getScheduledTransactionsByWalletId(req.params.walletID, req.user._id)

        res.send( scheduledTransactions );
    } catch (e) {
        next(e)
    }
});

module.exports = router
