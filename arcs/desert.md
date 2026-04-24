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
| **Mirage Wisps** 💧 | Trash enemies | 💧 water (illusions of water — desert mirages) | Weak to ✨ magic — gives Brave Strike, Think Fast, AND Lucky Throw a SE home (Rule 1.2) |
| **Sand Dervish** 🌪️ | Mid-boss | 💨 wind | Weak to 🌿 Earth (Iron Sword moment) — third elemental type in the arc |

---

## 4. Enemy variety (Rule 1.1 compliance)

Desert covers 4 element types. Primary is fire, but:
- 🔥 Fire (Sun Wisps, Sand Dragon) — primary
- 🌿 Earth (Dune Scorpions) — kid uses fire moves
- 💧 Water (Mirage Wisps — desert "water" illusions) — kid uses magic moves
- 💨 Wind (Sand Dervish mid-boss) — kid uses earth moves

Every kid move has a home (Rule 1.2 — verified against `data/moves.js` types):
- 💧 Frost Fang Sword / Ice Cut (water) → Sun Wisps + Sand Dragon (SUPER)
- 🔥 Spark / Ember Burst (fire) → Dune Scorpions (SUPER)
- 🌿 Iron Sword / Swing (earth) → Sand Dervish (SUPER)
- ✨ Brave Strike (magic — Mountain treasure) → Mirage Wisps (SUPER)
- ✨ Think Fast (magic — Forest treasure) → Mirage Wisps (SUPER)
- ✨ Lucky Throw (magic — Foxy ally) → Mirage Wisps (SUPER)

---

## 5. Scene breakdown (~18 scenes)

### Act 1 — Approach (3 scenes)
1. **desert_intro** (dialogue) — crown briefing. Sun is a killer. Sand in everything.
2. **desert_oasis** (choice) — small oasis; 4 prep options:
   - Buy a Waterskin (-25g) → heals 10 HP once per battle (new consumable)
   - Fill canteen at spring (free) → flag: canteen_ready, partial heal later
   - Give a stranger bread (-10g) → flag: oasis_friend, late payoff
   - Push on (skip)
3. **desert_scorpions** (battle) — 1 Dune Scorpion (earth) + 1 Mirage Wisp (water). **Mixed-type, target picker required** (Rule 1.3). Ember Burst on the scorpion, Think Fast / Brave Strike on the mirage. Teaches "pick your shot in the desert."

### Act 2 — Meet Zephyra (5 scenes)
4. **desert_tent** (choice) — approach Zephyra's tent. 4 paths:
   - Knock politely → peaceful talk
   - Peek through the flap → flag: rude_start (Zephyra cooler initially)
   - Call out her name → she steps out, impressed at manners
   - Burst in → she zaps you (-5 HP) but respects the audacity
5. **desert_zephyra_meet** (dialogue) — she studies James. Says something cryptic about "a certain wizard."
6. **desert_zephyra_task** (choice) — she asks for help. 3 paths (no looping option — Rule 2.1):
   - Help her fix the sun-shield (-1 HP from heat) → flag: `first_alliance` (also unlocks Zephyra-buff at Dervish prep AND Zephyra-joins at Dragon prep)
   - Barter (offer -20g for the Fire directly) → she laughs and refuses; you keep the gold lesson but no flag
   - Press on without her → she shrugs, you head out solo; flag: `mark_met_ally: zephyra` so Pompadour can recruit her post-arc (per §10 missable-content rule)
7. **desert_dervish_pre** (choice) — pre-fight prep vs Sand Dervish:
   - Charge in
   - Zephyra buffs you (needs helped her) → +10 heal before fight
   - Buy a wind-shield scroll (-20g) → +8 heal
8. **desert_dervish_fight** (battle) — Sand Dervish (wind mid-boss). Earth moves super. Drops Sand Sandals OR Desert Plate.

### Act 3 — Shrine and Dragon (5–6 scenes)
9. **desert_shrine_reveal** (dialogue) — James finds Mornox's old spellbook. Reads a page. Looks at Zephyra. She sees the look and sits down.
10. **desert_zephyra_flashback** (dialogue, flashback scene type) — SPECIAL. Dream sequence showing young Mornox + Zephyra training. Key reveal: she tried to help him. She still cares.
11. **desert_mornox_appears** (dialogue) — Mornox's first on-screen moment. **Stage as a 5-beat scene** so the moment lands:
    1. *(Narrator)* "The torch goes out. The wind stops. The sand holds its breath."
    2. *(Mornox arrives — silent. Just stands there. Beat is just an image.)*
    3. *(Zephyra, voice cracking)* "...you."
    4. *(Mornox, looking only at Zephyra, not James)* "You're almost done. Good boy. My apprentice sends her regards, I'm sure."
    5. *(Mornox vanishes. Crown, quietly)* "Kid... that was him."

    This is the first time the kid SEES Mornox in 4 arcs of buildup. Make it stop time.
12. **desert_dragon_pre** (choice) — prep for boss:
    - Zephyra joins battle (3-party member swap — needs arc alliance)
    - Fire scroll prep (-1 fire scroll)
    - Charge in
13. **desert_dragon_fight** (battle) — Corrupted Sand Dragon (fire boss) + 1 Sun Wisp. Hard. Water moves needed.

### Act 4 — Reward + reflection + intervention (3 scenes)
14. **desert_reward** (dialogue) — Fire of Courage granted. Forge room unlocks. Zephyra offers to come help at the castle. James accepts.
15. **desert_mornox_aftermath** (dialogue) — back at the shrine entrance, sand still settling. Crown and James process what they saw. Suggested beats:
    1. *(James)* "He looked... tired."
    2. *(Crown)* "He IS tired. That's the part that's getting harder, kid. He's not a monster in a tower. He's just an old man who's been awake too long."
    3. *(James)* "...is he gonna be at the next one?"
    4. *(Crown)* "Yeah. He will. And we still have to stop him."
    5. *(Zephyra, joining)* "But you don't have to do it the way he expects."

    *Why this scene exists: gives the kid a breath to process the first on-screen Mornox moment. Without it, Act 4 jumps straight from "you got the treasure" to "creepy castle outro," skipping the emotional weight (Rule 4.x — pacing).*
16. **desert_outro_mornox** (Mornox intervention) — torch-dim scene at castle. Mornox's tiredness showing.

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
| Scorpion + Mirage | 1 earth + 1 water | 80% | 95% | 100% (Ember Burst on scorpion, Brave Strike on mirage) |
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

- `data/quests/desert.js` — scene list (~19 scenes — 18 plus the new `desert_mornox_aftermath`), replace stub
- `data/allies.js` — add **Zephyra** (magic, high-level support; maybe not bringable to Volcano for narrative reasons — she stays at castle aiding)
- `data/enemies.js` — add Sun Wisp, Dune Scorpion, **Mirage Wisp (water)**, Sand Dervish (wind mid-boss), Corrupted Sand Dragon (fire boss)
- `data/gear.js` — Tier 5 per §6
- `data/moves.js` — Flame Cut, Sand Storm, Sun Burst, Mirage Dash, Courage Burst, dragon's signature move, **Mirage Wisp signature (water-type, e.g. `mirage_splash` pwr 6)**
- `data/badges.js` — "First Alliance" (recruit Zephyra), "Dragon Slayer", "Hope in the Dust"
- `data/crown-dialogue.js` — Mornox intervention tagged `arc: 4`
- `engine/ui/dialogue.js` — **add `zephyra: '🧙‍♀️ Zephyra'` to `speakerDisplay()` (line ~73)** — without this, every Zephyra beat renders blank.
- **OPTIONAL engine work:** flashback scene type (dialogue with sepia-tone bg); can be simulated by reusing dialogue type + custom `bg: 'flashback'` CSS class

### Flag wiring contract (cross-arc)

| Flag | Set by | Read by | Purpose |
|---|---|---|---|
| `oasis_friend` | `desert_oasis` "give bread" choice | later desert scenes (oasis stranger payoff) | Local arc reward |
| `canteen_ready` | `desert_oasis` "fill canteen" choice | dervish/dragon prep scenes | Mid-arc heal availability |
| `rude_start` | `desert_tent` "peek" choice | `desert_zephyra_meet` flavor branching | Tone variation only |
| **`first_alliance`** | `desert_zephyra_task` "Help her fix the sun-shield" choice | (1) `desert_dervish_pre` (Zephyra-buff option), (2) `desert_dragon_pre` (Zephyra-joins option), **(3) Volcano `volcano_mornox_meet` (Listen-path unlock per PLOT_BIBLE.md §2)** | Cross-arc kindness flag |
| `mark_met_ally: zephyra` | `desert_zephyra_task` "press on without her" choice | Pompadour ally room | Recoverability per §10 missable rule |

**Heat-damage note:** §1 prose mentions sun heat as a threat. The mechanic is implemented as a single -1 HP cost on the "Help fix the sun-shield" choice in `desert_zephyra_task`. There is no recurring tick damage — the engine has no scene-tick effect type, and adding one is out of scope for this arc.

---

## 10. Shipping checklist

```
□ Arc covers ≥3 elemental types (fire + earth + water + wind = 4 here)
□ At least one mixed-type battle (Scorpion + Mirage in Act 1, Dragon + Wisp in Act 3)
□ Every kid-accessible move has a super-effective target in this arc (verified §4 — Mirage Wisps give all 3 magic moves a SE home)
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
□ **Voice pipeline complete — §11 ticked (Zephyra cast, all new MP3s generated, `VOICE_STATUS.md` updated)**
```

---

## 11. Voice pipeline

Every shipped arc ships with audio. Desert adds one new voiced character (Zephyra) plus new lines for 4 existing speakers. Skipping this step means ~80+ lines render silent — unacceptable for parity with Forest/Mountain/Beach.

### Speakers involved

| Speaker | Status | Action |
|---|---|---|
| 👑 Crown | Cast (George — `JBFqnCBsd6RMkjVDRZzb`) | Generate new MP3s |
| 🧒 James | Cast (Gregory — `PzuBz8h2SxBvQ7lnUC44`) | Generate new MP3s |
| 📜 Narrator | Cast (Clara — `8LVfoRdkh4zgjr8v5ObE`) | Generate new MP3s |
| 🧙‍♂️ Mornox | Cast (Dante — `wXvR48IpOq9HACltTmt7`) | Generate new MP3s (first Desert lines) |
| 🧙‍♀️ **Zephyra** | **NOT CAST** | Audition + lock + generate |
| 🐉 Sand Dragon | Not cast — only needed if boss has spoken beats | See below |
| 🦂 Dune Scorpion / ☀️ Sun Wisp / 💧 Mirage Wisp | No dialogue planned | None — trash enemies don't speak |

### Zephyra casting brief

Voice profile target:
- **Age:** ~60–70. Tired. Weary.
- **Energy:** clever, dry, measured. Slight weariness under the wit.
- **Accent:** European (British or Continental) — contrasts with Narrator's warm American.
- **Reference tone:** Judi Dench doing a cranky witch; Professor McGonagall after a hard week.
- **Voice settings:** stability 0.55, similarity 0.85 (slightly more controlled than Crown — she's deliberate, not warm).

Run 2–3 ElevenLabs auditions on lines from `desert_zephyra_meet` and `desert_zephyra_flashback`. Lock the pick in `VOICE_STATUS.md` table before generating.

### Sand Dragon (conditional)

Check quest file on completion: does `desert_dragon_fight` or its intro/outro scenes include `speaker: 'dragon'` beats? (Beach's Sea Serpent had none; Mountain's Papa Yeti had several.)
- **If yes:** audition an ancient-beast voice (similar profile to the already-cast Sea Serpent — Elderbark `2HmIg4yvRgcH2ZDgiwGz` — or lock a new one).
- **If no:** skip. Dragon communicates via battle SFX only.

### Generation + verification

1. After `data/quests/desert.js` is authored + committed, run:
   ```bash
   node scripts/generate_voices.js
   ```
   The script is resume-safe (skips existing files) and writes to `audio/voices/{speaker_id}/{scene_id}_{beat_index}.mp3`.
2. Verify file count matches beat count:
   ```bash
   find audio/voices -name "desert_*.mp3" | wc -l
   ```
   Expected: one file per dialogue beat in the quest. Mismatch means a speaker is missing from the script's speaker map or `dialogue.js` `speakerDisplay()`.
3. Update `VOICE_STATUS.md`:
   - Add Zephyra row to the Locked Picks table with voice ID + settings
   - Update the Dialogue Line Counts table (add desert counts per speaker)
   - Bump the **TOTAL** line count
4. Smoke test: load the game, teleport to `desert_zephyra_meet`, `desert_mornox_appears`, and `desert_mornox_aftermath`. Confirm each beat plays audio within ~0.5s of tapping Next. Mute button stops playback immediately.

### Expected scope

Rough estimate based on ~19 scenes at ~4–6 beats each, weighted by speaker distribution:
- Zephyra: ~35–45 lines
- Crown: ~25–30 lines
- James: ~15–20 lines
- Narrator: ~5–10 lines
- Mornox: ~7 lines (5 in appears + 2 in outro)

**Target: ~80–110 new MP3s.** At current ElevenLabs Turbo v2.5 throughput, generation is ~1–2 minutes for the full batch.

### Failure mode

Missing speaker in `speakerDisplay()` → dialogue box shows blank name, and voice plays (file is by speaker ID, not display name). Missing audio file → silent beat, no crash (`a.play().catch(() => {})` handles it in `engine/audio.js`). Missing `zephyra` mapping in `scripts/generate_voices.js` speaker list → her lines skipped during generation entirely. All three must be checked before calling the arc shipped.
