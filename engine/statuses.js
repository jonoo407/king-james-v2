// King James 2 — Status Effects
// Each combatant has a `statuses` array of short-lived effect instances.
// Effects fire at four hook points: turn_start, turn_end, on_hit_dealt,
// on_hit_taken. See DEFS below for per-status behavior.
//
// Usage (from combat/battle code):
//   KJ.Statuses.apply(combatant, 'burn', { turns: 3, source: attacker });
//   KJ.Statuses.tick(battle, combatant, 'turn_end'); // returns array of log entries
//   KJ.Statuses.shouldSkipTurn(combatant);            // true = skip this turn
//   KJ.Statuses.modifyIncoming(combatant, amount);    // e.g. shield halves damage
//   KJ.Statuses.modifyOutgoing(combatant, amount);    // e.g. pumped +50% atk
//   KJ.Statuses.modifySpeed(combatant, baseSpd);      // quick → +50%
//   KJ.Statuses.blocksHealing(combatant);             // cursed → true

window.KJ = window.KJ || {};

KJ.Statuses = (function () {

  // Per-status definitions — self-contained behavior.
  const DEFS = {
    burn: {
      icon: '🔥', name: 'Burning',
      defaultTurns: 3,
      onTurnEnd: (c, inst, lvl) => {
        const dmg = 2 + Math.floor(lvl / 2);
        c.stats.hp = Math.max(0, c.stats.hp - dmg);
        return { kind: 'status_tick', data: { target: c, icon: '🔥', amount: dmg, name: 'burn' } };
      },
    },
    poison: {
      icon: '🧪', name: 'Poisoned',
      defaultTurns: 4,
      onTurnEnd: (c, inst, lvl) => {
        const dmg = 3 + Math.floor(lvl / 2);
        c.stats.hp = Math.max(0, c.stats.hp - dmg);
        return { kind: 'status_tick', data: { target: c, icon: '🧪', amount: dmg, name: 'poison' } };
      },
    },
    freeze: {
      icon: '🧊', name: 'Frozen',
      defaultTurns: 2,
      skipsTurn: true,
      onTurnStart: (c, inst) => {
        // 50% chance to thaw each turn (consume instance early)
        if (Math.random() < 0.5) {
          inst._thaw = true;
          return { kind: 'status_fade', data: { target: c, icon: '🧊', name: 'freeze' } };
        }
        return null;
      },
    },
    stun: {
      icon: '💫', name: 'Stunned',
      defaultTurns: 1,
      skipsTurn: true,
    },
    sleep: {
      icon: '😴', name: 'Asleep',
      defaultTurns: 3,
      skipsTurn: true,
      onHitTaken: (c, inst) => {
        // Any damage wakes them up
        inst._wake = true;
        return { kind: 'status_fade', data: { target: c, icon: '😴', name: 'sleep' } };
      },
    },
    dizzy: {
      icon: '🌀', name: 'Dizzy',
      defaultTurns: 2,
      // 50% chance to hit self — handled by combat.js consulting isDizzy()
    },
    shield: {
      icon: '🛡️', name: 'Shielded',
      defaultTurns: 2,
      // halves incoming damage — handled by modifyIncoming
    },
    pumped: {
      icon: '💪', name: 'Pumped',
      defaultTurns: 2,
      // +50% outgoing damage — handled by modifyOutgoing
    },
    quick: {
      icon: '💨', name: 'Quick',
      defaultTurns: 2,
      // +50% spd — handled by modifySpeed
    },
    cursed: {
      icon: '👻', name: 'Cursed',
      defaultTurns: 3,
      // healing blocked — handled by blocksHealing()
    },
    blinded: {
      icon: '🥧', name: 'Blinded',
      defaultTurns: 2,
      // -50% accuracy — checked in combat.computeDamage via accuracyMultiplier
    },
  };

  function apply(combatant, id, opts = {}) {
    const def = DEFS[id];
    if (!def || !combatant) return null;
    combatant.statuses = combatant.statuses || [];
    // Refresh duration if already present (don't stack multiple of same type)
    const existing = combatant.statuses.find(s => s.id === id);
    const turns = opts.turns != null ? opts.turns : def.defaultTurns;
    if (existing) {
      existing.turns = Math.max(existing.turns, turns);
      return { kind: 'status_refresh', data: { target: combatant, icon: def.icon, name: id, turns } };
    }
    const inst = { id, icon: def.icon, name: def.name, turns, source: opts.source || null };
    combatant.statuses.push(inst);
    return { kind: 'status_apply', data: { target: combatant, icon: def.icon, name: id, turns } };
  }

  // Run hook for a specific timing. Returns array of log entries.
  // `when` is one of 'turn_start', 'turn_end', 'on_hit_dealt', 'on_hit_taken'.
  function tick(battle, combatant, when) {
    if (!combatant || !combatant.statuses || !combatant.statuses.length) return [];
    const lvl = (KJ.State && KJ.State.get) ? KJ.State.get().player.level : 1;
    const logs = [];
    for (const inst of combatant.statuses.slice()) {
      const def = DEFS[inst.id];
      if (!def) continue;
      const hook = {
        turn_start:  def.onTurnStart,
        turn_end:    def.onTurnEnd,
        on_hit_dealt: def.onHitDealt,
        on_hit_taken: def.onHitTaken,
      }[when];
      if (hook) {
        const entry = hook(combatant, inst, lvl);
        if (entry) logs.push(entry);
      }
    }
    // Decrement at turn_end; remove expired / flagged-early-fade
    if (when === 'turn_end') {
      for (const inst of combatant.statuses.slice()) {
        inst.turns--;
        if (inst.turns <= 0 || inst._thaw || inst._wake) {
          combatant.statuses = combatant.statuses.filter(s => s !== inst);
          const def = DEFS[inst.id];
          if (def) logs.push({ kind: 'status_fade', data: { target: combatant, icon: def.icon, name: inst.id } });
        }
      }
    }
    return logs;
  }

  function has(combatant, id) {
    return !!(combatant && combatant.statuses && combatant.statuses.find(s => s.id === id));
  }

  function shouldSkipTurn(combatant) {
    if (!combatant || !combatant.statuses) return false;
    return combatant.statuses.some(s => DEFS[s.id] && DEFS[s.id].skipsTurn);
  }

  function isDizzy(combatant) { return has(combatant, 'dizzy'); }

  function modifyIncoming(combatant, amount) {
    if (has(combatant, 'shield')) return Math.max(1, Math.round(amount * 0.5));
    return amount;
  }

  function modifyOutgoing(combatant, amount) {
    if (has(combatant, 'pumped')) return Math.round(amount * 1.5);
    return amount;
  }

  function modifySpeed(combatant, baseSpd) {
    if (has(combatant, 'quick')) return Math.round(baseSpd * 1.5);
    return baseSpd;
  }

  function accuracyMultiplier(combatant) {
    if (has(combatant, 'blinded')) return 0.5;
    return 1;
  }

  function blocksHealing(combatant) {
    return has(combatant, 'cursed');
  }

  function iconSummary(combatant) {
    if (!combatant || !combatant.statuses || !combatant.statuses.length) return '';
    return combatant.statuses.map(s => {
      const def = DEFS[s.id]; if (!def) return '';
      return `<span class="kj-status-pip" title="${def.name} (${s.turns})">${def.icon}<sub>${s.turns}</sub></span>`;
    }).join('');
  }

  return {
    DEFS, apply, tick, has,
    shouldSkipTurn, isDizzy,
    modifyIncoming, modifyOutgoing, modifySpeed,
    accuracyMultiplier, blocksHealing, iconSummary,
  };
})();
