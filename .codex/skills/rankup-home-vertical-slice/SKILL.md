---
name: rankup-home-vertical-slice
description: Migrate one UI vertical slice (recommended Home) to use ITourneyCoreService via appServices instead of direct data-service/fetch/env. Use when completing WP-002-05 and keeping UI free of platform implementations.
metadata:
    owner: rankup
    epic: '002'
    wp: '002-05'
---

# WP-002-05: Vertical slice migration — Home uses ITourneyCoreService

## Objective

Migrate a single UI consumer (Home page) to use `ITourneyCoreService` through `appServices`.

## Constraints

-   Do not refactor unrelated UI.
-   UI must not import:
    -   `@rankup/api-mock`
    -   platform `browser/**` implementations
    -   DI primitives
-   Keep the change minimal and reviewable.

## Steps

1. Identify the Home page data path

-   Locate the existing data fetching (DataService, direct API calls, env reads).

2. Replace with service call

-   Use `this.appContext.services.tourney.core.listMyTourneys()` (or equivalent)
-   Keep rendering logic as unchanged as possible.
-   Convert result to existing UI model if needed.

3. Remove old imports in that page

-   No direct API/mock/env imports should remain.

## Verification

-   `yarn validate` -> PASS
-   Ripgrep invariants:

```sh
rg -n "@rankup/api-mock|openapi-fetch|fetch\\(" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba
```

## Done criteria

-   Home page uses ITourneyCoreService via appServices.
-   No forbidden imports introduced.
-   Validation passes.
