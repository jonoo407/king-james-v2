// King James 2 — State + Save/Load/Migrate
// Single source of truth, persisted to localStorage.
// Shape is versioned; old saves migrate on load.

window.KJ = window.KJ || {};

KJ.State = (function () {

  function freshState() {
    return {
      version: KJ.SAVE_VERSION,
      player: {
        name: 'James',
        level: 1,
        xp: 0,
        baseStats: { hp: 20, atk: 5, def: 3, spd: 4 },
        hp: 20,
        sparks: 3, // ✨ — elemental/magic fuel; capped at KJ.maxSparksForLevel()
        equipped: {
          weapon: 'wooden_sword',
          armor: 'cloth_vest',
          trinket: 'plain_stone',
          boots: 'old_boots',
        },
        traits: [],
        pendingStatPoints: 0,
        pendingTraitPicks: 0,
        royalRank: 'peasant_kid',
      },
      inventory: {
        gear: ['wooden_sword', 'cloth_vest', 'plain_stone', 'old_boots'],
        enhancedGear: [], // gear ids that have been upgraded at the Armory (+2 to primary stat)
        charms: 1,        // one starting charm
        gold: 10,         // enough to afford one small-cost option on first quest
        consumables: {},  // id -> count
      },
      roster: {
        allies: {},   // id -> { level, xp, moves, hp, pendingMoveChoice? }
        party: [],    // up to MAX_ALLIES_PER_QUEST ally ids
        missed: [],   // met-but-missed ally ids (for Dame Pompadour)
      },
      progress: {
        treasures: [],                                    // treasure ids owned
        questsCompleted: [],                              // quest ids beaten
        questsInProgress: {},                             // id -> {sceneId, flags}
        trophies: [],                                     // boss ids defeated
        badges: [],                                       // badge ids earned
        castleRooms: KJ.DEFAULT_CASTLE_ROOMS.slice(),
        crownCoherence: 0,                                // 0..5, # treasures back
        flags: {},                                        // free-form scene flags
      },
      settings: {
        soundOn: true,
        textSpeed: 'normal',
        debug: true,             // master debug toggle — shows 🐞 HUD button + unlocks cheat menu
        showExactDmg: false,     // false = fuzzy tiers (KAPOW/bonk/tap/tickle); true = ~N dmg
      },
      meta: {
        firstPlayedAt: Date.now(),
        lastSavedAt: null,
      },
    };
  }

  // Save-schema migrations. Add one per version bump.
  const MIGRATIONS = {
    // 2: (data) => ({ ...data, version: 2, player: { ...data.player, luck: 0 } }),
  };

  function migrate(data) {
    while (data.version < KJ.SAVE_VERSION) {
      const next = MIGRATIONS[data.version + 1];
      if (!next) throw new Error('Missing migration from v' + data.version);
      data = next(data);
    }
    return data;
  }

  // in-memory state
  let current = freshState();

  function get() { return current; }

  function reset() {
    current = freshState();
    save();
    return current;
  }

  function replace(newState) {
    current = newState;
    save();
  }

  let saveTimer = null;
  function saveDebounced() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 250);
  }

  function save() {
    try {
      current.meta.lastSavedAt = Date.now();
      localStorage.setItem(KJ.SAVE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('[state] save failed', e);
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KJ.SAVE_KEY);
      if (!raw) return { loaded: false, reason: 'no_save' };
      let data = JSON.parse(raw);
      if (data.version > KJ.SAVE_VERSION) {
        // Save is from a NEWER build — schema may be incompatible. Don't
        // wipe the user's save silently; bail and let them know via console
        // so they can choose to upgrade or hard-reset.
        console.warn('[state] save version', data.version, '> current', KJ.SAVE_VERSION,
                     '— possible newer build. Starting fresh in memory but NOT overwriting save.');
        return { loaded: false, reason: 'future_version', saved_version: data.version };
      }
      if (data.version !== KJ.SAVE_VERSION) data = migrate(data);
      current = data;
      // Self-heal royalRank against the current level (handles old saves
      // where the rank system didn't update automatically).
      if (KJ.rankForLevel) {
        current.player.royalRank = KJ.rankForLevel(current.player.level).id;
      }
      // Self-heal: older saves might not have enhancedGear
      if (!Array.isArray(current.inventory.enhancedGear)) {
        current.inventory.enhancedGear = [];
      }
      // Self-heal: sparks field
      if (typeof current.player.sparks !== 'number') {
        const max = KJ.maxSparksForLevel ? KJ.maxSparksForLevel(current.player.level) : 3;
        current.player.sparks = max;
      }
      return { loaded: true };
    } catch (e) {
      console.error('[state] load failed — starting fresh', e);
      current = freshState();
      return { loaded: false, reason: 'error', error: e };
    }
  }

  function wipe() {
    try { localStorage.removeItem(KJ.SAVE_KEY); } catch (e) {}
    current = freshState();
  }

  // Auto-save wiring
  function installAutoSave() {
    [
      'scene_entered',
      'battle_won',
      'ally_recruited',
      'gear_equipped',
      'quest_completed',
      'level_up',
      'trait_picked',
      'treasure_found',
      'gold_changed',
      'settings_changed',
      'party_knocked_out',
      'badge_unlocked',
    ].forEach(e => KJ.Events.on(e, saveDebounced));
    // Keep royalRank in sync with level.
    KJ.Events.on('level_up', () => {
      const s = current;
      if (KJ.rankForLevel) s.player.royalRank = KJ.rankForLevel(s.player.level).id;
    });
  }

  return {
    get, reset, replace, save, load, wipe,
    installAutoSave, freshState,
  };
})();
