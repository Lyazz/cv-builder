const path = require('path');
const express = require('express');
const { db, ensureInit } = require('./db');

const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

function deriveTitle(data) {
  const name = (data && data.fullName ? String(data.fullName).trim() : '') || 'Sans titre';
  return name.slice(0, 120);
}

// List all saved CVs (id, title, updated_at only)
app.get('/api/cvs', async (req, res) => {
  await ensureInit();
  const { rows } = await db.execute('SELECT id, title, updated_at FROM cvs ORDER BY updated_at DESC');
  res.json(rows);
});

// Get one CV's full data
app.get('/api/cvs/:id', async (req, res) => {
  await ensureInit();
  const { rows } = await db.execute({
    sql: 'SELECT id, title, data, updated_at FROM cvs WHERE id = ?',
    args: [req.params.id],
  });
  const row = rows[0];
  if (!row) return res.status(404).json({ error: 'CV introuvable' });
  res.json({ id: row.id, title: row.title, updatedAt: row.updated_at, data: JSON.parse(row.data) });
});

// Create a new CV
app.post('/api/cvs', async (req, res) => {
  await ensureInit();
  const data = req.body || {};
  const title = deriveTitle(data);
  const result = await db.execute({
    sql: 'INSERT INTO cvs (title, data) VALUES (?, ?)',
    args: [title, JSON.stringify(data)],
  });
  res.status(201).json({ id: Number(result.lastInsertRowid), title });
});

// Update an existing CV
app.put('/api/cvs/:id', async (req, res) => {
  await ensureInit();
  const data = req.body || {};
  const title = deriveTitle(data);
  const result = await db.execute({
    sql: "UPDATE cvs SET title = ?, data = ?, updated_at = datetime('now') WHERE id = ?",
    args: [title, JSON.stringify(data), req.params.id],
  });
  if (result.rowsAffected === 0) return res.status(404).json({ error: 'CV introuvable' });
  res.json({ id: Number(req.params.id), title });
});

// Delete a CV
app.delete('/api/cvs/:id', async (req, res) => {
  await ensureInit();
  const result = await db.execute({ sql: 'DELETE FROM cvs WHERE id = ?', args: [req.params.id] });
  if (result.rowsAffected === 0) return res.status(404).json({ error: 'CV introuvable' });
  res.status(204).end();
});

module.exports = app;
