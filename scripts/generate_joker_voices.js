// Generates the 18 new voice clips for the Joker trait:
//   - 12 James prank lines   → audio/voices/james/joker_{0..11}.mp3
//   - 3  Narrator unlock     → audio/voices/narrator/joker_unlock_{0..2}.mp3
//   - 3  Crown   unlock      → audio/voices/crown/joker_unlock_{0..2}.mp3

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0';
const MODEL   = 'eleven_turbo_v2_5';
const ROOT    = path.join(__dirname, '..', 'audio', 'voices');

const VOICES = {
  james:    { id: 'PzuBz8h2SxBvQ7lnUC44', stability: 0.38, similarity: 0.70 },
  narrator: { id: '8LVfoRdkh4zgjr8v5ObE', stability: 0.55, similarity: 0.80 },
  crown:    { id: 'JBFqnCBsd6RMkjVDRZzb', stability: 0.55, similarity: 0.80 },
};

const JOBS = [
  // James — 12 prank lines (index matches joker.js voiceIdx)
  { speaker: 'james',    file: 'joker_0.mp3',  text: "Oops! Watch your step…" },
  { speaker: 'james',    file: 'joker_1.mp3',  text: "BPPRRRT! Got 'em!" },
  { speaker: 'james',    file: 'joker_2.mp3',  text: "You look GREAT in pink!" },
  { speaker: 'james',    file: 'joker_3.mp3',  text: "Is that a worm? It's rubber. BUT STILL." },
  { speaker: 'james',    file: 'joker_4.mp3',  text: "SPLAT! Dessert's ready." },
  { speaker: 'james',    file: 'joker_5.mp3',  text: "SPARKLE EXPLOSION!" },
  { speaker: 'james',    file: 'joker_6.mp3',  text: "AHHHHH — gotcha." },
  { speaker: 'james',    file: 'joker_7.mp3',  text: "QUACK QUACK QUACK QUACK QUACK." },
  { speaker: 'james',    file: 'joker_8.mp3',  text: "LADIES AND GENTLEMEN — THE SHOW!" },
  { speaker: 'james',    file: 'joker_9.mp3',  text: "Wait… are you on our team?" },
  { speaker: 'james',    file: 'joker_10.mp3', text: "Open it! …IT'S A BEE!" },
  { speaker: 'james',    file: 'joker_11.mp3', text: "See ya! Have fun fishing." },
  // Narrator — 3 unlock announcements
  { speaker: 'narrator', file: 'joker_unlock_0.mp3', text: "Something just clicked. All those dumb jokes James tells at dinner? They just started working." },
  { speaker: 'narrator', file: 'joker_unlock_1.mp3', text: "James has leveled up. So have his pranks. He's got props now. And timing." },
  { speaker: 'narrator', file: 'joker_unlock_2.mp3', text: "The kingdom has a new name for James: The Show. The monsters don't like it." },
  // Crown — 3 unlock punchlines
  { speaker: 'crown',    file: 'joker_unlock_0.mp3', text: "Oh no. OH NO. Kid — this is a SUPERPOWER now. Try not to break anything." },
  { speaker: 'crown',    file: 'joker_unlock_1.mp3', text: "Is that a pie in your backpack? …it is. Wild." },
  { speaker: 'crown',    file: 'joker_unlock_2.mp3', text: "You, sir, are no longer a kid. You are a whole ENTERTAINMENT DIVISION." },
];

function tts(voiceId, text, stability, similarity) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(JSON.stringify({
      text, model_id: MODEL,
      voice_settings: { stability, similarity_boost: similarity }
    }));
    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json', 'Content-Length': body.length },
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let done = 0, skipped = 0, failed = 0;
  for (const job of JOBS) {
    const dir = path.join(ROOT, job.speaker);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, job.file);
    if (fs.existsSync(out)) { skipped++; process.stdout.write(`SKIP ${job.speaker}/${job.file}\n`); continue; }
    const v = VOICES[job.speaker];
    process.stdout.write(`[${done + skipped + failed + 1}/${JOBS.length}] ${job.speaker}/${job.file} "${job.text.slice(0, 40)}..." ... `);
    try {
      const res = await tts(v.id, job.text, v.stability, v.similarity);
      if (res.status === 200) { fs.writeFileSync(out, res.body); process.stdout.write('OK\n'); done++; }
      else { process.stdout.write(`FAIL ${res.status}\n`); failed++; }
    } catch (e) {
      process.stdout.write(`ERR ${e.message}\n`); failed++;
    }
    await sleep(250);
  }
  console.log(`\n✓ Done: ${done} generated, ${skipped} skipped, ${failed} failed`);
})();
