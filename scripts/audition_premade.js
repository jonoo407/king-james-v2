const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0';
const MODEL = 'eleven_turbo_v2_5';
const OUTPUT_DIR = path.join(__dirname, '..', 'audio', 'auditions');

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

async function gen(voiceId, text, stability, similarity) {
  const body = JSON.stringify({ text, model_id: MODEL, voice_settings: { stability, similarity_boost: similarity } });
  return httpsPost(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, body,
    { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' });
}

// All official premade voices — guaranteed clean audio
// nPczCjzI2devNBz1zQrb Brian  - Deep, Resonant, Comforting   | male  | middle_aged | american
// pqHfZKP75CvOlQylNhV4 Bill   - Wise, Mature, Balanced       | male  | old         | american
// pNInz6obpgDQGcFmaJgB Adam   - Dominant, Firm               | male  | middle_aged | american
// bIHbv24MWmeRgasZH58o Will   - Relaxed Optimist             | male  | young       | american
// TX3LPaxmHKxFdv7VOQHJ Liam   - Energetic, Social Media      | male  | young       | american
// SOYHLrjzK2X1ezoPC6cr Harry  - Fierce Warrior               | male  | young       | american
// pFZP5JQG7iQjIQuC4Bku Lily   - Velvety Actress              | female| middle_aged | british
// XrExE9yKIg1WjnnlVkGX Matilda- Knowledgable, Professional   | female| middle_aged | american
// Xb7hH8MSUJpSbSDYk0k2 Alice  - Clear, Engaging Educator     | female| middle_aged | british
// EXAVITQu4vr4xnSDxMaL Sarah  - Mature, Reassuring           | female| young       | american

const CHARS = [
  {
    id: 'papa_yeti',
    name: '🦍❄️ Papa Yeti',
    line: "Me no take sheep. Me no take Blade. BABY! MY BABY! You... not enemy? Then LISTEN. Me bless you. Go.",
    stability: 0.45, similarity: 0.8,
    voices: [
      { name: 'Brian - Deep, Resonant & Comforting', id: 'nPczCjzI2devNBz1zQrb' },
      { name: 'Bill - Wise, Mature, Balanced',       id: 'pqHfZKP75CvOlQylNhV4' },
      { name: 'Adam - Dominant, Firm',               id: 'pNInz6obpgDQGcFmaJgB' },
    ]
  },
  {
    id: 'joon',
    name: '👦 Joon',
    line: "I was so scared. I didn't think anyone was coming. ...thank you. Really. Thank you.",
    stability: 0.35, similarity: 0.7,
    voices: [
      { name: 'Will - Relaxed Optimist',    id: 'bIHbv24MWmeRgasZH58o' },
      { name: 'Liam - Energetic, Casual',   id: 'TX3LPaxmHKxFdv7VOQHJ' },
      { name: 'Harry - Fierce Warrior',     id: 'SOYHLrjzK2X1ezoPC6cr' },
    ]
  },
  {
    id: 'glimmer',
    name: '👻 Glimmer',
    line: "I stewed on that for a hundred years. So I took the Blade. Wanted to be remembered, even as a bad guy. ...I was lonely. For like, a hundred years.",
    stability: 0.4, similarity: 0.75,
    voices: [
      { name: 'Lily - Velvety Actress',           id: 'pFZP5JQG7iQjIQuC4Bku' },
      { name: 'Matilda - Knowledgable, Measured', id: 'XrExE9yKIg1WjnnlVkGX' },
      { name: 'Alice - Clear, Engaging',          id: 'Xb7hH8MSUJpSbSDYk0k2' },
    ]
  },
  {
    id: 'drifter',
    name: '🧙‍♀️ Drifter',
    line: "I tended sailors for thirty years. Then a man came — old, tired eyes — told them I was cursing the sea. I wasn't. But they believed him. And I've been here — alone — ever since.",
    stability: 0.55, similarity: 0.82,
    voices: [
      { name: 'Sarah - Mature, Reassuring',       id: 'EXAVITQu4vr4xnSDxMaL' },
      { name: 'Matilda - Knowledgable, Measured', id: 'XrExE9yKIg1WjnnlVkGX' },
      { name: 'Lily - Velvety Actress',           id: 'pFZP5JQG7iQjIQuC4Bku' },
    ]
  }
];

(async () => {
  for (const char of CHARS) {
    console.log(`\n=== ${char.name} ===`);
    const dir = path.join(OUTPUT_DIR, char.id);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));

    const options = [];
    for (let i = 0; i < char.voices.length; i++) {
      const v = char.voices[i];
      console.log(`  Option ${i+1}: ${v.name}`);
      const res = await gen(v.id, char.line, char.stability, char.similarity);
      if (res.status === 200) {
        fs.writeFileSync(path.join(dir, `option_${i+1}.mp3`), res.body);
        options.push({ option: i+1, name: v.name, voice_id: v.id });
        console.log(`    OK`);
      } else {
        console.log(`    FAIL ${res.status}: ${res.body.toString().slice(0,120)}`);
      }
    }
    fs.writeFileSync(path.join(dir, 'voices.json'), JSON.stringify(options, null, 2));
  }
  console.log('\nDone!');
})();
