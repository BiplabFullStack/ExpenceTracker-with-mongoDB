const User = require('../model/signup')
const bcrypt = require('bcrypt')
const { isEmpty, isValidName, isValidEmail,isValidPhoneNumber, isValidPassword } = require('../validator/validation')
const createUser = async function(req, res){
    try{
        const data = req.body;
        if(Object.keys(data).length == 0){
            return res.status(400).send({success: false, msg: 'Data is require'})
        }
        
        const { firstName, lastName, email, number, password } = data

        if(!isEmpty(firstName) && !isEmpty(lastName) && !isEmpty(email) && !isEmpty(number) && isEmpty(password) ){
            console.log('Please fill all the input ');
            return res.status(400).send({success: false, msg :'Please fill all the input '})
        }
        if(!isValidName(firstName)){
            console.log('firstName should include alphabet only');
            return res.status(400).send({success: false, msg: 'firstName should include alphabet only'})
        }
        if(!isValidName(lastName)){
            console.log('lastName should include alphabet only');
            return res.status(400).send({success: false, msg: 'lastName should include alphabet only'})
        }
        if(!isValidEmail(email)){
            console.log('Email must be provide currect format');
            return res.status(400).send({success:false, msg:'Email must be provide currect format'})
        }
        if(!isValidPhoneNumber(number)){
            console.log('Please Provide valid mobile number');
            return res.status(400).send({success:false, msg:'Please Provide valid mobile number'})
        }
        if(!isValidPassword(password)){
            console.log('Password must be Strong');
            return res.status(400).send({success:false, msg: 'Password must be Strong'})
        }
        const existEmail = await User.findOne({email:email})
        if(existEmail){
            console.log('Email already exist');
            return res.status(400).send({success:false, msg:'Email already exist'})
        }

        bcrypt.hash(password, 10, async(err, hash)=> {
            if(!err){
                let savedata = await User.create({
                    firstName,
                    lastName,
                    email,
                    number,
                    password:hash
                });
                console.log('Successfully Created your profile');
                return res.status(201).send({success:false, data:savedata})
            }
        })
    }
    catch(err){
        console.log(err.message);
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = {createUser};