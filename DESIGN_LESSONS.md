# Design Lessons — King James 2

**Read this before authoring a new arc, enemy, or mechanic.**

Every rule below came from a mistake we made and fixed during iteration. The pattern is: we built something that seemed fine on paper, a real play test (or kid-test) revealed the flaw, and we fixed it. This doc captures all of those lessons so future arcs don't repeat them.

Each rule has a **one-line rule**, the **problem** it was born from, and a **checklist** for validating future content against it.

---

## Category 1 — Gameplay variety

### Rule 1.1 · Every arc ships at least 3 enemy types
**Problem:** Forest was 100% earth enemies (kid mashed 🔥 Spark). Mountain was 100% water (kid mashed ✨ Think Fast). One-button arcs.

**Rule:** every arc's battles must collectively cover **at least 3 elemental types**.

**Checklist for a new arc:**
- [ ] List every battle in the arc. For each, list enemy types.
- [ ] Confirm **at least 3 of the 5 types** appear across the arc.
- [ ] At least one battle has **mixed-type enemies** (so kid can't single-button it).
- [ ] At least one non-boss encounter teaches a different type than the arc's "main" enemies.

---

### Rule 1.2 · Every move has a best-move scenario
**Problem:** Swing (earth, pwr 3) was never the best move anywhere — no Wind-type enemies existed in the game.

**Rule:** for every move in the kid's realistic loadout, **at least one enemy in the game is weak to that move type** so it becomes the best choice in that fight.

**Checklist when adding gear, moves, or enemies:**
- [ ] For every move in starter + current-arc gear, list enemy types weak to it.
- [ ] If a move has **no vulnerable enemy** in the current game, add one (in this arc or flag for next arc).
- [ ] Never ship a kid-accessible move that has no "home."

---

### Rule 1.3 · Multi-enemy battles need target selection
**Problem:** Auto-targeting first alive enemy meant mixed-type battles didn't reward strategic thinking.

**Rule:** when a battle has ≥ 2 alive enemies, the kid **picks the target** via the picker UI. One enemy = auto-target (no friction).

**Checklist when adding a battle:**
- [ ] If multi-enemy, consider mixing types to create targeting decisions.
- [ ] Damage preview should show per-target (engine handles this already via Combat.previewDamage).

---

## Category 2 — Choice design

### Rule 2.1 · Choices trade currencies, not morality
**Problem:** "Kind vs Mean" made kindness obviously right. Not a real choice.

**Rule:** every meaningful choice should trade **different resources** (HP / gold / time-cost / item-cost / long-term-payoff). Never make one option strictly better.

**Checklist when authoring a choice scene:**
- [ ] List each option's cost and reward.
- [ ] No option should be strictly dominated by another.
- [ ] Each option should be "right" under at least one player resource state.

---

### Rule 2.2 · Dominance kills tension
**Problem:** "Share snack" was free and recruited Foxy. "Cut thorns" cost 3 HP and also recruited Foxy (plus a minor bonus). Snack dominated.

**Rule:** if two options achieve the same goal, they must **cost differently enough** that neither is always preferred. Ideally give each one a unique side-benefit.

**Checklist:**
- [ ] For each "helping" path in a choice, list: HP cost, gold cost, side-flag gained, ally status.
- [ ] Ensure **at least one option** each player-state would prefer (low-HP kid, low-gold kid, ally-already-recruited kid, etc.).

---

### Rule 2.3 · Boss fights have 2–3 prep paths
**Problem:** Kid with bad loadout entering a boss had no recourse.

**Rule:** every boss fight must be **preceded by a prep scene** offering 2–3 ways to gain an edge (heal / scroll / ally-gated sneak / bribe).

**Checklist for a new boss:**
- [ ] Pre-boss choice scene exists.
- [ ] At least 3 options with different resource costs.
- [ ] At least one option is gated by an ally or flag (rewards earlier investment).

---

## Category 3 — System completeness

### Rule 3.1 · Wire systems end-to-end before moving on
**Problem:** We specified `rewards.drops` in battle data — but `onVictory` silently ignored it for weeks. Gear drops were "implemented" and broken.

**Rule:** when adding any new data field, **immediately write the engine code that reads and applies it**, and write a sim test that exercises it.

**Checklist when adding a data field:**
- [ ] Is there engine code that reads this field? Name the file & function.
- [ ] Write or update a sim script to confirm it takes effect.
- [ ] Don't ship until sim passes.

---

### Rule 3.2 · Treasures must grant their bonuses
**Problem:** `jamesBonus: { hp: 5, addMove: 'think_fast' }` was ignored by `grant_treasure`. Gem of Wisdom gave nothing for 3 sessions.

**Rule:** every data-level bonus declaration must have a matching engine handler. When you add a new bonus type, update the dispatcher.

**Checklist:**
- [ ] `grant_treasure` handles every field on `treasure.jamesBonus`.
- [ ] Treasure moves appear in James's battle move list (via `KJ.Scene.treasureMoves()`).
- [ ] Sim: apply `grant_treasure`, verify both stats and moves update.

---

### Rule 3.3 · Level-ups must be spendable
**Problem:** Level-up granted pending stat points and trait picks with no UI to spend them.

**Rule:** when engine grants a "pending" resource, **build the UI that consumes it** in the same session. Pending values without UI = silent dead ends.

**Checklist:**
- [ ] If pending counter > 0, modal auto-shows at earliest non-battle opportunity.
- [ ] Backstop: castle checks for pending on every render.

---

## Category 4 — Progression

### Rule 4.1 · Starter kit has super-effective from turn 1
**Problem:** Original starter had no fire move. Kid in Forest (earth enemies) could never land a super-effective hit until post-boss.

**Rule:** the 4-slot starter loadout must include **at least one move super-effective against the first-arc enemy type**.

**Checklist when arc 1 enemies change:**
- [ ] Starter gear has a move of the type that beats arc 1 enemies.
- [ ] Verify in sim: starter James one-shots / near-one-shots a basic arc-1 enemy with that move.

---

### Rule 4.2 · Each arc ships 4–5 new gear pieces
**Problem:** Gear ran out mid-game. No progression felt.

**Rule:** every arc's loot pool must contain **at least one new piece per gear slot** (weapon/armor/trinket/boots), visibly stronger than prior tier.

**Checklist when designing an arc:**
- [ ] 4–5 new gear pieces defined in data/gear.js.
- [ ] Stats and move power climb visibly from previous tier.
- [ ] Named flavorfully (no "Iron Sword +1" — use "Frost Fang Sword" / "Tidecaller Trident").
- [ ] Drop sources distributed across: trash (low chance), mid-boss (moderate), boss (guaranteed), side-path (unique).

---

### Rule 4.3 · Arc treasure arms kid for the NEXT arc
**Problem:** Earlier gear didn't thematically prep the next region.

**Rule:** an arc's Crown Treasure (or marquee drop) should grant a move **super-effective against the next arc's primary enemy type**.

**Checklist for arc planning:**
- [ ] Look at next arc's dominant enemy type. Is there a treasure/drop in this arc that counters it?
- [ ] Example: Forest → Gem of Wisdom (magic) → Mountain (water). ✓

---

## Category 5 — Teaching the kid

### Rule 5.1 · Teach through 4+ touchpoints, not a manual
**Problem:** The element system existed mechanically but was never explained.

**Rule:** any non-obvious system must be taught through **at least 4 channels**:
1. First-time crown tutorial quips (in-battle / in-scene)
2. Visual indicators during use (colored buttons, ⚡ super, 🛡️ weak)
3. A dedicated guide screen (Elements Guide in Library)
4. Contextual hints at relevant decision points (pre-quest map toast)

**Checklist when adding a new system:**
- [ ] Tutorial dialogue (crown-dialogue.js) with `tutorial_X_done` flag.
- [ ] Button/card visual encoding.
- [ ] Guide/help screen accessible from castle.
- [ ] Inline hint on a related decision screen.

---

### Rule 5.2 · Show damage preview, not rules
**Problem:** Kids don't read "Wind beats Water." They tap whatever button has the biggest number.

**Rule:** on every battle move button, show **damage preview vs. the current target** with ⚡ super / 🛡️ weak glyphs. Kid never has to compute.

**Checklist:**
- [ ] Move buttons show `~XX dmg` with ⚡/🛡️ when appropriate.
- [ ] Super-effective moves are visually distinct (green glow).
- [ ] Target picker shows per-target previews for multi-enemy battles.

---

### Rule 5.3 · Enemy cards broadcast weakness AND resistance
**Problem:** Kids didn't know what to AVOID.

**Rule:** every enemy card in battle shows both **weak:** (what hits them hard) and **strong:** (what they resist).

**Checklist:**
- [ ] Enemy card has `weak: [icons]` and `strong: [icons]` lines.
- [ ] Both derived from the type chart programmatically (not hardcoded per enemy).

---

## Category 6 — Narrative & dialogue

### Rule 6.1 · Character arcs need dedicated reveal scenes
**Problem:** The Wraith's "I was lonely" twist lived only in his `quipLines` (never shown in combat UI). The whole arc's theme ("scary isn't bad") had no payoff moment.

**Rule:** emotional reveals, plot twists, and character arc resolution require a **dedicated dialogue scene**. Don't bury them in enemy data.

**Checklist when writing an arc:**
- [ ] For each NPC with a character arc, list the scene where their arc lands.
- [ ] Plot twists have explicit dialogue scenes showing the reveal.
- [ ] Post-boss reveals live in a scene between victory and reward.

---

### Rule 6.2 · Dialogue must match current rules
**Problem:** When the element chart changed, crown dialogue still said "Wind beats Earth" — giving kids wrong advice.

**Rule:** whenever you change a core rule (type chart, ally system, stat formula), **grep all dialogue files for stale references** and update.

**Checklist after any rule change:**
- [ ] `grep -i "wind beats\|fire beats\|weak to\|strong vs"` across data + docs.
- [ ] Update crown-dialogue.js, quest scenes, arc docs, CONCEPT.md.
- [ ] Re-run `/tmp/verify_*.js` sims to confirm math still matches dialogue.

---

### Rule 6.3 · Every speaker has a label
**Problem:** Yeti/Wraith/Gus/Frostbeard spoke in dialogues but `dialogue.js speakerDisplay` only knew about 8 characters. Their lines showed raw IDs.

**Rule:** whenever you use a new `speaker` in a dialogue beat, add an entry to `engine/ui/dialogue.js speakerDisplay`.

**Checklist:**
- [ ] List every distinct `speaker` value in new scenes.
- [ ] Confirm all appear in `speakerDisplay` with emoji + name.

---

### Rule 6.4 · Language level
**Rule:** captions ≤ 8 words. Buttons ≤ 3 words. Vocabulary at Dog-Man / Magic-Tree-House level. Action verbs over abstract words. Story is told through pictures + tiny text.

**Checklist:**
- [ ] Every new caption/button auditioned at 6yo reading level.
- [ ] No "challenge," "protect," "defeat" — use "fight," "save," "beat."

### Rule 6.5 · Main villain appears in EVERY arc
**Problem:** Forest and Mountain shipped without Mornox appearing on-screen. The overarching plot was invisible — every arc felt like an isolated episode. Kids never knew who the real bad guy was until the endgame, which meant the finale had zero buildup.

**Rule:** the main villain (Mornox) must be *felt* in every arc, not just endgame. Via at least one of: scroll, crown-voice hijack, physical gift left at castle, dream, ghost projection, mini-villain reveals a direct connection.

**Checklist when authoring a new arc:**
- [ ] **In-arc hint:** the arc's mini-villain mentions or is connected to Mornox in at least one dialogue beat (backstory tie, manipulation reveal).
- [ ] **Arc-outro intervention:** after the reward scene, before the castle return, a dedicated `<arc>_outro_mornox` scene where Mornox speaks or delivers something. Uses `bg: 'rescue'` for visual spook factor.
- [ ] **Stakes bump:** something at the castle visibly worsens after the arc (withered vine, missing servant, dimmed torch).
- [ ] **Crown reaction:** the Crown's voice is briefly suppressed OR must apologize ("sorry, he does that") to maintain their emotional arc.

**See `PLOT_BIBLE.md` for the full villain/treasure weave across all 5 arcs.**

---

## Category 7 — Quality of life

### Rule 7.1 · Kids change their minds — let them
**Problem:** Gear/party locked after quest start meant bad prep → stuck.

**Rule:** between scenes (not during battles/puzzles), let the kid swap gear and allies via HUD buttons. Back buttons should return to the current scene, not always the castle.

**Checklist:**
- [ ] HUD has 📦 Gear and 🏠 Allies buttons with battle/puzzle guards.
- [ ] Gear Chest, Ally Room, and Character sheet use `KJ.UI.Castle.back()` for contextual return.

---

### Rule 7.2 · Auto-join on recruit
**Problem:** Kid recruited Foxy mid-Forest, but she went to roster only — didn't help in the upcoming goblin fight.

**Rule:** when an ally is recruited and there's room in the current party, they **auto-join the party** so they fight alongside James immediately.

**Checklist:** `recruit_ally` effect adds to party if under `MAX_ALLIES_PER_QUEST`.

---

### Rule 7.3 · Safety net for missed content
**Problem:** Miss an ally → lost forever.

**Rule:** any missable ally or item must be recoverable at the castle (Pompadour for allies, Library for scrolls, future vendors for gear).

**Checklist:**
- [ ] Allies: `mark_met_ally` effect fires even on decline, so Pompadour can sell them.
- [ ] Items: if an arc has a unique consumable, ensure a late-game way to buy it.

---

## Category 8 — Economy

### Rule 8.1 · Gold has 3+ sinks per arc
**Problem:** Gold piled up with nothing to do.

**Rule:** every arc should expose gold-cost choices (shop items, ally hire, bribes, scroll crafting). Kid should have at least 3 places to spend gold in a given playthrough.

**Checklist:**
- [ ] List gold expenditures possible in this arc.
- [ ] At least 3 distinct options (shop / bribe / craft / hire).

---

### Rule 8.2 · Death keeps progress
**Rule (unchanged):** KO returns kid to castle with all XP/gold/gear/allies earned so far. Current arc resets to entry. Crown delivers a flavor rescue line.

---

## Category 9 — Content authoring workflow

### Rule 9.1 · Validate every arc with the verify script
**Rule:** after authoring a new arc's `data/quests/<name>.js`, run a sim that:
1. Confirms all `next` / `onDefeat` IDs resolve.
2. Confirms all effect types are supported by the engine.
3. Confirms referenced enemy/ally/gear IDs exist in registries.
4. Sims a starter James vs. each battle — confirms at least one "best" move scenario.

Template for the sim: see `/tmp/verify_*.js` patterns used for Forest/Mountain.

---

### Rule 9.2 · Balance against three player archetypes
**Rule:** Tune encounters so each of these plays works:
- **"Mash button"** player: ignores types, picks biggest damage. Should still win trash, lose-or-narrowly-win boss.
- **"Smart"** player: uses type matchups, target selection. Should win decisively.
- **"Perfect"** player: swaps loadout between arcs, uses scrolls, exploits flag payoffs. Should cruise.

**Checklist per boss fight:**
- [ ] Sim all 3 archetypes, verify expected win rates from `CONCEPT.md §P25a`.

---

### Rule 9.3 · Documentation stays in sync
**Rule:** after shipping changes, update the relevant of:
- `CONCEPT.md` — only for locked pillars
- `BUILD_ARCHITECTURE.md` — for engine mechanics
- `arcs/<arc>.md` — for arc specifics
- `arcs/gear-progression.md` — for gear additions
- `DESIGN_LESSONS.md` — **this doc** when we discover a new class of mistake

---

## Quick checklist for shipping a new arc

Paste this into the top of your arc's plan doc and tick items off:

```
□ Arc covers ≥3 elemental types (Rule 1.1)
□ At least one mixed-type battle (Rule 1.1, 1.3)
□ Every kid-accessible move has a super-effective target (Rule 1.2)
□ Each choice scene has ≥2 non-dominated options (Rule 2.1, 2.2)
□ Every boss has a pre-fight prep scene (Rule 2.3)
□ All data fields are wired to engine handlers (Rule 3.1)
□ Treasure jamesBonus applies on grant_treasure (Rule 3.2)
□ 4–5 new gear pieces, one per slot (Rule 4.2)
□ Treasure's addMove counters next arc's enemies (Rule 4.3)
□ Tutorial touchpoints covered: crown line + UI + guide + hint (Rule 5.1)
□ Character arcs have dedicated reveal scenes (Rule 6.1)
□ Dialogue greps clean of stale type references (Rule 6.2)
□ All speakers added to dialogue.js speakerDisplay (Rule 6.3)
□ Captions ≤8 words, buttons ≤3 words (Rule 6.4)
□ Missable content recoverable at castle (Rule 7.3)
□ ≥3 gold-sink options in the arc (Rule 8.1)
□ Sim script passes: refs + effect types + enemy math (Rule 9.1)
□ Boss balanced against 3 archetypes (Rule 9.2)
□ Related docs updated (Rule 9.3)
```

---

**If you discover a new mistake class not captured here, add it as a Rule X.Y** with the same Problem/Rule/Checklist structure. This doc is load-bearing — it's how we stop making the same mistakes twice.
