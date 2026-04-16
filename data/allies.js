// King James 2 — Allies (species catalog)
// Each ally species: id, name, emoji, type, baseStats, learnset,
// sceneAbility (for non-combat scenes), hirePrice (Dame Pompadour),
// bio, quipLines.

(function () {
  const A = [
    {
      id: 'foxy', name: 'Foxy', emoji: '🦊', type: 'wind',
      baseStats: { hp: 18, atk: 5, def: 3, spd: 9 },
      learnset: [
        { level: 1, move: 'quick_pounce' },
        { level: 3, move: 'wind_gust' },
      ],
      sceneAbility: 'stealth',
      hirePrice: 80,
      bio: 'Quick-witted forest fox. Knows every shortcut.',
      quipLines: [
        'Watch this!',
        'Too slow!',
        'Clean move.',
        'Easy peasy!',
        'Hey! No biting!',
      ],
    },
    {
      id: 'ribbit', name: 'Ribbit', emoji: '🐸', type: 'water',
      baseStats: { hp: 24, atk: 4, def: 4, spd: 5 },
      learnset: [
        { level: 1, move: 'splash' },
        { level: 3, move: 'bubble' },
      ],
      sceneAbility: 'water',
      hirePrice: 100,
      bio: 'Calm, moist, surprisingly deep thoughts.',
      quipLines: [
        'Rrrribbit!',
        'Splish splash.',
        'Cool water.',
        'Glub glub.',
        'Hmph. Rude.',
      ],
    },
    {
      id: 'owlette', name: 'Owlette', emoji: '🦉', type: 'magic',
      baseStats: { hp: 16, atk: 6, def: 3, spd: 7 },
      learnset: [
        { level: 1, move: 'hoot' },
        { level: 3, move: 'moon_beam' },
      ],
      sceneAbility: 'wisdom',
      hirePrice: 150,
      bio: 'Sees through riddles. Snarky about it.',
      quipLines: [
        'Obvious, really.',
        'Hoo boy.',
        'As predicted.',
        'Pay attention!',
        'Must I explain this?',
      ],
    },

    // Mountain arc
    {
      id: 'ice_rabbit', name: 'Snip the Ice Rabbit', emoji: '🐇', type: 'water',
      baseStats: { hp: 20, atk: 4, def: 3, spd: 8 },
      learnset: [
        { level: 1, move: 'splash' },
        { level: 3, move: 'bubble' },
      ],
      sceneAbility: 'sniff',
      hirePrice: 120,
      bio: 'White-furred speedster. Sniffs out hidden things. Huge feet.',
      quipLines: [
        'Hop hop!',
        'Sniff sniff!',
        '*nose wiggle*',
        'Zoom!',
        'Carrot, please.',
      ],
    },
    {
      id: 'gus', name: 'Gus the Goat', emoji: '🐐', type: 'earth',
      baseStats: { hp: 28, atk: 7, def: 5, spd: 4 },
      learnset: [
        { level: 1, move: 'headbutt' },
        { level: 1, move: 'sure_step' },
      ],
      sceneAbility: 'cliff-climb',
      hirePrice: 200,
      bio: 'Territorial. Dry. Heavy head. Mountain-born.',
      quipLines: [
        'You smell like flat-land.',
        'MY mountain. Be polite.',
        'Did you bring snacks? No?? Rude.',
        'I lead. You walk in my hoof-prints.',
        'Was that a GOAT joke? I\'m watching you.',
      ],
    },
  ];

  A.forEach(a => KJ.Registry.allies.add(a));
})();
