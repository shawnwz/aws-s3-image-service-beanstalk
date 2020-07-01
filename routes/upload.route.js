const express = require('express');
const multer = require('multer');
const UploadController = require('../upload.controller');

const { upload } = UploadController;

const router = express.Router();

router.route('/upload').post(
    multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 * 1024 } }).fields([
        {
          name: 'image1',
          maxCount: 1
        },
        {
          name: 'image2',
          maxCount: 1
        }
      ]),
      upload
);

module.exports = router;