> ⚠️ **HISTORICAL SPEC — NOT CANONICAL.** This document plans a Sirena (Forgotten Mermaid) version of beach that was never built. The shipped beach arc instead features **Drifter the Healer** (see [`../data/quests/beach.js`](../data/quests/beach.js)). Same theme (kindness, Mornox's lying-to-isolate MO), different character. Refer to beach.js for the actual beach lore; refer to [`../PLOT_BIBLE.md`](../PLOT_BIBLE.md) §4 Arc 3 for the canonical summary. This file is preserved for historical context.

---

# Beach Arc — "The Silver Shore"

> Authoring this arc? First read [`../DESIGN_LESSONS.md`](../DESIGN_LESSONS.md), [`../PLOT_BIBLE.md`](../PLOT_BIBLE.md), and [`./gear-progression.md`](./gear-progression.md). Tick the "Quick checklist for shipping a new arc" at the bottom of DESIGN_LESSONS before declaring done.

**Region:** 🏖️ Silver Shore
**Treasure:** 🛡️ Shield of Kindness → unlocks ⚕️ Healing Hall
**Gateway weapon drop:** 🌪️ **Gale Blade** (wind, pwr 11) — kid's first wind weapon
**Target level range:** enter ~Lv 5, exit ~Lv 7
**Estimated length:** ~14–16 min, ~18 scenes
**Arc theme:** *Kindness means looking from the other side.*

---

## 1. Story

A fishing village at the coast. Every few days the tides turn strange. A local kid went swimming a week ago and hasn't come back (safe — it's part of the plot, not horror).

Under the waves lives **Queen Sirena**, the Forgotten Mermaid. Her kingdom was swallowed by a sea-storm **50 years ago**. She blames humans. She's been quietly flooding fishing boats, luring children toward the cliffs, and guarding the Shield of Kindness because "humans don't deserve kindness."

**The twist:** it wasn't humans. When Sirena was young, a wizard (Mornox) came to her kingdom and offered to trade for ancient mer-magic. She refused. He caused the storm in retaliation. She never knew. She's been fighting the wrong enemy for half a century.

The missing kid is alive — Sirena has them safe, believing she's rescuing them from humans.

James must **earn Sirena's trust**, show her evidence of Mornox's role, and help her reclaim her kingdom. Only then does she hand over the Shield.

---

## 2. Plot Bible weave (per PLOT_BIBLE.md §4)

### In-arc Mornox hints
- Early scene: a villager shows James a tattered 50-year-old pamphlet: "Beware the wandering wizard." Faded woodcut of a hooded figure with tired eyes.
- Mid-arc: a clue in an underwater shrine — stone engraving of the storm, showing a wizard's silhouette causing it.
- Climax: when Sirena believes James, Crown voice confirms it: *"That's Mornox's signature. Absolutely."*

### Post-arc Mornox intervention (`beach_outro_mornox`)
- **Trigger:** after reward scene, before castle return
- **Beat:** at the castle, a glass jar appears on the throne. Inside — a royal honeybee, still alive, buzzing calmly.
- **Mornox line:** *"Proof I can still reach inside your walls, little king. I am patient. You are not."*
- **Stakes bump:** crown apologizes, admits the shield of kindness is already restoring calm seas, but notes the fishing village's well has gone dry overnight.

---

## 3. Cast of characters

| Character | Role | Type | Notes |
|---|---|---|---|
| **Queen Sirena** 🧜‍♀️ | Local boss, redeems | 💧 water | Bitter, stately, mistaken. Not evil. Arc climax: she cries for the first time in decades. |
| **Finn the mer-child** 🐠 | New ally | 💧 water | Curious, chatty, loves shiny things. Becomes recruitable ally (water type, scene ability: "swim-breathe" — unlocks underwater options later) |
| **Sea Sprites** 🌀 | Trash enemies | ✨ magic | Weak to 💨 Wind (Blade of Bravery / Gale Blade) |
| **Kelp Wrapped** 🌿 | Trash enemies | 🌿 earth | Animated seaweed. Weak to 🔥 Fire (Spark, Ember Burst). Provides earth variety. |
| **Reef Shark** 🦈 | Mid-boss | 💧 water | Sirena's loyal bodyguard. Fought if kid can't reason with Sirena. |
| **"Missing" village kid (Joon)** 👦 | Rescue target | — | Alive, being "protected" by Sirena. |

---

## 4. Enemy variety (Rule 1.1 compliance)

Beach must include ≥ 3 elemental types:
- ✨ Magic (Sea Sprites — primary)
- 💧 Water (Reef Shark, Sirena)
- 🌿 Earth (Kelp Wrapped — provides variety; Iron Sword / Flame Scimitar-to-be shine here)

Every kid move has a home:
- 💨 Brave Strike (from Mountain treasure) → super vs Sea Sprites (magic)
- ✨ Think Fast (from Forest treasure) → super vs Reef Shark + Sirena (water)
- 🔥 Ember Burst (from Forest) → super vs Kelp Wrapped (earth)
- 🌿 Iron Sword → neutral but reliable

---

## 5. Scene breakdown (~18 scenes)

### Act 1 — The village (3–4 scenes)
1. **beach_intro** (dialogue) — crown briefing. Sea smells salty. A worried fisherman approaches.
2. **beach_village** (choice) — 4 prep options:
   - Buy a Waterbreath Potion at the shop (-30g) → unlocks an underwater-exclusive scene later
   - Talk to the fisherman (free) → flag: knows_storm_history (enables Mornox evidence path)
   - Give the grieving mother a trinket (-15g) → flag: village_friend (late +60g)
   - Sail now (skip prep)
3. **beach_coast_walk** (battle) — two Sea Sprites ambush. Teaches wind-vs-magic (Brave Strike shines).

### Act 2 — Underwater (5–6 scenes)
4. **beach_meet_finn** (choice) — meet Finn the mer-child. 4 recruit paths similar to Foxy/Gus pattern. Shares a crab (-5g), plays a tide-game (-3 HP), riddle (needs Owlette), shove past.
5. **beach_kelp_tunnel** (battle) — Kelp Wrapped × 2 (earth). Fire moves shine.
6. **beach_underwater_shrine** (puzzle) — stone-tile sliding puzzle OR a 3-riddle test about the sea. Reward if solved no-hints: Conch Shell trinket.
7. **beach_mornox_shrine_reveal** (dialogue) — James finds the engraving showing the storm. First solid Mornox evidence.
8. **beach_reef_shark_pre** (choice) — 3 prep options (same pattern as Mountain cave): charge / sneak (Finn-gated) / bribe with shiny.
9. **beach_reef_shark** (battle) — mid-boss, water type. Drops Pearl Armor 50%.

### Act 3 — Sirena's palace (4–5 scenes)
10. **beach_palace_approach** (dialogue) — ominous setup, James sees the kingdom's ruin for the first time.
11. **beach_sirena_meet** (choice) — 4-path moment of truth:
    - ⚔️ Attack (flag: sirena_angry, harder final path, she won't hand over the Shield — must take by force)
    - 👂 Show her the shrine-evidence (needs knows_storm_history flag) → peaceful path
    - 🎁 Offer the Conch Shell (if earned) → she softens
    - 🏃 Flee (loops to palace)
12. **beach_sirena_revelation** (dialogue) — the emotional climax. Sirena sees the truth. Calls for Joon (missing kid). Hands over Shield peacefully.
13. **beach_sirena_fight** (battle, only if attacked) — Sirena + 2 Sea Sprites. Harder. No Shield in reward (just taken by force).
14. **beach_joon_returns** (dialogue) — missing kid returns to village. Emotional beat.
15. **beach_reward** (dialogue) — Shield of Kindness granted, Healing Hall unlocks, trophy (shark statue OR sirena statue based on path).
16. **beach_outro_mornox** (Mornox intervention) — bee-in-jar scene at castle.

---

## 6. Gear drops (Tier 4 per gear-progression.md)

| Piece | Slot | Stats | Drop source |
|---|---|---|---|
| 🌪️ Gale Blade | weapon | +6 ATK, Gale Slash (wind pwr 11) | Sirena boss drop (if fought) OR Finn gift (if peaceful) |
| 🐚 Pearl Armor | armor | +5 DEF +5 HP, Pearl Ward heal+12 | Reef Shark drop 50% |
| 🦪 Conch Shell | trinket | +3 SPD +2 HP, Sonic Boom magic pwr 8 | Shrine puzzle no-hint reward |
| 🩴 Sand Sandals | boots | +5 SPD, Sand Dash wind pwr 8 | Coast walk rare drop OR Finn gift if recruited |
| 🛡️ **Shield of Kindness** (treasure) | — | +5 DEF +3 HP perm + **Kind Ward** (water party heal +15) | Arc reward |

**Loot haul target:** 4–5 new pieces per playthrough.

---

## 7. Balance targets (Rule 9.2 — three archetypes)

**James enters at ~Lv 5**, stats approx: HP 32, ATK 10, DEF 7, SPD 7 (with Mountain gear + treasures).

| Battle | Enemies | Mash-swing win rate | Smart win rate | Perfect win rate |
|---|---|---|---|---|
| Sea Sprite trash | 2× magic | 95% | 100% | 100% (Brave Strike one-shot) |
| Kelp tunnel | 2× earth | 95% | 100% | 100% (Ember Burst one-shot) |
| Reef Shark | 1 water | 60% | 85% | 95% |
| Sirena+Sprites (fight path) | 3 mixed | 40% | 75% | 90% (needs target-picker + type mix) |

---

## 8. Humor beats (tone samples for writer)

**Crown (intro):** *"Beach. Sand in EVERYTHING forever now. Sorry in advance."*
**Finn:** *"Shiny?! Ohmygosh ohmygosh you have SHINY?"*
**Sirena:** *"Humans. Always with the feet. Always with the FEET."*
**James (to Sirena after reveal):** *"He did it to you too? I'm gonna punch that guy. Politely."*
**Crown (bee in jar scene):** *"OKAY. That is — that's new. I did NOT know he could do that."*

---

## 9. Content to author

- `data/quests/beach.js` — scene list (replace one-line stub)
- `data/allies.js` — add **Finn** (water, scene ability swim-breathe)
- `data/enemies.js` — add **Sea Sprite** (magic), **Kelp Wrapped** (earth), **Reef Shark** (water mid-boss), **Queen Sirena** (water boss with redemption arc)
- `data/gear.js` — add Tier 4 pieces from §6
- `data/moves.js` — add Gale Slash, Sonic Boom, Sand Dash, Pearl Ward, and 2-3 boss moves
- `data/badges.js` — "Peacemaker" (peaceful Sirena path), "Deep Diver" (shrine no-hint), "Shiny Hoarder" (all gear pieces collected)
- `data/regions.js` — Beach already defined; verify `primaryEnemyTypes: ['magic','water']` (it is)
- `data/crown-dialogue.js` — add Mornox intervention lines under `context: 'mornox_intervention'` tagged `arc: 3`

---

## 10. Shipping checklist (copy from DESIGN_LESSONS §Quick Checklist)

```
□ Arc covers ≥3 elemental types (magic + water + earth — Kelp Wrapped handles earth)
□ At least one mixed-type battle (Sirena + Sea Sprites: water + magic)
□ Every kid-accessible move has a super-effective target in this arc
□ Each choice scene has ≥2 non-dominated options (4 paths at Finn, 4 at Sirena)
□ Every boss has a pre-fight prep scene (Reef Shark pre + Sirena choice)
□ All new data fields are wired (scroll effects, charm effects already exist)
□ Shield of Kindness grants +5 DEF +3 HP + Kind Ward move on grant_treasure
□ 4–5 new gear pieces, one per slot
□ Treasure's addMove counters NEXT arc (Kind Ward heal supports kid through Desert's harsh HP drain)
□ Tutorial touchpoints: Finn's ability explained, Shield's heal-move explained in Character sheet
□ Character arc has dedicated reveal scene (beach_sirena_revelation)
□ All dialogue grepped clean of stale type references
□ All speakers added to dialogue.js speakerDisplay (Sirena, Finn, Joon)
□ Captions ≤8 words, buttons ≤3 words
□ Missable content recoverable at castle (Finn via Pompadour)
□ ≥3 gold-sink options in the arc (Waterbreath Potion, village mother gift, Reef Shark bribe if added)
□ Sim script passes: refs + effect types + enemy math
□ Boss balanced against 3 archetypes
□ Mornox in-arc hint + outro intervention both present (Rule 6.5)
□ Docs updated: gear-progression.md Tier 4 marked shipped, PLOT_BIBLE.md arc 3 status checked
```
