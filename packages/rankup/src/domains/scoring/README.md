# Scoring domain layout

This domain owns scoring outputs (rankings, results, snapshots). It currently hosts the tournament ranking capability under `ranking/`.

## Source of truth

- Business intent: `docs/negocio/documento-contratos-dominio-rankup.md`
- Bounded context ownership: `docs/negocio/documento-contextos-rankup.md`
- HTTP contract: `packages/api/openapi.yaml`

## Folder map

- `shared/`: cross-capability types (future).
- `ranking/`: tournament rankings + ranking windows.
- `results/`: results snapshots (future).
- `timeline/`: ranking timeline deltas (future).

Each capability (`ranking/`, ...) contains:

- `models/`: pure data (DTOs, IDs, enums usage). No IO.
- `contracts/`: service interfaces and `contracts/types.ts` for UI consumption.
- `services/`: runtime implementations (delegate to gateways).
- `validation/`: pure validators (no IO).

## Dependency direction

`<capability>/models` -> `<capability>/contracts` -> `<capability>/services` -> app UI.
Runtime services must never be imported by UI packages.

## UI usage

UI code must import only from `<capability>/contracts/**` and must never import runtime implementations.

## Guardrails

- No `@rankup/api` inside the domain. Use app-owned gateways.
- No direct `fetch()` usage.
- No platform `browser/**` imports in UI packages.
