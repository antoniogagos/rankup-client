# ADR 0040: Dev-server normalizes duplicate node_modules paths

-   Status: Superseded by ADR 0047
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, apps/rankup-spa

## Context

Some dev-server resolutions emit URLs like `/node_modules/node_modules/...` for workspace dependencies. These paths do not exist on disk, causing 404s for runtime imports (for example, `@rankup/api-mock/dist/index.js`) and aborting dynamic module loading.

**Superseded:** The Apibase-style WDS setup resolves workspace packages via node-resolve and outside-root handling, removing the need for duplicate node_modules normalization.

## Decision

Normalize duplicate `/node_modules/node_modules/` segments in the dev-server rewrite middleware before applying workspace/package rewrites.

## Constraints

-   Keep TS-only sources (ADR 0005).
-   Preserve mock-first development (ADR 0007).

## Consequences

### Positive

-   Eliminates 404s caused by duplicated node_modules URL paths.
-   Keeps the dev-server rewrite deterministic for workspace packages.

### Negative / Risks

-   None expected; normalization is scoped to exact duplicate segments.

## Implementation plan

-   [x] Normalize duplicate `node_modules` segments in `apps/rankup-spa/web-dev-server.config.mjs`.
-   [x] Update ADR index.
-   [x] Update work tracking (CURRENT + epic + daily log).
-   [x] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0005: vNext baseline (modern toolchain, TS-only sources)
-   ADR 0037: Platform exports + env.json.example copy for dev-server stability
-   ADR 0039: Api-mock exports map to dist for runtime
