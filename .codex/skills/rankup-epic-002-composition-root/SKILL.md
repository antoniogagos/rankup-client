---
name: rankup-epic-002-composition-root
description: Epic 002 composition root skill: register platform/domain services and centralize mock/real selection in compositionRoot.
metadata:
  owner: rankup
  epic: "002"
  wp: "002-02"
---

# Skill: Epic 002 composition root (single implementation selector)

## Purpose

Create a single composition root that:

-   registers platform services
-   registers domain services (extension point)
-   is the only selector of mock vs real implementations

## Scope

-   `apps/rankup-spa/lib/composition-root.ts`
-   `packages/platform/src/registerPlatformServices.ts`
-   `packages/rankup/src/domains/tourney/registerTourneyDomainServices.ts`

## Preconditions

-   WP-002-01 is merged.
-   UI must not import DI primitives.

## Constraints

-   Keep `compositionRoot.ts` thin.
-   Put registrations into `registerPlatformServices.ts` and `registerTourneyDomainServices.ts`.
-   Domain registration must be isolated so WP-002-04 can proceed without merge conflicts.

## Mock vs real

-   Only composition root (or a single allowlisted platform wiring module called by it) can decide mock vs real.
-   UI and domain services must remain agnostic.

## Verification

-   `yarn validate` PASS
-   `rg -n "@rankup/api-mock" apps/rankup-spa` only matches allowlisted wiring module(s).
