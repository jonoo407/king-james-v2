// King James 2 — HUD
// Top bar: gold, character button, crown coherence indicator.
// Visible on most screens except title.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.HUD = (function () {

  function html() {
    const state = KJ.State.get();
    const coherence = state.progress.crownCoherence || 0;
    return `
      <div class="kj-hud">
        <div class="kj-hud-left">
          <span class="kj-hud-gold">🪙 <span id="kj-hud-gold-val">${state.inventory.gold}</span></span>
          <span class="kj-hud-charms" title="Friendship Charms">📿 ${state.inventory.charms}</span>
        </div>
        <div class="kj-hud-center">
          <span class="kj-hud-crown kj-crown-fit-${coherence}" title="Crown Coherence ${coherence}/5">👑</span>
        </div>
        <div class="kj-hud-right">
          <button class="kj-hud-btn" id="kj-btn-mute"      title="Mute voice">🔊</button>
          <button class="kj-hud-btn" id="kj-btn-party"     title="Allies (swap party between scenes)">🏠</button>
          <button class="kj-hud-btn" id="kj-btn-gear"      title="Gear (swap between scenes)">📦</button>
          <button class="kj-hud-btn" id="kj-btn-character" title="Character sheet">📜</button>
          ${state.settings.debug ? '<button class="kj-hud-btn" id="kj-btn-debug" title="Debug menu">🐞</button>' : ''}
        </div>
      </div>
    `;
  }

  function attach() {
    const muteBtn = document.getElementById('kj-btn-mute');
    if (muteBtn) muteBtn.onclick = () => {
      const on = KJ.Audio.toggleVoice();
      muteBtn.textContent = on ? '🔊' : '🔇';
    };
    const charBtn = document.getElementById('kj-btn-character');
    if (charBtn) charBtn.onclick = () => {
      KJ.Audio.play('click');
      if (KJ.UI.Character && KJ.UI.Character.render) KJ.UI.Character.render();
    };
    const gearBtn = document.getElementById('kj-btn-gear');
    if (gearBtn) gearBtn.onclick = () => {
      const cur = KJ.Scene.current();
      if (cur && (cur.type === 'battle' || cur.type === 'puzzle')) {
        KJ.Effects.toast('Can\'t swap gear mid-fight!', { icon: '⚔️' });
        return;
      }
      KJ.Audio.play('click');
      if (KJ.UI.GearChest && KJ.UI.GearChest.render) KJ.UI.GearChest.render();
    };
    const debugBtn = document.getElementById('kj-btn-debug');
    if (debugBtn) debugBtn.onclick = () => {
      KJ.Audio.play('click');
      if (KJ.UI.Debug && KJ.UI.Debug.open) KJ.UI.Debug.open();
    };
    const partyBtn = document.getElementById('kj-btn-party');
    if (partyBtn) partyBtn.onclick = () => {
      const cur = KJ.Scene.current();
      if (cur && (cur.type === 'battle' || cur.type === 'puzzle')) {
        KJ.Effects.toast('Can\'t swap allies mid-fight!', { icon: '⚔️' });
        return;
      }
      KJ.Audio.play('click');
      if (KJ.UI.AllyRoom && KJ.UI.AllyRoom.render) KJ.UI.AllyRoom.render();
    };
  }

  // Refresh the gold cell without full rerender
  function refreshGold() {
    const el = document.getElementById('kj-hud-gold-val');
    if (el) el.textContent = KJ.State.get().inventory.gold;
  }
  KJ.Events.on('gold_changed', refreshGold);

  return { html, attach, refreshGold };
})();
