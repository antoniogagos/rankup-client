# ADR 0060: Tournament lifecycle state machine v1

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup, packages/api

## Context

Tournament status transitions (`upcoming|live|finished|archived|cancelled`) and `locked` behavior existed without a single executable state machine, causing inconsistent mutation gating.

## Decision

-   Introduce a runtime state machine for tournament lifecycle.
-   `finished` is a system-driven transition when all matches in tournament window are `final|void`.
-   `cancelled` remains staff/admin driven and must be audited.
-   `locked=true` blocks joins and submissions.
-   `archived|cancelled` block join and submission mutations.
-   Lifecycle evaluation runs after sports events (`match_finished`, `match_corrected`, status changes).

## Constraints

-   Transition logic must be deterministic and side-effect free except through runtime ports.
-   Transition decisions must be reproducible from persisted state.

## Consequences

### Positive

-   Removes ad-hoc status transitions.
-   Aligns eligibility and mutation policy with a single evaluator.

### Negative / Risks

-   Requires existing mock handlers to respect new transition checks.

## Alternatives considered

-   Manual status management only (rejected).
-   Hide finished/cancelled transitions from runtime (rejected).

## Implementation plan

-   [x] Add lifecycle evaluator use-case in runtime.
-   [x] Wire evaluator invocation on relevant sports events.

## Verification

-   `yarn engine:test`
-   `yarn validate`
