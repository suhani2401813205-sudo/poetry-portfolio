const { getPool } = require('../config/db');

const Sketch = {
  getAll: async () => {
    const db = await getPool();
    const [rows] = await db.query(
      'SELECT * FROM sketches ORDER BY category, created_at DESC'
    );
    return rows;
  },

  getById: async (id) => {
    const db = await getPool();
    const [rows] = await db.query('SELECT * FROM sketches WHERE id = ?', [id]);
    return rows[0];
  },

  getByCategory: async () => {
    const db = await getPool();
    const [rows] = await db.query(
      'SELECT * FROM sketches ORDER BY category, created_at DESC'
    );
    const grouped = {};
    rows.forEach(sketch => {
      if (!grouped[sketch.category]) {
        grouped[sketch.category] = [];
      }
      grouped[sketch.category].push(sketch);
    });
    return grouped;
  },

  create: async (data) => {
    const db = await getPool();
    const { title, image_url, medium, category } = data;
    await db.query(
      'INSERT INTO sketches (title, image_url, medium, category) VALUES (?, ?, ?, ?)',
      [title, image_url, medium, category]
    );
  },

  delete: async (id) => {
    const db = await getPool();
    await db.query('DELETE FROM sketches WHERE id = ?', [id]);
  },

  incrementViews: async (id) => {
    const db = await getPool();
    await db.query('UPDATE sketches SET views = views + 1 WHERE id = ?', [id]);
  },
};

module.exports = Sketch;