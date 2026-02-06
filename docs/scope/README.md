# Rankup scope (intended)

-   Last updated: 2026-01-28
-   Scope owner: Rankup maintainers

## Product summary

Rankup is a no-money, tournament-based social gaming app.
Users compete against other users inside tournaments (public or private).

## What Rankup is

-   A client for creating/joining tournaments and playing game modes inside those tournaments.
-   A multi-game, multi-sport product: game modes (e.g. ScorePrediction, Draft) can exist across multiple sports (football, basketball, esports, etc).
-   Frontend-first development: the frontend is built fully with mocks; backend is implemented later against `packages/api/openapi.yaml`.

## What Rankup is not

-   Not a real-money betting product.
-   Not backend-first development.

## Core loop (high level)

1. User authenticates (current code uses Cognito + Google OAuth; future requirements TBD).
2. User creates or joins a tournament (public or private).
3. Tournament defines:
    - a game mode (ScorePrediction now; Draft planned)
    - a sport (football now; more planned)
4. Users play the selected game mode during matchdays/events.
5. Rankings are computed inside the tournament.

## User roles

-   Anonymous: onboarding + auth entry points.
-   Authenticated player: participates in tournaments and plays.
-   Tournament admin: manages tournament settings and administration.
    -   Admin capabilities: TBD (define in `docs/scope/questions.md`).

## Game modes

### ScorePrediction

-   Status: IMPLEMENTED (currently football in codebase).
-   Intent: support multiple sports (football first, then basketball, esports, etc).
-   Rules/scoring/tie-breakers: observed partially in UI; authoritative rules must be specified and reflected in OpenAPI.

### Draft (FUT Draft-style)

-   Status: PLANNED (not implemented yet).
-   Intent: multiple sports.
-   Draft rules (snake vs auction, roster size, scoring, tie-breakers): TBD.
-   Architecture must support adding this without rewriting ScorePrediction.

## Sports

-   Current: football.
-   Planned: basketball, esports, others TBD.

## Non-functional constraints

-   Long-lived codebase: architecture must remain maintainable under sustained growth via strict boundaries, stable module APIs, and explicit extension points.
-   No UI tests; tests only for critical algorithms/invariants.
-   `packages/api/openapi.yaml` is the single source of truth for the HTTP API contract.
-   Local development must be possible without backend services using mocks (backend last).

## Hosting / deploy

-   Production hosting target: UNKNOWN (must be decided later).
-   Development: local-first with mocks.

## Non-goals

-   Real-money features.
-   UI test suites.
-   Shipping build artifacts in git.

## Open questions

See `docs/scope/questions.md`.
