// King James 2 — Visual Effects
// Confetti, big text pops, screen shake, floating emoji, damage numbers.

window.KJ = window.KJ || {};

KJ.Effects = (function () {

  function confetti(count) {
    const colors = ['#f1c40f','#e74c3c','#2ecc71','#3498db','#e67e22','#9b59b6','#ff69b4'];
    const n = count || 35;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '-20px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDelay = Math.random() * 0.5 + 's';
      el.style.animationDuration = (2 + Math.random() * 2) + 's';
      el.style.width = (8 + Math.random() * 10) + 'px';
      el.style.height = (8 + Math.random() * 10) + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }

  function bigText(text, opts) {
    const el = document.createElement('div');
    el.className = 'big-text-popup';
    el.textContent = text;
    if (opts && opts.color) el.style.color = opts.color;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  function shakeScreen(durationMs) {
    const root = document.getElementById('app') || document.body;
    root.classList.remove('kj-shake');
    void root.offsetWidth; // force reflow
    root.classList.add('kj-shake');
    setTimeout(() => root.classList.remove('kj-shake'), durationMs || 500);
  }

  function floatingEmoji(parent, emoji, count, delayStep) {
    if (!parent) return;
    const c = count || 3;
    for (let i = 0; i < c; i++) {
      const el = document.createElement('div');
      el.className = 'floating-emoji';
      el.textContent = emoji;
      el.style.left = (20 + Math.random() * 60) + '%';
      el.style.bottom = '0';
      el.style.animationDelay = (i * (delayStep || 0.4)) + 's';
      el.style.animationDuration = (2 + Math.random()) + 's';
      parent.appendChild(el);
    }
  }

  function damageNumber(targetEl, amount, opts) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'damage-number' + ((opts && opts.crit) ? ' crit' : '') + ((opts && opts.super) ? ' super' : '');
    el.textContent = (amount < 0 ? '+' + (-amount) : String(amount));
    el.style.left = (rect.left + rect.width / 2) + 'px';
    el.style.top  = rect.top + 'px';
    if (opts && opts.color) el.style.color = opts.color;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }

  // Toast (short informational popup bottom-of-screen)
  function toast(text, opts) {
    const el = document.createElement('div');
    el.className = 'kj-toast';
    el.textContent = text;
    if (opts && opts.icon) el.textContent = opts.icon + ' ' + text;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('kj-toast--out'), 1800);
    setTimeout(() => el.remove(), 2400);
  }

  return { confetti, bigText, shakeScreen, floatingEmoji, damageNumber, toast };
})();
