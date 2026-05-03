---
name: "rankup-ui-appservices-bridge"
description: "Create a typed UI bridge (AppServices) so UI consumes explicit services without DI or service locator access. Use when wiring composition root output into app-context/bootstrap."
owner: "rankup"
epic: "002"
wp: "002-03"
---

# WP-002-03: UI bridge — typed AppServices (no service locator)

## Objective

Expose an explicit, typed service surface to UI:

-   UI uses `appServices.tournament.<capability>` (etc.)
-   UI does not import DI primitives
-   UI cannot request arbitrary services by identifier

## Constraints

-   Do not expose `ServiceCollection` or `InstantiationService` to UI.
-   No `getService(id)` pattern in UI.
-   Keep the bridge centralized to avoid drift.

## Implementation approach (preferred)

-   Define `AppServices` in `apps/rankup-spa/lib/app-services.ts`.
-   Bootstrap/root component creates the composition root once and stores a single `AppServices` object.

## Steps

1. Define `AppServices` with explicit fields only (start minimal):

-   `tournament: { core, matchdays, ranking, members, codes, invites }`

2. Create a bootstrap factory:

-   call composition root
-   instantiate needed services once
-   build `{ tournament: { core, matchdays, ranking, members, codes, invites } }` object
-   pass it to `rk-app`/`rk-unauthenticated-app` as host properties

3. Provide `AppServices` to UI:

-   whichever mechanism the app already uses (existing app-context, Lit context, or explicit prop injection)
-   choose the smallest diff that keeps the bridge centralized

## Verification

-   `yarn validate` -> PASS
-   UI must not import DI primitives:

```sh
rg -n "src/platform/instantiation" apps/rankup-spa/pages apps/rankup-spa/elements
```

## Done criteria

-   UI can access typed `appServices`.
-   No service locator introduced.
-   Validation passes.
