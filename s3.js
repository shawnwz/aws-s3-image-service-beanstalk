const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const dotenv = require("dotenv");
dotenv.config();

AWS.config.setPromisesDependency();
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

exports.getFileFromBucket = (bucket, key) => s3.getObject({
    Bucket: bucket,
    Key: key
}).promise();

exports.uploadToS3 = ({ACL, Bucket, Body, Key}) => s3.upload({
    ACL: ACL,
    Bucket: Bucket,
    Body: Body,
    Key: Key
}).promise();

