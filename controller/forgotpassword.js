const Sib = require('sib-api-v3-sdk');
require('dotenv').config()
const chalk = require('chalk')
const { isValidEmail } = require('../validator/validation')
const uuid = require('uuid')
const User = require('../model/signup')
const ForgotPassword = require('../model/forgotpassword')

const bcrypt = require('bcrypt')


const forgotPasswordEmail = async (req, res, next) => {
    const forgotUserEmail = req.body.email;
    // console.log('forgotUserEmail ---> ', forgotUserEmail);
    // console.log('API_KEY:', process.env.API_KEY);


  //  Check if the email is valid (you can uncomment this if needed)
    if (!isValidEmail(forgotUserEmail)) {
        console.log(chalk.red('Please enter a correct email '));
        return res
            .status(400)
            .json({ success: false, err: "Please enter a correct email" });
    }

    try {
        const user = await User.findOne({ email: forgotUserEmail });

        if (user) {
            const id = uuid.v4();
            await ForgotPassword.create({_id:id, active: true, userId: user._id });

            // Rest of your code for sending the email remains unchanged
            const client = Sib.ApiClient.instance;

            // Configure API key authorization: api-key
            var apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;
            const tranEmailApi = new Sib.TransactionalEmailsApi();

            const sender = {
                email: 'biplbbackend@gmail.com',
                name: 'Biplab pvt.ltd',
            };
            const receivers = [
                {
                    email: forgotUserEmail,
                },
            ];

            tranEmailApi
                .sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: 'OTP VERIFICATION',
                    htmlContent: `<html>
                        <p>To reset your password please click on the below link</p>
                        <a href="http://localhost:8000/password/resetpassword/${id}">Reset Password</a>
                        </html>`,
                    textContent: 'Next, please go to our website and login.',
                })
                .then(result => {
                    console.log(result);
                    res.status(201).json({ success: true, message: 'We have sent you OTP in your user email account.' });
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json(err);
                });
        } else {
            console.log('No user found');
            return res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};




//---------------------------------------------  Reset Password -------------------------------------------------------

const resetpassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        //console.log('id',id);
        const resetpassword = await ForgotPassword.findOne( { _id:id })
       // console.log('resetpassword----->',resetpassword);
        if (resetpassword) {
             await ForgotPassword.updateOne({_id:id},{ $set:{active: false }})
           // console.log(data);
           // res.sendFile(path.join('rootDir','views','resetform.html'))
            res.send(`<html>
            <form action="/password/updatepassword/${id}" method="get" >
            <h4>Reset Password</h4>
            <div>
                <label for="password">Password :</label>
                <input type="text" id="password" name="password" placeholder="Enter your password ">
            </div>
            <div>
                <label for="confirmpassword">Confirm Password :</label>
                <input type="text" name="confirmpassword ">
                    
            </div>
            <button>Save Password</button>
        </form>
        </html>
            `)
            res.end()


        } else {
            throw new Error("Something went wrong")
        }
    }
    catch (err) {
        return res
            .status(500)
            .send({ Success: false, err: "Server Error" })
    }
}



//---------------------------------------------  Update Password -------------------------------------------------------

const updatePassword = async (req, res, next) => {
    try {
        const  confirmpassword  = req.query.password;
        const { resetpasswordid } = req.params;
         console.log(confirmpassword);
         console.log(resetpasswordid);

        const forgetPasswordDetails = await ForgotPassword.findOne({_id:resetpasswordid})
      console.log(forgetPasswordDetails);
        if (forgetPasswordDetails) {
            bcrypt.hash(confirmpassword, 10, async (err, hash) => {
              // console.log(hash);
                if (!err) {
                    //await signUp.updateOne({ password: hash },{ where: { id: forgetPasswordDetails.signUpId } })
                    await User.updateOne({_id: forgetPasswordDetails.userId },{$set:{password: hash}})
                    console.log("Your Password Update Successfully ");
                    res.status(201)
                    .send(`<html>
                    <div style="text-align: center;">
                        <h2 >Updated Successfully</h2>
                        <p >Please login again ....</p>
                        </div>
                      
                    </html>`)
                       
                } 
                else {
                    throw new Error("Something went Wrong")
                }
            })
        }else{
            throw new Error("Something went Wrong")
        }


    } catch (err) {
        return res.status(403).json({ err, success: false })
    }
}

module.exports = { forgotPasswordEmail, resetpassword, updatePassword }