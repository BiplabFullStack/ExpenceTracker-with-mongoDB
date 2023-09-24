
//const dotnev=require('dotenv').config();
const S3Service=require('../service/S3service');
const FilesDownload=require('../model/URLdownload')
const User = require('../model/signup')
const Expense = require('../model/expense')





const userleaderboard = async (req, res) => {
    try{
    const leaderboardData = await User.find({ispremium:1})
    .sort({ totalexpense: -1 })
    //.exec()
    if(leaderboardData.length >0){
        return res
        .status(200)
        .send(leaderboardData)
    }
}
catch(err){
    console.log(err.message);
}
}


 
  
  const download = async (req, res) => {

    try {
        const expenses = await Expense.find( //Get Only raw Data        
           { userId: req.user._id })
        const stringifiedExpense = JSON.stringify(expenses);
        const userId = req.user._id;

        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURl = await S3Service.uploadToS3(stringifiedExpense, filename);

        await FilesDownload.create({
            filelink: fileURl,
            userId
        });

        res.status(200).json({ fileURl, success: true });
    }
    catch (err) {

        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }


}


module.exports = { userleaderboard , download };