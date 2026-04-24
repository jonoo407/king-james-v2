// King James 2 — Debug Menu
// Dev-only cheat panel. Visible when state.settings.debug === true.
// Toggle master flag in state.js to hide the HUD bug-button.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.Debug = (function () {

  // Track overlay visibility across scene changes
  let _overlayOn = false;

  function open() {
    const state = KJ.State.get();
    const cur = KJ.Scene.current && KJ.Scene.current();
    const inBattle = cur && cur.type === 'battle';
    const allUnlocked = !!state.progress.flags._debug_unlock_all;

    const host = document.createElement('div');
    host.className = 'kj-debug-overlay';
    host.innerHTML = `
      <div class="kj-debug-panel">
        <div class="kj-debug-header">
          <span>🐞 Debug Menu</span>
          <button class="kj-debug-close" id="kj-dbg-close">✕</button>
        </div>
        <div class="kj-debug-body">
          <button class="kj-debug-btn" data-act="unlock_arcs">${allUnlocked ? '✅ ' : ''}🗺️ All arcs unlocked</button>
          <button class="kj-debug-btn" data-act="heal">❤️ Heal party to full</button>
          <button class="kj-debug-btn" data-act="levelup">⬆️ Level up ×1</button>
          <button class="kj-debug-btn" data-act="gold">🪙 +500 gold</button>
          <button class="kj-debug-btn" data-act="treasures">👑 Grant all treasures</button>
          <button class="kj-debug-btn" data-act="allies">🧑‍🤝‍🧑 Unlock all allies</button>
          <button class="kj-debug-btn" data-act="winbattle" ${inBattle ? '' : 'disabled'}>🏆 Win current battle</button>
          <button class="kj-debug-btn" data-act="overlay">${_overlayOn ? '✅ ' : ''}🏷️ Scene ID overlay</button>
          <button class="kj-debug-btn kj-debug-danger" data-act="reset">🧹 Reset save & reload</button>
        </div>
        <div class="kj-debug-footer">
          Scene: <code>${cur ? cur.id : '—'}</code>
        </div>
      </div>
    `;
    document.body.appendChild(host);

    host.querySelector('#kj-dbg-close').onclick = close;
    host.onclick = (e) => { if (e.target === host) close(); };
    host.querySelectorAll('.kj-debug-btn').forEach(b => {
      b.onclick = () => { handle(b.dataset.act); };
    });

    function close() { host.remove(); }
  }

  function handle(act) {
    const state = KJ.State.get();
    switch (act) {
      case 'unlock_arcs': {
        const on = !state.progress.flags._debug_unlock_all;
        state.progress.flags._debug_unlock_all = on;
        KJ.Effects.toast(on ? 'All arcs unlocked' : 'Arc locks restored', { icon: '🗺️' });
        KJ.State.save();
        // Re-render map if we're on it
        closeAndRefresh();
        break;
      }
      case 'heal': {
        state.player.hp = playerMaxHP(state);
        Object.entries(state.roster.allies).forEach(([id, a]) => {
          const def = KJ.Registry.allies.get(id);
          if (def) a.hp = def.baseStats.hp;
        });
        KJ.Effects.toast('Party healed to full', { icon: '❤️' });
        KJ.State.save();
        closeAndRefresh();
        break;
      }
      case 'levelup': {
        const nextLvl = state.player.level + 1;
        const needed = KJ.xpForLevel(nextLvl);
        state.player.xp = needed;
        state.player.level = nextLvl;
        state.player.pendingStatPoints += KJ.STAT_POINTS_PER_LEVEL;
        if (nextLvl % KJ.TRAIT_EVERY_N_LEVELS === 0) state.player.pendingTraitPicks++;
        KJ.Events.emit('level_up', { newLevel: nextLvl });
        KJ.Audio.play('levelup');
        KJ.Effects.bigText('LEVEL UP!');
        KJ.Effects.toast('Level ' + nextLvl, { icon: '⬆️' });
        KJ.State.save();
        closeAndRefresh();
        break;
      }
      case 'gold': {
        state.inventory.gold += 500;
        KJ.Events.emit('gold_changed', { delta: 500 });
        KJ.Effects.toast('+500 gold', { icon: '🪙' });
        KJ.State.save();
        break;
      }
      case 'treasures': {
        const all = KJ.Registry.treasures.all();
        all.forEach(t => KJ.Scene.applyEffects([{ type: 'grant_treasure', id: t.id }]));
        KJ.Effects.toast('All treasures granted (' + all.length + ')', { icon: '👑' });
        KJ.State.save();
        closeAndRefresh();
        break;
      }
      case 'allies': {
        const all = KJ.Registry.allies.all();
        all.forEach(a => KJ.Scene.applyEffects([{ type: 'recruit_ally', id: a.id }]));
        KJ.Effects.toast('All allies recruited (' + all.length + ')', { icon: '🧑‍🤝‍🧑' });
        KJ.State.save();
        closeAndRefresh();
        break;
      }
      case 'winbattle': {
        const fn = KJ.UI.BattleScene && KJ.UI.BattleScene._debugForceVictory;
        if (fn) { closeOnly(); fn(); }
        else    { KJ.Effects.toast('Not in a battle', { icon: '⚠️' }); }
        break;
      }
      case 'overlay': {
        _overlayOn = !_overlayOn;
        if (_overlayOn) mountOverlay(); else unmountOverlay();
        KJ.Effects.toast(_overlayOn ? 'Scene overlay ON' : 'Scene overlay OFF', { icon: '🏷️' });
        break;
      }
      case 'reset': {
        if (!confirm('Wipe save and reload?')) return;
        KJ.State.wipe();
        location.reload();
        break;
      }
    }
  }

  function playerMaxHP(state) {
    let hp = state.player.baseStats.hp;
    const eqIds = Object.values(state.player.equipped || {});
    eqIds.forEach(id => {
      const g = KJ.Registry.gear.get(id);
      if (g && g.stats && g.stats.hp) hp += g.stats.hp;
    });
    return hp;
  }

  function closeOnly() {
    const o = document.querySelector('.kj-debug-overlay');
    if (o) o.remove();
  }

  function closeAndRefresh() {
    closeOnly();
    // Nudge a soft re-render: gold/hud event is cheap; full map re-render if on map
    KJ.Events.emit('gold_changed', {});
    if (document.querySelector('.kj-map-bg') && KJ.UI.Map) KJ.UI.Map.render();
  }

  // Scene ID overlay (small corner tag)
  function mountOverlay() {
    if (document.getElementById('kj-debug-scene-tag')) return;
    const el = document.createElement('div');
    el.id = 'kj-debug-scene-tag';
    el.className = 'kj-debug-scene-tag';
    document.body.appendChild(el);
    refreshOverlay();
  }
  function unmountOverlay() {
    const el = document.getElementById('kj-debug-scene-tag');
    if (el) el.remove();
  }
  function refreshOverlay() {
    const el = document.getElementById('kj-debug-scene-tag');
    if (!el) return;
    const cur = KJ.Scene.current && KJ.Scene.current();
    el.textContent = cur ? ('📍 ' + cur.id) : '📍 —';
  }
  KJ.Events.on('scene_entered', refreshOverlay);

  return { open };
})();
