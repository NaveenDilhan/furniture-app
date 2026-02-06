const Design = require('../models/Design');

// @desc    Save a design
// @route   POST /api/designs
exports.saveDesign = async (req, res) => {
  try {
    const { userId, name, items } = req.body;
    const design = await Design.create({ userId, name, items });
    res.status(201).json({ success: true, design });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user designs
// @route   GET /api/designs/:userId
exports.getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.params.userId });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};