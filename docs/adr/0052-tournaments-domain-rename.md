# ADR 0052: Rename tourney domain folder to tournaments

-   Status: Accepted
-   Date: 2026-02-03
-   Owners: Rankup maintainers
-   Scope: packages/rankup, apps/rankup-spa, docs

## Context

Rankup Engine is adopting a broader domain partitioning plan. The current domain umbrella is located at `packages/rankup/src/domains/tourney`, but the business language and the partitioning proposal use `tournaments`.
Keeping the old path creates drift between business terminology and code, and it complicates the upcoming split of domains (tournaments, scoring, submissions, etc.).

## Decision

Rename the domain folder from:

-   `packages/rankup/src/domains/tourney`

to:

-   `packages/rankup/src/domains/tournaments`

Update all imports and docs to the new path with no compatibility shims. Service identifiers (`ITourney*`) remain unchanged for now to minimize churn.

## Constraints

-   No legacy/compatibility shims (greenfield mode).
-   OpenAPI-first and mock-first remain enforced.
-   UI consumes only domain contracts/services (no SDK or implementations).
-   Composition root remains the only place selecting mock vs real implementations.

## Consequences

### Positive

-   Aligns code structure with business terminology and the domain partitioning proposal.
-   Establishes a clean path for future domain splits.

### Negative / Risks

-   Touches many import paths and docs; requires careful updates to avoid broken references.

## Alternatives considered

-   Keep `tourney` path and defer rename (rejected: increases drift and future migration cost).
-   Add an alias path for backward compatibility (rejected: violates no-legacy/compatibility shims).

## Implementation plan

-   [ ] Rename folder to `packages/rankup/src/domains/tournaments`.
-   [ ] Update all references and docs to the new path.
-   [ ] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/architecture/rankup-engine-domain-partitioning.md`
