// King James 2 — Constants
// Version numbers, type lists, slot lists, tunables.
// No logic here; pure values the engine + data refer to.

window.KJ = window.KJ || {};

KJ.SAVE_KEY = 'king_james_2_save';
KJ.SAVE_VERSION = 1;

// 5 elemental types (see data/types.js for matchup chart)
KJ.TYPES = ['fire', 'water', 'earth', 'wind', 'magic'];

// 4 gear slots (each grants stats + 1 move)
KJ.GEAR_SLOTS = ['weapon', 'armor', 'trinket', 'boots'];

// 4 combatant stats
KJ.STATS = ['hp', 'atk', 'def', 'spd'];

// Royal Rank progression (gates harder quests later)
KJ.ROYAL_RANKS = [
  'peasant_kid',
  'squire',
  'knight',
  'prince',
  'king',
];

// Castle rooms unlocked on day 1 (before any treasure)
KJ.DEFAULT_CASTLE_ROOMS = ['throne', 'map', 'gear', 'ally'];

// XP curve — total XP needed to REACH (not gain) the given level
// Level 1 starts at 0 xp. Level 2 needs 30. Level 3 needs 80. etc.
KJ.xpForLevel = function (level) {
  if (level <= 1) return 0;
  // Quadratic-ish gentle ramp
  return Math.floor(20 * (level - 1) + 5 * (level - 1) * (level - 1));
};

// Level-up rewards (James)
KJ.STAT_POINTS_PER_LEVEL = 2;
KJ.TRAIT_EVERY_N_LEVELS = 3;

// Party size on a quest
KJ.MAX_ALLIES_PER_QUEST = 2;

// Combat tunables
KJ.TUNABLES = {
  charmCatchChanceAtLowHP: 0.75,
  charmCatchChanceAtFullHP: 0.10,
  superEffectiveMult: 2.0,
  notVeryEffectiveMult: 0.5,
  magicEffectiveMult: 1.2,
  minDamage: 1,
  critChance: 0.08,
  critMult: 1.5,
};

// Simple helper
KJ.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
KJ.randInt = (lo, hi) => Math.floor(lo + Math.random() * (hi - lo + 1));
KJ.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
