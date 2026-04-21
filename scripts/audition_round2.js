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
  const params = new URLSearchParams({ search: query, page_size: 6, ...extra });
  const result = await httpsGet(
    `https://api.elevenlabs.io/v1/shared-voices?${params}`,
    { 'xi-api-key': API_KEY }
  );
  return (result.voices || []);
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

async function findUniqueVoices(searches, exclude = new Set(), limit = 4) {
  const voices = [];
  const seen = new Set(exclude);
  for (const query of searches) {
    const found = await searchVoices(query);
    for (const v of found) {
      if (!seen.has(v.voice_id) && voices.length < limit) {
        seen.add(v.voice_id);
        voices.push(v);
      }
    }
    if (voices.length >= limit) break;
  }
  return voices;
}

const ROUNDS = [
  {
    id: 'narrator_r2',
    name: 'Narrator (kind woman)',
    line: "Once upon a time, in a kingdom not so far away, a young boy king set out on a very important quest. It would not go smoothly.",
    stability: 0.55,
    similarity: 0.8,
    searches: [
      'warm kind grandmother storyteller female',
      'gentle nurturing female narrator',
      'soft warm maternal storytelling',
      'kind elderly woman narrator storybook'
    ]
  },
  {
    id: 'james_r2',
    name: 'James (more options)',
    line: "Easy! Step one: stab things. Step two: WIN! I am a GENIUS.",
    stability: 0.35,
    similarity: 0.7,
    // exclude prior picks
    excludeIds: new Set(['yJSTU8D97YocC6Dqg20L','mBqbvkxIFe5HjjaoiN4P','5J8HNhWkTAhN2YWsd9Ta']),
    searches: [
      'energetic young boy excited kid',
      'hyperactive child male voice',
      'cheeky young british boy',
      'silly enthusiastic boy child voice',
      'young prince cocky playful'
    ]
  },
  {
    id: 'mornox_r2',
    name: 'Mornox (evil villain)',
    line: "Keep going, little king. Every Treasure you pick up saves me walking to it. How... convenient.",
    stability: 0.7,
    similarity: 0.88,
    excludeIds: new Set(['KgUSWQPFmuiZ5ycRbnty','yftckXjSEXI25jG6Ead9','xsiB5fGhEtknnqzudCO6']),
    searches: [
      'ancient evil wizard sorcerer villain',
      'dark menacing villain deep sinister',
      'evil warlock cold calculating',
      'sinister old wizard deep threatening',
      'dark sorcerer slow deliberate evil'
    ]
  }
];

(async () => {
  for (const round of ROUNDS) {
    console.log(`\n=== ${round.name} ===`);
    const dir = path.join(OUTPUT_DIR, round.id);
    fs.mkdirSync(dir, { recursive: true });

    const voices = await findUniqueVoices(round.searches, round.excludeIds || new Set(), 4);

    for (let i = 0; i < voices.length; i++) {
      const v = voices[i];
      console.log(`  Generating option ${i+1}: ${v.name} (${v.voice_id})`);
      const res = await generateAudio(v.voice_id, round.line, round.stability, round.similarity);
      if (res.status === 200) {
        fs.writeFileSync(path.join(dir, `option_${i+1}.mp3`), res.body);
        console.log(`    OK`);
      } else {
        console.log(`    FAIL ${res.status}: ${res.body.toString().slice(0,150)}`);
      }
    }

    // save voice metadata
    fs.writeFileSync(path.join(dir, 'voices.json'), JSON.stringify(voices.map((v,i) => ({
      option: i+1, name: v.name, voice_id: v.voice_id
    })), null, 2));
  }

  console.log('\nDONE');
})();
