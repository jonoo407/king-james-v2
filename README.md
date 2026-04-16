# King James 2

A kids' RPG. Collect magical Crown Treasures, befriend creatures, level up, save the kingdom.

- **Design concept:** see [`CONCEPT.md`](CONCEPT.md)
- **📖 Plot bible (main villain + treasure weave across all 5 arcs):** see [`PLOT_BIBLE.md`](PLOT_BIBLE.md)
- **Build architecture:** see [`BUILD_ARCHITECTURE.md`](BUILD_ARCHITECTURE.md)
- **⚠️ Design lessons (READ BEFORE AUTHORING NEW CONTENT):** see [`DESIGN_LESSONS.md`](DESIGN_LESSONS.md) — captures every mistake we've made and the rules that prevent repeating them
- **Arc specs:** see [`arcs/`](arcs/) folder — one file per adventure:
  - [Mountain](arcs/mountain.md) (shipped) · [Beach](arcs/beach.md) · [Desert](arcs/desert.md) · [Volcano](arcs/volcano.md) *(finale)*
- **Gear ladder:** see [`arcs/gear-progression.md`](arcs/gear-progression.md)
- **Target audience:** smart 7-year-old (reads Dog Man / Captain Underpants level)

---

## Run it locally

From the project folder:

```bash
npx http-server -p 8080 --cors
```

Then open `http://localhost:8080/` in a browser.

### Play on your phone
Get your PC's LAN IP (e.g., `192.168.1.42`) and open on the phone:
```
http://192.168.1.42:8080/
```
Both devices must be on the same Wi-Fi.

---

## Deploy (GitHub Pages)

One-time:
1. Create a public repo (e.g., `king-james2`) on GitHub
2. Push these files to `main`
3. Repo **Settings → Pages** → Source: `main` branch, root
4. Wait ~30s. Live at `https://<you>.github.io/king-james2/`

Per change:
```bash
git add . && git commit -m "message" && git push
```
Pages rebuilds automatically. Kid reloads page on phone to get the new version.

---

## Folder structure

```
engine/                   Stable engine — no content IDs hardcoded here
  constants.js              types/slots/stats constants, xp curve
  events.js                 pub/sub bus
  registry.js               plugin registries for catalogs
  state.js                  save shape + load/save/migrate
  audio.js                  Web Audio procedural sounds
  effects.js                confetti, shake, toast, damage numbers
  scene.js                  scene dispatcher + declarative effect engine
  combat.js                 pure turn-based combat state machine
  boot.js                   wire everything up; first render
  ui/
    hud.js                  top HUD (gold, crown, character button)
    castle.js               throne hall + room navigation
    map.js                  kingdom map (5 regions)
    character.js            character sheet (stats/gear/moves/traits/allies/badges)
    gear-chest.js           equip screen
    ally-room.js            party + Dame Pompadour recruiter
    trophy-hall.js          beaten-boss statues
    choice.js               choice-scene renderer
    dialogue.js             dialogue/cutscene renderer
    puzzle.js               puzzle-scene renderer (word_riddle)
    battle.js               battle-scene renderer

data/                     Content modules (data, not logic)
  types.js                  5 elements + matchup chart
  moves.js                  all moves
  gear.js                   gear catalog (weapons, armor, trinkets, boots)
  allies.js                 ally species
  enemies.js                enemy species
  treasures.js              5 Crown Treasures
  regions.js                5 kingdom regions
  traits.js                 Royal Traits (level-up picks)
  badges.js                 achievements
  crown-dialogue.js         crown speech pools by context
  quests/
    forest.js                 v1 playable quest
    mountain.js, beach.js,
    desert.js, volcano.js     empty stubs (one-line placeholders)

styles/                   CSS per-subsystem
  base.css, animations.css, hud.css, castle.css, scene.css,
  battle.css, character.css

index.html                main entry, loads everything in the right order
```

---

## How to add a new quest

1. Create `data/quests/<yourRegion>.js`
2. Author scenes (choice / battle / puzzle / dialogue) using the schemas in `BUILD_ARCHITECTURE.md` §9 and §14
3. Reference enemies/allies/gear by `id`. If you need new ones, add them to the catalog files first.
4. At the bottom of the quest file:
   ```js
   KJ.Registry.quests.add({
     id: 'my_region',
     region: 'my_region',
     treasure: 'some_treasure_id',
     entryScene: 'my_region_intro',
     scenes: [...],
   });
   ```
5. Update `data/regions.js` — add a new region entry (set `locked: true` and an `unlockCondition` if appropriate)
6. Add `<script src="data/quests/my_region.js"></script>` to `index.html` in the quests section
7. Reload. Your region appears on the map.

**That's it.** No engine changes needed.

---

## How to add a new feature

| Kind of feature | What to touch |
|---|---|
| New status effect | `KJ.Registry.statusEffects.add({id, onTurnStart, duration, ...})` |
| New scene type | Write renderer; register with `KJ.Registry.sceneTypes.add({id, render})` |
| New castle room | `KJ.Registry.castleRooms.add({id, open, unlockCondition})` |
| New trait | Add entry to `data/traits.js` |
| New badge | Add entry to `data/badges.js` with a predicate |
| New effect type for scene choices | Add a case to `EFFECTS` in `engine/scene.js` |
| New sound | `KJ.Audio.register('id', ({tone,slide,notes}) => { ... })` |

See `BUILD_ARCHITECTURE.md` §12 for more detail.

---

## Data schemas (quick reference)

See `BUILD_ARCHITECTURE.md` §14 for full shapes. Most-used:

```js
// Scene: choice
{ id, type: 'choice', art, bg, caption, crownLine,
  choices: [{ label, icon, next, condition?, effects? }] }

// Scene: battle
{ id, type: 'battle', bg, enemies: [enemyId],
  rewards: { gold: [min,max], xp, drops }, next, onDefeat? }

// Scene: puzzle (word_riddle subtype)
{ id, type: 'puzzle', bg, puzzleType: 'word_riddle',
  data: { riddles: [{prompt, options, correct}], allowHints },
  next, onSolveAllNoHints: [effects] }

// Scene: dialogue
{ id, type: 'dialogue', bg, beats: [{speaker, text}], effects, next }

// Effects (applied when a scene/choice transitions):
// grant_gear, grant_gold, grant_charms, recruit_ally, mark_met_ally,
// grant_treasure, unlock_room, grant_trophy, set_flag, complete_quest,
// damage_party, heal_party
```

---

## Save & reset

- State auto-saves to `localStorage` under key `king_james_2_save`
- Single save slot per browser
- "New Game" button in the castle (or on title screen) wipes and restarts
- If the save fails to load (corrupted / version mismatch with no migration), the game starts fresh

To manually wipe in console:
```js
localStorage.removeItem('king_james_2_save')
location.reload()
```

---

## Debugging tips

- Console: `KJ.State.get()` — current state
- Console: `KJ.Events._dump()` — event listener counts
- Missing scene → renderer shows a visible "Missing scene" card (check the id in the log)
- Registry empty? Confirm the `<script src>` for that data file loaded (DevTools → Network tab)
