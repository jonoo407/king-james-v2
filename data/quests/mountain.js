// King James 2 — Arc 2: Cold Mountain
// Theme: bravery. The scary thing isn't always the villain.
// Pair with arcs/mountain.md for the full design doc.

(function () {
  const scenes = [

    // =====================================================================
    //  1. INTRO — crown briefing
    // =====================================================================
    {
      id: 'mountain_intro', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'crown',  text: 'Second treasure. Cold mountain. Brrr, I can feel it even from up here.' },
        { speaker: 'crown',  text: 'Village girl says: her little brother climbed with the Blade. Never came back.' },
        { speaker: 'james',  text: 'YES! Swords! FINALLY a real weapon!' },
        { speaker: 'crown',  text: 'The Blade is for kids with BRAVERY. Not mouths. Not loud ones. *fzzt*' },
      ],
      next: 'mountain_village',
    },

    // =====================================================================
    //  2. VILLAGE — 4 prep choices (gold tradeoffs with late-arc payoffs)
    // =====================================================================
    {
      id: 'mountain_village', type: 'choice', bg: 'mountain',
      art: '🏘️⛄🏘️\n  🧑‍🌾 🧒',
      caption: 'A snow-wrapped village. A blacksmith hammers. A shop is open. A girl sits on a stump, crying.',
      crownLine: 'Spend before you climb. Or be brave AND broke.',
      choices: [
        { label: 'Ask blacksmith for a tip (-5g)', icon: '🔨', next: 'mountain_village_smith',
          condition: { type: 'gold_at_least', amount: 5 },
          effects: [
            { type: 'grant_gold', amount: -5 },
            { type: 'set_flag', key: 'knows_cave', value: true },
          ] },
        { label: 'Buy a Heal Scroll (-25g)', icon: '📜', next: 'mountain_village_shop',
          condition: { type: 'gold_at_least', amount: 25 },
          effects: [
            { type: 'grant_gold', amount: -25 },
            { type: 'grant_scroll', id: 'scroll_heal', amount: 1 },
          ] },
        { label: 'Give scared girl a coin (-10g)', icon: '🪙', next: 'mountain_village_girl',
          condition: { type: 'gold_at_least', amount: 10 },
          effects: [
            { type: 'grant_gold', amount: -10 },
            { type: 'set_flag', key: 'village_friend', value: true },
          ] },
        { label: 'Climb now', icon: '⛰️', next: 'mountain_goat' },
      ],
    },
    {
      id: 'mountain_village_smith', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'narrator', text: 'The blacksmith leans close, glances around. Whispers:' },
        { speaker: 'narrator', text: '"Ice cave. Behind the old troll\'s lair. Wraith lives there. Good luck, kid."' },
        { speaker: 'crown',    text: 'Free intel for five gold. Cheapskate blacksmith. I love him.' },
      ],
      next: 'mountain_goat',
    },
    {
      id: 'mountain_village_shop', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'narrator', text: 'The shopkeeper hands over a 📜 Heal Scroll. "Break it in a tight spot."' },
        { speaker: 'crown',    text: 'Tuck that into your bag. Break glass in battle.' },
      ],
      next: 'mountain_goat',
    },
    {
      id: 'mountain_village_girl', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'narrator', text: 'The scared girl looks at the coin. Looks at you. And smiles — REALLY smiles — for the first time this week.' },
        { speaker: 'crown',    text: 'She\'ll remember you. Mark my words. Good things come from that.' },
      ],
      next: 'mountain_goat',
    },

    // =====================================================================
    //  3. MEET GUS — 4 real paths
    // =====================================================================
    {
      id: 'mountain_goat', type: 'choice', bg: 'mountain',
      art: '🐐 ⛰️',
      caption: 'A surly mountain goat plants himself on the path. Sniffs. Judges. Chews.',
      crownLine: 'He says: "MY mountain. Pay the toll." I\'m quoting. He said that.',
      choices: [
        { label: 'Offer an apple (-5g)', icon: '🍎', next: 'mountain_goat_apple',
          condition: { type: 'gold_at_least', amount: 5 },
          effects: [
            { type: 'grant_gold', amount: -5 },
            { type: 'recruit_ally', id: 'gus' },
          ] },
        { label: 'Headbutt contest (-4 HP)', icon: '💪', next: 'mountain_goat_butt',
          effects: [
            { type: 'damage_party', amount: 4 },
            { type: 'recruit_ally', id: 'gus' },
            { type: 'set_flag', key: 'gus_respect', value: true },
          ] },
        { label: 'Tell him a clever joke', icon: '🧠', next: 'mountain_goat_joke',
          condition: { type: 'ally_recruited', id: 'owlette' },
          effects: [
            { type: 'recruit_ally', id: 'gus' },
            { type: 'grant_gold', amount: 5 },
          ] },
        { label: 'Push past', icon: '💨', next: 'mountain_goat_miss',
          effects: [{ type: 'mark_met_ally', id: 'gus' }] },
      ],
    },
    {
      id: 'mountain_goat_apple', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'gus',   text: '...fine. *crunch crunch crunch* I\'ll come. But I LEAD.' },
        { speaker: 'james', text: 'That is the most polite crunching I\'ve ever heard.' },
      ],
      next: 'mountain_frost',
    },
    {
      id: 'mountain_goat_butt', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'james', text: 'OW!! Fine! OK! Good enough! I tap OUT!' },
        { speaker: 'gus',   text: 'Respect earned. Your head is MADE of rock. Admirable.' },
        { speaker: 'crown', text: 'Literally. You hit HIM with YOUR head. On purpose. I saw.' },
      ],
      next: 'mountain_frost',
    },
    {
      id: 'mountain_goat_joke', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'owlette', text: 'Why don\'t mountain goats play poker?' },
        { speaker: 'owlette', text: 'Too many CHEETAHS at the peak.' },
        { speaker: 'gus',     text: '...HMPH. *long pause* *longer pause* Fine. That was fine. Lead on.' },
        { speaker: 'crown',   text: 'Gus found a 5g coin on the way. Hands it to you. Silently. Grudgingly.' },
      ],
      next: 'mountain_frost',
    },
    {
      id: 'mountain_goat_miss', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'gus',   text: 'Rude. I\'ll tell every goat. Every. Single. Goat.' },
      ],
      next: 'mountain_frost',
    },

    // =====================================================================
    //  4. FIRST BATTLE — a hot vent hisses beside a snowbank.
    //  Mixed types on purpose: Frost Sprite (water, weak ✨ magic) +
    //  Ember Wisp (fire, weak 💧 water). Teaches "not every Mountain fight is water"
    //  AND gives Ribbit's splash / ice_cut / ice_shard an SE target early.
    // =====================================================================
    {
      id: 'mountain_frost', type: 'battle', bg: 'mountain',
      enemies: ['frost_sprite', 'ember_wisp'],
      rewards: { gold: [10, 16], xp: 16, drops: [{ gear: 'frost_charm', chance: 0.25 }] },
      next: 'mountain_bridge',
      onDefeat: 'mountain_intro',
    },

    // =====================================================================
    //  5. ICE BRIDGE — 3 ways to cross
    // =====================================================================
    {
      id: 'mountain_bridge', type: 'choice', bg: 'mountain',
      art: '⛰️  ㅡㅡㅡㅡ  ⛰️\n         ❄️❄️',
      caption: 'A narrow ice bridge over a deep, dark crevasse. Somebody polished this.',
      crownLine: 'Fast, careful, or frog. Pick.',
      choices: [
        { label: 'Run across (-3 HP)', icon: '⚡', next: 'mountain_bridge_run',
          effects: [{ type: 'damage_party', amount: 3 }] },
        { label: 'Inch carefully', icon: '🤸', next: 'mountain_bridge_inch' },
        { label: 'Let Ribbit slime the ice (+15g)', icon: '🐸', next: 'mountain_bridge_ribbit',
          condition: { type: 'ally_recruited', id: 'ribbit' },
          effects: [{ type: 'grant_gold', amount: 15 }] },
      ],
    },
    {
      id: 'mountain_bridge_run', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'james', text: 'Woohoo! *whoomp* — OW.' },
        { speaker: 'crown', text: 'That was a slide. Not a run. Different thing.' },
      ],
      next: 'mountain_side',
    },
    {
      id: 'mountain_bridge_inch', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'james', text: 'Slow and steady, slow and steady, don\'t look DOWN, do NOT look DOWN...' },
        { speaker: 'crown', text: 'There were coins glinting in the crevasse. You did not look. Proud of you.' },
      ],
      next: 'mountain_side',
    },
    {
      id: 'mountain_bridge_ribbit', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'ribbit', text: 'Slime time. *slorp slorp slorp*' },
        { speaker: 'james',  text: 'That is... very gross and SO effective.' },
        { speaker: 'crown',  text: 'You scooped up coins while crossing slowly. +15g. Teamwork.' },
      ],
      next: 'mountain_side',
    },

    // =====================================================================
    //  6. SIDE PATH — wild Ice Rabbit (optional)
    // =====================================================================
    {
      id: 'mountain_side', type: 'choice', bg: 'mountain',
      art: '🌲🌲🌲\n   🐇',
      caption: 'Tiny tracks in the snow. A white-furred rabbit peers from a bush. Nose twitch.',
      crownLine: 'Optional detour. Worth a sniff.',
      choices: [
        { label: 'Feed carrot, befriend (-5g)', icon: '🥕', next: 'mountain_side_friend',
          condition: { type: 'gold_at_least', amount: 5 },
          effects: [
            { type: 'grant_gold', amount: -5 },
            { type: 'mark_met_ally', id: 'ice_rabbit' },
          ] },
        { label: 'Use Friendship Charm', icon: '📿', next: 'mountain_side_charm',
          condition: { type: 'charms_at_least', amount: 1 },
          effects: [
            { type: 'consume_charm', amount: 1 },
            { type: 'recruit_ally', id: 'ice_rabbit' },
          ] },
        { label: 'Skip side path', icon: '👋', next: 'mountain_knight' },
      ],
    },
    {
      id: 'mountain_side_friend', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'narrator', text: 'The rabbit nibbles your carrot. Sniffs. Hops alongside you for a few steps, then ducks into a hole.' },
        { speaker: 'crown',    text: 'You\'ve met her now. Dame Pompadour can audition her for the team later.' },
      ],
      next: 'mountain_knight',
    },
    {
      id: 'mountain_side_charm', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'narrator', text: 'The charm pulses with soft light. The rabbit blinks slow. She hops once, then again — straight onto your shoulder.' },
        { speaker: 'crown',    text: 'A genuine friend. The charm worked. Snip the Ice Rabbit is on your side now.' },
      ],
      next: 'mountain_knight',
    },

    // =====================================================================
    //  7. FROZEN KNIGHT — choice + branches (different loot per path)
    // =====================================================================
    {
      id: 'mountain_knight', type: 'choice', bg: 'mountain',
      art: '🧔‍♂️❄️  ⚔️',
      caption: 'Sir Frostbeard. Gruff. Frosty beard. Raises one gauntlet: HALT.',
      crownLine: 'Fight for sword. Riddles for helm. Bribe for shame.',
      choices: [
        { label: 'Fight him!', icon: '⚔️', next: 'mountain_knight_fight' },
        { label: 'Answer his riddles', icon: '🧠', next: 'mountain_knight_riddle' },
        { label: 'Bribe (-50g)', icon: '🪙', next: 'mountain_knight_bribe',
          condition: { type: 'gold_at_least', amount: 50 },
          effects: [{ type: 'grant_gold', amount: -50 }] },
      ],
    },
    {
      id: 'mountain_knight_fight', type: 'battle', bg: 'mountain',
      enemies: ['frostbeard'],
      rewards: { gold: [24, 36], xp: 35, drops: [{ gear: 'frost_fang_sword', chance: 0.5 }] },
      next: 'mountain_pass_choice',
      onDefeat: 'mountain_intro',
    },
    {
      id: 'mountain_knight_riddle', type: 'puzzle', bg: 'mountain',
      puzzleType: 'word_riddle',
      data: {
        riddles: [
          { prompt: '"I am heavier than stone, but you carry me inside. What am I?"',
            options: ['💔 Fear', '❤️ Love', '💎 Gem'], correct: 0 },
          { prompt: '"I shake but do not fall. I speak but do not shout. What am I?"',
            options: ['🍃 Leaf', '💨 Wind', '🫀 Heart'], correct: 2 },
          { prompt: '"I follow you always, bigger at night, scared of morning. What am I?"',
            options: ['👤 Shadow', '👻 Ghost', '🦇 Bat'], correct: 0 },
        ],
        allowHints: false,
      },
      onSolveAllNoHints: [
        { type: 'grant_gear', id: 'knights_helm' },
        { type: 'set_flag', key: 'frostbeard_riddles_solved', value: true },
        { type: 'set_flag', key: 'knight_respect', value: true },
      ],
      next: 'mountain_knight_riddle_done',
    },
    {
      id: 'mountain_knight_riddle_done', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'frostbeard', text: '...thoughtful. Rare, in kids. Take this. *unclasps his own helm*' },
        { speaker: 'crown',      text: 'The Knight\'s Helm. He gave it TO YOU. That\'s something. Big DEF, Ward heal.' },
      ],
      next: 'mountain_pass_choice',
    },
    {
      id: 'mountain_knight_bribe', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'frostbeard', text: '*pockets the coins fast* I have kids. Don\'t tell anyone.' },
        { speaker: 'crown',      text: 'Effective. Slightly depressing. Onward.' },
      ],
      next: 'mountain_pass_choice',
    },

    // =====================================================================
    //  7.5 SUMMIT PASS — optional side encounter with mixed types.
    //  Drake (wind) wants earth moves; Ogre (earth) wants fire moves.
    //  Forces kid to USE different gear — Iron Sword AND Spark/Ember Burst both shine.
    // =====================================================================
    {
      id: 'mountain_pass_choice', type: 'choice', bg: 'mountain',
      art: '🏔️🦅🏔️\n    🗿',
      caption: 'A narrow pass. A snow drake circles overhead. A stone ogre blocks the path.',
      crownLine: '💨 Drake up high, 🌿 ogre down low. Two totally different problems.',
      choices: [
        { label: 'Face them!', icon: '⚔️', next: 'mountain_pass_fight' },
        { label: 'Sneak around', icon: '🤫', next: 'mountain_summit' },
      ],
    },
    {
      id: 'mountain_pass_fight', type: 'battle', bg: 'mountain',
      enemies: ['snow_drake', 'stone_ogre'],
      rewards: { gold: [20, 32], xp: 32, drops: [{ gear: 'crampon_boots', chance: 0.4 }] },
      next: 'mountain_summit',
      onDefeat: 'mountain_intro',
    },

    // =====================================================================
    //  8. SUMMIT APPROACH — dialogue buildup
    // =====================================================================
    {
      id: 'mountain_summit', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'crown', text: 'Something HUGE is up here. I can feel it in my... rim.' },
        { speaker: 'james', text: 'Pfft. I got the Blade of Bravery. Totally fine.' },
        { speaker: 'crown', text: 'You do NOT have the Blade of Bravery. We are HERE to GET the Blade of Bravery. PAY ATTENTION.' },
        { speaker: 'james', text: 'Oh. Right. ...yeah that\'s kinda scary.' },
      ],
      next: 'mountain_yeti',
    },

    // =====================================================================
    //  9. PAPA YETI ENCOUNTER — the twist moment
    // =====================================================================
    {
      id: 'mountain_yeti', type: 'choice', bg: 'mountain',
      art: '🦍❄️😠',
      caption: 'A HUGE Yeti! Red eyes! Massive arms! ROOAAARRR!!! ...is he also sniffling?',
      crownLine: 'Easy to swing a sword. Harder to listen. Both are brave.',
      choices: [
        { label: 'Attack! (-3 HP)', icon: '⚔️', next: 'mountain_yeti_attack',
          effects: [
            { type: 'damage_party', amount: 3 },
            { type: 'set_flag', key: 'yeti_angry', value: true },
          ] },
        { label: 'Put weapon down, listen', icon: '👂', next: 'mountain_yeti_listen' },
        { label: 'Toss him gold (-30g)', icon: '🪙', next: 'mountain_yeti_toss',
          condition: { type: 'gold_at_least', amount: 30 },
          effects: [{ type: 'grant_gold', amount: -30 }] },
      ],
    },
    {
      id: 'mountain_yeti_attack', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'james',    text: 'FOR GLORY!!!' },
        { speaker: 'narrator', text: 'You land one nick on the Yeti\'s arm. The Yeti... freezes. Goes still.' },
        { speaker: 'narrator', text: 'Then he flees. Sobbing. The mountain echoes with it.' },
        { speaker: 'crown',    text: 'Huh. He... ran. Did he drop something?' },
        { speaker: 'crown',    text: '...it\'s a tiny mitten. A BABY mitten. Oh.' },
        { speaker: 'james',    text: 'Oh. Oh no. I\'m the bad guy. I think I\'m the bad guy.' },
      ],
      next: 'mountain_cave',
    },
    {
      id: 'mountain_yeti_listen', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'yeti',  text: 'GRAAAR... *sniffle* ...GRAAAR!' },
        { speaker: 'yeti',  text: 'Me no take sheep. Me no take Blade. BABY! MY BABY!' },
        { speaker: 'yeti',  text: 'Shadow-ghost. Wraith. Cave.' },
        { speaker: 'james', text: 'A ghost stole your BABY?' },
        { speaker: 'yeti',  text: 'Mnh. *big tear*' },
        { speaker: 'crown', text: 'Oh. Oh, he\'s just a dad.' },
        { speaker: 'yeti',  text: '*pats you with enormous paw* You help? Me bless.' },
      ],
      effects: [
        { type: 'set_flag', key: 'yeti_friend', value: true },
        { type: 'heal_party', amount: 15 },
      ],
      next: 'mountain_cave',
    },
    {
      id: 'mountain_yeti_toss', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'yeti',     text: '*sniffs shiny* Huh. Pretty.' },
        { speaker: 'yeti',     text: 'You... not enemy? Then LISTEN. Wraith. Cave. MY BABY.' },
        { speaker: 'yeti',     text: '*pats you* Me bless you. Go.' },
        { speaker: 'crown',    text: 'Poor big guy. Genuine bless, though.' },
      ],
      effects: [
        { type: 'set_flag', key: 'yeti_friend', value: true },
        { type: 'heal_party', amount: 15 },
      ],
      next: 'mountain_cave',
    },

    // =====================================================================
    //  10. CAVE PREP — before the boss, pick your edge
    // =====================================================================
    {
      id: 'mountain_cave', type: 'choice', bg: 'mountain',
      art: '🕳️❄️\n  👻',
      caption: 'A cave mouth glowing with pale blue light. Something drifts inside, muttering.',
      crownLine: 'Prep now. Boss doesn\'t wait. Or he does, but he\'ll be crankier.',
      choices: [
        { label: 'Charge in!', icon: '⚔️', next: 'mountain_wraith' },
        { label: 'Foxy sneaks ahead (+8 heal)', icon: '🦊', next: 'mountain_cave_sneak',
          condition: { type: 'ally_recruited', id: 'foxy' },
          effects: [{ type: 'heal_party', amount: 8 }] },
        { label: 'Bribe a villager helper (-15g, +10 heal)', icon: '🪙', next: 'mountain_cave_helper',
          condition: { type: 'gold_at_least', amount: 15 },
          effects: [
            { type: 'grant_gold', amount: -15 },
            { type: 'heal_party', amount: 10 },
          ] },
      ],
    },
    {
      id: 'mountain_cave_sneak', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'foxy',  text: 'Easy. Shhh. I see him. He\'s... *listens* ...talking to himself. About himself. A LOT.' },
        { speaker: 'crown', text: 'Sad little ghost. Catch your breath. We go in strong.' },
      ],
      next: 'mountain_wraith',
    },
    {
      id: 'mountain_cave_helper', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'narrator', text: 'A villager appears with bandages, a hot thermos, and a nervous smile.' },
        { speaker: 'narrator', text: '"Good luck, Your Majesty."  *vanishes back down the trail*' },
        { speaker: 'crown',    text: 'Paid help. Honest work. Let\'s go.' },
      ],
      next: 'mountain_wraith',
    },

    // =====================================================================
    //  11. GLIMMER THE WRAITH — final boss
    //     If yeti_friend flag: pre-battle heal (yeti blessing)
    // =====================================================================
    {
      id: 'mountain_wraith', type: 'battle', bg: 'mountain',
      // Mixed-type climax: Wraith (water, weak magic) + Frost Sprite (water, weak magic) + Snow Drake (wind, weak earth).
      // Kid needs BOTH magic moves (Think Fast / Lucky Throw) AND earth moves (Iron Slash) — no single button wins.
      enemies: ['glimmer_wraith', 'frost_sprite', 'snow_drake'],
      rewards: { gold: [100, 140], xp: 92, drops: [{ gear: 'wraiths_cloak', chance: 1.0 }] },
      next: 'mountain_wraith_reveal',
      onDefeat: 'mountain_intro',
    },

    // Post-battle twist: the wraith's "I was lonely" confession.
    // The whole arc's theme ("scary isn't bad") lands here.
    {
      id: 'mountain_wraith_reveal', type: 'dialogue', bg: 'mountain',
      beats: [
        { speaker: 'wraith', text: '*wisps drooping* ...fine. I lost. Go on, finish it.' },
        { speaker: 'james',  text: 'I\'m not gonna finish it. Why\'d you do all this?' },
        { speaker: 'wraith', text: 'Long time ago, a wizard visited me. Old guy. Tired eyes.' },
        { speaker: 'wraith', text: 'He told me: "No one will ever sing about you, little ghost. Nobody remembers wraiths."' },
        { speaker: 'wraith', text: 'I stewed on that for a hundred years. So I took the Blade. Wanted to be remembered, even as a bad guy.' },
        { speaker: 'james',  text: '...a wizard? Tired eyes?' },
        { speaker: 'crown',  text: '*fzzt* ...that\'s not important right now. Keep listening.' },
        { speaker: 'wraith', text: 'I took the baby because I was lonely. For like, a hundred years.' },
        { speaker: 'james',  text: '...oh. That\'s really sad, actually.' },
        { speaker: 'crown',  text: 'See, kid? Scary isn\'t always the same as bad. THAT\'S the lesson.' },
        { speaker: 'wraith', text: '*floats the Blade to you* Take it. But — tell a kid about me someday? Even once?' },
        { speaker: 'james',  text: 'I\'ll tell LOTS of kids. You\'re in the song now. Deal.' },
        { speaker: 'wraith', text: '*sniffle* ...deal.' },
      ],
      next: 'mountain_reward',
    },

    // =====================================================================
    //  12. REWARD — treasure + unlocks
    // =====================================================================
    {
      id: 'mountain_reward', type: 'dialogue', bg: 'castle',
      beats: [
        { speaker: 'narrator', text: 'Back at the village: Papa Yeti lumbers in, Baby Yeti cradled in his giant paws. The villagers freeze. Then they CHEER.' },
        { speaker: 'yeti',     text: 'Baby... *enormous hug* *muffled yeti sobs*' },
        { speaker: 'yeti',     text: 'Thank. You. Little. Hero.' },
        { speaker: 'crown',    text: 'Look at THAT blade! +ATK, glowing, new 💨 Brave Strike move. That\'s a REAL sword, kid.' },
        { speaker: 'james',    text: 'I\'m kinda proud? A little? Don\'t tell anyone.' },
        { speaker: 'crown',    text: 'You LISTENED to a yeti. Instead of stabbing one. That is — and I mean this — a miracle.' },
        { speaker: 'crown',    text: 'Armory\'s open at home. Go forge something shiny.' },
      ],
      effects: [
        { type: 'grant_treasure', id: 'blade_of_bravery' },
        { type: 'unlock_room',    id: 'armory' },
        { type: 'grant_trophy',   id: 'wraith_statue' },
        { type: 'complete_quest', id: 'mountain' },
        { type: 'grant_gold',     amount: 60 },
      ],
      next: 'mountain_outro_mornox',
    },

    // Mornox's second intervention — scroll appears at castle.
    // Tone escalates: from dismissive (Forest) to cold and knowing (Mountain).
    {
      id: 'mountain_outro_mornox', type: 'dialogue', bg: 'rescue',
      beats: [
        { speaker: 'narrator', text: 'At the castle: a scroll sits on the throne. No messenger. It\'s warm to the touch.' },
        { speaker: 'james',    text: '...this wasn\'t here when we left. Was it?' },
        { speaker: 'crown',    text: 'Don\'t read it. Don\'t— okay fine, read it.' },
        { speaker: 'mornox',   text: 'Two Treasures. Nicely done, little king.' },
        { speaker: 'mornox',   text: 'The Wraith was a friend of mine once. I just told him nobody cared. He did the rest.' },
        { speaker: 'mornox',   text: 'That\'s my whole method, really. I tell people the worst part. They do the rest.' },
        { speaker: 'mornox',   text: 'Keep collecting, boy. You\'re doing lovely work for me.' },
        { speaker: 'narrator', text: 'The scroll crumbles to dust. In the throne hall, a single vine has withered overnight.' },
        { speaker: 'crown',    text: 'A vine? After we RETURNED the Gem? That shouldn\'t be possible unless Mornox is already pulling power from somewhere.' },
        { speaker: 'crown',    text: 'Three to go. Don\'t stop.' },
      ],
      next: 'castle',
    },
  ];

  KJ.Registry.quests.add({
    id: 'mountain',
    region: 'mountain',
    treasure: 'blade_of_bravery',
    entryScene: 'mountain_intro',
    scenes,
  });
})();
