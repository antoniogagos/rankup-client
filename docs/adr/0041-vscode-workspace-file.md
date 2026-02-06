# ADR 0041: VS Code multi-root workspace file

-   Status: Accepted
-   Date: 2026-02-01
-   Owners: Rankup maintainers
-   Scope: repo (tooling)

## Context

Rankup is a multi-package repo and most contributors use VS Code. We already ship editor defaults under `.vscode/`, but there is no shared multi-root workspace file, so each contributor rebuilds the same folder list and settings when they want a multi-root workspace.

## Decision

Add an optional VS Code multi-root workspace file at the repo root (`rankup-client.code-workspace`) that:

-   lists the core packages + docs/assets/scripts folders for navigation
-   mirrors the existing `.vscode` settings and extension recommendations
-   remains optional (no build or tooling dependency on the workspace file)

## Constraints

-   No new runtime/tooling dependencies.
-   Keep repo guardrails intact (TS-only sources, tabs-only indentation).
-   Do not replace `.vscode` defaults; the workspace file is additive.

## Consequences

### Positive

-   Faster onboarding and navigation across packages.
-   Consistent editor setup when opening the workspace file.

### Negative / Risks

-   Settings are duplicated between `.vscode` and the workspace file.
-   Folder list may need updates if the repo layout changes.

## Alternatives considered

-   Keep only `.vscode` settings and let contributors create their own workspace files.
-   Document a manual workspace setup guide instead of shipping a file.

## Implementation plan

-   [x] Add `rankup-client.code-workspace` at the repo root.
-   [x] Update work tracking + ADR index.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/engineering/structural-change-protocol.md`
