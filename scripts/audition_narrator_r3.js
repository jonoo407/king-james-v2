const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0';
const MODEL = 'eleven_turbo_v2_5';
const OUTPUT_DIR = path.join(__dirname, '..', 'audio', 'auditions', 'narrator_r3');

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
  const params = new URLSearchParams({ search: query, page_size: 8, ...extra });
  const result = await httpsGet(
    `https://api.elevenlabs.io/v1/shared-voices?${params}`,
    { 'xi-api-key': API_KEY }
  );
  return result.voices || [];
}

async function getVoiceInfo(voiceId) {
  return httpsGet(
    `https://api.elevenlabs.io/v1/voices/${voiceId}`,
    { 'xi-api-key': API_KEY }
  );
}

async function generateAudio(voiceId, text) {
  const body = JSON.stringify({
    text,
    model_id: MODEL,
    voice_settings: { stability: 0.55, similarity_boost: 0.8 }
  });
  return httpsPost(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    body,
    { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' }
  );
}

const LINE = "Once upon a time, in a kingdom not so far away, a young boy king set out on a very important quest. It would not go smoothly.";

// Prior failed IDs to skip
const EXCLUDE = new Set([
  'sWuGr24LIqDil2oFD3xs', // Carrie
  'prqcFePeALHihEWRj5ll', // Linda
  '5eTCXMQnNm7Zqq5TNx7h', // Sejal
  'R3XXDwKMU2YHwBcuYUH3', // Opa Johann
  'SAxJUlDKRc79XAyeWyMu', // Morgan (original)
]);

const SEARCHES = [
  // accent filters: american=us, british=gb
  'warm american female storyteller',
  'kind american woman narrator children',
  'gentle female narrator american',
  'soft warm female american storybook',
  'british woman warm storyteller kind',
  'friendly female narrator western',
];

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const voices = [];
  const seen = new Set(EXCLUDE);

  for (const query of SEARCHES) {
    const found = await searchVoices(query);
    for (const v of found) {
      if (!seen.has(v.voice_id) && voices.length < 5) {
        // Filter: skip obviously non-Western accents by name hint
        const nameLower = (v.name || '').toLowerCase();
        const skipWords = ['hindi','indian','arabic','korean','japanese','chinese','spanish','portuguese','thai','russian','tran','sejal','priya','anya','fatima'];
        if (skipWords.some(w => nameLower.includes(w))) continue;
        seen.add(v.voice_id);
        // Fetch full voice info to get accent/description
        const info = await getVoiceInfo(v.voice_id);
        const accent = info.labels?.accent || '';
        const desc = JSON.stringify(info.labels || {});
        console.log(`  Found: ${v.name} | accent: ${accent} | labels: ${desc}`);
        voices.push({ ...v, accent });
      }
    }
    if (voices.length >= 5) break;
  }

  console.log(`\nGenerating audio for ${voices.length} voices...\n`);

  const results = [];
  for (let i = 0; i < voices.length; i++) {
    const v = voices[i];
    console.log(`Option ${i+1}: ${v.name} (${v.voice_id}) — accent: ${v.accent}`);
    const res = await generateAudio(v.voice_id, LINE);
    if (res.status === 200) {
      fs.writeFileSync(path.join(OUTPUT_DIR, `option_${i+1}.mp3`), res.body);
      results.push({ option: i+1, name: v.name, voice_id: v.voice_id, accent: v.accent });
      console.log(`  OK`);
    } else {
      console.log(`  FAIL ${res.status}`);
    }
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'voices.json'), JSON.stringify(results, null, 2));
  console.log('\nDONE');
})();
