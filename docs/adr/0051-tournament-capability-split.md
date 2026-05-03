# ADR 0051: Tournament capability split (Hadron-style)

-   Status: Accepted
-   Date: 2026-02-03
-   Owners: Rankup maintainers
-   Scope: tournament domain

## Context

The tournament domain now covers multiple distinct surfaces (core tournament lifecycle, matchdays, rankings, members, invites, codes). A monolithic `ITournamentService`/`ITournamentGateway` makes the surface area hard to reason about, increases drift risk when OpenAPI evolves, and blurs responsibility boundaries inside the domain.

We want a structure aligned with Hadron/VSC patterns: cohesive services, explicit contracts, and smaller, capability-scoped gateways that map to OpenAPI groups.

## Decision

-   Split `packages/rankup/src/domains/tournaments` into capability folders:
    -   `shared` (cross-capability types + shared validators)
    -   `core`, `matchdays`, `ranking`, `members`, `codes`, `invites`
-   Each capability contains its own `models/`, `contracts/`, `services/`, and `validation/`.
-   Replace the monolithic `ITournamentService`/`ITournamentGateway` with capability services + gateways:
    -   `ITournamentCoreService` / `ITournamentCoreGateway`
    -   `ITournamentMatchdaysService` / `ITournamentMatchdaysGateway`
    -   `ITournamentRankingService` / `ITournamentRankingGateway`
    -   `ITournamentMembersService` / `ITournamentMembersGateway`
    -   `ITournamentInvitationCodesService` / `ITournamentInvitationCodesGateway`
    -   `ITournamentInvitesService` / `ITournamentInvitesGateway`
-   UI imports DTOs from `<capability>/contracts/types.ts` (or `shared/`), never from runtime services.
-   Gateways are split under `apps/rankup-spa/services/api/tournaments/*-gateway.ts` with shared mappers.

## Constraints

-   OpenAPI-first and mock-first remain mandatory.
-   UI must not import `@rankup/api` or runtime implementations.
-   Domain packages must not import `@rankup/api`.
-   Mock vs real selection happens only in the composition root.

## Consequences

### Positive

-   Clear boundaries per tournament capability.
-   Smaller services and gateways reduce drift and review overhead.
-   UI imports are more explicit and aligned with capability ownership.

### Negative / Risks

-   More files and exports to keep organized.
-   Cross-capability types must be centralized in `shared/` to avoid duplication.

## Implementation plan

-   [x] Create `shared/` plus capability folders with `models/contracts/services/validation`.
-   [x] Replace `ITournamentService`/`ITournamentGateway` with capability services + gateways.
-   [x] Split app gateways under `services/api/tournaments/`.
-   [x] Update UI imports, docs, and skills.
-   [x] Record work log evidence and run `yarn validate`.

## Verification

-   `yarn validate`
