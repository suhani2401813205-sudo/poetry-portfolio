const Sketch = require('../models/Sketch');
const SketchComment = require('../models/sketchComment');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

exports.upload = multer({ storage });

exports.index = async (req, res) => {
  try {
    const grouped = await Sketch.getByCategory();
    res.render('sketches/index', { grouped });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Something went wrong');
  }
};

exports.show = async (req, res) => {
  try {
    const sketch = await Sketch.getById(req.params.id);
    if (!sketch) return res.status(404).send('Sketch not found');
    await Sketch.incrementViews(req.params.id);
    const comments = await SketchComment.getBySketchId(req.params.id);
    res.render('sketches/show', { sketch, comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).se