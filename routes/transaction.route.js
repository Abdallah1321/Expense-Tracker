const express = require('express')
const router = express.Router()
const {authPassport, requireAuth} = require('../middlewares/auth.middleware')
const transactionController = require('../controllers/transaction.controller');

router.post('/expense', requireAuth, async(req,res, next) => {
    try {
        const doc = await transactionController.addExpense(req.body, req.user._id)
        res.send(doc)
    } catch (e) {
        next(e)
    }
})

router.post('/profit', requireAuth, async(req,res, next) => {
    try {
        const doc = await transactionController.addProfit(req.body, req.user._id)
        res.send(doc)
    } catch (e) {
        next(e)
    }
})

router.get('/:id', requireAuth, async(req, res, next) => {
    try {
        const doc = await transactionController.getTransaction(req.params.id)
        res.send(doc)
    } catch (e) {
        next(e)
    }
})

router.patch('/expense/:id', requireAuth, async(req,res, next) => {
    try {
        const doc = await transactionController.updateExpense(req.params.id, req.user._id, req.body)
        res.send(doc)
    } catch (e) {
        next(e)
    }
})

router.patch('/profit/:id', requireAuth, async(req,res, next) => {
    try {
        const doc = await transactionController.updateProfit(req.params.id, req.user._id, req.body)
        res.send(doc)
    } catch (e) {
        next(e)
    }
})

router.delete('/expense/:id', requireAuth, async(req,res, next) => {
    try {
        console.log(req.params.id)

        const doc = await transactionController.deleteExpense(req.params.id, req.user._id)
        res.send(doc)
    } catch (e) {
        next(e)
    }
})

router.delete('/profit/:id', requireAuth, async(req,res, next) => {
    try {
        const doc = await transactionController.deleteProfit(req.params.id, req.user._id)
        res.send(doc)
    } catch (e) {
        next(e)
    }
})

// router.delete('/:id/delete-expense', transactionController.deleteExpense);
// router.put('/:id/update-expense', transactionController.updateExpense);
// router.post('/:id/add-profit', transactionController.addProfit);
// router.delete('/:id/delete-profit', transactionController.deleteProfit);
// router.put('/:id/update-profit', transactionController.updateProfit);

module.exports = router