const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const sketchController = require('../controllers/sketchController');
const auth = require('../middleware/authMiddleware');

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

router.get('/dashboard', auth, adminController.getDashboard);
router.get('/poems', auth, adminController.getPoems);
router.post('/poems', auth, adminController.createPoem);
router.delete('/poems/:id', auth, adminController.deletePoem);

router.get('/sketches', auth, sketchController.adminIndex);
router.post('/sketches', auth, (req, res, next) => {
  console.log('Reached sketch upload route');
  next();
}, sketchController.upload.single('image'), (req, res, next) => {
  console.log('After multer, file:', req.file ? 'exists' : 'missing');
  next();
}, sketchController.create);
router.delete('/sketches/:id', auth, sketchController.delete);

module.exports = router;