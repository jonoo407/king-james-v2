# Voice System — Status & Handoff

**Last updated:** April 24, 2026 — Desert arc written (Zephyra casting pending, ~109 new lines awaiting generation)
**ElevenLabs API Key:** sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0
**Model:** eleven_turbo_v2_5

## Voice Casting — Locked Picks (Complete)

| Character | Voice | Voice ID | Notes |
|-----------|-------|----------|-------|
| 👑 The Crown | George - Warm British Storyteller | JBFqnCBsd6RMkjVDRZzb | Premade. Snarky mentor. Warm but exasperated. |
| 📜 Narrator | Clara - Calm, Distinctive, and Narrative | 8LVfoRdkh4zgjr8v5ObE | Warm American woman. Storybook narrator. |
| 🧒 James | Gregory - Tech Reviewer | PzuBz8h2SxBvQ7lnUC44 | Excitable boy king. Energetic, goofy. |
| 🧙‍♂️ Mornox | Dante - Growly and Menacing Monster | wXvR48IpOq9HACltTmt7 | Ancient cursed villain. stability 0.7, similarity 0.88. |
| 🦊 Foxy | Yee - Nasal, Witty and Sharp | 1Z7qQDyqapTm8qBfJx6e | Quick, sharp, slightly raspy. |
| 🐸 Ribbit | Constantino | ApsbCjXt5HguctE80a0i | Deep silly croak, comic relief. |
| 🦉 Owlette | Ms. Harris - Caring Southern Mom | u0REnIJvUgcGQYW2Ux8K | Gentle, wise, deadpan dad-jokes. |
| 🐐 Gus | Georg - Funny and Emotional | LRpNiUBlcqgIsKUzcrlN | Gruff, stubborn, older. |
| 🦍❄️ Papa Yeti | Brian - Deep, Resonant & Comforting | nPczCjzI2devNBz1zQrb | Premade. Deep, slow, emotional, broken speech. |
| 👻 Glimmer (Wraith) | Lily - Velvety Actress | pFZP5JQG7iQjIQuC4Bku | Premade. Echoey, soft, melancholic. British. |
| 🧔‍♂️ Sir Frostbeard | Jayce - Bassy, Raspy and Rough | dAcds2QMcvmv86jQMC3Y | Rough, working-class. |
| 💅 Dame Pompadour | Eleonore - Mature Female Narrator | 8SdTD5IMgFKT1jp7JbPC | Over-the-top dramatic, flamboyant. |
| 🧜‍♀️ Queen Sirena | Kristen - Cold Evil Queen Villain | Qbw4VpyUrHEG7NigKzty | Regal, cold, cracks emotionally at climax. |
| 🦦 Finn | Alex - Upbeat, Energetic and Clear | yl2ZDV1MzN4HbQJbMihG | Upbeat, chattery, young. |
| 👦 Joon | Harry - Fierce Warrior | SOYHLrjzK2X1ezoPC6cr | Premade. Small, scared, relieved. |
| 🧙‍♀️ Drifter | Sarah - Mature, Reassuring | EXAVITQu4vr4xnSDxMaL | Premade. Quiet, hesitant, hurt. American woman. |
| 🧌 Hoarder Troll | Gregory Grumble - Old Lovable Bedtime Bear | 8TMmdpPgqHKvDOGYP2lN | Grumpy, whiny older male. |
| 🐺 Briar Wolf | Dracon - Feral, Demonic & Dangerous | A921zklid24OpyVy1Elb | Alpha predator, menacing. |
| 👺 Goblin Scout | Sean - Squeaky Voice | 4NJLA7OQNVkeKe4jVdHw | Cowardly high-pitched bully. |
| 🐉 Sea Serpent | Elderbark - Rooted and Deep | 2HmIg4yvRgcH2ZDgiwGz | Ancient, minimal speech. |
| 🦀 Tide Crab | Poe - Angry and Irritable Villain | KLZOWyG48RjZkAAjuM89 | Territorial, agitated. |
| 🧚 Forest Sprite | Lumi - Tiny & Sweet | AVYJxaX5Uon5HKPfdVo9 | Mischievous fairy. |
| 🧙‍♀️ **Zephyra** | **PENDING** — run `scripts/audition_zephyra.js`, pick, add to VOICES map | — | British/Continental mature female, weary + dry. Suggested settings stab 0.55 / sim 0.85. |

## Dialogue Line Counts (exact, from parsed quest files)

| Character | Speaker ID | Lines | Arc(s) |
|-----------|-----------|-------|--------|
| Crown | `crown` | 97 | all |
| James | `james` | 58 | all |
| Narrator | `narrator` | 52 | all |
| Foxy | `foxy` | 16 | forest, mountain, beach |
| Drifter | `drifter` | 10 | beach |
| Yeti | `yeti` | 10 | mountain |
| Mornox | `mornox` | 11 | forest, mountain, beach |
| Finn | `finn` | 7 | beach |
| Wraith (Glimmer) | `wraith` | 7 | mountain |
| Ribbit | `ribbit` | 6 | forest, mountain |
| Gus | `gus` | 4 | mountain |
| Owlette | `owlette` | 3 | mountain |
| Frostbeard | `frostbeard` | 2 | mountain |
| **Zephyra** | `zephyra` | **29** (new, unvoiced) | desert |
| **TOTAL (existing + desert)** | | **283 existing + 109 new desert = 392** | |

### Desert arc line counts (new — generate after casting Zephyra)

| Speaker | Desert lines |
|---|---|
| zephyra | 29 |
| narrator | 28 |
| crown | 25 |
| james | 24 |
| mornox | 3 |
| **Desert total** | **109** |

*Note: Sirena, Joon, Pompadour cast but have no dialogue in current quest files (Volcano arc not yet written).*

## Implementation Plan

### ✅ Phase 0 — Voice casting COMPLETE
All 22 characters cast. See Locked Picks table above.

### ✅ Phase 1 — Generate all audio files (COMPLETE)
- Script: `scripts/generate_voices.js`
- Output: `audio/voices/{speaker_id}/{scene_id}_{beat_index}.mp3`
- Example: `audio/voices/crown/forest_intro_0.mp3`
- Arcs covered: intro, forest, mountain, beach (283 lines)
- Resume-safe: skips files that already exist
- Run: `node scripts/generate_voices.js`

### ✅ Phase 2 & 3 — Engine integration + dialogue hook (COMPLETE)
- Extended `engine/audio.js`: `KJ.Audio.voice(speaker, sceneId, beatIndex)` plays the clip, `KJ.Audio.toggleVoice()` mutes/unmutes
- `engine/ui/dialogue.js`: calls `KJ.Audio.voice()` on every beat in `showBeat()`
- `engine/ui/hud.js`: 🔊/🔇 mute button added to HUD right-side

### Phase 4 — Deploy
- Commit audio files + engine changes
- Push to GitHub Pages
- Test on mobile (audio autoplay policies need a "tap to start" gate on first interaction)

## ElevenLabs API Usage Notes

- Endpoint: `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- Headers: `xi-api-key`, `Content-Type: application/json`
- Body: `{"text": "...", "model_id": "eleven_turbo_v2_5", "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}}`
- Response: raw mp3 bytes
- Voice settings per character type:
  - Crown/Narrator: stability 0.5-0.6, similarity 0.8 (natural variation)
  - James: stability 0.35-0.4, similarity 0.7 (more expressive/wild)
  - Mornox: stability 0.7, similarity 0.85-0.9 (controlled, menacing)
  - NPCs: stability 0.5, similarity 0.8 (default)

## Bug Notes

- Beach arc had sync issues between local git and remote. Always `git fetch origin main && git reset --hard origin/main` before making changes.
- Code sessions write to worktree branches by default — changes must be pushed to origin/main to appear on GitHub Pages.
