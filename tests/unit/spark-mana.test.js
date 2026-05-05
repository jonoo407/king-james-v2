// Spark mana — KJ.maxSparksForLevel(level) → 3..10
// Formula: min(10, 3 + floor(level / 3))
// Locks the curve so a refactor can't silently break the spark economy.

const { test, expect, describe, summarize } = require('../lib/runner');
const { loadKJ } = require('../lib/bootstrap');
const KJ = loadKJ();

describe('KJ.maxSparksForLevel', () => {
  test('starts at 3 sparks at level 1', () => {
    expect(KJ.maxSparksForLevel(1)).toBe(3);
  });

  test('still 3 at level 2 (formula uses floor)', () => {
    expect(KJ.maxSparksForLevel(2)).toBe(3);
  });

  test('bumps to 4 at level 3', () => {
    expect(KJ.maxSparksForLevel(3)).toBe(4);
  });

  test('caps at 10 by level 21 (HIGH KING)', () => {
    expect(KJ.maxSparksForLevel(21)).toBe(10);
  });

  test('stays capped past level 21', () => {
    expect(KJ.maxSparksForLevel(99)).toBe(10);
  });
});

if (require.main === module) summarize();
