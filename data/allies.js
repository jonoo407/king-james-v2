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

    // Beach arc
    {
      id: 'finn', name: 'Finn the Sea Otter', emoji: '🦦', type: 'water',
      baseStats: { hp: 22, atk: 5, def: 4, spd: 7 },
      learnset: [
        { level: 1, move: 'splash' },
        { level: 3, move: 'bubble' },
      ],
      sceneAbility: 'swim',
      hirePrice: 160,
      bio: 'Fiercely loyal once you earn it. Dives where no one else can. Will absolutely steal your lunch.',
      quipLines: [
        'Easy. Watch.',
        '*splash*',
        'You\'re slow on land. I\'m not.',
        'I dove for you. You\'re welcome.',
        'Three tides. I waited three tides.',
      ],
    },

    // Desert arc
    {
      id: 'zephyra', name: 'Zephyra the Sun-Witch', emoji: '🧙‍♀️', type: 'magic',
      baseStats: { hp: 32, atk: 9, def: 5, spd: 6 },
      learnset: [
        { level: 1, move: 'moon_beam' },
        { level: 3, move: 'sun_lance' },
      ],
      sceneAbility: 'wisdom',
      hirePrice: 240,
      bio: 'Three hundred years in a tent. Mornox\'s old apprentice. Tired eyes, clever hands, still trying to fix what he broke.',
      quipLines: [
        'Oh, FINE. I\'ll help.',
        'Stand behind me, tiny king.',
        'This is what the old magic looks like when it remembers itself.',
        'I\'ve seen worse. Once. Long ago.',
        'Mornox taught me this one. Ironic, isn\'t it.',
      ],
    },
  ];

  A.forEach(a => KJ.Registry.allies.add(a));
})();
