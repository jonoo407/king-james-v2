// King James 2 — Quest Stub: Beach (unwritten)
(function () {
  KJ.Registry.quests.add({
    id: 'beach',
    region: 'beach',
    treasure: 'shield_of_kindness',
    entryScene: 'beach_stub',
    scenes: [
      { id: 'beach_stub', type: 'dialogue', bg: 'beach',
        beats: [{ speaker: 'crown', text: 'Shore\'s quiet. For now.' }],
        next: 'castle' },
    ],
  });
})();
