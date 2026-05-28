// api/serve.js — RX Sniper secure proxy (multi-user)
 
// Add or remove tokens here — one per user.
// To revoke someone: delete their line, redeploy. Done.
const VALID_TOKENS = new Set([
  process.env.TOKEN_USER_1,
  process.env.TOKEN_USER_2,
  process.env.TOKEN_USER_3,
  // Add more: process.env.TOKEN_USER_4, etc.
]);
 
export default function handler(req, res) {
 
  // Handle Safari preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'x-rx-token');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }
 
  // Check token against the list
  const token = req.headers['x-rx-token'];
  if (!token || !VALID_TOKENS.has(token)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
 
  // Serve the script
  const script = process.env.RX_SCRIPT_CONTENT;
  if (!script) {
    return res.status(500).json({ error: 'Script not configured' });
  }
 
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(script);
}
