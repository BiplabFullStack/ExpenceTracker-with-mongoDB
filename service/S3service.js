
const { S3 } = require('aws-sdk');

const uploadToS3 = async (data, filename) => {
  try {
    const { AWS_BUCKET_NAME, AWS_IAM_USER_KEY, AWS_IAM_USER_SECRET } = process.env;
    
    let s3bucket = new S3({
      accessKeyId: AWS_IAM_USER_KEY,
      secretAccessKey: AWS_IAM_USER_SECRET,
    })

    var params = {
      Bucket: AWS_BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read'
    }
    const s3response = await s3bucket.upload(params).promise();
    console.log('Pdf download successfully');
    return s3response.Location;

  }
  catch (err) {
    console.log(err);
  }

}


module.exports.uploadToS3 = uploadToS3