const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  items: { type: Array, required: true }, // Furniture data
  roomConfig: {
    width: { type: Number, default: 10 },
    depth: { type: Number, default: 10 },
    wallColor: { type: String, default: '#f0f0f0' },
    floorColor: { type: String, default: '#8B4513' }, // Simplified texture representation
    lightingMode: { type: String, default: 'Day' } // Day, Night, Golden
  },
  thumbnail: { type: String }, // Base64 string for preview
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Design', DesignSchema);