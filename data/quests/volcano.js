// King James 2 — Quest Stub: Volcano (unwritten)
(function () {
  KJ.Registry.quests.add({
    id: 'volcano',
    region: 'volcano',
    treasure: 'star_of_friendship',
    entryScene: 'volcano_stub',
    scenes: [
      { id: 'volcano_stub', type: 'dialogue', bg: 'volcano',
        beats: [{ speaker: 'crown', text: 'Lava: hot. Advice: don\'t touch.' }],
        next: 'castle' },
    ],
  });
})();
