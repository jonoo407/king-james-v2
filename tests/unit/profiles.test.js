// KJ.Profiles — multi-profile save management
// Storage: king_james_2_save:<normalized_name> per profile,
//          king_james_2_active for the currently-active profile name,
//          king_james_2_save (legacy single-slot) migrated on first boot.

const { test, expect, describe, summarize } = require('../lib/runner');
const { loadKJ, _ctx } = require('../lib/bootstrap');
const KJ = loadKJ();

// Helper: nuke every kj save-related key so each test starts clean.
function clearStorage() {
  const ls = _ctx().localStorage;
  const keys = [];
  for (let i = 0; i < ls.length; i++) keys.push(ls.key(i));
  for (const k of keys) {
    if (k && (k.startsWith('king_james_2_save') || k === 'king_james_2_active')) {
      ls.removeItem(k);
    }
  }
}

describe('KJ.Profiles.validate', () => {
  test('accepts a normal name', () => {
    expect(KJ.Profiles.validate('Sam').ok).toBe(true);
  });
  test('accepts "James" — profile name distinct from protagonist', () => {
    expect(KJ.Profiles.validate('James').ok).toBe(true);
  });
  test('accepts a name with internal spaces', () => {
    expect(KJ.Profiles.validate('Sam B').ok).toBe(true);
  });
  test('accepts digits', () => {
    expect(KJ.Profiles.validate('Player1').ok).toBe(true);
  });
  test('rejects empty string', () => {
    expect(KJ.Profiles.validate('').ok).toBe(false);
  });
  test('rejects whitespace-only', () => {
    expect(KJ.Profiles.validate('   ').ok).toBe(false);
  });
  test('rejects names longer than 12 chars after trim', () => {
    expect(KJ.Profiles.validate('Bartholomewabc').ok).toBe(false);
  });
  test('rejects names with no letter or digit', () => {
    expect(KJ.Profiles.validate('!!!').ok).toBe(false);
  });
});

describe('KJ.Profiles.normalize', () => {
  test('lowercases', () => {
    expect(KJ.Profiles.normalize('Sam')).toBe('sam');
  });
  test('trims surrounding whitespace', () => {
    expect(KJ.Profiles.normalize('  Sam  ')).toBe('sam');
  });
  test('collapses internal whitespace', () => {
    expect(KJ.Profiles.normalize('Sam   B')).toBe('sam b');
  });
  test('returns null for invalid input', () => {
    expect(KJ.Profiles.normalize('')).toBe(null);
  });
  test('Sam and SAM normalize to the same key', () => {
    expect(KJ.Profiles.normalize('SAM')).toBe(KJ.Profiles.normalize('Sam'));
  });
});

describe('KJ.Profiles CRUD', () => {
  test('list is empty when no profiles exist', () => {
    clearStorage();
    expect(KJ.Profiles.list()).toEqual([]);
  });

  test('create adds a profile, sets it active, persists save', () => {
    clearStorage();
    const r = KJ.Profiles.create('Sam');
    expect(r.created).toBe(true);
    expect(r.name).toBe('sam');
    expect(KJ.Profiles.getActive()).toBe('sam');
    expect(KJ.Profiles.exists('sam')).toBe(true);
  });

  test('create rejects invalid display names', () => {
    clearStorage();
    expect(KJ.Profiles.create('').created).toBe(false);
  });

  test('create rejects duplicate (case-insensitive) names', () => {
    clearStorage();
    KJ.Profiles.create('Sam');
    const r = KJ.Profiles.create('SAM');
    expect(r.created).toBe(false);
  });

  test('list returns each created profile with displayName + level + lastSavedAt', () => {
    clearStorage();
    KJ.Profiles.create('Sam');
    const list = KJ.Profiles.list();
    expect(list.length).toBe(1);
    expect(list[0].name).toBe('sam');
    expect(list[0].displayName).toBe('Sam');
    expect(list[0].level).toBe(1);
    expect(typeof list[0].lastSavedAt).toBe('number');
  });

  test('list sorts most-recently-saved first', () => {
    clearStorage();
    KJ.Profiles.create('Alice');
    // Ensure distinct lastSavedAt by nudging the second create's timestamp later
    const before = Date.now();
    while (Date.now() === before) { /* spin <1ms */ }
    KJ.Profiles.create('Bob');
    const list = KJ.Profiles.list();
    expect(list[0].name).toBe('bob');
    expect(list[1].name).toBe('alice');
  });

  test('load switches the active profile and restores its state', () => {
    clearStorage();
    KJ.Profiles.create('Sam');
    KJ.State.get().player.level = 7;
    KJ.State.save();
    KJ.Profiles.create('Alice'); // sets active to alice, fresh state
    expect(KJ.State.get().player.level).toBe(1);
    const r = KJ.Profiles.load('sam');
    expect(r.loaded).toBe(true);
    expect(KJ.Profiles.getActive()).toBe('sam');
    expect(KJ.State.get().player.level).toBe(7);
  });

  test('delete removes the profile save', () => {
    clearStorage();
    KJ.Profiles.create('Sam');
    KJ.Profiles.delete('sam');
    expect(KJ.Profiles.exists('sam')).toBe(false);
  });

  test('delete clears active if the deleted profile was active', () => {
    clearStorage();
    KJ.Profiles.create('Sam');
    KJ.Profiles.delete('sam');
    expect(KJ.Profiles.getActive()).toBe(null);
  });
});

describe('KJ.Profiles legacy migration', () => {
  test('hasLegacySave detects the legacy single-slot key', () => {
    clearStorage();
    _ctx().localStorage.setItem('king_james_2_save', JSON.stringify({ version: 1, player: { level: 5 } }));
    expect(KJ.Profiles.hasLegacySave()).toBe(true);
  });

  test('hasLegacySave returns false when only profile keys exist', () => {
    clearStorage();
    KJ.Profiles.create('Sam');
    expect(KJ.Profiles.hasLegacySave()).toBe(false);
  });

  test('migrateLegacy moves the legacy save under a new profile and deletes the old key', () => {
    clearStorage();
    const fresh = KJ.State.freshState();
    fresh.player.level = 9;
    _ctx().localStorage.setItem('king_james_2_save', JSON.stringify(fresh));
    const r = KJ.Profiles.migrateLegacy('Jonathan');
    expect(r.migrated).toBe(true);
    expect(r.name).toBe('jonathan');
    expect(_ctx().localStorage.getItem('king_james_2_save')).toBe(null);
    expect(KJ.Profiles.exists('jonathan')).toBe(true);
    KJ.Profiles.load('jonathan');
    expect(KJ.State.get().player.level).toBe(9);
  });

  test('migrateLegacy fails when no legacy save exists', () => {
    clearStorage();
    expect(KJ.Profiles.migrateLegacy('Sam').migrated).toBe(false);
  });
});

if (require.main === module) summarize();
