# ADR 0015: Agent entry guardrail (AGENTS.md + CURRENT required)

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Agents can operate with limited context. To prevent drift, we require a forced entrypoint for structural work so every agent re-reads the canonical instructions and the current work state.

## Decision

-   Any structural change must include updates to:
    -   `AGENTS.md`
    -   `docs/work/CURRENT.md`
-   This is enforced via a guardrail executed in `repo:guardrails` and therefore in `yarn validate`.

## Constraints

-   No UI tests.
-   Guardrails are monotonic; do not weaken without an ADR.

## Consequences

### Positive

-   Ensures every structural change re-anchors to canonical guidance and current work.
-   Reduces context drift across agents.

### Negative / Risks

-   Adds a small process step (touching two files) for structural changes.

## Implementation plan

-   [ ] Add `scripts/repo-agent-entry.ts` guardrail.
-   [ ] Wire the guardrail into `repo:guardrails`.

## Verification

-   With a structural change staged, omit updates to `AGENTS.md` or `docs/work/CURRENT.md`.
-   Expected: `repo:agent-entry` fails and `yarn validate` fails.
