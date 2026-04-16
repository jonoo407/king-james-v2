// King James 2 — Level-Up Screen
// Shows after James gains a level. Kid spends stat points and picks Royal Traits.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.LevelUp = (function () {

  // Show if there's anything pending; otherwise just call onDone.
  function showIfPending(onDone) {
    const state = KJ.State.get();
    if (state.player.pendingStatPoints > 0) return showStats(onDone);
    if (state.player.pendingTraitPicks > 0) return showTrait(onDone);
    if (onDone) onDone();
  }

  // -------- PHASE 1: Stat allocation --------
  function showStats(onDone) {
    const state = KJ.State.get();
    const app = document.getElementById('app');

    function draw() {
      const s = KJ.State.get();
      const base = s.player.baseStats;
      const pts = s.player.pendingStatPoints;
      app.innerHTML = `
        ${KJ.UI.HUD.html()}
        <div class="kj-scene-wrap kj-levelup-bg">
          <div class="kj-levelup-sparkle">✨ LEVEL ${s.player.level} ✨</div>
          <div class="kj-h2">Spend your points!</div>
          <div class="kj-muted" style="text-align:center;">Points left: <strong id="kj-pts">${pts}</strong></div>
          <div class="kj-stat-grid">
            ${statRow('hp',  '❤️ HP',  base.hp)}
            ${statRow('atk', '⚔️ ATK', base.atk)}
            ${statRow('def', '🛡️ DEF', base.def)}
            ${statRow('spd', '💨 SPD', base.spd)}
          </div>
          <div class="kj-footer-nav">
            <button class="kj-big-btn" id="kj-levelup-next" ${pts > 0 ? 'disabled' : ''}>Next ▶️</button>
          </div>
        </div>
      `;
      KJ.UI.HUD.attach();
      document.querySelectorAll('.kj-statpt-btn').forEach(b => {
        b.onclick = () => {
          const state = KJ.State.get();
          if (state.player.pendingStatPoints <= 0) return;
          const stat = b.dataset.stat;
          state.player.baseStats[stat]++;
          state.player.pendingStatPoints--;
          // Keep current hp in sync if HP was increased
          if (stat === 'hp') state.player.hp++;
          KJ.Audio.play('star');
          draw();
        };
      });
      document.getElementById('kj-levelup-next').onclick = () => {
        KJ.Audio.play('click');
        // Continue to trait pick if any, else done
        if (KJ.State.get().player.pendingTraitPicks > 0) {
          showTrait(onDone);
        } else {
          if (onDone) onDone();
        }
      };
    }

    function statRow(key, label, val) {
      return `
        <div class="kj-stat-row">
          <div class="kj-stat-label">${label}</div>
          <div class="kj-stat-value">${val}</div>
          <button class="kj-statpt-btn kj-btn-secondary" data-stat="${key}">+1</button>
        </div>
      `;
    }

    draw();
  }

  // -------- PHASE 2: Trait picker --------
  function showTrait(onDone) {
    const state = KJ.State.get();
    const app = document.getElementById('app');
    // Pick 3 random traits the kid doesn't already have
    const owned = new Set(state.player.traits);
    const pool = KJ.Registry.traits.all().filter(t => !owned.has(t.id));
    if (!pool.length) {
      state.player.pendingTraitPicks = 0;
      if (onDone) onDone();
      return;
    }
    const shuffled = pool.slice().sort(() => Math.random() - 0.5);
    const offered = shuffled.slice(0, Math.min(3, shuffled.length));

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-levelup-bg">
        <div class="kj-levelup-sparkle">👑 Royal Trait!</div>
        <div class="kj-muted" style="text-align:center;">Pick ONE. Keeps forever.</div>
        <div class="kj-trait-choices">
          ${offered.map(t => `
            <button class="kj-trait-card" data-trait="${t.id}">
              <div class="kj-trait-emoji">${t.emoji || '✨'}</div>
              <div class="kj-trait-name">${t.name}</div>
              <div class="kj-trait-desc">${t.description}</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    KJ.UI.HUD.attach();
    document.querySelectorAll('.kj-trait-card').forEach(b => {
      b.onclick = () => {
        KJ.Audio.play('fanfare');
        const tid = b.dataset.trait;
        const state = KJ.State.get();
        state.player.traits.push(tid);
        state.player.pendingTraitPicks--;
        const t = KJ.Registry.traits.get(tid);
        KJ.Events.emit('trait_picked', { trait: t });
        KJ.Effects.toast('Trait: ' + t.name, { icon: t.emoji || '✨' });
        // If another pick pending (rare), loop; else finish
        if (state.player.pendingTraitPicks > 0) {
          showTrait(onDone);
        } else {
          if (onDone) onDone();
        }
      };
    });
  }

  return { showIfPending, showStats, showTrait };
})();
