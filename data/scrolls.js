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
    { id: 'scroll_heal',     name: 'Heal Scroll',  emoji: '📜', price: 30,
      desc: 'Heal party +15 HP',
      effect: { kind: 'heal_party', amount: 15 } },
    { id: 'scroll_big_heal', name: 'Big Heal',     emoji: '📜', price: 60,
      desc: 'Heal party +30 HP',
      effect: { kind: 'heal_party', amount: 30 } },
    { id: 'scroll_fire',     name: 'Fire Bolt',    emoji: '🔥', price: 40,
      desc: '15 damage to one enemy',
      effect: { kind: 'damage_enemy', amount: 15 } },
    { id: 'scroll_thunder',  name: 'Thunder',      emoji: '⚡', price: 80,
      desc: '10 damage to ALL enemies',
      effect: { kind: 'damage_all_enemies', amount: 10 } },
  ];
  S.forEach(s => KJ.Registry.scrolls.add(s));
})();
