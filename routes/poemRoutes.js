const express = require('express');
const router = express.Router();
const poemController = require('../controllers/poemController');

router.get('/', poemController.index);
router.get('/:id', poemController.show);
router.post('/:id/like', poemController.like);
router.post('/:id/comment', poemController.comment);

module.exports = router;