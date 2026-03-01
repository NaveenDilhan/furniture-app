const express = require('express');
const router = express.Router();
const multer = require('multer');
const assetController = require('../controllers/assetController');

// --- 1. Multer Memory Configuration ---
// Instead of gridfs-storage, we keep the file in memory briefly
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- 2. Routes ---
router.post('/upload', upload.single('file'), assetController.uploadAsset);
router.get('/:filename', assetController.getAsset);

module.exports = router;