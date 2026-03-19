const mongoose = require('mongoose');
const { Readable } = require('stream'); 

let gridfsBucket;


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


exports.uploadAsset = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ err: 'No file uploaded' });
  }

  try {
    const bucket = getBucket();
    

    const readableStream = Readable.from(req.file.buffer);


    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

  
    readableStream.pipe(uploadStream)
      .on('error', (error) => {
        console.error('Upload Error:', error);
        return res.status(500).json({ err: 'Error uploading file to database' });
      })
      .on('finish', () => {

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