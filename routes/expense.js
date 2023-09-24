const express=require('express');
const router=express.Router();
const { authenticate } = require('../middleware/auth')
const { postAddExpence , getAllExpence, deleteExpense} = require('../controller/expense')


router.post('/post-expense',authenticate, postAddExpence)
router.get('/getdata',authenticate, getAllExpence)
router.delete('/deletedata/:id',authenticate, deleteExpense)

module.exports = router;