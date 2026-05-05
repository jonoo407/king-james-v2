// King James 2 — Tiny TDD runner
// Usage in a test file:
//
//   const { test, expect, summarize } = require('../lib/runner');
//   const { loadKJ } = require('../lib/bootstrap');
//   const KJ = loadKJ();
//
//   test('sparks cap at 10', () => {
//     expect(KJ.maxSparksForLevel(99)).toBe(10);
//   });
//
//   if (require.main === module) summarize();
//
// Run a single file:   node tests/unit/spark-mana.test.js
// Run all unit tests:  node tests/run-unit.js

const _state = { pass: 0, fail: 0, failures: [] };

function test(name, fn) {
  try {
    fn();
    process.stdout.write(`  \x1b[32m✓\x1b[0m ${name}\n`);
    _state.pass++;
  } catch (e) {
    process.stdout.write(`  \x1b[31m✗\x1b[0m ${name}\n    ${e.message}\n`);
    _state.fail++;
    _state.failures.push({ name, message: e.message });
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) throw new Error(`expected truthy, got ${JSON.stringify(actual)}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`expected falsy, got ${JSON.stringify(actual)}`);
    },
    toBeGreaterThan(n) {
      if (!(actual > n)) throw new Error(`expected > ${n}, got ${actual}`);
    },
    toBeGreaterThanOrEqual(n) {
      if (!(actual >= n)) throw new Error(`expected >= ${n}, got ${actual}`);
    },
    toBeLessThan(n) {
      if (!(actual < n)) throw new Error(`expected < ${n}, got ${actual}`);
    },
    toBeLessThanOrEqual(n) {
      if (!(actual <= n)) throw new Error(`expected <= ${n}, got ${actual}`);
    },
    toContain(item) {
      const ok = Array.isArray(actual) ? actual.includes(item) : String(actual).includes(item);
      if (!ok) throw new Error(`expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`);
    },
    toThrow() {
      let threw = false;
      try { actual(); } catch { threw = true; }
      if (!threw) throw new Error(`expected function to throw`);
    },
  };
}

function describe(name, fn) {
  process.stdout.write(`\n${name}\n`);
  fn();
}

function summarize() {
  const total = _state.pass + _state.fail;
  process.stdout.write(`\n${_state.pass}/${total} passed`);
  if (_state.fail > 0) {
    process.stdout.write(`, \x1b[31m${_state.fail} failed\x1b[0m\n`);
    process.exit(1);
  }
  process.stdout.write(`\n`);
}

function _stats() {
  return { ..._state };
}

function _reset() {
  _state.pass = 0;
  _state.fail = 0;
  _state.failures = [];
}

module.exports = { test, expect, describe, summarize, _stats, _reset };
