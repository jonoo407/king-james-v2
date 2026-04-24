// King James 2 — Rebuild audio/manifest.json from the files on disk.
// Key format: "{speaker}/{clipStem}" (no prefix, no extension).
// Value format: "audio/voices/{speaker}/{clipStem}.mp3" (the actual HTTP path).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VOICES = path.join(ROOT, 'audio', 'voices');
const OUT = path.join(ROOT, 'audio', 'manifest.json');

const manifest = {};
for (const speaker of fs.readdirSync(VOICES).sort()) {
  const dir = path.join(VOICES, speaker);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith('.mp3')) continue;
    const stem = name.replace(/\.mp3$/, '');
    manifest[`${speaker}/${stem}`] = `audio/voices/${speaker}/${name}`;
  }
}

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 0) + '\n');
console.log(`Wrote ${Object.keys(manifest).length} entries to audio/manifest.json`);
