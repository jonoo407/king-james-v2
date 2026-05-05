// King James 2 — Boot
// Runs last after all engine + data files have loaded.
// Wires up auto-save and shows the title screen with the profile picker.

window.KJ = window.KJ || {};

KJ.Boot = (function () {

  function start() {
    const need = ['Events','Registry','State','Profiles','Audio','Effects','Scene','Combat','UI'];
    const missing = need.filter(k => !KJ[k]);
    if (missing.length) {
      document.getElementById('app').innerHTML =
        `<div class="kj-error"><h2>⚠️ Boot failed</h2><p>Missing: ${missing.join(', ')}</p></div>`;
      console.error('[boot] missing globals:', missing);
      return;
    }

    KJ.State.installAutoSave();
    wireBadgeWatchers();
    wireCrownCoherence();

    showTitle();
  }

  // ---- Title screen ---------------------------------------------------------

  function showTitle() {
    const app = document.getElementById('app');

    // If there's an old single-slot save, silently adopt it as "James" so
    // the kid sees it as a normal saved-player entry in the picker. No
    // migration prompt, no asking for a name — there's only one and we know
    // who it is.
    if (KJ.Profiles.hasLegacySave() && KJ.Profiles.list().length === 0) {
      KJ.Profiles.migrateLegacy('James');
    }

    renderPicker(app, KJ.Profiles.list());
  }

  function renderPicker(app, profiles) {
    const showList = profiles.length > 0;

    app.innerHTML = titleShell(`
      <p class="kj-subtitle">${showList ? 'Pick Player' : 'Welcome!'}</p>

      <div class="kj-new-player-card">
        <div class="kj-new-player-label">➕ New Player</div>
        <input type="text" class="kj-name-input" id="kj-new-name" maxlength="12"
               autocomplete="off" placeholder="Type your name" />
        <button class="kj-big-btn" id="btn-new">▶️ START</button>
        <p class="kj-name-error" id="kj-new-err"></p>
      </div>

      ${showList ? `
        <div class="kj-profile-list">
          ${profiles.map(p => `
            <button class="kj-profile-btn" data-name="${escapeAttr(p.name)}">
              <span class="kj-profile-name">${escapeHtml(p.displayName)}</span>
              <span class="kj-profile-meta">Lv ${p.level} · ${p.treasures}/5 treasures</span>
              <span class="kj-profile-delete" data-delete="${escapeAttr(p.name)}" title="Delete this player">✕</span>
            </button>
          `).join('')}
        </div>
      ` : ''}
    `);

    // Existing-profile clicks
    Array.from(document.querySelectorAll('.kj-profile-btn')).forEach(btn => {
      btn.onclick = (e) => {
        // Delete-X has its own handler via stopPropagation below
        if (e.target.classList.contains('kj-profile-delete')) return;
        const name = btn.dataset.name;
        KJ.Audio.play('click');
        const r = KJ.Profiles.load(name);
        if (!r.loaded) { alert("Oops — couldn't load that."); return; }
        KJ.UI.Castle.render();
      };
    });

    // Per-profile delete (✕)
    Array.from(document.querySelectorAll('.kj-profile-delete')).forEach(x => {
      x.onclick = (e) => {
        e.stopPropagation();
        const name = x.dataset.delete;
        const p = profiles.find(p => p.name === name);
        const display = p ? p.displayName : name;
        if (!confirm(`Delete ${display}? Can't undo.`)) return;
        KJ.Profiles.delete(name);
        showTitle();
      };
    });

    // New-player submit
    const input = document.getElementById('kj-new-name');
    const err   = document.getElementById('kj-new-err');
    const btn   = document.getElementById('btn-new');
    const submit = () => {
      const name = input.value;
      const r = KJ.Profiles.create(name);
      if (!r.created) { err.textContent = r.error || 'Oops! Try again.'; return; }
      KJ.Audio.play('click');
      KJ.Scene.goto('intro_mud');
    };
    btn.onclick = submit;
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }

  function titleShell(innerHtml) {
    return `
      <div class="kj-title-screen kj-title-has-image">
        <img src="images/title-bg.jpg" class="kj-title-poster" alt="King James">
        <div class="kj-title-overlay">${innerHtml}</div>
      </div>
    `;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  // ---- Generic listeners (unchanged) ---------------------------------------

  function wireBadgeWatchers() {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  return { start, showTitle };
})();
