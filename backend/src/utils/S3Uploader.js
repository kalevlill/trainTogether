const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = (file) => {
  const fileContent = fs.readFileSync(file.path);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}-${file.originalname}`,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  return s3.upload(params).promise();
};

module.exports = uploadToS3;

