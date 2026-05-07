// King James 2 — Arc 5: The Lava Peak (FINALE)
// Theme: forgiveness — of others AND of yourself.
// Treasure: Star of Friendship (+4 HP perm + Friend's Beacon move).
// Two endings: Fight (3-phase boss, bittersweet) or Listen (gated by ≥3
// kindness flags from prior arcs, redemptive). Per spec arcs/volcano.md.
//
// Caption rule: every dialogue beat ≤8 words. Buttons ≤3 words. Even
// in emotional scenes. Big lines split into multiple beats so they LAND.

(function () {
  const scenes = [

    // =========================================================================
    //  ACT 1 — THE CLIMB (5 scenes)
    // =========================================================================

    // 1. Crown intro — split into 3 beats. Snark stays on so the kid doesn't
    //    feel the air leave the room before the climb starts.
    {
      id: 'volcano_intro', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'crown',  text: 'Four down. One to go.' },
        { speaker: 'crown',  text: 'Top of the world, kid.' },
        { speaker: 'crown',  text: 'Lava up there. Don\'t lick it.' },
        { speaker: 'james',  text: 'Why would I LICK lava?' },
        { speaker: 'crown',  text: 'I\'ve seen things. Just... don\'t.' },
      ],
      next: 'volcano_base',
    },

    // 2. Last-chance prep at the volcano base. 3 paths (no dominance).
    {
      id: 'volcano_base', type: 'choice', bg: 'volcano',
      art: '🌋🪨🔥\n  ⛺  ',
      caption: 'A small camp at the volcano\'s foot. Last dry land.',
      crownLine: 'Pack your courage. And maybe your sword.',
      choices: [
        { label: 'Visit the camp shop (-30g)', icon: '🪙', next: 'volcano_base_shop',
          condition: { type: 'gold_at_least', amount: 30 },
          effects: [
            { type: 'grant_gold', amount: -30 },
            { type: 'grant_scroll', id: 'scroll_big_heal', amount: 1 },
          ] },
        { label: 'Sword check', icon: '⚔️', next: 'volcano_base_check',
          effects: [
            { type: 'set_flag', key: 'volcano_packed', value: true },
          ] },
        { label: 'Climb now', icon: '🌋', next: 'volcano_lava_flow' },
      ],
    },
    {
      id: 'volcano_base_shop', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'A trader hands you a Big Heal scroll.' },
        { speaker: 'crown',    text: 'Smart. Very smart.' },
        // The James/sword micro-laugh per fun-reader feedback
        { speaker: 'james',    text: 'Did you bring a sword? Good.' },
        { speaker: 'james',    text: 'Pants? Also good.' },
        { speaker: 'crown',    text: 'You are a strange child.' },
      ],
      next: 'volcano_lava_flow',
    },
    {
      id: 'volcano_base_check', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'james',    text: 'Sword: sharp. Pants: on.' },
        { speaker: 'crown',    text: 'A king\'s checklist. Glorious.' },
      ],
      next: 'volcano_lava_flow',
    },

    // 3. Mixed-type trash battle (Rule 1.1 / 1.3 — multi-enemy with target picker).
    {
      id: 'volcano_lava_flow', type: 'battle', bg: 'volcano',
      enemies: ['lava_spirit', 'lava_spirit', 'obsidian_golem'],
      rewards: { gold: [30, 50], xp: 60, drops: [] },
      next: 'volcano_ash_field',
    },

    // 4. Ash field — 3 paths, real trade-offs (Rules 2.1, 2.2). Zephyra
    //    route gated on first_alliance flag (from Desert).
    {
      id: 'volcano_ash_field', type: 'choice', bg: 'volcano',
      art: '🌫️🪨🌋\n   👣   ',
      caption: 'Ash blowing thick. Three ways up the slope.',
      crownLine: 'Steep. Long. Or — clever.',
      choices: [
        { label: 'Climb straight (-5 HP)', icon: '🧗', next: 'volcano_ash_straight',
          effects: [{ type: 'damage_party', amount: 5 }] },
        { label: 'Long way round', icon: '🌀', next: 'volcano_ash_long' },
        { label: 'Zephyra\'s route', icon: '🌅', next: 'volcano_chest_room',
          condition: { type: 'flag_set', key: 'first_alliance', value: true } },
      ],
    },
    {
      id: 'volcano_ash_straight', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'Ash burns. James pushes through.' },
        { speaker: 'crown',    text: 'Tough kid. Quick path, though.' },
      ],
      next: 'volcano_dragon_pre',
    },
    {
      id: 'volcano_ash_long', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'A safer arc around the slope.' },
        { speaker: 'crown',    text: 'Slow and steady. Smart.' },
      ],
      next: 'volcano_dragon_pre',
    },

    // 5. Bonus chest (Zephyra path only) — 30g + a scroll she sketched.
    {
      id: 'volcano_chest_room', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'A cave Zephyra marked on a map.' },
        { speaker: 'crown',    text: 'She left this for you.' },
        { speaker: 'narrator', text: 'A small chest. Gold inside. A scroll.' },
        { speaker: 'james',    text: 'Tell her thank you, crown.' },
        { speaker: 'crown',    text: 'I\'ll find a way.' },
      ],
      effects: [
        { type: 'grant_gold', amount: 30 },
        { type: 'grant_scroll', id: 'scroll_thunder', amount: 1 },
        // Phoenix Boots — spec §6 lava-field rare drop, granted here so kids
        // who took Zephyra's route get fire-typed boots for the climb.
        { type: 'grant_gear', id: 'phoenix_boots' },
      ],
      next: 'volcano_dragon_pre',
    },

    // =========================================================================
    //  ACT 2 — DRAGON GATE (3 scenes — battle is multi-phase)
    // =========================================================================

    // 6. Dragon prep — 3 paths (Rule 2.3).
    {
      id: 'volcano_dragon_pre', type: 'choice', bg: 'volcano',
      art: '🐲🔥\n  🪨🪨  ',
      caption: 'A huge dragon at the gate.',
      crownLine: 'Big lizard. Sharp lizard. Plan, fast.',
      choices: [
        { label: 'Charge!', icon: '⚔️', next: 'volcano_dragon' },
        { label: 'Sneak with Foxy', icon: '🦊', next: 'volcano_dragon_sneak',
          condition: { type: 'ally_in_party', id: 'foxy' } },
        { label: 'Use a charm', icon: '📿', next: 'volcano_dragon_charm',
          condition: { type: 'charms_at_least', amount: 1 },
          effects: [{ type: 'grant_charms', amount: -1 }] },
      ],
    },
    {
      id: 'volcano_dragon_sneak', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'foxy',     text: 'Walk where I walk. Quiet feet.' },
        { speaker: 'narrator', text: 'You slip past its first guard.' },
        { speaker: 'crown',    text: 'Free first hit. Earned it.' },
      ],
      effects: [
        { type: 'set_flag', key: 'dragon_sneaked', value: true },
      ],
      next: 'volcano_dragon',
    },
    {
      id: 'volcano_dragon_charm', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'You leave a charm on a stone.' },
        { speaker: 'narrator', text: 'The dragon sniffs. Pauses. Calmer.' },
        { speaker: 'crown',    text: 'Costly. But its DEF dropped.' },
      ],
      next: 'volcano_dragon',
    },

    // 7. The Tempered Dragon — multi-phase (fire form → magic form).
    //    Phase 1: dragon (fire) + 2 obsidian golems (earth). Mixed-type.
    //    Phase 2: dragon transforms (magic). Wind moves shine.
    //    Dragon Scale armor 100% drop.
    {
      id: 'volcano_dragon', type: 'battle', bg: 'volcano',
      phases: [
        ['tempered_dragon_fire', 'obsidian_golem', 'obsidian_golem'],
        ['tempered_dragon_magic'],
      ],
      rewards: { gold: [70, 110], xp: 140, drops: [{ gear: 'dragon_scale', chance: 1.0 }] },
      next: 'volcano_dragon_rest',
    },

    // 8. Breather. Crown's-past beat (planting the reveal). Micro-laugh.
    //    grant_sparks so the kid isn't drained heading into the tower.
    {
      id: 'volcano_dragon_rest', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'You catch your breath on the gate stones.' },
        { speaker: 'crown',    text: 'I knew that dragon, you know.' },
        { speaker: 'crown',    text: 'When it was young. And kind.' },
        { speaker: 'crown',    text: '*fzzt*' },
        { speaker: 'james',    text: 'Are you crying?' },
        { speaker: 'crown',    text: 'Crowns don\'t cry. We leak.' },
      ],
      effects: [
        { type: 'heal_party', amount: 20 },
        { type: 'grant_sparks' },
      ],
      next: 'volcano_tower_climb',
    },

    // =========================================================================
    //  ACT 3 — THE TOWER (5 scenes)
    // =========================================================================

    // 9. Tower climb — 3 paths with real trade-offs.
    {
      id: 'volcano_tower_climb', type: 'choice', bg: 'volcano',
      art: '🗼\n  🌀  \n  🪜  ',
      caption: 'A spiral staircase. Worn. Steep. Quiet.',
      crownLine: 'Old stone remembers things. Be gentle.',
      choices: [
        { label: 'Run up (-3 HP)', icon: '🏃', next: 'volcano_empty_floor',
          effects: [{ type: 'damage_party', amount: 3 }] },
        { label: 'Read the wall', icon: '📜', next: 'volcano_empty_floor',
          condition: { type: 'ally_in_party', id: 'owlette' },
          effects: [{ type: 'heal_party', amount: 5 }] },
        { label: 'Pace yourself', icon: '👣', next: 'volcano_empty_floor' },
      ],
    },

    // 10. Empty floor — book about Zephyra. James-misreads micro-laugh.
    {
      id: 'volcano_empty_floor', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'A single book lies open on a desk.' },
        { speaker: 'narrator', text: 'A page about a sun-witch.' },
        { speaker: 'james',    text: 'Zeph-eye-ra?' },
        { speaker: 'crown',    text: 'Zephyra.' },
        { speaker: 'james',    text: 'I was close.' },
        { speaker: 'narrator', text: 'You pocket the page.' },
      ],
      next: 'volcano_old_mornox',
    },

    // 11. Portrait floor — heavy foreshadow + James "substitute teacher" laugh.
    {
      id: 'volcano_old_mornox', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'A portrait. A young man in robes.' },
        { speaker: 'narrator', text: 'He looks tired. Bright. Sharp.' },
        { speaker: 'james',    text: 'He looks like a substitute teacher.' },
        { speaker: 'crown',    text: 'He was, actually.' },
        { speaker: 'james',    text: 'Wait, what?' },
      ],
      next: 'volcano_crown_reveal',
    },

    // 12. THE BIG REVEAL. Voice-acted with stability 0.75 (per spec §8 note —
    //     handled at voice-gen time). Beats split tight so each lands.
    {
      id: 'volcano_crown_reveal', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'crown', text: 'Wait. Before we go up.' },
        { speaker: 'crown', text: 'I was his teacher, kid.' },
        { speaker: 'james', text: 'Wait — what?' },
        { speaker: 'crown', text: 'This crown? It\'s what\'s left of me.' },
        { speaker: 'crown', text: 'He did this. To me.' },
        { speaker: 'james', text: 'Crown...' },
        { speaker: 'crown', text: 'He was my best, though. Brat.' },
        { speaker: 'james', text: 'Are you okay?' },
        { speaker: 'crown', text: 'I will be. After. Let\'s go.' },
      ],
      effects: [{ type: 'set_flag', key: 'crown_truth_known', value: true }],
      next: 'volcano_door',
    },

    // 13. Door — kettle whistle micro-laugh.
    {
      id: 'volcano_door', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'A door at the top. Warm light.' },
        { speaker: 'narrator', text: 'Something whistles inside.' },
        { speaker: 'james',    text: 'Is that... tea?' },
        { speaker: 'crown',    text: 'Oh no.' },
      ],
      next: 'volcano_pre_mornox',
    },

    // =========================================================================
    //  ACT 4 — MORNOX (variable, 6-7 scenes by path)
    // =========================================================================

    // 14. NEW prep scene (Rule 2.3, balance-tester recommendation). The kid
    //     gets ONE resource buff before facing the finale, thematically tied
    //     to the kettle and chairs that are already set.
    {
      id: 'volcano_pre_mornox', type: 'choice', bg: 'volcano',
      art: '🍵🪑🪑\n  🧙‍♂️  ',
      caption: 'Two chairs. A kettle. He\'s waiting inside.',
      crownLine: 'No going back from this room.',
      choices: [
        { label: 'Drink the tea', icon: '🍵', next: 'volcano_mornox_meet',
          effects: [
            { type: 'heal_party', amount: 15 },
            { type: 'set_flag', key: 'tea_accepted', value: true },
          ] },
        { label: 'Pray to crown', icon: '🙏', next: 'volcano_mornox_meet',
          effects: [
            { type: 'grant_sparks' },
            { type: 'heal_party', amount: 5 },
          ] },
        { label: 'Just walk in', icon: '🚪', next: 'volcano_mornox_meet',
          effects: [
            { type: 'grant_scroll', id: 'scroll_waterskin', amount: 1 },
            { type: 'set_flag', key: 'walked_in_focused', value: true },
          ] },
      ],
    },

    // 15. The meet. 3 buttons: Fight / Sit down (gated) / Ask first.
    {
      id: 'volcano_mornox_meet', type: 'choice', bg: 'volcano',
      art: '🧙‍♂️\n🍵🪑🪑',
      caption: 'He pours a second cup. Slides it across.',
      crownLine: 'You decide what happens next, kid.',
      choices: [
        { label: 'Fight', icon: '⚔️', next: 'volcano_mornox_battle' },
        { label: 'Sit down', icon: '🪑', next: 'volcano_mornox_listen',
          condition: { type: 'volcano_can_listen' } },
        { label: 'Ask first', icon: '🗨️', next: 'volcano_mornox_ask' },
      ],
    },

    // 16. ASK PATH — reveals more, then loops back to the meet.
    {
      id: 'volcano_mornox_ask', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'james',    text: 'Why the tea?' },
        { speaker: 'mornox',   text: 'Four hundred years I waited.' },
        { speaker: 'mornox',   text: 'Tea\'s a bit old. Sorry.' },
        { speaker: 'james',    text: '...is it poison tea?' },
        { speaker: 'mornox',   text: 'What? No. Chamomile.' },
        { speaker: 'james',    text: 'Why didn\'t you just... take them?' },
        { speaker: 'mornox',   text: 'I can\'t touch them. The curse.' },
        { speaker: 'mornox',   text: 'I needed someone. You\'ll do.' },
        { speaker: 'crown',    text: 'There\'s more, kid. Ask him.' },
        { speaker: 'james',    text: 'Crown says you know him.' },
        { speaker: 'mornox',   text: '...he was my teacher. Yes.' },
        { speaker: 'mornox',   text: 'I miss the old grouch. Every day.' },
        { speaker: 'james',    text: '...' },
        { speaker: 'narrator', text: 'James steps back to the doorway.' },
      ],
      next: 'volcano_mornox_meet',
    },

    // =========================================================================
    //  ACT 4 — FIGHT PATH
    // =========================================================================

    // 17. Multi-phase Mornox battle: 3 phases, each a different element.
    //     Mornox p3 drops Mage Saber. Massive XP + gold.
    {
      id: 'volcano_mornox_battle', type: 'battle', bg: 'volcano',
      phases: [
        ['mornox_p1'],
        ['mornox_p2'],
        ['mornox_p3'],
      ],
      rewards: { gold: [200, 280], xp: 400, drops: [{ gear: 'mage_saber', chance: 1.0 }] },
      next: 'volcano_mornox_break',
    },

    // Spotlight Mornox's emotional crack — the spec's "I'M TIRED!" trio.
    // Phase 3 quipLines fire as battle barks (which is good atmosphere) but
    // those die in damage-number / button-tap noise. This dialogue beat
    // guarantees the kid SEES the crack between the fight and the death.
    {
      id: 'volcano_mornox_break', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'Mornox staggers. Robes torn. Still standing.' },
        { speaker: 'mornox',   text: 'I\'M TIRED!' },
        { speaker: 'mornox',   text: 'FOUR HUNDRED YEARS!' },
        { speaker: 'james',    text: '...' },
        { speaker: 'mornox',   text: 'JUST LET ME REST!' },
        { speaker: 'narrator', text: 'And then — quiet. He sinks down.' },
      ],
      next: 'volcano_mornox_defeat',
    },

    // 18. Fight ending — bittersweet. NO "should have listened" line.
    //     Crown grieves, doesn't judge. Treasure granted here.
    {
      id: 'volcano_mornox_defeat', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'Mornox sinks to one knee.' },
        { speaker: 'mornox',   text: 'Thank... you.' },
        { speaker: 'mornox',   text: 'Finally.' },
        { speaker: 'narrator', text: 'He crumbles, gentle as ash.' },
        { speaker: 'crown',    text: '...oh, Mor.' },
        { speaker: 'crown',    text: 'Goodbye, old friend.' },
        { speaker: 'narrator', text: 'A gold star drifts up from the ash.' },
        { speaker: 'james',    text: 'The Star. The last one.' },
        { speaker: 'crown',    text: 'You did it, kid. The kingdom is safe.' },
      ],
      effects: [
        { type: 'grant_treasure', id: 'star_of_friendship' },
        { type: 'grant_trophy', id: 'mornox_dust' },
        { type: 'set_flag', key: 'mornox_defeated', value: true },
        { type: 'complete_quest', id: 'volcano' },
      ],
      next: 'volcano_epilogue',
    },

    // =========================================================================
    //  ACT 4 — LISTEN PATH (gated by volcano_can_listen)
    // =========================================================================

    // 19. Long flashback scene. Mornox tells his story. Self-forgiveness
    //     beat is in the redemption ritual (scene 21), per agent feedback.
    {
      id: 'volcano_mornox_listen', type: 'dialogue', bg: 'flashback',
      beats: [
        { speaker: 'narrator', text: 'James sits. Takes the cup.' },
        { speaker: 'mornox',   text: 'My teacher made me promise something.' },
        { speaker: 'mornox',   text: 'Be patient. Be kind. Listen.' },
        { speaker: 'mornox',   text: 'I broke all three.' },
        { speaker: 'james',    text: '...all three? Same day?' },
        { speaker: 'mornox',   text: 'Same hour, kid.' },
        { speaker: 'mornox',   text: 'Wanted the throne. Cast a spell. Wrong.' },
        { speaker: 'mornox',   text: 'It went wrong. It always goes wrong.' },
        { speaker: 'mornox',   text: 'The crown shattered. So did he.' },
        { speaker: 'crown',    text: 'You trapped me in here, Mor.' },
        { speaker: 'mornox',   text: 'I know.' },
        { speaker: 'mornox',   text: 'Four hundred years I\'ve known.' },
        { speaker: 'james',    text: 'You were his teacher?' },
        { speaker: 'james',    text: '...that makes him your kid, kind of.' },
        { speaker: 'crown',    text: '...yeah. It really does.' },
        { speaker: 'narrator', text: 'Three people. One quiet room.' },
      ],
      next: 'volcano_mornox_choice',
    },

    // 20. The choice. Kid offers the redemption — or not.
    {
      id: 'volcano_mornox_choice', type: 'choice', bg: 'volcano',
      art: '🌟🍵\n  🧙‍♂️  ',
      caption: 'James holds the four Treasures. Mornox waits.',
      crownLine: 'Up to you, kid.',
      choices: [
        { label: 'Help him', icon: '🌟', next: 'volcano_redemption_ritual' },
        { label: 'Take and go', icon: '🚪', next: 'volcano_mornox_battle' },
      ],
    },

    // 21. Redemption ritual. CRITICAL beat: Mornox says he can't forgive
    //     HIMSELF out loud (the inner half of the arc theme).
    {
      id: 'volcano_redemption_ritual', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'James sets the four Treasures down.' },
        { speaker: 'mornox',   text: 'I don\'t deserve this.' },
        { speaker: 'mornox',   text: 'I can\'t forgive myself, you know.' },
        { speaker: 'james',    text: 'Hey.' },
        { speaker: 'mornox',   text: 'Four hundred years. Tried. Couldn\'t.' },
        { speaker: 'crown',    text: 'I forgave you a century ago, Mor.' },
        { speaker: 'crown',    text: 'You just never asked.' },
        { speaker: 'mornox',   text: 'I never could ask. Pride.' },
        { speaker: 'james',    text: 'Then ask now.' },
        { speaker: 'mornox',   text: '...will you forgive me?' },
        { speaker: 'crown',    text: 'Yes. Always.' },
        { speaker: 'mornox',   text: 'Then I\'ll try to. Someday.' },
        { speaker: 'narrator', text: 'Light. Real light. The curse lifts.' },
        { speaker: 'narrator', text: 'A small gold star rises from the kettle.' },
        { speaker: 'mornox',   text: 'Take it. It was always yours.' },
      ],
      effects: [
        { type: 'grant_treasure', id: 'star_of_friendship' },
        { type: 'grant_gold', amount: 240 },
        { type: 'grant_xp', amount: 400 },
        { type: 'grant_trophy', id: 'mornox_kettle' },
        { type: 'set_flag', key: 'volcano_listened', value: true },
        { type: 'set_flag', key: 'mornox_redeemed', value: true },
        { type: 'complete_quest', id: 'volcano' },
      ],
      next: 'volcano_mornox_goodbye',
    },

    // 22. Listen ending — the sun line. Best beat in the script.
    {
      id: 'volcano_mornox_goodbye', type: 'dialogue', bg: 'volcano',
      beats: [
        { speaker: 'narrator', text: 'Mornox stands. Slow. Lighter.' },
        { speaker: 'narrator', text: 'He walks out the door.' },
        { speaker: 'narrator', text: 'Sunlight on his face.' },
        { speaker: 'narrator', text: 'First time in 400 years.' },
        { speaker: 'mornox',   text: 'Huh.' },
        { speaker: 'mornox',   text: 'Sun.' },
        { speaker: 'mornox',   text: 'I\'d forgotten.' },
        { speaker: 'crown',    text: 'Go on, old man. Go.' },
        { speaker: 'mornox',   text: 'Take the kettle, kid.' },
        { speaker: 'mornox',   text: 'And this. Won\'t need it anymore.' },
      ],
      effects: [
        { type: 'grant_gear', id: 'mage_saber' },
      ],
      next: 'volcano_epilogue',
    },

    // =========================================================================
    //  EPILOGUE — both paths converge (3 scenes)
    // =========================================================================

    // 23. Group photo. Every shipped named character.
    {
      id: 'volcano_epilogue', type: 'dialogue', bg: 'castle',
      beats: [
        { speaker: 'narrator', text: 'James returns. Castle bells ring.' },
        { speaker: 'narrator', text: 'Everyone he\'s helped is in the courtyard.' },
        { speaker: 'foxy',     text: 'Better thief than me, king.' },
        { speaker: 'ribbit',   text: 'Ribbit ribbit RIBBIT!' },
        { speaker: 'owlette',  text: 'I am very proud, dear.' },
        { speaker: 'gus',      text: 'Hmph. Good kid.' },
        { speaker: 'yeti',     text: 'Hooo... hoooome.' },
        { speaker: 'wraith',   text: '...thank you. Truly.' },
        { speaker: 'frostbeard',text: 'Aye. A king proper.' },
        { speaker: 'drifter',  text: 'I\'m coming home, James.' },
        { speaker: 'widow',    text: 'My nets are full again.' },
        { speaker: 'finn',     text: 'CANNONBALL!' },
        { speaker: 'zephyra',  text: 'He taught me too. Long ago.' },
        { speaker: 'pompadour',text: 'Darling. Simply DARLING.' },
        { speaker: 'james',    text: '...all of you. Wow.' },
      ],
      next: 'volcano_crown_restored',
    },

    // 24. Crown's final speech. Whole again.
    {
      id: 'volcano_crown_restored', type: 'dialogue', bg: 'castle',
      beats: [
        { speaker: 'narrator', text: 'The crown\'s voice is clear now.' },
        { speaker: 'narrator', text: 'No more glitches. No more fzzt.' },
        { speaker: 'crown',    text: 'Hey, kid.' },
        { speaker: 'crown',    text: 'You held the line.' },
        { speaker: 'crown',    text: 'Five Treasures. One king.' },
        { speaker: 'crown',    text: 'I\'m proud.' },
        { speaker: 'james',    text: '...thanks, crown.' },
        { speaker: 'james',    text: 'Hey. Are you crying?' },
        { speaker: 'crown',    text: 'Crowns don\'t cry. We sparkle.' },
      ],
      next: 'volcano_end',
    },

    // 25. Ending scene. Final 5-beat sign-off + badges + trophies summary.
    {
      id: 'volcano_end', type: 'ending', bg: 'castle',
      video: 'images/volcano_end.mp4',
      beats: [
        { speaker: 'crown', text: 'You did it, kid.' },
        { speaker: 'crown', text: 'You\'re the true king now.' },
        { speaker: 'crown', text: 'Go eat something.' },
        { speaker: 'crown', text: 'I\'ll make tea. It\'ll be awful.' },
        { speaker: 'crown', text: 'I\'m a crown. But I\'ll try.' },
      ],
      showBadges: true,
      showTrophies: true,
      next: 'castle',
    },
  ];

  KJ.Registry.quests.add({
    id: 'volcano',
    region: 'volcano',
    treasure: 'star_of_friendship',
    entryScene: 'volcano_intro',
    scenes,
  });
})();
