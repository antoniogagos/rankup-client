# ADR 0028: API request flow standardization (UI -> domain -> API client)

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup is OpenAPI-first and mock-first. At the time of this decision, the UI injected `IRankupApiClient` directly in several places and a legacy `DataService` remained in `apps/rankup-spa/lib`. Hadron/VS Code patterns centralize API access through platform/domain services and keep UI entirely implementation-agnostic. We need a single, documented request flow to align layering, reduce drift, and enable guardrails.

## Decision

-   The normative request flow is: **UI -> domain services -> `IRankupApiClient` -> runtime implementation**.
-   The composition root remains the only selector of mock vs HTTP implementations.
-   UI packages must not call `fetch()` or inject `IRankupApiClient` directly; remaining usages are transitional and tracked in Epic 007.
-   Non-OpenAPI requests are allowed only in platform services (e.g., OAuth token exchange). If a general HTTP facility is required, it must be introduced as a platform service (decision tracked in Epic 007).
-   Mock-first parity remains mandatory: OpenAPI changes must be reflected in typed mocks.

## Constraints

-   OpenAPI-first (ADR 0006)
-   Mock-first (ADR 0007)
-   No UI tests (ADR 0002)
-   UI cannot import runtime implementations (ADR 0010)
-   Composition root is the single wiring location (ADR 0016)

## Consequences

### Positive

-   Clear, VS Code-grade layering for API access.
-   Fewer ad-hoc HTTP usages and less UI coupling to runtime APIs.
-   Mock/real selection remains centralized and auditable.

### Negative / Risks

-   Requires migration work to remove legacy UI usage of `IRankupApiClient`.
-   Short-term duplication while domain services are expanded.

## Alternatives considered

-   Allow UI to keep injecting `IRankupApiClient` (rejected: violates layering and increases drift).
-   Introduce a global service locator for API access (rejected: violates DI invariants).
-   Add a monolithic `IApiService` facade immediately (deferred: decision moved to Epic 007).

## Implementation plan

-   [x] Add `docs/architecture/api-request-flow.md` (normative flow).
-   [x] Update service catalog and work tracking to reflect migration plan.
-   [x] Migrate UI to domain services (WP-007-05).
-   [x] Retire legacy `DataService` (WP-007-06).
-   [x] Decide on API facade / network request service (WP-007-07).
-   [ ] Add guardrails after migrations complete.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   `docs/architecture/api-request-flow.md`
-   `docs/state/05-api-requests-observed.md`

## Update (2026-02-02)

-   Superseded by ADR 0048 for SDK boundaries.
-   Normative flow is now: **UI -> domain services -> gateways -> SDK client -> runtime implementation**.
