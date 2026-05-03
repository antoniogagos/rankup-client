# ADR 0063: Sports canonical model and provider mapping v1

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup

## Context

Provider IDs/statuses may drift; scoring and lifecycle require canonical match/result semantics with deterministic correction handling.

## Decision

-   Runtime consumes canonical sports models via `SportsSchedulePort`.
-   Canonical result includes a deterministic `resultFingerprint`.
-   Corrections with unchanged fingerprint are ignored (idempotent no-op).
-   Corrections with changed fingerprint trigger recompute and new snapshot version.
-   Provider-specific mapping remains outside engine core (ACL boundary).
-   Provider `MatchStatus -> canonical` buckets are declared in OpenAPI (`components.schemas.MatchStatus.x-rankup-canonical-statuses`) and consumed via generated artifacts (`packages/api/src/generated/match-status-catalog.{ts,json}`), not hardcoded in runtime adapters.

## Constraints

-   Engine core never depends directly on provider payload formats.
-   Canonical IDs must be stable within tournament scope.
-   Any provider status-bucket change must start in `packages/api/openapi.yaml` and pass OpenAPI generation checks before adapter usage.

## Consequences

### Positive

-   Stable engine behavior despite provider variability.
-   Deterministic correction handling.

### Negative / Risks

-   Requires explicit ACL mapping discipline in adapters.

## Alternatives considered

-   Direct provider model usage in runtime (rejected).
-   Ignore correction fingerprinting (rejected).

## Implementation plan

-   [x] Define canonical schedule/result runtime types.
-   [x] Use fingerprint-based dedupe in recompute flow.
-   [x] Generate OpenAPI-derived match-status catalog and enforce adapter consumption through repo guardrails.

## Verification

-   `yarn repo:openapi-sot-drift`
-   `yarn openapi:verify`
-   `yarn engine:test`
-   `yarn validate`
