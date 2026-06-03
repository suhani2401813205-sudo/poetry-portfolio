const { getPool } = require('../config/db');

const SketchComment = {
  getBySketchId: async (sketch_id) => {
    const db = await getPool();
    const [rows] = await db.query(
      'SELECT * FROM sketch_comments WHERE sketch_id = ? ORDER BY created_at DESC',
      [sketch_id]
    );
    return rows;
  },

  create: async (data) => {
    const db = await getPool();
    const { sketch_id, name, message } = data;
    await db.query(
      'INSERT INTO sketch_comments (sketch_id, name, message) VALUES (?, ?, ?)',
      [sketch_id, name, message]
    );
  },
};

module.exports = SketchComment;