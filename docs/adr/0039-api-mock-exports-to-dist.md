# ADR 0039: Api-mock exports map to dist for runtime

-   Status: Superseded by ADR 0047
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, packages/api-mock

## Context

Runtime imports of `@rankup/api-mock` must resolve to compiled JS when running the dev server. The package currently exports `src/*.ts`, which leads the dev server to request TypeScript files from `node_modules` (and, in some environments, malformed paths like `/node_modules/node_modules/...`). This breaks buildless dev and conflicts with the TS-only source policy (ADR 0005), which relies on `dist/**` for runtime artifacts.

**Superseded:** The Apibase-style pipeline serves TS sources directly via WDS+esbuild, and `@rankup/api-mock` now exports source files.

## Decision

Point `@rankup/api-mock` package exports at `dist/**` outputs instead of `src/**`.

## Constraints

-   Preserve TS-only sources (ADR 0005).
-   Mock-first remains mandatory (ADR 0007).

## Consequences

### Positive

-   Dev server resolves `@rankup/api-mock` deep imports to compiled JS.
-   Avoids serving TypeScript from `node_modules`.

### Negative / Risks

-   Requires workspace build (`yarn validate` or `tsc -b packages/api-mock`) before running the app.

## Implementation plan

-   [x] Update `packages/api-mock/package.json` exports to `dist/**`.
-   [x] Update ADR index.
-   [x] Update work tracking (CURRENT + epic + daily log).
-   [x] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0005: vNext baseline (TS-only sources)
-   ADR 0030: Workspace build validation
