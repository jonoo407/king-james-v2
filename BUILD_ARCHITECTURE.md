# King James 2 — Build Architecture Plan

> **⚠️ Before building new content**, read [`DESIGN_LESSONS.md`](DESIGN_LESSONS.md). Every rule there is a mistake we already made and fixed — use its checklists so you don't re-introduce them.

**Target project:** `E:\app_design\king_james2\`
**Input:** `E:\app_design\king_james2\CONCEPT.md` (approved design doc)
**Output (when built):** `E:\app_design\king_james2\king-james2.html` and supporting files
**Status:** Planning the **architecture** — how to build it. Concept (the what) is frozen.

---

## 1. Architectural Goals

Derived from user's stated priorities:

1. **Easy to add new adventures/quests** — adding a quest = adding a data file + 1 registry line. No engine changes.
2. **Easy to add new features** — new scene types, new stat effects, new castle rooms, etc. should plug in via registries without touching the core.
3. **Mobile-friendly delivery** — loads fast, works offline once loaded, phone-friendly UI.
4. **Portable** — kid can play it. Minimal setup. No build step every time content changes.
5. **Simple-to-medium complexity** — don't over-engineer. This is a kids' game, not a Kubernetes platform.

---

## 2. Non-Goals (explicit)

- Not a published, bundled npm app. No TypeScript compiler, no React, no framework.
- No server-side anything. Pure client.
- No account system, no telemetry, no analytics in v1.
- No procedural/random-generated content for quests (quests are hand-authored data).

---

## 3. Delivery Model — LOCKED ✅

**Multi-file** — `king-james2.html` + `engine/*.js` + `data/*.js` + `styles/*.css`.

- Works offline once loaded; served via http-server for phone access (same as v1)
- No build step; edit-a-file → refresh browser
- New quest = one new file in `data/quests/` + one `<script src>` line in the HTML
- Engine code has zero hard-coded content IDs

---

## 4. Folder Layout (assuming Option B)

```
E:\app_design\king_james2\
├── CONCEPT.md              (frozen design doc)
├── BUILD_ARCHITECTURE.md   (this plan, after approval)
├── king-james2.html        (main entry)
├── README.md               (how to run, add quests, add features)
│
├── engine/
│   ├── constants.js        (types, slots, version numbers, tunables)
│   ├── registry.js         (plugin-style registries for data)
│   ├── events.js           (event bus)
│   ├── state.js            (state shape + save/load/migrate)
│   ├── audio.js            (Web Audio helpers)
│   ├── effects.js          (confetti, screen shake, floating text)
│   ├── combat.js           (turn-based battle engine — pure logic)
│   ├── scene.js            (scene dispatcher + renderer base)
│   ├── ui/
│   │   ├── hud.js          (top HUD: gold, crown, character button)
│   │   ├── castle.js       (throne hall + room navigation)
│   │   ├── map.js          (kingdom map)
│   │   ├── gear-chest.js   (equip screen)
│   │   ├── ally-room.js    (party + Dame Pompadour)
│   │   ├── character.js    (character sheet / inspection screen)
│   │   ├── levelup.js      (stat-point + trait picker)
│   │   ├── battle.js       (battle scene renderer)
│   │   ├── choice.js       (choice scene renderer)
│   │   ├── puzzle.js       (puzzle scene renderer)
│   │   ├── dialogue.js     (dialogue scene renderer — quips, speech bubbles)
│   │   ├── crown.js        (crown speech widget)
│   │   └── modals.js       (popup dialogs — trophies, badges, hints)
│   └── boot.js             (wires it all up on page load)
│
├── data/
│   ├── types.js            (5 elements + matchup chart)
│   ├── moves.js            (all moves; indexed by id)
│   ├── gear.js             (all gear catalog)
│   ├── allies.js           (all ally species)
│   ├── enemies.js          (all enemy species)
│   ├── treasures.js        (5 Crown Treasures)
│   ├── regions.js          (5 regions: metadata + art style)
│   ├── traits.js           (Royal Traits)
│   ├── badges.js           (badge definitions + predicates)
│   ├── crown-dialogue.js   (crown speech pools per context)
│   └── quests/
│       ├── forest.js       (v1 quest — scene list)
│       ├── mountain.js     (stub — empty arc data)
│       ├── beach.js        (stub)
│       ├── desert.js       (stub)
│       └── volcano.js      (stub)
│
└── styles/
    ├── base.css            (reset + body + global)
    ├── hud.css
    ├── castle.css
    ├── scene.css
    ├── battle.css
    ├── character.css
    └── animations.css
```

**~35 small files** (15–400 lines each) instead of one 5000-line file. Every file has one job.

---

## 5. Engine ↔ Data Separation (the core rule)

**The engine knows nothing specific about Forest, Troll, Foxy, or the Gem of Wisdom.**

- Engine code reads from **registries** populated by data modules at boot
- Engine code dispatches to renderers based on **type fields** in data
- All content is declarative data; all logic lives in the engine

This is what makes content-adding trivial: new content is new data, never new logic.

**Example:**
```js
// data/quests/forest.js registers a quest:
Registry.quests.add({
  id: 'forest',
  region: 'forest',
  treasure: 'gem_of_wisdom',
  scenes: [ ... ]
})

// data/allies.js registers species:
Registry.allies.add({
  id: 'foxy', name: 'Foxy', emoji: '🦊',
  type: 'wind', baseStats: {...}, learnset: [...],
  sceneAbility: 'stealth',
  hirePrice: 80,
  quipLines: [...], bio: '...'
})

// Engine never mentions 'foxy' by name.
```

---

## 6. Registry Pattern (the extensibility mechanism)

A `Registry` is a simple keyed collection with add/get/all/has APIs:

```js
Registry = {
  quests:    new Registry('quest'),
  allies:    new Registry('ally'),
  enemies:   new Registry('enemy'),
  moves:     new Registry('move'),
  gear:      new Registry('gear'),
  treasures: new Registry('treasure'),
  regions:   new Registry('region'),
  traits:    new Registry('trait'),
  badges:    new Registry('badge'),
  sceneTypes:      new Registry('sceneType'),      // renderer per scene type
  castleRooms:     new Registry('castleRoom'),     // plugins to castle hub
  statusEffects:   new Registry('status'),         // poisoned, burned, etc.
  crownDialogue:   new Registry('crownContext'),   // pools per context
}
```

**Adding a new scene type** (example: a "shop" scene):
```js
Registry.sceneTypes.add({
  id: 'shop',
  render: (scene, ctx) => { /* renderer */ },
  validate: (scene) => { /* schema check */ },
})
```

**Adding a new castle room** (example: a forge):
```js
Registry.castleRooms.add({
  id: 'forge',
  name: 'Forge',
  emoji: '🔨',
  unlockCondition: (state) => state.treasures.has('blade_of_bravery'),
  open: (ctx) => { /* render room */ },
})
// No changes to castle hub code — hub iterates rooms and shows unlocked ones.
```

**Adding a new status effect** (example: "stunned"):
```js
Registry.statusEffects.add({
  id: 'stunned',
  emoji: '💫', name: 'Stunned',
  onTurnStart: (combatant) => { combatant.skipTurn = true; /* unless... */ },
  duration: 1,
})
// Any enemy or move can apply { status: 'stunned' } from its data.
```

---

## 7. Event Bus (loose coupling)

Events let features hook in without the engine knowing about them:

```js
Events.emit('ally_recruited',  { ally })
Events.emit('battle_won',      { enemies, hpRemaining, roundsTaken })
Events.emit('scene_entered',   { scene })
Events.emit('gear_equipped',   { slot, gear })
Events.emit('level_up',        { combatant, newLevel })
Events.emit('puzzle_solved',   { puzzle, hintsUsed })
Events.emit('treasure_found',  { treasure })
Events.emit('party_knocked_out', { lastHitBy })
```

- Badges listen: `Events.on('battle_won', checkBadge_NoDamageBoss)`
- Crown dialogue listens: `Events.on('treasure_found', advanceCrownCoherence)`
- Achievement pop-ups listen: `Events.on('badge_unlocked', showBadgePopup)`

Adding a new badge = add a listener to the relevant event. No engine changes.

---

## 8. State Shape & Save Versioning

**`state` object** (the source of truth, serialized to localStorage):

```js
{
  version: 1,
  player: {
    name: 'James',
    level: 1,
    xp: 0,
    baseStats: { hp, atk, def, spd },
    hp: current,
    equipped: { weapon, armor, trinket, boots },     // gear IDs
    traits: [],                                      // trait IDs
    royalRank: 'peasant_kid',
  },
  inventory: {
    gear: [],            // list of owned gear IDs
    charms: 0,           // friendship charms count
    gold: 0,
    consumables: {},     // potions etc.
  },
  roster: {
    allies: {            // map of ally ID → instance data
      foxy: { level, xp, moves, hp },
    },
    party: [],           // up to 2 ally IDs chosen for next quest
    missed: [],          // met-but-missed ally IDs (for Pompadour)
  },
  progress: {
    treasures: [],       // treasure IDs owned
    questsCompleted: [], // quest IDs completed
    questsInProgress: {  // for resume mid-quest
      forest: { sceneId, flags: {...} },
    },
    trophies: [],        // boss IDs defeated (for Trophy Hall)
    badges: [],          // badge IDs earned
    castleRooms: ['throne', 'map', 'gear', 'ally'],  // unlocked room IDs
    crownCoherence: 0,   // 0..5 — drives crown dialogue pool
  },
  settings: {
    soundOn: true,
    textSpeed: 'normal',
  },
  meta: {
    firstPlayedAt: timestamp,
    lastSavedAt: timestamp,
  },
}
```

**Save versioning & migration:**

```js
// engine/state.js
const CURRENT_VERSION = 1

function migrate(data) {
  while (data.version < CURRENT_VERSION) {
    data = MIGRATIONS[data.version + 1](data)
  }
  return data
}

const MIGRATIONS = {
  // 2: (data) => { ...data, newField: defaultValue, version: 2 },
}
```

When we add features that affect the save shape, we bump `CURRENT_VERSION` and add a migration. Old saves upgrade safely.

**Auto-save triggers:** scene changes · gear equip · ally recruit · battle won · quest complete · settings changed. Debounced to avoid spamming localStorage.

---

## 9. Scene Authoring Protocol

Every quest is a list of scenes. A scene is a **pure data object** with a `type` field that tells the dispatcher which renderer to use.

**Supported scene types for v1:**

```js
// CHOICE scene
{ id: 'forest_1', type: 'choice',
  art: '🌲 🦊 🧒',
  bg: 'forest',           // region background style
  caption: 'A fox blocks the path.',
  crownLine: 'Be polite.',
  choices: [
    { label: 'Ask nicely', icon: '💬', next: 'forest_2',
      condition: null,                                // always shown
      effects: [{ type: 'flag_set', key: 'politeFoxy', value: true }] },
    { label: 'Charge through brambles', icon: '💨', next: 'forest_brambles',
      effects: [{ type: 'damage_party', amount: 3 }] },
    { label: 'Use Owlette\'s wisdom', icon: '🦉', next: 'forest_owlette',
      condition: { type: 'ally_in_party', id: 'owlette' } },
  ],
}

// BATTLE scene
{ id: 'forest_goblins', type: 'battle',
  bg: 'forest',
  enemies: ['goblin_scout', 'goblin_scout'],          // references data/enemies.js
  rewards: { gold: [8, 12], xp: 15, drops: [{ gear: 'wooden_club', chance: 0.3 }] },
  next: 'forest_2',
  onDefeat: 'party_wipe_forest',                      // scene to jump to on KO
}

// PUZZLE scene
{ id: 'forest_riddle', type: 'puzzle',
  bg: 'forest_clearing',
  puzzleType: 'word_riddle',                           // subtype for puzzle renderer
  data: {
    riddles: [
      { prompt: 'Cold. White. Falls from sky. What?',
        options: ['🔥', '❄️', '🍂'], correct: 1 },
      ...
    ],
    allowHints: true,
    hintPenalty: { badge: 'no_hint_run' },
  },
  next: 'forest_3',
  onSolveAllNoHints: [{ type: 'recruit_ally', id: 'owlette' }],
}

// DIALOGUE / CUTSCENE scene
{ id: 'forest_reward', type: 'dialogue',
  bg: 'castle_throne',
  beats: [
    { speaker: 'crown', text: 'Great work, James!' },
    { speaker: 'james', text: 'I think I get it now.' },
    { speaker: 'crown', text: 'Next: the mountain.' },
  ],
  effects: [
    { type: 'grant_treasure', id: 'gem_of_wisdom' },
    { type: 'unlock_room', id: 'library' },
    { type: 'grant_trophy', id: 'troll_statue' },
  ],
  next: 'castle',
}
```

**Rules for scene effects:** every effect is a declarative `{type, ...params}` object. The engine has a fixed set of supported effect types (damage_party, heal_party, grant_gear, grant_gold, recruit_ally, grant_treasure, set_flag, unlock_room, grant_trophy, etc.). New effect types are added once in the engine, then freely used in data.

**Rules for conditions:** same pattern — `{type, ...params}` — engine supports a fixed set (has_gear, ally_in_party, treasure_owned, flag_set, level_at_least, etc.).

---

## 10. Combat Engine (pure-logic core)

```js
// engine/combat.js — pure state machine, no DOM
function startBattle({playerTeam, enemyTeam, rewards}) {
  return {
    state: 'IN_PROGRESS',
    turnOrder: computeTurnOrder(playerTeam, enemyTeam),
    pendingAction: null,
    log: [],
  }
}

function applyAction(battle, action) {
  // action: {actorId, move, targetId}
  // Returns updated battle + events
}
```

UI reads `battle` state and renders; UI sends `action` objects back. This separation means:
- We can unit-test combat without any DOM
- We can visualize combat differently (2D later?) without rewriting logic

**Type matchup** is data (`data/types.js`). A move's effectiveness is computed by a pure function.

**Enemy AI** is **data**: each enemy has a `behavior` field like `{pattern: 'cycle', moves: [0,1,2,0,1,3]}` or `{pattern: 'reactive', rules: [...]}`. The engine has a small set of behavior patterns; new patterns can be added.

---

## 11. How to Add a New Quest (the critical workflow)

This is the most important thing the architecture enables. Steps:

1. Create `data/quests/<regionId>.js`
2. In that file, define the scenes (choice/battle/puzzle/dialogue) using the schemas in §9
3. Reference enemies/allies/gear by ID. If you need a NEW enemy or ally, add it to `data/enemies.js` or `data/allies.js` first
4. Register the quest at the bottom:
   ```js
   Registry.quests.add({
     id: 'mountain',
     region: 'mountain',
     treasure: 'blade_of_bravery',
     entryScene: 'mountain_1',
     scenes: [...],
   })
   ```
5. Update `data/regions.js` to mark this region unlocked (or add an unlock condition)
6. Add a `<script src="data/quests/mountain.js">` line to `king-james2.html`
7. Playtest; adjust numbers

**That's it.** No engine changes, no refactors. One new file, one script tag.

---

## 12. How to Add a New Feature (the other critical workflow)

Common feature types and what they touch:

**New stat** (e.g., "Luck")
- Add to stat list in `engine/constants.js`
- Add display in `engine/ui/character.js` and `engine/ui/battle.js`
- Combat uses it where relevant
- Migration for old saves

**New status effect** (e.g., "Poisoned")
- Add entry to `data/status.js` via `Registry.statusEffects.add(...)`
- Engine applies it wherever `{ status: 'poisoned' }` appears in move/ability data
- Zero engine-logic changes (status effect IS data with lifecycle hooks)

**New scene type** (e.g., "shop")
- Write renderer in `engine/ui/shop.js`
- Register: `Registry.sceneTypes.add({ id: 'shop', render, validate })`
- Update save schema if shop state persists; add migration

**New castle room** (e.g., "Forge")
- Write renderer: `engine/ui/forge.js`
- Register in `Registry.castleRooms` with unlock condition
- Hub auto-shows it when unlocked

**New effect type for scene choices** (e.g., "teleport_to_castle")
- Add one case to the effect-dispatcher in `engine/scene.js`
- Done. Now all scene data can use `{ type: 'teleport_to_castle' }`

**New trait**
- Add entry to `data/traits.js`
- If the trait's effect is novel, add the hook in the relevant engine location
- Otherwise, use existing hooks (buffs/multipliers) and no engine change

---

## 13. Build Order for v1

Roughly the order we write code in, with the idea of getting to a playable castle hub early and growing from there.

**Phase 0 — Scaffolding (0.5 day)**
- Folder layout, empty files, main HTML shell, CSS reset, boot wiring
- Dev server setup (http-server; already installed)

**Phase 1 — Engine core (1 day)**
- `constants.js`, `registry.js`, `events.js`, `state.js` (including save/load/migrate v1 schema)
- `audio.js`, `effects.js` (port from king_james v1)

**Phase 2 — Castle hub (1 day)**
- Throne Hall renderer with crown speech
- Map screen (5 slots, 1 playable)
- Gear Chest (read-only first, then equip)
- Ally Room (read-only first; Pompadour logic later)
- HUD (gold, character button, crown state)
- Character sheet
- At end of phase: can open castle, walk between rooms, check empty character sheet

**Phase 3 — Scene system (1 day)**
- Scene dispatcher with choice + dialogue renderers
- Can load and play a dialogue scene + a choice scene
- Scene-effect engine (declarative effects)

**Phase 4 — Puzzle scene (0.5 day)**
- Word-riddle puzzle renderer
- Hint/no-hint tracking

**Phase 5 — Combat engine (2 days)**
- Pure combat state machine: types, moves, stats, SPD order, damage calc
- Battle UI: party HP bars, move picker, damage numbers, quips, telegraphs
- Enemy AI patterns (cycle + reactive)
- Level-up screen (stat points + trait picker)
- KO/crown-rescue flow

**Phase 6 — Data: v1 content (1 day)**
- `moves.js`, `gear.js`, `allies.js`, `enemies.js`, `treasures.js`, `regions.js`, `traits.js`, `badges.js`, `crown-dialogue.js`
- `quests/forest.js` with the 7 scenes from CONCEPT §4

**Phase 7 — Polish + balance (1 day)**
- Run the verification suite (CONCEPT §8)
- Balance battles per P25a (new-player/smart-player/perfect-player runs)
- Mobile test on phone
- Language audit

**Phase 8 — Modularity test (0.5 day)**
- Create a stubbed `quests/mountain.js` — just 2 scenes + 1 enemy + 1 treasure
- Add the single `<script src>` line
- Verify Mountain appears on map, plays through, no core-code changes were needed
- This is the architectural smoke test

**Total estimate: ~8 days.** Longer if balance iteration takes time, shorter if scope stays tight.

---

## 14. Data Schemas (exact shapes)

Authoritative shapes for each data type. These are versioned alongside the save.

```js
// MOVE
{ id: 'iron_slash', name: 'Iron Slash', type: 'earth',
  power: 8, accuracy: 0.95,
  effect: null | { status: 'stunned', chance: 0.2 },
  target: 'enemy' | 'ally' | 'self' | 'all_enemies',
  flavor: 'Slashes with iron force.' }

// GEAR
{ id: 'iron_sword', name: 'Iron Sword', slot: 'weapon',
  emoji: '⚔️', type: 'earth',
  stats: { atk: 4 },
  move: 'iron_slash',
  tier: 2, goldValue: 60 }

// ALLY species (roster instances carry level/xp/moves)
{ id: 'foxy', name: 'Foxy', emoji: '🦊', type: 'wind',
  baseStats: { hp: 18, atk: 6, def: 4, spd: 9 },
  learnset: [
    { level: 1, move: 'quick_pounce' },
    { level: 3, move: 'wind_gust' },
    { level: 6, choice: ['tail_whip', 'swift_strike'] },
    { level: 9, choice: ['tornado', 'zephyr_guard'] },
  ],
  sceneAbility: 'stealth',
  hirePrice: 80,
  bio: 'Quick-witted forest fox...',
  quipLines: ['Watch this!', 'Too slow!', ...],
}

// ENEMY
{ id: 'goblin_scout', name: 'Goblin Scout', emoji: '👺', type: 'earth',
  level: 2,
  stats: { hp: 12, atk: 4, def: 2, spd: 5 },
  moves: ['swing', 'bite'],
  behavior: { pattern: 'cycle', sequence: [0, 1, 0] },
  rewards: { xp: 5, gold: [3, 7], drops: [] },
  quipLines: ['Get off our road!', 'We bite!', ...]
}

// TREASURE
{ id: 'gem_of_wisdom', name: 'Gem of Wisdom', emoji: '💎',
  element: 'magic',
  jamesBonus: { hp: 5, move: 'think_fast' },
  unlocksRoom: 'library',
  flavor: 'A cold, clever stone.' }

// REGION
{ id: 'forest', name: 'The Deep Forest', emoji: '🌲',
  bgStyle: 'forest',                 // CSS class for scene background
  musicTone: 'woodwind_loop',        // optional ambient
  questId: 'forest',
  locked: false,                     // starter region
  unlockCondition: null }

// TRAIT
{ id: 'thick_skin', name: 'Thick Skin', emoji: '🛡️',
  description: '+10% DEF forever',
  apply: (state) => { /* hook */ },  // one of a small set of declared ops
  conflictsWith: [] }

// BADGE
{ id: 'first_friend', name: 'First Friend', emoji: '🤝',
  description: 'Recruit your first ally',
  predicate: (state) => state.roster.allies.size >= 1,
  hidden: false,
  goldReward: 20 }

// CROWN DIALOGUE POOL
{ context: 'death_rescue',           // which situation triggers this pool
  coherenceRequired: 0,              // 0..5 — minimum treasures owned
  lines: ['Oh relax, I saved you.', ...] }
```

---

## 15. Cross-Cutting Concerns

**Performance.** Every screen renders via `innerHTML` replacement for simplicity. For battle UI, we use targeted DOM updates (HP bars, damage pops) to avoid jank. Target: 60fps on a mid-range phone.

**A11y / readability.** Text at least 16px, high contrast. Color never the sole indicator of state (we always pair color with an icon or word).

**Error recovery.** If a save is corrupted, offer to start fresh with a warning, don't crash. If a data module is missing, the scene fallbacks to a visible "Scene missing: id=X" card so we notice in QA.

**Audio.** All sounds procedurally generated via Web Audio (no large audio files; identical to king_james v1 approach). Sound registry so new sounds are just `Audio.register('sword_clank', () => { ... })`.

**Styles.** Each major UI has its own CSS file; all concatenated (via `<link>` tags) in the main HTML. No CSS-in-JS; no preprocessors in v1.

**Script load order.** Strict order in `king-james2.html`:
1. `engine/constants.js` → `engine/events.js` → `engine/registry.js` → `engine/state.js`
2. `engine/audio.js`, `engine/effects.js`
3. `engine/combat.js`, `engine/scene.js`
4. `engine/ui/*.js`
5. `data/*.js` (catalog files first, quests last)
6. `engine/boot.js` (last — everything else is already registered)

`boot.js` reads save (or starts new), wires up UI, mounts the initial screen.

---

## 16. README.md Content (when built)

A `README.md` at project root will cover:
- How to run locally (http-server on port 8080)
- How to access from phone (local IP + URL)
- **How to add a new quest** (mirroring §11 above, 6 steps)
- **How to add a new feature** (mirroring §12)
- Data schema reference (§14)
- How saves work + how to reset (localStorage key)
- Known quirks + debugging tips

This README is the "operator's manual" — writing it well is part of the architecture deliverable.

---

## 17. Verification of the Architecture (before calling v1 done)

Beyond the gameplay verification in CONCEPT §8, we also confirm the architecture holds up:

1. **New-quest smoke test** — a dev can create a one-scene "Mountain" arc in under 15 minutes following the README
2. **New-feature smoke test** — a dev can add a new status effect ("Burned: 1 DMG/turn for 3 turns") by editing `data/status.js` only, no engine edits
3. **Save migration test** — artificially bump save version and run a mock migration; confirm old saves upgrade cleanly
4. **Cold-boot load time** — main HTML + all modules loads under 1.5 sec on phone (mid-range Android)
5. **Dependency direction audit** — grep confirms NO `engine/*.js` file references a specific content ID (`foxy`, `troll`, `gem_of_wisdom`, etc.) — the engine is pure

---

## 18. Deployment & Dev Workflow

Since the game is 100% static (HTML/CSS/JS, no backend), deployment can be embarrassingly simple.

### Recommended: **GitHub Pages** (the simplest possible)
One service, no tooling, free, zero-config:

**One-time setup (~5 minutes)**
1. Create a public GitHub repo (e.g., `king-james2`) under your account
2. Push the project folder contents to `main`
3. In repo Settings → Pages: set Source = `main` branch, root folder
4. Wait ~30 seconds; site is live at `https://<your-username>.github.io/king-james2/king-james2.html`

**Per-change workflow (~30 seconds)**
```
# edit locally, test with http-server
git add . && git commit -m "add Mountain arc"
git push
```
GitHub rebuilds the site automatically; kid's phone loads new version on next refresh.

### Why this is perfect for this project
- No build step (multi-file approach works as-is)
- localStorage saves live on the kid's phone; unaffected by deploys
- Free, indefinitely
- You can iterate content (add a quest, tweak balance) and ship in under a minute

### Cloudflare Pages (optional upgrade, also simple)
If you later want a custom domain (e.g., `kingjames.yourdomain.com`), or want global CDN edge caching, Cloudflare Pages is the natural next step:
- Connect the same GitHub repo to Cloudflare Pages
- Auto-deploys on every push
- Free tier is generous
- Just as simple to set up (~5 min in Cloudflare dashboard)

**Verdict: start with GitHub Pages. Upgrade to Cloudflare Pages later only if you want a custom domain.** No rush to decide — either works.

### Local dev setup (unchanged)
```
cd E:\app_design\king_james2
npx http-server -p 8080 --cors
# phone: http://<your-pc-lan-ip>:8080/king-james2.html
```
This is how you test before pushing. Identical to the v1 workflow.

### Saves and updates
`localStorage` saves live in the kid's browser — they survive deploys, they don't migrate between devices automatically. Save-schema migrations (per §8) kick in when the kid reopens the site after an update that bumps the save version.

### Minimal files needed for GitHub Pages
GitHub Pages serves files as-is. No `index.html` required; visiting `/king-james2.html` directly works. If you want the shorter URL `<user>.github.io/king-james2/`, rename the main file to `index.html` — that's it.

**Recommendation:** rename `king-james2.html` → `index.html` in the repo so the deployed URL is clean.

---

## 19. After Approval

On approval, this plan becomes `E:\app_design\king_james2\BUILD_ARCHITECTURE.md` (moved to the project folder). The actual implementation is a separate session:

1. Scaffold the folders and empty files per §4 (main file named `index.html` for Pages-friendliness)
2. Follow the phased build order in §13
3. Set up GitHub repo + Pages (§18) early so every phase can be phone-tested on the live URL
4. Run the architectural verification in §17 alongside the gameplay verification in CONCEPT §8
5. Write `README.md` (§16) as the "operator's manual," including the deploy steps from §18
