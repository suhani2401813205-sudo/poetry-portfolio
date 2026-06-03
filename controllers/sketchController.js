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
    console.error(err);
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
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.comment = async (req, res) => {
  try {
    const { name, message } = req.body;
    await SketchComment.create({ sketch_id: req.params.id, name, message });
    res.redirect(`/sketches/${req.params.id}#comments`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.adminIndex = async (req, res) => {
  try {
    const sketches = await Sketch.getAll();
    res.render('admin/sketches', { sketches, admin: req.session.admin });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.create = async (req, res) => {
  try {
    const image_url = '/uploads/' + req.file.filename;
    await Sketch.create({ ...req.body, image_url });
    res.redirect('/admin/sketches');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.delete = async (req, res) => {
  try {
    await Sketch.delete(req.params.id);
    res.redirect('/admin/sketches');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};