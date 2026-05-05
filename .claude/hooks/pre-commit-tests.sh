#!/usr/bin/env bash
# King James 2 — TDD gate
# Fires before any `git commit` run by Claude Code from inside this project.
# Runs the unit suite, then the QC suite. If either is red, blocks the commit
# with an explanatory message via the PreToolUse JSON-output protocol.
#
# Configured in .claude/settings.local.json under hooks.PreToolUse,
# matcher "Bash", if "Bash(git commit*)".

set -u
PROJECT_ROOT="/e/app_design/king_james2"
cd "$PROJECT_ROOT" || exit 0

emit_deny() {
  local label="$1"
  local body="$2"
  node -e '
    const label = process.argv[1];
    const body = process.argv[2] || "";
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "TDD gate: " + label + " RED — fix before committing.\n\n" + body
      }
    }));
  ' "$label" "$body"
}

UNIT_OUTPUT=$(node tests/run-unit.js 2>&1)
if [ $? -ne 0 ]; then
  emit_deny "unit tests" "$UNIT_OUTPUT"
  exit 0
fi

QC_OUTPUT=$(node tests/qc_suite.js 2>&1)
if [ $? -ne 0 ]; then
  emit_deny "QC suite" "$QC_OUTPUT"
  exit 0
fi

exit 0
