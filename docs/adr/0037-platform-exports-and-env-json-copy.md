# ADR 0037: Platform exports + env.json.example copy for dev-server stability

-   Status: Superseded by ADR 0047
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, packages/platform, dev-server

## Context

Runtime imports like `@rankup/platform/environment/browser/env.js` must resolve to built JS during dev-server usage. Without package exports, deep imports resolve against the package root and fail because files only exist under `dist/**`. Additionally, the environment module imports `env.json.example`; when dev-server resolves to `dist/**`, the JSON file may not exist in `dist/`, causing 404s at runtime.

**Superseded:** Apibase-style dev now serves TS sources directly via WDS+esbuild, and exports map to `src/**` without copying `env.json.example` into `dist/**`.

## Decision

-   Add `exports` to `@rankup/platform` so deep imports resolve to `dist/**`.
-   Copy `packages/platform/env.json.example` into `packages/platform/dist/` after workspace builds.

## Constraints

-   Keep TypeScript-only sources (ADR 0005).
-   Preserve mock-first flow (ADR 0007).
-   Composition root remains the only selector of implementations (ADR 0016).

## Consequences

### Positive

-   Dev-server resolves deep platform imports consistently.
-   `env.json.example` is present alongside compiled output, preventing 404s.
-   CI runs get deterministic artifacts without manual steps.

### Negative / Risks

-   Adds a small post-build copy step to the workspace build flow.

## Implementation plan

-   [x] Add `exports` mapping to `packages/platform/package.json`.
-   [x] Add a copy script and run it after `typecheck:workspace`.
-   [x] Update ADR index.
-   [x] Record evidence in work log.
-   [x] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0027: Platform package extraction
-   ADR 0030: Validate builds workspace deps
