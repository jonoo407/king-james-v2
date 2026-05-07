// King James 2 — Opening sequence
// Plays once on NEW GAME. Sets up: who James is, who the Crown is,
// who Mornox is, what the Treasures are, why we care.
//
// Every 7yo should understand the plot after this 4-scene sequence.

(function () {
  const scenes = [

    // 1. The mud
    {
      id: 'intro_mud', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'narrator', text: 'James is a kid. Muddy. A little bored. Kicking rocks.' },
        { speaker: 'narrator', text: 'Something shiny is stuck in a puddle.' },
        { speaker: 'james',    text: 'Ooh! Is that... a CROWN?' },
      ],
      next: 'intro_crown_wake',
    },

    // 2. Crown wakes up
    {
      id: 'intro_crown_wake', type: 'dialogue', bg: 'forest',
      beats: [
        { speaker: 'narrator', text: 'He picks it up. Wipes off the mud. Puts it on his head.' },
        { speaker: 'crown',    text: 'Bzzt... oh! Oh HELLO. You\'re... a kid. Huh.' },
        { speaker: 'james',    text: 'You TALK?!' },
        { speaker: 'crown',    text: 'Yeah, sorry. I\'ve been asleep a long time. Long, long time.' },
        { speaker: 'james',    text: '...is this crown mine now?' },
        { speaker: 'crown',    text: 'Looks like it. Congrats, kid. You\'re king.' },
        { speaker: 'james',    text: 'I\'M KING?!' },
      ],
      next: 'intro_story',
    },

    // 3. The backstory — the ENTIRE plot explained to a 7yo in under 10 lines
    {
      id: 'intro_story', type: 'dialogue', bg: 'castle',
      beats: [
        { speaker: 'crown',    text: 'Okay, story time. Sit. Listen. Ready?' },
        { speaker: 'crown',    text: 'Long ago I was ONE big crown. The kingdom\'s crown.' },
        { speaker: 'crown',    text: 'Then a wizard named MORNOX tried to steal me. His spell went wrong.' },
        { speaker: 'crown',    text: 'It broke me into FIVE pieces. Called Treasures. Hid them all over the land.' },
        // Lore clarifier — the kid (and any adult reading along) needs to
        // understand that the talking crown they're wearing is the EMPTY
        // BAND and the Treasures are the missing jewels. Otherwise the
        // model "I'm a crown collecting crowns" reads as a contradiction.
        { speaker: 'james',    text: 'But I\'m wearing one right now?' },
        { speaker: 'crown',    text: 'This? I\'m just the empty band.' },
        { speaker: 'crown',    text: 'The 5 Treasures? Those are MY jewels.' },
        { speaker: 'crown',    text: 'It also cursed him. He\'s been mad about it for 400 years.' },
        { speaker: 'james',    text: 'Whoa. So what do we do?' },
        { speaker: 'crown',    text: 'Find the 5 Treasures. Put me back together. If Mornox gets them first, the whole kingdom falls.' },
        { speaker: 'crown',    text: 'He CAN\'T touch them. But he\'s tricky. He\'s watching.' },
        { speaker: 'james',    text: '...okay. I can do this. I\'m KING.' },
        { speaker: 'crown',    text: 'You\'re 7. But sure! Let\'s go.' },
      ],
      next: 'intro_castle_arrival',
    },

    // 4. Arrive at the castle — tutorial handoff
    {
      id: 'intro_castle_arrival', type: 'dialogue', bg: 'castle',
      beats: [
        { speaker: 'narrator', text: 'They walk to the castle. Everyone bows. A little awkward.' },
        { speaker: 'crown',    text: 'This is your castle now. Throne Hall. Map. Gear Chest. Ally Room.' },
        { speaker: 'crown',    text: '5 regions on the map. 1 Treasure each. First one is the Forest.' },
        { speaker: 'crown',    text: 'Pick the Map when you\'re ready. Let\'s go save a kingdom, kid.' },
      ],
      effects: [
        { type: 'set_flag', key: 'intro_seen', value: true },
      ],
      next: 'castle',
    },
  ];

  KJ.Registry.quests.add({
    id: 'intro',
    region: null,
    treasure: null,
    entryScene: 'intro_mud',
    scenes,
  });
})();
