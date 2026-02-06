# Epic 005: TS-only compliance + toolchain unification (VS Code-grade)

## Goal

Bring the repo into strict compliance with ADR 0005:

-   One toolchain (Yarn 4 via Corepack)
-   TS-only sources and tooling configs (no versioned .js/.mjs/.cjs)
-   Reproducible scripts and guardrails

## Why

Drift accumulates structurally, not functionally. Fixing toolchain and TS-only policy early prevents long-lived debt and inconsistent agent behavior.

## Checklist

### A) Unify root scripts (Yarn-only)

-   [x] Replace root `start` to use Yarn workspace (no `npm --workspace`)
-   [x] Replace root `validate` to use Yarn workspace (no `npm --workspace`)
-   [x] Ensure scripts remain compatible with CI
-   [x] Update `docs/state/01-tooling.md` after changes

### B) TS-only tooling configs (no tracked JS/MJS/CJS)

-   [x] Remove or replace `rollup.config.js` (if unused, delete; if used, migrate to TS execution)
-   [x] Remove `web-test-runner.config.mjs` (UI tests are prohibited; if kept for future, requires ADR exception + TS)
-   [x] Allow `web-dev-server.config.mjs` as an explicit TS-only exception (ADR 0047)

### C) TypeScript configs (TS-only)

-   [x] Remove `allowJs` and `checkJs` from `packages/app/tsconfig.json`
-   [x] Ensure `tsconfig` includes only TS sources

### D) Guardrails: tracked-file enforcement

-   [x] Ensure guardrails fail on tracked `.js/.mjs/.cjs` outside allowed generated output policy
-   [x] Ensure guardrails do not fail because of local untracked build output

### E) Agent instructions consistency

-   [x] Update `.github/copilot-instructions.md` to reflect: Yarn 4, TS-only, OpenAPI-first, mock-first, no UI tests, service model

## Verification

-   Commands:
    -   `yarn lint`
    -   `yarn validate`
    -   `git ls-files | rg "\\.(js|mjs|cjs)$"` returns no matches
-   Expected:
    -   All commands pass
    -   No versioned JS/MJS/CJS remains in the repository

## Status

-   Status: Done
-   Evidence: `docs/work/log/2026-01-30.md` (validate + lint + ls-files check recorded)
