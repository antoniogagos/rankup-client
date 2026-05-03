---
name: rankup-epic-002-ui-bridge
description: Epic 002 UI bridge skill: expose typed AppServices to UI without DI primitives or service locator access.
metadata:
  owner: rankup
  epic: "002"
  wp: "002-03"
---

# Skill: Epic 002 UI bridge (typed AppServices, no service locator)

## Purpose

Expose services to UI via an explicit, typed object:

-   UI can use `appServices.tournament.core` (and other capability services)
-   UI cannot fetch arbitrary services by id

## Scope

-   A single “UI entry” place wires the bridge.
-   No UI imports of `platform/instantiation/**`.
-   Bridge lives in `apps/rankup-spa/lib/app-services.ts`.

## Constraints

-   No global accessor / service locator.
-   Keep the bridge explicit and small.
-   Do not refactor multiple pages. Migrate only one vertical slice (Home) in WP-002-05.

## Verification

-   `yarn validate` PASS
-   `rg -n "platform/instantiation" apps/rankup-spa/pages apps/rankup-spa/elements` => no matches
