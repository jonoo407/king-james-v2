// King James 2 — Type System (5-way cycle)
//
// Kid mnemonic:
//   Water puts out Fire. Fire burns Plants. Plants stop Wind.
//   Wind blows Magic. Magic splits Water.
//
// Each type beats exactly ONE, loses to exactly ONE, neutral to the rest.

window.KJ = window.KJ || {};

KJ.Types = (function () {
  const T = KJ.TYPES; // ['fire','water','earth','wind','magic']

  const SE = KJ.TUNABLES.superEffectiveMult;       // 2.0
  const NV = KJ.TUNABLES.notVeryEffectiveMult;     // 0.5

  // Build chart with 1.0 default
  const chart = {};
  for (const a of T) {
    chart[a] = {};
    for (const d of T) chart[a][d] = 1.0;
  }

  // Super-effective (attacker -> defender). 5-way cycle.
  chart.water.fire   = SE;   // Water puts out fire
  chart.fire.earth   = SE;   // Fire burns plants
  chart.earth.wind   = SE;   // Plants stop wind
  chart.wind.magic   = SE;   // Wind blows magic
  chart.magic.water  = SE;   // Magic splits water

  // Weak (reverse of super — each attacker is weak to the defender type
  // that its super-target is defended by). More simply: the reverse edge.
  chart.fire.water   = NV;   // fire attacking water = weak
  chart.earth.fire   = NV;   // earth attacking fire = weak
  chart.wind.earth   = NV;   // wind attacking earth = weak
  chart.magic.wind   = NV;   // magic attacking wind = weak
  chart.water.magic  = NV;   // water attacking magic = weak

  function effectiveness(attackType, defenderType) {
    return (chart[attackType] && chart[attackType][defenderType]) ? chart[attackType][defenderType] : 1.0;
  }

  const ICONS = { fire:'🔥', water:'💧', earth:'🌿', wind:'💨', magic:'✨' };
  const LABELS = { fire:'Fire', water:'Water', earth:'Earth', wind:'Wind', magic:'Magic' };

  // What type is super-effective attacking this defender? Returns list.
  function strongAgainst(defenderType) {
    return T.filter(a => chart[a] && chart[a][defenderType] >= SE);
  }
  // What types are resisted by this attacker (defender takes 0.5x)? Returns list.
  function resistedBy(attackerType) {
    return T.filter(d => chart[attackerType] && chart[attackerType][d] <= NV);
  }

  // One simple kid-sentence per element (shown in Elements Guide).
  const MNEMONIC = {
    water: 'Water puts out Fire.',
    fire:  'Fire burns Plants.',
    earth: 'Plants stop Wind.',
    wind:  'Wind blows Magic.',
    magic: 'Magic splits Water.',
  };

  return { chart, effectiveness, ICONS, LABELS, MNEMONIC, list: T, strongAgainst, resistedBy };
})();
