// King James 2 — Gear Chest
// View owned gear, equip by slot.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.GearChest = (function () {

  function render() {
    const state = KJ.State.get();
    const app = document.getElementById('app');

    // Group owned gear by slot
    const bySlot = {};
    for (const slot of KJ.GEAR_SLOTS) bySlot[slot] = [];
    state.inventory.gear.forEach(id => {
      const g = KJ.Registry.gear.get(id);
      if (g) bySlot[g.slot].push(g);
    });

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-gear-bg">
        <h2 class="kj-h2">📦 Gear Chest</h2>
        <p class="kj-muted">Your 4 moves come from your 4 equipped gear pieces.</p>
        ${KJ.GEAR_SLOTS.map(slot => slotSection(slot, bySlot[slot], state)).join('')}
        <div class="kj-footer-nav">
          <button class="kj-btn-secondary" id="kj-btn-back">⬅️ Back</button>
        </div>
      </div>
    `;
    KJ.UI.HUD.attach();
    document.getElementById('kj-btn-back').onclick = () => {
      KJ.Audio.play('click');
      KJ.UI.Castle.back();
    };
    document.querySelectorAll('.kj-equip-btn').forEach(b => {
      b.onclick = () => {
        const slot = b.dataset.slot;
        const id = b.dataset.gear;
        KJ.Audio.play('equip');
        const state = KJ.State.get();
        state.player.equipped[slot] = id;
        KJ.Events.emit('gear_equipped', { slot, gearId: id });
        render(); // refresh
      };
    });
  }

  function slotSection(slot, items, state) {
    const slotLabel = { weapon: '⚔️ Weapon', armor: '🛡️ Armor', trinket: '📿 Trinket', boots: '👟 Boots' }[slot];
    const equippedId = state.player.equipped[slot];
    const equipped = equippedId ? KJ.Registry.gear.get(equippedId) : null;
    const eqMove = equipped && equipped.move ? KJ.Registry.moves.get(equipped.move) : null;
    return `
      <div class="kj-gear-section">
        <h3 class="kj-h3">${slotLabel}</h3>
        <div class="kj-equipped-card">
          Equipped:
          ${equipped ? `${equipped.emoji} <strong>${equipped.name}</strong> ${statsStr(equipped)}${eqMove ? ` → <em>${eqMove.name}</em>` : ''}` : '<em>(empty)</em>'}
        </div>
        <div class="kj-gear-options">
          ${items.length === 0 ? '<em>No extras. Find more on quests!</em>' :
            items.map(g => {
              const isEquipped = g.id === equippedId;
              const mv = g.move ? KJ.Registry.moves.get(g.move) : null;
              return `
                <div class="kj-gear-option">
                  <span>${g.emoji} <strong>${g.name}</strong> ${statsStr(g)}${mv ? ` → ${mv.name}` : ''}</span>
                  ${isEquipped
                    ? `<span class="kj-muted">equipped</span>`
                    : `<button class="kj-equip-btn kj-btn-secondary" data-slot="${slot}" data-gear="${g.id}">Equip</button>`}
                </div>`;
            }).join('')}
        </div>
      </div>
    `;
  }

  function statsStr(g) {
    return Object.entries(g.stats || {}).map(([s, v]) => `+${v} ${s.toUpperCase()}`).join(' ');
  }

  return { render };
})();
