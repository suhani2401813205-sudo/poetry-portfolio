const { getPool } = require('./config/db');

async function test() {
  try {
    const db = await getPool();
    const [rows] = await db.query('SELECT 1');
    console.log('DB connected successfully!');
  } catch (err) {
    console.error('DB Error:', err.message);
  }
}

test();