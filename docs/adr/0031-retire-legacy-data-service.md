# ADR 0031: Retire legacy app DataService

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: apps/rankup-spa, repo

## Context

`apps/rankup-spa/lib/data-service/*` contains a legacy API wrapper and mock implementation. It is no longer referenced by the UI and duplicates platform-domain services built on `IRankupApiClient`/`ITournamentService`. Keeping the legacy path adds confusion and risks reintroducing UI `fetch` usage outside the platform layer.

WP-007-05 migrated tournament UI components to use `ITournamentService`, leaving DataService unused.

## Decision

Remove `apps/rankup-spa/lib/data-service/*` from the workspace and treat the platform domain services as the only supported UI access path for API data.

## Constraints

-   UI packages must not call `fetch` directly (ADR 0010/0016).
-   Mock-first development remains mandatory (ADR 0007).
-   OpenAPI remains the source of truth (ADR 0006).

## Consequences

### Positive

-   Eliminates a legacy, unused API layer.
-   Reduces ambiguity for UI data access.
-   Reinforces platform/domain service boundaries.

### Negative / Risks

-   Any hidden consumers of DataService would break (none found via `rg`).
-   Requires updating observed-state docs referencing DataService.

## Alternatives considered

-   Deprecate but keep the directory (still a maintenance hazard).
-   Move DataService into platform (conflicts with the API client/service model).

## Implementation plan

-   [x] Remove `apps/rankup-spa/lib/data-service/*`.
-   [x] Update docs/state references to DataService.
-   [x] Verify `rg -n "data-service" apps/rankup-spa` returns 0.
    -   UI packages = `apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
-   [x] Run `yarn validate` and record evidence.

## Verification

-   Command(s):
    -   `rg -n "data-service" apps/rankup-spa`
    -   UI packages = `apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
    -   `yarn validate`
-   Expected result:
    -   No matches; validation PASS.

## References

-   Docs: `docs/work/epics/007-workspace-archetype-alignment.md`
