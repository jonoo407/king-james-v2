// King James 2 — Moves Catalog
// Each move has: id, name, type, power, accuracy, (optional) effect, target, flavor.
// `spark` field = ✨ cost (only James pays; allies/enemies always free). Physical moves: 0.

(function () {
  const M = [
    // --- Gear-based moves (James gets these via equipping) ---
    { id: 'swing',       name: 'Swing',       type: 'earth', power: 4, accuracy: 0.95, target: 'enemy', spark: 0, flavor: 'A plain wooden swing.',
      statusOnCrit: { id: 'stun', turns: 1 } },
    { id: 'brace',       name: 'Guard Stance', type: 'earth', power: 0, accuracy: 1.0, target: 'self', heal: 4, spark: 1, flavor: 'Tuck in. Recover a bit.',
      statusOnSelf: { id: 'shield', turns: 2 } },
    { id: 'toss',        name: 'Toss',        type: 'earth', power: 2, accuracy: 0.90, target: 'enemy', spark: 0, flavor: 'Throw a rock.' },
    { id: 'spark',       name: 'Spark',       type: 'fire',  power: 2, accuracy: 0.95, target: 'enemy', spark: 1, flavor: 'Strike the flint. Tiny flame!',
      statusOnHit: { id: 'burn', turns: 3, chance: 0.30 } },
    { id: 'ember_burst', name: 'Ember Burst', type: 'fire',  power: 8, accuracy: 0.95, target: 'enemy', spark: 2, flavor: 'Glowing troll-coal erupts!',
      statusOnHit: { id: 'burn', turns: 3, chance: 0.30 } },
    { id: 'kick',        name: 'Kick',        type: 'wind',  power: 3, accuracy: 0.95, target: 'enemy', spark: 0, flavor: 'Quick kick.',
      statusOnHit: { id: 'dizzy', turns: 2, chance: 0.20 } },

    { id: 'iron_slash',  name: 'Iron Slash',  type: 'earth', power: 7, accuracy: 0.95, target: 'enemy', spark: 0, flavor: 'Sharp iron cut.',
      statusOnCrit: { id: 'stun', turns: 1 } },
    { id: 'brace_plus',  name: 'Guard Plus',  type: 'earth', power: 0, accuracy: 1.0, target: 'self', heal: 7, spark: 1, flavor: 'Deeper breath. Recover more.',
      statusOnSelf: { id: 'shield', turns: 2 } },
    { id: 'lucky_throw', name: 'Lucky Throw', type: 'magic', power: 5, accuracy: 0.85, target: 'enemy', spark: 1, flavor: 'Might crit extra!' },
    { id: 'leaf_kick',   name: 'Leaf Kick',   type: 'wind',  power: 6, accuracy: 0.95, target: 'enemy', spark: 1, flavor: 'Whoosh of leaves.',
      statusOnHit: { id: 'dizzy', turns: 2, chance: 0.20 } },

    { id: 'think_fast',  name: 'Think Fast',  type: 'magic', power: 8, accuracy: 1.0,  target: 'enemy', spark: 2, flavor: 'Outsmart your foe.',
      statusOnHit: { id: 'sleep', turns: 3, chance: 0.20 } },

    // --- Enemy moves (no spark cost — enemies don't use sparks) ---
    { id: 'bite',        name: 'Bite',        type: 'earth', power: 4, accuracy: 0.95, target: 'enemy' },
    { id: 'club_smash',  name: 'Club Smash',  type: 'earth', power: 8, accuracy: 0.85, target: 'enemy' },
    { id: 'howl',        name: 'Howl',        type: 'wind',  power: 5, accuracy: 0.95, target: 'enemy' },
    { id: 'thorn_whip',  name: 'Thorn Whip',  type: 'earth', power: 4, accuracy: 0.95, target: 'enemy' },
    { id: 'yap',         name: 'Yap',         type: 'earth', power: 2, accuracy: 1.0,  target: 'enemy' },

    // --- Ally moves (allies are auto; cost doesn't apply) ---
    { id: 'quick_pounce', name: 'Quick Pounce', type: 'wind',  power: 5, accuracy: 0.95, target: 'enemy', flavor: 'Foxy specialty.' },
    { id: 'wind_gust',    name: 'Wind Gust',    type: 'wind',  power: 7, accuracy: 0.9,  target: 'enemy' },
    { id: 'splash',       name: 'Splash',       type: 'water', power: 4, accuracy: 1.0,  target: 'enemy', flavor: 'Wet slap.' },
    { id: 'bubble',       name: 'Bubble',       type: 'water', power: 6, accuracy: 0.9,  target: 'enemy' },
    { id: 'moon_beam',    name: 'Moon Beam',    type: 'magic', power: 7, accuracy: 0.95, target: 'enemy', flavor: 'Cool silver light.' },
    { id: 'hoot',         name: 'Hoot',         type: 'magic', power: 4, accuracy: 1.0,  target: 'enemy' },

    // --- Mountain arc (Tier 3) ---
    { id: 'ice_cut',     name: 'Ice Cut',     type: 'water', power: 9, accuracy: 0.95, target: 'enemy', spark: 2, flavor: 'Chilled blade cuts deep.',
      statusOnHit: { id: 'freeze', turns: 2, chance: 0.15 } },
    { id: 'ward',        name: 'Ward',        type: 'earth', power: 0, accuracy: 1.0,  target: 'self', heal: 10, spark: 1, flavor: 'A knight\'s protection.',
      statusOnSelf: { id: 'shield', turns: 2 } },
    { id: 'shadow_step', name: 'Shadow Step', type: 'wind',  power: 8, accuracy: 0.95, target: 'enemy', spark: 2, flavor: 'Slip between shadows.',
      statusOnHit: { id: 'dizzy', turns: 2, chance: 0.20 } },
    { id: 'ice_shard',   name: 'Ice Shard',   type: 'water', power: 7, accuracy: 0.95, target: 'enemy', spark: 1, flavor: 'Splinter of cold.' },
    { id: 'sure_step',   name: 'Sure Step',   type: 'earth', power: 6, accuracy: 1.0,  target: 'enemy', spark: 0, flavor: 'Charge with iron hoof.',
      statusOnCrit: { id: 'stun', turns: 1 } },
    { id: 'brave_strike',name: 'Brave Strike',type: 'magic', power: 10,accuracy: 0.95, target: 'enemy', spark: 3, flavor: 'The Blade glows — pure courage, pure force.',
      statusOnHit: { id: 'sleep', turns: 3, chance: 0.20 } },
    { id: 'frost_slash', name: 'Frost Slash', type: 'water', power: 7, accuracy: 0.9,  target: 'enemy',
      statusOnHit: { id: 'freeze', turns: 2, chance: 0.15 } },
    { id: 'headbutt',    name: 'Headbutt',    type: 'earth', power: 6, accuracy: 0.95, target: 'enemy', flavor: 'Gus leads with the horns.',
      statusOnCrit: { id: 'stun', turns: 1 } },
    { id: 'freeze',      name: 'Freeze',      type: 'water', power: 8, accuracy: 0.85, target: 'enemy', flavor: 'Chill to the bone.',
      statusOnHit: { id: 'freeze', turns: 2, chance: 0.30 } },
    { id: 'icicle',      name: 'Icicle',      type: 'water', power: 4, accuracy: 0.95, target: 'enemy' },

    // --- Beach arc (Tier 4) — James gear moves ---
    { id: 'tide_slash',  name: 'Tide Slash',  type: 'water', power: 12, accuracy: 0.95, target: 'enemy', spark: 2, flavor: 'Wave-edge cuts deep.',
      statusOnHit: { id: 'freeze', turns: 2, chance: 0.15 } },
    { id: 'tidal_ward',  name: 'Tidal Ward',  type: 'water', power: 0,  accuracy: 1.0,  target: 'self', heal: 14, spark: 1, flavor: "Sea's embrace restores.",
      statusOnSelf: { id: 'shield', turns: 2 } },
    { id: 'pearl_beam',  name: 'Pearl Beam',  type: 'magic', power: 10, accuracy: 0.95, target: 'enemy', spark: 2, flavor: 'Pearl-light sears through.',
      statusOnHit: { id: 'sleep', turns: 3, chance: 0.20 } },
    { id: 'drift_step',  name: 'Drift Step',  type: 'wind',  power: 9,  accuracy: 0.95, target: 'enemy', spark: 1, flavor: 'Quick as a shore current.',
      statusOnHit: { id: 'dizzy', turns: 2, chance: 0.20 } },

    // --- Beach arc — enemy moves ---
    { id: 'pinch',       name: 'Pinch',       type: 'earth', power: 4,  accuracy: 1.0,  target: 'enemy' },
    { id: 'sand_blast',  name: 'Sand Blast',  type: 'wind',  power: 6,  accuracy: 0.90, target: 'enemy',
      statusOnHit: { id: 'dizzy', turns: 2, chance: 0.20 } },
    { id: 'coil',        name: 'Coil',        type: 'water', power: 7,  accuracy: 0.90, target: 'enemy',
      statusOnHit: { id: 'poison', turns: 3, chance: 0.20 } },
    { id: 'sea_hex',     name: 'Sea Hex',     type: 'magic', power: 9,  accuracy: 0.85, target: 'enemy',
      statusOnHit: { id: 'cursed', turns: 3, chance: 0.30 } },

    // --- Desert arc (Tier 5) — James gear moves ---
    { id: 'flame_cut',    name: 'Flame Cut',    type: 'fire',  power: 12, accuracy: 0.95, target: 'enemy', spark: 2, flavor: 'Flame-wreathed edge.',
      statusOnHit: { id: 'burn', turns: 3, chance: 0.30 } },
    { id: 'sand_storm',   name: 'Sand Storm',   type: 'earth', power: 9,  accuracy: 0.90, target: 'enemy', spark: 2, flavor: 'Buried in a held breath.',
      statusOnCrit: { id: 'stun', turns: 1 } },
    { id: 'sun_burst',    name: 'Sun Burst',    type: 'magic', power: 9,  accuracy: 0.95, target: 'enemy', spark: 2, flavor: 'A pinpoint of trapped sunlight.',
      statusOnHit: { id: 'sleep', turns: 3, chance: 0.20 } },
    { id: 'mirage_dash',  name: 'Mirage Dash',  type: 'wind',  power: 9,  accuracy: 0.95, target: 'enemy', spark: 1, flavor: 'Gone before the sand settles.',
      statusOnHit: { id: 'dizzy', turns: 2, chance: 0.20 } },

    // --- Desert treasure move ---
    { id: 'courage_burst',name: 'Courage Burst',type: 'fire',  power: 12, accuracy: 0.95, target: 'enemy', spark: 3, flavor: 'Burns when you\'d rather run.',
      statusOnHit: { id: 'burn', turns: 3, chance: 0.30 } },

    // --- Desert arc — ally move (Zephyra) ---
    { id: 'sun_lance',    name: 'Sun Lance',    type: 'magic', power: 10, accuracy: 0.95, target: 'enemy', flavor: 'Old magic, still sharp.',
      statusOnHit: { id: 'sleep', turns: 3, chance: 0.20 } },

    // --- Desert arc — enemy moves ---
    { id: 'mirage_splash',name: 'Mirage Splash',type: 'water', power: 5,  accuracy: 1.0,  target: 'enemy', flavor: 'Water that isn\'t there. Still wet somehow.' },
    { id: 'dust_devil',   name: 'Dust Devil',   type: 'wind',  power: 9,  accuracy: 0.90, target: 'enemy', flavor: 'A tiny spinning tower of sand.',
      statusOnHit: { id: 'dizzy', turns: 2, chance: 0.20 } },
    { id: 'inferno_lash', name: 'Inferno Lash', type: 'fire',  power: 12, accuracy: 0.90, target: 'enemy', flavor: 'Dragon-tongue fire, whip-quick.',
      statusOnHit: { id: 'burn', turns: 3, chance: 0.30 } },

    // --- Volcano arc — Tier 6 player gear moves ---
    { id: 'arcane_slash', name: 'Arcane Slash', type: 'magic', power: 14, accuracy: 0.95, target: 'enemy', spark: 2, flavor: 'A wand-cut. Reality flickers where it lands.' },
    { id: 'scale_wall',   name: 'Scale Wall',   type: 'earth', power: 0,  accuracy: 1.0,  target: 'self',  heal: 15, spark: 1, flavor: 'Dragon-hide warmth.',
      statusOnSelf: { id: 'shield', turns: 2 } },
    { id: 'star_dust',    name: 'Star Dust',    type: 'magic', power: 11, accuracy: 0.95, target: 'enemy', spark: 2, flavor: 'A pinch of starlight, thrown.' },
    { id: 'phoenix_dash', name: 'Phoenix Dash', type: 'fire',  power: 11, accuracy: 0.95, target: 'enemy', spark: 1, flavor: 'A streak of feather-fire.',
      statusOnHit: { id: 'burn', turns: 2, chance: 0.25 } },

    // --- Volcano arc — Star of Friendship treasure move (party heal + ally buff) ---
    { id: 'friends_beacon', name: "Friend's Beacon", type: 'magic', power: 0, accuracy: 1.0, target: 'self', heal: 10, spark: 2, flavor: 'A signal everyone you\'ve ever helped feels.',
      statusOnSelf: { id: 'pumped', turns: 2 } },

    // --- Volcano arc — enemy moves ---
    { id: 'lava_spit',     name: 'Lava Spit',     type: 'fire',  power: 6,  accuracy: 0.95, target: 'enemy', flavor: 'Hot. Sticky. Rude.',
      statusOnHit: { id: 'burn', turns: 2, chance: 0.20 } },
    { id: 'magma_throw',   name: 'Magma Throw',   type: 'earth', power: 8,  accuracy: 0.90, target: 'enemy', flavor: 'A glowing chunk, still smoldering.' },
    { id: 'inferno_breath',name: 'Inferno Breath',type: 'fire',  power: 13, accuracy: 0.85, target: 'enemy', flavor: 'Dragon-fire, all of it, all at once.',
      statusOnHit: { id: 'burn', turns: 3, chance: 0.40 } },
    { id: 'claw_swipe',    name: 'Claw Swipe',    type: 'earth', power: 7,  accuracy: 0.95, target: 'enemy', flavor: 'A casual scratch from something massive.',
      statusOnCrit: { id: 'stun', turns: 1 } },
    { id: 'mind_bend',     name: 'Mind Bend',     type: 'magic', power: 11, accuracy: 0.90, target: 'enemy', flavor: 'Reality goes a little wrong.',
      statusOnHit: { id: 'dizzy', turns: 2, chance: 0.30 } },
    { id: 'void_pulse',    name: 'Void Pulse',    type: 'magic', power: 13, accuracy: 0.85, target: 'enemy', flavor: 'A circle of nothing expands.' },
    { id: 'shadow_bolt',   name: 'Shadow Bolt',   type: 'magic', power: 12, accuracy: 0.90, target: 'enemy', flavor: 'A wizard\'s spite made hard.' },
    { id: 'frost_lance',   name: 'Frost Lance',   type: 'water', power: 13, accuracy: 0.85, target: 'enemy', flavor: 'A spear of ice, drawn from grief.',
      statusOnHit: { id: 'freeze', turns: 2, chance: 0.20 } },
    { id: 'ice_grip',      name: 'Ice Grip',      type: 'water', power: 8,  accuracy: 0.95, target: 'enemy', flavor: 'Cold hands. Old hands.',
      statusOnHit: { id: 'freeze', turns: 2, chance: 0.30 } },
    { id: 'shatter_storm', name: 'Shatter Storm', type: 'magic', power: 14, accuracy: 0.80, target: 'enemy', flavor: 'Everything he never said, all at once.' },
    { id: 'earth_grasp',   name: 'Earth Grasp',   type: 'earth', power: 11, accuracy: 0.90, target: 'enemy', flavor: 'Stone hands from underfoot.',
      statusOnHit: { id: 'stun', turns: 1, chance: 0.25 } },
  ];

  M.forEach(m => KJ.Registry.moves.add(m));
})();
