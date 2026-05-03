# ADR 0062: Engine storage baseline v1 (CRUD + versioned snapshots)

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup

## Context

Engine v1 needs replayability and auditable recompute but must ship quickly without full event-sourcing migration.

## Decision

-   Adopt CRUD repositories + versioned snapshots as v1 storage baseline.
-   Snapshot entities include lineage metadata (`snapshotId`, `parentSnapshotId`, `computedAt`, reason).
-   Runtime ports keep event-log migration path open (append/event ports may be introduced behind adapters later).
-   Use optimistic concurrency versions for mutable resources (`Tournament`, `MatchdaySubmission`).

## Constraints

-   State transitions and recompute must be reconstructable from stored resource and snapshot versions.
-   No storage API that blocks future event-log migration.

## Consequences

### Positive

-   Faster delivery of deterministic runtime.
-   Replay and recompute supported without full event-sourcing complexity.

### Negative / Risks

-   Future event-log migration still required for deeper audit workloads.

## Alternatives considered

-   Event-log + snapshots immediately (rejected for v1 timeline).
-   Plain CRUD without versioned snapshots (rejected).

## Implementation plan

-   [x] Define runtime repos for CRUD + snapshots.
-   [x] Implement in-memory adapters used by runtime and mock server.
-   [x] Implement file-backed persistent adapters for production state (`packages/rankup/src/adapters/persistent/**`) covering `TournamentRepo`, `SubmissionRepo` (CAS), `IdempotencyPort`, `ProcessedEventRepo`, and `ScoringRepo`.

## Verification

-   `yarn engine:test`
-   `yarn test:p0`
-   `yarn validate`
