
const express = require('express');
const router = express.Router();
const furnitureController = require('../controllers/furnitureController');

router.get('/', furnitureController.getAllFurniture);
router.post('/', furnitureController.addFurniture); 

module.exports = router;