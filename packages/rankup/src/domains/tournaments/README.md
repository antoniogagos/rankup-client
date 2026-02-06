# Tournaments domain layout

This domain packages tournament lifecycle, matchday navigation, membership, and invitation flows under `packages/rankup/src/domains/tournaments`.
It follows a Hadron-style capability split so each surface maps cleanly to OpenAPI.

## Source of truth

- Business intent: `docs/negocio/documento-contratos-dominio-rankup.md`
- Bounded context ownership: `docs/negocio/documento-contextos-rankup.md`
- HTTP contract: `packages/api/openapi.yaml`

## Folder map

- `shared/`: cross-capability types (IDs, enums, user summary) and shared validators.
- `core/`: tournament lifecycle + preview (list/create/get preview).
- `preview/`: placeholder for a future preview split.
- `matchdays/`: matchday navigation, matches, availability.
- `members/`: membership and roles.
- `codes/`: invitation codes (resolve + join by code).
- `invites/`: direct invites + inbox actions.
- `fixtures/`: deterministic sample data.

Chat/live/stats/recaps/updates live under `packages/rankup/src/domains/engagement`.
Submissions live under `packages/rankup/src/domains/submissions`.
Results/rankings live under `packages/rankup/src/domains/scoring`.
Pure algorithms live under `packages/rankup/src/algorithms`.

Each capability (`core/`, `matchdays/`, ...) contains:

- `models/`: pure data (DTOs, IDs, enums usage). No IO.
- `contracts/`: service interfaces and `contracts/types.ts` for UI consumption.
- `services/`: runtime implementations (delegate to gateways).
- `validation/`: pure validators (no IO).

## Dependency direction

`shared/models` -> `<capability>/models` -> `<capability>/contracts` -> `<capability>/services` -> app UI.
Runtime services must never be imported by UI packages.

## UI usage

UI code must import only from `<capability>/contracts/**` (or `shared/` for shared types) and must never import runtime implementations.

## Guardrails

- No `@rankup/api` inside the domain. Use app-owned gateways.
- No direct `fetch()` usage.
- No platform `browser/**` imports in UI packages.
