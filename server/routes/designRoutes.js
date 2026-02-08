const express = require('express');
const router = express.Router();
const { saveDesign, getDesigns, updateFurnitureItem } = require('../controllers/designController');

router.post('/', saveDesign);
router.get('/:userId', getDesigns);
router.patch('/:designId/furniture/:itemId', updateFurnitureItem);

module.exports = router;