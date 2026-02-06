# Structural change protocol

This protocol applies to any change that affects architecture, tooling, build, packaging, API integration, auth/session, or workspace boundaries.

## Required steps

1. Create or update an ADR describing the decision.
2. If the change touches OpenAPI, follow `docs/engineering/openapi-change-protocol.md`.
3. Update the ADR index: `docs/adr/README.md`.
4. Implement the change in small, reversible increments.
5. Add or update verification steps (scripts or commands).
6. Run `yarn validate` and ensure it passes.

## Required artifacts in a PR

-   ADR link (new or updated).
-   Verification commands and results.
-   Any scope or quality doc updates that keep the repo consistent.

## Checks

-   `yarn validate` must pass.
-   Guardrails must pass (no new JS files, no dist changes, ADR required for structural changes).
