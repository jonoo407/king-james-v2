// Zephyra audition — old weary witch, British/Continental, Judi-Dench-on-a-bad-day.
// Generates 3-5 candidate audio files in audio/auditions/zephyra/.
// Listen, pick one, write the voice_id into data/VOICE_STATUS.md and VOICES map.

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0';
const MODEL = 'eleven_turbo_v2_5';
const OUT_DIR = path.join(__dirname, '..', 'audio', 'auditions', 'zephyra');

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
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method: 'POST',
      headers: { ...headers, 'Content-Length': bodyBuf.length }
    }, (res) => {
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

async function searchVoices(query) {
  const params = new URLSearchParams({ search: query, page_size: 8 });
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

async function generateAudio(voiceId, text, stability = 0.55, similarity = 0.85) {
  const body = JSON.stringify({
    text, model_id: MODEL,
    voice_settings: { stability, similarity_boost: similarity }
  });
  return httpsPost(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    body,
    { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' }
  );
}

// Three lines that stress-test the range: wry intro, emotional reveal, wise close.
const LINES = [
  'A child. At my tent. With a crown. Oh, I am going to have OPINIONS.',
  'He was brilliant. That was the problem. Brilliant, and lonely, and impatient. He made a bad bet.',
  'Courage, boy. Not bravery. Bravery is loud. Courage is what happens on day two.',
];

const SEARCHES = [
  'british older woman wise witch storyteller',
  'mature british female narrator dry',
  'older european woman warm sardonic',
  'elderly british woman kind weary',
  'mature female narrator british wise',
];

// Filter out obviously wrong picks (very young, very American, non-Western)
const SKIP_WORDS = [
  'young','teen','girl','child',
  'indian','hindi','arabic','korean','japanese','chinese','thai','russian',
  'priya','sejal','anya','fatima','raj',
];

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const voices = [];
  const seen = new Set();

  for (const query of SEARCHES) {
    const found = await searchVoices(query);
    for (const v of found) {
      if (seen.has(v.voice_id)) continue;
      const nameLower = (v.name || '').toLowerCase();
      if (SKIP_WORDS.some(w => nameLower.includes(w))) continue;
      seen.add(v.voice_id);
      const info = await getVoiceInfo(v.voice_id);
      const accent = info.labels?.accent || '';
      const age = info.labels?.age || '';
      const gender = info.labels?.gender || '';
      // Must be female, must be middle-aged or older
      if (gender && gender !== 'female') continue;
      if (age && !/old|middle|mature|elderly/i.test(age)) continue;
      console.log(`  Candidate: ${v.name} (${v.voice_id}) — ${accent} / ${age} / ${gender}`);
      voices.push({ ...v, accent, age });
      if (voices.length >= 5) break;
    }
    if (voices.length >= 5) break;
  }

  console.log(`\nGenerating audio for ${voices.length} candidates (3 lines each)...\n`);

  const results = [];
  for (let i = 0; i < voices.length; i++) {
    const v = voices[i];
    const candidateDir = path.join(OUT_DIR, `option_${i + 1}`);
    fs.mkdirSync(candidateDir, { recursive: true });
    console.log(`Option ${i + 1}: ${v.name} (${v.voice_id}) — ${v.accent} / ${v.age}`);
    for (let j = 0; j < LINES.length; j++) {
      const res = await generateAudio(v.voice_id, LINES[j]);
      if (res.status === 200) {
        fs.writeFileSync(path.join(candidateDir, `line_${j + 1}.mp3`), res.body);
        process.stdout.write(`  line ${j + 1} OK\n`);
      } else {
        process.stdout.write(`  line ${j + 1} FAIL ${res.status}\n`);
      }
      await new Promise(r => setTimeout(r, 250));
    }
    results.push({ option: i + 1, name: v.name, voice_id: v.voice_id, accent: v.accent, age: v.age });
  }

  fs.writeFileSync(path.join(OUT_DIR, 'candidates.json'), JSON.stringify(results, null, 2));
  console.log('\nDONE. Listen to audio/auditions/zephyra/option_*/line_*.mp3 and pick.');
  console.log('Candidates written to audio/auditions/zephyra/candidates.json');
})();
