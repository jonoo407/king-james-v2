# Desert Arc — Status & Pick-Up Doc

**Branch:** `claude/review-project-planning-mR46N` (pushed to origin)
**Last session:** April 24, 2026
**Status:** Quest fully playable end-to-end in silent mode. Blocked on voice generation (needs network access to ElevenLabs).

---

## Current state

### ✅ Done

**Spec review + edits** — `arcs/desert.md` revised:
- Fixed `desert_zephyra_task` refuse-loop (Rule 2.1)
- Added Mirage Wisps (water) so magic moves have a SE home (Rule 1.2)
- Expanded `desert_mornox_appears` from 1 line to a 5-beat moment
- Added `desert_mornox_aftermath` scene for post-Mornox breath
- Reconciled Fire of Courage stats (+3 ATK, treasures.js + spec agree)
- Documented `first_alliance` flag contract for Volcano Listen path
- Added §11 Voice Pipeline section

**Foundation data** (commit `4cdad55`):
- `data/moves.js` — 9 new moves (4 gear, 1 treasure, 1 ally, 3 enemy)
- `data/enemies.js` — 5 new enemies (Sun Wisp, Dune Scorpion, Mirage Wisp, Sand Dervish, Corrupted Sand Dragon)
- `data/gear.js` — Tier 5 (Flame Scimitar, Desert Plate, Sun Gem, Dune Runners)
- `data/allies.js` — Zephyra the Sun-Witch
- `data/badges.js` — First Alliance, Dragon Slayer, Hope in the Dust
- `data/treasures.js` — Fire of Courage now correctly grants `addMove: 'courage_burst'`
- `data/scrolls.js` — Waterskin (+10 heal, 25g)
- `data/crown-dialogue.js` — `castle_general_4` + `saw_mornox` Crown pools
- `engine/ui/dialogue.js` — `zephyra` speaker added
- `scripts/generate_voices.js` — `desert` added to arc load list
- `styles/castle.css` — `kj-bg-flashback` sepia class

**Full quest** (commits `0e2c6fa` → `05ac7d1`):
- `data/quests/desert.js` — 31 scenes across 4 acts (replaced 14-line stub)
- 6 choice scenes, 3 battles, 22 dialogue scenes
- 109 dialogue beats: Zephyra 29, Narrator 28, Crown 25, James 24, Mornox 3
- All transitions verified resolved
- Act 1 tweaks per user direction: James chattier in intro, oasis stranger paid off in Act 2 via `desert_zephyra_recognize`, Crown dry → lighter after `desert_mornox_aftermath`

**Voice infrastructure** (commits `5556547`, `e02f5f8`):
- `scripts/audition_zephyra.js` — searches ElevenLabs for British/European mature female voices, generates 3 audition lines per candidate
- `VOICE_STATUS.md` — Zephyra row marked PENDING; Desert line counts documented; TOTAL bumped to 392

**QC suite:** 58 PASS / 0 FAIL / 0 WARN throughout.

### ⏸ Blocked (need network access to ElevenLabs)

1. **Audition Zephyra** — run locally:
   ```
   node scripts/audition_zephyra.js
   ```
   Outputs to `audio/auditions/zephyra/option_N/line_N.mp3` with `candidates.json` metadata.

2. **Lock the pick** — add chosen voice to `VOICES` map in `scripts/generate_voices.js:19`:
   ```js
   zephyra: { id: '<voice_id>', stability: 0.55, similarity: 0.85 },
   ```
   And update `VOICE_STATUS.md` Locked Picks table (replace the PENDING row).

3. **Generate all 109 new MP3s** — run locally:
   ```
   node scripts/generate_voices.js
   ```
   Resume-safe; skips existing files. Only writes Desert's new beats.

4. **Commit the audio** — `git add audio/voices/` then push.

### Why voice is blocked in my sessions

The Claude Code sandbox blocks outbound HTTPS to external hosts. Hitting `api.elevenlabs.io` returns "Host not in allowlist" — same for shared-voices search, voice info, and TTS endpoints. Every prior voice commit in the repo was made from a session with unrestricted network access (i.e., your local machine running Claude Code, or a cloud box with no allowlist).

---

## Network access — confirmed diagnosis

**The sandbox cannot reach ElevenLabs.** Verified with verbose curl on April 24:

```
> GET /v1/voices HTTP/2
< HTTP/2 403
< x-deny-reason: host_not_allowed
Host not in allowlist
```

The proxy terminates TLS (handshake completes), inspects the destination host, and rejects anything not on its allowlist. Only `github.com` works, and only through a local git proxy at `127.0.0.1:<port>` that's pre-wired for this branch. `api.elevenlabs.io`, `www.google.com`, and `anthropic.com` all return the same 403. `WebFetch` hits the same proxy and returns the same 403.

**This is environment-level enforcement that cannot be overridden from inside the sandbox.** No tool, background agent, or subagent here can reach ElevenLabs.

### What WILL work

1. **Claude Code running on your local machine** — unrestricted network, same repo, same API key in-scripts. Every prior voice commit was done this way. Run `node scripts/audition_zephyra.js` then `node scripts/generate_voices.js` and commit.

2. **A cloud environment where you can pre-authorize `api.elevenlabs.io`** — if Claude Code supports a custom allowlist you control, add that host. If "dispatch br" refers to such an environment, tell me the exact feature name and I'll check for a config file to edit.

### What will NOT work

- Background subagents spawned from this sandbox (same proxy)
- Any tool that makes outbound HTTPS from this sandbox (curl, node https, WebFetch)
- Git-pushing the scripts and expecting anything to run them (the push doesn't execute; no CI is wired for ElevenLabs)

---

## To pick up next session

**Minimum to ship voice:**
1. `node scripts/audition_zephyra.js`
2. Listen to `audio/auditions/zephyra/option_*/line_*.mp3`, pick one
3. Tell me the voice_id (or edit the VOICES map directly)
4. `node scripts/generate_voices.js`
5. `git add audio/voices/ && git commit -m "Desert — generate 109 voice MP3s" && git push`

**To playtest silent first (recommended):**
1. Run `npx http-server -p 8080 --cors` in repo root
2. Open `http://localhost:8080/`
3. In console: `KJ.Scene.goto('desert_intro')` (or beat the Beach arc to unlock it properly)
4. Walk all 31 scenes, flag any dialogue that feels off. Audio is silent until voices are generated — this is fine.

**Possible follow-on work (unblocked):**
- Balance-tune Sand Dragon HP if playtest shows it's too easy/hard (currently 92 HP, spec targeted 45% mash / 75% smart / 90% perfect)
- Start Volcano arc — `first_alliance` is wired, so the Listen-path unlock framework is ready
- Fix the exposed API key (skipped earlier per your call; repo is private, not urgent)

---

## Critical file paths (for quick reference)

- Quest: `data/quests/desert.js` (31 scenes, 425 lines)
- Spec: `arcs/desert.md` (revised)
- Foundation data: `data/{moves,enemies,gear,allies,badges,treasures,scrolls,crown-dialogue}.js`
- Engine: `engine/ui/dialogue.js:73` (zephyra speaker), `styles/castle.css:72` (flashback bg)
- Voice: `scripts/audition_zephyra.js`, `scripts/generate_voices.js`
- Tests: `tests/qc_suite.js:248` (speaker map includes zephyra)

---

## Commits on this branch (this session)

```
e02f5f8 Desert — polish + voice pipeline docs
5556547 Zephyra voice audition script
05ac7d1 Desert Acts 2-4 — full quest playable end-to-end
0e2c6fa Desert Act 1 — intro + oasis (4 choices) + mixed-type scorpion fight
4cdad55 Desert arc — foundation data + engine touches
87150a3 Desert spec — add §11 Voice pipeline section
5e07be4 Desert arc spec — fix design-rule slips and stage Mornox's debut
```
