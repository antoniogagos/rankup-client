# ADR 0061: Idempotency and ETag semantics v1

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup, packages/api, packages/api-mock

## Context

OpenAPI headers (`X-Idempotency-Key`, `If-Match`) existed but runtime semantics were incomplete for conflict handling, canonical response replay, and version matching.

## Decision

-   Strong idempotency key contract:
	- effective key: `(actorId, operationId, resourceKey, idempotencyKey)`
	- plus `requestFingerprint` of request body + concurrency headers.
-   Same effective key + same fingerprint returns same canonical outcome (status/body/functional headers).
-   Same effective key + different fingerprint returns `409` with `Problem.code=idempotencyKeyReused`.
-   Outcomes are persisted for deterministic 2xx and invariant 4xx responses.
-   ETag values are quoted and derived from monotonic resource version.
-   `If-Match` mismatch returns `412` with stable Problem Details payload.

## Constraints

-   No best-effort dedupe semantics; must be strong.
-   Idempotency replay excludes transport-only headers (`X-Request-Id`).

## Consequences

### Positive

-   Safe retries under mobile/network instability.
-   Deterministic behavior across retries even after state changes.

### Negative / Risks

-   Additional storage required for idempotency outcome cache.

## Alternatives considered

-   Dedupe-only idempotency (rejected).
-   Idempotency key scoped only by operationId (rejected).

## Implementation plan

-   [x] Add IdempotencyPort and in-memory adapter with fingerprint checks.
-   [x] Apply to join and submission use-cases.

## Verification

-   `yarn engine:test`
-   `yarn api-http:schema-validate`
-   `yarn validate`
