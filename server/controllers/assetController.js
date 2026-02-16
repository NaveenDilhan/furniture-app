const mongoose = require('mongoose');
let gridfsBucket;

// Helper to ensure Bucket is ready
const getBucket = () => {
  if (gridfsBucket) return gridfsBucket;
  if (mongoose.connection.db) {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'models'
    });
    return gridfsBucket;
  }
  throw new Error('Database not connected');
};

// @desc    Upload success handler
// @route   POST /api/assets/upload
exports.uploadAsset = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ err: 'No file uploaded' });
  }
  // req.file is provided by the multer middleware in the route
  res.json({ 
    filename: req.file.filename,
    id: req.file.id,
    msg: 'File uploaded successfully' 
  });
};

// @desc    Stream a file by filename
// @route   GET /api/assets/:filename
exports.getAsset = async (req, res) => {
  try {
    const bucket = getBucket();
    
    // 1. Find the file metadata
    const files = await bucket.find({ filename: req.params.filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ err: 'File not found' });
    }

    const file = files[0];

    // 2. Stream the file content
    const readStream = bucket.openDownloadStreamByName(req.params.filename);
    readStream.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Server Error retrieving file' });
  }
};