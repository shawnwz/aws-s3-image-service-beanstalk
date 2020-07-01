const s3 = require("./s3");
const im = require('imagemagick');
const fs = require('fs');
const os = require('os');
const dotenv = require("dotenv");
const {successResponse, errorResponse} = require("./response");
const checkMulterParams = require('./check-multer-params');
const getFile = (imageBucket, objectKey, reject) => s3.getFileFromBucket(imageBucket, objectKey).catch(err => reject(errorResponse(err.code, 404, err)));
const uploadFile = ({ACL, Bucket, Body, Key, reject}) => s3.uploadToS3({ACL, Bucket, Body, Key}).catch(err => reject(errorResponse(err.code, 403, err)));

dotenv.config();


exports.getOriginalImage = (imageBucket, objectKey) => new Promise((resolve, reject) =>
    getFile(imageBucket, objectKey, reject).then(data => resolve(successResponse(data.Body.toString('base64'), 'image/jpeg'))).catch(err => reject(errorResponse(err.code, 404, err))));


exports.getImageWithSize = (imageBucket, objectKey, width, height) => new Promise(
    (resolve, reject) => getFile(imageBucket, objectKey, reject).then(data => {
        const normalizeObjectKey = objectKey.split('/').join('.');
        const resizedFile = `${os.tmpDir}/resized.${imageBucket}.${normalizeObjectKey}.${width}.${height}`;

        if (width) {
            console.log('INFO: width is ' + width);
            im.resize({
                width: width,
                height:height,
                srcData: data.Body,
                dstPath: resizedFile
            }, (err, output) => resizeCallback(err, output, resolve, reject));
        } else if(height) {
            console.log('INFO: height is ' + height);
            im.resize({
                height: height,
                srcData: data.Body,
                dstPath: resizedFile
            }, (err, output) => resizeCallback(err, output, resolve, reject));
        }

        const resizeCallback = (err, output, resolve, reject) => {
            if (err) {
                reject(errorResponse(null, 500, err));
            } else {
                console.log('INFO: Resize completed, calling back...');
                im.identify(resizedFile, (err, result) => {
                    let contentType;
                    switch (result.format) {
                        case 'GIF':
                            contentType = 'image/gif';
                            break;
                        case 'PNG':
                            contentType = 'image/png';
                            break;
                        default:
                            contentType = 'image/jpeg';
                    }
                    const response = successResponse(Buffer.from(fs.readFileSync(resizedFile)).toString('base64'), contentType);
                    fs.unlink(resizedFile, () => console.log("INFO: Resized file cleaned up..."));
                    resolve(response);
                })
            }
        };
    })
);

exports.uploadImage = ({file, folderName}) => new Promise((resolve, reject) => {
    if(!file){
        reject(errorResponse(404, 404, 'File required!'));
    }
    let multerCheckReturnValue = checkMulterParams(file);
    const paramsArray = [];
    if(Array.isArray(file)){
        for(let item of multerCheckReturnValue){
            const params = getParams(folderName, item);
            uploadFile(params, reject).then(data => {
                if(data) {
                    fs.unlinkSync(item.filePath, (err)=>{if(!err){console.log('INFO: temp file deleted!')}});
                    paramsArray.push(data);
                    if (paramsArray.length === multerCheckReturnValue.length) {
                      // Don't resolve until all uploads have been completed.
                      resolve(paramsArray);
                    }
                }
            }).catch(err => errorResponse(err.code, 500, err));

        }
    }else{
        const params = getParams(folderName, multerCheckReturnValue);
        uploadFile(params, reject).then(data => {
            if (data) {
                fs.unlinkSync(multerCheckReturnValue.filePath, (err)=>{if(!err){console.log('INFO: temp file deleted!')}});
                resolve(data);
            }
        }).catch(err => errorResponse(err.code, 500, err ));
    }

});

const getParams = (folderName, multerParamsObject) => {
    return {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(multerParamsObject.filePath),
      Key: `${folderName}/${multerParamsObject.filename}`
    };
  };