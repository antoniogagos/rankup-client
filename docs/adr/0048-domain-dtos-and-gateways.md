# ADR 0048: Domain DTOs and gateways (no @rankup/api in UI/domain)

-   Status: Accepted
-   Date: 2026-02-02
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Apibase alignment requires that SDK DTOs never cross into domain or UI layers. Until now, domain services returned `@rankup/api` response types directly, which coupled UI to backend transport schemas and made OpenAPI changes ripple across layers.

We also want mock/real selection to happen exclusively in the composition root, leaving `services/api/**` as pure HTTP + mapping code.

## Decision

-   UI packages and domain packages must not import `@rankup/api`.
-   Domain DTOs live in `@rankup/rankup/domains/*/<capability>/contracts/types` and are the only types UI consumes.
-   Domain services depend on **capability gateways** (e.g., `ITournamentCoreGateway`, `ITournamentMatchdaysGateway`) instead of the SDK client.
-   Gateways are implemented in the host (`apps/rankup-spa/services/api/**`) and map SDK DTOs to domain DTOs.
-   Mock vs HTTP selection happens only in the composition root; SDK client factories inside `services/api/**` are HTTP-only.

## Consequences

### Positive

-   Domain and UI are decoupled from OpenAPI DTO churn.
-   Mock/real selection is centralized and auditable.
-   Mapping provides a single place to normalize DTOs.

### Negative / Risks

-   Additional mapping code is required per endpoint.
-   DTO mapping must be kept in sync with OpenAPI changes.

## Implementation

-   Added domain DTOs + capability gateways (core/matchdays/ranking/members/codes/invites).
-   Tournament gateways map SDK DTOs to domain DTOs in app `services/api/**`.
-   Composition root selects mock vs HTTP and registers gateways.
-   Removed `IRankupApiClient` from domain.
-   Guardrails updated to block `@rankup/api` in UI/domain.

## Verification

-   `yarn validate`
-   `rg -n "@rankup/api[\"'\/]" apps/rankup-spa --glob "*.ts" --glob "!apps/rankup-spa/services/api/**"` returns 0.
-   `rg -n "@rankup/api[\"'\/]" packages/domain-* --glob "*.ts"` returns 0.
