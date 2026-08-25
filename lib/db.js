const path = require('path');
const { createClient } = require('@libsql/client');
const { hashPin, verifyPin, randomPin } = require('./auth');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || `file:${path.join(__dirname, '..', 'data', 'cv-builder.db')}`,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Any CV saved before pin_hash existed gets one assigned here, once,
// and it is only ever shown in this log line — there is no other way
// to recover it, so this only matters for the one-time migration.
async function backfillPins() {
  const { rows } = await db.execute('SELECT id, title, pin_hash FROM cvs');
  const knownHashes = rows.filter((r) => r.pin_hash).map((r) => r.pin_hash);
  const missing = rows.filter((r) => !r.pin_hash);
  if (!missing.length) return;

  const generated = [];
  for (const row of missing) {
    let pin;
    let tries = 0;
    do { pin = randomPin(); tries++; }
    while (tries < 50 && knownHashes.some((h) => verifyPin(pin, h)));
    const hash = hashPin(pin);
    knownHashes.push(hash);
    await db.execute({ sql: 'UPDATE cvs SET pin_hash = ? WHERE id = ?', args: [hash, row.id] });
    generated.push({ id: row.id, title: row.title, pin });
  }

  console.log('=== CV Builder : PIN générés pour des CV existants (à noter, non réaffichés) ===');
  generated.forEach((g) => console.log(`  #${g.id}  "${g.title}"  ->  PIN ${g.pin}`));
}

let ready = null;
function ensureInit() {
  if (!ready) {
    ready = (async () => {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS cvs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL DEFAULT 'Sans titre',
          data TEXT NOT NULL,
          pin_hash TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);
      const info = await db.execute('PRAGMA table_info(cvs)');
      if (!info.rows.some((r) => r.name === 'pin_hash')) {
        await db.execute('ALTER TABLE cvs ADD COLUMN pin_hash TEXT');
      }
      await backfillPins();
    })();
  }
  return ready;
}

module.exports = { db, ensureInit };
