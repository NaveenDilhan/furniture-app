const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  items: { type: Array, required: true }, 
  roomConfig: {
    width: { type: Number, default: 10 },
    depth: { type: Number, default: 10 },
    wallColor: { type: String, default: '#f0f0f0' },
    floorColor: { type: String, default: '#8B4513' }, 
    lightingMode: { type: String, default: 'Day' } 
  },
  thumbnail: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Design', DesignSchema);