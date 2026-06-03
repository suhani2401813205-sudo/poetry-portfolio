const { getPool } = require('../config/db');

exports.index = async (req, res) => {
  try {
    const db = await getPool();
    const [poemCount] = await db.query('SELECT COUNT(*) as count FROM poems');
    const [sketchCount] = await db.query('SELECT COUNT(*) as count FROM sketches');
    const [totalLikes] = await db.query('SELECT SUM(likes) as total FROM poems');
    res.render('about', {
      poemCount: poemCount[0].count,
      sketchCount: sketchCount[0].count,
      totalLikes: totalLikes[0].total || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};