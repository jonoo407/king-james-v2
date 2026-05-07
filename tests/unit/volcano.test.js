// Volcano arc — Phase 1 TDD foundations
// - KJ.Volcano.canListen(state) — Listen-path predicate (≥3 kindness flags)
// - Multi-phase battle transitions (phase N defeated → spawn phase N+1)
// - Star of Friendship grants the friends_beacon treasure move
// - 4 new badge predicates (true_king, listen_and_learn, forgiven, fully_forged)

const { test, expect, describe, summarize } = require('../lib/runner');
const { loadKJ, _ctx } = require('../lib/bootstrap');
const KJ = loadKJ();

function freshFlags(overrides = {}) {
  return {
    state: {
      progress: {
        flags: { ...overrides },
        treasures: [],
        questsCompleted: [],
        trophies: [],
        badges: [],
      },
      inventory: { gear: [], enhancedGear: [] },
      roster: { allies: {} },
    },
  };
}

// ───────────────────────────────────────────────────────────────────────
describe('KJ.Volcano.canListen — Listen-path predicate', () => {
  test('false with zero kindness flags', () => {
    const { state } = freshFlags();
    expect(KJ.Volcano.canListen(state)).toBe(false);
  });

  test('false with 2 kindness flags (need ≥3)', () => {
    const { state } = freshFlags({
      riddle_tree_no_hints: true,
      yeti_friend: true,
    });
    expect(KJ.Volcano.canListen(state)).toBe(false);
  });

  test('true with 3 kindness flags', () => {
    const { state } = freshFlags({
      riddle_tree_no_hints: true,
      yeti_friend: true,
      first_alliance: true,
    });
    expect(KJ.Volcano.canListen(state)).toBe(true);
  });

  test('beach kindness flag accepts serpent_friend', () => {
    const { state } = freshFlags({
      riddle_tree_no_hints: true,
      yeti_friend: true,
      serpent_friend: true,
    });
    expect(KJ.Volcano.canListen(state)).toBe(true);
  });

  test('beach kindness flag accepts knows_drifter_past (alternate route)', () => {
    const { state } = freshFlags({
      riddle_tree_no_hints: true,
      yeti_friend: true,
      knows_drifter_past: true,
    });
    expect(KJ.Volcano.canListen(state)).toBe(true);
  });

  test('beach flags do not double-count if both are set', () => {
    const { state } = freshFlags({
      yeti_friend: true,
      serpent_friend: true,
      knows_drifter_past: true, // would be 3 if double-counted, but only 2 unique flags
    });
    expect(KJ.Volcano.canListen(state)).toBe(false);
  });

  test('all 4 kindness flags → true', () => {
    const { state } = freshFlags({
      riddle_tree_no_hints: true,
      yeti_friend: true,
      serpent_friend: true,
      first_alliance: true,
    });
    expect(KJ.Volcano.canListen(state)).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────────
describe('Multi-phase battle transitions', () => {
  // Use existing enemies as fixtures.
  function makeMultiPhase() {
    const phaseA = [KJ.Combat.enemyToCombatant('goblin_scout', 0)].filter(Boolean);
    const phaseB = [KJ.Combat.enemyToCombatant('goblin_scout', 1)].filter(Boolean);
    return KJ.Combat.makeBattle({
      playerTeam: [{
        side: 'player', id: 'james', name: 'James', emoji: '🧒', type: 'earth',
        stats: { hp: 999, atk: 999, def: 0, spd: 5 }, maxHP: 999,
        moves: ['think_fast'], statuses: [],
      }],
      enemyTeam: phaseA,
      phases: [phaseA, phaseB],
      rewards: { gold: [0,0], xp: 0, drops: [] },
    });
  }

  test('battle exposes the phases array and currentPhase index', () => {
    const battle = makeMultiPhase();
    expect(Array.isArray(battle.phases)).toBe(true);
    expect(battle.phases.length).toBe(2);
    expect(battle.currentPhase).toBe(0);
  });

  test('defeating phase 1 advances to phase 2 (does NOT end the battle)', () => {
    const battle = makeMultiPhase();
    // Kill the lone phase-1 enemy with a one-shot.
    battle.enemyTeam.forEach(e => { e.stats.hp = 1; });
    KJ.Combat.applyAction(battle, {
      actorId: 'james', moveId: 'think_fast', targetId: battle.enemyTeam[0].id,
    });
    expect(battle.state).toBe('IN_PROGRESS');
    expect(battle.currentPhase).toBe(1);
    expect(battle.enemyTeam.length).toBeGreaterThan(0);
    expect(battle.enemyTeam.every(e => e.stats.hp > 0)).toBe(true);
  });

  test('defeating final phase ends in VICTORY', () => {
    const battle = makeMultiPhase();
    battle.enemyTeam.forEach(e => { e.stats.hp = 1; });
    KJ.Combat.applyAction(battle, {
      actorId: 'james', moveId: 'think_fast', targetId: battle.enemyTeam[0].id,
    });
    // Now in phase 2. Kill those enemies too.
    battle.enemyTeam.forEach(e => { e.stats.hp = 1; });
    KJ.Combat.applyAction(battle, {
      actorId: 'james', moveId: 'think_fast', targetId: battle.enemyTeam[0].id,
    });
    expect(battle.state).toBe('VICTORY');
    expect(battle.currentPhase).toBe(1); // last index
  });

  test('single-phase battle (no phases declared) still ends on first clear', () => {
    const enemy = KJ.Combat.enemyToCombatant('goblin_scout', 0);
    enemy.stats.hp = 1;
    const battle = KJ.Combat.makeBattle({
      playerTeam: [{
        side: 'player', id: 'james', name: 'James', emoji: '🧒', type: 'earth',
        stats: { hp: 999, atk: 999, def: 0, spd: 5 }, maxHP: 999,
        moves: ['think_fast'], statuses: [],
      }],
      enemyTeam: [enemy],
      rewards: { gold: [0,0], xp: 0, drops: [] },
    });
    KJ.Combat.applyAction(battle, {
      actorId: 'james', moveId: 'think_fast', targetId: enemy.id,
    });
    expect(battle.state).toBe('VICTORY');
  });
});

// ───────────────────────────────────────────────────────────────────────
describe('Star of Friendship → friends_beacon move', () => {
  test('the treasure entry declares addMove: friends_beacon', () => {
    const t = KJ.Registry.treasures.get('star_of_friendship');
    expect(t).toBeTruthy();
    expect(t.jamesBonus).toBeTruthy();
    expect(t.jamesBonus.addMove).toBe('friends_beacon');
  });

  test('granting the treasure surfaces friends_beacon via Scene.treasureMoves()', () => {
    const ls = _ctx().localStorage;
    const keys = [];
    for (let i = 0; i < ls.length; i++) keys.push(ls.key(i));
    keys.forEach(k => ls.removeItem(k));
    KJ.State.reset();

    KJ.Scene.applyEffects([{ type: 'grant_treasure', id: 'star_of_friendship' }]);
    const moves = KJ.Scene.treasureMoves();
    expect(moves).toContain('friends_beacon');
  });
});

// ───────────────────────────────────────────────────────────────────────
describe('Volcano badge predicates', () => {
  function badge(id) { return KJ.Registry.badges.get(id); }

  test('true_king fires when volcano quest is completed', () => {
    const t = badge('true_king');
    expect(t).toBeTruthy();
    const { state } = freshFlags();
    expect(t.predicate(state)).toBe(false);
    state.progress.questsCompleted.push('volcano');
    expect(t.predicate(state)).toBe(true);
  });

  test('listen_and_learn fires when volcano_listened flag is set', () => {
    const t = badge('listen_and_learn');
    expect(t).toBeTruthy();
    const { state } = freshFlags();
    expect(t.predicate(state)).toBe(false);
    state.progress.flags.volcano_listened = true;
    expect(t.predicate(state)).toBe(true);
  });

  test('forgiven fires when mornox_redeemed flag is set', () => {
    const t = badge('forgiven');
    expect(t).toBeTruthy();
    const { state } = freshFlags();
    expect(t.predicate(state)).toBe(false);
    state.progress.flags.mornox_redeemed = true;
    expect(t.predicate(state)).toBe(true);
  });

  test('fully_forged needs 5 treasures + ≥4 enhanced gear', () => {
    const t = badge('fully_forged');
    expect(t).toBeTruthy();
    const { state } = freshFlags();
    state.progress.treasures = ['gem_of_wisdom', 'blade_of_bravery', 'shield_of_kindness', 'fire_of_courage'];
    state.inventory.enhancedGear = ['wooden_sword', 'cloth_vest', 'plain_stone', 'old_boots'];
    expect(t.predicate(state)).toBe(false); // only 4 treasures
    state.progress.treasures.push('star_of_friendship');
    expect(t.predicate(state)).toBe(true); // 5 treasures + 4 enhanced
    state.inventory.enhancedGear = ['wooden_sword'];
    expect(t.predicate(state)).toBe(false); // only 1 enhanced
  });
});

// ───────────────────────────────────────────────────────────────────────
describe('grant_sparks scene effect', () => {
  test('refills sparks to the level-cap', () => {
    KJ.State.reset();
    KJ.State.get().player.level = 9;        // cap = min(10, 3 + 3) = 6
    KJ.State.get().player.sparks = 0;
    KJ.Scene.applyEffects([{ type: 'grant_sparks' }]);
    expect(KJ.State.get().player.sparks).toBe(6);
  });

  test('explicit amount adds without exceeding the cap', () => {
    KJ.State.reset();
    KJ.State.get().player.level = 9;
    KJ.State.get().player.sparks = 4;
    KJ.Scene.applyEffects([{ type: 'grant_sparks', amount: 5 }]);
    expect(KJ.State.get().player.sparks).toBe(6); // 4+5 capped at 6
  });
});

// ───────────────────────────────────────────────────────────────────────
describe('grant_xp scene effect', () => {
  test('adds xp without exceeding level threshold', () => {
    KJ.State.reset();
    KJ.State.get().player.level = 1;
    KJ.State.get().player.xp = 0;
    KJ.Scene.applyEffects([{ type: 'grant_xp', amount: 5 }]);
    expect(KJ.State.get().player.xp).toBe(5);
    expect(KJ.State.get().player.level).toBe(1);
  });

  test('cascades level-ups when threshold crossed', () => {
    KJ.State.reset();
    KJ.State.get().player.level = 1;
    KJ.State.get().player.xp = 0;
    KJ.Scene.applyEffects([{ type: 'grant_xp', amount: 10000 }]);
    expect(KJ.State.get().player.level).toBeGreaterThan(1);
    expect(KJ.State.get().player.pendingStatPoints).toBeGreaterThan(0);
  });
});

describe('volcano_can_listen condition', () => {
  test('false when flag count < 3', () => {
    KJ.State.reset();
    KJ.State.get().progress.flags = { yeti_friend: true };
    expect(KJ.Scene.checkCondition({ type: 'volcano_can_listen' })).toBe(false);
  });
  test('true when flag count ≥ 3', () => {
    KJ.State.reset();
    KJ.State.get().progress.flags = {
      riddle_tree_no_hints: true,
      yeti_friend: true,
      first_alliance: true,
    };
    expect(KJ.Scene.checkCondition({ type: 'volcano_can_listen' })).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────────
describe('Ending scene wiring (data-shape only — DOM behavior tested in browser preview)', () => {
  function getScene(id) {
    return KJ.Registry.quests.get('volcano').scenes.find(s => s.id === id);
  }

  test('volcano_end scene type is "ending"', () => {
    expect(getScene('volcano_end').type).toBe('ending');
  });

  test('volcano_end has video pointing at images/volcano_end.mp4', () => {
    expect(getScene('volcano_end').video).toBe('images/volcano_end.mp4');
  });

  test('volcano_end shows badges + trophies in summary', () => {
    const s = getScene('volcano_end');
    expect(s.showBadges).toBe(true);
    expect(s.showTrophies).toBe(true);
  });

  test('volcano_end has the locked 5-beat Crown sign-off', () => {
    const beats = getScene('volcano_end').beats;
    expect(beats.length).toBe(5);
    expect(beats.every(b => b.speaker === 'crown')).toBe(true);
  });

  test('volcano_mornox_break exists with the locked "I\'M TIRED!" trio', () => {
    const s = getScene('volcano_mornox_break');
    expect(s).toBeTruthy();
    const mornoxLines = s.beats.filter(b => b.speaker === 'mornox').map(b => b.text);
    expect(mornoxLines).toContain('I\'M TIRED!');
    expect(mornoxLines).toContain('FOUR HUNDRED YEARS!');
  });
});

// ───────────────────────────────────────────────────────────────────────
describe('Trophy IDs (artifact convention — agent-flagged in round 2)', () => {
  test('Fight ending grants mornox_dust trophy', () => {
    const scene = KJ.Registry.quests.get('volcano').scenes
      .find(s => s.id === 'volcano_mornox_defeat');
    const trophyEffect = scene.effects.find(e => e.type === 'grant_trophy');
    expect(trophyEffect).toBeTruthy();
    expect(trophyEffect.id).toBe('mornox_dust');
  });

  test('Listen ending grants mornox_kettle trophy', () => {
    const scene = KJ.Registry.quests.get('volcano').scenes
      .find(s => s.id === 'volcano_redemption_ritual');
    const trophyEffect = scene.effects.find(e => e.type === 'grant_trophy');
    expect(trophyEffect).toBeTruthy();
    expect(trophyEffect.id).toBe('mornox_kettle');
  });
});

// ───────────────────────────────────────────────────────────────────────
describe('Caption-cap rule (DESIGN_LESSONS — ≤8 words per beat in volcano)', () => {
  test('every dialogue beat in the volcano arc is ≤8 words', () => {
    const violations = [];
    for (const scene of KJ.Registry.quests.get('volcano').scenes) {
      if (!scene.beats) continue;
      scene.beats.forEach((b, i) => {
        if (!b.text) return;
        // Count words (whitespace-separated, after collapsing punctuation-runs)
        const words = b.text.trim().split(/\s+/).length;
        if (words > 8) violations.push(`${scene.id} beat ${i} (${words}w): "${b.text}"`);
      });
    }
    if (violations.length) {
      throw new Error('Caption-cap violations:\n  ' + violations.join('\n  '));
    }
    expect(violations.length).toBe(0);
  });
});

if (require.main === module) summarize();
