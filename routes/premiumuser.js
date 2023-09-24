const express=require('express');
const router=express.Router();

const { authenticate } = require('../middleware/auth')
const { userleaderboard , download } = require('../controller/premiumuser')

router.get('/leaderboard',authenticate, userleaderboard)

router.get('/download',authenticate,download)


module.exports = router;