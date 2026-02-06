# ADR 0008: Repo guardrails and CI validation gates

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

The repo must remain consistent across agents and PRs. Without explicit guardrails, structural drift, contract divergence, and accidental debt (dist artifacts, new JS files) will accumulate.

## Decision

-   Add guardrail scripts executed by `yarn validate` to enforce:
    -   no changes under dist
    -   no new tracked .js/.mjs/.cjs files
    -   structural changes require an ADR and ADR index update
    -   OpenAPI changes require regenerated types and mock updates
-   Add a minimal CI workflow that runs `yarn validate` on every PR.
-   Provide a PR template and a structural-change protocol for consistent process.

## Constraints

-   No UI tests.
-   Guardrails are monotonic: they only tighten over time.

## Consequences

### Positive

-   Prevents new debt and structural drift.
-   Ensures consistent behavior across agents and CI.

### Negative / Risks

-   Guardrails can block changes if misconfigured and must be maintained carefully.

## Implementation plan

-   [ ] Add guardrail scripts under `scripts/` and wire into `yarn validate`.
-   [ ] Add CI workflow running `yarn validate`.
-   [ ] Add PR template and structural change protocol.

## Verification

-   `yarn validate`
-   Manual checks:
    -   Modify a file under `dist/` and expect `repo:ratchet` to fail.
    -   Add a new `.js` file and expect `repo:ratchet` to fail.
    -   Modify a structural file without updating ADRs and expect `repo:structural-adr` to fail.
