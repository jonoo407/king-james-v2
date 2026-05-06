# Volcano Arc — "The Lava Peak" (FINALE)

> Authoring this arc? First read [`../DESIGN_LESSONS.md`](../DESIGN_LESSONS.md) and [`../PLOT_BIBLE.md`](../PLOT_BIBLE.md) — **the entire game has been building to this**. Every rule below came from lessons in prior arcs.

**Region:** 🌋 Lava Peak
**Treasure:** 🌟 Star of Friendship → unlocks ⭐ Alliance Hall (all-allies-grow-faster)
**Gateway weapon drop:** ✨ **Mage Saber** (magic, pwr 14) — final type added to arsenal
**Target level range:** enter ~Lv 9, exit Lv 10–11
**Estimated length:** ~18–22 min (longest arc), ~22 scenes
**Arc theme:** *Forgiveness — of others AND of yourself.*

**This is the finale.** James meets Mornox face-to-face. Two-path ending based on whether kid has accumulated the "kind" path flags across arcs.

---

## 1. Story

The volcano is Mornox's home. He has been here for 400 years, in a tower built over the caldera, his curse keeping him from leaving.

James arrives with all 5 Treasures. Mornox is waiting. He has set up an old kettle. There are two chairs. He offers tea.

This is a **confrontation, not an ambush**. Mornox isn't trying to surprise. He wants the Treasures. He has for 400 years. He's polite about it.

**James must choose:**
- **Fight** — take the Treasures by force. Three-phase boss fight using every mechanic.
- **Listen** (if unlocked by prior arc flags) — sit at the kettle. Let Mornox tell his story. Offer to help un-curse instead of steal.

Both paths end with Mornox's curse broken and the kingdom saved. **The "fight" ending is bittersweet — Mornox finally gets to rest (crumbles peacefully).** The "listen" ending is redemptive — Mornox de-ages 50 years, walks away, crown whole.

Either way: **James is now the true king. The crown is whole. The kingdom is safe.**

---

## 2. Plot Bible weave — the full payoff

### Every thread lands here
- The mirror theme (James = young Mornox) pays off in the final choice
- The Crown's secret (Crown is Mornox's old teacher, trapped) is revealed in dialogue
- Each arc's local lesson returns:
  - Forest: **Patience** — kid has time, don't rush the boss
  - Mountain: **Listen** — the Listen path itself is this lesson
  - Beach: **Kindness** — needed to unlock Listen path
  - Desert: **Hope** — kid persists through Mornox's manipulation attempts
  - Volcano: **Forgiveness** — the theme of this arc
- **Zephyra aids from the castle** (letter, buff, or cameo — she can't enter Volcano due to her own broken magic)
- **All recruited allies may be visible in the endgame sequence** (group shot at castle when kingdom is saved)

### Listen-path unlock conditions
Track these flags across arcs — kid must have ≥ 3 to unlock Listen:
- Forest: `riddle_tree_no_hints` (Owlette recruited through thinking)
- Mountain: `yeti_friend` (listened to Papa Yeti instead of attacking)
- Beach: `serpent_friend` **OR** `knows_drifter_past` (befriended baby serpents OR read the ruins tablet — both shipped beach kindness paths)
- Desert: `first_alliance` (partnered with Zephyra, didn't dismiss her)

If < 3 "kind" flags: Fight path only. (Fair — the kid who rushed through every arc gets the fight-it-out ending.)

> **Note**: original spec referenced `peacemaker` (a Sirena-arc flag from the un-shipped beach plan). Shipped beach uses Drifter the Healer instead — see [`beach.js`](../data/quests/beach.js). The two flags above are the actual beach kindness flags.

---

## 3. Cast

| Character | Role | Type | Notes |
|---|---|---|---|
| **Mornox** 🧙‍♂️ | Final villain / protagonist-mirror | ✨ magic (primary) | 400 years old. Tired. Clever. Vulnerable under the mask. |
| **Tempered Dragon** 🐲 | Mornox's guardian, phase 1 | 🔥 fire + 🌿 earth | Ancient beast. Hates but obeys. |
| **Lava Spirits** 🟠 | Trash in climb | 🔥 fire | Weak to 💧 water |
| **Obsidian Golems** 🗿 | Trash in climb | 🌿 earth | Weak to 🔥 fire |
| **Echo of Young Mornox** (vision) | Flashback character | — | Seen during listen-path — the brilliant, lonely young wizard he once was |

---

## 4. Enemy variety

Volcano must cover ≥ 3 types even though "volcano" suggests fire:
- 🔥 Fire (Lava Spirits, Dragon's phase 1) — primary
- 🌿 Earth (Obsidian Golems) — plenty of variety
- ✨ Magic (Mornox himself, Dragon's phase 2)
- 💧 Water (Mornox phase 3 — frozen ice-magic forms)

Every kid weapon earned across the game finds a use in at least one phase.

---

## 5. Scene breakdown (~22 scenes, longest arc)

### Act 1 — The climb (5 scenes)
1. **volcano_intro** (dialogue) — Crown is deeply serious for the first time. "We've done it. We've got all four. One more room at the top of the world. Be brave."
2. **volcano_base** (choice) — last-chance prep: visit village, return to castle (if needed) to re-equip, or ascend now. Kid has all their accumulated loot — make them WANT to loadout-check.
3. **volcano_lava_flow** (battle) — 2 Lava Spirits + 1 Obsidian Golem. Mixed types = needs 2+ move types. Target picker.
4. **volcano_ash_field** (choice) — 3 paths:
   - Climb straight (−5 HP from ash)
   - Long way round (no cost but misses a chest)
   - Zephyra's route (needs first_alliance) — safe AND bonus chest
5. **volcano_chest_room** (if long way OR alliance) — unique loot: a scroll of Zephyra's design + 30g.

### Act 2 — Dragon Gate (4 scenes)
6. **volcano_dragon_pre** (choice) — classic 3-path prep:
   - Charge
   - Use Foxy sneak
   - Bribe with Dragon Scale (if acquired)
7. **volcano_dragon_p1** (battle) — Tempered Dragon fire phase + 2 golems. Hard. Water moves shine.
8. **volcano_dragon_p2** (battle, immediate) — Dragon's magic phase (transforms). Wind moves shine here. Kid MUST swap strategy mid-fight. Uses same target picker mechanic.
9. **volcano_dragon_rest** (dialogue) — brief healing moment. Crown says something for the first time about its own past ("I remember when that dragon was young and kind, you know. So do some of you, I bet. *fzzt*")

### Act 3 — The tower (5 scenes)
10. **volcano_tower_climb** (choice) — spiral staircase, riddled. 3 paths each dealing micro-damage. Owlette's wisdom saves HP.
11. **volcano_empty_floor** (dialogue) — a single abandoned book lies open. James reads it. A page about Zephyra. James pockets it.
12. **volcano_old_mornox** (dialogue) — a portrait of young Mornox on a wall. Doesn't move. Just watches. Heavy foreshadow.
13. **volcano_crown_reveal** (dialogue) — Crown finally breaks: *"Listen, kid, before we go up. There's something I haven't told you. I was... I was his teacher. This crown is what's left of me. He did this to me. But he was the best student I ever had."* Emotional beat.
14. **volcano_door** (dialogue) — the top. Two chairs. Kettle. Mornox.

### Act 4 — Mornox confrontation (6–8 scenes based on path)

15. **volcano_pre_mornox** (choice) — finale prep at the kettle (Rule 2.3 — every boss gets prep). 3 paths, all thematic to the tea-and-chairs moment:
    - 🍵 **Drink the tea** (+15 HP, sets `tea_accepted` flag — Mornox notes it in dialogue)
    - 🙏 **Pray to the Crown** (+2 sparks, allies +5 HP)
    - 🚪 **Skip — go straight in** (+1 ATK from focus, no resource gain)

16. **volcano_mornox_meet** (choice) — the key branch (buttons ≤3 words):
    - **⚔️ Fight** → volcano_mornox_p1 (all paths)
    - **👂 Sit down** → volcano_mornox_listen (locked by ≥3 kindness flags)
    - **🗨️ Ask first** — middle path, reveals more, then forces fight/listen choice

### Fight path (3 phases — multi-phase battle)
17. **volcano_mornox_p1** (battle) — Mornox uses fire form (magic + fire summons). Kid uses water/wind.
18. **volcano_mornox_p2** (battle) — Mornox uses water form. Kid uses **magic** (water is SE-vulnerable to magic only — wind is NOT SE vs water, the original spec line was wrong).
19. **volcano_mornox_p3** (battle) — Mornox uses earth/magic combo. Kid uses fire + wind stacked.
20. **volcano_mornox_defeat** (dialogue, bittersweet) — Mornox crumbles. Last line: *"Thank... you. Finally."* Crown cries. Curse breaks. Kingdom saved. **No "you should have listened" line — Crown grieves, doesn't judge.**

### Listen path
17. **volcano_mornox_listen** (dialogue) — long scene, Mornox tells his whole story. Flashback beats woven in.
18. **volcano_mornox_choice** (choice) — James offers: un-curse together, OR still take Treasures and go.
19. **volcano_redemption_ritual** (dialogue) — the two wizards + James unite the Treasures + crown, curse breaks, Mornox de-ages 50 years. **Critical beat**: Mornox must say *out loud* he can't forgive himself — that's the inner half of the arc's "Forgiveness — of others AND of yourself" theme. Otherwise the Mirror-to-James lands incomplete.
20. **volcano_mornox_goodbye** (dialogue) — Mornox walks down the mountain for the first time in 400 years. Gives James the kettle as a gift. Also gifts the Mage Saber.

### Both paths
21. **volcano_epilogue** (dialogue) — James returns to castle. Every shipped named character gathered: Zephyra, Papa Yeti + Baby, Foxy, Ribbit, Owlette, Gus, **Drifter** (the redeemed beach healer), **the Widow** (from beach village), Glimmer the Wraith (bowing awkwardly), Finn, Pompadour, Sir Frostbeard. Group-photo energy. *Sirena and Joon are NOT included — they were planned for an unbuilt version of beach and never shipped.*
22. **volcano_crown_restored** (dialogue) — Crown is whole. Crown's voice is clearer than ever. Crown gives James one final speech.
23. **volcano_end** (ending scene type) — credits-like ending screen. Badges earned total. Trophies lined up. Final Crown sign-off (split into 5 short beats — see §8).

---

## 6. Gear drops (Tier 6 per gear-progression.md)

| Piece | Slot | Stats | Drop source |
|---|---|---|---|
| ✨ Mage Saber | weapon | +8 ATK, Arcane Slash (magic pwr 14) | Mornox phase 3 drop (Fight path) OR Mornox gift (Listen path) |
| 🐉 Dragon Scale | armor | +7 DEF +5 HP, Scale Wall heal+15 | Dragon drop 100% |
| 💫 Star Pendant | trinket | +5 HP +4 SPD, Star Dust magic pwr 11 | Hidden chest (alliance path) |
| 🔥 Phoenix Boots | boots | +7 SPD +2 ATK, Phoenix Dash fire pwr 11 | Lava field rare drop |
| 🌟 **Star of Friendship** (treasure) | — | +4 HP perm + **Friend's Beacon** magic party heal +10 | Arc reward |

### Endgame (Tier 7) — Royal set
**These drop AFTER the Volcano arc, as a post-game epilogue.** One piece per epilogue optional task:
- 👑 Crowned Saber — beat a post-game challenge in Trophy Hall
- 🛡️ Royal Plate — complete all 5 arcs with all kindness flags
- 💍 Signet of Five — own all 5 Treasures (automatic)
- ⚡ Storm Boots — hit an SPD-check in a time trial mini-game

---

## 7. Balance targets

**James enters at ~Lv 9** with full kit + all Treasures:
- HP ~55, ATK ~18, DEF ~12, SPD ~12
- 4 gear moves + 5 Treasure bonus moves = 9 moves in battle
- Full type coverage
- Sparks max 6 (`KJ.maxSparksForLevel(9) = min(10, 3 + floor(9/3)) = 6`)

> **Important:** these HPs are the **post-multiplier** numbers — they already incorporate `KJ.TUNABLES.enemyHpMult` (= 1.3). Catalog the enemies in `data/enemies.js` at HP / 1.3, OR catalog at these numbers and exempt bosses from the multiplier. The balance-tester confirmed the original spec numbers (×1.0) collapsed the round-count targets — these (×1.3) match the runtime fights.

Trash mob targets:
| Enemy | HP (post-mult) | Catalog HP (÷1.3) | Expected rounds | Notes |
|---|---|---|---|---|
| Lava Spirit (fire) | ~34 | ~26 | 1 with water SE, 2–3 neutral | Mirror Sun Wisp |
| Obsidian Golem (earth) | ~49 | ~38 | 1–2 with fire SE, 3 neutral | +Lv4 from Stone Ogre |

Boss phase targets:
| Phase | HP (post-mult) | Catalog HP (÷1.3) | Expected rounds | Vulnerability |
|---|---|---|---|---|
| Dragon p1 (fire+earth) | 104 | 80 | 4–6 | Water on fire half, fire on earth half |
| Dragon p2 (magic) | 91 | 70 | 3–5 | **Wind shines** (wind→magic SE per types.js) |
| Mornox p1 (magic + fire summons) | 117 | 90 | 4–6 | Wind on magic, water on fire summons |
| Mornox p2 (water form) | 117 | 90 | 4–6 | **Magic only** — wind is NOT SE vs water |
| Mornox p3 (earth + magic combo) | 130 | 100 | 5–7 | Fire on earth, wind on magic |

Kid should finish each fight with 30–50% HP if playing smart. Scrolls and allies are essential.

Spark economy note: kid burns ~3 sparks/turn on magic moves (Arcane Slash + Friend's Beacon = ~2 each); regen +1/turn means ~5-round phases dip near 0 by phase end. The +2-per-victory and pre-Mornox prayer option keep things sustainable, but **plant a spark scroll at `volcano_dragon_rest`** (mid-fight breather scene) so the kid isn't starved entering Mornox.

Move-home check (Rule 1.2 — every kid move type needs a vulnerable enemy in the arc):
- Fire (Flame Cut, Phoenix Dash, Courage Burst) → Obsidian Golems + Mornox p3 ✓
- Water (Ice Cut, Ice Shard) → Lava Spirits + Dragon p1 fire half + Mornox p1 fire summons ✓
- Earth (Iron Slash, Sure Step, Sand Storm) → Dragon p1 wind ... wait, no wind enemies. **Earth's home is wind, but no wind enemies in arc.** Earth moves play neutral here. Acceptable for finale (kid has so many options) but flag.
- Wind (Brave Strike, Sand Dash, Drift Step) → Dragon p2 + Mornox p1 magic + Mornox p3 magic ✓
- Magic (Mage Saber/Arcane Slash, Star Dust, Friend's Beacon, Lucky Throw) → Mornox p2 (water form) ✓

---

## 8. Humor + emotional beats

> **Caption rule (DESIGN_LESSONS)**: every dialogue beat ≤8 words, buttons ≤3 words. Even in emotional scenes. Lines below have been split into beats.

### Volcano intro (volcano_intro · scene 1) — Crown
Splits the original "We've done it. We've got all four..." line. Stays snarky-warm-not-somber:
1. "Four down. One to go."
2. "Top of the world, kid."
3. "Lava up there. Don't lick it."

### The big reveal (volcano_crown_reveal · scene 13) — Crown
Voice-acted with **stability bumped 0.5 → 0.75** for slower, lower-energy delivery. Add ~1-second silence between beats. This is the single biggest emotional beat in the game — let it land.
1. "Wait. Before we go up."
2. "I was his teacher, kid."
3. "This crown? It's what's left of me."
4. "He did this. To me."

### Mornox first meeting (volcano_mornox_meet · scene 16) — Mornox pouring tea
1. "Four hundred years I waited."
2. "Tea's a bit old. Sorry."

### Heart-punch (volcano_mornox_listen) — keep as-is
- **James:** *"You were his teacher?"* (then to crown) *"...that makes him your kid, kind of."*
- **Crown:** *"...yeah. It really does."*

### Mornox phase 3 meltdown (volcano_mornox_p3) — keep, optionally add middle beat
1. *"I'M TIRED!"*
2. *"FOUR HUNDRED YEARS!"* ← optional — a number a 7yo latches onto
3. *"LET ME REST!"*

### Listen-path goodbye (volcano_mornox_goodbye) — keep
- **Mornox** (first sun in 400 years): *"Huh. Sun. I'd forgotten."* — best line in the script. Don't touch.

### Ending sign-off (volcano_end · scene 23) — Crown
Splits the original "You did it, kid..." wall:
1. "You did it, kid."
2. "You're the real king now."
3. "Go eat something."
4. "I'll make tea. It'll be awful." *("awful" beats "terrible" for kid vocab)*
5. "I'm a crown. But I'll try."

### Comedy relief in heavy stretch (scenes 9–14)

The 5 consecutive heavy dialogue scenes will tire a 7yo emotionally. Plant micro-laughs:

- **volcano_base** (scene 2): Crown ribs James about packing. *"Did you bring a sword? Good. Pants? Also good."*
- **volcano_dragon_rest** (scene 9): James/Crown beat. *James: "Are you crying?"* *Crown: "Crowns don't cry. We leak."*
- **volcano_empty_floor** (scene 11): James misreads Zephyra's name. *James: "Zeph-eye-ra?"* *Crown: "Zephyra."* *James: "I was close."*
- **volcano_old_mornox** (scene 12): James to the portrait. *James: "He looks like a substitute teacher."* (Beats the kid breathing room before the big reveal in #13.)
- **volcano_door** (scene 14): kettle whistles offstage. *James: "Is that... tea?"* *Crown: "Oh no."*

---

## 9. Content to author

- `data/quests/volcano.js` — **23-scene finale** (was 22 — the new pre-Mornox prep scene per §5 brings it to 23)
- `data/enemies.js` — Lava Spirit, Obsidian Golem, Tempered Dragon (3-phase), **Mornox** (boss with 3 phases OR as a single scaling entity with changing type)
- `data/allies.js` — no new allies (final arc uses existing roster)
- `data/gear.js` — Tier 6 per §6
- `data/treasures.js` — Star of Friendship already defined; verify `addMove: 'friends_beacon'` correct
- `data/moves.js` — Arcane Slash, Phoenix Dash, Star Dust, Friend's Beacon, plus Mornox signature moves per phase
- `data/badges.js` — "True King" (complete game, any ending), "Listen & Learn" (Listen path), "Forgiven" (peaceful ending), "Fully Forged" (all 5 Treasures + Armory upgrade maxed)
- `data/crown-dialogue.js` — massive addition: volcano-specific crown arc, the reveal speech, emotional beats
- `engine/` — may need:
  - Multi-phase battle support (defeat one enemy → immediately summon next phase)
  - Flashback dialogue bg/styling
  - Ending-screen-like credit sequence renderer
  - Mornox special visual: purple/gold flame border in his dialogue frames

---

## 10. Shipping checklist (this one is BIG)

```
□ Arc covers ≥3 types (fire + earth + magic + water via Mornox phase 3)
□ Mixed-type battles throughout — target picker mandatory
□ Every kid-accessible move has a super-effective target SOMEWHERE in the arc
□ Each choice scene has real trade-offs (ash field, tower climb, etc.)
□ Every boss has pre-fight prep (dragon prep + **Mornox prep at the kettle** — Rule 2.3 holds for the finale too)
□ Caption rule honored: every dialogue beat ≤8 words, buttons ≤3 words (see §8 — emotional scenes split into beats, not big walls)
□ Comedy relief planted in scenes 9–14 to keep a 7yo from emotionally tapping out (see §8)
□ Mornox says *out loud* he can't forgive himself in volcano_redemption_ritual (Listen path) — the inner half of the Forgiveness theme
□ Fight ending has NO "you should have listened" line; Crown grieves, doesn't judge
□ Crown reveal scene (volcano_crown_reveal) voice-acted with stability 0.75 + 1-sec inter-beat pad
□ Star of Friendship bonus applied (+4 HP + Friend's Beacon move)
□ Tier 6 gear shipped + Tier 7 Royal post-game unlock framework
□ Listen path unlocked only with ≥3 kindness flags (Rule 2.1 — choices MUST matter)
□ Crown reveal scene (arc-5 exclusive) shipped — pays off 5 arcs of setup
□ Mornox's 3-phase fight works mechanically + narratively
□ Both endings fully authored — Fight (bittersweet) and Listen (redemptive)
□ Epilogue features every named character from all 5 arcs (group photo energy)
□ All speakers in dialogue.js (mornox already added; add flashback voice if used)
□ Captions ≤8 words, buttons ≤3 words — maintain even in emotional scenes
□ Badge: "True King" earned regardless of path
□ Post-game framework: Trophy Hall challenges unlock Royal set
□ Sim test: both endings reach a proper end-state (complete_quest:volcano, full crown, no softlocks)
□ Docs updated: PLOT_BIBLE.md marked "game complete," gear-progression.md Tier 6 shipped
□ **This is the game** — playtest with real 7yo if possible, iterate based on emotional response to ending
```

---

## 11. The hardest authoring question

**Do we let Mornox be genuinely forgivable?**

If Mornox is just a mustache-twirler, the Listen path is empty. But if he's genuinely sympathetic, kids might feel conflicted about the Fight path.

**The answer:** lean sympathetic. Both paths are valid responses to him. A kid who chooses Fight isn't wrong — some people choose a hard ending because it ends. A kid who chooses Listen isn't naïve — they saw the person under the curse. The game shouldn't judge either choice.

Write Mornox like Scrooge or Fezzik — a character who did bad things for understandable reasons, whose ending is earned either way.

**When in doubt, ask:** *would a 7yo feel the weight of this choice?* If yes, you got it right. If the choice feels obvious, rewrite.
