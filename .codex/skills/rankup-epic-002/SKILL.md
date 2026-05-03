---
name: "rankup-epic-002"
description: "Epic 002 execution guide (service layering + DI skeleton). Use when implementing DI primitives, composition root, typed UI bridge (AppServices), tournament capability services (core/matchdays/ranking/etc), or import guardrails for layering."
owner: "rankup"
epic: "002"
scope: "service-layering"
---

# Epic 002: Service layering + DI skeleton

## Objective

Introduce a VS Code-grade service model:

-   Service identifiers + constructor injection for non-UI classes
-   A single composition root selecting implementations (mock vs real)
-   UI consumes explicit, typed services (no service locator)
-   Migrate one vertical slice to a domain service (start with Tournaments/Home)

## Non-goals

-   Refactor the entire UI.
-   Replace auth/session fully.
-   Add UI tests (not allowed by repo policy).
-   Decide hosting/deploy.

## Hard invariants (must hold)

-   UI MUST NOT construct dependencies or select implementations.
-   UI MUST NOT import platform `browser/**` implementations.
-   UI and samba MUST NOT import API implementations (only `@rankup/api` contracts).
-   Composition root is the only selector (mock vs real).
-   Avoid service locator patterns: UI must not "get arbitrary services by id".

## Work packets (WPs)

Implement in this order (or equivalent incremental order):

-   **WP-002-01**: DI primitives foundation (createDecorator, ServiceCollection, InstantiationService)
-   **WP-002-02**: Composition root skeleton + platform service registration (Environment, ApiClient)
-   **WP-002-03**: UI bridge: typed `AppServices` (no service locator)
-   **WP-002-04**: Domain: tournament capability services contract + implementation + registration
-   **WP-002-05**: Vertical slice migration: Home uses ITournamentCoreService
-   **WP-002-06**: Enforcement: ESLint import restrictions (late in the epic)
-   **WP-002-07**: Docs + catalog updates
-   **WP-002-08**: Closeout: work log + status updates

## Merge-hotspots to avoid conflicts

-   `apps/rankup-spa/lib/composition-root.ts` (prefer `registerPlatformServices.ts` + `registerTournamentDomainServices.ts`)
-   `apps/rankup-spa/lib/app-services.ts` (UI bridge should be centralized)
-   ESLint config (single-owner lane)

## Verification (always)

-   `yarn validate` -> PASS
-   If lint exists: `yarn lint` -> PASS
-   Ripgrep invariants:

```sh
rg -n "@rankup/api-mock" apps/rankup-spa
rg -n "src/platform/instantiation" apps/rankup-spa/pages apps/rankup-spa/elements
rg -n "src/platform/.*/browser/" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba
```

## If asked to implement a part of Epic 002

Activate the dedicated skills:

-   DI foundation -> **rankup-di-primitives**
-   Composition root -> **rankup-composition-root**
-   UI bridge -> **rankup-ui-appservices-bridge**
-   Domain service -> **rankup-domain-tournament-service**
-   Home migration -> **rankup-home-vertical-slice**
-   ESLint enforcement -> **rankup-eslint-import-guardrails**
-   Logging/status updates -> **rankup-work-logging**
