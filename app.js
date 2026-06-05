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

// Routes
const poemRoutes = require('./routes/poemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sketchRoutes = require('./routes/sketchRoutes');
const aboutController = require('./controllers/aboutController');
const homeController = require('./controllers/homeController');

app.use('/poems', poemRoutes);
app.use('/admin', adminRoutes);
app.use('/sketches', sketchRoutes);
app.get('/about', aboutController.index);
app.get('/', homeController.index);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});