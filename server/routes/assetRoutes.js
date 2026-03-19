const express = require('express');
const router = express.Router();
const multer = require('multer');
const assetController = require('../controllers/assetController');


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/upload', upload.single('file'), assetController.uploadAsset);
router.get('/:filename', assetController.getAsset);

module.exports = router;