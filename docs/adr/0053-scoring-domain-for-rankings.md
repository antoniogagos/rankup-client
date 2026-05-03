# ADR 0053: Move rankings into the scoring domain

-   Status: Accepted
-   Date: 2026-02-03
-   Owners: Rankup maintainers
-   Scope: packages/rankup, apps/rankup-spa, docs

## Context

After the tournament capability split, ranking lived under `packages/rankup/src/domains/tournaments/ranking`.
The Rankup Engine partitioning proposal defines scoring as its own domain, owning rankings and snapshots.
Keeping rankings inside tournaments mixes concerns and complicates future scoring work (results, timeline, ranked/achievements dependencies).

## Decision

Create `packages/rankup/src/domains/scoring` and move the ranking capability to `domains/scoring/ranking`.
Update registration in the composition root and update imports in app gateways and UI.
Service identifiers remain `ITournamentRanking*` for now to avoid churn.

## Constraints

-   No legacy/compatibility shims (greenfield mode).
-   OpenAPI-first and mock-first remain enforced.
-   UI consumes only domain contracts/services (no SDK or implementations).
-   Composition root remains the only place selecting mock vs real implementations.

## Consequences

### Positive

-   Aligns domain ownership with the partitioning plan.
-   Keeps scoring growth (results/timeline/ranked) separate from tournament lifecycle.

### Negative / Risks

-   Scoring currently depends on tournaments shared types/validation; future refactors may move shared types higher.

## Alternatives considered

-   Keep ranking inside tournaments (rejected: increases coupling with scoring evolution).
-   Add a compatibility alias path (rejected: violates no-legacy/compatibility shims).
-   Rename service identifiers now (deferred to avoid churn).

## Implementation plan

-   [ ] Create the scoring domain folder with README/index.
-   [ ] Move ranking capability to `domains/scoring/ranking`.
-   [ ] Register scoring services in the composition root.
-   [ ] Update app services/gateways/UI imports and docs.
-   [ ] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/architecture/rankup-engine-domain-partitioning.md`
-   Epic: `docs/work/epics/008-domain-tournament-boundaries.md`
