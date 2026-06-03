const bcrypt = require('bcryptjs');
const { getPool } = require('../config/db');
const Poem = require('../models/Poem');
const Sketch = require('../models/Sketch');

exports.getLogin = (req, res) => {
  res.render('admin/login', { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await getPool();
    const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.render('admin/login', { error: 'Invalid username or password' });
    }
    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.render('admin/login', { error: 'Invalid username or password' });
    }
    req.session.admin = { id: admin.id, username: admin.username };
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const db = await getPool();
    const [poems] = await db.query('SELECT COUNT(*) as count FROM poems');
    const [sketches] = await db.query('SELECT COUNT(*) as count FROM sketches');
    const [comments] = await db.query('SELECT COUNT(*) as count FROM comments');
    res.render('admin/dashboard', {
      poemCount: poems[0].count,
      sketchCount: sketches[0].count,
      commentCount: comments[0].count,
      admin: req.session.admin
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.getPoems = async (req, res) => {
  try {
    const poems = await Poem.getAll();
    res.render('admin/poems', { poems, admin: req.session.admin });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.createPoem = async (req, res) => {
  try {
    await Poem.create(req.body);
    res.redirect('/admin/poems');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.deletePoem = async (req, res) => {
  try {
    await Poem.delete(req.params.id);
    res.redirect('/admin/poems');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};