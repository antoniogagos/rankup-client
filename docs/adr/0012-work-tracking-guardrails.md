# ADR 0012: Work tracking guardrails

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Multiple agents work on the repo and must be able to resume without external context. Without an inviolable work log and current epic pointer, structural work becomes fragmented and inconsistent.

## Decision

-   Establish a work tracking structure under `docs/work/`.
-   Require updates to CURRENT, the active epic, and a daily log entry for any structural change.
-   Enforce this via validate-time guardrails.

## Constraints

-   No UI tests.
-   Guardrails are monotonic.

## Consequences

### Positive

-   Work state is always recoverable.
-   Structural changes are traceable by day and epic.

### Negative / Risks

-   Additional process overhead for structural changes.

## Implementation plan

-   [ ] Add docs/work structure (README, CURRENT, ROADMAP, epics, log).
-   [ ] Add repo:work-log guardrail and run it in validate.

## Verification

-   `yarn validate`
