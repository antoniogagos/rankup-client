# ADR 0055: Heads-Up is a tournament format (not a game mode)

-   Status: Accepted
-   Date: 2026-02-04
-   Owners: Product + API
-   Scope: OpenAPI, tournaments, rules, scoring, api-mock, app gateways

## Context

Rankup needs a 1v1 (Heads-Up) competitive mode that works across sports and game modes without duplicating scoring logic.
Modeling Heads-Up as a game mode would blend competition structure with scoring rules, fragment rankings, and complicate the tournament-centric architecture.

## Decision

Introduce a tournament format dimension that is orthogonal to game modes:

-   Add `formatId` to tournaments with a default `league`.
-   Add `formatConfig` as a `oneOf` for format-specific settings (`league`, `headsUp`).
-   Define `headsUp` as a **format**, not a game mode.
-   Extend GameMode definitions with `supportedFormats`.
-   Expose Heads-Up scoreboards through existing ranking endpoints (no new scoreboard routes).
-   Add duel convenience endpoints (`/me/duels`, `/tournaments/{tournamentId}/rematch`) and `TournamentInvite.kind=headsUpChallenge`.
-   Allow ranked track scope and achievement eligibility to include `formatId`.

## Constraints

-   OpenAPI-first and mock-first remain mandatory.
-   UI consumes domain contracts/services only (no SDK usage).
-   No UI tests.

## Consequences

### Positive

-   Heads-Up works across any game mode and sport without duplicating scoring rules.
-   Rankings and ranked progression can segment by format for fairness.
-   Frontend can adopt duel UX via minimal, additive API changes.

### Negative / Risks

-   Additional DTO surface area and gateway mapping for format config + scoreboard.
-   Optional Heads-Up payloads must be handled safely in clients.

## Alternatives considered

-   **Heads-Up as a game mode** (rejected): couples competition format to scoring logic, fragments rankings, and duplicates rules.

## Implementation plan

-   Update `packages/api/openapi.yaml` with tournament format schemas, duel endpoints, and ranking payloads.
-   Regenerate API types and update SDK exports.
-   Align domain models/contracts, app gateways, and api-mock parity.
-   Update work tracking and run `yarn validate`.

## Verification

-   `yarn validate` -> PASS

## References

-   `docs/engineering/openapi-change-protocol.md`
