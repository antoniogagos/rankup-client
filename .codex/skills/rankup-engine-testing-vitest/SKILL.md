---
name: "rankup-engine-testing-vitest"
description: "Engine-only Vitest workflow for Rankup Epic 010. Use when adding or refactoring deterministic runtime/algorithm tests under packages/rankup/test without introducing UI/browser tests."
owner: "rankup"
scope: "engine-testing"
---

# Rankup Skill: Engine Testing with Vitest

## Purpose

Standardize engine testing for Epic 010 with a single runner (`Vitest`) while preserving ADR 0002:

-   no UI/browser/component tests,
-   deterministic runtime/algorithm coverage only,
-   fast feedback for acceptance closure items (`AC-010-F3-*`).

## Required reading (repo-local)

-   `docs/adr/0002-testing-policy.md`
-   `docs/adr/0068-engine-test-platform-vitest-v1.md`
-   `docs/work/CURRENT.md`
-   `docs/work/epics/010-rankup-engine-vscode-baseline-v1.md`

## Invariants (hard rules)

-   Engine tests live under `packages/rankup/test/**`.
-   Test environment is Node-only (`vitest.engine.config.ts`).
-   No `node:test` or `node:assert/strict` imports in engine tests.
-   No `.only()` / `.skip()` in engine suites.
-   No UI/browser/happy-dom/playwright tests (ADR 0002).

## Workflow

1. Add or update deterministic fixtures/helpers in `packages/rankup/test/testkit/**`.
2. Write/adjust tests in `packages/rankup/test/**/*.test.ts` with `it/expect` from `vitest`.
3. Keep assertions stable and reproducible (fixed timestamps/seeded inputs).
4. Run:
    -   `yarn engine:test`
    -   `yarn validate`
5. Update work tracking (`CURRENT`, active epic, daily log, `AGENTS.md`) for structural changes.

## Anti-flake rules

-   Use fixed clocks and deterministic ids from runtime adapters/fixtures.
-   Avoid timing sleeps; assert on explicit outputs.
-   Prefer contract-level assertions (status/problem code/snapshot lineage) over incidental fields.

## Done means

-   `engine:test` passes with Vitest.
-   Guardrails pass (`repo:guardrails` blocks forbidden imports and `.only/.skip`).
-   Work tracking + verification evidence updated in `docs/work/log/YYYY-MM-DD.md`.
