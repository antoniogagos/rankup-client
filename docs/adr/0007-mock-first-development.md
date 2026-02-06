# ADR 0007: Mock-first frontend development (backend last)

-   Status: Accepted
-   Date: 2026-01-28
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup is developed frontend-first. We need local development and CI to be productive without a backend, and we want to prevent contract drift by keeping mocks typed against the OpenAPI contract.

## Decision

-   Local development uses a mock API implementation by default; backend integration is secondary and can be toggled when available.
-   The app depends on a stable RankupApiClient interface, not direct fetch calls.
-   Mock implementations must conform to types generated from packages/api/openapi.yaml.
-   Mock data should be deterministic and representative of real flows.

## Constraints

-   No UI tests.

## Consequences

### Positive

-   Frontend can be built and reviewed without backend availability.
-   Mock client breaks at typecheck when the OpenAPI contract changes.
-   Faster local development and CI.

### Negative / Risks

-   Mocks must be maintained as the contract evolves.
-   Divergence risk if real backend behavior differs from mocks.

## Implementation plan

-   [ ] Keep a dedicated mock workspace (e.g. packages/api-mock).
-   [ ] Generate types from packages/api/openapi.yaml and re-use them in mocks.
-   [ ] Provide a single switch in app wiring to select mock vs real client.
-   [ ] Run openapi:check and typecheck in validate.

## Verification

-   `yarn openapi:check`
-   `yarn typecheck:api`
-   Local app runs with mocks without backend connectivity.
