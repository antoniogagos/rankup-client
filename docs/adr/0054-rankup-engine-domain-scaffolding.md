# ADR 0054: Scaffold Rankup Engine layers and domain placeholders

-   Status: Accepted
-   Date: 2026-02-03
-   Owners: Rankup maintainers
-   Scope: packages/rankup, docs

## Context

The Rankup Engine partitioning proposal defines engine-level layers (`shared/`, `algorithms/`, `registry/`, `runtime/`) and a broader set of domains beyond tournaments/scoring.
The codebase currently contains only `domains/tournaments` and `domains/scoring`, so aligning structure with the proposal requires at least minimal scaffolding to guide future work.

## Decision

Create minimal scaffolding (README placeholders) for engine layers and the proposed domains:

-   Engine layers: `shared/`, `algorithms/`, `registry/`, `runtime`.
-   Domains: `accounts`, `sports`, `rules`, `submissions`, `engagement`, `verified`, `ranked`, `achievements`, `media`, `trustSafety`, `promotions`, `creators`, `admin`.
-   Add placeholder folders for `tournaments/preview` and `scoring/shared|results|timeline` to match the proposed layout.

This change does not introduce new contracts or runtime implementations yet.

## Constraints

-   No legacy/compatibility shims (greenfield mode).
-   OpenAPI-first and mock-first remain enforced.
-   UI consumes only domain contracts/services (no SDK or implementations).
-   Composition root remains the only place selecting mock vs real implementations.

## Consequences

### Positive

-   Aligns repository structure with the domain partitioning plan.
-   Provides clear ownership boundaries for future implementation work.

### Negative / Risks

-   Adds placeholder folders that must be filled with real contracts later.

## Alternatives considered

-   Delay scaffolding until implementations exist (rejected: makes the partitioning plan harder to execute and review).

## Implementation plan

-   [ ] Add README placeholders for engine layers and domain folders.
-   [ ] Update partitioning docs and work tracking.
-   [ ] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/architecture/rankup-engine-domain-partitioning.md`
