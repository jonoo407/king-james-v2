// King James 2 — Badges
// Each: id, name, emoji, description, predicate(state), hidden, goldReward.

(function () {
  const B = [
    { id: 'first_friend', name: 'First Friend', emoji: '🤝',
      description: 'Recruit your first ally.',
      predicate: (s) => Object.keys(s.roster.allies).length >= 1,
      hidden: false, goldReward: 20 },

    { id: 'triple_squad', name: 'Triple Squad', emoji: '🎭',
      description: 'Collect 3 allies.',
      predicate: (s) => Object.keys(s.roster.allies).length >= 3,
      hidden: false, goldReward: 50 },

    { id: 'patient', name: 'Patient', emoji: '🧘',
      description: 'Solve all Riddle Tree riddles with no hints.',
      predicate: (s) => s.progress.flags['riddle_tree_no_hints'] === true,
      hidden: false, goldReward: 30 },

    { id: 'first_boss', name: 'First Boss', emoji: '🗿',
      description: 'Defeat your first boss.',
      predicate: (s) => (s.progress.trophies || []).length >= 1,
      hidden: false, goldReward: 40 },

    { id: 'wealthy',   name: 'Gold Hoarder', emoji: '💰',
      description: 'Save 500 gold at once.',
      predicate: (s) => s.inventory.gold >= 500,
      hidden: true, goldReward: 0 },

    { id: 'explorer',  name: 'Explorer', emoji: '🧭',
      description: 'Find a wild creature on a side path.',
      predicate: (s) => s.progress.flags['found_wild_pond'] === true,
      hidden: false, goldReward: 25 },

    // Mountain badges
    { id: 'brave_mind', name: 'Brave Mind', emoji: '🧠',
      description: 'Answer all of Sir Frostbeard\'s riddles.',
      predicate: (s) => s.progress.flags['frostbeard_riddles_solved'] === true,
      hidden: false, goldReward: 40 },
    { id: 'gentle_giant', name: 'Gentle Giant', emoji: '🦍',
      description: 'Befriend the Yeti instead of attacking.',
      predicate: (s) => s.progress.flags['yeti_friend'] === true,
      hidden: false, goldReward: 40 },
    { id: 'crown_carrier', name: 'Two-Treasure King', emoji: '👑',
      description: 'Collect 2 Crown Treasures.',
      predicate: (s) => (s.progress.treasures || []).length >= 2,
      hidden: false, goldReward: 80 },

    // Beach badges
    { id: 'serpent_friend', name: 'Serpent\'s Friend', emoji: '🐍',
      description: 'Free the baby sea serpents from the net.',
      predicate: (s) => s.progress.flags['serpent_friend'] === true,
      hidden: false, goldReward: 40 },
    { id: 'village_heart', name: 'Kind Coin', emoji: '🪙',
      description: 'Sit with the widow on the sea wall.',
      predicate: (s) => s.progress.flags['village_heart'] === true,
      hidden: false, goldReward: 30 },
    { id: 'drifter_listener', name: 'Listened to the Drifter', emoji: '🕯️',
      description: 'Hear the Drifter\'s real story before the fight.',
      predicate: (s) => s.progress.flags['knows_drifter_past'] === true,
      hidden: false, goldReward: 30 },

    // Desert badges
    { id: 'first_alliance', name: 'First Alliance', emoji: '🤲',
      description: 'Help Zephyra fix the sun-shield — partner, don\'t dismiss.',
      predicate: (s) => s.progress.flags['first_alliance'] === true,
      hidden: false, goldReward: 50 },
    { id: 'dragon_slayer', name: 'Dragon Slayer', emoji: '🐲',
      description: 'Defeat the Corrupted Sand Dragon.',
      predicate: (s) => (s.progress.trophies || []).includes('sand_dragon'),
      hidden: false, goldReward: 60 },
    { id: 'hope_in_dust', name: 'Hope in the Dust', emoji: '🌅',
      description: 'See Mornox in person and keep walking.',
      predicate: (s) => s.progress.flags['saw_mornox'] === true,
      hidden: false, goldReward: 40 },

    // Volcano badges (the finale)
    { id: 'true_king', name: 'True King', emoji: '👑',
      description: 'Complete the game — any ending.',
      predicate: (s) => (s.progress.questsCompleted || []).includes('volcano'),
      hidden: false, goldReward: 200 },
    { id: 'listen_and_learn', name: 'Listen & Learn', emoji: '👂',
      description: 'Sit down with Mornox instead of fighting.',
      predicate: (s) => s.progress.flags['volcano_listened'] === true,
      hidden: false, goldReward: 100 },
    { id: 'forgiven', name: 'Forgiven', emoji: '🌅',
      description: 'See Mornox redeemed (Listen-path ending).',
      predicate: (s) => s.progress.flags['mornox_redeemed'] === true,
      hidden: false, goldReward: 100 },
    { id: 'fully_forged', name: 'Fully Forged', emoji: '⚒️',
      description: 'Collect all 5 Treasures and upgrade 4+ gear pieces at the Armory.',
      predicate: (s) => (s.progress.treasures || []).length >= 5
        && (s.inventory.enhancedGear || []).length >= 4,
      hidden: false, goldReward: 150 },
  ];
  B.forEach(b => KJ.Registry.badges.add(b));
})();
