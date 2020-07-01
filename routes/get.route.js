const express = require('express');

const GetImageController = require('../get.controller');

const { getImage } = GetImageController;

const router = express.Router();

router.route('/get/:key').get(getImage);

module.exports = router;
