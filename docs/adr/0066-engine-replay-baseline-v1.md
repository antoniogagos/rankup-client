# ADR 0066: Engine replay baseline v1

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup

## Context

VS Code-grade baseline requires deterministic recomputation and reproducible ranking outcomes from the same input set.

## Decision

-   Add replay baseline utilities/tests for deterministic recompute.
-   Replay input set includes ruleset, tournament state, canonical matches/results, submissions, and snapshot history.
-   Same input set must produce same ranking order and snapshot content.

## Constraints

-   Replay must rely only on runtime ports/adapters, not UI/network.

## Consequences

### Positive

-   Demonstrable determinism for scoring/ranking.

### Negative / Risks

-   Requires stable serialization and hash utilities.

## Alternatives considered

-   No replay tests in v1 (rejected).

## Implementation plan

-   [x] Add deterministic replay test scenarios.
-   [x] Validate equivalence between incremental and full recompute outcomes.

## Verification

-   `yarn engine:test`
-   `yarn validate`
