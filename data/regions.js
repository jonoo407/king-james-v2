// King James 2 — Kingdom Regions
// Each region describes its visual theme + the quest it hosts + what enemy
// types dominate (used by the Map's pre-quest hint).

(function () {
  const R = [
    { id: 'forest',   name: 'Deep Forest',   emoji: '🌲', bgStyle: 'forest',
      questId: 'forest',   locked: false, unlockCondition: null,
      primaryEnemyTypes: ['earth'] },

    { id: 'mountain', name: 'Cold Mountain', emoji: '🏔️', bgStyle: 'mountain',
      questId: 'mountain', locked: true,  unlockCondition: { type: 'treasure_owned', id: 'gem_of_wisdom' },
      primaryEnemyTypes: ['water'] },

    { id: 'beach',    name: 'Silver Shore',  emoji: '🏖️', bgStyle: 'beach',
      questId: 'beach',    locked: true,  unlockCondition: { type: 'treasure_owned', id: 'blade_of_bravery' },
      primaryEnemyTypes: ['magic', 'water'] },

    { id: 'desert',   name: 'Sun Desert',    emoji: '🏜️', bgStyle: 'desert',
      questId: 'desert',   locked: true,  unlockCondition: { type: 'treasure_owned', id: 'shield_of_kindness' },
      primaryEnemyTypes: ['fire'] },

    { id: 'volcano',  name: 'Lava Peak',     emoji: '🌋', bgStyle: 'volcano',
      questId: 'volcano',  locked: true,  unlockCondition: { type: 'treasure_owned', id: 'fire_of_courage' },
      primaryEnemyTypes: ['fire', 'earth'] },
  ];
  R.forEach(r => KJ.Registry.regions.add(r));
})();
