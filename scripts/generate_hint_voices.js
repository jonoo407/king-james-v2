/**
 * King James 2 — Crown Hint Voice Generation
 * Generates MP3s for the crownLine hint on every choice scene.
 *
 * Output naming: audio/voices/crown/hint_{sceneId}.mp3
 * Run:    node scripts/generate_hint_voices.js
 * Resume: skips files that already exist — safe to re-run.
 *
 * 24 files total (8 forest + 8 mountain + 8 beach).
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0';
const MODEL = 'eleven_turbo_v2_5';
const OUT_DIR = path.join(__dirname, '..', 'audio', 'voices', 'crown');

// Crown voice: warm/snarky British male (George)
const VOICE = { id: 'JBFqnCBsd6RMkjVDRZzb', stability: 0.55, similarity: 0.80 };

// Strip emoji for cleaner TTS (ElevenLabs skips them but can cause odd pauses)
function stripEmoji(str) {
  return str.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').replace(/[\u2600-\u27BF]/g, '').trim();
}

// ── Scene hints (mirrors crownLine fields in data/quests/*.js) ────────────────
const HINTS = [
  // Forest
  { id: 'forest_1',              crownLine: 'Every way costs something. What do you spend?' },
  { id: 'forest_goblins',        crownLine: 'Fight for XP. Sneak for health. Bribe for embarrassment.' },
  { id: 'forest_goblins_sneak_risky', crownLine: 'Be a rock. Or be Usain Bolt. No middle.' },
  { id: 'forest_path',           crownLine: 'Frog noises that way. Coins clinking the other. Choose.' },
  { id: 'forest_glade_choice',   crownLine: 'Sprites want magic-stuff. Bats want wind-stuff. Two different problems.' },
  { id: 'forest_pond',           crownLine: 'Frog under log. Classic. Pick your rescue style.' },
  { id: 'forest_wolf_pre',       crownLine: 'Fire burns plants. Spark away. Or be clever and skip.' },
  { id: 'forest_troll_pre',      crownLine: "Do NOT just run in. Do NOT. I know you're thinking it." },

  // Mountain
  { id: 'mountain_village',      crownLine: 'Spend before you climb. Or be brave AND broke.' },
  { id: 'mountain_goat',         crownLine: "He says: MY mountain. Pay the toll. I'm quoting. He said that." },
  { id: 'mountain_bridge',       crownLine: 'Fast, careful, or frog. Pick.' },
  { id: 'mountain_side',         crownLine: 'Optional detour. Worth a sniff.' },
  { id: 'mountain_knight',       crownLine: 'Fight for sword. Riddles for helm. Bribe for shame.' },
  { id: 'mountain_pass_choice',  crownLine: 'Drake up high, ogre down low. Two totally different problems.' },
  { id: 'mountain_yeti',         crownLine: 'Easy to swing a sword. Harder to listen. Both are brave.' },
  { id: 'mountain_cave',         crownLine: "Prep now. Boss doesn't wait. Or he does, but he'll be crankier." },

  // Beach
  { id: 'beach_village',         crownLine: 'Last dry land before the shore. Prep now.' },
  { id: 'beach_cove_crabs',      crownLine: 'Fight: earth moves are rubbish vs water crabs. Magic or fire works. Wading costs HP.' },
  { id: 'beach_finn_pool',       crownLine: "You could free him. You could keep walking. Treasure isn't in a tide pool." },
  { id: 'beach_dunes',           crownLine: "Wind creatures. Earth moves won't do much. Magic and fire hit harder here." },
  { id: 'beach_ruins',           crownLine: 'History lesson. Optional. But some history matters.' },
  { id: 'beach_wreck',           crownLine: 'One way in, one way down. Needs a swimmer.' },
  { id: 'beach_serpent',         crownLine: 'Fight it. Listen. Feed it. Your call.' },
  { id: 'beach_cavern',          crownLine: "Something's lived in there a long time. Catch your breath before going in." },
];

console.log(`Crown hint voices: ${HINTS.length} total files`);
console.log(`Output dir: ${OUT_DIR}\n`);

fs.mkdirSync(OUT_DIR, { recursive: true });

// ── HTTP helper ───────────────────────────────────────────────────────────────
function tts(text) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: VOICE.stability, similarity_boost: VOICE.similarity }
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

// ── Sequential runner ─────────────────────────────────────────────────────────
let done = 0, skipped = 0, failed = 0;

async function run() {
  for (const hint of HINTS) {
    const filename = `hint_${hint.id}.mp3`;
    const outPath = path.join(OUT_DIR, filename);
    if (fs.existsSync(outPath)) {
      console.log(`  SKIP  ${filename}`);
      skipped++;
      continue;
    }
    const text = stripEmoji(hint.crownLine);
    process.stdout.write(`  GEN   ${filename}  "${text.slice(0, 55)}" ... `);
    try {
      const { status, body } = await tts(text);
      if (status === 200) {
        fs.writeFileSync(outPath, body);
        console.log(`OK (${body.length} bytes)`);
        done++;
      } else {
        console.log(`FAIL status=${status}  ${body.toString().slice(0, 120)}`);
        failed++;
      }
    } catch (e) {
      console.log(`ERROR ${e.message}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 600));
  }
  console.log(`\nDone: ${done}  Skipped: ${skipped}  Failed: ${failed}`);
  if (failed) process.exit(1);
}

run();
