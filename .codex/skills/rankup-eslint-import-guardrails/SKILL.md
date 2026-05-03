---
name: "rankup-eslint-import-guardrails"
description: "Add ESLint rules to enforce repo layering (UI cannot import platform instantiation, browser implementations, env, or api-mock). Use late in Epic 002 after migrations to avoid blocking progress."
owner: "rankup"
epic: "002"
wp: "002-06"
---

# WP-002-06: Enforcement — ESLint restrictions

## Objective

Make layering violations hard/impossible by enforcing import boundaries.

## Timing rule (important)

Do this late in Epic 002 (after at least one vertical slice is migrated), otherwise enforcement will block migration work.

## What to enforce

-   UI globs must not import:
    -   `packages/platform/src/instantiation/common/**`
    -   `packages/platform/src/**/browser/**`
    -   env utilities intended for platform only
    -   `@rankup/api-mock`
-   Allowlist: only composition root (or a small wiring module called by it) may import `@rankup/api-mock`.

## Preferred ESLint mechanism

1. If `eslint-plugin-import` is present, prefer `import/no-restricted-paths` zones:

-   target UI directories
-   forbid platform implementation paths

2. Use `no-restricted-imports` to block `@rankup/api-mock` globally with per-file overrides for allowlisted wiring files.

## Verification

-   `yarn lint` -> PASS (if available)
-   `yarn validate` -> PASS
-   Optional manual negative test (do not commit): add a forbidden import and confirm lint fails.

## Done criteria

-   UI cannot import forbidden layers.
-   Allowlist is minimal and documented.
-   Validation passes.
