# Repository artifacts policy (normative)

This document defines what may exist locally vs what may be tracked in git.

## Definitions

-   Tracked: a file returned by `git ls-files`.
-   Local output: generated during development/build but not tracked (gitignored).

## Rules

### 1) Build outputs

-   `dist/` is build output and MUST NOT be tracked.
-   Local `dist/` may exist during development.
-   Changes under `dist/` MUST NOT be committed.

### 2) Generated code

-   OpenAPI-generated types under `packages/api/src/generated/` are tracked and enforced.
-   Developers MUST NOT manually edit generated files.
-   Any OpenAPI change must be followed by regeneration and `openapi:check`.

### 3) TS-only sources and tooling configs

-   No tracked `.js/.mjs/.cjs` files are allowed in repo sources or tooling configs.
-   Exceptions:
    -   `scripts/eslint-rules/*.js` is allowed for local ESLint autofix rules (ADR 0024).
    -   `eslint.config.js` is allowed for ESLint flat config (ADR 0026).
    -   `web-dev-server.config.mjs` and `apps/*/web-dev-server.config.mjs` are allowed for WDS config (ADR 0047).
-   Additional exceptions require an ADR explicitly authorizing the file(s) and rationale.

### 4) Guardrails scope

-   Guardrails MUST enforce tracked-file policy.
-   Guardrails MUST NOT break local DX by failing due to untracked build output.

## Verification

-   `git ls-files | rg "\\.(js|mjs|cjs)$"` returns no matches outside the allowlist.
-   `yarn openapi:verify` passes.
-   `yarn validate` passes.
