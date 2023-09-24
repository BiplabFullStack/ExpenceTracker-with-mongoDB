const express=require('express');
const router=express.Router();
const { authenticate } = require('../middleware/auth')


const {purchasePremium, updateTransactionStatus} = require('../controller/purchase')

router.get('/premiummembership',authenticate,purchasePremium)

router.post('/updatetransactionstatus',authenticate, updateTransactionStatus)

module.exports = router;