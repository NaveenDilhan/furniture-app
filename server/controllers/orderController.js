const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;

    const newOrder = new Order({
      customer,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all orders (Optional, for admin)
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};