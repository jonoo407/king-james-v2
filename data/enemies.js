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
      stats: { hp: 62, atk: 9, def: 5, spd: 5 },
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
  ];

  E.forEach(e => KJ.Registry.enemies.add(e));
})();
