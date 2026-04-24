// King James 2 — Scene Dispatcher + Effect Engine
// Routes a scene data object to the right renderer (by scene.type).
// Also applies declarative `effects` arrays on transitions.

window.KJ = window.KJ || {};

KJ.Scene = (function () {

  let currentScene = null;

  // Find scene data across all registered quests + special scenes (castle etc.)
  function findScene(id) {
    if (!id) return null;
    if (id === 'castle') return { id: 'castle', type: '_castle' };

    for (const quest of KJ.Registry.quests.all()) {
      const found = (quest.scenes || []).find(s => s.id === id);
      if (found) return { ...found, _questId: quest.id };
    }
    return null;
  }

  // Enter a scene by id.
  function goto(id) {
    const scene = findScene(id);
    if (!scene) {
      renderMissing(id);
      return;
    }
    currentScene = scene;

    // Special: castle screen handled by its own UI
    if (scene.type === '_castle') {
      KJ.UI.Castle.render();
      KJ.Events.emit('scene_entered', { scene });
      return;
    }

    // Save progress pointer if this is a quest scene
    if (scene._questId) {
      const state = KJ.State.get();
      state.progress.questsInProgress[scene._questId] =
        state.progress.questsInProgress[scene._questId] || { sceneId: scene.id, flags: {} };
      state.progress.questsInProgress[scene._questId].sceneId = scene.id;
    }

    // Dispatch via sceneType registry
    const renderer = KJ.Registry.sceneTypes.get(scene.type);
    if (!renderer) {
      renderMissing(scene.id, 'no renderer for type: ' + scene.type);
      return;
    }
    const ctx = {
      scene,
      state: KJ.State.get(),
      goto,
      applyEffects,
    };
    renderer.render(scene, ctx);
    KJ.Events.emit('scene_entered', { scene });
  }

  function current() { return currentScene; }

  // Declarative effect dispatcher. Extend the effect table to support new effects.
  const EFFECTS = {
    damage_party(params) {
      const state = KJ.State.get();
      state.player.hp = Math.max(1, state.player.hp - (params.amount || 0));
      KJ.Effects.shakeScreen(300);
    },
    heal_party(params) {
      const state = KJ.State.get();
      state.player.hp = Math.min(totalMaxHP(), state.player.hp + (params.amount || 0));
    },
    grant_gear(params) {
      const state = KJ.State.get();
      if (!state.inventory.gear.includes(params.id)) state.inventory.gear.push(params.id);
      KJ.Effects.toast('Got: ' + (KJ.Registry.gear.get(params.id)?.name || params.id), { icon: '🎁' });
    },
    grant_gold(params) {
      KJ.State.get().inventory.gold += (params.amount || 0);
      KJ.Events.emit('gold_changed', { delta: params.amount });
    },
    grant_charms(params) {
      KJ.State.get().inventory.charms += (params.amount || 1);
    },
    consume_charm(params) {
      const st = KJ.State.get();
      st.inventory.charms = Math.max(0, st.inventory.charms - (params.amount || 1));
    },
    grant_scroll(params) {
      const st = KJ.State.get();
      st.inventory.consumables[params.id] = (st.inventory.consumables[params.id] || 0) + (params.amount || 1);
    },
    recruit_ally(params) {
      const ally = KJ.Registry.allies.get(params.id);
      if (!ally) return;
      const state = KJ.State.get();
      if (state.roster.allies[params.id]) return;
      state.roster.allies[params.id] = {
        level: 1, xp: 0,
        moves: defaultMovesForAlly(ally),
        hp: ally.baseStats.hp,
      };
      // Clear from missed-list so Dame Pompadour doesn't offer to re-hire someone we already have
      const mi = state.roster.missed.indexOf(params.id);
      if (mi !== -1) state.roster.missed.splice(mi, 1);
      // Auto-join current quest party if there's room (so the new friend fights alongside James right away)
      let joinedParty = false;
      if (state.roster.party.length < KJ.MAX_ALLIES_PER_QUEST
          && !state.roster.party.includes(params.id)) {
        state.roster.party.push(params.id);
        joinedParty = true;
      }
      KJ.Events.emit('ally_recruited', { ally });
      if (joinedParty) {
        KJ.Effects.toast(ally.name + ' joined the party!', { icon: ally.emoji });
      } else {
        KJ.Effects.toast('New friend: ' + ally.name + ' (waiting at castle — party full)', { icon: ally.emoji });
      }
    },
    mark_met_ally(params) {
      const state = KJ.State.get();
      if (!state.roster.missed.includes(params.id) && !state.roster.allies[params.id]) {
        state.roster.missed.push(params.id);
      }
    },
    grant_treasure(params) {
      const state = KJ.State.get();
      if (state.progress.treasures.includes(params.id)) return; // idempotent
      state.progress.treasures.push(params.id);
      state.progress.crownCoherence = state.progress.treasures.length;
      const t = KJ.Registry.treasures.get(params.id);
      if (t) {
        if (t.unlocksRoom && !state.progress.castleRooms.includes(t.unlocksRoom)) {
          state.progress.castleRooms.push(t.unlocksRoom);
        }
        // Apply James bonuses (permanent stat bumps + move is available via treasureMoves())
        const jb = t.jamesBonus;
        if (jb) {
          if (jb.hp)  { state.player.baseStats.hp  += jb.hp;  state.player.hp += jb.hp; }
          if (jb.atk) { state.player.baseStats.atk += jb.atk; }
          if (jb.def) { state.player.baseStats.def += jb.def; }
          if (jb.spd) { state.player.baseStats.spd += jb.spd; }
          // jb.addMove is read at battle time via treasureMoves()
        }
      }
      KJ.Events.emit('treasure_found', { treasure: t });
      KJ.Effects.confetti(50);
      KJ.Effects.bigText((t && t.name) || 'TREASURE!');
    },
    unlock_room(params) {
      const state = KJ.State.get();
      if (!state.progress.castleRooms.includes(params.id)) {
        state.progress.castleRooms.push(params.id);
      }
    },
    grant_trophy(params) {
      const state = KJ.State.get();
      if (!state.progress.trophies.includes(params.id)) {
        state.progress.trophies.push(params.id);
      }
    },
    set_flag(params) {
      const state = KJ.State.get();
      state.progress.flags[params.key] = params.value;
    },
    complete_quest(params) {
      const state = KJ.State.get();
      if (!state.progress.questsCompleted.includes(params.id)) {
        state.progress.questsCompleted.push(params.id);
      }
      delete state.progress.questsInProgress[params.id];
      KJ.Events.emit('quest_completed', { questId: params.id });
    },
  };

  function applyEffects(effects) {
    if (!effects || !effects.length) return;
    for (const ef of effects) {
      const fn = EFFECTS[ef.type];
      if (fn) fn(ef);
      else console.warn('[scene] unknown effect type:', ef.type);
    }
  }

  // Condition dispatcher for scene choice visibility
  const CONDITIONS = {
    has_gear: (p) => KJ.State.get().inventory.gear.includes(p.id),
    ally_in_party: (p) => KJ.State.get().roster.party.includes(p.id),
    ally_recruited: (p) => !!KJ.State.get().roster.allies[p.id],
    treasure_owned: (p) => KJ.State.get().progress.treasures.includes(p.id),
    flag_set: (p) => KJ.State.get().progress.flags[p.key] === p.value,
    flag_not_set: (p) => KJ.State.get().progress.flags[p.key] !== true,
    level_at_least: (p) => KJ.State.get().player.level >= p.level,
    gold_at_least: (p) => KJ.State.get().inventory.gold >= p.amount,
    charms_at_least: (p) => KJ.State.get().inventory.charms >= p.amount,
  };

  function checkCondition(cond) {
    if (!cond) return true;
    const fn = CONDITIONS[cond.type];
    return fn ? !!fn(cond) : false;
  }

  // Helpers
  function totalMaxHP() {
    const state = KJ.State.get();
    const gear = equippedGear();
    return state.player.baseStats.hp + (gear.stats.hp || 0);
  }

  function equippedGear() {
    const state = KJ.State.get();
    const totals = { hp: 0, atk: 0, def: 0, spd: 0 };
    const moves = [];
    const enhanced = state.inventory.enhancedGear || [];
    for (const slot of KJ.GEAR_SLOTS) {
      const id = state.player.equipped[slot];
      if (!id) continue;
      const g = KJ.Registry.gear.get(id);
      if (!g) continue;
      for (const s of KJ.STATS) if (g.stats[s]) totals[s] += g.stats[s];
      // Armory enhancement: +2 to the piece's primary stat
      if (enhanced.includes(id)) {
        const prim = primaryStatForSlot(g.slot);
        totals[prim] += 2;
      }
      if (g.move) moves.push(g.move);
    }
    return { stats: totals, moves };
  }

  function primaryStatForSlot(slot) {
    return ({ weapon: 'atk', armor: 'def', trinket: 'hp', boots: 'spd' })[slot] || 'atk';
  }

  // Moves granted by collected treasures (permanent bonus moves on top of gear).
  function treasureMoves() {
    const state = KJ.State.get();
    const out = [];
    for (const tid of state.progress.treasures) {
      const t = KJ.Registry.treasures.get(tid);
      if (t && t.jamesBonus && t.jamesBonus.addMove) out.push(t.jamesBonus.addMove);
    }
    return out;
  }

  function defaultMovesForAlly(ally) {
    const learned = (ally.learnset || [])
      .filter(e => e.level <= 1 && e.move)
      .map(e => e.move);
    return learned.slice(0, 4);
  }

  function renderMissing(id, reason) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="kj-error">
        <h2>⚠️ Missing scene</h2>
        <p>Scene id: <code>${id}</code></p>
        ${reason ? `<p>${reason}</p>` : ''}
        <button class="kj-btn" onclick="KJ.UI.Castle.render()">⬅️ Back to castle</button>
      </div>
    `;
  }

  return {
    goto, current, applyEffects, checkCondition,
    totalMaxHP, equippedGear, treasureMoves, defaultMovesForAlly, primaryStatForSlot,
  };
})();
