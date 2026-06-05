
const VALID_TOKENS = new Set([
  process.env.TOKEN_USER_1,
  process.env.TOKEN_USER_2,
  process.env.TOKEN_USER_3,
  process.env.TOKEN_USER_4,
  process.env.TOKEN_USER_5,
]);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'x-rx-token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.query.token;
  if (!token || !VALID_TOKENS.has(token)) {
    return res.status(403).send('// Forbidden');
  }

  // Fetch the actual script from your private repo
  const url = `https://raw.githubusercontent.com/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/${process.env.GITHUB_BRANCH}/${process.env.GITHUB_FILE}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${process.env.GITHUB_PAT}`,
      'Accept': 'application/vnd.github.v3.raw',
    }
  });

  const scriptContent = await response.text();

  // Wrap with userscript header so UserScripts app recognises it
  const userscript = `// ==UserScript==
// @name         RX Sniper
// @namespace    https://rx-sniper-proxy.vercel.app
// @version      1.0
// @description  RX Sniper for EA FC
// @author       RX
// @match        https://www.ea.com/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

${scriptContent}`;

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(userscript);
}
