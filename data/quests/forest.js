// King James 2 — v1 Quest: The Forest
// Choices have real tradeoffs (HP, gold, XP, ally access, shortcuts).
// No choice is obviously best; kids must think about what they value.

(function () {
  const scenes = [

    // =====================================================================
    //  1. INTRO (crown briefing)
    // =====================================================================
    {
      id: 'forest_intro', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'crown',  text: 'Bzzt... Forest... bzzt... smells like... bees?' },
        { speaker: 'crown',  text: 'The Gem of Wisdom. In here somewhere. Go find it.' },
        { speaker: 'james',  text: 'Easy! Step one: stab things. Step two: WIN!' },
        { speaker: 'crown',  text: 'There\'s no step two. There\'s NEVER a step two. *fzzt*' },
      ],
      next: 'forest_1',
    },

    // =====================================================================
    //  2. MEET FOXY — every helping path has a DIFFERENT cost profile,
    //     so no option is strictly best. You trade HP / gold / skip.
    //
    //     - Feed her (-1 HP):  she eats, wiggles free; you scratch hand.
    //                          Recruit. Cheap HP cost. No extras.
    //     - Cut thorns (-3 HP): painful but you free her AND she shows
    //                          you a shortcut past the wolf later.
    //                          Recruit + shortcut. Biggest HP cost, biggest reward.
    //     - Untangle (-5g):    slow careful work; you hear coins nearby
    //                          but can't look away. Recruit. Gold cost, no HP.
    //     - Shove past:        skip. No recruit, no cost, no reward.
    // =====================================================================
    {
      id: 'forest_1', type: 'choice', bg: 'forest',
      art: '🌲  🦊  🌲\n    🥀🥀',
      caption: 'A fox is tangled in thorns. Too tired to wriggle out.',
      crownLine: 'Every way costs something. What do you spend?',
      choices: [
        { label: 'Feed her to perk her up (-1 HP)', icon: '🍪', next: 'forest_foxy_feed',
          effects: [
            { type: 'recruit_ally', id: 'foxy' },
            { type: 'damage_party', amount: 1 },
          ] },
        { label: 'Cut thorns fast (-3 HP)', icon: '🗡️', next: 'forest_foxy_thorn',
          effects: [
            { type: 'recruit_ally', id: 'foxy' },
            { type: 'damage_party', amount: 3 },
            { type: 'set_flag', key: 'foxy_shortcut', value: true },
          ] },
        { label: 'Untangle gently (-5 gold)', icon: '🪢', next: 'forest_foxy_untangle',
          condition: { type: 'gold_at_least', amount: 5 },
          effects: [
            { type: 'recruit_ally', id: 'foxy' },
            { type: 'grant_gold', amount: -5 },
          ] },
        { label: 'Ask why she\'s stuck', icon: '💬', next: 'forest_foxy_talk' },
        { label: 'Shove past', icon: '💨', next: 'forest_foxy_miss',
          effects: [{ type: 'mark_met_ally', id: 'foxy' }] },
      ],
    },

    {
      id: 'forest_foxy_feed', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'foxy',  text: '*gulp* Oh you had CHEESE?! I love you. Briefly.' },
        { speaker: 'james', text: 'Ow — thorn just nipped my thumb.' },
        { speaker: 'foxy',  text: 'Come on, cheese-kid. Let\'s walk.' },
      ],
      next: 'forest_goblins',
    },

    {
      id: 'forest_foxy_thorn', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'foxy',  text: 'OW careful HEY the HAIR!! ...careful the HAIR.' },
        { speaker: 'foxy',  text: 'Okay. That counts. You actually bled for me.' },
        { speaker: 'foxy',  text: 'There\'s a goat trail ahead. Skips the mean wolf later. Come on.' },
        { speaker: 'crown', text: 'Good trade. File that shortcut.' },
      ],
      next: 'forest_goblins',
    },

    {
      id: 'forest_foxy_untangle', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'james', text: '(Pry... lift... un-TWIST that one...)' },
        { speaker: 'james', text: '(...is that coins jingling? Behind me? Oh WELL.)' },
        { speaker: 'foxy',  text: 'You could have grabbed those coins. You DIDN\'T. Weird. I like it.' },
      ],
      next: 'forest_goblins',
    },

    {
      id: 'forest_foxy_talk', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'foxy', text: 'I was chasing a beetle. A SHINY beetle. Big mistake.' },
        { speaker: 'foxy', text: 'Been stuck since sunup. Upside down a lot.' },
        { speaker: 'foxy', text: 'Help me, or don\'t. I won\'t be rude about it.' },
      ],
      next: 'forest_foxy_talk_pick',
    },

    {
      id: 'forest_foxy_talk_pick', type: 'choice', bg: 'forest',
      art: '🦊 ❓',
      caption: '"Well? What\'s it gonna be?"',
      choices: [
        { label: 'Feed her (-1 HP)', icon: '🍪', next: 'forest_foxy_feed',
          effects: [
            { type: 'recruit_ally', id: 'foxy' },
            { type: 'damage_party', amount: 1 },
          ] },
        { label: 'Cut thorns (-3 HP)', icon: '🗡️', next: 'forest_foxy_thorn',
          effects: [
            { type: 'recruit_ally', id: 'foxy' },
            { type: 'damage_party', amount: 3 },
            { type: 'set_flag', key: 'foxy_shortcut', value: true },
          ] },
        { label: 'Untangle (-5 gold)', icon: '🪢', next: 'forest_foxy_untangle',
          condition: { type: 'gold_at_least', amount: 5 },
          effects: [
            { type: 'recruit_ally', id: 'foxy' },
            { type: 'grant_gold', amount: -5 },
          ] },
        { label: 'Sorry, busy. Bye', icon: '👋', next: 'forest_foxy_miss',
          effects: [{ type: 'mark_met_ally', id: 'foxy' }] },
      ],
    },

    {
      id: 'forest_foxy_miss', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'foxy',  text: 'Wow. OKAY. Cool cool cool.' },
        { speaker: 'crown', text: 'She\'s going to tell other foxes. There are a LOT of foxes.' },
      ],
      next: 'forest_goblins',
    },

    // =====================================================================
    //  3. GOBLIN SCOUTS — pre-combat choice with 3 paths
    //     - Fight: best XP + gold, risk HP
    //     - Sneak (with Foxy): safe skip, no XP
    //     - Sneak (no Foxy): might still work, might take a scratch
    //     - Bribe: skip entirely, -15g, no XP
    // =====================================================================
    {
      id: 'forest_goblins', type: 'choice', bg: 'forest',
      art: '🌲 👺 👺 🌲',
      caption: 'Two goblin scouts. Small. Loud. Weirdly sticky.',
      crownLine: 'Fight for XP. Sneak for health. Bribe for embarrassment.',
      choices: [
        { label: 'Fight (XP + gold)', icon: '⚔️', next: 'forest_goblins_fight' },
        { label: 'Sneak past (with Foxy)', icon: '🦊', next: 'forest_goblins_sneak_safe',
          condition: { type: 'ally_recruited', id: 'foxy' } },
        { label: 'Try to sneak (risky)', icon: '🤫', next: 'forest_goblins_sneak_risky',
          condition: null },
        { label: 'Bribe (-15 gold)', icon: '🪙', next: 'forest_goblins_bribe',
          condition: { type: 'gold_at_least', amount: 15 },
          effects: [{ type: 'grant_gold', amount: -15 }] },
      ],
    },

    {
      id: 'forest_goblins_fight', type: 'battle', bg: 'forest',
      enemies: ['goblin_scout', 'goblin_scout'],
      rewards: { gold: [6, 12], xp: 12, drops: [
        { gear: 'forest_boots', chance: 0.25 },
      ] },
      next: 'forest_riddle',
      onDefeat: 'forest_intro',
    },

    {
      id: 'forest_goblins_sneak_safe', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'foxy',  text: 'Low. Quieter. Stop BREATHING so loud.' },
        { speaker: 'james', text: 'I feel sneaky. I AM sneaky.' },
        { speaker: 'crown', text: 'Nailed it. Zero XP, but zero bruises. Trade-offs, hero.' },
      ],
      next: 'forest_riddle',
    },

    {
      id: 'forest_goblins_sneak_risky', type: 'choice', bg: 'forest',
      art: '👺 👀 🧒',
      caption: 'You crunch a twig. A goblin turns. Slowly.',
      crownLine: 'Be a rock. Or be Usain Bolt. No middle.',
      choices: [
        { label: 'Freeze! (-2 HP)', icon: '🗿', next: 'forest_goblins_freeze',
          effects: [{ type: 'damage_party', amount: 2 }] },
        { label: 'Run — fight them!', icon: '🏃', next: 'forest_goblins_fight' },
      ],
    },

    {
      id: 'forest_goblins_freeze', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'james', text: '(do-not-move do-not-move do-not-MOVE—)' },
        { speaker: 'crown', text: 'He looked RIGHT at you. Walked on. You are SO lucky.' },
      ],
      next: 'forest_riddle',
    },

    {
      id: 'forest_goblins_bribe', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'james', text: 'Look — fifteen gold. Buy a hat. Go home. Everyone wins.' },
        { speaker: 'crown', text: 'Paying to avoid a fight. Sad. But it worked!' },
      ],
      next: 'forest_riddle',
    },

    // =====================================================================
    //  4. RIDDLE TREE (puzzle)
    //     - Solve with no hints: Owlette joins
    //     - Solve with hints: continue but no bonus
    // =====================================================================
    {
      id: 'forest_riddle', type: 'puzzle', bg: 'forest',
      puzzleType: 'word_riddle',
      data: {
        riddles: [
          { prompt: '"I\'m cold. I\'m white. I fall from the sky. What am I?"',
            options: ['🔥', '❄️', '🍂'], correct: 1 },
          { prompt: '"I have one eye but cannot see. Thread me through, and I make things whole."',
            options: ['🐱', '🪡', '🐠'], correct: 1 },
          { prompt: '"The more you take, the more you leave behind."',
            options: ['🐾', '💰', '🍰'], correct: 0 },
        ],
        allowHints: true,
      },
      onSolveAllNoHints: [
        { type: 'recruit_ally', id: 'owlette' },
        { type: 'set_flag', key: 'riddle_tree_no_hints', value: true },
      ],
      next: 'forest_path',
    },

    // =====================================================================
    //  5. FORK — pond (slow, meet Ribbit) vs direct (fast, +10g)
    // =====================================================================
    {
      id: 'forest_path', type: 'choice', bg: 'forest',
      art: '🌲 🪨 🌲\n  ⬇️    ➡️\n 🐸    🌳',
      caption: 'A pond trail left. A straight path right.',
      crownLine: 'Frog noises that way. Coins clinking the other. Choose.',
      choices: [
        { label: 'Pond path (meet new friend?)', icon: '🐸', next: 'forest_pond',
          effects: [{ type: 'set_flag', key: 'found_wild_pond', value: true }] },
        { label: 'Direct path (+10 gold)', icon: '🌳', next: 'forest_skip_pond',
          effects: [{ type: 'grant_gold', amount: 10 }] },
      ],
    },

    {
      id: 'forest_skip_pond', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'james', text: 'Coins! On the ACTUAL ground! Some days are just GIFTS.' },
        { speaker: 'crown', text: 'Shortcut paid. Onward.' },
      ],
      next: 'forest_glade_choice',
    },

    // =====================================================================
    //  5.5 FAIRY GLADE — optional side encounter with magic-type enemies.
    //  Teaches kid that not all Forest enemies are earth; gives a reason
    //  to bring Wind moves (Leaf Kick / Kick are SUPER vs Magic).
    // =====================================================================
    {
      id: 'forest_glade_choice', type: 'choice', bg: 'forest',
      art: '🌲🧚🌲\n    🦇',
      caption: 'Glittering sprites giggle. A bat flaps in slow circles.',
      crownLine: 'Sprites want ✨-stuff. Bats want 💨-stuff. Two different problems.',
      choices: [
        { label: 'Into the grove!', icon: '⚔️', next: 'forest_glade_fight' },
        { label: 'Tiptoe past (skip)', icon: '🤫', next: 'forest_wolf_pre' },
      ],
    },
    {
      // Mixed-type encounter: Sprite (magic, weak to 💨 Wind) + Bat (wind, weak to 🌿 Earth).
      // Forces kid to use TWO different move types in one fight — Swing/Iron Slash finally has a home.
      id: 'forest_glade_fight', type: 'battle', bg: 'forest',
      enemies: ['forest_sprite', 'whirl_bat'],
      rewards: { gold: [12, 20], xp: 18, drops: [
        { gear: 'lucky_charm', chance: 0.3 },
        { gear: 'leather_armor', chance: 0.35 },
      ] },
      next: 'forest_wolf_pre',
      onDefeat: 'forest_intro',
    },

    // =====================================================================
    //  6. POND — Ribbit with 4 real choices
    //     - Lift log: recruit + cost HP
    //     - Slide it (needs Owlette): recruit, no cost
    //     - Feed bugs (+5g): skip recruit, small reward
    //     - Leave: no cost, no reward
    // =====================================================================
    {
      id: 'forest_pond', type: 'choice', bg: 'forest',
      art: '💧 🐸 💧\n    🪵',
      caption: 'A frog pinned under a log. Sad, wet croaks.',
      crownLine: 'Frog under log. Classic. Pick your rescue style.',
      choices: [
        { label: 'Lift the log (-2 HP)', icon: '💪', next: 'forest_pond_lift',
          effects: [
            { type: 'recruit_ally', id: 'ribbit' },
            { type: 'damage_party', amount: 2 },
          ] },
        { label: 'Slide log (needs Owlette)', icon: '🧠', next: 'forest_pond_slide',
          condition: { type: 'ally_recruited', id: 'owlette' },
          effects: [{ type: 'recruit_ally', id: 'ribbit' }] },
        { label: 'Feed bugs, move on (+5g)', icon: '🐛', next: 'forest_pond_bugs',
          effects: [
            { type: 'mark_met_ally', id: 'ribbit' },
            { type: 'grant_gold', amount: 5 },
          ] },
        { label: 'Leave him', icon: '👋', next: 'forest_pond_leave',
          effects: [{ type: 'mark_met_ally', id: 'ribbit' }] },
      ],
    },

    {
      id: 'forest_pond_lift', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'ribbit', text: 'Rrrribbit... thanks, kid. You lift good.' },
        { speaker: 'james',  text: 'Oof, my BACK. Worth it though. Probably.' },
      ],
      next: 'forest_glade_choice',
    },

    {
      id: 'forest_pond_slide', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'owlette', text: 'Obviously — you use the ANGLE. Not the muscle. HOO boy, not the muscle.' },
        { speaker: 'ribbit',  text: 'Smooth! Wait — was that physics? Do I gotta learn physics now?' },
      ],
      next: 'forest_glade_choice',
    },

    {
      id: 'forest_pond_bugs', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'ribbit', text: 'Mmph. Bugs. Thanks I guess. Still stuck, but... snacks.' },
        { speaker: 'ribbit', text: 'Here — somebody dropped coins. Yours. Free.' },
      ],
      next: 'forest_glade_choice',
    },

    {
      id: 'forest_pond_leave', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'ribbit', text: '...ribbit.' },
        { speaker: 'crown',  text: 'Cold, James. Cold.' },
      ],
      next: 'forest_glade_choice',
    },

    // =====================================================================
    //  7. BRIAR WOLF — pre-fight with 4 real paths
    //     - Fight: best XP + gold + item chance
    //     - Foxy shortcut (flag): skip battle, no XP
    //     - Climb around (-3 HP): skip battle, no XP
    //     - Lure with shiny (-5g): skip battle, no XP
    // =====================================================================
    {
      id: 'forest_wolf_pre', type: 'choice', bg: 'forest',
      art: '🌳 🐺 🌳',
      caption: 'A Briar Wolf paces. Bigger than you. Angrier than you.',
      crownLine: '🔥 Fire burns plants. Spark away. Or be clever and skip.',
      choices: [
        { label: 'Fight (XP + gear)', icon: '⚔️', next: 'forest_wolf_fight' },
        { label: 'Take Foxy\'s goat trail', icon: '🦊', next: 'forest_wolf_skip_trail',
          condition: { type: 'flag_set', key: 'foxy_shortcut', value: true } },
        { label: 'Climb around (-3 HP)', icon: '🧗', next: 'forest_wolf_climb',
          effects: [{ type: 'damage_party', amount: 3 }] },
        { label: 'Lure with shiny (-5g)', icon: '✨', next: 'forest_wolf_lure',
          condition: { type: 'gold_at_least', amount: 5 },
          effects: [{ type: 'grant_gold', amount: -5 }] },
      ],
    },

    {
      id: 'forest_wolf_fight', type: 'battle', bg: 'forest',
      enemies: ['briar_wolf'],
      rewards: { gold: [18, 30], xp: 25, drops: [
        { gear: 'iron_sword', chance: 0.45 },
        { gear: 'lucky_charm', chance: 0.4 },
      ] },
      next: 'forest_troll_pre',
      onDefeat: 'forest_intro',
    },

    {
      id: 'forest_wolf_skip_trail', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'foxy',  text: 'This way. Quiet paws. No dramatic sighs.' },
        { speaker: 'crown', text: 'Goat trail paid off. Wolf never knew you were there.' },
      ],
      next: 'forest_troll_pre',
    },

    {
      id: 'forest_wolf_climb', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'james', text: 'Ow ow BARK ow SCRAPE ow LEAF IN MY MOUTH.' },
        { speaker: 'crown', text: 'You made it. Scrapes heal. Mostly. Pride doesn\'t.' },
      ],
      next: 'forest_troll_pre',
    },

    {
      id: 'forest_wolf_lure', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'james', text: 'Ooh shiny! Go fetch, doggy!' },
        { speaker: 'crown', text: 'Wolf sprinted after your coin. That\'s just smart, honestly.' },
      ],
      next: 'forest_troll_pre',
    },

    // =====================================================================
    //  8. HOARDER TROLL — pre-boss; every option has unique cost/benefit.
    //     - Ambush (needs Foxy): best heal, requires the ally
    //     - Study (-2 HP, +10 heal): moderate heal, universal
    //     - Rush (+10g, no heal):   grab his spilled coin bag on the way in,
    //                               but start at current HP — reward for boldness
    // =====================================================================
    {
      id: 'forest_troll_pre', type: 'choice', bg: 'forest',
      art: '🧌 💤 🌲',
      caption: 'The Hoarder Troll. Huge. Asleep. Drooling. Coin bag at his side.',
      crownLine: 'Do NOT just run in. Do NOT. I know you\'re thinking it.',
      choices: [
        { label: 'Ambush (+12 heal, Foxy only)', icon: '🦊', next: 'forest_troll_ambush',
          condition: { type: 'ally_recruited', id: 'foxy' },
          effects: [{ type: 'heal_party', amount: 12 }] },
        { label: 'Study him (-2 HP, +10 heal)', icon: '👀', next: 'forest_troll_study',
          effects: [
            { type: 'damage_party', amount: 2 },
            { type: 'heal_party',   amount: 10 },
          ] },
        { label: 'Grab the coin bag (+10g, no heal)', icon: '💰', next: 'forest_troll_grab',
          effects: [{ type: 'grant_gold', amount: 10 }] },
      ],
    },

    {
      id: 'forest_troll_ambush', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'foxy',  text: 'Shh. Circle wide. Step where I step. And NO giggling.' },
        { speaker: 'crown', text: 'Good thinking. Caught a breath. Stretched out. Ready.' },
      ],
      next: 'forest_troll_fight',
    },

    {
      id: 'forest_troll_study', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'james', text: '(Cramp... cramp... wait — his LEFT side. Soft spot!)' },
        { speaker: 'crown', text: 'Look at you! THINKING. My little schemer grows up.' },
      ],
      next: 'forest_troll_fight',
    },

    {
      id: 'forest_troll_grab', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'james', text: 'Coins! MINE now. Thanks, big guy.' },
        { speaker: 'crown', text: 'You just pickpocketed a troll. He hasn\'t noticed. This is fine.' },
      ],
      next: 'forest_troll_fight',
    },

    {
      id: 'forest_troll_fight', type: 'battle', bg: 'forest',
      // Troll has two different-type companions now — kid picks which to hit first.
      // Thornpup (earth) takes fire damage · Forest Sprite (magic) takes wind damage · Troll (earth) takes fire damage.
      enemies: ['hoarder_troll', 'thornpup', 'forest_sprite'],
      rewards: { gold: [80, 115], xp: 72, drops: [
        { gear: 'troll_stone', chance: 1.0 },
        { gear: 'iron_sword',  chance: 1.0 },  // guaranteed weapon upgrade by end of Forest
      ] },
      next: 'forest_reward',
      onDefeat: 'forest_intro',
    },

    // =====================================================================
    //  9. REWARD
    // =====================================================================
    {
      id: 'forest_reward', type: 'dialogue', bg: 'castle',
      video: 'images/treasure_gem_of_wisdom.mp4',
      beats: [
        { speaker: 'crown', text: 'The GEM OF WISDOM! Look at that! Actual hero moment!' },
        { speaker: 'crown', text: 'And — OOH — I feel CLEARER. Less bzzt. Nicer.' },
        { speaker: 'james', text: 'I stabbed LESS than everything this time. First time.' },
        { speaker: 'narrator', text: 'You notice a dusty scroll that fell from the Troll\'s pile. You pick it up.' },
        { speaker: 'narrator', text: 'The scroll reads: "Thank you, Troll. Keep this safe forever. — M."' },
        { speaker: 'james', text: 'M? Who\'s M?' },
        { speaker: 'crown', text: 'Huh. That handwriting... no. It couldn\'t be. *fzzt* Forget about it.' },
        { speaker: 'crown', text: 'Library\'s open at the castle. Go read a thing.' },
      ],
      effects: [
        { type: 'grant_treasure', id: 'gem_of_wisdom' },
        { type: 'unlock_room',    id: 'library' },
        { type: 'grant_trophy',   id: 'troll_statue' },
        { type: 'complete_quest', id: 'forest' },
        { type: 'grant_gold',     amount: 50 },
      ],
      next: 'forest_outro_mornox',
    },

    // Mornox hijacks the crown voice briefly. First time kid hears the villain.
    // Spooky, brief, scary. Sets up the long arc.
    {
      id: 'forest_outro_mornox', type: 'dialogue', bg: 'rescue',
      beats: [
        { speaker: 'crown',  text: '...wait. Wait — NO, not now —' },
        { speaker: 'mornox', text: 'Oh look. You found ONE. The Gem. How... BORING of you to succeed.' },
        { speaker: 'mornox', text: 'Keep going, little king. Every Treasure you pick up saves me walking to it.' },
        { speaker: 'james',  text: 'Who are you?! Where\'s the Crown?!' },
        { speaker: 'mornox', text: 'Oh, the Crown and I go WAY back. Ask him sometime. If he\'s honest. Which he isn\'t.' },
        { speaker: 'mornox', text: '*fades*' },
        { speaker: 'crown',  text: 'Ugh. I\'m SO sorry. He does that. It\'s getting harder to keep him out.' },
        { speaker: 'crown',  text: 'His name is Mornox. He cursed the kingdom long ago. He wants the Treasures too. We need to be faster than him.' },
      ],
      next: 'castle',
    },
  ];

  KJ.Registry.quests.add({
    id: 'forest',
    region: 'forest',
    treasure: 'gem_of_wisdom',
    entryScene: 'forest_intro',
    scenes,
  });
})();
