# ADR 0010: UI does not import API implementations

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

UI packages must remain implementation-agnostic. Allowing UI packages to import runtime API implementations creates hidden coupling, bypasses composition root decisions, and increases the risk of mock leakage or direct network access.

## Decision

-   UI packages (see `docs/architecture/ui-packages.md`) must not import API implementations.
-   UI packages may import types from `@rankup/api` using type-only imports. (Superseded by ADR 0048.)
-   Runtime implementations (mock and HTTP) are only imported in the composition root.

## Constraints

-   No UI tests.

## Consequences

### Positive

-   Clear separation between contract and runtime.
-   Mock and HTTP implementations are confined to the composition root.

### Negative / Risks

-   Requires lint rules and discipline to keep imports clean.

## Implementation plan

-   [ ] Add ESLint overrides to restrict imports in UI packages.
-   [ ] Provide a single composition root for selecting API implementations.

## Implementation update (2026-01-29)

-   ESLint restrictions now also block UI package imports of:
    -   `platform/**/browser/**`
    -   `platform/instantiation/**`
    -   `lib/env` (direct env access)

## Update (2026-02-02)

-   Superseded by ADR 0048: UI packages must no longer import `@rankup/api` at all; use domain DTOs instead.

## Verification

-   `yarn lint`
-   `rg -n "@rankup/api-mock|createMockRankupApiClient|createHttpRankupApiClient|openapi-fetch" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba` returns no matches (UI packages).
    -   UI packages = `apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
