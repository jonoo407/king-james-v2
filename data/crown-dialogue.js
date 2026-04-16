// King James 2 — Crown Dialogue Pools
// Each pool: context, coherenceRequired (0..5), lines[].
// Engine picks lines from the highest pool whose coherenceRequired <= current.

(function () {
  const pools = [
    // Death / rescue — the "I magically saved you" flavor
    { id: 'death_rescue_0', context: 'death_rescue', coherenceRequired: 0, lines: [
      'Oh relax, I saved you. You\'re welcome.',
      'Magic crown magic! Don\'t tell anyone.',
      'Poof! ...wait did that work? Yes! Yes it worked.',
      'I zapped you home. Don\'t ask how.',
      'I MAY have done something magical. Probably.',
      'You owe me. Again. I\'m keeping count.',
    ]},

    // Castle general chatter — plays on castle hub
    { id: 'castle_general_0', context: 'castle_general', coherenceRequired: 0, lines: [
      'Bzzt... welcome back, James... *fzz*',
      'Find... *crackle* ...the first treasure... in the forest...',
      'I am... a crown... *glitch* ...mostly.',
      'Go look at... the... map thingy...',
      'Are those... your socks? *fzz*',
    ]},
    { id: 'castle_general_1', context: 'castle_general', coherenceRequired: 1, lines: [
      'Back so soon? Nice.',
      'Four treasures to go. Let\'s move.',
      'Pro tip: change your gear before hard fights.',
      'The library\'s open. Maybe read a thing?',
    ]},
    { id: 'castle_general_3', context: 'castle_general', coherenceRequired: 3, lines: [
      'Three down, two to go. You\'re doing great, kid.',
      'I\'m starting to feel like myself again. Ish.',
      'Don\'t forget to bring allies — you\'ll need them.',
    ]},
    { id: 'castle_general_5', context: 'castle_general', coherenceRequired: 5, lines: [
      'All five! Now — the wizard.',
      'Ready when you are, Your Majesty.',
    ]},

    // Battle opener (optional; used by battle scenes)
    { id: 'battle_open_0', context: 'battle_open', coherenceRequired: 0, lines: [
      'Don\'t just SWING. Think!',
      'Type matters. Check the icons.',
      'Patience, Schemer.',
    ]},

    // First battle tutorial (played once when `tutorial_battle_done` flag is false)
    { id: 'battle_tutorial', context: 'battle_tutorial', coherenceRequired: 0, lines: [
      'See the ⚡? That means Super! Beats this monster\'s type.',
      'Gray 🛡️ moves are weak. Don\'t waste them.',
      'Every monster has ONE weakness. Find the ⚡.',
      'Goblins are plants. Fire burns plants. Easy.',
    ]},
  ];
  pools.forEach(p => KJ.Registry.crownDialogue.add(p));
})();
