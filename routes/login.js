
const express=require('express');
const router=express.Router();
const { authenticate } = require('../middleware/auth')

const { userlogin , premium} = require('../controller/login')


router.post('/login', userlogin)
router.get('/premiumuser',authenticate, premium)

module.exports = router;