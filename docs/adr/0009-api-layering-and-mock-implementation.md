# ADR 0009: API layering and mock implementation separation

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup is developed frontend-first with OpenAPI as the contract. We need a stable API contract package and a mock implementation that can be selected by environment without leaking into production code.

## Decision

-   Keep the API contract in a dedicated package: `@rankup/api`.
-   Keep mock implementation in a separate package: `@rankup/api-mock`.
-   The app composition root selects the implementation (`apps/rankup-spa/lib/composition-root.ts` + `packages/platform/src/api/create-rankup-api-client.ts`).
-   Mocks must depend on the API contract, not the other way around.

## Constraints

-   No UI tests.
-   TS-only sources.

## Consequences

### Positive

-   Clear package boundaries and one-way dependencies.
-   Mock implementation cannot leak into production by accident.

### Negative / Risks

-   Adds one extra workspace to maintain.

## Implementation plan

-   [ ] Rename packages to `@rankup/api` and `@rankup/api-mock`.
-   [ ] Use package-name imports across the repo.
-   [ ] Restrict `@rankup/api-mock` imports to platform wiring (composition root only).

## Verification

-   `yarn lint`
-   `yarn validate`
