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

async function searchVoices(query, filters = {}) {
  const params = new URLSearchParams({ search: query, page_size: 10, ...filters });
  const result = await httpsGet(
    `https://api.elevenlabs.io/v1/shared-voices?${params}`,
    { 'xi-api-key': API_KEY }
  );
  return result.voices || [];
}

// Names that suggest non-Western / non-English accents
const SKIP_NAME_FRAGMENTS = [
  'roopa','priya','anjali','aisha','fatima','mei','yuki','sakura','seo','joon',
  'tran','nguyen','aravinda','fumi','kenji','raj','ravi','deepa','pooja',
  'sébas','seba','dmitri','igor','aleksei','nikolai','vasily',
  'keshavi','sejal','anusha','divya','kavya','shreya','tanvi',
  'mira','meira','aiko','hana','yuna','li ','chen','wang','zhang',
  'arabic','turkish','farsi','hindi','thai','malay','swahili'
];

function isWesternName(name) {
  const lower = name.toLowerCase();
  return !SKIP_NAME_FRAGMENTS.some(f => lower.includes(f));
}

async function findUnique(searches, filters, exclude, limit = 3) {
  const voices = [];
  const seen = new Set(exclude);
  for (const q of searches) {
    const found = await searchVoices(q, filters);
    for (const v of found) {
      if (!seen.has(v.voice_id) && voices.length < limit && isWesternName(v.name)) {
        seen.add(v.voice_id);
        voices.push(v);
        console.log(`    + ${v.name} (${v.voice_id})`);
      }
    }
    if (voices.length >= limit) break;
  }
  return voices;
}

async function gen(voiceId, text, stability, similarity) {
  const body = JSON.stringify({ text, model_id: MODEL, voice_settings: { stability, similarity_boost: similarity } });
  return httpsPost(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, body,
    { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' });
}

const RETRIES = [
  {
    id: 'papa_yeti',
    name: '🦍❄️ Papa Yeti',
    line: "Me no take sheep. Me no take Blade. BABY! MY BABY! You... not enemy? Then LISTEN. Me bless you. Go.",
    stability: 0.5, similarity: 0.82,
    filters: { gender: 'male' },
    exclude: new Set(['SMQ9Cz6R2KznIR4Fr825','zKafQapzbOjT3CDcZONC','rCYFsCX2waxtHCgVD0e8']),
    searches: [
      'deep slow gentle giant male',
      'large slow emotional deep male monster',
      'big deep slow sad male voice',
      'deep slow broken speech gentle male',
      'deep old giant slow male warm'
    ]
  },
  {
    id: 'joon',
    name: '👦 Joon',
    line: "I was so scared. I didn't think anyone was coming. ...thank you. Really. Thank you.",
    stability: 0.45, similarity: 0.75,
    filters: { gender: 'male', age: 'young' },
    exclude: new Set(['caMurMrvWp0v3NFJALhl','5jCmrHdxbpU36l1wb3Ke','KLCSI9PVpwo49B6dC7Bo']),
    searches: [
      'young boy scared timid child',
      'small nervous child boy english',
      'young boy soft timid american',
      'child boy quiet scared relieved',
      'young male kid scared american voice'
    ]
  },
  {
    id: 'drifter',
    name: '🧙‍♀️ Drifter',
    line: "I tended sailors for thirty years. Then a man came — old, tired eyes — told them I was cursing the sea. I wasn't. But they believed him. And I've been here — alone — ever since.",
    stability: 0.55, similarity: 0.82,
    filters: { gender: 'female' },
    exclude: new Set(['5WdslVl9OFNf1eZigGfk','PmgfHCGeS5b7sH90BOOJ','wvLjO30m1EKxxecVo059']),
    searches: [
      'tired sad older woman american hurt',
      'quiet broken middle aged woman emotional',
      'hurt quiet woman slow sad american',
      'weary exhausted woman older voice',
      'sad lonely older woman soft american english'
    ]
  }
];

(async () => {
  for (const char of RETRIES) {
    console.log(`\n=== ${char.name} ===`);
    const dir = path.join(OUTPUT_DIR, char.id);
    fs.mkdirSync(dir, { recursive: true });

    // clear old files
    for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));

    const voices = await findUnique(char.searches, char.filters, char.exclude, 3);
    const options = [];

    for (let i = 0; i < voices.length; i++) {
      const v = voices[i];
      console.log(`  Generating option ${i+1}: ${v.name}`);
      const res = await gen(v.voice_id, char.line, char.stability, char.similarity);
      if (res.status === 200) {
        fs.writeFileSync(path.join(dir, `option_${i+1}.mp3`), res.body);
        options.push({ option: i+1, name: v.name, voice_id: v.voice_id });
        console.log(`    OK`);
      } else {
        console.log(`    FAIL ${res.status}: ${res.body.toString().slice(0,120)}`);
      }
    }

    fs.writeFileSync(path.join(dir, 'voices.json'), JSON.stringify(options, null, 2));
  }
  console.log('\nDone!');
})();
