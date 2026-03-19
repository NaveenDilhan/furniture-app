const Order = require('../models/Order');


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


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};