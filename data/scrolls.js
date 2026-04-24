// King James 2 — Scrolls (magical consumables)
// Craft at the Library for gold. Use once in battle via the Items button.
// Each scroll: id, name, emoji, price, desc, effect { kind, amount, elementType? }.
//
// Supported effect kinds:
//   - heal_party          : heal all alive party members by `amount`
//   - damage_enemy        : deal `amount` damage to first alive enemy (typeless)
//   - damage_all_enemies  : deal `amount` damage to all alive enemies (typeless)

(function () {
  const S = [
    // Scrolls scale at runtime (base + level*K); descriptions show base only.
    // Prices doubled from earlier tuning so scrolls are a meaningful gold sink.
    { id: 'scroll_heal',     name: 'Heal Scroll',  emoji: '📜', price: 60,
      desc: 'Heal party (base 15, +level)',
      effect: { kind: 'heal_party', amount: 15 } },
    { id: 'scroll_big_heal', name: 'Big Heal',     emoji: '📜', price: 120,
      desc: 'Heal party (base 30, +level)',
      effect: { kind: 'heal_party', amount: 30 } },
    { id: 'scroll_fire',     name: 'Fire Bolt',    emoji: '🔥', price: 80,
      desc: 'Big typeless damage — stronger than any move',
      effect: { kind: 'damage_enemy', amount: 15 } },
    { id: 'scroll_thunder',  name: 'Thunder',      emoji: '⚡', price: 160,
      desc: 'Big typeless damage to ALL enemies',
      effect: { kind: 'damage_all_enemies', amount: 10 } },
    { id: 'scroll_waterskin',name: 'Waterskin',    emoji: '🫗', price: 50,
      desc: 'Small party heal (base 10, +level)',
      effect: { kind: 'heal_party', amount: 10 } },
  ];
  S.forEach(s => KJ.Registry.scrolls.add(s));
})();
