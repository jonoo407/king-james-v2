/**
 * King James 2 — Voice Generation
 * Generates all dialogue audio files for all quest arcs.
 *
 * Output: audio/voices/{speaker_id}/{scene_id}_{beat_index}.mp3
 * Run:    node scripts/generate_voices.js
 * Resume: skips files that already exist — safe to re-run.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0';
const MODEL = 'eleven_turbo_v2_5';
const OUT_DIR = path.join(__dirname, '..', 'audio', 'voices');

// ── Voice cast ────────────────────────────────────────────────────────────────
const VOICES = {
  crown:      { id: 'JBFqnCBsd6RMkjVDRZzb', stability: 0.55, similarity: 0.80 },
  narrator:   { id: '8LVfoRdkh4zgjr8v5ObE', stability: 0.55, similarity: 0.80 },
  james:      { id: 'PzuBz8h2SxBvQ7lnUC44', stability: 0.38, similarity: 0.70 },
  mornox:     { id: 'wXvR48IpOq9HACltTmt7', stability: 0.70, similarity: 0.88 },
  foxy:       { id: '1Z7qQDyqapTm8qBfJx6e', stability: 0.40, similarity: 0.75 },
  ribbit:     { id: 'ApsbCjXt5HguctE80a0i', stability: 0.45, similarity: 0.75 },
  owlette:    { id: 'u0REnIJvUgcGQYW2Ux8K', stability: 0.50, similarity: 0.80 },
  gus:        { id: 'LRpNiUBlcqgIsKUzcrlN', stability: 0.55, similarity: 0.80 },
  yeti:       { id: 'nPczCjzI2devNBz1zQrb', stability: 0.45, similarity: 0.80 },
  wraith:     { id: 'pFZP5JQG7iQjIQuC4Bku', stability: 0.40, similarity: 0.75 },
  frostbeard: { id: 'dAcds2QMcvmv86jQMC3Y', stability: 0.55, similarity: 0.80 },
  finn:       { id: 'yl2ZDV1MzN4HbQJbMihG', stability: 0.40, similarity: 0.75 },
  drifter:    { id: 'EXAVITQu4vr4xnSDxMaL', stability: 0.55, similarity: 0.82 },
  zephyra:    { id: 'kkPJzQOWz2Oz9cUaEaQd', stability: 0.55, similarity: 0.85 }, // Beatrice — Mature British Storyteller
};

// ── Extract scenes from quest files ──────────────────────────────────────────
const questScenes = {};
global.KJ = { Registry: { quests: { add: (q) => { questScenes[q.id] = q.scenes; } } } };

for (const arc of ['intro', 'forest', 'mountain', 'beach', 'desert']) {
  const p = path.join(__dirname, '..', 'data', 'quests', arc + '.js');
  if (fs.existsSync(p)) eval(fs.readFileSync(p, 'utf8'));
}

// ── Collect all beats ─────────────────────────────────────────────────────────
const jobs = [];
for (const [, scenes] of Object.entries(questScenes)) {
  for (const scene of scenes) {
    if (!scene.beats) continue;
    scene.beats.forEach((beat, i) => {
      if (!VOICES[beat.speaker]) return; // skip unvoiced speakers
      jobs.push({ speaker: beat.speaker, text: beat.text, scene: scene.id, index: i });
    });
  }
}

console.log(`Total jobs: ${jobs.length}`);

// ── HTTP helper ───────────────────────────────────────────────────────────────
function tts(voiceId, text, stability, similarity) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability, similarity_boost: similarity }
    }));
    const u = new URL(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`);
    const req = https.request({
      hostname: u.hostname, path: u.pathname,
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Run ───────────────────────────────────────────────────────────────────────
(async () => {
  let done = 0, skipped = 0, failed = 0;

  for (const job of jobs) {
    const dir = path.join(OUT_DIR, job.speaker);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${job.scene}_${job.index}.mp3`);

    if (fs.existsSync(file)) { skipped++; continue; }

    const v = VOICES[job.speaker];
    process.stdout.write(`[${done + skipped + failed + 1}/${jobs.length}] ${job.speaker} / ${job.scene}_${job.index} ... `);

    let attempts = 0;
    while (attempts < 3) {
      try {
        const res = await tts(v.id, job.text, v.stability, v.similarity);
        if (res.status === 200) {
          fs.writeFileSync(file, res.body);
          process.stdout.write('OK\n');
          done++;
          break;
        } else if (res.status === 429) {
          process.stdout.write('rate-limited, waiting 10s...\n');
          await sleep(10000);
          attempts++;
        } else {
          process.stdout.write(`FAIL ${res.status}: ${res.body.toString().slice(0, 80)}\n`);
          failed++;
          break;
        }
      } catch (e) {
        process.stdout.write(`ERROR: ${e.message}\n`);
        failed++;
        break;
      }
    }

    // Small pause to avoid hammering the API
    await sleep(200);
  }

  console.log(`\n✓ Done: ${done} generated, ${skipped} skipped, ${failed} failed`);
})();
