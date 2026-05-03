# ADR 0059: ScorePrediction v1 operational specification

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup, packages/api, packages/api-mock

## Context

ScorePrediction behavior is partially represented in contracts but lacked executable normative semantics for tie-breakers, result scope handling, and deterministic ordering in runtime.

## Decision

-   ScorePrediction runtime semantics are normative and implemented in `packages/rankup/src/algorithms`.
-   `resultScope` default is `extra_time`.
-   Penalty shootout scores are excluded from scoreline comparison unless a future ruleset version explicitly includes them.
-   Tie-breaker default order:
	1. `mostExactScores` desc
	2. `mostCorrectOutcomes` desc
	3. `mostExactGoalsOneTeam` desc
	4. `earliestSubmission` asc
	5. `random` asc (deterministic hash)
-   `mostExactGoalsOneTeam` counts per match and returns at most 1 point per match (even if both team goals match).
-   `earliestSubmission` is the first server timestamp when matchday completion reaches `complete`.
-   `random` uses stable deterministic hash on tournament/user/ruleset tuple.

## Constraints

-   No RNG in runtime ordering.
-   No browser-only dependencies in algorithms.
-   Any behavior change requires new immutable ruleset version.

## Consequences

### Positive

-   Deterministic and replayable scoring/ranking.
-   Explicit semantics for previously ambiguous tie-breakers.

### Negative / Risks

-   Existing assumptions in mock payloads may need alignment.

## Alternatives considered

-   Keep tie-breakers partially undefined (rejected).
-   Use non-deterministic random tie-break (rejected).

## Implementation plan

-   [x] Add deterministic scoring/tie-break algorithms under `packages/rankup/src/algorithms/**`.
-   [x] Align registry defaults and OpenAPI descriptions.

## Verification

-   `yarn engine:test`
-   `yarn validate`
