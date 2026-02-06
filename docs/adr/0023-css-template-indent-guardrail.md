# ADR 0023: Lit css template indent guardrail

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Lit ` css\`` templates were being indented one extra level relative to the  `css\`` line.
This produces inconsistent formatting and makes diffs noisy when editing styles in UI
components. The repo already enforces formatting guardrails (imports, inline decorators),
so style templates should follow a consistent, enforced layout as well.

## Decision

Enforce a guardrail that requires the first non-empty line inside a ` css\`` template to align with the  `css\``line indentation (no extra indentation beyond the`css\``line), and require the closing backtick to align with the `css\`` line. This is enforced in`repo:guardrails` by parsing TypeScript and inspecting tagged templates.

## Constraints

-   No UI tests (ADR 0002).
-   Guardrails must remain TS-only and run inside `yarn validate` (ADR 0005 + ADR 0008).

## Consequences

### Positive

-   Consistent CSS template formatting across Lit components.
-   Cleaner diffs for style edits and less editor-driven indentation churn.

### Negative / Risks

-   Requires a one-time reformat across existing `css\`` templates.
-   Developers must align template content with the `css\`` line to satisfy guardrails.

## Alternatives considered

-   Rely on editor-specific formatting (rejected; not enforceable in CI).
-   Add a Prettier plugin for Lit templates (rejected; higher tooling footprint and not
    currently part of repo validation).

## Implementation plan

-   [x] Update `scripts/repo-guardrails.ts` with a Lit `css\`` indentation guardrail (including closing backtick alignment).
-   [x] Reformat existing ` css\`` templates to align with the  `css\`` line.
-   [x] Update work tracking docs and AGENTS guardrails list.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0008 (repo guardrails)
