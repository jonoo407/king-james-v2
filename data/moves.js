// King James 2 — Moves Catalog
// Each move has: id, name, type, power, accuracy, (optional) effect, target, flavor.

(function () {
  const M = [
    // --- Gear-based moves (James gets these via equipping) ---
    { id: 'swing',       name: 'Swing',       type: 'earth', power: 3, accuracy: 0.95, target: 'enemy', flavor: 'A plain wooden swing.' },
    { id: 'brace',       name: 'Guard Stance', type: 'earth', power: 0, accuracy: 1.0, target: 'self', heal: 4, flavor: 'Tuck in. Recover a bit.' },
    { id: 'toss',        name: 'Toss',        type: 'earth', power: 2, accuracy: 0.90, target: 'enemy', flavor: 'Throw a rock.' },
    { id: 'spark',       name: 'Spark',       type: 'fire',  power: 2, accuracy: 0.95, target: 'enemy', flavor: 'Strike the flint. Tiny flame!' },
    { id: 'ember_burst', name: 'Ember Burst', type: 'fire',  power: 8, accuracy: 0.95, target: 'enemy', flavor: 'Glowing troll-coal erupts!' },
    { id: 'kick',        name: 'Kick',        type: 'wind',  power: 3, accuracy: 0.95, target: 'enemy', flavor: 'Quick kick.' },

    { id: 'iron_slash',  name: 'Iron Slash',  type: 'earth', power: 7, accuracy: 0.95, target: 'enemy', flavor: 'Sharp iron cut.' },
    { id: 'brace_plus',  name: 'Guard Plus',  type: 'earth', power: 0, accuracy: 1.0, target: 'self', heal: 7, flavor: 'Deeper breath. Recover more.' },
    { id: 'lucky_throw', name: 'Lucky Throw', type: 'magic', power: 5, accuracy: 0.85, target: 'enemy', flavor: 'Might crit extra!' },
    { id: 'leaf_kick',   name: 'Leaf Kick',   type: 'wind',  power: 6, accuracy: 0.95, target: 'enemy', flavor: 'Whoosh of leaves.' },

    { id: 'think_fast',  name: 'Think Fast',  type: 'magic', power: 8, accuracy: 1.0,  target: 'enemy', flavor: 'Outsmart your foe.' },

    // --- Enemy moves ---
    { id: 'bite',        name: 'Bite',        type: 'earth', power: 4, accuracy: 0.95, target: 'enemy' },
    { id: 'club_smash',  name: 'Club Smash',  type: 'earth', power: 8, accuracy: 0.85, target: 'enemy' },
    { id: 'howl',        name: 'Howl',        type: 'wind',  power: 5, accuracy: 0.95, target: 'enemy' },
    { id: 'thorn_whip',  name: 'Thorn Whip',  type: 'earth', power: 4, accuracy: 0.95, target: 'enemy' },
    { id: 'yap',         name: 'Yap',         type: 'earth', power: 2, accuracy: 1.0,  target: 'enemy' },

    // --- Ally moves ---
    { id: 'quick_pounce', name: 'Quick Pounce', type: 'wind',  power: 5, accuracy: 0.95, target: 'enemy', flavor: 'Foxy specialty.' },
    { id: 'wind_gust',    name: 'Wind Gust',    type: 'wind',  power: 7, accuracy: 0.9,  target: 'enemy' },
    { id: 'splash',       name: 'Splash',       type: 'water', power: 4, accuracy: 1.0,  target: 'enemy', flavor: 'Wet slap.' },
    { id: 'bubble',       name: 'Bubble',       type: 'water', power: 6, accuracy: 0.9,  target: 'enemy' },
    { id: 'moon_beam',    name: 'Moon Beam',    type: 'magic', power: 7, accuracy: 0.95, target: 'enemy', flavor: 'Cool silver light.' },
    { id: 'hoot',         name: 'Hoot',         type: 'magic', power: 4, accuracy: 1.0,  target: 'enemy' },

    // --- Mountain arc (Tier 3) ---
    { id: 'ice_cut',     name: 'Ice Cut',     type: 'water', power: 9, accuracy: 0.95, target: 'enemy', flavor: 'Chilled blade cuts deep.' },
    { id: 'ward',        name: 'Ward',        type: 'earth', power: 0, accuracy: 1.0,  target: 'self', heal: 10, flavor: 'A knight\'s protection.' },
    { id: 'shadow_step', name: 'Shadow Step', type: 'wind',  power: 8, accuracy: 0.95, target: 'enemy', flavor: 'Slip between shadows.' },
    { id: 'ice_shard',   name: 'Ice Shard',   type: 'water', power: 7, accuracy: 0.95, target: 'enemy', flavor: 'Splinter of cold.' },
    { id: 'sure_step',   name: 'Sure Step',   type: 'earth', power: 6, accuracy: 1.0,  target: 'enemy', flavor: 'Charge with iron hoof.' },
    { id: 'brave_strike',name: 'Brave Strike',type: 'magic', power: 10,accuracy: 0.95, target: 'enemy', flavor: 'The Blade glows — pure courage, pure force.' },
    { id: 'frost_slash', name: 'Frost Slash', type: 'water', power: 7, accuracy: 0.9,  target: 'enemy' },
    { id: 'headbutt',    name: 'Headbutt',    type: 'earth', power: 6, accuracy: 0.95, target: 'enemy', flavor: 'Gus leads with the horns.' },
    { id: 'freeze',      name: 'Freeze',      type: 'water', power: 8, accuracy: 0.85, target: 'enemy', flavor: 'Chill to the bone.' },
    { id: 'icicle',      name: 'Icicle',      type: 'water', power: 4, accuracy: 0.95, target: 'enemy' },

    // --- Beach arc (Tier 4) — James gear moves ---
    { id: 'tide_slash',  name: 'Tide Slash',  type: 'water', power: 12, accuracy: 0.95, target: 'enemy', flavor: 'Wave-edge cuts deep.' },
    { id: 'tidal_ward',  name: 'Tidal Ward',  type: 'water', power: 0,  accuracy: 1.0,  target: 'self', heal: 14, flavor: "Sea's embrace restores." },
    { id: 'pearl_beam',  name: 'Pearl Beam',  type: 'magic', power: 10, accuracy: 0.95, target: 'enemy', flavor: 'Pearl-light sears through.' },
    { id: 'drift_step',  name: 'Drift Step',  type: 'wind',  power: 9,  accuracy: 0.95, target: 'enemy', flavor: 'Quick as a shore current.' },

    // --- Beach arc — enemy moves ---
    { id: 'pinch',       name: 'Pinch',       type: 'earth', power: 4,  accuracy: 1.0,  target: 'enemy' },
    { id: 'sand_blast',  name: 'Sand Blast',  type: 'wind',  power: 6,  accuracy: 0.90, target: 'enemy' },
    { id: 'coil',        name: 'Coil',        type: 'water', power: 7,  accuracy: 0.90, target: 'enemy' },
    { id: 'sea_hex',     name: 'Sea Hex',     type: 'magic', power: 9,  accuracy: 0.85, target: 'enemy' },

    // --- Desert arc (Tier 5) — James gear moves ---
    { id: 'flame_cut',    name: 'Flame Cut',    type: 'fire',  power: 12, accuracy: 0.95, target: 'enemy', flavor: 'Flame-wreathed edge.' },
    { id: 'sand_storm',   name: 'Sand Storm',   type: 'earth', power: 9,  accuracy: 0.90, target: 'enemy', flavor: 'Buried in a held breath.' },
    { id: 'sun_burst',    name: 'Sun Burst',    type: 'magic', power: 9,  accuracy: 0.95, target: 'enemy', flavor: 'A pinpoint of trapped sunlight.' },
    { id: 'mirage_dash',  name: 'Mirage Dash',  type: 'wind',  power: 9,  accuracy: 0.95, target: 'enemy', flavor: 'Gone before the sand settles.' },

    // --- Desert treasure move ---
    { id: 'courage_burst',name: 'Courage Burst',type: 'fire',  power: 10, accuracy: 0.95, target: 'enemy', flavor: 'Burns when you\'d rather run.' },

    // --- Desert arc — ally move (Zephyra) ---
    { id: 'sun_lance',    name: 'Sun Lance',    type: 'magic', power: 10, accuracy: 0.95, target: 'enemy', flavor: 'Old magic, still sharp.' },

    // --- Desert arc — enemy moves ---
    { id: 'mirage_splash',name: 'Mirage Splash',type: 'water', power: 5,  accuracy: 1.0,  target: 'enemy', flavor: 'Water that isn\'t there. Still wet somehow.' },
    { id: 'dust_devil',   name: 'Dust Devil',   type: 'wind',  power: 9,  accuracy: 0.90, target: 'enemy', flavor: 'A tiny spinning tower of sand.' },
    { id: 'inferno_lash', name: 'Inferno Lash', type: 'fire',  power: 12, accuracy: 0.90, target: 'enemy', flavor: 'Dragon-tongue fire, whip-quick.' },
  ];

  M.forEach(m => KJ.Registry.moves.add(m));
})();
