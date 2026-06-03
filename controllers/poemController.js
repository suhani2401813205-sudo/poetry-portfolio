const Poem = require('../models/Poem');
const Comment = require('../models/Comment');

exports.index = async (req, res) => {
  try {
    const filter = {};
    if (req.query.language) filter.language = req.query.language;
    const poems = await Poem.getAll(filter);
    res.render('poems/index', { poems, filter });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.show = async (req, res) => {
  try {
    const poem = await Poem.getById(req.params.id);
    if (!poem) return res.status(404).send('Poem not found');
    await Poem.incrementViews(req.params.id);
    const comments = await Comment.getByPoemId(req.params.id);
    res.render('poems/show', { poem, comments });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.like = async (req, res) => {
  try {
    await Poem.incrementLikes(req.params.id);
    res.redirect(`/poems/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.comment = async (req, res) => {
  try {
    const { name, message } = req.body;
    await Comment.create({ poem_id: req.params.id, name, message });
    res.redirect(`/poems/${req.params.id}#comments`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};