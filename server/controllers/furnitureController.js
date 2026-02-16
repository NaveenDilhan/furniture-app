// server/controllers/furnitureController.js
const Furniture = require('../models/Furniture');

// @desc    Get all furniture items
// @route   GET /api/furniture
exports.getAllFurniture = async (req, res) => {
  try {
    const items = await Furniture.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a furniture item (Use this to populate your DB initially)
// @route   POST /api/furniture
exports.addFurniture = async (req, res) => {
  const { id, name, type, modelUrl, image } = req.body;
  
  try {
    const newItem = new Furniture({ id, name, type, modelUrl, image });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};