# ADR 0044: Internal game-mode registry + ruleset versioning (no external extensibility)

-   Status: Accepted
-   Date: 2026-02-02
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup is multi-game-mode and multi-sport, but remains a single product. We need stable, auditable rulesets and historical correctness without introducing an external extension host (manifest/activation) prematurely. Business docs mandate tournament-centric play, versioned rulesets, and immutable historical results.

## Decision

-   No external extension contract (manifest/activation/host) for now.
-   Introduce an internal **game-mode registry** with **versioned rulesets**.
-   Rulesets are **global per game mode**; tournaments reference a specific `rulesetVersionId`.
-   Entities that depend on rules must store `gameModeId` and `rulesetVersionId`.
-   Historical results are immutable: **no migrations** between ruleset versions.
-   Corrections are new snapshots under the **same ruleset version**, with audit metadata.
-   Ruleset statuses:
    -   `active`: selectable for new tournaments
    -   `deprecated`: visible but not selectable
    -   `retired`: hidden in UI but resolvable for history
-   Registry read endpoints are available to app clients; write endpoints are staff-only.

## Derived requirements

-   Registry resolves: `gameModeId` → `{ rulesets[], latestVersionId }`.
-   Ruleset snapshots carry audit fields:
    -   `rulesetVersionId`, `gameModeId`, `status`
    -   `createdAt`, `createdBy { id, type }`
    -   `reasonCode`, `reasonText`
    -   `correlationId`, `parentVersionId`
    -   `schemaHash`, `source`
-   Tournament snapshots include `gameModeId`, `rulesetVersionId`, and audit metadata.

## Consequences

### Positive

-   Historical rankings/replays remain consistent and auditable.
-   Clear separation between internal registry and future external extensibility.
-   Enables gradual evolution of rulesets without breaking past tournaments.

### Negative / Risks

-   Requires more explicit metadata in contracts and storage.
-   Introduces staff tooling needs for ruleset publication/retirement.

## Alternatives considered

-   Full extension host now (rejected: premature complexity).
-   Per-tournament custom rulesets (rejected: increases fragmentation and audit burden).

## Implementation plan

-   Update business + domain contract docs to include registry, ruleset states, and audit fields.
-   Update pending decision P-0007 as resolved by this ADR.
-   Add OpenAPI endpoints in the contract spec when the API spec migration begins.

## Verification

-   `docs/negocio/documento-fundacional-rankup.md` references internal registry and immutable historical rules.
-   `docs/negocio/documento-contratos-dominio-rankup.md` reflects ruleset versioning, statuses, and audit fields.
-   `docs/adr/PENDING.md` no longer lists P-0007 as pending.
