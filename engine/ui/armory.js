// King James 2 — Armory
// Unlocked by the Blade of Bravery treasure. Spend gold to Enhance gear:
// +2 to each piece's primary stat (weapon→atk, armor→def, trinket→hp, boots→spd).
// One-time upgrade per gear piece. Cost = tier × 75 gold.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.Armory = (function () {

  function render() {
    const state = KJ.State.get();
    const app = document.getElementById('app');
    const gearList = (state.inventory.gear || []).slice().sort((a, b) => {
      const ga = KJ.Registry.gear.get(a); const gb = KJ.Registry.gear.get(b);
      return ((ga && ga.tier) || 0) - ((gb && gb.tier) || 0);
    });

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-armory-bg">
        <h2 class="kj-h2">🔨 The Armory</h2>
        <div class="kj-muted" style="text-align:center;">
          Pay the smith to enhance a gear piece. +2 to its primary stat. One upgrade per piece.
        </div>
        <div class="kj-armory-list">
          ${gearList.length === 0 ? '<div class="kj-muted" style="text-align:center; margin:20px;">No gear to enhance.</div>' : ''}
          ${gearList.map(id => rowHTML(id, state)).join('')}
        </div>
        <div class="kj-footer-nav">
          <button class="kj-btn-secondary" id="kj-armory-back">⬅️ Back to Castle</button>
        </div>
      </div>
    `;
    KJ.UI.HUD.attach();

    document.getElementById('kj-armory-back').onclick = () => {
      KJ.Audio.play('click');
      KJ.UI.Castle.render();
    };
    document.querySelectorAll('.kj-armory-enhance-btn').forEach(b => {
      b.onclick = () => enhance(b.dataset.gear);
    });
  }

  function rowHTML(id, state) {
    const g = KJ.Registry.gear.get(id);
    if (!g) return '';
    const enhanced = (state.inventory.enhancedGear || []).includes(id);
    const primary = KJ.Scene.primaryStatForSlot ? KJ.Scene.primaryStatForSlot(g.slot) : 'atk';
    const primaryIcon = ({ hp: '❤️', atk: '⚔️', def: '🛡️', spd: '💨' })[primary];
    const cost = (g.tier || 1) * 75;
    const canAfford = state.inventory.gold >= cost;
    const statsTxt = Object.entries(g.stats || {})
      .map(([k, v]) => ({ hp: '❤️', atk: '⚔️', def: '🛡️', spd: '💨' })[k] + '+' + v)
      .join(' ');
    return `
      <div class="kj-armory-row ${enhanced ? 'enhanced' : ''}">
        <div class="kj-armory-row-left">
          <span class="kj-armory-emoji">${g.emoji || '🔩'}</span>
          <div>
            <div class="kj-armory-name">${g.name} <span class="kj-armory-tier">T${g.tier || 1}</span>${enhanced ? ' <span class="kj-armory-badge">⭐</span>' : ''}</div>
            <div class="kj-armory-sub">${statsTxt}</div>
          </div>
        </div>
        ${enhanced
          ? `<div class="kj-armory-done">✨ Enhanced<br><small>(${primaryIcon}+2)</small></div>`
          : `<button class="kj-armory-enhance-btn kj-btn-secondary" data-gear="${id}" ${canAfford ? '' : 'disabled'}>
               🔨 Enhance<br><small>${primaryIcon}+2 — 🪙 ${cost}</small>
             </button>`
        }
      </div>
    `;
  }

  function enhance(id) {
    const state = KJ.State.get();
    const g = KJ.Registry.gear.get(id);
    if (!g) return;
    const cost = (g.tier || 1) * 75;
    if (state.inventory.gold < cost) {
      KJ.Effects.toast('Not enough gold');
      return;
    }
    if ((state.inventory.enhancedGear || []).includes(id)) return; // already
    state.inventory.gold -= cost;
    state.inventory.enhancedGear = state.inventory.enhancedGear || [];
    state.inventory.enhancedGear.push(id);
    KJ.Events.emit('gold_changed', { delta: -cost });
    KJ.Audio.play('fanfare');
    KJ.Effects.toast('Enhanced: ' + g.name, { icon: '⭐' });
    KJ.State.save();
    render();
  }

  return { render };
})();
