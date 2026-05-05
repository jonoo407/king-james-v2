// King James 2 — Test bootstrap
// Loads the engine + data scripts into a Node vm context using the same
// browser shim as qc_suite.js. Returns the KJ namespace so unit tests can
// poke at it.
//
// Memoized: loadKJ() is cheap to call repeatedly within one node process.
// State is shared across tests in the same file — call KJ.State.reset()
// in your test setup if you need a clean slate.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let _KJ = null;
let _ctxRef = null;

function buildShim() {
  const _localStore = {};
  const shim = {
    console,
    window: {},
    localStorage: {
      getItem: k => _localStore[k] || null,
      setItem: (k, v) => { _localStore[k] = v; },
      removeItem: k => { delete _localStore[k]; },
      key: i => Object.keys(_localStore)[i] || null,
      get length() { return Object.keys(_localStore).length; },
    },
    document: {
      getElementById: () => ({ innerHTML: '', appendChild(){}, classList:{add(){}, remove(){}}, style:{}, offsetWidth:0, getBoundingClientRect(){return{left:0,top:0,width:0,height:0}} }),
      createElement: () => ({ style: {}, classList: {add(){}, remove(){}}, appendChild(){}, remove(){}, addEventListener(){} }),
      body: { appendChild(){} },
      head: { appendChild(){} },
      addEventListener(){},
    },
    setTimeout: (fn, ms) => ({ ref(){}, unref(){} }),
    clearTimeout: () => {},
    fetch: () => Promise.reject(new Error('fetch not available in test shim')),
    Audio: function () { return { volume: 0, play: () => Promise.resolve(), pause(){}, currentTime: 0 }; },
    Math, JSON, Date, Promise,
  };
  shim.window = shim;
  shim.global = shim;
  return shim;
}

const SCRIPTS = [
  'engine/constants.js',
  'engine/events.js',
  'engine/registry.js',
  'engine/state.js',
  'engine/profiles.js',
  'engine/audio.js',
  'engine/effects.js',
  'engine/scene.js',
  'engine/combat.js',
  'engine/ui/hud.js',
  'engine/ui/castle.js',
  'engine/ui/map.js',
  'engine/ui/character.js',
  'engine/ui/gear-chest.js',
  'engine/ui/ally-room.js',
  'engine/ui/trophy-hall.js',
  'engine/ui/levelup.js',
  'engine/ui/library.js',
  'engine/ui/choice.js',
  'engine/ui/dialogue.js',
  'engine/ui/puzzle.js',
  'engine/ui/battle.js',
  'data/types.js',
  'data/moves.js',
  'data/gear.js',
  'data/allies.js',
  'data/enemies.js',
  'data/treasures.js',
  'data/regions.js',
  'data/traits.js',
  'data/badges.js',
  'data/crown-dialogue.js',
  'data/scrolls.js',
  'data/quests/intro.js',
  'data/quests/forest.js',
  'data/quests/mountain.js',
  'data/quests/beach.js',
  'data/quests/desert.js',
  'data/quests/volcano.js',
];

function loadKJ() {
  if (_KJ) return _KJ;

  const ROOT = path.resolve(__dirname, '..', '..');
  const shim = buildShim();
  _ctxRef = vm.createContext(shim);

  for (const rel of SCRIPTS) {
    const p = path.join(ROOT, rel);
    const code = fs.readFileSync(p, 'utf8');
    try {
      vm.runInContext(code, _ctxRef, { filename: rel });
    } catch (e) {
      throw new Error(`Bootstrap failed loading ${rel}: ${e.message}`);
    }
  }
  _KJ = _ctxRef.KJ;
  return _KJ;
}

// Test helper: returns the live vm context (for direct localStorage access).
function _ctx() { return _ctxRef; }

module.exports = { loadKJ, _ctx };
