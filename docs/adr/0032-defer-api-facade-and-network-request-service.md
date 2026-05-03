# ADR 0032: Defer API facade and network request service

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup now routes UI API access through domain services (`ITournamentService` etc.) which depend on `IRankupApiClient`. The only non-OpenAPI HTTP usage is the OAuth token exchange in `ISessionManager`. Introducing a general API facade (`IApiService`) or network request service (`INetworkRequestService`) would add a new platform boundary without a clear cross-cutting need yet.

Epic 007 tracked a decision on whether to add a shared API facade or a general network request service for non-OpenAPI traffic.

## Decision

Do not introduce an API facade or a general network request service at this time. Keep the request flow as:

UI -> domain services -> `IRankupApiClient` -> runtime implementation

Non-OpenAPI HTTP remains limited to platform services (currently `ISessionManager`). Revisit this decision if we add more non-OpenAPI endpoints or need shared cross-cutting concerns (retry, error mapping, tracing, centralized auth headers).

## Constraints

-   OpenAPI-first (ADR 0006)
-   Mock-first (ADR 0007)
-   UI packages must not call `fetch` directly (ADR 0010)
-   Composition root remains the only implementation selector (ADR 0016)

## Consequences

### Positive

-   Avoids premature abstraction and keeps the platform surface small.
-   Reinforces the domain-service boundary as the primary UI entry point.
-   Keeps mock-first parity straightforward (OpenAPI contract remains the only HTTP surface).

### Negative / Risks

-   If non-OpenAPI traffic grows, we may accumulate ad-hoc HTTP usage in platform services.
-   Cross-cutting behavior (retry, error mapping) remains uncentralized until a dedicated service is introduced.

## Alternatives considered

-   Introduce a monolithic `IApiService` facade now (rejected: premature abstraction).
-   Add `INetworkRequestService` immediately (rejected: no current shared requirements).

## Implementation plan

-   [x] Record the decision in an ADR.
-   [x] Update Epic 007 work tracking to close WP-007-07.
-   [x] Update normative/request-flow docs to reflect the decision.
-   [x] Run `yarn validate` and record evidence.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   `docs/architecture/api-request-flow.md`
-   `docs/adr/0028-api-request-flow-standardization.md`
-   `docs/work/epics/007-workspace-archetype-alignment.md`

## Update (2026-02-02)

-   Request flow now uses domain gateways instead of `IRankupApiClient` (ADR 0048).
