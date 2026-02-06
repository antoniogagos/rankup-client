# ADR 0038: Base exports mapping for runtime deep imports

-   Status: Superseded by ADR 0047
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, packages/base

## Context

Runtime imports like `@rankup/base/browser/event.js` must resolve to built JS during dev-server usage. Without package exports, deep imports can fail because files only exist under `dist/**`.

**Superseded:** Apibase-style dev now serves TS sources directly via WDS+esbuild, so exports map to source files instead of `dist/**`.

## Decision

Add `exports` to `@rankup/base` so deep imports resolve to `dist/**`.

## Constraints

-   Keep TypeScript-only sources (ADR 0005).
-   Preserve mock-first flow (ADR 0007).

## Consequences

### Positive

-   Dev-server resolves deep base imports consistently.
-   Runtime uses compiled output without special-case rewrites.

### Negative / Risks

-   None expected; relies on the existing workspace build step.

## Implementation plan

-   [x] Add `exports` mapping to `packages/base/package.json`.
-   [x] Update ADR index.
-   [x] Record evidence in work log.
-   [x] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0025: Base package and event system
-   ADR 0030: Workspace build validation
