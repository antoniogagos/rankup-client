# ADR 0050: OpenAPI change protocol + gateway mapping helpers

-   Status: Accepted
-   Date: 2026-02-03
-   Owners: Rankup maintainers
-   Scope: repo

## Context

OpenAPI is the single source of truth, but drift still occurs when updates are not propagated through domain models, gateways, and mocks. The manual mapping in gateways is correct but repetitive, and it is easy to miss updates when schemas evolve.

We need a documented, repeatable protocol for OpenAPI changes and light-weight automation in gateway mapping to reduce inconsistencies without introducing code generation.

## Decision

-   Codify a mandatory OpenAPI change protocol under `docs/engineering/openapi-change-protocol.md`.
-   Introduce gateway mapping helpers in `apps/rankup-spa/services/api/gateway-mapping.ts`:
    -   `defineSharedKeys<TDomain, TApi>()` to declare shared field lists with compile-time safety.
    -   `pickFields(...)` to map aligned DTO shapes without manual duplication.
    -   `mapOptional(...)` to standardize optional mapping and reduce copy/paste.
-   Add a guardrail to forbid `...api*` spreads and `as Domain.*` assertions inside gateway files.
-   Gateways continue to map SDK DTOs to domain DTOs explicitly. Helpers are used only when shapes align; any transformation remains manual.

## Constraints

-   OpenAPI-first and mock-first remain mandatory.
-   UI must not import `@rankup/api` or runtime implementations.
-   Domain packages must not import `@rankup/api`.
-   Mapping must remain explicit; no auto-generated gateway code is introduced.

## Consequences

### Positive

-   Clear, repeatable OpenAPI change workflow.
-   Reduced drift between SDK and domain DTOs via shared-key mapping helpers.
-   Less boilerplate and fewer mapping inconsistencies.

### Negative / Risks

-   Shared-key lists still require manual updates when models change.
-   Helpers can be misused if applied to DTOs that require transformation (avoid that).

## Implementation plan

-   [x] Add `docs/engineering/openapi-change-protocol.md`.
-   [x] Add gateway mapping helpers.
-   [x] Update tourney gateway to use the helpers.
-   [x] Add guardrail for gateway spreads/assertions.
-   [x] Update work tracking and run `yarn validate`.

## Verification

-   `yarn validate`
