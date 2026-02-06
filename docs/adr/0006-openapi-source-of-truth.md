# ADR 0006: OpenAPI is the single source of truth (contract-first)

-   Status: Accepted
-   Date: 2026-01-28
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup will be developed frontend-first. To avoid backend/frontend drift and to keep the system evolvable, we need a single authoritative API contract.

## Decision

-   `packages/api/openapi.yaml` is the single source of truth for the HTTP API.
-   Any API change MUST start by updating `packages/api/openapi.yaml`.
-   The frontend implementation MUST conform to the spec (types, payload shapes, status codes).
-   The backend (when implemented) MUST conform to the spec.

## Contract quality rules

-   Every operation MUST have:
    -   `operationId`
    -   explicit request/response schemas (no undocumented payloads)
    -   explicit error responses (at least a standard error schema)
-   Avoid inline schemas for reusable shapes; prefer `components/schemas`.
-   Breaking changes require an ADR and an explicit migration note.

## Implementation

-   We will generate TypeScript types (and optionally a thin client) from `packages/api/openapi.yaml`.
-   Code generation MUST be verifiable in CI: `validate` must fail if generated output is out of date.

## Constraints

-   No UI tests.

## Consequences

### Positive

-   Contract-first development enables parallel work and prevents silent drift.
-   Frontend and backend have a shared, enforceable API boundary.

### Negative / Risks

-   Requires discipline: spec changes are mandatory even when backend is not ready.

## Verification

-   `yarn openapi:check` fails if `packages/api/openapi.yaml` changes without updating generated outputs.
