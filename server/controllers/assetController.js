const mongoose = require('mongoose');
const { Readable } = require('stream'); // Built-in Node.js module

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

// @desc    Upload success handler (Manual GridFS Stream)
// @route   POST /api/assets/upload
exports.uploadAsset = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ err: 'No file uploaded' });
  }

  try {
    const bucket = getBucket();
    
    // 1. Convert the buffer (from multer memory storage) into a readable stream
    const readableStream = Readable.from(req.file.buffer);

    // 2. Open an upload stream to GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

    // 3. Pipe the readable stream into the GridFS upload stream
    readableStream.pipe(uploadStream)
      .on('error', (error) => {
        console.error('Upload Error:', error);
        return res.status(500).json({ err: 'Error uploading file to database' });
      })
      .on('finish', () => {
        // When finished, send back the success response
        res.status(201).json({ 
          filename: req.file.originalname,
          id: uploadStream.id,
          msg: 'File uploaded successfully' 
        });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Server Error during file upload' });
  }
};

// @desc    Stream a file by filename
// @route   GET /api/assets/:filename
exports.getAsset = async (req, res) => {
  try {
    const bucket = getBucket();
    
    const files = await bucket.find({ filename: req.params.filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ err: 'File not found' });
    }

    const readStream = bucket.openDownloadStreamByName(req.params.filename);
    readStream.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Server Error retrieving file' });
  }
};