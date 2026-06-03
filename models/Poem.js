const { getPool } = require('../config/db');

const Poem = {
  getAll: async (filter = {}) => {
    const db = await getPool();
    let query = 'SELECT * FROM poems';
    const params = [];
    if (filter.language) {
      query += ' WHERE language = ?';
      params.push(filter.language);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  getById: async (id) => {
    const db = await getPool();
    const [rows] = await db.query('SELECT * FROM poems WHERE id = ?', [id]);
    return rows[0];
  },

  getFeatured: async () => {
    const db = await getPool();
    const [rows] = await db.query('SELECT * FROM poems WHERE is_featured = true LIMIT 1');
    return rows[0];
  },

  create: async (data) => {
    const db = await getPool();
    const { title, body, language, mood, is_featured } = data;
    const [result] = await db.query(
      'INSERT INTO poems (title, body, language, mood, is_featured) VALUES (?, ?, ?, ?, ?)',
      [title, body, language, mood, is_featured || false]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const db = await getPool();
    const { title, body, language, mood, is_featured } = data;
    await db.query(
      'UPDATE poems SET title=?, body=?, language=?, mood=?, is_featured=? WHERE id=?',
      [title, body, language, mood, is_featured || false, id]
    );
  },

  delete: async (id) => {
    const db = await getPool();
    await db.query('DELETE FROM poems WHERE id = ?', [id]);
  },

  incrementViews: async (id) => {
    const db = await getPool();
    await db.query('UPDATE poems SET views = views + 1 WHERE id = ?', [id]);
  },

  incrementLikes: async (id) => {
    const db = await getPool();
    await db.query('UPDATE poems SET likes = likes + 1 WHERE id = ?', [id]);
  },
};

module.exports = Poem;

