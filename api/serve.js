export default function handler(req, res) {
  // ── CORS preflight (Safari sends this first) ──────────────
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'x-rx-token');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }

  // ── Token check ───────────────────────────────────────────
  const token = req.headers['x-rx-token'];
  if (!token || token !== process.env.RX_ACCESS_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // ── Script content lives ONLY in env variable ─────────────
  const script = process.env.RX_SCRIPT_CONTENT;
  if (!script) {
    return res.status(500).json({ error: 'Script not configured' });
  }

  // ── Serve it ──────────────────────────────────────────────
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.status(200).send(script);
}
