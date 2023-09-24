const express=require('express');
const router= express.Router();
const { forgotPasswordEmail, resetpassword, updatePassword } = require('../controller/forgotpassword')

router.use('/forgotpassword', forgotPasswordEmail)
router.get('/resetpassword/:id', resetpassword)
router.use('/updatepassword/:resetpasswordid',updatePassword)

module.exports = router;