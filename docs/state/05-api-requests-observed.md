# API request flow (observed)

-   Date: 2026-02-02
-   Scope: observed repo state only (no UI edits, no architecture changes)
-   Related: `docs/architecture/services.md`, `docs/architecture/di.md`, `docs/architecture/mock-server.md`, `docs/state/06-service-api-import-audit.md`

## Commands run

-   `rg -n "@rankup/api[\"'\/]" apps/rankup-spa --glob "*.ts"`
-   `rg -n "@rankup/api[\"'\/]" packages/rankup/src/domains --glob "*.ts"`
-   `rg -n "ITourney.*Gateway|Tourney.*Gateway" apps/rankup-spa packages/rankup/src/domains/tournaments`
-   `rg -n "createRankupApiClient|createHttpRankupApiClient" apps/rankup-spa`
-   `rg -n "@service\(" apps/rankup-spa`
    -   UI packages = `apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
-   `rg -n "fetch\(" packages/platform apps/rankup-spa`

## 1) Contract + source of truth

-   `packages/api/openapi.yaml` is the single API source of truth (ADR 0006).
-   Generated OpenAPI types live in `packages/api/src/generated/openapi.ts` (script: `yarn openapi:gen`).
-   `packages/api/src/client.ts` defines the `RankupApiClient` interface and request/response types.

## 2) Runtime client selection (mock vs http)

-   HTTP factory: `apps/rankup-spa/services/api/create-rankup-api-client.ts`
    -   HTTP-only; returns `createHttpRankupApiClient` from `services/api/http-client.ts`.
-   Composition root: `apps/rankup-spa/lib/composition-root.ts`
    -   Reads `EnvironmentService.isMockMode`.
    -   Chooses mock (`@rankup/api-mock`) or HTTP client.
    -   Registers gateways that map SDK DTOs to domain DTOs.

## 3) Environment + auth/token inputs

-   `EnvironmentService` (`packages/platform/src/environment/browser/environmentService.ts`)
    -   Reads `globalThis.__APP_ENV__` only; dev server injects it from env.json (or env.json.example fallback).
    -   Exposes `apiBaseUrl`, `authBaseUrl`, `isMockMode`.
-   Auth tokens come from `SessionManager` and are passed into the API client via `getAccessToken`.
-   OAuth code exchange uses `fetch` in `packages/platform/src/session/browser/session-manager.ts` (not part of the OpenAPI contract).

## 4) Domain services (API facades)

-   Domain DTOs live in `packages/rankup/src/domains/tournaments/<capability>/contracts/types.ts` (shared types in `shared/`), except rankings which live under `packages/rankup/src/domains/scoring/ranking`.
-   App-owned gateways (SDK -> domain DTOs):
    -   `apps/rankup-spa/services/api/tourney/tourney-core-gateway.ts`
    -   `apps/rankup-spa/services/api/tourney/tourney-matchdays-gateway.ts`
    -   `apps/rankup-spa/services/api/tourney/tourney-ranking-gateway.ts`
    -   `apps/rankup-spa/services/api/tourney/tourney-members-gateway.ts`
    -   `apps/rankup-spa/services/api/tourney/tourney-invitation-codes-gateway.ts`
    -   `apps/rankup-spa/services/api/tourney/tourney-invites-gateway.ts`
-   Domain services (delegan en gateways):
    -   `packages/rankup/src/domains/tournaments/core/services/tourneyCoreService.ts`
    -   `packages/rankup/src/domains/tournaments/matchdays/services/tourneyMatchdaysService.ts`
    -   `packages/rankup/src/domains/scoring/ranking/services/tourneyRankingService.ts`
    -   `packages/rankup/src/domains/tournaments/members/services/tourneyMembersService.ts`
    -   `packages/rankup/src/domains/tournaments/codes/services/tourneyInvitationCodesService.ts`
    -   `packages/rankup/src/domains/tournaments/invites/services/tourneyInvitesService.ts`

## 5) UI access path (observed)

-   App bootstrap in `apps/rankup-spa/rk-app.ts`:
-   `createCompositionRoot` -> `ProviderService` -> `createAppServices`.
-   UI gets services via `@service(...)` decorator from `@rankup/platform/instantiation/browser`.
-   Direct SDK/gateway usage in UI has been removed.
-   Tourney services used in UI:
    -   `ITourneyCoreService`:
        -   `apps/rankup-spa/elements/rk-tourney-list/rk-tourney-list.ts`
        -   `apps/rankup-spa/pages/create-tourney/rk-create-tourney-page.ts`
    -   `ITourneyMatchdaysService`:
        -   `apps/rankup-spa/pages/tourney/pages/rk-tourney-matchday.ts`
    -   `ITourneyRankingService`:
        -   `apps/rankup-spa/pages/tourney/pages/rk-tourney-ranking.ts`

## 6) Mocking modes

-   In-memory mock client: `@rankup/api-mock` (`packages/api-mock/src/index.ts`).
-   HTTP mock server: `@rankup/api-mock/server` (see `docs/architecture/mock-server.md`).

## 7) Legacy / exception paths

-   `packages/platform/src/session/browser/session-manager.ts` uses direct `fetch` for OAuth endpoints.

## 8) Alignment gaps vs VS Code/Hadron patterns

-   No dedicated API facade service (Hadron: `IApiService` / `IApibaseApiService`).
-   No centralized error mapping / retry policy (HTTP client throws generic `Error`).
-   No general network request service for non-OpenAPI traffic (decision deferred; ADR 0032).

## 9) Refactor backlog (doc-only)

-   Consider an API facade service if the domain layer needs shared cross-cutting behavior (auth headers, retries, error mapping).
    -   Decision deferred (ADR 0032); revisit when non-OpenAPI traffic grows.
-   Keep mock-first parity: add mock handlers in `@rankup/api-mock` whenever new endpoints are added.
