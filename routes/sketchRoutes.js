const express = require('express');
const router = express.Router();
const sketchController = require('../controllers/sketchController');

// Public only
router.get('/', sketchController.index);
router.get('/:id', sketchController.show);
router.post('/:id/comment', sketchController.comment);

module.exports = router;