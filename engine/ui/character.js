// King James 2 — Character Sheet (inspection screen)
// Shows James's stats, gear, moves, traits, allies, gold, badges.

window.KJ = window.KJ || {};
KJ.UI = KJ.UI || {};

KJ.UI.Character = (function () {

  function render() {
    const state = KJ.State.get();
    const app = document.getElementById('app');
    const eq = KJ.Scene.equippedGear();
    const base = state.player.baseStats;

    app.innerHTML = `
      ${KJ.UI.HUD.html()}
      <div class="kj-scene-wrap kj-char-bg">
        <h2 class="kj-h2">📜 James — Lv ${state.player.level}</h2>
        <div class="kj-char-portrait">🧒👑</div>
        <div class="kj-char-rank">Rank: ${rankLabel(state.player.royalRank)}</div>
        <div class="kj-xpbar">
          <div class="kj-xpbar-fill" style="width:${xpPct(state)}%"></div>
          <span class="kj-xpbar-label">${state.player.xp} / ${KJ.xpForLevel(state.player.level + 1)} XP</span>
        </div>

        <div class="kj-stat-grid">
          ${KJ.STATS.map(s => statRow(s, base[s], eq.stats[s] || 0)).join('')}
        </div>

        <h3 class="kj-h3">⚔️ Gear (moves derived from gear)</h3>
        <div class="kj-gear-list">
          ${KJ.GEAR_SLOTS.map(s => gearSlotRow(s, state)).join('')}
        </div>

        ${treasureMovesSection(state)}

        <h3 class="kj-h3">✨ Royal Traits</h3>
        <div class="kj-trait-list">
          ${state.player.traits.length === 0 ? '<em>None yet.</em>' :
            state.player.traits.map(tid => {
              const t = KJ.Registry.traits.get(tid);
              return t ? `<span class="kj-trait-chip">${t.emoji || '✨'} ${t.name}</span>` : '';
            }).join('')}
        </div>

        <h3 class="kj-h3">🤝 Allies (${Object.keys(state.roster.allies).length})</h3>
        <div class="kj-ally-grid">
          ${Object.keys(state.roster.allies).length === 0 ? '<em>No allies yet. Go on a quest!</em>' :
            Object.entries(state.roster.allies).map(([id, inst]) => {
              const a = KJ.Registry.allies.get(id);
              return a ? `<div class="kj-ally-card">${a.emoji} <strong>${a.name}</strong> Lv ${inst.level}</div>` : '';
            }).join('')}
        </div>

        <h3 class="kj-h3">🎖️ Badges (${state.progress.badges.length})</h3>
        <div class="kj-badge-row">
          ${state.progress.badges.length === 0 ? '<em>None yet.</em>' :
            state.progress.badges.map(bid => {
              const b = KJ.Registry.badges.get(bid);
              return b ? `<span class="kj-badge-chip" title="${b.description || ''}">${b.emoji || '🎖️'} ${b.name}</span>` : '';
            }).join('')}
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
  }

  function statRow(stat, base, bonus) {
    const label = { hp: '❤️ HP', atk: '⚔️ ATK', def: '🛡️ DEF', spd: '💨 SPD' }[stat];
    const total = base + bonus;
    return `
      <div class="kj-stat-row">
        <div class="kj-stat-label">${label}</div>
        <div class="kj-stat-value">${total} <span class="kj-stat-breakdown">(${base} + ${bonus})</span></div>
        <div class="kj-stat-bar"><div class="kj-stat-fill" style="width:${Math.min(100, total * 2)}%"></div></div>
      </div>
    `;
  }

  function gearSlotRow(slot, state) {
    const id = state.player.equipped[slot];
    const gear = id ? KJ.Registry.gear.get(id) : null;
    const slotLabel = { weapon: '⚔️ Weapon', armor: '🛡️ Armor', trinket: '📿 Trinket', boots: '👟 Boots' }[slot];
    if (!gear) {
      return `<div class="kj-gear-row kj-gear-empty"><strong>${slotLabel}</strong>: <em>(empty)</em></div>`;
    }
    const move = gear.move ? KJ.Registry.moves.get(gear.move) : null;
    const statStr = Object.entries(gear.stats || {}).map(([s, v]) => `+${v} ${s.toUpperCase()}`).join(', ');
    return `
      <div class="kj-gear-row">
        <strong>${slotLabel}</strong>: ${gear.emoji} ${gear.name} <span class="kj-gear-stats">${statStr}</span>
        ${move ? `<div class="kj-gear-move">→ Move: ${move.name} (${move.power} pwr, ${move.type})</div>` : ''}
      </div>
    `;
  }

  function treasureMovesSection(state) {
    const tMoveIds = KJ.Scene.treasureMoves();
    if (!tMoveIds.length) return '';
    const icons = { fire:'🔥', water:'💧', earth:'🌿', wind:'💨', magic:'✨' };
    const rows = tMoveIds.map(mid => {
      const m = KJ.Registry.moves.get(mid);
      if (!m) return '';
      const typeIcon = icons[m.type] || '·';
      const detail = m.heal ? `heal +${m.heal}` : `pwr ${m.power}`;
      return `<div class="kj-gear-row">
        <strong>👑 Treasure Move</strong>: ${typeIcon} ${m.name}
        <div class="kj-gear-move">${detail} · ${m.flavor || ''}</div>
      </div>`;
    }).join('');
    return `
      <h3 class="kj-h3">👑 Treasure Moves (bonus — stack with gear)</h3>
      <div class="kj-gear-list">${rows}</div>
    `;
  }

  function rankLabel(id) {
    const r = (KJ.ROYAL_RANKS || []).find(x => x.id === id);
    return r ? r.label : id;
  }

  function xpPct(state) {
    const cur = state.player.xp;
    const floor = KJ.xpForLevel(state.player.level);
    const next = KJ.xpForLevel(state.player.level + 1);
    return ((cur - floor) / Math.max(1, next - floor)) * 100;
  }

  return { render };
})();
