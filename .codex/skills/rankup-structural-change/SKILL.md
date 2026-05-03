---
name: "rankup-structural-change"
description: "Structural change protocol for Rankup. Use when renaming/moving packages, changing boundaries, introducing new layers, or any large refactor: create/update ADRs, follow repo guardrails."
owner: "rankup"
scope: "repo-structure"
---

# Rankup: Structural change protocol

## Objective

Make large-scale changes (boundaries, layering, package structure) without breaking repo invariants or creating unreviewable diffs.

## Trigger / Use when

-   You need to move/rename folders or packages.
-   You are changing architectural boundaries (UI/platform/domain/api).
-   You are introducing a new cross-cutting mechanism (e.g., DI, service catalog).
-   You are changing import policies or enforcement rules.

## Hard guardrails (must hold)

-   Follow the ADR process (`docs/adr/**`) and the repo structural-change protocol (`docs/engineering/**`).
-   Do not bundle structural work with feature work unless the WP explicitly requires it.
-   Keep changes incremental; prefer "greenfield-breaking-changes-allowed" only if the repo explicitly says so.
-   Always end with `yarn validate` green.

## Workflow

1. **Classify the change**

-   If it changes boundaries/import rules/package layout, treat it as structural.

2. **Write/Update ADR**

-   Use `docs/adr/0000-template.md` as baseline.
-   Add the ADR to the correct index (e.g., pending list) per repo process.

3. **Update work tracking**

-   Update the relevant epic/WP doc under `docs/work/**`.
-   Add risk notes and clear verification steps (commands + expected output).

4. **Implement incrementally**

-   One boundary at a time.
-   Avoid touching unrelated code.

5. **Enforce and verify**

-   Run `yarn validate`.
-   Run `yarn lint` if available.
-   Add evidence in `docs/work/log/YYYY-MM-DD.md` if that’s the repo norm.

## Done criteria

-   ADR updated and consistent with implementation.
-   Work tracking updated with DoR/DoD and evidence.
-   Validation green.

## Common failure modes

-   Structural diff too large to review.
-   Enforcement added too early and blocks migrations.
-   ADR and code drift apart.
