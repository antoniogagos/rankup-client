# API request flow (normative)

## Purpose

Define the VS Code-grade, Hadron-aligned request flow so UI packages never talk to HTTP or select runtime implementations.
This document is normative and complements `docs/architecture/services.md` and `docs/architecture/di.md`.

## Source of truth

-   `packages/api/openapi.yaml` is the single source of truth (ADR 0006).
-   Typed contract lives in `@rankup/api` (generated types + `RankupApiClient`).
-   Runtime clients live outside the contract (`@rankup/api-mock`, HTTP client implementation).
-   Domain DTOs live in `@rankup/rankup/domains/*/<capability>/contracts/types`.

## Request flow (happy path)

UI (Lit)
-> Domain service (ITournamentCoreService, ITournamentMatchdaysService, ...)
-> Domain gateway (ITournamentCoreGateway, ITournamentMatchdaysGateway, ...)
-> SDK client (`RankupApiClient`)
-> Runtime implementation (mock or HTTP)

### Composition root (single selector)

-   `createCompositionRoot()` chooses mock vs HTTP and registers domain gateways.
-   UI packages must never import mock or HTTP implementations.

### Domain services (API facades)

-   Domain services encapsulate business rules and delegate transport to gateways.
-   Gateways map SDK DTOs to domain DTOs and are owned by the host.
-   UI consumes domain services via `@service(...)` or AppServices, not the SDK or gateways directly.

## Non-OpenAPI requests

-   Only platform services may perform direct HTTP requests (e.g., OAuth token exchange in SessionManager).
-   No general-purpose network request service is introduced yet; revisit if additional non-OpenAPI traffic or cross-cutting concerns appear (ADR 0032).
-   UI packages must never call `fetch()` directly.

## Mock-first parity

-   New OpenAPI operations must have typed mocks (in-memory handler or mock server fallback).
-   Mock vs HTTP selection remains in the composition root.

## Prohibitions

-   UI packages must not import or inject SDK clients or DTOs from `@rankup/api`.
-   UI packages must not import runtime API implementations or HTTP helpers.
-   No service locator patterns in UI packages.

## Verification (guardrails)

-   `yarn validate`
-   `rg -n "@rankup/api[\"'\/]" apps/rankup-spa --glob "*.ts" --glob "!apps/rankup-spa/services/api/**"` should return 0.
-   `rg -n "@rankup/api[\"'\/]" packages/rankup/src/domains --glob "*.ts"` should return 0.
-   `rg -n "fetch\(" apps/rankup-spa/pages apps/rankup-spa/elements` should return 0 (UI packages).
-   `rg -n "@rankup/api-mock" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba` should return 0 (UI packages).

## References

-   ADR 0006 (OpenAPI source of truth)
-   ADR 0007 (Mock-first)
-   ADR 0009 (API layering)
-   ADR 0010 (UI does not import API implementations)
-   ADR 0016 (Composition root)
-   ADR 0028 (API request flow standardization)
-   ADR 0048 (Domain DTOs + gateways)
-   `docs/state/05-api-requests-observed.md` (observed audit)
