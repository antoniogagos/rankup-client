# ADR 0058: Lit Localize msg() explicit-id policy and global guardrail

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: apps/*, packages/*, repo guardrails

## Context

The repository used `msg()` from `@lit/localize` with mixed conventions, and many calls had no explicit `id`.

This produced unstable localization keys and inconsistent extractability.

## Decision

-   Every `msg()` call must include an explicit `id` in options.
-   `id` format is restricted to dot-separated lowercase alphanumeric tokens:
    -   `^[a-z0-9]+(\.[a-z0-9]+)*$`
-   Enforce the rule globally via `scripts/repo-guardrails.ts` (new `runLitLocalizeMsgIdGuardrail`).
-   Backfill existing code with a one-time codemod (`scripts/localize-add-msg-ids.ts`) using deterministic path+position IDs where missing.

## Constraints

-   Guardrail must be deterministic and CI-friendly.
-   Guardrail must parse actual TypeScript AST (no regex-only heuristics for msg options).
-   Existing `msg()` usage in both app and package code must satisfy the same rule.

## Consequences

### Positive

-   Stable localization identifiers across the codebase.
-   Future localization work has enforceable consistency.
-   New code cannot regress to implicit IDs.

### Negative / Risks

-   Big-bang backfill creates many localized ID changes in one revision.
-   Generated IDs from codemod are mechanically valid but not always semantically perfect.

## Verification

-   `node --import tsx scripts/localize-add-msg-ids.ts`
-   `yarn validate`

Expected: PASS
