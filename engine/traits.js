// King James 2 — Royal Traits helper
// Thin wrapper over player.traits + the trait apply-time effect application.

window.KJ = window.KJ || {};

KJ.Traits = (function () {

  function has(tid) {
    const s = KJ.State && KJ.State.get && KJ.State.get();
    return !!(s && s.player && s.player.traits && s.player.traits.includes(tid));
  }

  // Shop discount (Fast Talker): returns price after any applicable discounts.
  function priceAfterDiscount(basePrice) {
    if (has('fast_talker')) return Math.max(1, Math.round(basePrice * 0.8));
    return basePrice;
  }

  // Gold-per-win bonus (Silver Tongue): +5 gold after battle_won.
  function bonusGoldPerWin() {
    return has('silver_tongue') ? 5 : 0;
  }

  // Regen per turn (Tough Stuff): +1 HP on the player's turn_start.
  function regenPerTurn() {
    return has('tough_stuff') ? 1 : 0;
  }

  // Puzzle XP multiplier (Patient).
  function puzzleXpMultiplier() {
    return has('patient') ? 1.5 : 1;
  }

  // XP per scene visited (Book Smart). Subscribed via events.
  function xpPerScene() {
    return has('book_smart') ? 1 : 0;
  }

  // Drop-rate multiplier (Monster Magnet).
  function dropRateMult() {
    return has('monster_magnet') ? 1.5 : 1;
  }

  // Auto-apply effects on scene entry (Book Smart XP bump).
  KJ.Events && KJ.Events.on && KJ.Events.on('scene_entered', () => {
    const bump = xpPerScene();
    if (bump > 0) {
      const s = KJ.State.get();
      s.player.xp += bump;
    }
  });

  return {
    has,
    priceAfterDiscount,
    bonusGoldPerWin,
    regenPerTurn,
    puzzleXpMultiplier,
    xpPerScene,
    dropRateMult,
  };
})();
