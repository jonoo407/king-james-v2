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
      'Bzzzt — left foot. *fzz* ...your OTHER left.',
      'The forest. *crackle* I keep saying it. The FOREST.',
      'Ow. Static. *fzz* Don\'t laugh.',
      'I had a name once. *fzz* Started with a... letter, definitely.',
      'Equipment. Allies. Plan. *bzzt* THEN go.',
      'You hum when you walk. Did you know that? *fzz*',
      'Brave little King. Even if you ARE wearing a tunic backwards.',
    ]},
    { id: 'castle_general_1', context: 'castle_general', coherenceRequired: 1, lines: [
      'Back so soon? Nice.',
      'Four treasures to go. Let\'s move.',
      'Pro tip: change your gear before hard fights.',
      'The library\'s open. Maybe read a thing?',
      'I can almost taste color again. Weird.',
      'Bring an ally next time. You\'re too brave for one boy.',
      'You smell like outside. I respect that.',
      'Mornox is watching. Don\'t flinch — but don\'t dawdle.',
    ]},
    { id: 'castle_general_3', context: 'castle_general', coherenceRequired: 3, lines: [
      'Three down, two to go. You\'re doing great, kid.',
      'I\'m starting to feel like myself again. Ish.',
      'Don\'t forget to bring allies — you\'ll need them.',
      'Three treasures. THREE. The kingdom is starting to whisper your name.',
      'When this is over I\'m going to nap for a YEAR.',
      'Your hair is doing a thing. ...I like it.',
    ]},
    // Post-Desert — kid has seen Mornox in person. Tone shifts heavier.
    { id: 'castle_general_4', context: 'castle_general', coherenceRequired: 4, lines: [
      'Four. One more, kid. One more.',
      'You saw him. I saw him through you. Neither of us is sleeping tonight.',
      'Zephyra\'s letters are keeping me company. Hers say "be kind to him."',
      'The Forge is lit. When you\'re ready, the volcano isn\'t going anywhere.',
      'I keep thinking about his face. Don\'t tell him I said that.',
    ]},
    { id: 'castle_general_5', context: 'castle_general', coherenceRequired: 5, lines: [
      'All five! Now — the wizard.',
      'Ready when you are, Your Majesty.',
    ]},

    // Seen-Mornox pool — plays after desert_mornox_appears sets `saw_mornox` flag.
    // Castle/battle/choice scenes can pull from here when coherence >= 4.
    { id: 'saw_mornox_4', context: 'saw_mornox', coherenceRequired: 4, lines: [
      'He looked so tired, kid.',
      'He\'s real. That\'s the hard part.',
      'Four hundred years. Can you imagine.',
      'We still have to stop him. We just... know who he is now.',
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
      'Check the monster card — "weak:" tells you what hurts it. Match that type.',
    ]},
  ];
  pools.forEach(p => KJ.Registry.crownDialogue.add(p));
})();
