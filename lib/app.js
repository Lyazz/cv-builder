const path = require('path');
const express = require('express');
const { db, ensureInit } = require('./db');
const { sessionCvId, setSessionCookie, clearSessionCookie, hashPin, verifyPin } = require('./auth');

const app = express();

app.use(express.json({ limit: '15mb' }));

// Gate the app shell behind a valid session — anonymous visitors only ever see login.html.
app.get(['/', '/index.html'], (req, res, next) => {
  if (sessionCvId(req) === null) return res.redirect('/login.html');
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public')));

function deriveTitle(data) {
  const name = (data && data.fullName ? String(data.fullName).trim() : '') || 'Sans titre';
  return name.slice(0, 120);
}

// A PIN *is* the CV: an unrecognised one creates a brand-new blank CV
// under it on the spot, a recognised one opens that CV. There is no
// separate signup step and no list of CVs to browse.
app.post('/api/login', async (req, res) => {
  await ensureInit();
  const pin = (req.body || {}).pin;
  if (typeof pin !== 'string' || !/^\d{8}$/.test(pin)) {
    return res.status(400).json({ error: 'Code à 8 chiffres requis' });
  }

  const { rows } = await db.execute('SELECT id, pin_hash FROM cvs');
  const match = rows.find((r) => verifyPin(pin, r.pin_hash));
  if (match) {
    setSessionCookie(res, match.id);
    return res.json({ ok: true, created: false });
  }

  const result = await db.execute({
    sql: 'INSERT INTO cvs (title, data, pin_hash) VALUES (?, ?, ?)',
    args: ['Sans titre', JSON.stringify({}), hashPin(pin)],
  });
  setSessionCookie(res, Number(result.lastInsertRowid));
  res.json({ ok: true, created: true });
});

app.post('/api/logout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/session', (req, res) => {
  res.json({ authed: sessionCvId(req) !== null });
});

// Everything below operates on "my CV" — the one this session's PIN unlocked.
app.use('/api/cv', async (req, res, next) => {
  await ensureInit();
  const cvId = sessionCvId(req);
  if (cvId === null) return res.status(401).json({ error: 'Non authentifié' });
  req.cvId = cvId;
  next();
});

app.get('/api/cv', async (req, res) => {
  const { rows } = await db.execute({
    sql: 'SELECT id, title, data, updated_at FROM cvs WHERE id = ?',
    args: [req.cvId],
  });
  const row = rows[0];
  if (!row) { clearSessionCookie(res); return res.status(404).json({ error: 'CV introuvable' }); }
  res.json({ id: row.id, title: row.title, updatedAt: row.updated_at, data: JSON.parse(row.data) });
});

app.put('/api/cv', async (req, res) => {
  const data = req.body || {};
  const title = deriveTitle(data);
  await db.execute({
    sql: "UPDATE cvs SET title = ?, data = ?, updated_at = datetime('now') WHERE id = ?",
    args: [title, JSON.stringify(data), req.cvId],
  });
  res.json({ id: req.cvId, title });
});

app.delete('/api/cv', async (req, res) => {
  await db.execute({ sql: 'DELETE FROM cvs WHERE id = ?', args: [req.cvId] });
  clearSessionCookie(res);
  res.status(204).end();
});

module.exports = app;
