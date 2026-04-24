// Bump the cache-busting `?v=N` query string on every asset in index.html.
// Run before deploy whenever JS/CSS has changed: `node scripts/bump_build.js`

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
const src = fs.readFileSync(file, 'utf8');

// Find max existing version so we don't go backwards
const matches = [...src.matchAll(/\?v=(\d+)/g)].map(m => parseInt(m[1], 10));
const current = matches.length ? Math.max(...matches) : 1;
const next = current + 1;

const out = src.replace(/\?v=\d+/g, '?v=' + next);
fs.writeFileSync(file, out);
console.log(`Bumped ?v=${current} → ?v=${next} (${matches.length} refs)`);
