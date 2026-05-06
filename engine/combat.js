// King James 2 — Combat Engine (pure logic; no DOM)
// Turn-based Pokémon-like battle state machine.
// The battle UI (engine/ui/battle.js) reads/writes via these APIs.
//
// A `Combatant` is a normalized battler object:
//   { side: 'player'|'enemy', id, name, emoji, type,
//     stats: {hp,atk,def,spd}, maxHP, moves:[moveId], behavior?, statuses:[] }

window.KJ = window.KJ || {};

KJ.Combat = (function () {

  // ---------- TYPE MATCHUP ----------
  // Returns multiplier when attackType hits defenderType.
  function typeMultiplier(attackType, defenderType) {
    const t = KJ.Types; // from data/types.js
    if (!t || !attackType || !defenderType) return 1;
    return t.effectiveness(attackType, defenderType);
  }

  // ---------- DAMAGE ----------
  function computeDamage(attacker, move, defender) {
    const atk = attacker.stats.atk;
    const def = defender.stats.def;
    const power = move.power || 0;
    const typeMult = typeMultiplier(move.type, defender.type);
    // Eagle Eye trait — +5% crit for player team
    let critChance = KJ.TUNABLES.critChance;
    if (attacker.side === 'player' && KJ.Traits && KJ.Traits.has('eagle_eye')) critChance += 0.05;
    const crit = Math.random() < critChance;
    const critMult = crit ? KJ.TUNABLES.critMult : 1;
    let base = Math.max(1, Math.round((atk + power - def * 0.5) * typeMult * critMult));
    // Pumped status: +50% outgoing
    if (KJ.Statuses) base = KJ.Statuses.modifyOutgoing(attacker, base);
    // Shield status: -50% incoming
    if (KJ.Statuses) base = KJ.Statuses.modifyIncoming(defender, base);
    const dmg = Math.max(KJ.TUNABLES.minDamage, base);
    // Accuracy: base * blinded multiplier. Lucky Charm (defender=player) adds 5% miss.
    let accuracy = (move.accuracy == null ? 1 : move.accuracy);
    if (KJ.Statuses) accuracy *= KJ.Statuses.accuracyMultiplier(attacker);
    if (defender.side === 'player' && KJ.Traits && KJ.Traits.has('lucky_streak')) accuracy *= 0.92;
    // Slow & Steady: first player action each battle guaranteed not to miss
    if (attacker.side === 'player' && attacker._slowSteadyUsed === false
        && KJ.Traits && KJ.Traits.has('slow_steady')) {
      accuracy = 1;
      attacker._slowSteadyUsed = true;
    }
    return {
      amount: dmg,
      crit,
      typeMult,
      super: typeMult >= 2,
      weak: typeMult > 0 && typeMult < 1,
      miss: Math.random() > accuracy,
    };
  }

  // Deterministic preview (no crit/miss randomness) — for UI button labels.
  function previewDamage(attacker, move, defender) {
    const atk = attacker.stats.atk;
    const def = defender.stats.def;
    const power = move.power || 0;
    const typeMult = typeMultiplier(move.type, defender.type);
    const base = Math.max(1, Math.round((atk + power - def * 0.5) * typeMult));
    return {
      amount: base,
      typeMult,
      super: typeMult >= 2,
      weak: typeMult > 0 && typeMult < 1,
    };
  }

  // Returns which attacking types are super-effective against this defender type.
  function findWeakness(defenderType) {
    if (!KJ.Types) return [];
    return KJ.TYPES.filter(a => KJ.Types.effectiveness(a, defenderType) >= 2);
  }

  // ---------- BATTLE CREATION ----------
  // Optional `phases`: an array of enemy-team arrays. When phase N's enemies
  // are all defeated AND there's a phase N+1, the battle stays IN_PROGRESS
  // and enemyTeam is replaced with the next phase. Battle ends VICTORY only
  // when the last phase is cleared. If `phases` isn't passed, behavior is
  // identical to the original single-clear semantics.
  function makeBattle({ playerTeam, enemyTeam, phases, rewards, onComplete }) {
    const battle = {
      state: 'IN_PROGRESS',
      turn: 0,
      log: [],
      playerTeam: playerTeam.map(c => ({ ...c })),
      enemyTeam: enemyTeam.map(c => ({ ...c })),
      phases: Array.isArray(phases) ? phases.map(p => p.map(e => ({ ...e }))) : null,
      currentPhase: 0,
      rewards: rewards || { gold: [0,0], xp: 0, drops: [] },
      pendingTelegraph: null, // string the UI should show before enemy turn
      onComplete,
    };
    log(battle, 'battle_start');
    return battle;
  }

  // Promote the next phase into enemyTeam. Returns true if advanced, false if
  // there's no next phase (caller should set VICTORY).
  function advancePhase(battle) {
    if (!battle.phases || battle.currentPhase >= battle.phases.length - 1) return false;
    battle.currentPhase++;
    battle.enemyTeam = battle.phases[battle.currentPhase].map(e => ({ ...e }));
    log(battle, 'phase_advance', { phase: battle.currentPhase });
    return true;
  }

  function log(battle, kind, data) {
    battle.log.push({ kind, data, t: Date.now() });
  }

  // ---------- TURN ORDER ----------
  function turnOrder(battle) {
    const all = [...battle.playerTeam, ...battle.enemyTeam].filter(c => c.stats.hp > 0);
    return all.slice().sort((a, b) => b.stats.spd - a.stats.spd);
  }

  // ---------- APPLY ACTION ----------
  function applyAction(battle, action) {
    // action: { actorId, moveId, targetId }
    const actor = allCombatants(battle).find(c => c.id === action.actorId);
    if (!actor || actor.stats.hp <= 0) return battle;
    const move = KJ.Registry.moves.get(action.moveId);
    if (!move) return battle;

    // Self-target moves override targetId
    let target;
    if (move.target === 'self') {
      target = actor;
    } else {
      target = allCombatants(battle).find(c => c.id === action.targetId);
      // If chosen target is already KO'd, retarget to first alive on the
      // same side so we don't log "James hit a corpse for 8".
      if (target && target.stats.hp <= 0) {
        const sameSide = allCombatants(battle).filter(c => c.side === target.side && c.stats.hp > 0);
        target = sameSide[0] || null;
      }
    }
    if (!target) return battle;

    // Dizzy: 50% chance to hit self instead of intended target
    if (KJ.Statuses && KJ.Statuses.isDizzy(actor) && target !== actor && Math.random() < 0.5) {
      target = actor;
      log(battle, 'dizzy_misfire', { actor });
    }

    // Heal moves: restore HP (blocked if target is cursed)
    if (move.heal) {
      if (KJ.Statuses && KJ.Statuses.blocksHealing(target)) {
        log(battle, 'heal_blocked', { target });
      } else {
        const before = target.stats.hp;
        target.stats.hp = Math.min(target.maxHP, target.stats.hp + move.heal);
        const delta = target.stats.hp - before;
        log(battle, 'action', { actor, move, target, result: { heal: delta, amount: 0 } });
      }
      // Self-apply status on guard moves (shield)
      if (move.statusOnSelf && KJ.Statuses) {
        const entry = KJ.Statuses.apply(actor, move.statusOnSelf.id, { turns: move.statusOnSelf.turns, source: actor });
        if (entry) battle.log.push(entry);
      }
    } else {
      const result = computeDamage(actor, move, target);
      if (!result.miss) {
        target.stats.hp = Math.max(0, target.stats.hp - result.amount);
        // Second Wind trait — revive James once per battle
        // 20% of max HP (min 10) so one revival gives a real turn, not a pity-tap.
        // Stays above 25% so it doesn't auto-cascade into Scaredy-Cat.
        if (target.id === 'james' && target.stats.hp <= 0
            && target._secondWindUsed !== true
            && KJ.Traits && KJ.Traits.has('second_wind')) {
          target.stats.hp = Math.max(10, Math.floor(target.maxHP * 0.20));
          target._secondWindUsed = true;
          battle.log.push({ kind: 'trait_proc', data: { name: 'Second Wind!', actor: target } });
        }
        // Wake sleepers when hit
        if (KJ.Statuses) {
          (KJ.Statuses.tick(battle, target, 'on_hit_taken') || []).forEach(e => battle.log.push(e));
        }
        // Apply status on hit (type-tagged, e.g. burn from fire moves)
        if (move.statusOnHit && KJ.Statuses) {
          if (Math.random() < (move.statusOnHit.chance || 1)) {
            const entry = KJ.Statuses.apply(target, move.statusOnHit.id, {
              turns: move.statusOnHit.turns, source: actor,
            });
            if (entry) battle.log.push(entry);
          }
        }
        // Crit-only status (e.g. earth moves stun on crit)
        if (result.crit && move.statusOnCrit && KJ.Statuses) {
          const entry = KJ.Statuses.apply(target, move.statusOnCrit.id, {
            turns: move.statusOnCrit.turns, source: actor,
          });
          if (entry) battle.log.push(entry);
        }
      }
      log(battle, 'action', { actor, move, target, result });
    }

    // Check end conditions
    if (allDown(battle.enemyTeam)) {
      // Multi-phase: advance to next phase instead of ending if more remain.
      if (advancePhase(battle)) {
        // Stay IN_PROGRESS; enemyTeam now holds the next phase's enemies.
      } else {
        battle.state = 'VICTORY';
        log(battle, 'victory');
      }
    } else if (allDown(battle.playerTeam)) {
      battle.state = 'DEFEAT';
      log(battle, 'defeat');
    }
    return battle;
  }

  function allCombatants(battle) {
    return [...battle.playerTeam, ...battle.enemyTeam];
  }
  function allDown(team) {
    return team.every(c => c.stats.hp <= 0);
  }

  // ---------- ENEMY AI ----------
  function chooseEnemyAction(battle, enemy) {
    // default: cycle through its move list
    const moves = enemy.moves || [];
    if (!moves.length) return null;
    enemy._moveCursor = (enemy._moveCursor || 0);
    const moveId = moves[enemy._moveCursor % moves.length];
    enemy._moveCursor++;
    // pick alive player as target
    const targets = battle.playerTeam.filter(c => c.stats.hp > 0);
    const target = targets[Math.floor(Math.random() * targets.length)];
    if (!target) return null;
    return { actorId: enemy.id, moveId, targetId: target.id };
  }

  // Generate a telegraph hint for the NEXT enemy action
  function enemyTelegraph(battle, enemy) {
    const action = peekNextEnemyAction(battle, enemy);
    if (!action) return null;
    const move = KJ.Registry.moves.get(action.moveId);
    return move ? `${enemy.emoji} ${enemy.name} is charging ${move.name}!` : null;
  }

  function peekNextEnemyAction(battle, enemy) {
    const moves = enemy.moves || [];
    if (!moves.length) return null;
    const idx = (enemy._moveCursor || 0) % moves.length;
    return { actorId: enemy.id, moveId: moves[idx] };
  }

  // ---------- NORMALIZATION ----------
  // Turn a party of James + ally instances into combatant objects.
  function buildPlayerTeam(state) {
    const eq = KJ.Scene.equippedGear();
    const tMoves = KJ.Scene.treasureMoves();
    // Trait-adjusted defensive stat (Thick Skin +10% DEF)
    const thickSkinMult = (KJ.Traits && KJ.Traits.has('thick_skin')) ? 1.10 : 1;
    const rascalSpd     = (KJ.Traits && KJ.Traits.has('rascal')) ? 1 : 0;
    const james = {
      side: 'player',
      id: 'james',
      name: 'James',
      emoji: '🧒',
      type: 'earth', // James has no innate type; default earth
      stats: {
        hp:  state.player.baseStats.hp  + (eq.stats.hp || 0),
        atk: state.player.baseStats.atk + (eq.stats.atk || 0),
        def: Math.round((state.player.baseStats.def + (eq.stats.def || 0)) * thickSkinMult),
        spd: state.player.baseStats.spd + (eq.stats.spd || 0) + rascalSpd,
      },
      maxHP: state.player.baseStats.hp + (eq.stats.hp || 0),
      moves: [...eq.moves.filter(Boolean), ...tMoves],
      statuses: [],
      _slowSteadyUsed: false,   // Slow & Steady — first action can't miss
      _deepPocketsUsed: false,  // Deep Pockets — first scroll doubles
      _scaredyCatUsed: false,   // Scaredy-Cat — one-shot proc per battle
    };
    const allies = (state.roster.party || []).map(id => allyToCombatant(id, state));
    return [james, ...allies].filter(Boolean);
  }

  function allyToCombatant(id, state) {
    const species = KJ.Registry.allies.get(id);
    const instance = state.roster.allies[id];
    if (!species || !instance) return null;
    return {
      side: 'player',
      id: id,
      name: species.name,
      emoji: species.emoji,
      type: species.type,
      stats: scaledStats(species.baseStats, instance.level),
      maxHP: scaledStats(species.baseStats, instance.level).hp,
      moves: instance.moves.slice(),
    };
  }

  function enemyToCombatant(id, index) {
    const def = KJ.Registry.enemies.get(id);
    if (!def) return null;
    const hpMult = (KJ.TUNABLES && KJ.TUNABLES.enemyHpMult) || 1;
    const hp = Math.round(def.stats.hp * hpMult);
    return {
      side: 'enemy',
      id: id + '_' + index,
      speciesId: id,
      name: def.name,
      emoji: def.emoji,
      type: def.type,
      stats: { ...def.stats, hp },
      maxHP: hp,
      moves: def.moves.slice(),
      behavior: def.behavior,
      rewards: def.rewards,
      quipLines: def.quipLines,
    };
  }

  function scaledStats(base, level) {
    // Simple linear scale; refine at tuning time
    const grow = level - 1;
    return {
      hp: base.hp + grow * 2,
      atk: base.atk + Math.floor(grow * 1.2),
      def: base.def + Math.floor(grow * 0.8),
      spd: base.spd + Math.floor(grow * 0.6),
    };
  }

  return {
    typeMultiplier, computeDamage, previewDamage, findWeakness,
    makeBattle, applyAction, advancePhase,
    turnOrder, chooseEnemyAction, enemyTelegraph,
    buildPlayerTeam, allyToCombatant, enemyToCombatant,
  };
})();
