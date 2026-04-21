# Voice System — Status & Handoff

**Last updated:** April 21, 2026
**ElevenLabs API Key:** sk_111111822a9879bd2a381eb8271a551f7a54e62a058945f0
**Model:** eleven_turbo_v2_5

## Voice Casting — Locked Picks

| Character | Voice | Voice ID | Notes |
|-----------|-------|----------|-------|
| 👑 The Crown | George - Warm British Storyteller | JBFqnCBsd6RMkjVDRZzb | Premade. Snarky mentor. Warm but exasperated. |
| 📜 Narrator | Morgan - Deep Storyteller Pro | SAxJUlDKRc79XAyeWyMu | Professional. Warm storybook narrator. |

## Voice Casting — Awaiting Pick

Jon listened to auditions. Needs to pick from round 2:

### 🧒 James (excitable boy king)
Test line: "Easy! Step one: stab things. Step two: WIN! I am a GENIUS."
- **Option 4:** Charlie UK (young British) — voice_id: `yJSTU8D97YocC6Dqg20L`
- **Option 5:** Justin (friendly youthful American) — voice_id: `mBqbvkxIFe5HjjaoiN4P`
- **Option 6:** Dev (cute, energetic) — voice_id: `5J8HNhWkTAhN2YWsd9Ta`

### 🧙‍♂️ Mornox (ancient cursed wizard villain)
Test line: "Keep going, little king. Every Treasure you pick up saves me walking to it."
- **Option 4:** Jessie - Vintage Narrator (raspy old-timer) — voice_id: `KgUSWQPFmuiZ5ycRbnty`
- **Option 5:** Darkness (suspense/scary, deep menacing) — voice_id: `yftckXjSEXI25jG6Ead9`
- **Option 6:** Smoke the Dragon (British, commanding) — voice_id: `xsiB5fGhEtknnqzudCO6`

## Still Need Auditions

Supporting cast — generate 2-3 options each using the same API key + model:

| Character | Voice Direction | Appears In |
|-----------|----------------|------------|
| 🦊 Foxy | Quick, sharp, slightly raspy | Forest, Beach |
| 🐸 Ribbit | Deep silly croak, comic relief | Forest |
| 🦉 Owlette | Gentle, wise, deadpan dad-jokes | Forest |
| 🐐 Gus | Gruff, stubborn, older | Mountain |
| 🦍❄️ Papa Yeti | Deep, slow, emotional, broken speech | Mountain |
| 👻 Glimmer (Wraith) | Echoey, soft, melancholic | Mountain |
| 🧔‍♂️ Sir Frostbeard | Rough, working-class | Mountain |
| 💅 Dame Pompadour | Over-the-top dramatic, flamboyant | Castle (all arcs) |
| 🧜‍♀️ Queen Sirena | Regal, cold, cracks emotionally at climax | Beach |
| 🦦 Finn | Upbeat, chattery, young | Beach |
| 👦 Joon | Small, scared, relieved | Beach |
| 🧙‍♀️ Drifter | Quiet, hesitant, hurt | Beach |

## Dialogue Line Counts (approximate)

| Character | Lines | Priority |
|-----------|-------|----------|
| Crown | ~96 | HIGH — most dialogue in game |
| Narrator | ~38 | HIGH |
| James | ~43 | HIGH |
| Mornox | ~12 | HIGH — few lines but critical moments |
| Foxy | ~12 | Medium |
| Gus | ~4 | Medium |
| Papa Yeti | ~7 | Medium |
| Glimmer | ~8 | Medium |
| Sirena | ~10 | Medium |
| Finn | ~6 | Medium |
| Drifter | ~8 | Medium |
| Others | ~15 total | Low (Ribbit, Owlette, Frostbeard, Pompadour, Joon) |
| **TOTAL** | **~230+** | |

## Implementation Plan

### Phase 1 — Generate all audio files
- Use ElevenLabs API to generate every dialogue line as individual .mp3
- Save to `audio/voices/{speaker_id}/{scene_id}_{line_index}.mp3`
- Naming convention: `audio/voices/crown/forest_intro_0.mp3`

### Phase 2 — Engine integration
- Add `engine/audio.js` — audio manager that:
  - Preloads audio for upcoming scene
  - Plays clip when dialogue line renders (keyed by speaker + scene + line index)
  - Handles playback queue for multi-line scenes
  - Falls back silently if audio file missing (no crash)
- Add mute/volume toggle to HUD (kid plays at 6am)
- Add `<script src="engine/audio.js"></script>` to index.html

### Phase 3 — Hook into dialogue renderer
- Modify `engine/ui/dialogue.js` to call audio.play() when each line appears
- Auto-advance option: wait for audio to finish before showing "next" prompt

### Phase 4 — Deploy
- Commit audio files + engine changes
- Push to GitHub Pages
- Test on mobile (audio autoplay policies may need a "tap to start" gate)

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
