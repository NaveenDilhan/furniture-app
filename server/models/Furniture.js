// server/models/Furniture.js
const mongoose = require('mongoose');

const FurnitureSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'sofa_01'
  name: { type: String, required: true },             // e.g., 'Modern Sofa'
  type: { type: String, required: true },             // e.g., 'Sofa' (This is the Category)
  modelUrl: { type: String, required: true },         // URL to the GLB/GLTF file
  image: { type: String, default: '' },               // URL to the preview image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Furniture', FurnitureSchema);