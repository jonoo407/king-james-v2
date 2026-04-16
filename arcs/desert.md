# Desert Arc — "The Burning Sands"

> Authoring this arc? First read [`../DESIGN_LESSONS.md`](../DESIGN_LESSONS.md), [`../PLOT_BIBLE.md`](../PLOT_BIBLE.md), and [`./gear-progression.md`](./gear-progression.md). Tick the "Quick checklist for shipping a new arc" at the bottom of DESIGN_LESSONS before declaring done.

**Region:** 🏜️ Sun Desert
**Treasure:** 🔥 Fire of Courage → unlocks 🏟️ Forge (future armory upgrade system)
**Gateway weapon drop:** 🔥 **Flame Scimitar** (fire, pwr 12) — kid's fire weapon
**Target level range:** enter ~Lv 7, exit ~Lv 9
**Estimated length:** ~15–18 min, ~18 scenes
**Arc theme:** *Persistence and hope — don't give up when the path is long.*

---

## 1. Story

A vast desert, scorched by a sun that shouldn't be this hot. At the center, an ancient shrine holds the Fire of Courage. In a tent at the shrine's edge lives **Zephyra the Sun-Witch** — a mysterious woman with tired eyes and a broken staff.

**The twist:** Zephyra is NOT the villain. She is **Mornox's former apprentice** — the only student he ever had. Centuries ago she tried to copy his Crown Steal Spell to help him un-curse himself. It backfired (of course). It scorched the desert, half-killed her, and broke her heart when Mornox abandoned her afterward.

She's been trying to repair his damage for 300 years. She protects the Fire of Courage because she believes only she can safely transfer it.

James meets her wary, suspicious. Over the course of the arc they **work together** — not fight. The "villain" role is played by a **corrupted desert dragon** that Mornox sent to sabotage Zephyra's efforts.

This arc is the first time James has an **adult ally who isn't the Crown**. Zephyra's jadedness balances his impatience. She is what James could grow into if he loses hope.

---

## 2. Plot Bible weave (per PLOT_BIBLE.md §4)

### In-arc Mornox hints
- Meeting Zephyra: she visibly reacts when James mentions "a wizard named Mornox." Doesn't explain yet.
- Mid-arc: an ancient spellbook found in her tent — written in Mornox's hand, annotated by her. James reads it, realizes the connection.
- Zephyra's revelation: at arc's ~¾ mark, she tells James her story. Dream flashback sequence shows young Mornox + young Zephyra training together.

### Mornox appears on-screen for the first time
At the Desert shrine, Mornox's **ghost projection** appears briefly. He doesn't attack. He just watches James + Zephyra together. Says one line:

*"You're almost done. Good boy. My apprentice sends her regards, I'm sure."*

He vanishes. Zephyra is shaken. This is the first time the kid SEES Mornox (not just voice/scroll).

### Post-arc Mornox intervention (`desert_outro_mornox`)
- **Trigger:** after reward, before castle return
- **Beat:** back at castle, torches dim unexpectedly in the throne hall. In the gloom, a faint outline of Mornox stands by the throne for a heartbeat, then gone.
- **Mornox line (quieter, more tired than ever):** *"I've been waiting 400 years. I can wait a week more. I'm so tired, little king."*
- **Stakes bump:** Zephyra sends a letter offering to come to the castle and help. The letter arrives mid-dialogue. Kid feels the kingdom growing alliances against Mornox.

---

## 3. Cast of characters

| Character | Role | Type | Notes |
|---|---|---|---|
| **Zephyra the Sun-Witch** 🧙‍♀️ | Arc's true partner, recruitable | ✨ magic | Old, weary, clever. Stops being suspicious by mid-arc. Recruitable ally (high-level magic support). |
| **Corrupted Sand Dragon** 🐉 | Actual boss | 🔥 fire | Mornox's minion, not Zephyra's. Big dramatic fight. |
| **Sun Wisps** ☀️ | Trash enemies | 🔥 fire | Weak to 💧 Water (Frost Fang Sword MVP) |
| **Dune Scorpions** 🦂 | Trash enemies | 🌿 earth | Weak to 🔥 Fire (your Spark still works) — provides variety |
| **Sand Dervish** 🌪️ | Mid-boss | 💨 wind | Weak to 🌿 Earth (Iron Sword moment) — third elemental type in the arc |

---

## 4. Enemy variety (Rule 1.1 compliance)

Desert must cover ≥ 3 element types. Primary is fire, but:
- 🔥 Fire (Sun Wisps, Sand Dragon) — primary
- 🌿 Earth (Dune Scorpions) — kid uses fire moves
- 💨 Wind (Sand Dervish mid-boss) — kid uses earth moves

Every kid move has a scenario:
- 💧 Frost Fang Sword / Ice Cut → Sun Wisps + Sand Dragon (SUPER)
- 🔥 Spark / Ember Burst → Dune Scorpions (SUPER)
- 🌿 Iron Sword / Swing → Sand Dervish (SUPER)
- 💨 Brave Strike (Mountain treasure) → neutral here, save for next arc
- ✨ Think Fast, Lucky Throw → neutral here, mostly support

---

## 5. Scene breakdown (~18 scenes)

### Act 1 — Approach (3 scenes)
1. **desert_intro** (dialogue) — crown briefing. Sun is a killer. Sand in everything.
2. **desert_oasis** (choice) — small oasis; 4 prep options:
   - Buy a Waterskin (-25g) → heals 10 HP once per battle (new consumable)
   - Fill canteen at spring (free) → flag: canteen_ready, partial heal later
   - Give a stranger bread (-10g) → flag: oasis_friend, late payoff
   - Push on (skip)
3. **desert_scorpions** (battle) — 2 Dune Scorpions (earth). Ember Burst still super. Re-grounds kid in familiar combat.

### Act 2 — Meet Zephyra (5 scenes)
4. **desert_tent** (choice) — approach Zephyra's tent. 4 paths:
   - Knock politely → peaceful talk
   - Peek through the flap → flag: rude_start (Zephyra cooler initially)
   - Call out her name → she steps out, impressed at manners
   - Burst in → she zaps you (-5 HP) but respects the audacity
5. **desert_zephyra_meet** (dialogue) — she studies James. Says something cryptic about "a certain wizard."
6. **desert_zephyra_task** (choice) — she asks for help. 3 paths:
   - Help her fix the sun-shield (takes time, -1 HP from heat)
   - Barter (offer gold -20g for the Fire directly) → she laughs
   - Refuse → she boots you out (loop scene)
7. **desert_dervish_pre** (choice) — pre-fight prep vs Sand Dervish:
   - Charge in
   - Zephyra buffs you (needs helped her) → +10 heal before fight
   - Buy a wind-shield scroll (-20g) → +8 heal
8. **desert_dervish_fight** (battle) — Sand Dervish (wind mid-boss). Earth moves super. Drops Sand Sandals OR Desert Plate.

### Act 3 — Shrine and Dragon (5–6 scenes)
9. **desert_shrine_reveal** (dialogue) — James finds Mornox's old spellbook. Reads a page. Looks at Zephyra. She sees the look and sits down.
10. **desert_zephyra_flashback** (dialogue, flashback scene type) — SPECIAL. Dream sequence showing young Mornox + Zephyra training. Key reveal: she tried to help him. She still cares.
11. **desert_mornox_appears** (dialogue) — Mornox's ghost projection. Watches. Says one line. Vanishes. Both James and Zephyra shaken.
12. **desert_dragon_pre** (choice) — prep for boss:
    - Zephyra joins battle (3-party member swap — needs arc alliance)
    - Fire scroll prep (-1 fire scroll)
    - Charge in
13. **desert_dragon_fight** (battle) — Corrupted Sand Dragon (fire boss) + 1 Sun Wisp. Hard. Water moves needed.

### Act 4 — Reward + intervention (2 scenes)
14. **desert_reward** (dialogue) — Fire of Courage granted. Forge room unlocks. Zephyra offers to come help at the castle. James accepts.
15. **desert_outro_mornox** (Mornox intervention) — torch-dim scene at castle. Mornox's tiredness showing.

---

## 6. Gear drops (Tier 5 per gear-progression.md)

| Piece | Slot | Stats | Drop source |
|---|---|---|---|
| 🔥 Flame Scimitar | weapon | +7 ATK, Flame Cut (fire pwr 12) | Dragon boss drop 50% |
| 🐫 Desert Plate | armor | +6 DEF +5 HP, Sand Storm earth pwr 9 | Dervish drop 50% |
| ☀️ Sun Gem | trinket | +4 HP +3 SPD, Sun Burst magic pwr 9 | Zephyra gift (if full alliance) |
| 🏜️ Dune Runners | boots | +6 SPD, Mirage Dash wind pwr 9 | Dervish alt drop OR oasis_friend payoff |
| 🔥 **Fire of Courage** (treasure) | — | +3 ATK +2 SPD perm + **Courage Burst** (fire pwr 13) | Arc reward |

---

## 7. Balance targets

**James enters at ~Lv 7**, stats approx: HP 42, ATK 13, DEF 9, SPD 8.

| Battle | Enemies | Mash win | Smart win | Perfect |
|---|---|---|---|---|
| Dune Scorpions | 2× earth | 95% | 100% | 100% (Ember Burst) |
| Sand Dervish | 1 wind mid-boss | 60% | 85% | 95% |
| Sand Dragon + Wisp | 2 mixed fire | 45% | 75% | 90% (needs water moves + prep) |

---

## 8. Humor beats

**Crown:** *"Desert. Hot. Sand. You'll find sand in places you didn't know you had. Sorry."*
**Zephyra (first line):** *"A child. At my tent. With a crown. Oh, I am going to have OPINIONS."*
**James (after flashback):** *"So... he was like... kinda okay once? Weird."*
**Zephyra (about Mornox):** *"He was brilliant. That was the problem. Brilliant AND lonely AND impatient. He made a bad bet. I was the last person to love him."*
**Crown (after Mornox's ghost leaves):** *"Okay. Okay. I am NOT okay. But we are NOT stopping. Come on, kid."*

---

## 9. Content to author

- `data/quests/desert.js` — scene list (~18 scenes), replace stub
- `data/allies.js` — add **Zephyra** (magic, high-level support; maybe not bringable to Volcano for narrative reasons — she stays at castle aiding)
- `data/enemies.js` — add Sun Wisp, Dune Scorpion, Sand Dervish (wind mid-boss), Corrupted Sand Dragon (fire boss)
- `data/gear.js` — Tier 5 per §6
- `data/moves.js` — Flame Cut, Sand Storm, Sun Burst, Mirage Dash, Courage Burst, dragon's signature move
- `data/badges.js` — "First Alliance" (recruit Zephyra), "Dragon Slayer", "Hope in the Dust"
- `data/crown-dialogue.js` — Mornox intervention tagged `arc: 4`
- `engine/ui/dialogue.js` — add 'zephyra' to speakerDisplay
- **OPTIONAL engine work:** flashback scene type (dialogue with sepia-tone bg); can be simulated by reusing dialogue type + custom `bg: 'flashback'` CSS class

---

## 10. Shipping checklist

```
□ Arc covers ≥3 elemental types (fire + earth + wind)
□ At least one mixed-type battle (Dragon + Wisp, or add a Scorpion companion)
□ Every kid-accessible move has a super-effective target in this arc
□ Each choice scene has ≥2 non-dominated options
□ Every boss has a pre-fight prep scene (Dervish + Dragon)
□ Fire of Courage grants +3 ATK +2 SPD + Courage Burst (fire pwr 13) — verified vs Volcano earth enemies
□ 4–5 new gear pieces, one per slot
□ Treasure's addMove (Courage Burst) counters NEXT arc's earth enemies (Volcano)
□ Tutorial touchpoints: any new scene types explained by Crown
□ Character arc (Zephyra redemption-with-grace) has dedicated reveal (flashback scene)
□ Dialogue clean of stale type references
□ Speaker zephyra added to dialogue.js
□ Captions ≤8 words, buttons ≤3 words
□ Missable content recoverable (Zephyra recruitable post-arc via Pompadour if skipped somehow)
□ ≥3 gold sinks (Waterskin, stranger bread, scroll, Zephyra barter)
□ Sim passes
□ Boss tri-archetype balanced
□ **Mornox in-arc hint (spellbook reveal) + ghost projection + outro intervention all present** (Rule 6.5)
□ gear-progression.md Tier 5 marked shipped
```
