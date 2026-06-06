const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Auto create uploads folder
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretkey123',
  resave: false,
  saveUninitialized: false
}));

// Models
const Poem = require('./models/Poem');
const Sketch = require('./models/Sketch');
const { getPool } = require('./config/db');

// Routes
const poemRoutes = require('./routes/poemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sketchRoutes = require('./routes/sketchRoutes');
const aboutController = require('./controllers/aboutController');

app.use('/poems', poemRoutes);
app.use('/admin', adminRoutes);
app.use('/sketches', sketchRoutes);
app.get('/about', aboutController.index);

// Home route
app.get('/', async (req, res) => {
  try {
    const featured = await Poem.getFeatured();
    const recentPoems = await Poem.getRecent(6);
    const db = await getPool();
    const [poemCount] = await db.query('SELECT COUNT(*) as count FROM poems');
    const [sketchCount] = await db.query('SELECT COUNT(*) as count FROM sketches');
    const [totalLikes] = await db.query('SELECT SUM(likes) as total FROM poems');
    res.render('home', {
      featured,
      recentPoems,
      poemCount: poemCount[0].count,
      sketchCount: sketchCount[0].count,
      totalLikes: totalLikes[0].total || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).send(err.message);
});