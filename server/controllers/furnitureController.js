const Furniture = require('../models/Furniture');


exports.getAllFurniture = async (req, res) => {
  try {
    const items = await Furniture.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


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