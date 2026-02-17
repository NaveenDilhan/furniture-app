const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const assetController = require('../controllers/assetController');

// --- 1. Multer & GridFS Configuration ---
// We keep this in the route file (or a separate middleware file) 
// because it runs *before* the controller.

const storage = new GridFsStorage({
  url: process.env.MONGO_URI, // Make sure this is set in your .env
  file: (req, file) => {
    return {
      filename: file.originalname, // Use original name (e.g., 'table.glb')
      bucketName: 'models' // Collection name
    };
  }
});

const upload = multer({ storage });

// --- 2. Routes ---

// Upload Route (Middleware handles the upload, Controller handles the response)
router.post('/upload', upload.single('file'), assetController.uploadAsset);

// Stream Route
router.get('/:filename', assetController.getAsset);

module.exports = router;