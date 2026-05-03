---
name: "rankup-composition-root"
description: "Implement the app composition root for Rankup (single place selecting implementations). Use when registering platform services (Environment, ApiClient) and creating the root InstantiationService; keep UI independent."
owner: "rankup"
epic: "002"
wp: "002-02"
---

# WP-002-02: Composition root skeleton + platform service registration

## Objective

Create a single composition root that:

-   constructs the root `ServiceCollection` + `InstantiationService`
-   registers platform services (Environment, RankupApiClient)
-   is the only place that selects mock vs real implementations

## Constraints / invariants

-   UI must not read env directly.
-   UI must not import platform/browser implementations.
-   `@rankup/api-mock` must be imported only in allowlisted app wiring.
-   Keep domain registration isolated (use `registerTournamentDomainServices.ts`).

## Suggested files

-   `apps/rankup-spa/lib/composition-root.ts`
-   `packages/platform/src/registerPlatformServices.ts`
-   `packages/rankup/src/domains/tournaments/registerTournamentDomainServices.ts`
-   `packages/platform/src/environment/common/environment.ts`
-   `packages/platform/src/environment/browser/environmentService.ts`
-   `apps/rankup-spa/services/api/create-rankup-api-client.ts`
-   `apps/rankup-spa/services/api/tournament/*-gateway.ts`

## Steps

1. **Environment service**

-   Define `IEnvironmentService` contract in `environment/common`.
-   Implement `EnvironmentService` in `environment/browser`.
-   Provide only what platform needs (e.g., `useMockApi`, `apiBaseUrl`, feature flags).
-   Keep parsing of query/env inside platform.

2. **Api client wiring**

-   Use `RankupApiClient` from `@rankup/api` as the contract type.
-   Implement HTTP factory in `apps/rankup-spa/services/api/create-rankup-api-client.ts`.
-   Select mock vs HTTP in `apps/rankup-spa/lib/composition-root.ts`.
-   Register app-owned gateways (e.g., `TournamentCoreGateway`, `TournamentMatchdaysGateway`) in the composition root.

3. **Composition root**

-   Build `ServiceCollection`.
-   Call `registerPlatformServices(services)`.
-   Call `registerTournamentDomainServices(services)` (safe extension point).
-   Create `InstantiationService`.
-   Export a small return shape that bootstrap can consume (do not expose generic `getService` to UI).

## Verification

-   `yarn validate` -> PASS
-   Ensure `@rankup/api-mock` imports are allowlisted:

```sh
rg -n "@rankup/api-mock" apps/rankup-spa
```

## Done criteria

-   A single composition root exists.
-   Platform services are registered.
-   Mock vs real selection is centralized.
-   Validation passes.
