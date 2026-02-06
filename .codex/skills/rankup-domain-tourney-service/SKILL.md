---
name: rankup-domain-tourney-service
description: Implement a tourney capability service (contract in <capability>/contracts, implementation in <capability>/services) with a matching gateway, and register it in registerTourneyDomainServices.
metadata:
    owner: rankup
    epic: '002'
    wp: '002-04'
---

# WP-002-04: Domain — Tourney capability services

## Objective

Create a **capability-scoped** tourney service, for example:

- `ITourneyCoreService`
- `ITourneyMatchdaysService`
- `ITourneyRankingService`
- `ITourneyMembersService`
- `ITourneyInvitationCodesService`
- `ITourneyInvitesService`

Each service should:

- live under `packages/rankup/src/domains/tourney/<capability>/services`
- depend on a matching `ITourney*Gateway`
- be registered in `registerTourneyDomainServices.ts`

## Constraints

- Domain service must not import UI.
- Domain service must not call `fetch` directly.
- Domain service must not read env directly (use environment service if needed, but prefer API client only).
- Prefer returning domain models, not raw API DTOs (avoid leaking transport schemas into UI).

## Suggested files

- `packages/rankup/src/domains/tourney/<capability>/contracts/tourney<Capability>.ts`
- `packages/rankup/src/domains/tourney/<capability>/services/tourney<Capability>Service.ts`
- `packages/rankup/src/domains/tourney/registerTourneyDomainServices.ts`
- `apps/rankup-spa/services/api/tourney/tourney-<capability>-gateway.ts`
- `apps/rankup-spa/lib/composition-root.ts`

## Minimal API surface (start small)

Example for `core`:

- `listMyTournaments(): Promise<MyTournamentPage>`
    Only add more methods if needed by the chosen vertical slice.

## Steps

1. Define identifier + interface

- `export const ITourneyCoreService = createDecorator<ITourneyCoreService>('tourneyCoreService')`
- `export interface ITourneyCoreService { ... }`

2. Implement in services

- Inject the matching `ITourney*Gateway` via constructor injection.
- Delegate to gateway; keep domain DTOs stable.

3. Register

- In `registerTourneyDomainServices.ts`, register the implementation (prefer descriptor/lazy singleton).

## Verification

- `yarn validate` -> PASS

## Done criteria

- Capability service exists (contract + impl + registration).
- Can be wired into `AppServices`.
- Validation passes.
