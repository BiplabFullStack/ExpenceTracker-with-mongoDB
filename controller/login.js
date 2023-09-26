const User = require('../model/signup')
const bcrypt = require('bcrypt')

const { generateAccessToken } = require('../service/tokengenerate')
const { isValidEmail, isValidPassword } = require('../validator/validation')

const userlogin = async function (req, res) {
    try {
        const { username, password } = req.body;
  
        if (!isValidEmail(username)) {
            console.log('Email must be provide currect format');
            return res.status(400).send({ success: false, msg: 'Email must be provide currect format' })
        }
        if (!isValidPassword) {
            console.log('Password must be Strong');
            return res.status(400).send({ success: false, msg: 'Password must be Strong' })
        }
        const checkCredensials = await User.findOne({ email: username })
        console.log(checkCredensials.firstName);
        if (checkCredensials) {
            bcrypt.compare(password, checkCredensials.password, (err, result) => {
                if (err) {
                    console.log('Something went wrong login time');
                    return res.status(500).json({ status: false, msg: 'Something went wrong' })
                }
                if (result) {
                    console.log("login successfull");
                    return res.status(200).json({ success: false, msg: 'User Login Successfully', token: generateAccessToken(checkCredensials._id.toString(), checkCredensials.firstName, checkCredensials.email)})
                }else{
                    return res.status(400).send({success:false, msg:'Wrong Password'})
                }
            })
        } else {
            console.log('User not exist');
            return res.status(404).json({ status: false, msg: 'User not exist' })
        }
    }
    catch (err) {
        res.status(500).json({ status: false, msg: 'Server Error' })
    }
}

const premium = async (req, res, next) => {
    try{
        const userId = req.user._id;

        const validPrimiumUser = await User.findOne({_id:userId})
        if(validPrimiumUser){
            return res
            .status(200)
            .send(validPrimiumUser)
        }
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = { userlogin , premium};