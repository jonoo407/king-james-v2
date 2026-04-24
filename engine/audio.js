// King James 2 — Audio Engine
// Synthesized UI sounds (Web Audio) + MP3 voice clips.
// Voice clips: audio/voices/{speaker}/{sceneId}_{beatIndex}.mp3
// Manifest:    audio/manifest.json  — keys are clip paths, used to skip missing clips.

window.KJ = window.KJ || {};

KJ.Audio = (function () {

  // ── Web Audio (synthesized SFX) ──────────────────────────────────────────────
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let unlocked = false;
  const sounds = new Map();

  function _ensure() {
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
  }

  function unlock() {
    if (unlocked) return;
    _ensure();
    const b = ctx.createBuffer(1, 1, 22050);
    const s = ctx.createBufferSource();
    s.buffer = b; s.connect(ctx.destination); s.start(0);
    unlocked = true;
  }
  document.addEventListener('touchstart', unlock, { once: true });
  document.addEventListener('click',      unlock, { once: true });

  function _tone(freq, dur, wave, vol) {
    _ensure();
    const now = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = wave || 'sine';
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(vol || 0.25, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + dur);
    o.start(now); o.stop(now + dur);
  }
  function _slide(from, to, dur, wave, vol) {
    _ensure();
    const now = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = wave || 'sine';
    o.frequency.setValueAtTime(from, now);
    o.frequency.exponentialRampToValueAtTime(to, now + dur);
    g.gain.setValueAtTime(vol || 0.25, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + dur);
    o.start(now); o.stop(now + dur);
  }
  function _notes(freqs, gap, dur, wave, vol) {
    _ensure();
    const now = ctx.currentTime;
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = wave || 'triangle';
      o.frequency.setValueAtTime(f, now + i * gap);
      g.gain.setValueAtTime(vol || 0.25, now + i * gap);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * gap + dur);
      o.start(now + i * gap); o.stop(now + i * gap + dur);
    });
  }

  const _p = { tone: _tone, slide: _slide, notes: _notes };

  function register(id, fn) { sounds.set(id, fn); }

  // Starter SFX library
  register('click',   () => _tone(500, 0.1, 'sine', 0.2));
  register('boing',   () => _slide(300, 700, 0.15, 'sine', 0.25));
  register('bonk',    () => _slide(800, 100, 0.15, 'square', 0.25));
  register('splash',  () => _slide(600, 100, 0.3, 'sawtooth', 0.2));
  register('burp',    () => _slide(150, 60, 0.45, 'sawtooth', 0.2));
  register('magic',   () => { _slide(400, 1200, 0.3, 'sine', 0.2); setTimeout(() => _slide(1200, 600, 0.3, 'sine', 0.15), 300); });
  register('roar',    () => _slide(200, 80, 0.5, 'sawtooth', 0.3));
  register('chomp',   () => { _tone(200, 0.08, 'square', 0.2); setTimeout(() => _tone(150, 0.08, 'square', 0.15), 100); });
  register('star',    () => _notes([660, 880, 1100], 0.12, 0.25));
  register('fanfare', () => _notes([523, 659, 784, 1047], 0.18, 0.35, 'triangle', 0.3));
  register('party',   () => _notes([440, 554, 659, 880, 1047], 0.12, 0.3));
  register('sad',     () => _slide(400, 200, 0.4, 'triangle', 0.2));
  register('fart',    () => _slide(120, 50, 0.5, 'sawtooth', 0.15));
  register('kind',    () => _notes([523, 784, 1047], 0.1, 0.25, 'sine', 0.22));
  register('quack',   () => { _tone(220, 0.12, 'sawtooth', 0.3); setTimeout(() => _tone(180, 0.12, 'sawtooth', 0.25), 130); });
  register('crit',    () => _notes([880, 1100, 1320], 0.05, 0.1, 'sawtooth', 0.3));
  register('levelup', () => _notes([523, 659, 784, 1047, 1319], 0.09, 0.25, 'triangle', 0.3));
  register('super',   () => _notes([1047, 1319, 1568], 0.06, 0.12, 'sawtooth', 0.28));
  register('weak',    () => _tone(200, 0.12, 'triangle', 0.18));
  register('equip',   () => _notes([440, 660], 0.06, 0.08, 'sine', 0.22));
  register('gold',    () => _notes([880, 1100, 1320, 1100], 0.04, 0.08, 'sine', 0.2));

  // ── Voice / MP3 ──────────────────────────────────────────────────────────────
  let _voiceOn   = true;
  let _muted     = false;
  let _volume    = 0.9;
  let _current   = null;  // active HTMLAudioElement
  let _manifest  = null;  // Set of known clip paths (null = not loaded yet)
  let _ready     = false;
  const _prefetched = new Set();

  function _loadManifest() {
    fetch('audio/manifest.json')
      .then(r => r.json())
      .then(data => {
        _manifest = new Set(Object.keys(data));
        _ready = true;
      })
      .catch(() => {
        _manifest = new Set();
        _ready = true;
      });
  }

  function _hasClip(path) {
    if (!_manifest) return true; // manifest not loaded yet — optimistically try
    // Manifest keys are `speaker/clip` (no `audio/voices/` prefix, no `.mp3`).
    // Normalize the lookup path to match.
    const key = path.replace(/^audio\/voices\//, '').replace(/\.mp3$/, '');
    return _manifest.has(key);
  }

  function _prefetchClip(path) {
    if (!_hasClip(path)) return;
    if (_prefetched.has(path)) return;
    _prefetched.add(path);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'audio';
    link.href = path;
    document.head.appendChild(link);
  }

  // voice(speaker, sceneId, beatIndex) — called by dialogue.js
  function voice(speaker, sceneId, beatIndex) {
    if (!_voiceOn || _muted) return;
    const path = `audio/voices/${speaker}/${sceneId}_${beatIndex}.mp3`;
    if (!_hasClip(path)) return;
    if (_current) { _current.pause(); _current = null; }
    try {
      const a = new Audio(path);
      a.volume = _volume;
      _current = a;
      a.play().catch(() => {});
    } catch (e) {}
    _prefetchClip(`audio/voices/${speaker}/${sceneId}_${beatIndex + 1}.mp3`);
  }

  // voicePath(relPath) — direct path (crown pool lines etc.)
  function voicePath(relPath) {
    if (!_voiceOn || _muted) return;
    if (_current) { _current.pause(); _current = null; }
    try {
      const a = new Audio(relPath);
      a.volume = _volume;
      _current = a;
      a.play().catch(() => {});
    } catch (e) {}
  }

  // play(id)                     — synthesized SFX
  // play(speaker, source, idx)   — voice clip (same as voice())
  function play(idOrSpeaker, source, lineIndex) {
    if (source !== undefined) {
      voice(idOrSpeaker, source, lineIndex);
      return;
    }
    if (_muted) return;
    const settings = (KJ.State && KJ.State.get) ? KJ.State.get().settings : null;
    if (settings && settings.soundOn === false) return;
    const fn = sounds.get(idOrSpeaker);
    if (fn) fn(_p);
  }

  function stop() {
    if (_current) { _current.pause(); _current.currentTime = 0; _current = null; }
  }

  function toggleVoice() {
    _voiceOn = !_voiceOn;
    if (!_voiceOn) stop();
    return _voiceOn;
  }

  function toggleMute() {
    _muted = !_muted;
    if (_muted) stop();
    return !_muted; // true = audio on
  }

  function setVolume(v) {
    _volume = Math.max(0, Math.min(1, v));
    if (_current) _current.volume = _volume;
  }

  function isMuted()   { return _muted; }
  function isVoiceOn() { return _voiceOn; }
  function isReady()   { return _ready; }

  _loadManifest();

  return {
    register, play, unlock,
    voice, voicePath,
    stop, toggleVoice, toggleMute, setVolume,
    isMuted, isVoiceOn, isReady,
  };
})();
