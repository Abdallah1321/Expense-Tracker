const express = require('express')
const router = express.Router()
const {requireAuth} = require('../middlewares/auth.middleware')

router.get('/profile', requireAuth, (req,res) => {
    res.json({
        user: req.user,
        token: req.headers.authorization.replace('Bearer ', '')
    })
})

module.exports = router