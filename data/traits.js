// King James 2 — Royal Traits (level-up picks every 3rd level)
// Pure data. Effects are applied by engine/traits.js + hooks in combat.js,
// battle.js, character.js, etc. (See KJ.Traits.has('id') sites.)

(function () {
  const T = [
    // ---- Original five — now actually wired ----
    { id: 'thick_skin',    name: 'Thick Skin',    emoji: '🛡️',
      description: '+10% DEF (forever)',
      apply: { type: 'stat_mult', stat: 'def', mult: 1.10 } },
    { id: 'silver_tongue', name: 'Silver Tongue', emoji: '💬',
      description: '+5 gold every battle win',
      apply: { type: 'gold_per_win', amount: 5 } },
    { id: 'eagle_eye',     name: 'Eagle Eye',     emoji: '🦅',
      description: '+5% crit chance on your attacks',
      apply: { type: 'crit_bonus', amount: 0.05 } },
    { id: 'tough_stuff',   name: 'Tough Stuff',   emoji: '💪',
      description: '+1 HP regen each of your turns in battle',
      apply: { type: 'hp_regen_per_turn', amount: 1 } },
    { id: 'patient',       name: 'Patient',       emoji: '🧘',
      description: '+50% XP from puzzles',
      apply: { type: 'puzzle_xp_mult', mult: 1.5 } },

    // ---- New: ten fresh traits ----
    { id: 'slow_steady',   name: 'Slow & Steady', emoji: '🐢',
      description: 'Your first move each battle is guaranteed to land.' },
    { id: 'book_smart',    name: 'Book Smart',    emoji: '🧠',
      description: '+1 XP each time you enter a new scene.' },
    { id: 'loyal_heart',   name: 'Loyal Heart',   emoji: '🫶',
      description: 'When your HP drops below half, allies get +2 HP & +1 ATK.' },
    { id: 'rascal',        name: 'Rascal',        emoji: '🐇',
      description: '+1 SPD always; you always go first on turn 1.' },
    { id: 'lucky_charm',   name: 'Lucky Charm',   emoji: '🍀',
      description: "8% chance any enemy attack just... misses." },
    { id: 'scaredy_cat',   name: 'Scaredy-Cat Strategy', emoji: '🐔',
      description: 'First time below 25% HP each battle, get Quick + Shield.' },
    { id: 'fast_talker',   name: 'Fast Talker',   emoji: '🗣️',
      description: '20% discount at every shop.' },
    { id: 'deep_pockets',  name: 'Deep Pockets',  emoji: '🎒',
      description: 'First scroll use per battle hits twice as hard.' },
    { id: 'monster_magnet',name: 'Monster Magnet',emoji: '🧲',
      description: '+50% gear drop chance from defeated enemies.' },
    { id: 'second_wind',   name: 'Second Wind',   emoji: '🌬️',
      description: 'Once per battle, revive with 5 HP when you would be KO\'d.' },
  ];
  T.forEach(t => KJ.Registry.traits.add(t));
})();
