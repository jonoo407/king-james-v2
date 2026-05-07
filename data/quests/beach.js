// King James 2 — Arc 3: The Silver Shore
// Theme: kindness. Hurt isn't the same as evil.
// Treasure: Shield of Kindness (def +3, hp +3, unlocks healing_hall)
// New ally: Finn the Sea Otter (swim sceneAbility)
// Boss: Drifter — once a healer, driven out by Mornox's lies

(function () {
  const scenes = [

    // =====================================================================
    //  1. INTRO — crown briefing
    // =====================================================================
    {
      id: 'beach_intro', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'crown',  text: 'Third treasure. The Silver Shore. Ships wrecked, fishermen gone. Whole coast is closed.' },
        { speaker: 'crown',  text: 'They say a sea witch curses the cove. Destroys everything that comes close.' },
        { speaker: 'james',  text: 'A witch? An actual witch? That is — legitimately — frightening.' },
        { speaker: 'crown',  text: 'Shield of Kindness is down there. So. Go get it.' },
        { speaker: 'james',  text: 'You could be nicer about sending me into danger, you know.' },
        { speaker: 'crown',  text: 'I\'m a crown. I\'m doing spectacularly.' },
      ],
      next: 'beach_village',
    },

    // =====================================================================
    //  2. VILLAGE — 4 prep choices
    // =====================================================================
    {
      id: 'beach_village', type: 'choice', bg: 'beach',
      art: '🏘️⚓🌊\n 🎣 🪙 🧕',
      caption: 'A fishing village — half the boats dry-docked, sails furled. A fisherman mends nets. A market is open. A widow sits alone by the sea wall.',
      crownLine: 'Last dry land before the shore. Prep now.',
      choices: [
        { label: 'Ask fisherman about the witch (-5g)', icon: '🎣', next: 'beach_village_fisher',
          condition: { type: 'gold_at_least', amount: 5 },
          effects: [
            { type: 'grant_gold', amount: -5 },
            { type: 'set_flag', key: 'knows_cavern', value: true },
          ] },
        { label: 'Buy a Heal Scroll at the market (-25g)', icon: '📜', next: 'beach_village_market',
          condition: { type: 'gold_at_least', amount: 25 },
          effects: [
            { type: 'grant_gold', amount: -25 },
            { type: 'grant_scroll', id: 'scroll_heal', amount: 1 },
          ] },
        { label: 'Sit with the widow, leave a coin (-10g)', icon: '🪙', next: 'beach_village_child',
          condition: { type: 'gold_at_least', amount: 10 },
          effects: [
            { type: 'grant_gold', amount: -10 },
            { type: 'set_flag', key: 'village_heart', value: true },
          ] },
        { label: 'Head straight to the shore', icon: '🌊', next: 'beach_cove_approach' },
      ],
    },
    {
      id: 'beach_village_fisher', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'The fisherman squints and sets down his net.' },
        { speaker: 'narrator', text: '"Cavern. Rocky point at the north end. But friend — that woman in there, she\'s been there forty years. More, maybe."' },
        { speaker: 'crown',    text: 'Forty years. That\'s a long time to be angry. Or hurt. They\'re the same thing, sometimes.' },
      ],
      next: 'beach_cove_approach',
    },
    {
      id: 'beach_village_market', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'The market keeper wraps the scroll in waxed cloth. "Don\'t open it until you need it. It\'s the good stuff."' },
        { speaker: 'crown',    text: 'Heal Scroll. Break it mid-battle. Buys you time. Worth every coin.' },
      ],
      next: 'beach_cove_approach',
    },
    {
      id: 'beach_village_child', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'The widow doesn\'t speak. You set the coin on the sea wall beside her.' },
        { speaker: 'narrator', text: 'She looks at it. Then at you. And nods — slow, grateful.' },
        { speaker: 'crown',    text: 'She lost her husband to the sea witch\'s storms. She\'ll remember you were kind today.' },
      ],
      next: 'beach_cove_approach',
    },

    // =====================================================================
    //  3. COVE APPROACH
    // =====================================================================
    {
      id: 'beach_cove_approach', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'The Silver Shore. White sand, sea-foam, and the wreck of a fishing boat half-buried in the dunes.' },
        { speaker: 'james',    text: 'It\'s... actually kind of beautiful? I thought it would be scarier.' },
        { speaker: 'crown',    text: 'Keep walking. Things that are beautiful and dangerous usually look exactly like this.' },
        { speaker: 'narrator', text: 'At the tide pools ahead, something glints. And clacks.' },
      ],
      next: 'beach_cove_crabs',
    },

    // =====================================================================
    //  4. CRAB ENCOUNTER — fight or wade
    // =====================================================================
    {
      id: 'beach_cove_crabs', type: 'choice', bg: 'beach',
      art: '🦀🦀🦀\n🌊⬆️🌊',
      caption: 'Tide crabs! Big ones — orange shells the size of shields. They\'ve blocked the path over the rocks and are very annoyed about your presence.',
      crownLine: 'Fight: earth moves are rubbish vs water crabs. Magic or fire works. Wading costs HP.',
      choices: [
        { label: 'Fight the crabs!', icon: '⚔️', next: 'beach_cove_fight' },
        { label: 'Wade around through the shallows (-6 HP)', icon: '🌊', next: 'beach_cove_wade',
          effects: [{ type: 'damage_party', amount: 6 }] },
      ],
    },
    {
      id: 'beach_cove_fight', type: 'battle', bg: 'beach',
      enemies: ['tide_crab', 'tide_crab'],
      rewards: { gold: [14, 24], xp: 38, drops: [] },
      next: 'beach_finn_pool',
      onDefeat: 'beach_intro',
    },
    {
      id: 'beach_cove_wade', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'Cold. VERY cold. The water is up to your chin before you clear the rocks.' },
        { speaker: 'james',    text: 'Worth it? Worth it.' },
        { speaker: 'crown',    text: 'Technically creative. Also technically reckless. But we\'re past the crabs.' },
      ],
      next: 'beach_finn_pool',
    },

    // =====================================================================
    //  5. FINN THE SEA OTTER — recruit or miss
    // =====================================================================
    {
      id: 'beach_finn_pool', type: 'choice', bg: 'beach',
      art: '🦦\n 🏊💦',
      caption: 'In a tide pool: a small sea otter, one paw trapped under a collapsed rock. He\'s been there awhile. Fur matted, eyes tired. He looks at you.',
      crownLine: 'You could free him. You could keep walking. Treasure isn\'t in a tide pool.',
      choices: [
        { label: 'Move the rock — free him', icon: '🦦', next: 'beach_finn_freed',
          effects: [{ type: 'recruit_ally', id: 'finn' }] },
        { label: 'Use a Friendship Charm', icon: '📿', next: 'beach_finn_freed',
          condition: { type: 'charms_at_least', amount: 1 },
          effects: [
            { type: 'consume_charm', amount: 1 },
            { type: 'recruit_ally', id: 'finn' },
          ] },
        { label: 'Keep walking', icon: '👟', next: 'beach_finn_skipped',
          effects: [{ type: 'mark_met_ally', id: 'finn' }] },
      ],
    },
    {
      id: 'beach_finn_freed', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'The rock scrapes free. The otter stands — shaky, then steady — and shakes water from his coat.' },
        { speaker: 'finn',     text: '*chitters* Three tides I\'ve been there. Three.' },
        { speaker: 'james',    text: 'I\'m sorry. You okay?' },
        { speaker: 'finn',     text: '...you came back. Most don\'t come back.' },
        { speaker: 'crown',    text: 'He\'s joining the team. Try to argue with me.' },
      ],
      next: 'beach_dunes',
    },
    {
      id: 'beach_finn_skipped', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'The otter watches you pass. Doesn\'t make a sound.' },
        { speaker: 'crown',    text: 'He\'s still stuck. You know that. You know that, right? ...okay. Keep moving.' },
      ],
      next: 'beach_dunes',
    },

    // =====================================================================
    //  6. DUNES — fight sprites, sneak with Foxy, or charge through
    // =====================================================================
    {
      id: 'beach_dunes', type: 'choice', bg: 'beach',
      art: '🌬️💨🌾\n 🌪️  🌪️',
      caption: 'The dunes shift and whirl. Sand sprites dart between the grasses — fast, cranky, very territorial about this particular stretch of sand.',
      crownLine: 'Wind creatures. Earth moves won\'t do much. Magic and fire hit harder here.',
      choices: [
        { label: 'Fight the sand sprites!', icon: '⚔️', next: 'beach_dunes_fight' },
        { label: 'Foxy sneaks you through', icon: '🦊', next: 'beach_dunes_sneak',
          condition: { type: 'ally_recruited', id: 'foxy' } },
        { label: 'Charge through — take the hits (-4 HP)', icon: '💨', next: 'beach_dunes_charge',
          effects: [{ type: 'damage_party', amount: 4 }] },
      ],
    },
    {
      id: 'beach_dunes_fight', type: 'battle', bg: 'beach',
      enemies: ['sand_sprite', 'sand_sprite'],
      rewards: { gold: [12, 20], xp: 34, drops: [] },
      next: 'beach_ruins',
      onDefeat: 'beach_intro',
    },
    {
      id: 'beach_dunes_sneak', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'foxy',  text: 'Shhh. Low. Step where I step. The sprites track sound, not sight.' },
        { speaker: 'narrator', text: 'The sprites swirl and hiss — but you\'re already through, crouched in the sea grass on the far side.' },
        { speaker: 'foxy',  text: 'Clean. I\'m excellent.' },
        { speaker: 'crown', text: 'You\'re both excellent. Let\'s keep going.' },
      ],
      next: 'beach_ruins',
    },
    {
      id: 'beach_dunes_charge', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'You lower your head and RUN. The sprites rake at your back with wind and grit.' },
        { speaker: 'narrator', text: 'You burst through to open sand, stinging, but alive.' },
        { speaker: 'crown',    text: 'Unsubtle. Effective. Let\'s call it courageous and move on.' },
      ],
      next: 'beach_ruins',
    },

    // =====================================================================
    //  7. OLD RUINS — optional lore tablet (unlocks drifter_past flag)
    // =====================================================================
    {
      id: 'beach_ruins', type: 'choice', bg: 'beach',
      art: '🏛️🌿📜',
      caption: 'Stone ruins. A healer\'s shrine, half-swallowed by sand. A carved tablet still stands, the inscription worn but readable.',
      crownLine: 'History lesson. Optional. But some history matters.',
      choices: [
        { label: 'Read the old tablet', icon: '📜', next: 'beach_ruins_read',
          effects: [{ type: 'set_flag', key: 'knows_drifter_past', value: true }] },
        { label: 'Keep moving — no time', icon: '👋', next: 'beach_wreck' },
      ],
    },
    {
      id: 'beach_ruins_read', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: '"HERE STOOD THE HEALING HOUSE OF DRIFTER. SHE TENDED BROKEN SAILORS FOR THIRTY WINTERS."' },
        { speaker: 'narrator', text: '"THEN THE WIZARD CAME. AND WE LISTENED TO HIM INSTEAD OF HER."' },
        { speaker: 'narrator', text: '"WE DROVE HER OUT. WE ARE SORRY. WE SHOULD HAVE COME BACK."' },
        { speaker: 'narrator', text: '"WE NEVER DID."' },
        { speaker: 'james',    text: 'The witch — she was a HEALER?' },
        { speaker: 'crown',    text: '...wizard. Tired eyes. It keeps coming back to him.' },
      ],
      next: 'beach_wreck',
    },

    // =====================================================================
    //  8. THE SHIPWRECK — Finn dives, bribe a diver, or skip
    // =====================================================================
    {
      id: 'beach_wreck', type: 'choice', bg: 'beach',
      art: '⚓🚢💥\n   🌊',
      caption: 'An old wreck — half its hull above water. Something glints below the surface. Gear, maybe. Or a trap.',
      crownLine: 'One way in, one way down. Needs a swimmer.',
      choices: [
        { label: 'Finn dives for it', icon: '🦦', next: 'beach_wreck_finn',
          condition: { type: 'ally_recruited', id: 'finn' } },
        { label: 'Pay a local diver (-5g)', icon: '🪙', next: 'beach_wreck_gold',
          condition: { type: 'gold_at_least', amount: 5 },
          effects: [{ type: 'grant_gold', amount: -5 }] },
        { label: 'Leave it — keep moving', icon: '👋', next: 'beach_serpent_approach' },
      ],
    },
    {
      id: 'beach_wreck_finn', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'finn',  text: '*splash* — — — *long pause* — — — *splash back*' },
        { speaker: 'finn',  text: 'Blade down there. Old coral grown through it. Beautiful, actually.' },
        { speaker: 'crown', text: 'Coral Blade! Water-type weapon. +6 ATK, Tide Slash move. That\'s a Tier 4 weapon, kid. He SWAM to get you a Tier 4 weapon.' },
        { speaker: 'james', text: 'Finn. You\'re incredible.' },
        { speaker: 'finn',  text: '*sneezes saltwater* Yes. I know.' },
      ],
      effects: [{ type: 'grant_gear', id: 'coral_blade' }],
      next: 'beach_serpent_approach',
    },
    {
      id: 'beach_wreck_gold', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'A grizzled diver wades in, roots around, and surfaces with a waterproof pouch.' },
        { speaker: 'narrator', text: '"Forty years of salvage gold in there. Yours, Your Majesty."' },
        { speaker: 'crown',    text: 'Nice haul. Coral Blade is still down there — but coin is coin.' },
      ],
      effects: [{ type: 'grant_gold', amount: 35 }],
      next: 'beach_serpent_approach',
    },

    // =====================================================================
    //  9. THE SEA SERPENT — fight, listen (kindness payoff), or feed
    // =====================================================================
    {
      id: 'beach_serpent_approach', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'The north headland. A dark ribbon in the shallows — thirty feet long if it\'s an inch. A sea serpent. Mouth open.' },
        { speaker: 'james',    text: 'Oh. That\'s. That is a very large serpent.' },
        { speaker: 'crown',    text: 'Huge. But — is it growling or is it... groaning? Listen for a second.' },
      ],
      next: 'beach_serpent',
    },
    {
      id: 'beach_serpent', type: 'choice', bg: 'beach',
      art: '🐉🌊😮',
      caption: 'Enormous sea serpent. But it isn\'t lunging — it\'s circling the same patch of shallows, mournfully. Something is wrong with it.',
      crownLine: 'Fight it. Listen. Feed it. Your call.',
      choices: [
        { label: 'Attack!', icon: '⚔️', next: 'beach_serpent_fight' },
        { label: 'Put down your weapon and watch', icon: '👁️', next: 'beach_serpent_listen' },
        { label: 'Toss fish from the docks (-15g)', icon: '🐟', next: 'beach_serpent_toss',
          condition: { type: 'gold_at_least', amount: 15 },
          effects: [{ type: 'grant_gold', amount: -15 }] },
      ],
    },
    {
      id: 'beach_serpent_fight', type: 'battle', bg: 'beach',
      enemies: ['sea_serpent'],
      rewards: { gold: [28, 44], xp: 40, drops: [{ gear: 'coral_blade', chance: 0.4 }] },
      next: 'beach_cavern',
      onDefeat: 'beach_intro',
    },
    {
      id: 'beach_serpent_listen', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'The serpent stops circling. It looks at you — long, slow look. Then lowers its head.' },
        { speaker: 'narrator', text: 'Near your feet: a smashed fishing net tangled around a rock. The serpent keeps nudging it.' },
        { speaker: 'james',    text: 'Wait — it\'s... something it loves is trapped in there?' },
        { speaker: 'crown',    text: 'Baby serpents. Three of them, tangled in a discarded net. Oh.' },
        { speaker: 'james',    text: 'I\'m cutting them free. Obviously.' },
        { speaker: 'narrator', text: 'Three small serpents wriggle free into the water. The mother bows — actually bows — then slips into the deep.' },
        { speaker: 'crown',    text: 'The sea is... singing? I think that\'s singing. You did that.' },
      ],
      effects: [
        { type: 'set_flag', key: 'serpent_friend', value: true },
        { type: 'heal_party', amount: 15 },
      ],
      next: 'beach_cavern',
    },
    {
      id: 'beach_serpent_toss', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'The serpent snaps up the fish. Studies you.' },
        { speaker: 'narrator', text: 'Then bumps you — gently, like a cat — with its enormous snout. And dives.' },
        { speaker: 'crown',    text: 'Grateful creature. I\'ll allow it. Move on.' },
      ],
      effects: [
        { type: 'set_flag', key: 'serpent_friend', value: true },
        { type: 'heal_party', amount: 8 },
      ],
      next: 'beach_cavern',
    },

    // =====================================================================
    //  10. CAVERN PREP — Finn scouts, pay for help, or charge in
    // =====================================================================
    {
      id: 'beach_cavern', type: 'choice', bg: 'beach',
      art: '🌊🕳️🌊\n  ❓',
      caption: 'The cavern entrance. Rocky arch, sea-dark inside. Something pulses in there — not light. A feeling. Old. Sad.',
      crownLine: 'Something\'s lived in there a long time. Catch your breath before going in.',
      choices: [
        { label: 'Charge in!', icon: '⚔️', next: 'beach_drifter' },
        { label: 'Finn scouts ahead (+10 heal)', icon: '🦦', next: 'beach_cavern_finn',
          condition: { type: 'ally_recruited', id: 'finn' },
          effects: [{ type: 'heal_party', amount: 10 }] },
        { label: 'Pay a fisherman guide (-20g, +12 heal)', icon: '🪙', next: 'beach_cavern_gold',
          condition: { type: 'gold_at_least', amount: 20 },
          effects: [
            { type: 'grant_gold', amount: -20 },
            { type: 'heal_party', amount: 12 },
          ] },
      ],
    },
    {
      id: 'beach_cavern_finn', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'finn',     text: 'I\'ll go first. I know sea caves. This one smells of old sadness.' },
        { speaker: 'narrator', text: 'He returns dripping, expression thoughtful.' },
        { speaker: 'finn',     text: 'She\'s in the far chamber. She\'s crying. I don\'t think she knows we can hear.' },
        { speaker: 'james',    text: 'That makes this harder, somehow.' },
        { speaker: 'crown',    text: 'Good. It should be hard. Catch your breath. You\'ll need it.' },
      ],
      next: 'beach_drifter',
    },
    {
      id: 'beach_cavern_gold', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'narrator', text: 'An old fisherman nods, accepts the coins, and produces a pot of fish stew from seemingly nowhere.' },
        { speaker: 'narrator', text: '"She was kind, once. A very long time ago." He doesn\'t elaborate.' },
        { speaker: 'crown',    text: 'Even the fishermen remember. Just not enough to go back. Eat up. Then we go in.' },
      ],
      next: 'beach_drifter',
    },

    // =====================================================================
    //  11. BOSS: DRIFTER — mixed types: magic, water, wind
    //  Magic (pearl_beam/think_fast/lucky_throw) hits Drifter (magic type) hard.
    //  Water moves (tide_slash/ice_cut/splash) hit tide_crab (water) normally.
    //  Earth moves (iron_slash) hit sand_sprite (wind) poorly — forces adaptation.
    // =====================================================================
    {
      id: 'beach_drifter', type: 'battle', bg: 'beach',
      enemies: ['drifter', 'tide_crab', 'sand_sprite'],
      rewards: { gold: [120, 165], xp: 105, drops: [{ gear: 'sea_kings_plate', chance: 1.0 }] },
      next: 'beach_drifter_reveal',
      onDefeat: 'beach_intro',
    },

    // =====================================================================
    //  12. POST-BATTLE TWIST — the reveal
    // =====================================================================
    {
      id: 'beach_drifter_reveal', type: 'dialogue', bg: 'beach',
      beats: [
        { speaker: 'drifter', text: '*collapses to her knees* ...you beat me. FINE. Take it. Take the Shield. Take everything.' },
        { speaker: 'james',   text: 'I don\'t want everything. I want to know why you\'re out here.' },
        { speaker: 'drifter', text: '...what?' },
        { speaker: 'james',   text: 'There\'s a tablet in the ruins. Healing house. Thirty winters. That was you, wasn\'t it.' },
        { speaker: 'drifter', text: '...*long silence*...yes.' },
        { speaker: 'drifter', text: 'I tended sailors for thirty years. Then a man came — old, tired eyes — told them I was cursing the sea. Poisoning the fish.' },
        { speaker: 'drifter', text: 'I wasn\'t. But they believed him. And I\'ve been here — alone — ever since.' },
        { speaker: 'james',   text: 'Forty years.' },
        { speaker: 'drifter', text: '...more, now.' },
        { speaker: 'crown',   text: 'He doesn\'t fight the people who could help you. He just makes them think they\'re alone.' },
        { speaker: 'james',   text: 'Can you come back? To the village?' },
        { speaker: 'drifter', text: '...they\'d never accept—' },
        { speaker: 'james',   text: 'The widow by the sea wall. She lost her husband to your storms. She needs someone who knows medicine.' },
        { speaker: 'drifter', text: '*first real pause in forty years*' },
        { speaker: 'drifter', text: 'I would need... to start very small.' },
        { speaker: 'james',   text: 'That\'s okay. Small is how everything good starts.' },
        { speaker: 'crown',   text: 'I have never been more proud of you. And I\'m a crown. I\'ve seen a LOT of kings.' },
      ],
      next: 'beach_reward',
    },

    // =====================================================================
    //  13. REWARD — treasure + castle unlock
    // =====================================================================
    {
      id: 'beach_reward', type: 'dialogue', bg: 'castle',
      video: 'images/treasure_shield_of_kindness.mp4',
      beats: [
        { speaker: 'narrator', text: 'Drifter leads the way back to the village. Slowly. The fishermen stare. The widow stands.' },
        { speaker: 'narrator', text: 'They look at each other for a long time. Then the widow opens her door.' },
        { speaker: 'narrator', text: '"You should come in," she says. "I have tea."' },
        { speaker: 'drifter',  text: '...yes. Tea.' },
        { speaker: 'crown',    text: 'The Shield of Kindness. DEF +3, HP +3. It glows when allies are near. The Healing Hall at the castle is open now.' },
        { speaker: 'james',    text: 'Is that it? Is all kindness does just... defend?' },
        { speaker: 'crown',    text: 'It protected a healer alone on a dark shore for forty years. It has done more than any sword.' },
      ],
      effects: [
        { type: 'grant_treasure', id: 'shield_of_kindness' },
        { type: 'unlock_room',    id: 'healing_hall' },
        { type: 'grant_trophy',   id: 'drifter_lantern' },
        { type: 'complete_quest', id: 'beach' },
        { type: 'grant_gold',     amount: 70 },
      ],
      next: 'beach_outro_mornox',
    },

    // =====================================================================
    //  14. MORNOX OUTRO — escalation (3rd treasure, tone shifts colder)
    // =====================================================================
    {
      id: 'beach_outro_mornox', type: 'dialogue', bg: 'rescue',
      beats: [
        { speaker: 'narrator', text: 'Back at the castle: the throne room is warm. Sunlight through new windows. And on the throne — another scroll.' },
        { speaker: 'james',    text: 'He keeps writing to us.' },
        { speaker: 'crown',    text: 'He doesn\'t write. He plants. Read it.' },
        { speaker: 'mornox',   text: 'Three. Impressive, little king. I underestimated your... persistence.' },
        { speaker: 'mornox',   text: 'Drifter was rather dear to me, once. I planted one small lie and she fell apart so beautifully. Don\'t blame me — I just told her the worst truth I could find.' },
        { speaker: 'mornox',   text: 'Two treasures remain. You know where to look. I\'ll be watching.' },
        { speaker: 'narrator', text: 'The scroll crumbles. Something falls from it — a dried sea flower, pressed carefully, like a keepsake.' },
        { speaker: 'crown',    text: 'He kept it. A flower from Drifter\'s healing garden. All this time.' },
        { speaker: 'crown',    text: 'He isn\'t just cruel. That\'s worse, somehow. Two treasures left. Don\'t stop.' },
      ],
      next: 'castle',
    },
  ];

  KJ.Registry.quests.add({
    id: 'beach',
    region: 'beach',
    treasure: 'shield_of_kindness',
    entryScene: 'beach_intro',
    scenes,
  });
})();
