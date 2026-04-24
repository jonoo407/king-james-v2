// King James 2 — Delete orphaned voice clips.
// "Kept" = any clip referenced by one of:
//   (a) a current dialogue-scene beat   `{speaker}/{sceneId}_{idx}.mp3`
//   (b) crown pool lines (voicePath)    `crown/cd_*.mp3`
//   (c) crown choice hints (voicePath)  `crown/hint_*.mp3`
// Everything else in audio/voices/ is deleted.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VOICES_DIR = path.join(ROOT, 'audio', 'voices');

// Load the quest data using the same shim pattern as tests/qc_suite.js
global.KJ = { Registry: { quests: { add: (q) => { (q.scenes || []).forEach(s => { global._scenes.push(s); }); } } } };
global._scenes = [];
for (const arc of ['intro', 'forest', 'mountain', 'beach', 'desert', 'volcano']) {
  const p = path.join(ROOT, 'data', 'quests', arc + '.js');
  if (fs.existsSync(p)) eval(fs.readFileSync(p, 'utf8'));
}

// Build the "keep" set of relative paths (relative to audio/voices/)
const keep = new Set();
for (const scene of global._scenes) {
  if (scene.type !== 'dialogue' || !scene.beats) continue;
  scene.beats.forEach((b, i) => {
    if (!b.speaker) return;
    keep.add(path.posix.join(b.speaker, `${scene.id}_${i}.mp3`));
  });
}

// Walk audio/voices and list every .mp3
function walk(dir, rel='') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const r = path.posix.join(rel, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) out.push(...walk(full, r));
    else if (name.endsWith('.mp3')) out.push({ full, rel: r });
  }
  return out;
}

const all = walk(VOICES_DIR);
const toDelete = [];
const kept = [];
for (const f of all) {
  const rel = f.rel;
  // Keep rule (b): crown/cd_*.mp3
  if (rel.startsWith('crown/cd_')) { kept.push(rel); continue; }
  // Keep rule (c): crown/hint_*.mp3
  if (rel.startsWith('crown/hint_')) { kept.push(rel); continue; }
  // Keep rule (a): matches a current beat
  if (keep.has(rel)) { kept.push(rel); continue; }
  toDelete.push(f);
}

console.log(`Scanned: ${all.length} files in audio/voices/`);
console.log(`Keep:    ${kept.length}`);
console.log(`Delete:  ${toDelete.length}`);
console.log('');

if (process.argv.includes('--dry-run')) {
  console.log('DRY RUN — nothing deleted. Sample of 20 orphans that WOULD be deleted:');
  toDelete.slice(0, 20).forEach(f => console.log('  ' + f.rel));
  process.exit(0);
}

let bytes = 0;
for (const f of toDelete) {
  bytes += fs.statSync(f.full).size;
  fs.unlinkSync(f.full);
}
console.log(`Deleted ${toDelete.length} files (${(bytes/1024/1024).toFixed(1)} MB).`);

// Remove now-empty speaker folders
for (const speaker of fs.readdirSync(VOICES_DIR)) {
  const dir = path.join(VOICES_DIR, speaker);
  if (fs.statSync(dir).isDirectory() && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    console.log(`Removed empty dir: ${speaker}/`);
  }
}
