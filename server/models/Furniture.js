const mongoose = require('mongoose');

const FurnitureSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },             
  type: { type: String, required: true },             
  price: { type: Number, required: true, default: 0 }, 
  modelUrl: { type: String, required: true },         
  image: { type: String, default: '' },               
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Furniture', FurnitureSchema);