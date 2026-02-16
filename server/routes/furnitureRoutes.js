// server/routes/furnitureRoutes.js
const express = require('express');
const router = express.Router();
const furnitureController = require('../controllers/furnitureController');

router.get('/', furnitureController.getAllFurniture);
router.post('/', furnitureController.addFurniture); // Used for seeding/admin

module.exports = router;