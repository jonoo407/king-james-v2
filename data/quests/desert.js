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
        { speaker: 'james',    text: 'It is SO hot. Why is it SO hot? Crown I can feel my EYEBALLS.' },
        { speaker: 'crown',    text: 'Sun went wrong out here a long time ago. Don\'t ask who. You already know.' },
        { speaker: 'james',    text: 'Mornox.' },
        { speaker: 'james',    text: '(small voice) Is he… here here? Like, WATCHING here?' },
        { speaker: 'crown',    text: 'Maybe. Probably. Don\'t think about it, kid. Watch for someone called Zephyra — old woman, lives in a tent at the shrine\'s edge. She knows more than she lets on.' },
        { speaker: 'crown',    text: 'Also: drink water. Actual water. Not sand. I will not tell you that twice.' },
        { speaker: 'james',    text: 'Roger that. Water. Not sand. Got it.' },
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
        { speaker: 'narrator', text: 'The stranger — a woman wrapped against the sun, hood low — takes the bread with both hands. She nods once.' },
        { speaker: 'james',    text: 'You need water too? The spring\'s right there — it\'s free.' },
        { speaker: 'narrator', text: '"I have water. I have had water a long time. Thank you, boy. A kindness. I\'ll remember."' },
        { speaker: 'james',    text: '(quietly) She said that weird.' },
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
    //  ACT 2 — MEET ZEPHYRA
    // =====================================================================
    //  4. TENT APPROACH — 4 paths, all route to desert_zephyra_meet.
    // =====================================================================
    {
      id: 'desert_tent', type: 'choice', bg: 'desert',
      art: '⛺\n 🌵  🌵',
      caption: 'A leather tent, patched a hundred times. A broken staff leans by the door. Something inside is humming — old, low, tired.',
      crownLine: 'Zephyra\'s tent. Pick your first impression carefully.',
      choices: [
        { label: 'Knock politely', icon: '👊', next: 'desert_zephyra_meet' },
        { label: 'Peek through the flap', icon: '👀', next: 'desert_tent_peek',
          effects: [{ type: 'set_flag', key: 'rude_start', value: true }] },
        { label: 'Call her name', icon: '📣', next: 'desert_tent_call' },
        { label: 'Burst in!', icon: '💥', next: 'desert_tent_burst',
          effects: [{ type: 'damage_party', amount: 5 }] },
      ],
    },
    {
      id: 'desert_tent_peek', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'You lift the flap an inch. An eye — old, wide awake, annoyed — meets yours from two inches away.' },
        { speaker: 'zephyra',  text: 'Do I LOOK like an exhibit.' },
        { speaker: 'james',    text: 'Nope! Nope nope nope.' },
        { speaker: 'crown',    text: 'Smooth, kid. Real smooth.' },
      ],
      next: 'desert_zephyra_meet',
    },
    {
      id: 'desert_tent_call', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'james',    text: 'Zephyra? Miss Zephyra? It\'s — um. It\'s the king. Small one. James.' },
        { speaker: 'narrator', text: 'Silence. Then the flap pulls back. An old woman in a dust-colored cloak steps out, hand shielding her eyes.' },
        { speaker: 'zephyra',  text: 'A child. At my tent. With a crown. Oh, I am going to have OPINIONS.' },
      ],
      next: 'desert_zephyra_meet',
    },
    {
      id: 'desert_tent_burst', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'You shoulder through the flap. A small, precise zap of gold light catches you in the chest — not hard, but *exact*.' },
        { speaker: 'zephyra',  text: 'That was a courtesy zap. The next one costs more.' },
        { speaker: 'james',    text: 'Ow. Valid. Sorry.' },
        { speaker: 'crown',    text: 'She respects the audacity. Marginally.' },
      ],
      next: 'desert_zephyra_meet',
    },

    // =====================================================================
    //  5. ZEPHYRA MEETS JAMES — pays off oasis_friend flag
    // =====================================================================
    {
      id: 'desert_zephyra_meet', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'zephyra',  text: 'So. The crown picked you. Huh. It\'s got WORSE taste than I remembered.' },
        { speaker: 'crown',    text: 'Excuse me, I am RIGHT HERE.' },
        { speaker: 'zephyra',  text: '(to crown) Hello, old friend. You sound tired.' },
        { speaker: 'crown',    text: '...wait. Do I KNOW you?' },
        { speaker: 'zephyra',  text: '(smiling, sad) Not yet. Not the way you will.' },
        { speaker: 'zephyra',  text: 'Boy. You came for the Fire of Courage. A certain wizard has been using this desert as his sandbox for a long time. You say his name in my tent, I\'ll know.' },
        { speaker: 'james',    text: 'Mornox.' },
        { speaker: 'zephyra',  text: '(long beat) ...yes. That one.' },
      ],
      next: 'desert_zephyra_meet_branch',
    },
    // Branch: if oasis_friend, pay off the hint explicitly. Else skip to the task.
    {
      id: 'desert_zephyra_meet_branch', type: 'choice', bg: 'desert',
      autoAdvance: true,
      caption: '',
      crownLine: '',
      choices: [
        { label: '(continue)', icon: '▶️', next: 'desert_zephyra_recognize',
          condition: { type: 'flag_set', key: 'oasis_friend', value: true } },
        { label: '(continue)', icon: '▶️', next: 'desert_zephyra_task',
          condition: { type: 'flag_not_set', key: 'oasis_friend' } },
      ],
    },
    {
      id: 'desert_zephyra_recognize', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'zephyra',  text: 'You fed me at the oasis. Didn\'t you.' },
        { speaker: 'james',    text: 'You were the stranger?!' },
        { speaker: 'zephyra',  text: 'I walk sometimes. I check who\'s coming. You didn\'t know I was anyone — you gave me bread anyway. That tells me something.' },
        { speaker: 'crown',    text: '(soft) Told you. Nobody in a desert forgets a piece of bread.' },
      ],
      next: 'desert_zephyra_task',
    },

    // =====================================================================
    //  6. ZEPHYRA'S TASK — 3 paths, NO loop (Rule 2.1)
    // =====================================================================
    {
      id: 'desert_zephyra_task', type: 'choice', bg: 'desert',
      art: '🔧☀️\n 🧙‍♀️',
      caption: 'Zephyra gestures at a broken brass disc: the sun-shield. "Help me mend this, and I\'ll get you to the shrine alive. Or barter. Or don\'t. Your call."',
      crownLine: 'She needs help. You need allies. Think.',
      choices: [
        { label: 'Help mend the sun-shield (-1 HP)', icon: '🔧', next: 'desert_zephyra_helped',
          effects: [
            { type: 'damage_party', amount: 1 },
            { type: 'set_flag', key: 'first_alliance', value: true },
          ] },
        { label: 'Barter — 20g for the Fire', icon: '💰', next: 'desert_zephyra_barter',
          condition: { type: 'gold_at_least', amount: 20 } },
        { label: 'Press on without her', icon: '🏜️', next: 'desert_zephyra_skip',
          effects: [{ type: 'mark_met_ally', id: 'zephyra' }] },
      ],
    },
    {
      id: 'desert_zephyra_helped', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'You hold the disc while she mutters the old words. The brass sings once and settles quiet.' },
        { speaker: 'zephyra',  text: 'Huh. You didn\'t drop it. First partner in four hundred years who didn\'t drop it.' },
        { speaker: 'james',    text: 'I dropped the SONG part a little.' },
        { speaker: 'zephyra',  text: 'The song is fine, boy. The song is fine.' },
        { speaker: 'crown',    text: '(quietly, to James) She\'s cracking. That\'s good. Keep going.' },
      ],
      next: 'desert_dervish_pre',
    },
    {
      id: 'desert_zephyra_barter', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'james',    text: '(offers gold) Twenty gold. For the Fire. Deal?' },
        { speaker: 'zephyra',  text: '(laughs — a real, dry laugh) Oh, boy. You cannot BUY fire of courage. You spend it.' },
        { speaker: 'narrator', text: 'She closes your fist around the coins and pushes your hand back.' },
        { speaker: 'zephyra',  text: 'Keep your money. Go face the wind-thing on the dune. If you come back, we\'ll talk about the shrine.' },
      ],
      next: 'desert_dervish_pre',
    },
    {
      id: 'desert_zephyra_skip', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'james',    text: 'Thanks but — I got this. Treasure won\'t wait.' },
        { speaker: 'zephyra',  text: 'Mm. As you say. I\'ll be here if the desert chews you up.' },
        { speaker: 'crown',    text: 'She\'ll remember this. That\'s not a threat — that\'s just a thing. Keep moving.' },
      ],
      next: 'desert_dervish_pre',
    },

    // =====================================================================
    //  7. DERVISH PRE — 3 paths, Zephyra-buff gated on first_alliance
    // =====================================================================
    {
      id: 'desert_dervish_pre', type: 'choice', bg: 'desert',
      art: '🌪️\n 🏜️🏜️',
      caption: 'On the next dune, a spinning tower of sand — the Sand Dervish. Wind type. Earth moves shine here.',
      crownLine: 'Iron Slash, Swing — anything earth. It\'ll hit like a rock.',
      choices: [
        { label: 'Zephyra buffs you (+10 HP)', icon: '✨', next: 'desert_dervish_buff',
          condition: { type: 'flag_set', key: 'first_alliance', value: true },
          effects: [{ type: 'heal_party', amount: 10 }] },
        { label: 'Buy a wind-shield scroll (-20g, +8 HP)', icon: '📜', next: 'desert_dervish_scroll',
          condition: { type: 'gold_at_least', amount: 20 },
          effects: [
            { type: 'grant_gold', amount: -20 },
            { type: 'heal_party', amount: 8 },
          ] },
        { label: 'Charge in!', icon: '⚔️', next: 'desert_dervish_fight' },
      ],
    },
    {
      id: 'desert_dervish_buff', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'zephyra',  text: 'Hold still. Old trick. Works better when someone holds still.' },
        { speaker: 'narrator', text: 'Warm gold light rolls across your shoulders. Your cuts close.' },
        { speaker: 'james',    text: 'Woah. That tickled in my BONES.' },
      ],
      next: 'desert_dervish_fight',
    },
    {
      id: 'desert_dervish_scroll', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'A wayward peddler sells you a paper charm inked in blue. "For the wind. It won\'t cut you as much."' },
        { speaker: 'crown',    text: 'Cheap fix. Does the job.' },
      ],
      next: 'desert_dervish_fight',
    },

    // =====================================================================
    //  8. DERVISH FIGHT — wind mid-boss
    // =====================================================================
    {
      id: 'desert_dervish_fight', type: 'battle', bg: 'desert',
      enemies: ['sand_dervish'],
      rewards: { gold: [55, 85], xp: 75,
        drops: [{ gear: 'dune_runners', chance: 0.5 }, { gear: 'desert_plate', chance: 0.5 }] },
      next: 'desert_shrine_reveal',
      onDefeat: 'desert_dervish_pre',
    },

    // =====================================================================
    //  ACT 3 — SHRINE AND DRAGON
    //  (Crown tone shifts lighter after the Mornox moment — spec note)
    // =====================================================================
    //  9. SHRINE REVEAL — the spellbook. Zephyra's secret opens here.
    // =====================================================================
    {
      id: 'desert_shrine_reveal', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'Past the dunes: an old shrine of pale stone. Inside, dust like fine gold, and a leather book open on a pedestal.' },
        { speaker: 'james',    text: '(flips a page) This handwriting... Crown, it looks like the scroll from the troll\'s cave. Word for word the same.' },
        { speaker: 'crown',    text: '(very quiet) It IS the same. That\'s Mornox. Younger. His hand was steadier then.' },
        { speaker: 'narrator', text: 'Zephyra steps up behind you. She sees the book. She sits down in the sand. She sits down all the way.' },
        { speaker: 'zephyra',  text: 'Oh. You found that one. Of course you did.' },
        { speaker: 'james',    text: 'You KNEW him.' },
        { speaker: 'zephyra',  text: 'Worse, boy. I was his student. Now stop looking at me like that and come sit. I\'ll show you the part they don\'t write down.' },
      ],
      next: 'desert_zephyra_flashback',
    },

    // =====================================================================
    //  10. FLASHBACK — sepia dream sequence
    // =====================================================================
    {
      id: 'desert_zephyra_flashback', type: 'dialogue', bg: 'flashback',
      beats: [
        { speaker: 'narrator', text: '*Three hundred years ago. A young wizard in black. A younger apprentice in gold.*' },
        { speaker: 'narrator', text: '*He teaches. She learns faster than he does. They laugh. Actually laugh.*' },
        { speaker: 'zephyra',  text: 'He was brilliant. That was the problem. Brilliant AND lonely AND impatient. He made a bad bet. I tried to help him unmake it.' },
        { speaker: 'narrator', text: '*The spell backfires. Gold fire across the sky. The sand turns to glass where she falls.*' },
        { speaker: 'zephyra',  text: 'I was the last person to love him. That\'s why he ran. It\'s harder to be a monster in front of somebody who remembers when you weren\'t.' },
        { speaker: 'james',    text: '...so he was, like, kinda okay once? That\'s WEIRD.' },
        { speaker: 'zephyra',  text: 'Weird, yes. Also true.' },
      ],
      next: 'desert_mornox_appears',
    },

    // =====================================================================
    //  11. MORNOX APPEARS — first on-screen moment (5 beats). SETS saw_mornox.
    // =====================================================================
    {
      id: 'desert_mornox_appears', type: 'dialogue', bg: 'rescue',
      beats: [
        { speaker: 'narrator', text: 'The torch on the wall goes out. The wind stops. The sand holds its breath.' },
        { speaker: 'narrator', text: '*A figure stands in the shrine doorway. Robes. Long shadow. No sound.*' },
        { speaker: 'zephyra',  text: '(voice cracking) ...you.' },
        { speaker: 'mornox',   text: 'You\'re almost done. Good boy. My apprentice sends her regards, I\'m sure.' },
        { speaker: 'narrator', text: '*He looks only at Zephyra. Not at James. Then he isn\'t there anymore.*' },
        { speaker: 'crown',    text: '(soft) Kid. That was him.' },
        { speaker: 'james',    text: '(small) He looked tired.' },
      ],
      effects: [{ type: 'set_flag', key: 'saw_mornox', value: true }],
      next: 'desert_dragon_pre',
    },

    // =====================================================================
    //  12. DRAGON PRE — 3 paths, Zephyra-joins gated on first_alliance
    // =====================================================================
    {
      id: 'desert_dragon_pre', type: 'choice', bg: 'desert',
      art: '🐉🔥\n ☀️  🏜️',
      caption: 'Past the shrine, a pit of heat — and in it, the Corrupted Sand Dragon, smoke curling off its scales. A Sun Wisp circles its head.',
      crownLine: 'Mixed fight. Water moves for the dragon. Prep matters.',
      choices: [
        { label: 'Zephyra joins the fight', icon: '🧙‍♀️', next: 'desert_dragon_zephyra',
          condition: { type: 'flag_set', key: 'first_alliance', value: true },
          effects: [{ type: 'recruit_ally', id: 'zephyra' }] },
        { label: 'Buy a Fire Bolt scroll (-40g)', icon: '📜', next: 'desert_dragon_scroll',
          condition: { type: 'gold_at_least', amount: 40 },
          effects: [
            { type: 'grant_gold', amount: -40 },
            { type: 'grant_scroll', id: 'scroll_fire', amount: 1 },
          ] },
        { label: 'Charge in!', icon: '⚔️', next: 'desert_dragon_fight' },
      ],
    },
    {
      id: 'desert_dragon_zephyra', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'zephyra',  text: 'Move over, boy. I haven\'t had a good fight in a century.' },
        { speaker: 'james',    text: 'You\'re coming??' },
        { speaker: 'zephyra',  text: 'He sent that thing to hurt me. I get to hurt it back. Simple arithmetic.' },
        { speaker: 'crown',    text: 'Now THIS is a team-up. I am HERE for this.' },
      ],
      next: 'desert_dragon_fight',
    },
    {
      id: 'desert_dragon_scroll', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'You tuck the scroll into your belt — a neat packet of red wax and trouble.' },
        { speaker: 'crown',    text: 'Dragon eats fire, kid. Don\'t bonk him with THAT one — save it for the wisp.' },
      ],
      next: 'desert_dragon_fight',
    },

    // =====================================================================
    //  13. DRAGON FIGHT — fire boss + fire add. Water moves shine.
    // =====================================================================
    {
      id: 'desert_dragon_fight', type: 'battle', bg: 'desert',
      enemies: ['sand_dragon', 'sun_wisp'],
      rewards: { gold: [160, 220], xp: 150,
        drops: [{ gear: 'flame_scimitar', chance: 1.0 }] },
      next: 'desert_reward',
      onDefeat: 'desert_dragon_pre',
    },

    // =====================================================================
    //  ACT 4 — REWARD, REFLECTION, INTERVENTION
    // =====================================================================
    //  14. REWARD — Fire of Courage granted, forge room unlocks
    // =====================================================================
    {
      id: 'desert_reward', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'In the dragon\'s dust, the shrine opens for real. At its center: a lantern shape of living flame, cool to touch, warm to hold.' },
        { speaker: 'crown',    text: 'The Fire of Courage. Fourth treasure. Kid — you DID it.' },
        { speaker: 'zephyra',  text: 'Courage, boy. Not bravery. Bravery\'s loud. Courage is what happens on day two.' },
        { speaker: 'james',    text: '...day two of what?' },
        { speaker: 'zephyra',  text: 'Everything. You\'ll see.' },
        { speaker: 'narrator', text: 'She presses a folded letter into the crown\'s velvet lining.' },
        { speaker: 'zephyra',  text: 'For him. When you\'re ready. Not before.' },
      ],
      effects: [
        { type: 'grant_treasure', id: 'fire_of_courage' },
        { type: 'unlock_room',    id: 'forge' },
        { type: 'grant_trophy',   id: 'sand_dragon' },
        { type: 'complete_quest', id: 'desert' },
      ],
      next: 'desert_mornox_aftermath',
    },

    // =====================================================================
    //  15. AFTERMATH — the breath between seeing Mornox and going home.
    //  Crown's tone shifts lighter here (still serious, but reaching for
    //  humor again — matches "dry then lighter post-reveal" direction).
    // =====================================================================
    {
      id: 'desert_mornox_aftermath', type: 'dialogue', bg: 'desert',
      beats: [
        { speaker: 'narrator', text: 'Outside the shrine, sand still settling. Late sun, long shadows.' },
        { speaker: 'james',    text: 'He looked... tired.' },
        { speaker: 'crown',    text: 'He IS tired. That\'s the hard part, kid. He\'s not a monster in a tower. He\'s just an old man who\'s been awake too long.' },
        { speaker: 'james',    text: '...is he gonna be at the next one?' },
        { speaker: 'crown',    text: 'Yeah. He will. And we still have to stop him.' },
        { speaker: 'zephyra',  text: 'But you don\'t have to do it the way he expects, boy. That\'s the thing you have that he doesn\'t.' },
        { speaker: 'james',    text: 'What\'s that?' },
        { speaker: 'zephyra',  text: 'Options. You still have options.' },
        { speaker: 'crown',    text: '(lightly) Options AND a fresh scimitar. Let\'s go home.' },
      ],
      next: 'desert_outro_mornox',
    },

    // =====================================================================
    //  16. CASTLE OUTRO — Mornox intervention. Torches dim. Quiet.
    // =====================================================================
    {
      id: 'desert_outro_mornox', type: 'dialogue', bg: 'rescue',
      beats: [
        { speaker: 'narrator', text: 'Back at the castle. Throne hall. The torches dim without a reason — all at once, like somebody leaned on them.' },
        { speaker: 'narrator', text: '*For one heartbeat, a figure stands by the throne. Then nothing.*' },
        { speaker: 'mornox',   text: 'I\'ve been waiting four hundred years. I can wait a week more.' },
        { speaker: 'mornox',   text: 'I\'m so tired, little king. You\'ll understand one day. Maybe sooner than you\'d like.' },
        { speaker: 'narrator', text: 'A single letter lies on the throne. Zephyra\'s seal. The crown\'s velvet is warm where she hid it.' },
        { speaker: 'crown',    text: '(reading, quiet) "He is not past saving. Neither are you. — Z."' },
        { speaker: 'crown',    text: 'One treasure left, kid. The volcano\'s waiting. Eat something first. That\'s an order.' },
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
