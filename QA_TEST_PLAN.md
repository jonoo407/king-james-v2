# King James 2 — QA & Debug Plan

**Date:** April 2026  
**Status:** Voice system complete (283 lines), 3 arcs live (Forest / Mountain / Beach)  
**How to use:** Work top to bottom. Each phase builds on the last. Log failures inline.

---

## Phase 0 — Automated Regression (5 min)

Run the existing test suite first. It catches ~75 things automatically so you start with a clean baseline.

```
cd E:\app_design\king_james2
node tests\qc_suite.js
```

**Expected output:** `PASS: 75   FAIL: 1   WARN: 2`

The expected **FAIL** is the fire-enemy gap (Rule 1.2: no fire-type enemy in v1 arcs — water moves homeless).  
The expected **WARNs** are: missed-ally list not cleared after Pompadour hire, and Blade of Bravery type vs beach arc check.

If you see **any other FAILs**, stop and fix before proceeding. A fresh fail here means something broke in engine or data.

---

## Phase 1 — Desktop Browser Smoke Test (15 min)

Open `index.html` directly in Chrome (no server needed; all paths are relative).

### 1.1 Title Screen
- [ ] King James poster fills the full width
- [ ] "KING JAMES" text at the bottom of the poster is **fully visible** — not cropped
- [ ] **▶️ NEW GAME** button is below the poster in the dark strip, not overlapping it
- [ ] Clicking NEW GAME transitions to the intro scene (no JS error in console)

### 1.2 Open DevTools → Console
- [ ] Zero `[error]` or `[warn]` lines on load
- [ ] `KJ.Registry`, `KJ.State`, `KJ.Combat`, `KJ.Audio` all exist (type each in console)

### 1.3 Intro → Castle → Map
- [ ] Tap through the intro cutscene to the end (`intro_mud`)
- [ ] Arrive at Castle screen — all rooms listed, gold/level shown in HUD
- [ ] Tap "🗺️ World Map" — see region cards for Forest / Mountain / Beach
- [ ] Forest has no lock; Mountain / Beach should be locked if no treasures

### 1.4 Forest Arc (critical path)
- [ ] Enter Forest → first scene loads without error
- [ ] Tap through all dialogue beats — text updates correctly, ▶️ button labels "Done" on last beat
- [ ] Reach a battle: enemy cards render with correct emoji, name, type badge
- [ ] Select a move: damage preview shows a number (e.g. "⚔️ 8 dmg")
- [ ] Super-effective move shows **✨ SUPER!** indicator
- [ ] Battle ends → Victory screen → XP/gold gained shown
- [ ] Complete Forest arc → Gem of Wisdom awarded → Castle unlocks Library room

### 1.5 Mountain Arc
- [ ] Mountain unlocks on Map after completing Forest
- [ ] Yeti / Gus / Owlette dialogue scenes render correctly
- [ ] Mountain boss (Glimmer Wraith trio) — boss intro scene plays before fight
- [ ] Completing Mountain → Blade of Bravery awarded

### 1.6 Beach Arc
- [ ] Beach unlocks after Mountain
- [ ] Finn / Drifter / Sirena dialogue scenes render
- [ ] Beach boss fight functions

---

## Phase 2 — Save / Load / Continue (10 min)

### 2.1 Persistence check
1. Start a new game and complete the Forest arc
2. **Close the browser tab entirely**
3. Re-open `index.html`
4. Should see the **Continue / New Game** screen, not the plain New Game screen
5. Continue button text should show your level and treasure count (`Lv 2 · 1/5 treasures`)
6. Tap Continue → should land directly at the Castle screen with correct state

### 2.2 New Game erase
1. On the Continue screen, tap **🆕 NEW GAME (erase save)**
2. Confirm the dialog prompt
3. Should start fresh at `intro_mud` (level 1, no treasures, no allies)

### 2.3 Auto-save
1. In DevTools → Application → Local Storage, confirm `kj2_save` key exists after any action
2. Play a battle → lose → return to Castle → refresh page → Continue → XP/gold should still be from before the loss (Rule 8.2: KO keeps progress)

---

## Phase 3 — Audio & Voice (20 min)

> **Note:** Audio on the web requires a user gesture before playing. The HUD mute button counts as a gesture. On the very first new game, click a button once before expecting voice.

### 3.1 Voice playback in dialogue
1. Start a new game and let the intro dialogue play
2. Each time the ▶️ button is tapped to advance a beat, you should hear the character speak within 0.5 seconds
3. Expected voices per intro scene:
   - Crown (👑): warm British male
   - Narrator (📜): calm American woman
   - James (🧒): goofy energetic boy

### 3.2 Mute button
1. Confirm the 🔊 icon appears in the top-right of the HUD
2. Tap it → icon changes to 🔇, currently-playing clip stops immediately
3. Tap ▶️ to advance dialogue — no audio plays
4. Tap 🔇 → back to 🔊, next beat plays audio again

### 3.3 Voice file coverage — check a sample
Open DevTools → Network tab, filter by `audio/voices/`  
Play through the forest intro scene. You should see MP3 requests like:
- `audio/voices/crown/forest_intro_0.mp3`
- `audio/voices/james/forest_intro_1.mp3`  
All should return **200**, not 404. A 404 means the file wasn't generated or naming is off.

### 3.4 Silent fail on missing file
In console, temporarily rename a voice file (or force a 404), then tap through dialogue  
→ The scene should **continue silently** — no crash, no stuck UI. The `a.play().catch(() => {})` in audio.js handles this.

### 3.5 SFX (non-voice)
- Tap any button → should hear a brief `click` sound (synthesized, not MP3)
- Winning a battle → `fanfare` sound
- If click sounds are missing: `KJ.Audio.unlock()` may not have fired — check that `Audio.play('click')` is called in boot.js on the first button tap

---

## Phase 4 — Mobile Testing (iPhone Chrome) (30 min)

> This is where the trickiest bugs live. Audio autoplay policy and the iOS viewport are the main risks.

### 4.1 Deploy to GitHub Pages first
```
git add .
git commit -m "QA test build"
git push origin HEAD:main
```
Then test at: `https://jonoo407.github.io/king-james-v2/`

### 4.2 Viewport — no scroll needed
1. On iPhone in Chrome, load the title screen
2. The NEW GAME button should be **fully visible** without any scrolling
3. Check every major screen: Castle, Map, dialogue, battle
4. No screen should require scrolling to reach the primary action button
5. If scrolling required: check `min-height: 100dvh` is in place in base.css and `viewport-fit=cover` is in index.html meta tag

### 4.3 Safe area (iPhone home indicator)
1. On a notched/home-bar iPhone, confirm buttons in the footer area are **above** the home indicator bar — not hidden behind it
2. The `padding-bottom: env(safe-area-inset-bottom)` on `#app` handles this

### 4.4 Audio autoplay on iOS
iOS requires a user gesture before any audio plays. Test this flow:
1. Fresh load (no prior interaction)
2. Tap NEW GAME
3. This tap should unlock audio — the next dialogue beat's voice should play
4. If voice is silent: check that `KJ.Audio.unlock()` is called inside the btn-new onclick handler, OR call `AudioContext.resume()` on that first tap

> **Known risk:** Some iOS Chrome versions block audio even on the second gesture if the AudioContext was never resumed. If voice is silent on iOS but works on desktop, add `if (KJ.Audio.unlock) KJ.Audio.unlock()` to the NEW GAME button handler in boot.js.

### 4.5 Touch target sizes
- All interactive buttons should be at least 44×44px (Apple HIG minimum)
- Room cards, choice buttons, region cards — tap each and confirm they respond on first tap
- No double-tap required to activate anything

### 4.6 Enemy/player card rendering
1. Enter a battle on mobile
2. Both player and enemy cards should fit without horizontal scroll
3. Move buttons should be fully visible (check that `.kj-choice-btn` min-height 48px is respected on mobile)

---

## Phase 5 — Edge Cases & Known Bug Risks (30 min)

These are specific scenarios identified from code analysis that are most likely to produce silent failures.

### 5.1 Enemy move cursor reset between battles ⚠️
**Risk:** If `_moveCursor` on enemy combatants is not reset between battles, enemies will start mid-pattern in the second fight.

**Test:**
1. Win a battle, then immediately enter another battle with the same enemy type
2. The first move the enemy uses in battle 2 should be their *first* listed move (index 0), not picking up from where battle 1 left off
3. If it's wrong: the enemy combatant objects need `_moveCursor: 0` set when `makeEnemy()` builds them in the battle UI

### 5.2 Empty target list — silent drop ⚠️
**Risk:** If all enemies are defeated before a player's queued action resolves, `applyAction` may receive a `targetId` with 0 HP.

**Test:**
1. In a 2-enemy battle, have James and an ally both target the same enemy
2. James kills the enemy on his turn — then the ally's action fires at a 0-HP target
3. Nothing should crash; the action should either resolve as "already dead" (no damage) or the engine should retarget automatically
4. Confirm the battle resolves correctly (VICTORY, not stuck state)

### 5.3 Pompadour — missed ally list not cleared ⚠️
**Risk:** After hiring a missed ally through Dame Pompadour, the ally stays on the `missed` list. The UI will keep offering to hire them again.

**Test:**
1. Go through Forest, encounter Foxy but choose the path that doesn't recruit them
2. Check `KJ.State.get().roster.missed` in console — should contain `'foxy'`
3. Visit Pompadour's room → Foxy should appear for hire
4. Hire Foxy → go back to Pompadour
5. If Foxy still appears for hire, it's the known bug — minor UX, not a crash
6. **Fix if desired:** In `scene.js`, find `recruit_ally` effect handler and add `state.roster.missed = state.roster.missed.filter(id => id !== ef.id)`

### 5.4 Battle: Retreat / Escape paths
1. In a non-boss battle, if there's a "retreat" or "escape" choice available (depends on quest data)
2. Verify using it doesn't leave the battle in a broken state or fail to navigate away

### 5.5 Gear chest — equip/unequip cycle
1. Enter Gear Chest in Castle
2. Equip a new weapon — confirm HUD stats update
3. Equip a different weapon — confirm old move is removed, new move added
4. Unequip to starter — verify starter move (swing) is back

### 5.6 Level-up flow
1. Win enough battles to trigger a level-up (XP threshold varies — check `data/types.js` for `XP_THRESHOLDS`)
2. Level-up modal should appear with stat point allocation and trait pick
3. Confirm pendingStatPoints is consumed (goes to 0) after spending
4. Confirm trait appears in Character screen

### 5.7 Library scroll reading
1. Unlock Library by completing Forest (Gem of Wisdom grants it)
2. Enter Library room → should list available scrolls
3. Tap a scroll → full text should render without overflow

### 5.8 Trophy Hall
1. Win the Forest arc → check Trophy Hall for Forest completion trophy
2. Complete Mountain → Mountain trophy added
3. Trophies should persist across save/reload

### 5.9 Ally Room — party management
1. Recruit 3 allies (max party = 2 allies + James)
2. Ally Room should show who's in party and who's in reserve
3. Swap ally in/out — confirm party updates correctly
4. Enter a battle — confirm both party members appear as combatants

---

## Phase 6 — Narrative & Dialogue QA (30 min)

These require playing through the story attentively.

### 6.1 Mornox escalation arc
Mornox appears across all three arcs and should feel progressively more threatening:
- Forest: brief menacing cameo (🧙‍♂️ Dante voice — controlled, evil)
- Mountain: more direct threat
- Beach: climax setup

Verify:
- [ ] Mornox always rendered as `🧙‍♂️ Mornox` speaker label
- [ ] His tone escalates — read the actual lines in each arc
- [ ] Voice (Dante) is clearly sinister / different from friendly characters

### 6.2 Crown (mentor) tone
The Crown is snarky but warm. Check:
- [ ] Crown speaks in all arcs (should be the most lines: 97 total)
- [ ] Voice (George) sounds warm British, not flat or robotic
- [ ] Crown's commentary matches the situation (battle encouragement, puzzle hints)

### 6.3 Choice consequences feel real
At each major choice point:
- [ ] Choosing the "harder/bolder" path should be noticeably harder in the next battle
- [ ] Choosing to help an NPC should pay off with an ally or gear reward
- [ ] "Wrong" choice shouldn't soft-lock — should have a path to continue

### 6.4 No dangling "Next" button
At the end of every dialogue scene, the final beat should say **▶️ Done** (not **▶️ Next**). This is set in `dialogue.js` when `idx >= beats.length`. Verify on at least 5 different scenes.

### 6.5 Speaker labels all correct
In every scene, confirm the speaker label (left side) matches who's actually talking. Look for:
- Any scene showing `undefined` or blank speaker label (means `speakerDisplay()` got an unknown key)
- Any scene where the emoji doesn't match the character (mismatched quest data)

---

## Phase 7 — Performance & Polish (10 min)

### 7.1 Voice loading time
- First voice clip may take 1–2 seconds to start (network fetch)
- Subsequent clips on same character should be faster (browser cache)
- On mobile/slower connection: is there noticeable lag between tapping Next and hearing audio?
- If lag is a problem: consider preloading the first 2–3 clips for a scene when the scene loads

### 7.2 Animation smoothness
- Crown wobble animation (`kj-wobble`) on title screen: smooth, not janky
- Battle entrance animations on enemy cards: no layout shift
- Transitions between screens: confirm no white flash or FOUC (flash of unstyled content)

### 7.3 Long text overflow
Some dialogue lines are long. Check:
- No line causes horizontal scroll in the dialogue box
- Crown bubble (`kj-crown-bubble`) respects `max-width: 360px` and wraps properly
- Battle log messages don't overflow their container

---

## Known Issues Log

| # | Severity | Location | Description | Status |
|---|----------|----------|-------------|--------|
| 1 | Low | `engine/scene.js` | After `recruit_ally`, ally stays on `missed` list — Pompadour re-offers them | Known, unfixed |
| 2 | Low | Rule 1.2 | No fire-type enemies in v1 arcs — water moves (from any water gear) are homeless | Accepted for v1 |
| 3 | Medium | `engine/ui/battle.js` | Enemy `_moveCursor` may not reset to 0 between consecutive battles | Needs verification |
| 4 | Medium | iOS Chrome | Voice autoplay may not trigger until second gesture on some iOS versions | Needs device test |
| 5 | Low | `engine/ui/battle.js` | If both party members target same enemy and it dies on first actor's turn, second actor's action targets 0-HP enemy | Needs verification |
| 6 | Low | Community voices | Hoarder Troll / Briar Wolf / Goblin Scout / Sea Serpent / Tide Crab / Forest Sprite used community voices — may have quality issues | Not yet auditioned on device |

---

## Debug Cheat Sheet

```javascript
// Console shortcuts for manual testing:

// Check current game state
KJ.State.get()

// Teleport to any scene
KJ.Scene.goto('castle')        // castle home screen
KJ.Scene.goto('forest_intro')  // start of forest arc
KJ.Scene.goto('mountain_boss_intro')

// Grant items for testing
KJ.Scene.applyEffects([{ type: 'grant_treasure', id: 'gem_of_wisdom' }])
KJ.Scene.applyEffects([{ type: 'grant_gold', amount: 500 }])
KJ.Scene.applyEffects([{ type: 'recruit_ally', id: 'foxy' }])
KJ.Scene.applyEffects([{ type: 'recruit_ally', id: 'owlette' }])

// Force level up
KJ.State.get().player.xp += 999; KJ.Events.emit('xp_gained', {})

// Check what audio file would play for a scene/beat
// audio/voices/{speaker}/{sceneId}_{beatIndex}.mp3
// e.g. audio/voices/crown/forest_intro_0.mp3

// Wipe save and restart
KJ.State.reset(); location.reload()

// List all scene IDs in a quest
KJ.Registry.quests.get('forest').scenes.map(s => s.id)

// Run balance sim manually (from qc_suite patterns)
// see tests/qc_suite.js B section for simBattle() / winRate() helpers
```

---

## Phase Order Summary

| Phase | What | Time | Device |
|-------|------|------|--------|
| 0 | `node tests/qc_suite.js` | 5 min | PC (terminal) |
| 1 | Desktop browser smoke test | 15 min | PC (Chrome) |
| 2 | Save / load / continue | 10 min | PC (Chrome) |
| 3 | Audio & voice | 20 min | PC (Chrome) |
| 4 | Mobile viewport + audio | 30 min | iPhone (Chrome) |
| 5 | Edge cases (5.1–5.9) | 30 min | PC + Mobile |
| 6 | Narrative walkthrough | 30 min | Mobile |
| 7 | Performance & polish | 10 min | Mobile |
| **Total** | | **~2.5 hrs** | |

---

*Generated April 2026. Update the Known Issues log as bugs are fixed.*
