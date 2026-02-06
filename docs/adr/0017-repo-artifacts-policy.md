# ADR 0017: Repository artifacts policy (tracked vs local)

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

The repo enforces TS-only sources and strict guardrails. Without a clear policy distinguishing tracked files from local build output, agents may either commit build artifacts or tighten guardrails in ways that break developer workflow.

## Decision

-   Define a normative artifacts policy in `docs/engineering/repo-artifacts-policy.md`.
-   Build outputs (e.g., `dist/`) are local-only and must not be tracked.
-   OpenAPI-generated types are tracked and enforced.
-   Tracked `.js/.mjs/.cjs` files are forbidden unless explicitly allowed by ADR.

## Constraints

-   No UI tests.
-   Guardrails are monotonic and must not be weakened without an ADR.

## Consequences

### Positive

-   Clear, enforceable distinction between tracked artifacts and local output.
-   Guardrails can remain strict without breaking local development.

### Negative / Risks

-   Requires ongoing discipline to keep generated outputs and guardrails aligned.

## Implementation plan

-   [ ] Add `docs/engineering/repo-artifacts-policy.md`.
-   [ ] Align guardrails and epic work to enforce tracked-file policy.

## Verification

-   `docs/engineering/repo-artifacts-policy.md` exists and is referenced as normative policy.
