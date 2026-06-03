const mysql = require('mysql2/promise');

let pool;

async function getPool() {
  if (!pool) {
    pool = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '9764',
      database: 'poetry_portfolio',
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

module.exports = { getPool };