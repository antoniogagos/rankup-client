# ADR 0064: Engine error taxonomy v1 (Problem Details)

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup, packages/api, packages/api-mock

## Context

Mutation and gating errors were not consistently mapped across runtime and mock responses, increasing drift risk.

## Decision

-   Engine runtime uses a normalized Problem Details taxonomy with stable `Problem.code` mappings.
-   Core invariant codes include (minimum):
	- `idempotencyKeyReused` (409)
	- `etagMismatch` (412)
	- `tournamentLocked` (409)
	- `matchdayClosed` (409)
	- `submissionLocked` (409)
	- `notMember` (403)
	- `forbiddenRole` (403)
-   Item-level submission failures should be represented in `rejected[]` when contract allows partial apply.

## Constraints

-   Problem payload shape must remain OpenAPI-compatible.
-   Mock and runtime must emit equivalent status/code semantics for covered operations.

## Consequences

### Positive

-   Predictable client handling.
-   Lower drift between mock and runtime.

### Negative / Risks

-   Requires mapping updates in existing handlers.

## Alternatives considered

-   Endpoint-specific ad-hoc errors (rejected).

## Implementation plan

-   [x] Add runtime error mapping utilities and typed domain error codes.
-   [x] Align mock handlers for baseline operations.

## Verification

-   `yarn api-mock:schema-validate`
-   `yarn api-http:schema-validate`
-   `yarn validate`
