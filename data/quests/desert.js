// King James 2 — Quest Stub: Desert (unwritten)
(function () {
  KJ.Registry.quests.add({
    id: 'desert',
    region: 'desert',
    treasure: 'fire_of_courage',
    entryScene: 'desert_stub',
    scenes: [
      { id: 'desert_stub', type: 'dialogue', bg: 'desert',
        beats: [{ speaker: 'crown', text: 'Sand. Sand. More sand. Come back later.' }],
        next: 'castle' },
    ],
  });
})();
