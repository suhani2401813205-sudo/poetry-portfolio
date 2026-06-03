const { getPool } = require('../config/db');

const Comment = {
  getByPoemId: async (poem_id) => {
    const db = await getPool();
    const [rows] = await db.query(
      'SELECT * FROM comments WHERE poem_id = ? ORDER BY created_at DESC',
      [poem_id]
    );
    return rows;
  },

  create: async (data) => {
    const db = await getPool();
    const { poem_id, name, message } = data;
    await db.query(
      'INSERT INTO comments (poem_id, name, message) VALUES (?, ?, ?)',
      [poem_id, name, message]
    );
  },
};

module.exports = Comment;