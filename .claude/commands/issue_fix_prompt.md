---
description: "Fix a bug from a GitHub issue — minimal, focused, tested"
---

# Issue Fix: $ARGUMENTS

## Step 1: Understand the Issue

Read the full issue thread — the original report and all follow-up comments.
Extract:
- What the user expected to happen
- What actually happened (error messages, screenshots, broken behaviour)
- Steps to reproduce (if provided)
- Which part of the product is affected

## Step 2: Root Cause Analysis

- **Search**: Use ripgrep to find error messages, function names, and
  relevant patterns in the codebase
- **Trace**: Follow the execution path from the entry point (router →
  service → repository, or component → hook → API call)
- **Diagnose**: Identify the actual root cause, not just symptoms
  - Logic error? Type mismatch? Missing error handling?
  - Async/await issue? Race condition? State management?
  - Wrong query? Missing migration? Stale cache?
  - Broken integration? API contract change?

## Step 3: Minimal Fix

- Fix ONLY the root cause — resist the urge to refactor
- Follow existing patterns in the codebase (check similar files)
- Check for side effects (`rg "function_name"` to find callers)
- If the fix seems too invasive, document why and propose alternatives

## Step 4: Regression Test

Write a test that:
- Reproduces the bug (would have failed before the fix)
- Passes with the fix applied
- Lives in the appropriate test directory
- Follows existing test patterns

## Step 5: Validate

Run these commands to confirm nothing is broken:

```bash
# TODO: Replace with your lint and test commands
# [YOUR_LINT_COMMAND]   e.g. npm run lint, ruff check ., go vet
# [YOUR_TEST_COMMAND]   e.g. npm test, pytest -m unit, go test ./...
```

Fix any failures before proceeding.

## Decision Points

- **Don't fix if**: Needs product decision, requires major refactoring,
  or changes core architecture
- **Document blockers**: If something prevents a complete fix, explain
  what is blocking and why
- **Keep it minimal**: Fix the bug, add the regression test, move on
