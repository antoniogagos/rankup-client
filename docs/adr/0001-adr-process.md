# ADR 0001: ADR process and decision logging

-   Status: Accepted
-   Date: YYYY-MM-DD
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup will be developed via vibecoding. Without enforced decision records, architectural drift and contradictory changes are likely.

## Decision

-   We will maintain Architecture Decision Records under `docs/adr/`.
-   Any change affecting architecture, build/tooling, packaging, API integration, auth/session, or cross-package boundaries requires an ADR.
-   Decisions that cannot be made due to missing context must be recorded in `docs/adr/PENDING.md` with explicit “info required”.

## Constraints

-   No UI tests.
-   Prefer small, reversible PRs.

## Consequences

### Positive

-   Decisions are auditable, reversible, and reproducible.
-   Codex has explicit constraints and rationale.

### Negative / Risks

-   Slight overhead in PRs (writing ADR).

## Alternatives considered

-   Single `DECISIONS.md` log (rejected: becomes unstructured quickly).

## Implementation plan

-   [ ] Add `docs/adr/` folder and template
-   [ ] Add ADR index
-   [ ] Add `PENDING.md`

## Verification

-   Files exist:
    -   `docs/adr/README.md`
    -   `docs/adr/0000-template.md`
    -   `docs/adr/0001-adr-process.md`
    -   `docs/adr/PENDING.md`
