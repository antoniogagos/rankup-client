---
name: "rankup-epic-002-guardrails-eslint"
description: "Epic 002 guardrails skill: enforce UI import boundaries via ESLint (no instantiation, no platform browser, no env, api-mock allowlist)."
owner: "rankup"
epic: "002"
wp: "002-06"
---

# Skill: Epic 002 guardrails (ESLint import restrictions)

## Purpose

Enforce architecture invariants via lint:

-   UI cannot import platform instantiation primitives
-   UI cannot import platform/browser implementations
-   UI cannot import env
-   `@rankup/api-mock` usage is allowlisted only in wiring

## Preconditions

-   Apply after the migration WP (WP-002-05) to avoid blocking progress.

## Constraints

-   Avoid false positives.
-   Keep allowlists minimal and documented.

## Verification

-   `yarn lint` PASS
-   `yarn validate` PASS
-   Manual negative test (not committed): add a forbidden import in UI and confirm lint fails
