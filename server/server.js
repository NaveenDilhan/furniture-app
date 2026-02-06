// server/server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB Atlas
// We use the variable from the .env file now
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("ERROR: MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Common hint for Atlas errors
    if (err.message.includes('bad auth')) console.log('Hint: Check your username and password in .env');
    if (err.message.includes('closed')) console.log('Hint: Check if your IP address is whitelisted in MongoDB Atlas Network Access');
  });

// 2. Define a Simple Schema for Designs
const DesignSchema = new mongoose.Schema({
  designerName: String,
  furnitureData: Array,
  createdAt: { type: Date, default: Date.now }
});

const Design = mongoose.model('Design', DesignSchema);

// 3. API Routes

// Route: Save a Design
app.post('/api/designs', async (req, res) => {
  try {
    const newDesign = new Design(req.body);
    await newDesign.save();
    res.status(201).json({ message: 'Design Saved!', design: newDesign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Get All Designs
app.get('/api/designs', async (req, res) => {
  try {
    const designs = await Design.find();
    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));