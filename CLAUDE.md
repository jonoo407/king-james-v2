# King James 2 — Claude working rules

## TDD discipline (enforced)

**Any change to engine, combat, state-shape, or registry behavior:**
1. Write a failing unit test first in `tests/unit/<feature>.test.js` (use `tests/unit/spark-mana.test.js` as the pattern — `lib/runner` + `lib/bootstrap`).
2. Watch it fail: `node tests/unit/<feature>.test.js`
3. Write the implementation.
4. Watch it pass.
5. Commit.

**Quest scenes / dialogue / content authoring**: no per-beat unit tests. The QC suite (`tests/qc_suite.js`) covers structural correctness — orphan scene refs, missing speakers, broken transitions, registry integrity.

**Pre-commit gate** (`.claude/hooks/pre-commit-tests.sh`, wired via `.claude/settings.local.json`): every `git commit` runs `node tests/run-unit.js` and `node tests/qc_suite.js`. Either red → commit blocked. The hook can't enforce "test was written first" — that's on us.

Both suites must be green before commit. Never bypass the hook.

## Vibe-check agents (run at checkpoints, not per-commit)

Three read-only review agents in `.claude/agents/`:
- **kj-balance-tester** — combat sim, win-rate targets, gold/spark pacing
- **kj-fun-reader** — dialogue feel through a 7yo lens, voice consistency, suggested rewrites
- **kj-story-keeper** — Plot Bible weave, character continuity, setup/payoff

**When to run** (all three in parallel):
- Arc done (e.g., Volcano playable end-to-end)
- Major redesign done (e.g., spark mana system, fuzzy damage)
- Game done
- On demand when the human asks for a vibe pass

**Workflow**: I do the dev pass → invoke the agents → fix the findings → surface to the user. Agents report only; never edit.

## What's where

- `arcs/*.md` — design specs (one per region)
- `data/quests/*.js` — actual quest scenes (one per region)
- `data/{moves,enemies,gear,allies,treasures,traits,badges,scrolls,crown-dialogue}.js` — content catalogs
- `engine/` — stable engine, no content IDs hardcoded
- `engine/ui/*.js` — per-screen renderers
- `tests/qc_suite.js` — 58-test regression gate (always run before commit)
- `tests/unit/*.test.js` — per-feature TDD tests
- `tests/lib/{bootstrap,runner}.js` — shared test infra
- `PLOT_BIBLE.md` — master story weave (read before story changes)
- `DESIGN_LESSONS.md` — every rule we've already learned (read before authoring new content)
- `VOICE_STATUS.md` — locked voice casting and dialogue line counts

## Conventions worth preserving

- Cache-bust `?v=N` in `index.html` after any asset/script change so phone reloads.
- Don't recommend changes to shipped, kid-tested arcs (forest/mountain/beach/desert) without a real regression — those have been play-tested.
- Crown is snarky-warm-not-mean. James is excitable-not-annoying. Mornox is tired-not-angry.
