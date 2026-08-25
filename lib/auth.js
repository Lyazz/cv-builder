const crypto = require('crypto');

const COOKIE_NAME = 'cv_session';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';

function sign(value) {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

// token = "<cvId>.<expiresAt>.<hmac>" — the id isn't secret (it's just
// this session's own row), the signature only proves the server issued it.
function createSessionToken(cvId) {
  const payload = `${cvId}.${Date.now() + MAX_AGE_MS}`;
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token) {
  if (!token) return null;
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const [cvId, expires, sig] = parts;
  const expected = sign(`${cvId}.${expires}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (!Number.isFinite(Number(expires)) || Date.now() >= Number(expires)) return null;
  const id = Number(cvId);
  return Number.isInteger(id) ? id : null;
}

function parseCookies(header) {
  const out = {};
  String(header || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i === -1) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function sessionCvId(req) {
  return verifySessionToken(parseCookies(req.headers.cookie)[COOKIE_NAME]);
}

function setSessionCookie(res, cvId) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie',
    `${COOKIE_NAME}=${createSessionToken(cvId)}; HttpOnly; Path=/; Max-Age=${Math.floor(MAX_AGE_MS / 1000)}; SameSite=Lax${secure}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
}

/* ---------- PIN hashing — scrypt with a random per-PIN salt ---------- */
function hashPin(pin) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pin, salt, 32);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPin(pin, stored) {
  if (!stored || typeof pin !== 'string') return false;
  const [saltHex, hashHex] = String(stored).split(':');
  if (!saltHex || !hashHex) return false;
  let salt, expected;
  try { salt = Buffer.from(saltHex, 'hex'); expected = Buffer.from(hashHex, 'hex'); }
  catch { return false; }
  const actual = crypto.scryptSync(pin, salt, 32);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function randomPin() {
  return String(crypto.randomInt(0, 100000000)).padStart(8, '0');
}

module.exports = {
  sessionCvId, setSessionCookie, clearSessionCookie,
  hashPin, verifyPin, randomPin,
};
