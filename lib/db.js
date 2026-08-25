const path = require('path');
const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || `file:${path.join(__dirname, '..', 'data', 'cv-builder.db')}`,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let ready = null;
function ensureInit() {
  if (!ready) {
    ready = db.execute(`
      CREATE TABLE IF NOT EXISTS cvs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL DEFAULT 'Sans titre',
        data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
  }
  return ready;
}

module.exports = { db, ensureInit };
