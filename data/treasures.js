// King James 2 — The 5 Crown Treasures
// Each: id, name, emoji, element, jamesBonus, unlocksRoom, flavor.

(function () {
  const T = [
    { id: 'gem_of_wisdom',    name: 'Gem of Wisdom',      emoji: '💎',
      element: 'magic', jamesBonus: { hp: 5, addMove: 'think_fast' },
      unlocksRoom: 'library',
      flavor: 'A cold, clever stone. Whispers answers.' },

    { id: 'blade_of_bravery', name: 'Blade of Bravery',   emoji: '🗡️',
      element: 'wind', jamesBonus: { atk: 3, addMove: 'brave_strike' },
      unlocksRoom: 'armory',
      flavor: 'Cuts the wind with fearless speed. Sings in battle.' },

    { id: 'shield_of_kindness', name: 'Shield of Kindness', emoji: '🛡️',
      element: 'water', jamesBonus: { def: 3, hp: 3 },
      unlocksRoom: 'healing_hall',
      flavor: 'Protects not just you.' },

    { id: 'fire_of_courage',  name: 'Fire of Courage',    emoji: '🔥',
      element: 'fire', jamesBonus: { atk: 3, spd: 2, addMove: 'courage_burst' },
      unlocksRoom: 'forge',
      flavor: 'Burns when you\'re about to give up.' },

    { id: 'star_of_friendship', name: 'Star of Friendship', emoji: '🌟',
      element: 'magic', jamesBonus: { hp: 4 },
      unlocksRoom: 'alliance_hall',
      flavor: 'Brighter with each friend.' },
  ];
  T.forEach(t => KJ.Registry.treasures.add(t));
})();
