// King James 2 — Volcano helpers
// Listen-path predicate + flag accounting. Pure logic, no DOM.

window.KJ = window.KJ || {};

KJ.Volcano = (function () {

  // Beach has TWO valid kindness flags (the shipped Drifter arc) — either
  // counts as "the beach kindness flag" for the predicate but they don't
  // double-count.
  const KIND_PER_ARC = [
    ['riddle_tree_no_hints'],                 // forest
    ['yeti_friend'],                          // mountain
    ['serpent_friend', 'knows_drifter_past'], // beach (either)
    ['first_alliance'],                       // desert
  ];

  function kindnessFlagCount(state) {
    const flags = (state && state.progress && state.progress.flags) || {};
    let count = 0;
    for (const arc of KIND_PER_ARC) {
      if (arc.some(k => flags[k] === true)) count++;
    }
    return count;
  }

  function canListen(state) {
    return kindnessFlagCount(state) >= 3;
  }

  return { canListen, kindnessFlagCount, KIND_PER_ARC };
})();
