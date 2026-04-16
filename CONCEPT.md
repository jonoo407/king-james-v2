# King James 2 — Design Concept (Frozen)

> **⚠️ Before authoring new content**, read [`DESIGN_LESSONS.md`](DESIGN_LESSONS.md) — every rule in that doc was earned by fixing a real mistake we made in earlier iterations. The checklists there will prevent you from repeating them.
>
> **📖 For the full plot weave** (Mornox's appearances in every arc, Treasure meaning, stakes escalation), see [`PLOT_BIBLE.md`](PLOT_BIBLE.md). This concept doc has the frozen pillars; the plot bible is the living story spine.

**Project folder:** `E:\app_design\king_james2\`

**Target audience:** Smart 7-year-old who reads chapter books (Dog Man / Captain Underpants / Magic Tree House level). Language simple enough for a 6-year-old to read; design and depth target a 7-year-old's brain.

**Goal:** A compelling King James RPG with real progression, meaningful choices, a proper overarching story, and a modular architecture that supports adding quests post-launch.

**Status:** Design-phase concept, approved. Implementation happens in a separate session via a `BUILD_V1.md` plan derived from this doc.

---

## 1. Context

Prior attempts (`E:\app_design\king_james\`) were "trivial, no real choices, written for a 4-year-old." This design corrects that with: deep combat, a progression loop with gear/allies/castle upgrades, a unified villain arc, and branching choices that really matter. The concept was iterated across 9 rounds of design questions with the user.

---

## 2. Research Summary

### What makes games fun (for kids)
Clear short+long-term goals · meaningful tradeoffs · felt progression · mastery curve · juicy feedback · variety of verbs · discovery · collection drive · identity · forgiving-but-real failure · short sessions · low reading load · hero fantasy · humor that respects intelligence.

### What makes kids' stories compelling
Hero with a flaw that changes · clear antagonist with real motive · stakes the kid cares about · mentor/sidekick · memorable allies and enemies · escalation · setup & payoff · theme shown not told · satisfying closure with hook for more.

### Per-quest structure
Mini Hero's Journey: **Setup → Complication → Twist → Climax → Reward** — each quest is one Dog Man–like chapter.

---

## 3. Locked Design Pillars

### Story & Characters

**P1 · Hero — James, the impatient schemer**
Cuts corners, "I'll just stab it!" Arc: learns to slow down and think. Crown wobbles when he's cocky, sits still when he thinks.

**P2 · Villain — Mornox the Cursed**
Long ago cast a "Crown Steal Spell" — it backfired and fused him into a grumpy, powerful, perpetually-cursed wizard. He wants the 5 Crown Treasures to reverse his own curse. Thematic mirror of James: what James could become. Redemption possible but not required at finale.

**P3 · Mentor — The talking broken crown**
The crown speaks. V1: cracked, foggy, says glitchy cryptic things ("Bzzt... find... *fzz* ...treasure..."). As James recovers each Treasure, crown gets clearer, funnier, warmer. Progression is built into the mentor.

**P4 · Overarching story — The Scattered Crown Treasures**
Mornox broke the royal crown into 5 magical Treasures hidden across the kingdom. Each major arc reclaims one. Each Treasure buffs James AND unlocks a new castle feature. All 5 reunited → final Mornox confrontation → James is truly king.

### World & Structure

**P5 · Hub-and-spoke world**
Castle = permanent home base. Kingdom map shows quest regions. Return between quests to upgrade, decorate, browse trophies, pick next quest. Highly modular — quests are independent data.

**P6 · v1 scope = vertical slice (Forest arc only)**
Full castle hub + 1 polished quest arc. Map shows all 5 region slots but only Forest is active in v1. Remaining 4 arcs slot in modularly later.

### Gameplay

**P7 · Mixed scene types**
Most scenes are **choice-driven** (gear/allies unlock extra options). Occasional **turn-based boss battles**. Occasional **puzzle rooms**. Three reusable scene renderers.

**P8 · Combat (Pokémon-like, deep)**
- Stats per combatant: HP, ATK, DEF, SPD
- **Party:** James + 1–2 allies vs enemy team (up to 3 enemy creatures)
- Turn order by SPD; pick action per party member per round
- **5 types:** 🔥 Fire · 💧 Water · 🌿 Earth · 💨 Wind · ✨ Magic
- **4-move loadout per combatant**
- **James's moves come from his 4 equipped gear pieces** (weapon, armor, trinket, boots each grants 1 move + stats). Swap gear = swap moves.
- **Allies level up and learn moves innately** (by species, no gear)
- **James levels up:** base stats grow with XP; gear adds on top
- **Kid-friendly UI:** stats as colored bars · types as bright icons · damage numbers fly · "⚡ Super effective!" on weakness hits

**P9 · Puzzles — mix of styles**
Riddle Tree: word riddles with emoji hint buttons. Other puzzles: visual logic (pattern/odd-one-out), memory-sequence, inventory-combo (use Foxy's stealth, use Owlette's wisdom, etc.). Variety per scene.

**P10 · Allies (collectible party)**
- Befriend creatures through quest moments (majority)
- Optional wild creatures catchable with a **Friendship Charm** in battle (minority)
- Wild encounters spawn in **optional quest side-paths** (explorers rewarded, rushers unaffected)
- Castle has an Ally Room to manage roster + bring 1–2 on each quest
- v1 yields up to 3 allies: **Foxy** (💨 Wind, stealth), **Ribbit** (💧 Water, swim/cool), **Owlette** (✨ Magic, wisdom)
- **Missed-ally safety net:** if James meets an ally candidate during a quest but doesn't recruit them (skipped side-path, failed charm, ignored dialog), they can be **hired for gold** later from Dame Pompadour in the Ally Room (see P19)

**P11 · Gear**
- 4 slots: **weapon, armor, trinket, boots** → each gives stats + 1 move
- Starter gear (4 rusty items): 🪵 Wooden Sword (🌿+2 ATK, "Swing") · 👕 Cloth Vest (+1 DEF, "Brace") · 🪙 Plain Stone trinket (+1 HP, "Toss") · 👟 Old Boots (💨+1 SPD, "Kick")
- v1 Forest drops (4 upgrades): ⚔️ Iron Sword (🌿+4 ATK, "Iron Slash") · 🛡️ Leather Armor (+3 DEF, "Brace+") · 📿 Lucky Charm (luck, "Lucky Throw") · 👢 Forest Boots (💨+3 SPD, "Leaf Kick")
- ~2 rare finds in hidden paths (full catalog at build time)
- Future arcs: system supports unlimited tiers

**P12 · Progression axes (stacking)**
Weapons · Armor · Trinkets · Allies · James's Level (+ traits) · Ally Levels (+ chosen moves) · Gold · Castle Rooms · Royal Rank (Peasant Kid → Squire → Knight → Prince → King) — gates harder quests in later arcs.

**Gold sources:** battle victories (small drops) · selling unused gear · hidden chests in quests · badge rewards · replaying arcs
**Gold sinks:** Dame Pompadour's ally hires · crafted scrolls in Library · future castle upgrades · cosmetic castle decor

### Castle (v1 day-1 rooms)

**P13 · Hub layout**
- 👑 **Throne Hall** — center of castle; crown "lives" here and speaks; main navigation
- 🗺️ **Map** — pick next quest (all 5 region slots visible; 4 locked in v1)
- 📦 **Gear Chest** — view and equip gear
- 🏠 **Ally Room** — manage party, see ally bios, feed treats; **Dame Pompadour** (recruiter) lives in the back corner with her dramatic audition stage
- 🔒 **Library** — locked in v1; unlocks as Forest reward (read lore, get puzzle hints, craft magic scrolls)
- Trophy Hall opens as a sub-area of Throne Hall once the Troll is defeated (first statue earned)

### Engagement & Persistence

**P14 · Trophies + achievement badges**
- **Trophy Hall** fills with statues as bosses are defeated (visible castle growth)
- **Badge sheet** tracks feats: "First Friend," "No-Damage Boss," secret badges, "Catch 3 Wild," etc. Hidden goals drive replay.

**P15 · Save**
Auto-save to browser `localStorage` after every meaningful action (scene changed, ally recruited, gear equipped, boss beaten, returned to castle). Single save slot. Kid-proof — closing the browser never loses progress.

### Systems added in Round 9

**P19 · Dame Pompadour — the Recruiter (missed-ally hire)**
- A flamboyant NPC in the Ally Room with mile-high wig, painted face, heavy eyeshadow
- Big dramatic voice — calls James "darling," "sweetie," "your majesty-ness"
- Offers to "audition" creatures James has met-but-missed, for a **gold** price
- Pricing scales: basic ally ≈ 50g, rare ≈ 200g, legendary ≈ 500g (numbers TBD at build time)
- Candidates only appear in her roster after James has *encountered* them once in a quest
- Makes it impossible to permanently miss an ally → reduces stress, rewards exploration without punishing rushers
- Her comedy bits: mispronounces creature names, dramatic auditions ("Oh darling, give us a POSE!"), theatrical wipes of forehead when gold is paid

**P20 · Battles per arc (richer pacing)**
Each story arc has **3–4 battles**, not just 1 boss — mixing:
- **Trash encounters:** 1–2 minor fights with basic enemies (test combat, drop small gold/XP)
- **Skirmish / mid-boss:** a named mini-boss in the middle of the arc (tests type matchups, drops gear)
- **Boss:** the arc's main antagonist with the Treasure (large XP, unique gear, trophy)
- Plus: **1 optional wild encounter** for charm-capture

**P21 · James's level-up choices (kid agency)**
On level up, James gets:
- **+2 stat points** the player chooses where to spend (HP / ATK / DEF / SPD)
- Every **3rd level**, pick **1 of 3 "Royal Traits"** — permanent passive buffs (e.g., "Thick Skin" +10% DEF · "Silver Tongue" +1 gold per win · "Eagle Eye" +crit chance · "Tough Stuff" +1 HP regen per turn · "Patient" +XP from puzzles)
- UI presents stat points as big + buttons on stat bars, and traits as three big picture-buttons (recommended trait highlighted for novice players)

**Ally level-up choices** (simpler):
- Stat points auto-allocated based on species role (Foxy gets SPD, Ribbit gets HP, Owlette gets ATK via Magic)
- At levels 3, 6, 9: **choose 1 of 2 new moves** to learn (replaces an existing move slot via confirmation)

**P22 · Story replay (grinding with purpose)**
- Completed arcs are marked ✅ on the map but **can be replayed**
- Replay yields: **½ XP, ½ gold, no unique Treasure/trophy** (you already have them) but still drops **regular gear + wild encounters**
- Wild creatures respawn on replay — lets kid catch-'em-all across multiple runs
- Narrative framing: crown says "Back to the Forest? Sure — I'll stay home and nap this time"
- Makes level grinding possible without being mandatory

**P23 · Death/knockout = gentle restart (with crown flavor)**
- If party is fully knocked out: screen is framed as the **crown magically rescuing James** — not a defeat, a mysterious save
- Return to castle with **all progress kept**: XP earned, gold earned, gear collected, allies recruited, items gained up to that point in the arc
- Current arc is **reset to its entry** — must replay from Scene 1 if you want to push through to the Treasure
- No permadeath, no stat loss, no item loss
- **Crown dialogue is the hero of this screen** — a rotating pool of in-character lines that hints the crown has secret magic:
  - *"Oh relax, I saved you. You're welcome."*
  - *"Magic crown magic! Don't tell anyone."*
  - *"Poof! ...wait did that work? Yes! Yes it worked."*
  - *"I zapped you home. Don't ask how."*
  - *"I MAY have done something magical. Probably."*
  - *"You owe me. Again. I'm keeping count."*
- Makes death a fun moment, plants a mystery (what ELSE can the crown do?), keeps spirits high
- **Design hook for later:** these "crown saved me" lines quietly foreshadow that the crown is more powerful than it lets on — payoff potential in the Mornox finale

**P24 · Character sheet (inspection screen)**
- Accessible from Throne Hall via a **📜 Character button** (always visible in top HUD too)
- A single scrollable panel showing everything James-related:
  - Portrait + name + **Royal Rank** badge + level + XP bar
  - **Stats:** HP, ATK, DEF, SPD (current + base + gear bonuses shown as "12 (8 + 4)")
  - **Equipped gear:** 4 slots, each showing emoji + name + stats + move
  - **4 active moves** (derived from gear) with type icons and power numbers
  - **Royal Traits earned** (list of picked perks with short descriptions)
  - **Allies in roster** (grid of emoji portraits, tap for ally detail screen)
  - **Gold**, **Friendship Charms count**, other items
  - **Badges earned** (miniature row — tap to open full Badge sheet)
- Same pattern for each ally: tap an ally → ally detail screen (stats, moves, bio, level, XP, species ability)

**P25a · Battle difficulty (tuning philosophy)**
- **Not too easy:** mash-attack alone should NOT reliably win any boss or mid-boss; type matchups and ally choice must matter
- **Not too hard:** no battle should require grinding beyond the arc's natural XP curve; a kid playing thoughtfully at the recommended level should win on first or second try
- **Sweet spot:** each battle should feel **winnable with thinking, losable with rushing** — forcing James's arc to manifest mechanically
- Target win-rates at "intended" player level:
  - Trash (Goblin Scouts): **~95%** — easy learning fight
  - Mid-boss (Briar Wolf): **~70%** — loseable if you brought the wrong ally or haven't upgraded gear; teaches that prep matters
  - Boss (Troll + Thornpup): **~60%** on first try, **~90%** on second try after learning the pattern — rewarding-but-real challenge
- Target battle length: **trash 2–3 rounds · mid-boss 4–6 rounds · boss 6–10 rounds**
- **Enemy telegraphs:** every enemy broadcasts their next big move 1 turn in advance (icon + text: *"Troll is charging a Smash!"*) so a kid can react instead of being blindsided
- **Escape valves:** if a kid is stuck, they can always: run back to castle (lose arc progress, keep loot) · replay easier arcs for XP · hire a better ally from Dame Pompadour · rebuy potions
- **Never:** instant-KO moves, status effects that chain-stun, RNG that kills the player in 1 turn with no warning

**P25 · Battle dialogue (juice + personality)**
- Every enemy has **3–5 lines** used randomly during battle events (entering battle, taking hit, landing crit, dying, using signature move)
- Every ally has **3–5 quip lines** triggered similarly (pick a move, land crit, take hit, win)
- Lines are SHORT (3–7 words), in-character, emoji-punctuated where helpful
- Example sets:
  - **🌿 Goblin Scout:** *"Get off our road!"* / *"We bite!"* / *"Ow ow ow!"* / *"Retreat! RETREAT!"*
  - **🌿 Briar Wolf:** *"RAWR! MY woods!"* / *"Who let you in here?"* / *"I eat kings for breakfast."*
  - **🌿 Hoarder Troll:** *"Mine! Mine! Mine!"* / *"Can't have it!"* / *"Ugh. You again."* / *"My back hurts."*
  - **🌿 Thornpup:** *"Bark bark bark!"* / *"Sharp! Ow, sharp for me too!"*
  - **🦊 Foxy:** *"Watch this!"* / *"Too slow!"* / *"Clean move."*
  - **🐸 Ribbit:** *"Rrrribbit!"* / *"Splish splash."* / *"Cool water."*
  - **🦉 Owlette:** *"Obvious, really."* / *"Hoo boy."* / *"As predicted."*
  - **🧒 James:** *"Gotcha!"* / *"Ow, wait—"* / *"Just as planned!"* / *"Okay THAT hurt."*
- Lines are stored as arrays in each creature's data module so the full catalog is easy to extend per new ally/enemy

### Look & Feel

**P16 · Art style**
**Emoji characters over CSS-styled backgrounds.** Each location has its own CSS gradient/pattern (green forest, stone castle, etc.). Emoji characters pop over them. Cheap, expressive, mobile-friendly, fast to build.

**P17 · Mobile-friendly**
Big thumb-sized buttons · no horizontal scroll · audio unlocks on first tap · vertical-only layout · tested on phone.

**P18 · Audio**
Keep Web Audio procedural sounds from v1 (tones, slides, notes). Add a handful of new sounds: sword clank, magic whoosh, boss roar, victory jingle. No music tracks in v1 — background ambient tone optional.

---

## 4. Forest Arc (v1) — Full Spec

**Overarching beat:** James is sent to reclaim the 💎 Gem of Wisdom from the forest. Theme: the impatient schemer is forced to think.

### Scenes

**Scene 1 — Forest Entry (choice scene)**
- James walks into the woods. Meets **Foxy** (💨 Wind ally candidate).
- Foxy is guarding something; won't help for free.
- Choices: try to shortcut through brambles (fails, takes damage) · bargain with Foxy · ask her what she wants
- If James helps Foxy with her problem → she joins the party as Scene 1 ally.

**Scene 1b — Goblin Scouts (mini-battle, ~30–45 sec)**
- Two weak 🌿 Goblin Scouts ambush James on the path (tests battle basics).
- Easy fight — whatever starter gear you picked will win.
- Drops: ~10 gold + a low-tier trinket candidate. First taste of loot.

**Scene 2 — Riddle Tree (puzzle room)**
- Ancient tree blocks the path; won't move until James solves 3 riddles.
- James wants to chop it down → crown scolds him.
- **3 word-riddles** with 3 emoji buttons each. Example: *"Cold. White. Falls from sky. What?"* [🔥][❄️][🍂] — correct ❄️.
- Per-riddle: 2 tries. Fail twice → Owlette bails you out (hint) but you lose the "no hint" badge.
- Solve all 3 with no hints → **Owlette** joins (✨ Magic ally).

**Scene 2.5 — Optional Pond side-path (wild encounter)**
- An extra path branches off. If taken: find a **wild Ribbit** 🐸 (💧 Water) battle.
- Weaken it → throw 📿 Friendship Charm → **Ribbit** joins.
- If skipped, James still completes the arc. (Can hire Ribbit from Dame Pompadour later if missed.)

**Scene 2.9 — Briar Wolf Skirmish (mid-boss battle)**
- After the Riddle Tree, the path opens into a clearing. A 🌿 **Briar Wolf** (mid-boss, Earth type) snarls from a thicket.
- Harder than goblins — tests whether James has upgraded gear or brought the right ally.
- Wind-type moves strong here; Foxy excels.
- Drops: ~25 gold, chance of 📿 Lucky Charm, chance of a Friendship Charm.

**Scene 3 — Hoarder Troll (boss battle)**
- Big mean 🌿 Earth-type troll. Has the Treasure.
- Fight: James + any 1–2 allies vs Troll (Troll has 1 minion — a 🌿 Thornpup — to make it a real 3-on-2).
- Brute force fails (Troll's DEF is high, attacks blocked). Kid has to: use 🔥 Fire moves (Spark starter, or Ember Burst from the troll drop), bring Owlette for magic chip damage, or prep with scrolls.
- Win → Troll drops the Gem + ~100 gold + guaranteed unique drop (e.g., 🪨 Stone of the Troll trinket, legendary tier).

**Scene 4 — Treasure Reveal (reward scene)**
- Gem of Wisdom recovered. Crown glitches, then gets clearer: *"Great work, James! Now, are those your socks?"*
- Return to castle. **Library unlocks.** First trophy added to Trophy Hall. Badges awarded based on performance.
- James hits level-up thresholds from all the XP — spend stat points + maybe pick a Royal Trait.

### Arc-level battle summary
- Goblin Scouts (trash, 1×2) · optional wild Ribbit (1) · Briar Wolf (mid-boss, 1) · Troll + Thornpup (boss, 2) = **3 required battles + 1 optional wild** per playthrough.

### If party is knocked out mid-arc
Crown-rescue screen → back to castle with all gold/XP/allies/gear earned so far — but arc resets to Scene 1 when replayed. No penalty on stats or inventory.

### Replay
After the arc is complete (✅ on map), James can re-enter the Forest for:
- ½ XP · ½ gold · regular gear drops (still possible) · wild Ribbit still catchable if missed
- No second Gem of Wisdom, no second trophy, no badge re-earns
- Crown will nap: *"You again? I'll be here. Wake me when you need me."*

### v1 Win-State
Treasure recovered → Library unlocked → 1–3 allies in roster → 4 upgraded gear pieces → Trophy Hall has its first statue → badge progress recorded. 4 regions still locked on the map, enticing "what's next?"

---

## 5. Modular Architecture (design-level)

To support adding quest arcs without touching the core, the game is built around these separable data modules:

- **Scene modules** — each quest is an ordered list of scene data objects; renderers handle the display
- **Ally module** — catalog of creatures (name, emoji, type, stats, learnset, scene-ability, hire price, bio, quipLines[])
- **Gear module** — catalog of gear (slot, name, emoji, type, stats, move, tier, gold value)
- **Move module** — catalog of moves (name, type, power, accuracy, status effect)
- **Enemy module** — catalog of enemy creatures (same shape as allies + gold/xp rewards + quipLines[])
- **Region module** — catalog of regions (name, emoji, background style, quest pointer, replay state)
- **Treasure module** — 5 treasure objects (name, effect-on-James, castle-room-unlocked)
- **Badge module** — list of badges with unlock predicates
- **Trait module** — list of Royal Traits for level-up choice (P21)
- **Crown-dialogue module** — themed pools of crown lines (intro / hint / death-rescue / victory / general) with per-Treasure-count coherence levels
- **Save module** — shape of `localStorage` state; versioned for safe upgrade as we add content

Each module is independently editable. Adding an arc = adding entries to scene/ally/gear/enemy modules, not rewriting core logic.

---

## 6. Future Roadmap (out of v1 scope)

- 4 remaining region arcs — themes, treasures, allies, villains decided one arc at a time at build time
- Full gear tier system across all 5 arcs
- Full ally catalog (~8–10 creatures)
- Dedicated Wild Woods side-area for advanced creature hunting
- Mornox final confrontation + ending
- Music tracks
- Multiple save slots
- Additional castle rooms (forge, kitchen, training yard)

---

## 7. Next Steps (for the next Claude Code session)

1. Read this `CONCEPT.md`.
2. Produce `BUILD_V1.md` — the implementation plan: file structure, data-module schemas, build order (hub → scenes → combat engine → UI → data), balance tuning targets.
3. Build `king-james2.html` scaffold, then fill in iteratively per `BUILD_V1.md`.
4. Run the verification checklist below before declaring v1 done.

---

## 8. Verification (when v1 is built)

1. **Play the Forest arc end-to-end** on desktop; confirm: start castle → equip starter gear → travel to Forest → Scene 1 (meet Foxy) → Scene 1b (goblins) → Scene 2 (solve 3 riddles) → Scene 2.5 (optional Ribbit wild catch) → Scene 2.9 (Briar Wolf) → Scene 3 (Troll battle) → Scene 4 (reward) → return to castle → Library unlocked → first trophy earned.
2. **Play a "rush" run** — skip Ribbit side-path, fail 1 riddle (Owlette bails, no Owlette reward). Confirm arc still completes and badges reflect weaker run. Later hire Ribbit from Dame Pompadour for gold.
3. **Play a "perfect" run** — catch Ribbit, solve all riddles no-hint, beat Troll with no damage. Confirm all 3 allies collected + "Patience", "First Friend", "No-Damage Boss" badges awarded.
4. **Level-up test** — earn XP, confirm on-level-up screen shows stat-point allocator and (every 3rd level) Royal Trait choice of 3.
5. **Death test** — intentionally lose the Troll fight. Confirm crown-rescue screen appears with a random in-character line, return to castle with all earned gold/XP/items, arc resets to Scene 1. Verify 5+ rescue lines rotate across multiple deaths.
6. **Replay test** — finish arc, re-enter Forest from map. Confirm ½ XP/gold, no second Treasure/trophy, wild Ribbit still catchable.
7. **Dame Pompadour test** — finish a run missing one ally, visit Pompadour, pay gold, confirm ally joins roster.
8. **Persistence test** — close browser mid-quest, reopen, confirm resume from exact scene with exact state.
9. **Mobile test** on phone: all buttons thumb-sized, no scroll issues, audio unlocks on first tap, battle UI readable.
10. **Language check** — every caption and button readable by a 6-year-old (5–8 words, small words); every scene understandable from visuals alone with sound off.
11. **Character sheet test** — open the 📜 Character button; confirm stats (current + base + gear bonus format), equipped gear, 4 moves with type icons, Royal Traits, allies grid, gold, badges all visible. Tap an ally → ally detail screen opens correctly.
12. **Battle quip test** — play through all 3 Forest battles; confirm each enemy speaks 3+ different lines and allies/James quip on their own actions. Lines feel in-character, never repeat in the same turn.
13. **Battle-balance QC (critical — per P25a)** — run each of the 3 required battles under each of these conditions:
    - **"New player" run:** starter gear only, no ally, no type-matchup thinking (mash Attack). Expected: trash wins (~95%), mid-boss near-coinflip (~50–60%), boss rarely wins (~20–30%). This is desired — mashing shouldn't clear the arc.
    - **"Smart player" run:** use the recommended Forest gear + bring Foxy (Wind-type) for Earth-heavy enemies. Expected: trash ~100%, mid-boss ~85%, boss ~75%.
    - **"Perfect player" run:** full gear + Foxy + Owlette, no wasted turns. Expected: all battles won in target round count (trash 2–3 / mid 4–6 / boss 6–10) with HP left over.
    - Tune enemy HP/ATK/DEF/SPD numbers and move damage until the measured win rates match target rates within ±10%. If a battle is outside target band, iterate.
    - Confirm every enemy's "big move" telegraph fires 1 turn in advance, readable by a 7yo.
    - Confirm no battle can instant-KO from full HP.
14. **Modularity test** — a "Mountain arc" data stub can be added to the scene/ally/gear modules and appear on the map with no core-code changes.
