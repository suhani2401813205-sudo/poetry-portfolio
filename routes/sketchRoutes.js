const express = require('express');
const router = express.Router();
const sketchController = require('../controllers/sketchController');
const auth = require('../middleware/authMiddleware');

// Public
router.get('/', sketchController.index);
router.get('/:id', sketchController.show);
router.post('/:id/comment', sketchController.comment);

// Admin
router.get('/admin', auth, sketchController.adminIndex);
router.post('/admin', auth, sketchController.upload.single('image'), sketchController.create);
router.delete('/admin/:id', auth, sketchController.delete);

module.exports = router;