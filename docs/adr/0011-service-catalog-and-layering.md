# ADR 0011: Service catalog and layering (VS Code-grade)

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup needs stable boundaries that survive API evolution, new game modes, and new sports. Without a canonical service catalog and layering rules, UI code will drift toward direct API usage, increasing refactor risk.

## Decision

-   Define a service catalog that lists stable services, their scope, and allowed dependencies.
-   Enforce layering rules: UI consumes services; implementations are selected only in the composition root.
-   Keep the OpenAPI contract separate from runtime implementations.

## Constraints

-   No UI tests.
-   Services use injection and scopes (app now; tourney later).

## Consequences

### Positive

-   Clear boundaries for UI and domain code.
-   Future game modes and sports can be added via registries and scoped runtimes.

### Negative / Risks

-   Requires discipline and periodic catalog updates.

## Implementation plan

-   [ ] Add `docs/architecture/service-catalog.md`.
-   [ ] Add `docs/architecture/di.md` as the normative DI model.
-   [ ] Link the catalog from `AGENTS.md`.
-   [ ] Enforce import restrictions via ESLint.

## Verification

-   `yarn lint`
-   `rg -n "@rankup/api-mock|createMockRankupApiClient|createHttpRankupApiClient|openapi-fetch" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba` returns no matches (UI packages).
    -   UI packages = `apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
