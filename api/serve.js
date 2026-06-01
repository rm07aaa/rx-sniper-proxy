// api/serve.js — RX Sniper proxy (multi-user + token validation)


const GITHUB_USER   = 'rm07aaa';
const GITHUB_REPO   = 'rx-script-store';
const GITHUB_FILE   = 'rx_sniper_mobile_full.js';
const GITHUB_BRANCH = 'main';
// ──────────────────────────────────────────────────────────


const VALID_TOKENS = new Set([
  process.env.TOKEN_USER_1,
  process.env.TOKEN_USER_2,
  process.env.TOKEN_USER_3,
  process.env.TOKEN_USER_4,
  process.env.TOKEN_USER_5,
]);

export default async function handler(req, res) {

  // ── CORS ──────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'x-rx-token, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { pathname } = new URL(req.url, `https://${req.headers.host}`);

  // ── ROUTE 1: /api/serve/validate ──────────────────────────
  if (pathname === '/api/serve/validate') {
    const token = req.headers['x-rx-token'];
    if (!token || !VALID_TOKENS.has(token)) {
      return res.status(403).json({ valid: false });
    }
    return res.status(200).json({ valid: true });
  }

  // ── ROUTE 2: /api/serve ───────────────────────────────────
  const token = req.headers['x-rx-token'];
  if (!token || !VALID_TOKENS.has(token)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_FILE}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${process.env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github.v3.raw',
    }
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to fetch script' });
  }

  const script = await response.text();

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(script);
}
