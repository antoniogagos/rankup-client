# ADR 0065: Engine observability minimum v1

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup, packages/api-mock

## Context

Engine use-cases need reproducibility and operational diagnosis but lacked a minimum observability contract.

## Decision

-   Runtime events include correlation metadata (`requestId`, `correlationId`, `causationId` when available).
-   Event bus payloads avoid PII-heavy fields.
-   Recompute and correction operations include reason and parent snapshot lineage.
-   In-memory baseline keeps observability fields in domain events and snapshot metadata.

## Constraints

-   No full telemetry stack required for v1.
-   Avoid logging full submission payload bodies in runtime logs.

## Consequences

### Positive

-   Better diagnosis of recompute/idempotency/concurrency flows.

### Negative / Risks

-   Additional metadata wiring through runtime layers.

## Alternatives considered

-   Defer observability until backend phase (rejected).

## Implementation plan

-   [x] Extend runtime event types with correlation metadata.
-   [x] Propagate request/context IDs in use-case execution.
-   [x] Enforce no-PII runtime logging sinks via guardrail (`scripts/repo-engine-no-pii-logging.ts`).

## Verification

-   `yarn engine:test`
-   `yarn validate`
