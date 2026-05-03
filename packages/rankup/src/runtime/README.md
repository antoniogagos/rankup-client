# Rankup Engine Runtime (Baseline v1)

El runtime del engine vive en `packages/rankup/src/runtime/**` y orquesta casos de uso sin dependencias de UI/browser.

## Capas

- `domains/**`: contratos/modelos de negocio.
- `algorithms/**`: scoring, tie-breakers y lock rules puros.
- `registry/**`: definiciones inmutables (`football`, `scorePrediction`, `rulesetId` versión).
- `runtime/**`: use-cases y puertos IO.

## Use-cases baseline

- `JoinTournamentUseCase`
- `UpsertMatchdaySubmissionUseCase`
- `ClearMatchdaySubmissionUseCase`
- `ApplyMatchFinishedUseCase`
- `RecomputeTournamentUseCase`
- `EvaluateTournamentLifecycleUseCase`
- `CancelTournamentUseCase` (staff override)

## Reglas P0 implementadas

- Idempotencia fuerte por scope `(actorId, operationId, resourceKey, idempotencyKey)`.
- Reuso conflictivo de key con fingerprint distinto => `409 idempotencyKeyReused`.
- Concurrency por `If-Match` / `ETag` versionado (`"v{n}"`), mismatch => `412 etagMismatch`.
- Dedupe de eventos deportivos at-least-once por `eventId` y por fingerprint de resultado.
- Snapshots de ranking versionados con lineage (`parentSnapshotId`).
- Evaluación reproducible de lifecycle (`finished`) cuando todos los matches del torneo están `final|void`.
- Transición `cancelled` explícita por override de staff, con lock forzado para bloquear joins/submissions.

## Testing

Ejecutar:

- `yarn engine:test`

Cobertura mínima baseline:

- idempotency/replay
- if-match/etag
- locks global vs parcial
- recompute + dedupe de eventos
- tie-breakers deterministas
