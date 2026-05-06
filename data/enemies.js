// King James 2 — Enemies Catalog
// Each enemy: id, name, emoji, type, level, stats, moves, behavior,
// rewards (gold range, xp, drops), quipLines.

(function () {
  const E = [
    {
      id: 'goblin_scout', name: 'Goblin Scout', emoji: '👺', type: 'earth',
      level: 1,
      stats: { hp: 10, atk: 2, def: 2, spd: 5 },
      moves: ['swing', 'bite'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0, 1] },
      rewards: { xp: 6, gold: [4, 8], drops: [] },
      quipLines: [
        'Get off our road!',
        'We bite!',
        'Ow ow ow!',
        'Retreat! RETREAT!',
      ],
    },
    {
      id: 'briar_wolf', name: 'Briar Wolf', emoji: '🐺', type: 'earth',
      level: 3,
      stats: { hp: 28, atk: 7, def: 4, spd: 7 },
      moves: ['bite', 'howl', 'thorn_whip'],
      behavior: { pattern: 'cycle', sequence: [1, 0, 2, 0] },
      rewards: { xp: 22, gold: [16, 28], drops: [{ gear: 'lucky_charm', chance: 0.35 }] },
      quipLines: [
        'RAWR! MY woods!',
        'Who let you in here?',
        'I eat kings for breakfast.',
        'Stay. Down.',
      ],
    },
    {
      id: 'hoarder_troll', name: 'Hoarder Troll', emoji: '🧌', type: 'earth',
      level: 5,
      stats: { hp: 50, atk: 9, def: 6, spd: 3 },
      moves: ['club_smash', 'swing', 'howl'],
      behavior: { pattern: 'cycle', sequence: [1, 1, 0, 1, 2] }, // telegraph club smash every 3rd
      rewards: { xp: 60, gold: [70, 110], drops: [{ gear: 'troll_stone', chance: 1.0 }] },
      quipLines: [
        'Mine! Mine! Mine!',
        'Can\'t have it!',
        'Ugh. You again.',
        'My back hurts.',
        'Leave me ALONE!',
      ],
    },
    {
      id: 'thornpup', name: 'Thornpup', emoji: '🦔', type: 'earth',
      level: 3,
      stats: { hp: 14, atk: 4, def: 3, spd: 6 },
      moves: ['thorn_whip', 'yap'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0] },
      rewards: { xp: 8, gold: [3, 6], drops: [] },
      quipLines: [
        'Bark bark bark!',
        'Sharp! Ow, sharp for me too!',
        'Yip!',
      ],
    },
    // --- Forest variety ---
    {
      id: 'forest_sprite', name: 'Forest Sprite', emoji: '🧚', type: 'magic',
      level: 2,
      stats: { hp: 14, atk: 3, def: 2, spd: 8 },
      moves: ['hoot', 'lucky_throw'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0, 1] },
      rewards: { xp: 8, gold: [4, 8], drops: [{ gear: 'lucky_charm', chance: 0.1 }] },
      quipLines: ['Sparkle!', 'Fizzwizz!', 'Pesky human!', 'Tee hee!'],
    },
    {
      id: 'whirl_bat', name: 'Whirl Bat', emoji: '🦇', type: 'wind',
      level: 2,
      stats: { hp: 14, atk: 4, def: 2, spd: 9 },
      moves: ['howl', 'wind_gust'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0, 1] },
      rewards: { xp: 9, gold: [5, 9], drops: [] },
      quipLines: ['Screech!', 'Flap-flap!', 'Eek!', 'Zip!'],
    },

    // Wild ally candidate (Ribbit when caught in the wild)
    {
      id: 'wild_ribbit', name: 'Wild Ribbit', emoji: '🐸', type: 'water',
      level: 2,
      stats: { hp: 20, atk: 3, def: 3, spd: 4 },
      moves: ['splash'],
      behavior: { pattern: 'cycle', sequence: [0] },
      rewards: { xp: 10, gold: [5, 10], drops: [] },
      quipLines: ['Rrrribbit.', 'Glub.', '...Ribbit?'],
      catchable: 'ribbit',
    },

    // --- Mountain arc enemies ---
    {
      // Fumarole creature — lives near the mountain's hot vents.
      // Gives water moves (splash/bubble/ice_cut/ice_shard) a super-effective home.
      id: 'ember_wisp', name: 'Ember Wisp', emoji: '🔥', type: 'fire',
      level: 3,
      stats: { hp: 18, atk: 5, def: 3, spd: 8 },
      moves: ['spark', 'howl'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0] },
      rewards: { xp: 12, gold: [6, 10], drops: [] },
      quipLines: ['*crackle*', 'Sssss!', 'Warm warm warm!', 'Pop!'],
    },
    {
      id: 'frost_sprite', name: 'Frost Sprite', emoji: '❄️', type: 'water',
      level: 3,
      stats: { hp: 16, atk: 4, def: 3, spd: 6 },
      moves: ['icicle', 'splash'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0] },
      rewards: { xp: 14, gold: [6, 10], drops: [{ gear: 'frost_charm', chance: 0.25 }] },
      quipLines: ['Brr!', 'Twinkle crack!', 'Cold cold cold!', 'Stop melting me!'],
    },
    {
      id: 'wild_ice_rabbit', name: 'Wild Ice Rabbit', emoji: '🐇', type: 'water',
      level: 3,
      stats: { hp: 22, atk: 3, def: 3, spd: 7 },
      moves: ['splash', 'bubble'],
      behavior: { pattern: 'cycle', sequence: [0, 1] },
      rewards: { xp: 14, gold: [6, 12], drops: [] },
      quipLines: ['Hop hop!', 'Sniff!', 'Don\'t eat me!'],
      catchable: 'ice_rabbit',
    },
    {
      id: 'frostbeard', name: 'Sir Frostbeard', emoji: '🧔‍♂️', type: 'water',
      level: 4,
      stats: { hp: 42, atk: 8, def: 5, spd: 4 },
      moves: ['frost_slash', 'iron_slash', 'brace_plus'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 2, 0, 1] },
      rewards: { xp: 35, gold: [24, 36], drops: [{ gear: 'frost_fang_sword', chance: 0.5 }] },
      quipLines: [
        'HALT, tiny human!',
        'You must earn passage.',
        'My children miss me. Make this quick.',
        'Honor demands I test you!',
        'Oof. You\'re stronger than you look.',
      ],
    },
    // --- Mountain variety (not all water) ---
    {
      id: 'snow_drake', name: 'Snow Drake', emoji: '🦅', type: 'wind',
      level: 3,
      stats: { hp: 20, atk: 5, def: 3, spd: 9 },
      moves: ['wind_gust', 'howl'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0] },
      rewards: { xp: 14, gold: [7, 12], drops: [{ gear: 'crampon_boots', chance: 0.15 }] },
      quipLines: ['SCREECH!', 'Whirl whirl!', 'Frost-caw!', 'Zip!'],
    },
    {
      id: 'stone_ogre', name: 'Stone Ogre', emoji: '🗿', type: 'earth',
      level: 4,
      stats: { hp: 30, atk: 6, def: 5, spd: 3 },
      moves: ['club_smash', 'swing'],
      behavior: { pattern: 'cycle', sequence: [1, 0, 1, 0, 0] },
      rewards: { xp: 20, gold: [12, 18], drops: [{ gear: 'troll_stone', chance: 0.2 }] },
      quipLines: ['GRAWR.', 'Me hit hard.', 'Cold. Sleepy.', 'ROCK SMASH.'],
    },

    {
      id: 'glimmer_wraith', name: 'Glimmer the Wraith', emoji: '👻', type: 'water',
      level: 5,
      stats: { hp: 62, atk: 9, def: 6, spd: 5 },
      moves: ['freeze', 'icicle', 'bubble'],
      behavior: { pattern: 'cycle', sequence: [1, 0, 2, 0, 1] },
      rewards: { xp: 80, gold: [90, 130], drops: [{ gear: 'wraiths_cloak', chance: 1.0 }] },
      quipLines: [
        'Oh NOW you people notice me.',
        'I stole the Blade because NO ONE writes songs about wraiths!',
        'Where is the DRAMA? The THEATRE?',
        'Fine! Fine. I was lonely. Happy?',
        'Poof. How dramatic. HOW. DRAMATIC.',
      ],
    },

    // --- Beach arc enemies ---
    {
      id: 'tide_crab', name: 'Tide Crab', emoji: '🦀', type: 'water',
      level: 4,
      stats: { hp: 28, atk: 6, def: 5, spd: 4 },
      moves: ['pinch', 'splash'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0, 1] },
      rewards: { xp: 20, gold: [14, 22], drops: [] },
      quipLines: ['Snip snip!', 'MY tide pool!', 'Clack clack!', 'BACK! BACK!'],
    },
    {
      id: 'sand_sprite', name: 'Sand Sprite', emoji: '🌪️', type: 'wind',
      level: 4,
      stats: { hp: 20, atk: 6, def: 3, spd: 10 },
      moves: ['sand_blast', 'wind_gust'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0] },
      rewards: { xp: 18, gold: [12, 20], drops: [] },
      quipLines: ['Whirl!', 'MY dune!', 'Sandy! Sandy!', 'Zoom zip!'],
    },
    {
      id: 'sea_serpent', name: 'Sea Serpent', emoji: '🐉', type: 'water',
      level: 5,
      stats: { hp: 48, atk: 8, def: 4, spd: 6 },
      moves: ['coil', 'splash', 'bubble'],
      behavior: { pattern: 'cycle', sequence: [0, 2, 1, 0] },
      rewards: { xp: 40, gold: [28, 44], drops: [{ gear: 'coral_blade', chance: 0.4 }] },
      quipLines: ['HISSSS!', 'Go. Away.', 'Hungry...', 'MINE. Water.'],
    },
    {
      id: 'drifter', name: 'Drifter', emoji: '🧙‍♀️', type: 'magic',
      level: 6,
      stats: { hp: 105, atk: 10, def: 9, spd: 5 },
      moves: ['sea_hex', 'freeze', 'bubble'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 2, 0, 1] },
      rewards: { xp: 105, gold: [120, 165], drops: [{ gear: 'sea_kings_plate', chance: 1.0 }] },
      quipLines: [
        'GO AWAY!',
        'No one comes here. EVER.',
        'Leave. Me. BE!',
        'You don\'t know what you\'re doing!',
        'I didn\'t want any of this...',
      ],
    },

    // --- Desert arc enemies ---
    {
      // Earth trash — Ember Burst SE home. Scorpion = obvious desert trash.
      id: 'dune_scorpion', name: 'Dune Scorpion', emoji: '🦂', type: 'earth',
      level: 6,
      stats: { hp: 32, atk: 7, def: 4, spd: 6 },
      moves: ['bite', 'thorn_whip'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0, 1] },
      rewards: { xp: 22, gold: [14, 22], drops: [] },
      quipLines: ['Clack clack!', 'Snip!', 'Scuttle scuttle.', 'My dune!'],
    },
    {
      // Water trash — gives Brave Strike, Think Fast, Sun Burst, Lucky Throw a SE home.
      // "Mirage" = desert water-illusion.
      id: 'mirage_wisp', name: 'Mirage Wisp', emoji: '💧', type: 'water',
      level: 5,
      stats: { hp: 22, atk: 5, def: 3, spd: 9 },
      moves: ['mirage_splash', 'splash'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0] },
      rewards: { xp: 18, gold: [10, 16], drops: [] },
      quipLines: ['*shimmer*', 'Not... really... here...', 'Drink me! (don\'t.)', '*ripple*'],
    },
    {
      // Fire trash — Frost Fang Sword / Ice Cut SE home.
      id: 'sun_wisp', name: 'Sun Wisp', emoji: '☀️', type: 'fire',
      level: 6,
      stats: { hp: 26, atk: 7, def: 3, spd: 8 },
      moves: ['spark', 'ember_burst'],
      behavior: { pattern: 'cycle', sequence: [0, 0, 1, 0] }, // telegraph ember_burst every 3rd
      rewards: { xp: 22, gold: [12, 20], drops: [] },
      quipLines: ['*crackle*', 'Too... hot...', 'Burn! Burn!', 'Ssssss!'],
    },
    {
      // Wind mid-boss — Iron Slash / Sand Storm (earth) SE home.
      id: 'sand_dervish', name: 'Sand Dervish', emoji: '🌪️', type: 'wind',
      level: 7,
      stats: { hp: 56, atk: 10, def: 5, spd: 11 },
      moves: ['dust_devil', 'wind_gust', 'sand_blast'],
      behavior: { pattern: 'cycle', sequence: [1, 0, 2, 0, 1] }, // telegraph big dust_devil
      rewards: { xp: 75, gold: [55, 85], drops: [{ gear: 'dune_runners', chance: 0.5 }, { gear: 'desert_plate', chance: 0.5 }] },
      quipLines: [
        'WHHHHRL!',
        'Sand — in — everything!',
        'You are NOT welcome here!',
        'Blow away, tiny king!',
        '...fine. *collapses into sand pile*',
      ],
    },
    {
      // Fire boss — Ice Cut / Frost Fang SE home. Mixed-type add (Sun Wisp) in the encounter.
      // Corrupted = Mornox's influence, per spec §1.
      id: 'sand_dragon', name: 'Corrupted Sand Dragon', emoji: '🐉', type: 'fire',
      level: 8,
      stats: { hp: 140, atk: 12, def: 10, spd: 6 },
      moves: ['inferno_lash', 'club_smash', 'ember_burst'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 2, 0, 1] },
      rewards: { xp: 150, gold: [160, 220], drops: [{ gear: 'flame_scimitar', chance: 1.0 }] },
      quipLines: [
        'RRRAAAAAWR!',
        'The wizard\'s chain... BURNS!',
        'LEAVE the fire! It is HIS!',
        'Old... and tired... and ANGRY.',
        'I... was... not always like this...',
      ],
    },

    // ============================================================
    //  VOLCANO ARC (Tier 6) — fire / earth trash + Tempered Dragon (2 phases) + Mornox (3 phases)
    //  HP values are catalog (pre-multiplier). Runtime ×1.3 = effective.
    // ============================================================
    {
      // Fire trash — water moves SE home. Mirror Sun Wisp scaled +Lv 2.
      id: 'lava_spirit', name: 'Lava Spirit', emoji: '🟠', type: 'fire',
      level: 8,
      stats: { hp: 26, atk: 8, def: 3, spd: 9 },
      moves: ['lava_spit', 'spark'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0] },
      rewards: { xp: 28, gold: [14, 22], drops: [] },
      quipLines: ['*pop*', 'Hot hot hot!', 'Don\'t splash!', 'Sssssss—'],
    },
    {
      // Earth trash — fire moves SE home. Slow but heavy.
      id: 'obsidian_golem', name: 'Obsidian Golem', emoji: '🗿', type: 'earth',
      level: 8,
      stats: { hp: 38, atk: 10, def: 7, spd: 4 },
      moves: ['magma_throw', 'club_smash'],
      behavior: { pattern: 'cycle', sequence: [0, 0, 1, 0] },
      rewards: { xp: 36, gold: [18, 30], drops: [] },
      quipLines: ['...', '*RUMBLE*', 'STAY OUT.', '*cracks*'],
    },
    {
      // Tempered Dragon — Phase 1 (fire form). Dragon Scale armor 100% drop.
      id: 'tempered_dragon_fire', name: 'Tempered Dragon', emoji: '🐲', type: 'fire',
      level: 9,
      stats: { hp: 100, atk: 13, def: 9, spd: 7 },
      moves: ['inferno_breath', 'claw_swipe', 'ember_burst'],
      behavior: { pattern: 'cycle', sequence: [1, 0, 2, 1] }, // telegraph inferno every 3rd
      rewards: { xp: 80, gold: [70, 110], drops: [{ gear: 'dragon_scale', chance: 1.0 }] },
      quipLines: [
        'YOU. SHALL. NOT.',
        '*roars*',
        'I OBEY. I OBEY. I OBEY.',
        'The chain is hot, little king.',
        '...he made me.',
      ],
    },
    {
      // Tempered Dragon — Phase 2 (magic form, transformed). Wind moves SE home.
      id: 'tempered_dragon_magic', name: 'Tempered Dragon', emoji: '🐲', type: 'magic',
      level: 9,
      stats: { hp: 90, atk: 14, def: 8, spd: 9 },
      moves: ['mind_bend', 'void_pulse', 'shadow_bolt'],
      behavior: { pattern: 'cycle', sequence: [0, 0, 1] }, // telegraph void_pulse
      rewards: { xp: 60, gold: [60, 90], drops: [] },
      quipLines: [
        '*shifts*',
        'Different shape. Same chain.',
        'You can\'t hurt what isn\'t solid.',
        '...he taught me this trick.',
        'Almost free.',
      ],
    },
    {
      // Mornox — Phase 1 (magic primary, fire summons in spirit). Wind SE home.
      id: 'mornox_p1', name: 'Mornox', emoji: '🧙‍♂️', type: 'magic',
      level: 10,
      stats: { hp: 115, atk: 13, def: 10, spd: 8 },
      moves: ['shadow_bolt', 'ember_burst', 'mind_bend'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 0, 2] },
      rewards: { xp: 100, gold: [0, 0], drops: [] }, // gold/drops on final phase only
      quipLines: [
        'Tea\'s getting cold, little king.',
        '*sigh*',
        'You\'re very loud.',
        'My back. Oh my back.',
        '...you remind me of someone.',
      ],
    },
    {
      // Mornox — Phase 2 (water form, frozen ice-magic). Magic SE home only.
      id: 'mornox_p2', name: 'Mornox', emoji: '🧙‍♂️', type: 'water',
      level: 10,
      stats: { hp: 115, atk: 14, def: 11, spd: 7 },
      moves: ['frost_lance', 'ice_grip', 'ice_cut'],
      behavior: { pattern: 'cycle', sequence: [1, 0, 2, 0] },
      rewards: { xp: 100, gold: [0, 0], drops: [] },
      quipLines: [
        'Cold suits me.',
        'Four. Hundred. Years.',
        '*shudders*',
        'You don\'t know what tired means.',
        'Stop. Just for a moment. Stop.',
      ],
    },
    {
      // Mornox — Phase 3 (earth+magic). Final phase. Mage Saber drop.
      id: 'mornox_p3', name: 'Mornox', emoji: '🧙‍♂️', type: 'magic',
      level: 11,
      stats: { hp: 130, atk: 15, def: 11, spd: 8 },
      moves: ['shatter_storm', 'earth_grasp', 'void_pulse'],
      behavior: { pattern: 'cycle', sequence: [0, 1, 2, 0, 1] }, // telegraph shatter_storm
      rewards: { xp: 200, gold: [200, 280], drops: [{ gear: 'mage_saber', chance: 1.0 }] },
      quipLines: [
        'I\'M TIRED!',
        'FOUR HUNDRED YEARS!',
        'LET ME REST!',
        '...please.',
        'Thank... you. Finally.',
      ],
    },
  ];

  E.forEach(e => KJ.Registry.enemies.add(e));
})();
