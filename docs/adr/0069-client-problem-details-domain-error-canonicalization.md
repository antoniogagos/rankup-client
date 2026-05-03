# ADR 0069: Client ProblemDetails -> DomainError canonicalization

-   Status: Accepted
-   Date: 2026-02-08
-   Owners: Rankup maintainers
-   Scope: apps/rankup-spa, packages/rankup, P0 tests

## Context

The repository introduced a canonical `mapProblemToDomainError`, but runtime HTTP paths still emitted generic `Error("HTTP <status>")` in the SPA API client.  
Coverage was also asymmetric across API domains and did not enforce a full canonical status matrix (`401/403/404/409/422/429/5xx`) with domain-specific error semantics.

This drift created two risks:

-   inconsistent error handling behavior between domains and runtime paths
-   late failure discovery when ProblemDetails shape changed

## Decision

-   All non-2xx responses in `apps/rankup-spa/services/api/http-client.ts` must be converted to canonical `DomainError` through `mapProblemToDomainError`.
-   Generic `Error("HTTP ...")` throws are not allowed in runtime API client error paths.
-   `DomainErrorKind` must preserve engine-critical semantics (no forced collapse to generic `Conflict`) for codes such as:
	-   `tournamentLocked`
	-   `tournamentArchived`
	-   `tournamentCancelled`
	-   `tournamentFull`
	-   `joinClosed`
	-   `etagMismatch`
	-   `idempotencyKeyReused`
	-   `matchdayClosed`
	-   `notMember`
-   Status-level canonical mapping must include at minimum:
	-   `401 -> Unauthorized`
	-   `403 -> Forbidden`
	-   `404 -> NotFound`
	-   `409/412 -> Conflict` (when code-specific mapping does not apply)
	-   `422 -> ValidationFailed`
	-   `429 -> RateLimited`
	-   `5xx -> ServerError`
-   P0 lane must include negative coverage proving runtime canonical mapping via real composition + api-mock.

## Constraints

-   OpenAPI-first (ADR 0006), mock-first (ADR 0007), and no UI tests (ADR 0002) remain unchanged.
-   UI must continue consuming domain services; no UI-level SDK/client injection patterns are introduced.
-   Work tracking artifacts remain mandatory for this structural lane.

## Consequences

### Positive

-   Runtime and domain error behavior become predictable and testable.
-   Engine-specific Problem codes remain distinguishable in client/domain error handling.
-   Negative smoke catches ProblemDetails drift earlier.

### Negative / Risks

-   Additional mapper/test maintenance overhead across domains.
-   Legacy tests that assumed generic HTTP errors must be updated to canonical `DomainError`.

## Alternatives considered

-   Keep generic HTTP errors and only assert shape in mapper unit tests (rejected: runtime drift remains).
-   Introduce a separate facade only for error mapping (rejected for now: unnecessary new layer vs direct canonicalization in existing HTTP client).

## Implementation plan

-   [x] Route non-2xx HTTP paths through canonical mapper in SPA API client.
-   [x] Expand `DomainErrorKind` and mapper semantics for engine parity + status matrix.
-   [x] Add dedicated P0 mapper tests and smoke negative coverage for runtime canonical mapping.
-   [x] Expand per-domain P0 error matrix to all API domains.
-   [x] Add guardrails for canonical mapper usage/no generic HTTP throw regressions.

## Verification

-   `yarn vitest run -c vitest.p0.config.ts apps/rankup-spa/services/api/problem/__tests__/p0/mapProblemToDomainError.mapper.test.ts apps/rankup-spa/services/api/problem/__tests__/p0/httpClient.problem-mapping.test.ts packages/rankup/test/__tests__/p0/smoke/problemDetails.smoke.test.ts`
-   `yarn test:p0`
-   `yarn validate`
