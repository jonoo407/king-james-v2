/**
 * King James 2 — Crown Pool Voice Generation
 * Generates MP3s for all crown-dialogue pool lines (castle bubble, battle tutorial, KO rescue).
 *
 * Output naming: audio/voices/crown/cd_{poolId}_{lineIndex}.mp3
 * Run:    node scripts/generate_crown_voices.js
 * Resume: skips files that already exist — safe to re-run.
 *
 * 27 files total across 7 pools.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0';
const MODEL = 'eleven_turbo_v2_5';
const OUT_DIR = path.join(__dirname, '..', 'audio', 'voices', 'crown');

// Crown voice: warm/glitchy British male (George)
const VOICE = { id: 'JBFqnCBsd6RMkjVDRZzb', stability: 0.55, similarity: 0.80 };

// ── Pool definitions (mirrors data/crown-dialogue.js exactly) ────────────────
const POOLS = [
  { id: 'death_rescue_0', lines: [
    'Oh relax, I saved you. You\'re welcome.',
    'Magic crown magic! Don\'t tell anyone.',
    'Poof! ...wait did that work? Yes! Yes it worked.',
    'I zapped you home. Don\'t ask how.',
    'I MAY have done something magical. Probably.',
    'You owe me. Again. I\'m keeping count.',
  ]},
  { id: 'castle_general_0', lines: [
    'Bzzt... welcome back, James... fzz',
    'Find... crackle ...the first treasure... in the forest...',
    'I am... a crown... glitch ...mostly.',
    'Go look at... the... map thingy...',
    'Are those... your socks? fzz',
  ]},
  { id: 'castle_general_1', lines: [
    'Back so soon? Nice.',
    'Four treasures to go. Let\'s move.',
    'Pro tip: change your gear before hard fights.',
    'The library\'s open. Maybe read a thing?',
  ]},
  { id: 'castle_general_3', lines: [
    'Three down, two to go. You\'re doing great, kid.',
    'I\'m starting to feel like myself again. Ish.',
    'Don\'t forget to bring allies — you\'ll need them.',
  ]},
  { id: 'castle_general_5', lines: [
    'All five! Now — the wizard.',
    'Ready when you are, Your Majesty.',
  ]},
  { id: 'battle_open_0', lines: [
    'Don\'t just SWING. Think!',
    'Type matters. Check the icons.',
    'Patience, Schemer.',
  ]},
  { id: 'battle_tutorial', lines: [
    'See the lightning bolt? That means Super! Beats this monster\'s type.',
    'Gray shield moves are weak. Don\'t waste them.',
    'Every monster has ONE weakness. Find the lightning bolt.',
    'Goblins are plants. Fire burns plants. Easy.',
  ]},
];

// ── Build job list ────────────────────────────────────────────────────────────
const jobs = [];
for (const pool of POOLS) {
  pool.lines.forEach((text, idx) => {
    const filename = `cd_${pool.id}_${idx}.mp3`;
    jobs.push({ text, filename, poolId: pool.id, idx });
  });
}

console.log(`Crown pool voices: ${jobs.length} total files`);
console.log(`Output dir: ${OUT_DIR}\n`);

// Ensure output directory exists
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── HTTP helper ───────────────────────────────────────────────────────────────
function tts(text, stability, similarity) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability, similarity_boost: similarity }
    }));
    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE.id}`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': body.length
      }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Sequential runner (rate-limit friendly) ───────────────────────────────────
let done = 0, skipped = 0, failed = 0;

async function run() {
  for (const job of jobs) {
    const outPath = path.join(OUT_DIR, job.filename);
    if (fs.existsSync(outPath)) {
      console.log(`  SKIP  ${job.filename}`);
      skipped++;
      continue;
    }
    process.stdout.write(`  GEN   ${job.filename}  "${job.text.slice(0, 50)}" ... `);
    try {
      const { status, body } = await tts(job.text, VOICE.stability, VOICE.similarity);
      if (status === 200) {
        fs.writeFileSync(outPath, body);
        console.log(`OK (${body.length} bytes)`);
        done++;
      } else {
        console.log(`FAIL status=${status} body=${body.toString().slice(0, 120)}`);
        failed++;
      }
    } catch (e) {
      console.log(`ERROR ${e.message}`);
      failed++;
    }
    // Respect ElevenLabs rate limit (~2 req/sec on free tier)
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\nDone: ${done}  Skipped: ${skipped}  Failed: ${failed}`);
  if (failed) process.exit(1);
}

run();
