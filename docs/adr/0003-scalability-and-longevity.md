# ADR 0003: Scalability and longevity (no explicit LOC cap)

-   Status: Accepted
-   Date: YYYY-MM-DD
-   Owners: Rankup maintainers
-   Scope: repo

## Context

An earlier assumption limited the repository size (~100k–300k LOC). This assumption is no longer valid. Rankup must be built with foundations comparable to long-lived codebases (e.g. VS Code practices): strict module boundaries, explicit extension points, and stable internal APIs to support sustained growth without rewrites.

## Decision

-   We remove any explicit LOC cap from the repository constraints.
-   We treat Rankup as a long-lived codebase: architecture must not rely on being small.
-   We will enforce:
    -   clear package boundaries and one-way dependency rules
    -   explicit extension points (registries) for game modes and sports
    -   stable module APIs and minimal cross-package leakage

## Constraints

-   No UI tests.
-   Prefer small, reversible PRs.
-   Decisions must be recorded as ADRs with verification steps.

## Consequences

### Positive

-   Architecture remains valid as the codebase grows.
-   Lower probability of “big rewrite” events.

### Negative / Risks

-   Slightly higher upfront structure work.
-   More discipline required in dependency management.

## Alternatives considered

-   Keeping an explicit size cap (rejected: contradicts current goals and encourages shortcuts).

## Implementation plan

-   [ ] Remove LOC cap from `docs/scope/README.md`.
-   [ ] Ensure checklists and future ADRs do not assume a maximum repo size.

## Verification

-   `docs/scope/README.md` contains no LOC size cap.
-   ADR index includes ADR 0003.
