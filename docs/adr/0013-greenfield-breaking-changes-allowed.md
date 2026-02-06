# ADR 0013: Greenfield development (breaking changes allowed)

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup is in an early, pre-production phase. We need to establish foundations (contracts, boundaries, tooling) without carrying compatibility constraints. Without an explicit decision, agents may assume backward compatibility and avoid necessary structural fixes.

## Decision

-   Rankup is in greenfield mode until we explicitly declare production readiness.
-   Breaking changes are allowed during greenfield mode.
-   No legacy/compatibility shims during greenfield mode; remove or replace old paths instead of preserving them.
-   Structural changes still require ADRs, verification, and work-log updates.

## Constraints

-   Follow the structural change protocol.
-   Do not weaken existing guardrails or validation gates.
-   No UI tests.

## Consequences

### Positive

-   Faster iteration on core architecture and contracts.
-   Fewer premature compatibility commitments.

### Negative / Risks

-   Increased migration effort later when production readiness is declared.
-   Requires explicit tracking of when greenfield mode ends.

## Alternatives considered

-   Enforce backward compatibility from day one (rejected: slows down foundational work).

## Implementation plan

-   [ ] Record the greenfield invariant in `docs/scope/decisions.md` and `docs/work/CURRENT.md`.
-   [ ] Track work under a dedicated epic in `docs/work/epics/`.

## Verification

-   `docs/scope/decisions.md` includes the greenfield decision.
-   `docs/work/CURRENT.md` references greenfield mode as an invariant.
