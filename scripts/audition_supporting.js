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

async function searchVoices(query) {
  const params = new URLSearchParams({ search: query, page_size: 6 });
  const result = await httpsGet(
    `https://api.elevenlabs.io/v1/shared-voices?${params}`,
    { 'xi-api-key': API_KEY }
  );
  return result.voices || [];
}

async function findUnique(searches, exclude, limit = 3) {
  const voices = [];
  const seen = new Set(exclude);
  for (const q of searches) {
    for (const v of await searchVoices(q)) {
      if (!seen.has(v.voice_id) && voices.length < limit) {
        seen.add(v.voice_id);
        voices.push(v);
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

const CAST = [
  {
    id: 'foxy', name: '🦊 Foxy',
    line: "I was chasing a beetle. A SHINY beetle. Big mistake. Help me, or don't. I won't be rude about it.",
    stability: 0.4, similarity: 0.75,
    searches: ['sharp witty female fox sly raspy', 'quick clever raspy female', 'snarky sharp female voice']
  },
  {
    id: 'ribbit', name: '🐸 Ribbit',
    line: "Rrrribbit... thanks, kid. You lift good. Wait — was that physics? Do I gotta learn physics now?",
    stability: 0.45, similarity: 0.75,
    searches: ['deep silly funny male frog', 'gruff comic deep male', 'low deep goofy male voice']
  },
  {
    id: 'owlette', name: '🦉 Owlette',
    line: "Obviously — you use the ANGLE. Not the muscle. HOO boy, not the muscle. Why don't mountain goats play poker? Too many cheetahs at the peak.",
    stability: 0.5, similarity: 0.8,
    searches: ['gentle wise female owl deadpan', 'warm wise calm female', 'soft wise neutral female narrator']
  },
  {
    id: 'gus', name: '🐐 Gus',
    line: "...fine. I'll come. But I LEAD. Respect earned. Your head is MADE of rock. Admirable.",
    stability: 0.55, similarity: 0.8,
    searches: ['gruff stubborn old male goat', 'rough grumpy older male voice', 'stubborn gruff male deep']
  },
  {
    id: 'papa_yeti', name: '🦍❄️ Papa Yeti',
    line: "Me no take sheep. Me no take Blade. BABY! MY BABY! You... not enemy? Then LISTEN. Me bless you. Go.",
    stability: 0.5, similarity: 0.8,
    searches: ['deep slow emotional gentle giant male', 'large deep slow broken speech male', 'deep monster gentle emotional']
  },
  {
    id: 'glimmer', name: '👻 Glimmer (Wraith)',
    line: "I stewed on that for a hundred years. So I took the Blade. Wanted to be remembered, even as a bad guy. ...I was lonely. For like, a hundred years.",
    stability: 0.45, similarity: 0.75,
    searches: ['soft echoey melancholic female ghost', 'whispery sad ethereal female', 'haunting gentle melancholic female']
  },
  {
    id: 'frostbeard', name: '🧔‍♂️ Sir Frostbeard',
    line: "...thoughtful. Rare, in kids. Take this. I have kids. Don't tell anyone.",
    stability: 0.55, similarity: 0.8,
    searches: ['rough working class british male knight', 'gruff soldier male rough', 'tough working male british gruff']
  },
  {
    id: 'pompadour', name: '💅 Dame Pompadour',
    line: "DARLING! You have ARRIVED! This is absolutely MAGNIFICENT! I have been waiting an ETERNITY! Now — shall we get down to business?",
    stability: 0.3, similarity: 0.7,
    searches: ['dramatic flamboyant over the top female', 'theatrical diva female extravagant', 'loud dramatic female comedy villain']
  },
  {
    id: 'sirena', name: '🧜‍♀️ Queen Sirena',
    line: "You dare enter my waters? Then you will answer to me. ...I am so tired. I have been guarding this shore alone for so long.",
    stability: 0.6, similarity: 0.85,
    searches: ['regal cold formal female queen', 'cold aristocratic female commanding', 'icy regal female villain emotional']
  },
  {
    id: 'finn', name: '🦦 Finn',
    line: "Three tides I've been trapped there. Three. ...you came back. Most don't come back. She's in the far chamber. She's crying. I don't think she knows we can hear.",
    stability: 0.4, similarity: 0.75,
    searches: ['upbeat chattery young male otter', 'cheerful energetic young male', 'friendly bright young male voice']
  },
  {
    id: 'joon', name: '👦 Joon',
    line: "I was so scared. I didn't think anyone was coming. ...thank you. Really. Thank you.",
    stability: 0.45, similarity: 0.75,
    searches: ['small scared child boy young timid', 'nervous timid young boy voice', 'quiet relieved small child male']
  },
  {
    id: 'drifter', name: '🧙‍♀️ Drifter',
    line: "I tended sailors for thirty years. Then a man came — old, tired eyes — told them I was cursing the sea. I wasn't. But they believed him. And I've been here — alone — ever since.",
    stability: 0.55, similarity: 0.82,
    searches: ['quiet hesitant hurt older female', 'soft wounded bitter female voice', 'quiet broken hurt female witch']
  }
];

(async () => {
  const allResults = [];

  for (const char of CAST) {
    console.log(`\n=== ${char.name} ===`);
    const dir = path.join(OUTPUT_DIR, char.id);
    fs.mkdirSync(dir, { recursive: true });

    const voices = await findUnique(char.searches, new Set(), 3);
    const options = [];

    for (let i = 0; i < voices.length; i++) {
      const v = voices[i];
      console.log(`  Option ${i+1}: ${v.name} (${v.voice_id})`);
      const res = await gen(v.voice_id, char.line, char.stability, char.similarity);
      if (res.status === 200) {
        fs.writeFileSync(path.join(dir, `option_${i+1}.mp3`), res.body);
        options.push({ option: i+1, name: v.name, voice_id: v.voice_id });
        console.log(`    OK`);
      } else {
        console.log(`    FAIL ${res.status}: ${res.body.toString().slice(0,100)}`);
      }
    }

    fs.writeFileSync(path.join(dir, 'voices.json'), JSON.stringify(options, null, 2));
    allResults.push({ ...char, options });
  }

  console.log('\nAll done!');
})();
