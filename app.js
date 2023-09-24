const express = require('express');
const bodyParser = require('body-parser');
const signup = require('./routes/signup');
const { default: mongoose } = require('mongoose');
const cors=require('cors');
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const login = require('./routes/login')
const expense = require('./routes/expense')
const purchase =  require('./routes/purchase')
const premiumUser = require('./routes/premiumuser')
const forgotPassword = require('./routes/forgotpassword')
require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Biplab:Biplab1997@cluster27.j3ndx24.mongodb.net/ExpenseTracker", {
    useNewUrlParser: true
})
.then( () => console.log(chalk.green.inverse("MongoDb is connected")))
.catch ( err => console.log(err) )


app.use(signup)
app.use(login)
app.use(expense)
app.use('/purchase',purchase)
app.use('/premium',premiumUser)
app.use('/password',forgotPassword)
app.use(cors());


app.use((req, res)=>{
     res.sendFile (path.join(__dirname, 'public',`${req.url}`));
 })




app.listen(process.env.PORT || 8000, function () {
    console.log(chalk.magenta.inverse('Express app running on port ' + (process.env.PORT || 8000)))
});