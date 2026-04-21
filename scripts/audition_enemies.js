const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0';
const MODEL = 'eleven_turbo_v2_5';
const OUTPUT_DIR = path.join(__dirname, '..', 'audio', 'auditions');

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
      res.on('error', reject);
    });
  });
}

function httpsPost(urlStr, body, headers) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const bodyBuf = Buffer.from(body);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: { ...headers, 'Content-Length': bodyBuf.length }
    };
    const req = https.request(opts, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.write(bodyBuf);
    req.end();
  });
}

async function searchVoices(query, extra = {}) {
  const params = new URLSearchParams({ search: query, page_size: 4, ...extra });
  const result = await httpsGet(
    `https://api.elevenlabs.io/v1/shared-voices?${params}`,
    { 'xi-api-key': API_KEY }
  );
  return (result.voices || []).slice(0, 3);
}

async function generateAudio(voiceId, text, stability = 0.5, similarity = 0.8) {
  const body = JSON.stringify({
    text,
    model_id: MODEL,
    voice_settings: { stability, similarity_boost: similarity }
  });
  return httpsPost(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    body,
    { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' }
  );
}

const ENEMIES = [
  {
    id: 'troll',
    name: 'Hoarder Troll',
    line: "Mine! Mine! Mine! Leave me ALONE!",
    stability: 0.4,
    similarity: 0.75,
    searches: ['grumpy old man raspy', 'old troll deep grumble']
  },
  {
    id: 'wolf',
    name: 'Briar Wolf',
    line: "I eat kings for breakfast. Stay. Down.",
    stability: 0.6,
    similarity: 0.85,
    searches: ['fierce menacing growl', 'deep aggressive male']
  },
  {
    id: 'goblin',
    name: 'Goblin Scout',
    line: "Get off our road! Retreat! RETREAT!",
    stability: 0.35,
    similarity: 0.7,
    searches: ['squeaky high pitched male', 'cartoon villain screechy']
  },
  {
    id: 'serpent',
    name: 'Sea Serpent',
    line: "Go. Away. Hungry...",
    stability: 0.75,
    similarity: 0.9,
    searches: ['deep ancient slow monster', 'deep dark sinister male']
  },
  {
    id: 'crab',
    name: 'Tide Crab',
    line: "MY tide pool! BACK! BACK! Snip snip!",
    stability: 0.3,
    similarity: 0.7,
    searches: ['raspy scratchy aggressive', 'irritable frantic male']
  },
  {
    id: 'sprite',
    name: 'Forest Sprite',
    line: "Pesky human! Tee hee! Sparkle!",
    stability: 0.35,
    similarity: 0.7,
    searches: ['tiny playful fairy female', 'high pitched whimsical female']
  }
];

(async () => {
  const results = [];

  for (const enemy of ENEMIES) {
    console.log(`\n=== ${enemy.name} ===`);
    const dir = path.join(OUTPUT_DIR, enemy.id);
    fs.mkdirSync(dir, { recursive: true });

    const voices = [];
    const seen = new Set();

    for (const query of enemy.searches) {
      const found = await searchVoices(query);
      for (const v of found) {
        if (!seen.has(v.voice_id) && voices.length < 3) {
          seen.add(v.voice_id);
          voices.push(v);
        }
      }
      if (voices.length >= 3) break;
    }

    const options = [];
    for (let i = 0; i < voices.length; i++) {
      const v = voices[i];
      console.log(`  Generating option ${i+1}: ${v.name} (${v.voice_id})`);
      const res = await generateAudio(v.voice_id, enemy.line, enemy.stability, enemy.similarity);
      if (res.status === 200) {
        const filename = `option_${i+1}.mp3`;
        fs.writeFileSync(path.join(dir, filename), res.body);
        options.push({ name: v.name, voice_id: v.voice_id, file: `audio/auditions/${enemy.id}/${filename}` });
        console.log(`    OK — saved ${filename}`);
      } else {
        console.log(`    FAIL status ${res.status}: ${res.body.toString().slice(0,200)}`);
      }
    }

    results.push({ ...enemy, options });
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'results.json'), JSON.stringify(results, null, 2));
  console.log('\n\nDONE. Results saved to audio/auditions/results.json');
})();
