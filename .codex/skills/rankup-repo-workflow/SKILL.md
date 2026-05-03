---
name: "rankup-repo-workflow"
description: "Workflow for Rankup agents: pick the right epic/WP, respect guardrails, record evidence (yarn validate), keep PRs small and conflict-free."
owner: "rankup"
scope: "workflow"
---

# Skill: Rankup repo workflow (entry, WPs, evidence)

## Purpose

Provide a deterministic workflow for agents to:

-   pick the correct epic/WP
-   avoid guardrail violations
-   record reproducible evidence (commands + outputs)
-   keep PRs small and conflict-free

## Preconditions

-   You have read:
    -   `AGENTS.md`
    -   `docs/work/START-HERE.md`
    -   `docs/engineering/structural-change-protocol.md`
    -   `docs/adr/README.md` (especially ADRs about layering + OpenAPI + guardrails)

## Non-negotiables

-   Do NOT edit generated artifacts by hand (e.g. `dist/`), follow repo artifact policy.
-   OpenAPI is source-of-truth: do not patch generated clients manually.
-   UI must not import platform/browser implementations or API implementations (see ADR 0010).
-   Prefer additive, reversible changes. Keep PR scope to a single WP.

## Workflow (per WP)

1. Identify the WP file under `docs/work/epics/` and copy its DoR/DoD checklist into your PR description.
2. Create a branch named `wp-<epic>-<wp>-<short-title>`.
3. Before coding:

-   run `yarn validate` and capture result (PASS/FAIL)
-   run `yarn lint` if the WP touches lint rules

4. Implement only the WP scope.
5. After coding:

-   run `yarn validate`
-   run targeted ripgrep checks mentioned in the WP (if any)

6. Update evidence in `docs/work/log/YYYY-MM-DD.md`:

-   commands executed
-   PASS/FAIL
-   short summary of what changed

## Evidence format (log)

-   Command: `<cmd>`
-   Result: PASS/FAIL
-   Notes: `<one paragraph>`

## Merge safety

-   Avoid hotspots by extracting new modules rather than editing shared ones.
-   If you must touch a hotspot file, keep it to a minimal diff and do it in only one WP.
