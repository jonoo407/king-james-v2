# King James 2 — Claude working rules

> **READ BEFORE TOUCHING ANYTHING. The TDD rule is non-negotiable.**

---

## 🔴🟢 HARD RULE — Red/green TDD on every change. No exceptions.

**Every change to engine logic, combat, state shape, scene effects, conditions, badge predicates, registries, or any other behavior:**

1. **Write the failing test FIRST** in `tests/unit/<feature>.test.js`. Use `tests/unit/spark-mana.test.js` as the pattern (it requires `../lib/runner` + `../lib/bootstrap`).
2. **Run it: `node tests/unit/<feature>.test.js`. SEE IT FAIL.** ("red")
3. **Then** write the implementation.
4. **Run it again. SEE IT PASS.** ("green")
5. **Then** commit.

If I'm tempted to skip step 1, I am wrong. There are no shortcuts. Even one-line changes go through this loop.

**Anti-patterns I have already committed (don't repeat them):**
- Adding a `video` field to a scene type without a "scene has video" assertion → caught in retroactive review
- Changing `scroll_fire` to `scroll_waterskin` without a balance-shape test → no regression coverage
- Bumping boss HPs without a "round-count is in spec band" sim → relied on agents to find drift
- Tightening dialogue captions without a `≤8 words` rule test → introduced a 9-word violation that the eventual caption-cap test caught immediately
- Using `accuracy: 0.95` moves in deterministic tests → 10% flake rate, hidden for the whole session, only surfaced when the user asked the right question

**Tests must be deterministic.** No 95%-accuracy moves. No `Math.random()` in test fixtures. If you need a damage hit, use a 1.0-accuracy move (e.g. `think_fast`).

**Content-only changes** (dialogue text, art swaps, voice-clip regen) don't need new unit tests — the QC suite's structural checks (orphan refs, speaker coverage, caption-cap rule, registry integrity) cover them. **But adding new content TYPES** (a new scene type, a new effect, a new condition) IS engine work and needs a failing test first.

**The pre-commit hook** at `.claude/hooks/pre-commit-tests.sh` runs the unit + QC suites before every `git commit` and blocks on red. **It cannot enforce test-first** — only test-passing. The discipline is on me. If I write code first and the tests pass anyway, I have still broken the rule.

**If a behavior is hard to unit-test** (DOM rendering, browser-only state):
- Write the data-shape test that IS reachable
- Verify the rest with the Preview MCP at mobile viewport (375×812) before commit
- Both halves are required. "Tests pass" alone is not enough.

---

## Test commands (memorize these)

```bash
# TDD inner loop — single file
node tests/unit/<feature>.test.js

# Full unit suite (regression)
node tests/run-unit.js

# QC suite (registry integrity, balance sims, edge cases)
node tests/qc_suite.js
```

Both suites must be green to commit. The hook enforces this.

---

## Verify, don't assume (cross-project rule)

Before asserting any fact about this project's state, behavior, or layout: check directly — read the file, run the command, screenshot the page, or ask. Pattern-matching from "what's likely" is exactly how I claimed king_james2 was landscape when it's portrait, and how I claimed the video feature shipped without ever loading it in a browser. Don't repeat those.

---

## Vibe-check agents (run at checkpoints, not per-commit)

Three read-only review agents in `.claude/agents/`:
- **kj-balance-tester** — combat sim, win-rate targets, gold/spark pacing, scroll scaling
- **kj-fun-reader** — dialogue feel through a 7yo lens, voice consistency, caption-cap, suggested rewrites
- **kj-story-keeper** — Plot Bible weave, character continuity, setup/payoff, cross-arc flags

**When to run** (all three in parallel):
- Arc done (e.g., Volcano playable end-to-end)
- Major redesign done (e.g., spark mana system, fuzzy damage)
- Game done
- On demand when the human asks for a vibe pass

**Workflow**: I do the dev pass (with TDD discipline) → invoke the agents → fix the findings (with TDD discipline) → surface to the user. Agents report only; never edit.

If the named agents aren't available in the current session, fall back to `general-purpose` agents with the kj-* system prompts inlined — same review, different routing.

---

## What's where

- `arcs/*.md` — design specs (one per region)
- `data/quests/*.js` — actual quest scenes (one per region)
- `data/{moves,enemies,gear,allies,treasures,traits,badges,scrolls,crown-dialogue}.js` — content catalogs
- `engine/` — stable engine, no content IDs hardcoded
- `engine/ui/*.js` — per-screen renderers
- `tests/qc_suite.js` — regression gate (registry integrity, balance sims, edge cases)
- `tests/unit/*.test.js` — per-feature TDD tests
- `tests/lib/{bootstrap,runner}.js` — shared test infra
- `PLOT_BIBLE.md` — master story weave (read before story changes)
- `DESIGN_LESSONS.md` — every rule we've already learned (read before authoring new content)
- `VOICE_STATUS.md` — locked voice casting and dialogue line counts
- `images/volcano_end.mp4` — the ending video, plays in `volcano_end` scene

---

## Conventions worth preserving

- **Cache-bust `?v=N`** in `index.html` after any asset/script change so phone reloads. Bump the number every commit that touches code or styles.
- **Portrait orientation** — the game is played on phone in portrait (9:16). Test layouts at 375×812 minimum.
- **Don't recommend changes to shipped, kid-tested arcs** (forest/mountain/beach/desert/volcano) without a real regression — those have been play-tested.
- **Voice cards locked**: Crown is snarky-warm-not-mean. James is excitable-not-annoying. Mornox is tired-not-angry. See `VOICE_STATUS.md` for full cast.
- **Caption-cap rule**: every dialogue beat ≤8 words; buttons ≤3 words. The volcano arc's caption-cap test enforces this for volcano.js. Older arcs predate it but the rule applies going forward.
- **Voice gen** is resume-safe: `node scripts/generate_voices.js` skips files that exist. Purge the changed scene's audio before regenerating if you've edited beat text or shifted indices.

---

## Pre-flight checklist before saying "shipped"

For any feature:
- [ ] Failing test written first
- [ ] Test now passes
- [ ] `node tests/run-unit.js` green
- [ ] `node tests/qc_suite.js` green
- [ ] Cache-bust bumped if code/styles touched
- [ ] If UI-related: loaded in Preview MCP at 375×812, click-tested the actual flow
- [ ] If content-related: relevant vibe-check agent run, findings folded back in
- [ ] Committed (hook re-runs the suites as a safety net)
- [ ] Pushed (Pages rebuilds in ~50s)
- [ ] Deployed assets fetch correctly (HTTP 200, expected bytes)

If any box is unchecked, the feature isn't shipped — it's a draft.
