// King James 2 — Arc 4: The Burning Sands
// Theme: hope, and partnering with people you don't trust yet.
// Treasure: Fire of Courage (atk +3, spd +2, grants Courage Burst, unlocks forge)
// New ally: Zephyra the Sun-Witch (Mornox's former apprentice)
// Bosses: Sand Dervish (mid) + Corrupted Sand Dragon (final)
// First on-screen Mornox appearance — 4 arcs of buildup land here.
//
// ⚠️ Act 1 only — Acts 2–4 pending tone review.

(function () {
  const scenes = [

    // =====================================================================
    //  1. INTRO — crown briefing. Sun is a killer. Sand in everything.
    // =====================================================================
    {
      id: 'desert_intro', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'crown',    text: 'Fourth treasure. Sun Desert. Fire of Courage is out there under a shrine.' },
        { speaker: 'narrator', text: 'Heat shimmers over the sand. The horizon moves when it shouldn\'t.' },
        { speaker: 'james',    text: 'It is SO hot. Why is it SO hot?' },
        { speaker: 'crown',    text: 'Sun went wrong out here a long time ago. Don\'t ask who. You already know.' },
        { speaker: 'james',    text: 'Mornox.' },
        { speaker: 'crown',    text: 'Yeah. Mornox. Watch for someone called Zephyra — old woman, lives in a tent at the shrine\'s edge. She knows more than she lets on.' },
        { speaker: 'crown',    text: 'Also: drink water. Actual water. Not sand. I will not tell you that twice.' },
      ],
      next: 'desert_oasis',
    },

    // =====================================================================
    //  2. OASIS — 4 prep choices. No dominated option (Rule 2.1).
    // =====================================================================
    {
      id: 'desert_oasis', type: 'choice', bg: 'desert',
      art: '🌴💧🌴\n 🧕 🍞',
      caption: 'A tiny oasis — one spring, two palms, a stranger sitting in the shade. A peddler has waterskins for sale.',
      crownLine: 'Prep now. No oases past here.',
      choices: [
        { label: 'Buy a Waterskin (-25g)', icon: '🫗', next: 'desert_oasis_buy',
          condition: { type: 'gold_at_least', amount: 25 },
          effects: [
            { type: 'grant_gold', amount: -25 },
            { type: 'grant_scroll', id: 'scroll_waterskin', amount: 1 },
          ] },
        { label: 'Fill canteen at the spring', icon: '💧', next: 'desert_oasis_canteen',
          effects: [{ type: 'set_flag', key: 'canteen_ready', value: true }] },
        { label: 'Give the stranger bread (-10g)', icon: '🍞', next: 'desert_oasis_bread',
          condition: { type: 'gold_at_least', amount: 10 },
          effects: [
            { type: 'grant_gold', amount: -10 },
            { type: 'set_flag', key: 'oasis_friend', value: true },
          ] },
        { label: 'Push on — no time to waste', icon: '🏜️', next: 'desert_scorpions' },
      ],
    },
    {
      id: 'desert_oasis_buy', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'The peddler hands you a leather waterskin, already cool.' },
        { speaker: 'narrator', text: '"Break it when you\'re hurting. Not before. Desert waits."' },
        { speaker: 'crown',    text: 'Heals ten in a pinch. Don\'t waste it on a scratch.' },
      ],
      next: 'desert_scorpions',
    },
    {
      id: 'desert_oasis_canteen', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'The spring is cold. You drink. You fill the canteen. The sun feels a notch less mean.' },
        { speaker: 'crown',    text: 'Smart. You\'ll find that useful later.' },
      ],
      next: 'desert_scorpions',
    },
    {
      id: 'desert_oasis_bread', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'The stranger — a woman wrapped against the sun — takes the bread with both hands. She nods once.' },
        { speaker: 'narrator', text: '"A kindness. I\'ll remember."' },
        { speaker: 'crown',    text: 'Nobody in a desert forgets a piece of bread. File that under "worth it."' },
      ],
      next: 'desert_scorpions',
    },

    // =====================================================================
    //  3. SCORPIONS + MIRAGE — mixed-type Act 1 fight (Rule 1.3)
    //     Teaches target-picker: Ember Burst on scorpion,
    //     magic moves (Brave Strike/Think Fast/Sun Burst) on mirage.
    // =====================================================================
    {
      id: 'desert_scorpions', type: 'battle', bg: 'desert',
      enemies: ['dune_scorpion', 'mirage_wisp'],
      rewards: { gold: [20, 32], xp: 42, drops: [] },
      next: 'desert_tent',
      onDefeat: 'desert_intro',
    },

    // =====================================================================
    // ⚠️ ACT 2–4 PENDING TONE REVIEW
    //    Stub below routes back to castle so the game doesn't softlock
    //    if a playtester reaches this point before Acts 2–4 are authored.
    // =====================================================================
    {
      id: 'desert_tent', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'crown',    text: 'Okay — we made it past the scorpions. Zephyra\'s tent is just ahead.' },
        { speaker: 'crown',    text: '(Arc in progress. Act 2 drops soon. Head back to the castle for now.)' },
      ],
      next: 'castle',
    },
  ];

  KJ.Registry.quests.add({
    id: 'desert',
    region: 'desert',
    treasure: 'fire_of_courage',
    entryScene: 'desert_intro',
    scenes,
  });
})();
