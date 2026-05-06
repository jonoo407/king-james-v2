// King James 2 — Gear Catalog
// Each gear piece: id, name, slot, emoji, type, stats, move, tier, goldValue.
// 4 slots: weapon, armor, trinket, boots. Each slot grants 1 move + stats.

(function () {
  const G = [
    // --- STARTERS (Tier 1, rusty / basic) ---
    { id: 'wooden_sword', name: 'Wooden Sword', slot: 'weapon', emoji: '🪵',
      type: 'earth', stats: { atk: 2 }, move: 'swing', tier: 1, goldValue: 5 },
    { id: 'cloth_vest',   name: 'Cloth Vest',   slot: 'armor',  emoji: '👕',
      type: 'earth', stats: { def: 1 }, move: 'brace', tier: 1, goldValue: 5 },
    { id: 'plain_stone',  name: 'Flint Stone',  slot: 'trinket',emoji: '🪨',
      type: 'fire', stats: { hp: 1 }, move: 'spark', tier: 1, goldValue: 3 },
    { id: 'old_boots',    name: 'Old Boots',    slot: 'boots',  emoji: '👟',
      type: 'wind',  stats: { spd: 1 }, move: 'kick', tier: 1, goldValue: 3 },

    // --- FOREST DROPS (Tier 2) ---
    { id: 'iron_sword',    name: 'Iron Sword',    slot: 'weapon', emoji: '⚔️',
      type: 'earth', stats: { atk: 4 }, move: 'iron_slash', tier: 2, goldValue: 40 },
    { id: 'leather_armor', name: 'Leather Armor', slot: 'armor',  emoji: '🛡️',
      type: 'earth', stats: { def: 3, hp: 3 }, move: 'brace_plus', tier: 2, goldValue: 35 },
    { id: 'lucky_charm',   name: 'Lucky Charm',   slot: 'trinket',emoji: '📿',
      type: 'magic', stats: { hp: 2, spd: 1 }, move: 'lucky_throw', tier: 2, goldValue: 45 },
    { id: 'forest_boots',  name: 'Forest Boots',  slot: 'boots',  emoji: '👢',
      type: 'wind',  stats: { spd: 3 }, move: 'leaf_kick', tier: 2, goldValue: 30 },

    // --- RARE (Forest Tier 2 boss drop) ---
    { id: 'troll_stone',   name: 'Stone of the Troll', slot: 'trinket', emoji: '🗿',
      type: 'fire', stats: { hp: 5, def: 2 }, move: 'ember_burst', tier: 2, goldValue: 120 },

    // --- MOUNTAIN DROPS (Tier 3) ---
    { id: 'frost_fang_sword', name: 'Frost Fang Sword', slot: 'weapon', emoji: '❄️',
      type: 'water', stats: { atk: 5 }, move: 'ice_cut', tier: 3, goldValue: 90 },
    { id: 'knights_helm',     name: "Knight's Helm",    slot: 'armor',  emoji: '🪖',
      type: 'earth', stats: { def: 4, hp: 4 }, move: 'ward', tier: 3, goldValue: 80 },
    { id: 'wraiths_cloak',    name: "Wraith's Cloak",   slot: 'armor',  emoji: '🧥',
      type: 'wind',  stats: { def: 4, spd: 3 }, move: 'shadow_step', tier: 3, goldValue: 100 },
    { id: 'frost_charm',      name: 'Frost Charm',      slot: 'trinket',emoji: '💎',
      type: 'water', stats: { def: 3, spd: 2 }, move: 'ice_shard', tier: 3, goldValue: 70 },
    { id: 'crampon_boots',    name: 'Crampon Boots',    slot: 'boots',  emoji: '🥾',
      type: 'earth', stats: { spd: 4, def: 1 }, move: 'sure_step', tier: 3, goldValue: 65 },

    // --- BEACH DROPS (Tier 4) ---
    { id: 'coral_blade',    name: 'Coral Blade',      slot: 'weapon', emoji: '🪸',
      type: 'water', stats: { atk: 6 }, move: 'tide_slash', tier: 4, goldValue: 150 },
    { id: 'sea_kings_plate',name: "Sea King's Plate",  slot: 'armor',  emoji: '🐚',
      type: 'water', stats: { def: 5, hp: 5 }, move: 'tidal_ward', tier: 4, goldValue: 140 },
    { id: 'pearl_amulet',   name: 'Pearl Amulet',     slot: 'trinket',emoji: '🪬',
      type: 'magic', stats: { hp: 4, spd: 2 }, move: 'pearl_beam', tier: 4, goldValue: 130 },
    { id: 'tidal_boots',    name: 'Tidal Boots',      slot: 'boots',  emoji: '🌊',
      type: 'wind',  stats: { spd: 5, def: 2 }, move: 'drift_step', tier: 4, goldValue: 120 },

    // --- DESERT DROPS (Tier 5) ---
    { id: 'flame_scimitar', name: 'Flame Scimitar',  slot: 'weapon', emoji: '🔥',
      type: 'fire',  stats: { atk: 7 }, move: 'flame_cut', tier: 5, goldValue: 200 },
    { id: 'desert_plate',   name: 'Desert Plate',    slot: 'armor',  emoji: '🐫',
      type: 'earth', stats: { def: 6, hp: 5 }, move: 'sand_storm', tier: 5, goldValue: 185 },
    { id: 'sun_gem',        name: 'Sun Gem',         slot: 'trinket',emoji: '☀️',
      type: 'magic', stats: { hp: 4, spd: 3 }, move: 'sun_burst', tier: 5, goldValue: 175 },
    { id: 'dune_runners',   name: 'Dune Runners',    slot: 'boots',  emoji: '🏜️',
      type: 'wind',  stats: { spd: 6 }, move: 'mirage_dash', tier: 5, goldValue: 160 },

    // --- VOLCANO DROPS (Tier 6) ---
    { id: 'mage_saber',    name: 'Mage Saber',     slot: 'weapon', emoji: '✨',
      type: 'magic', stats: { atk: 8 }, move: 'arcane_slash', tier: 6, goldValue: 260 },
    { id: 'dragon_scale',  name: 'Dragon Scale',   slot: 'armor',  emoji: '🐉',
      type: 'fire',  stats: { def: 7, hp: 5 }, move: 'scale_wall', tier: 6, goldValue: 240 },
    { id: 'star_pendant',  name: 'Star Pendant',   slot: 'trinket',emoji: '💫',
      type: 'magic', stats: { hp: 5, spd: 4 }, move: 'star_dust', tier: 6, goldValue: 220 },
    { id: 'phoenix_boots', name: 'Phoenix Boots',  slot: 'boots',  emoji: '🔥',
      type: 'fire',  stats: { spd: 7, atk: 2 }, move: 'phoenix_dash', tier: 6, goldValue: 210 },
  ];

  G.forEach(g => KJ.Registry.gear.add(g));
})();
