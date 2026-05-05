// King James 2 — Unit test runner
// Discovers and runs every tests/unit/*.test.js file in one process,
// then summarizes once at the end.
//
// Usage: node tests/run-unit.js

const fs = require('fs');
const path = require('path');
const { summarize } = require('./lib/runner');

const UNIT_DIR = path.join(__dirname, 'unit');
const files = fs.readdirSync(UNIT_DIR)
  .filter(f => f.endsWith('.test.js'))
  .sort();

if (files.length === 0) {
  console.log('No unit tests found in tests/unit/');
  process.exit(0);
}

for (const f of files) {
  process.stdout.write(`\n── ${f} ──`);
  require(path.join(UNIT_DIR, f));
}

summarize();
