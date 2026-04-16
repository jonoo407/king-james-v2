// King James 2 — Audio (Web Audio, procedural)
// Zero audio files. All sounds synthesized on the fly.
// Starter library provided; new sounds register via KJ.Audio.register(id, fn).

window.KJ = window.KJ || {};

KJ.Audio = (function () {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let unlocked = false;
  const sounds = new Map();

  function ensure() {
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
  }

  function unlock() {
    if (unlocked) return;
    ensure();
    const b = ctx.createBuffer(1, 1, 22050);
    const s = ctx.createBufferSource();
    s.buffer = b; s.connect(ctx.destination); s.start(0);
    unlocked = true;
  }
  // Unlock on first user interaction (mobile browsers require this).
  document.addEventListener('touchstart', unlock, { once: true });
  document.addEventListener('click',      unlock, { once: true });

  // Primitive builders passed to registered sound functions
  function tone(freq, dur, wave, vol) {
    ensure();
    const now = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = wave || 'sine';
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(vol || 0.25, now);
    g.gain.exponentialRampToValueAtTime(0.01, now + dur);
    o.start(now); o.stop(now + dur);
  }
  function slide(from, to, dur, wave, vol) {
    ensure();
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
  function notes(freqs, gap, dur, wave, vol) {
    ensure();
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

  function register(id, fn) { sounds.set(id, fn); }

  function play(id) {
    const settings = (KJ.State && KJ.State.get()) ? KJ.State.get().settings : { soundOn: true };
    if (!settings.soundOn) return;
    const fn = sounds.get(id);
    if (fn) fn({ tone, slide, notes });
    else console.warn('[Audio] unknown sound:', id);
  }

  // Starter library — can be overridden by theme data later.
  register('click',    ({tone})  => tone(500, 0.1, 'sine', 0.2));
  register('boing',    ({slide}) => slide(300, 700, 0.15, 'sine', 0.25));
  register('bonk',     ({slide}) => slide(800, 100, 0.15, 'square', 0.25));
  register('splash',   ({slide}) => slide(600, 100, 0.3, 'sawtooth', 0.2));
  register('burp',     ({slide}) => slide(150, 60, 0.45, 'sawtooth', 0.2));
  register('magic',    ({slide}) => { slide(400, 1200, 0.3, 'sine', 0.2); setTimeout(() => slide(1200, 600, 0.3, 'sine', 0.15), 300); });
  register('roar',     ({slide}) => slide(200, 80, 0.5, 'sawtooth', 0.3));
  register('chomp',    ({tone})  => { tone(200, 0.08, 'square', 0.2); setTimeout(() => tone(150, 0.08, 'square', 0.15), 100); });
  register('star',     ({notes}) => notes([660, 880, 1100], 0.12, 0.25));
  register('fanfare',  ({notes}) => notes([523, 659, 784, 1047], 0.18, 0.35, 'triangle', 0.3));
  register('party',    ({notes}) => notes([440, 554, 659, 880, 1047], 0.12, 0.3));
  register('sad',      ({slide}) => slide(400, 200, 0.4, 'triangle', 0.2));
  register('fart',     ({slide}) => slide(120, 50, 0.5, 'sawtooth', 0.15));
  register('kind',     ({notes}) => notes([523, 784, 1047], 0.1, 0.25, 'sine', 0.22));
  register('quack',    ({tone})  => { tone(220, 0.12, 'sawtooth', 0.3); setTimeout(()=>tone(180, 0.12, 'sawtooth', 0.25), 130); });
  register('crit',     ({notes}) => notes([880, 1100, 1320], 0.05, 0.1, 'sawtooth', 0.3));
  register('levelup',  ({notes}) => notes([523, 659, 784, 1047, 1319], 0.09, 0.25, 'triangle', 0.3));
  register('super',    ({notes}) => notes([1047, 1319, 1568], 0.06, 0.12, 'sawtooth', 0.28));
  register('weak',     ({tone})  => tone(200, 0.12, 'triangle', 0.18));
  register('equip',    ({notes}) => notes([440, 660], 0.06, 0.08, 'sine', 0.22));
  register('gold',     ({notes}) => notes([880, 1100, 1320, 1100], 0.04, 0.08, 'sine', 0.2));

  return { register, play, unlock };
})();
