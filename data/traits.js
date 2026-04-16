// King James 2 — Royal Traits (level-up picks every 3rd level)
// Each: id, name, emoji, description, apply (declarative hook string).

(function () {
  const T = [
    { id: 'thick_skin',   name: 'Thick Skin',   emoji: '🛡️',
      description: '+10% DEF forever',
      apply: { type: 'stat_mult', stat: 'def', mult: 1.10 } },
    { id: 'silver_tongue',name: 'Silver Tongue',emoji: '💬',
      description: '+1 gold per battle win',
      apply: { type: 'gold_per_win', amount: 1 } },
    { id: 'eagle_eye',    name: 'Eagle Eye',    emoji: '🦅',
      description: '+5% crit chance',
      apply: { type: 'crit_bonus', amount: 0.05 } },
    { id: 'tough_stuff',  name: 'Tough Stuff',  emoji: '💪',
      description: '+1 HP regen per battle turn',
      apply: { type: 'hp_regen_per_turn', amount: 1 } },
    { id: 'patient',      name: 'Patient',      emoji: '🧘',
      description: '+50% XP from puzzles',
      apply: { type: 'puzzle_xp_mult', mult: 1.5 } },
  ];
  T.forEach(t => KJ.Registry.traits.add(t));
})();
