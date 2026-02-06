const express = require('express');
const router = express.Router();
const { saveDesign, getDesigns } = require('../controllers/designController');

router.post('/', saveDesign);
router.get('/:userId', getDesigns);

module.exports = router;