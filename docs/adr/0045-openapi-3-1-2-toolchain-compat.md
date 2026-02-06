# ADR 0045: Pin OpenAPI to 3.1.2 for toolchain compatibility

-   Status: Accepted
-   Date: 2026-02-02
-   Owners: Rankup maintainers
-   Scope: packages/api, packages/api-mock, tooling

## Context

The canonical spec was set to OpenAPI 3.2.0, but the current toolchain cannot parse 3.2:

-   The mock server uses `@apidevtools/swagger-parser`, which rejects 3.2 and only supports up to 3.1.2.
-   `openapi-typescript` supports OpenAPI 3.0/3.1, not 3.2.

Rankup is greenfield and follows **no compatibility shims**. We must keep a single source of truth that all tooling can consume.

## Decision

Pin the canonical spec version to **OpenAPI 3.1.2** and update the root spec header accordingly. Any future upgrade to 3.2 must be accompanied by a tooling upgrade and a new ADR.

## Constraints

-   OpenAPI-first (ADR 0006).
-   Mock-first requires the mock server to parse the canonical spec.
-   No legacy/compatibility shims (ADR 0013).

## Consequences

### Positive

-   Mock server starts and validates against the canonical spec.
-   Codegen (`openapi-typescript`) remains compatible.
-   Single source of truth preserved without parallel specs.

### Negative / Risks

-   3.2-only features cannot be used until the toolchain supports 3.2.
-   Future upgrade requires deliberate toolchain changes and a new ADR.

## Alternatives considered

-   Keep 3.2 and replace the parser/toolchain: rejected (adds tooling churn without guaranteed TS codegen support).
-   Maintain a 3.1 shim spec for tooling: rejected (violates no-compatibility-shims).

## Implementation plan

-   [x] Update `packages/api/openapi.yaml` to `openapi: 3.1.2`.
-   [x] Update fragment root in `packages/api/docs/contrato/meta-config/spec.yaml`.
-   [x] Align docs/diagnostics and epic notes to 3.1.2.
-   [x] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/diagnostics/OPENAPI-MIGRATION.md`
