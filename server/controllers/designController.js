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


// @desc    Update a single furniture item in a design
// @route   PATCH /api/designs/:designId/furniture/:itemId
exports.updateFurnitureItem = async (req, res) => {
  try {
    const { designId, itemId } = req.params;
    const { color, scale, position, rotation } = req.body;

    const design = await Design.findById(designId);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    const itemIndex = design.items.findIndex(item => item.id == itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Furniture item not found' });
    }

    const itemToUpdate = design.items[itemIndex];
    if (color) itemToUpdate.color = color;
    if (scale) itemToUpdate.scale = scale;
    if (position) itemToUpdate.position = position;
    if (rotation) itemToUpdate.rotation = rotation;

    design.items[itemIndex] = itemToUpdate;
    design.markModified('items');
    await design.save();

    res.status(200).json({ success: true, data: design });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
