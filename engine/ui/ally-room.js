// King James 2 — Ally Room
// Manage roster, choose 1-2 allies for next quest.
// Dame Pompadour corner: hire missed allies for gold.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.AllyRoom = (function () {

  function render() {
    const state = KJ.State.get();
    const app = document.getElementById('app');
    const roster = Object.entries(state.roster.allies);
    const partySet = new Set(state.roster.party);

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-ally-bg">
        <h2 class="kj-h2">🏠 Ally Room</h2>
        <p class="kj-muted">Bring up to ${KJ.MAX_ALLIES_PER_QUEST} allies on each quest. Tap to toggle.</p>
        <div class="kj-ally-list">
          ${roster.length === 0 ? '<em>No allies yet!</em>' :
            roster.map(([id, inst]) => allyCard(id, inst, partySet.has(id))).join('')}
        </div>

        <h3 class="kj-h3">🎭 Dame Pompadour's Auditions</h3>
        <div class="kj-pompadour-card">
          <div class="kj-pompadour-portrait">💅💄🎩</div>
          <div class="kj-pompadour-dialogue" id="kj-pompadour-line">
            <em>${pickPompadourLine()}</em>
          </div>
          <div class="kj-pompadour-list">
            ${renderMissed(state)}
          </div>
        </div>

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
    document.querySelectorAll('.kj-ally-toggle').forEach(btn => {
      btn.onclick = () => {
        KJ.Audio.play('click');
        togglePartyMember(btn.dataset.ally);
        render();
      };
    });
    document.querySelectorAll('.kj-pomp-hire').forEach(btn => {
      btn.onclick = () => hire(btn.dataset.ally);
    });
  }

  function allyCard(id, inst, inParty) {
    const a = KJ.Registry.allies.get(id);
    if (!a) return '';
    return `
      <div class="kj-ally-card ${inParty ? 'in-party' : ''}">
        <div class="kj-ally-emoji">${a.emoji}</div>
        <div class="kj-ally-info">
          <strong>${a.name}</strong> · Lv ${inst.level} · ${typeIcon(a.type)}
          <div class="kj-ally-hp">HP ${inst.hp} / ${a.baseStats.hp + (inst.level - 1) * 2}</div>
          <div class="kj-ally-bio">${a.bio || ''}</div>
        </div>
        <button class="kj-ally-toggle kj-btn-secondary" data-ally="${id}">
          ${inParty ? '✅ In Party' : '➕ Add'}
        </button>
      </div>
    `;
  }

  function togglePartyMember(id) {
    const state = KJ.State.get();
    const idx = state.roster.party.indexOf(id);
    if (idx >= 0) {
      state.roster.party.splice(idx, 1);
    } else {
      if (state.roster.party.length >= KJ.MAX_ALLIES_PER_QUEST) {
        KJ.Effects.toast('Party full! Remove one first.');
        return;
      }
      state.roster.party.push(id);
    }
    KJ.State.save();
  }

  function renderMissed(state) {
    if (!state.roster.missed.length) {
      return '<em class="kj-muted">No lost friends to recruit yet. Explore more!</em>';
    }
    return state.roster.missed.filter(id => !state.roster.allies[id]).map(id => {
      const a = KJ.Registry.allies.get(id);
      if (!a) return '';
      const basePrice = a.hirePrice || 100;
      const price = KJ.Traits ? KJ.Traits.priceAfterDiscount(basePrice) : basePrice;
      return `
        <div class="kj-pomp-candidate">
          ${a.emoji} <strong>${a.name}</strong> — ${price} 🪙
          <button class="kj-pomp-hire kj-btn-secondary" data-ally="${id}">Hire</button>
        </div>`;
    }).join('');
  }

  function hire(id) {
    const state = KJ.State.get();
    const a = KJ.Registry.allies.get(id);
    if (!a) return;
    const basePrice = a.hirePrice || 100;
    const price = KJ.Traits ? KJ.Traits.priceAfterDiscount(basePrice) : basePrice;
    if (state.inventory.gold < price) {
      KJ.Effects.toast('Not enough gold, darling!');
      return;
    }
    state.inventory.gold -= price;
    state.roster.allies[id] = {
      level: 1, xp: 0,
      moves: KJ.Scene.defaultMovesForAlly(a),
      hp: a.baseStats.hp,
    };
    const i = state.roster.missed.indexOf(id);
    if (i >= 0) state.roster.missed.splice(i, 1);
    KJ.Events.emit('ally_recruited', { ally: a });
    KJ.Events.emit('gold_changed', { delta: -price });
    KJ.Audio.play('fanfare');
    KJ.Effects.toast(a.name + ' joined the troupe!', { icon: a.emoji });
    render();
  }

  const POMP_LINES = [
    '"Darlings, gather \'round — I present your next STAR!"',
    '"You missed a friend? Tragic! But I can find them — for a price."',
    '"Oh SWEETIE, acting is 90% makeup and 10% commitment!"',
    '"Shhh — the theatre is ALIVE with possibility!"',
    '"Gold, please. Arts aren\'t free, your majesty-ness."',
  ];
  function pickPompadourLine() { return POMP_LINES[Math.floor(Math.random() * POMP_LINES.length)]; }

  function typeIcon(t) {
    return ({ fire: '🔥', water: '💧', earth: '🌿', wind: '💨', magic: '🪄' })[t] || '·';
  }

  return { render };
})();
