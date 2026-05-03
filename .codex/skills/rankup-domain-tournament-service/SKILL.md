---
name: rankup-domain-tournament-service
description: Implement a tournament capability service (contract in <capability>/contracts, implementation in <capability>/services) with a matching gateway, and register it in registerTournamentDomainServices.
metadata:
    owner: rankup
    epic: '002'
    wp: '002-04'
---

# WP-002-04: Domain — Tournament capability services

## Objective

Create a **capability-scoped** tournament service, for example:

- `ITournamentCoreService`
- `ITournamentMatchdaysService`
- `ITournamentRankingService`
- `ITournamentMembersService`
- `ITournamentInvitationCodesService`
- `ITournamentInvitesService`

Each service should:

- live under `packages/rankup/src/domains/tournaments/<capability>/services`
- depend on a matching `ITournament*Gateway`
- be registered in `registerTournamentDomainServices.ts`

## Constraints

- Domain service must not import UI.
- Domain service must not call `fetch` directly.
- Domain service must not read env directly (use environment service if needed, but prefer API client only).
- Prefer returning domain models, not raw API DTOs (avoid leaking transport schemas into UI).

## Suggested files

- `packages/rankup/src/domains/tournaments/<capability>/contracts/tournament<Capability>.ts`
- `packages/rankup/src/domains/tournaments/<capability>/services/tournament<Capability>Service.ts`
- `packages/rankup/src/domains/tournaments/registerTournamentDomainServices.ts`
- `apps/rankup-spa/services/api/tournament/tournament-<capability>-gateway.ts`
- `apps/rankup-spa/lib/composition-root.ts`

## Minimal API surface (start small)

Example for `core`:

- `listMyTournaments(): Promise<MyTournamentPage>`
    Only add more methods if needed by the chosen vertical slice.

## Steps

1. Define identifier + interface

- `export const ITournamentCoreService = createDecorator<ITournamentCoreService>('tournamentCoreService')`
- `export interface ITournamentCoreService { ... }`

2. Implement in services

- Inject the matching `ITournament*Gateway` via constructor injection.
- Delegate to gateway; keep domain DTOs stable.

3. Register

- In `registerTournamentDomainServices.ts`, register the implementation (prefer descriptor/lazy singleton).

## Verification

- `yarn validate` -> PASS

## Done criteria

- Capability service exists (contract + impl + registration).
- Can be wired into `AppServices`.
- Validation passes.
