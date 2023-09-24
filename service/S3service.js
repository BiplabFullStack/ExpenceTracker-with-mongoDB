//require('dotenv').config();
const AWS = require('aws-sdk');

// AWS.config.update({
//     credentials:{ accessKeyId: process.env.AWS_IAM_USER_KEY,
//     secretAccessKey: process.env.AWS_IAM_USER_SECRET,
// }});

// const s3 = new AWS.S3();
// const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// const uploadToS3 = async (data, filename) => {
//     try {
//     // AWS.config.update({
//     //    { accessKeyId: process.env.AWS_IAM_USER_KEY,
//     //     secretAccessKey: process.env.AWS_IAM_USER_SECRET,
//     // }});
    
//     const s3 = new AWS.S3({
//         accessKeyId: process.env.AWS_IAM_USER_KEY,
//         secretAccessKey: process.env.AWS_IAM_USER_SECRET,
//     });
//     const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
   
//         const params = {
//             Bucket: BUCKET_NAME,
//             Key: filename,
//             Body: data,
//             ACL: 'public-read',
//         };

//         const s3Response = await s3.upload(params).promise();
//         console.log('Success:', s3Response);
//         return s3Response.Location;
//     } catch (err) {
//         console.error('Error:', err);
//         throw err; // Rethrow the error for handling at a higher level
//     }
// };

const uploadToS3=async (data,filename)=>{
    try{
      //console.log(process.env.AWS_BUCKET_NAME,process.env.AWS_IAM_USER_KEY,process.env.AWS_IAM_USER_SECRET)
      const BUCKET_NAME=process.env.AWS_BUCKET_NAME;
      const IAM_USER_KEY=process.env.AWS_IAM_USER_KEY;
      const IAM_USER_SECRET=process.env.IAM_USER_SECRET;
      let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
      })
  
        var params={
          Bucket:BUCKET_NAME,
          Key:filename,
          Body:data,
          ACL:'public-read'
        }
        return new Promise((resolve,reject)=>{
          s3bucket.upload(params , (err,s3response)=>{
            if(err){
              //console.log("something went wrong" , err);
              reject(err);
            }
            else{
              console.log('success' , s3response);
              resolve(s3response.Location)
            }
          })
        })
         
    }
    catch(err){
      console.log(err);
    }
   
  }

module.exports.uploadToS3 = uploadToS3