const { uploadImage } = require("./image");
const { response } = require("express");

module.exports = {
    upload(req, res) {
        
        console.log('INFO: uploading images...');
        let userRequestObject = req.body;
        let file = req.files;
        if (file) {
            if('image1' in file && 'image2' in file) {
                Promise.all([
                    uploadImage({file: file.image1, folderName: userRequestObject.folder}),
                    uploadImage({file: file.image2, folderName: userRequestObject.folder})
                ]).then(response => {
                    res.send(response);
                });

            }
            if('image1' in file && !('image2' in file)) {
                uploadImage({file: file, folderName: userRequestObject.folder}).then(function(data){
                    res.send(data);
                });
            }
        } 
    }
}