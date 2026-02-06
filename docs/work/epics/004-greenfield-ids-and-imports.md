# Epic 004: Greenfield + canonical IDs + package imports

## Goal

Record greenfield mode and canonical identifiers, and enforce stable workspace import names without deep imports.

## Checklist

-   [x] Add ADR 0013 (greenfield: breaking changes allowed)
-   [x] Add ADR 0014 (canonical IDs + workspace package names)
-   [x] Add ADR 0015 (agent entry guardrail)
-   [x] Update scope decisions and glossary with canonical IDs
-   [x] Normalize workspace package names to `@rankup/*`
-   [x] Remove TS path aliases for `@rankup/api/*` and `@rankup/api-mock/*`
-   [x] Add ESLint rule to forbid deep imports from `@rankup/api/*` and `@rankup/api-mock/*`
-   [x] Add guardrail requiring AGENTS.md + CURRENT for structural changes
-   [x] Update work tracking (CURRENT + log)

## Verification

-   `rg -n "@api\\b|@common\\b|@samba\\b" packages docs`
-   `yarn lint`
-   `yarn validate`

## Status

-   Status: Done
-   Verification: `yarn validate` PASS recorded in `docs/work/log/2026-01-30.md`

## Notes

-   The checklist items are implemented; the remaining work is operational verification + recording evidence.
-   Next epic is Epic 005 (TS-only compliance + toolchain unification).
-   Latest `yarn validate` failed due to `repo:guardrails` failing to run `tsx` (IPC EPERM, Node v22.17.0). Composite declaration fixes applied for `packages/api` and `packages/api-mock`; re-run validation in a compatible environment and record outcome. See work log for details.
-   Repo-local Codex skills now include YAML frontmatter and Epic 002 subskills to enforce the service model workflow.
