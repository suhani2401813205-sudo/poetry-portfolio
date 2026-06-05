const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();

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
const fs = require('fs');
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const poemRoutes = require('./routes/poemRoutes');
app.use('/poems', poemRoutes);
const adminRoutes = require('./routes/adminRoutes');

app.use('/poems', poemRoutes);
app.use('/admin', adminRoutes);
const sketchRoutes = require('./routes/sketchRoutes');
app.use('/sketches', sketchRoutes);
const aboutController = require('./controllers/aboutController');
app.get('/about', aboutController.index);
// app.use('/', poemRoutes);
// app.use('/admin', adminRoutes);

// Home route (temporary)
app.get('/', async (req, res) => {
  try {
    const Poem = require('./models/Poem');
    const featured = await Poem.getFeatured();
    const poems = await Poem.getAll();
    res.render('home', { featured, poems });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});