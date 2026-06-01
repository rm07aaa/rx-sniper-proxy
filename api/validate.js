// api/validate.js — checks if a token is valid

const VALID_TOKENS = new Set([
  process.env.TOKEN_USER_1,
  process.env.TOKEN_USER_2,
  process.env.TOKEN_USER_3,
  process.env.TOKEN_USER_4,
  process.env.TOKEN_USER_5,
]);

export default function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'x-rx-token, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers['x-rx-token'];
  if (!token || !VALID_TOKENS.has(token)) {
    return res.status(403).json({ valid: false });
  }
  return res.status(200).json({ valid: true });
}
