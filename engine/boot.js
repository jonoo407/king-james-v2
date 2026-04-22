// King James 2 — Boot
// Runs last after all engine + data files have loaded.
// Wires up save, auto-save, the first render, and optionally shows a
// "Continue or New Game" splash if a save exists.

window.KJ = window.KJ || {};

KJ.Boot = (function () {

  function start() {
    // Validate required globals
    const need = ['Constants','Events','Registry','State','Audio','Effects','Scene','Combat','UI'];
    // Constants is just KJ top-level, not a sub-namespace — skip it
    const missing = ['Events','Registry','State','Audio','Effects','Scene','Combat','UI']
      .filter(k => !KJ[k]);
    if (missing.length) {
      document.getElementById('app').innerHTML =
        `<div class="kj-error"><h2>⚠️ Boot failed</h2><p>Missing: ${missing.join(', ')}</p></div>`;
      console.error('[boot] missing globals:', missing);
      return;
    }

    // Load save
    const loaded = KJ.State.load();
    KJ.State.installAutoSave();

    // Wire generic listeners (badges watch, toasts, etc.)
    wireBadgeWatchers();
    wireCrownCoherence();

    // First screen: title (if no save) OR continue/new prompt (if save)
    if (loaded.loaded) {
      showContinueOrNew();
    } else {
      showTitle();
    }
  }

  function showTitle() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="kj-title-screen kj-title-has-image">
        <div class="kj-title-overlay">
          <button class="kj-big-btn" id="btn-new">▶️ NEW GAME</button>
        </div>
      </div>
    `;
    document.getElementById('btn-new').onclick = () => {
      KJ.Audio.play('click');
      KJ.State.reset();
      KJ.Scene.goto('intro_mud');
    };
  }

  function showContinueOrNew() {
    const app = document.getElementById('app');
    const state = KJ.State.get();
    const lvl = state.player.level;
    const treasures = state.progress.treasures.length;
    app.innerHTML = `
      <div class="kj-title-screen kj-title-has-image">
        <div class="kj-title-overlay">
          <p class="kj-subtitle">Lv ${lvl} · ${treasures}/5 treasures</p>
          <button class="kj-big-btn" id="btn-continue">▶️ CONTINUE</button>
          <button class="kj-btn-secondary" id="btn-new">🆕 NEW GAME (erase save)</button>
        </div>
      </div>
    `;
    document.getElementById('btn-continue').onclick = () => {
      KJ.Audio.play('click');
      KJ.UI.Castle.render();
    };
    document.getElementById('btn-new').onclick = () => {
      if (!confirm('Start over? Your save will be erased.')) return;
      KJ.Audio.play('click');
      KJ.State.reset();
      KJ.Scene.goto('intro_mud');
    };
  }

  function wireBadgeWatchers() {
    // On any of these events, re-evaluate all badge predicates.
    const events = [
      'ally_recruited','battle_won','quest_completed','treasure_found',
      'level_up','trait_picked','gear_equipped',
    ];
    const check = () => {
      const state = KJ.State.get();
      for (const b of KJ.Registry.badges.all()) {
        if (state.progress.badges.includes(b.id)) continue;
        try {
          if (b.predicate && b.predicate(state)) {
            state.progress.badges.push(b.id);
            if (b.goldReward) {
              state.inventory.gold += b.goldReward;
              KJ.Events.emit('gold_changed', { delta: b.goldReward });
            }
            KJ.Events.emit('badge_unlocked', { badge: b });
            KJ.Effects.toast('Badge: ' + b.name, { icon: b.emoji || '🎖️' });
            KJ.Audio.play('fanfare');
          }
        } catch (e) { console.error('badge check failed', b.id, e); }
      }
    };
    events.forEach(e => KJ.Events.on(e, check));
  }

  function wireCrownCoherence() {
    KJ.Events.on('treasure_found', () => {
      const state = KJ.State.get();
      state.progress.crownCoherence = state.progress.treasures.length;
    });
  }

  // Wait for DOM + all script tags to have executed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  return { start };
})();
