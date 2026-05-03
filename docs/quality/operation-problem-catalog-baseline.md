# Baseline Operation Problem Catalog (Epic 010 / AC-010-F3-11)

Fecha: 2026-02-06

## Scope

Este catálogo publica el mapeo operativo `operationId -> status + Problem.code` para la baseline de paridad (Epic 010).

Fuentes:

- `diagnostics/parity-baseline-operations.json` (set bloqueante de operations)
- `diagnostics/parity-baseline-problem-codes.json` (mapeo per-operation)
- `packages/rankup/src/runtime/errors.ts` (taxonomía estable de `Problem.code`)

## Rules

- Cada `operationId` de baseline debe estar asignado a un perfil de errores.
- Un perfil define un conjunto estable de pares `status + Problem.code`.
- El perfil representa el **envelope normativo** de errores para esa operación:
  - una operación puede no emitir todos los códigos del perfil en todos los paths,
  - pero no debe salir de la taxonomía publicada sin actualizar este catálogo.

## Profiles

### `genericProtectedOperation`

- `403 forbiddenRole`
- `404 notFound`

### `joinOperation`

- `403 forbiddenRole`
- `404 notFound`
- `409 tournamentArchived`
- `409 tournamentCancelled`
- `409 joinClosed`
- `409 tournamentLocked`
- `409 tournamentFull`
- `409 idempotencyKeyReused`

### `submissionUpsertOperation`

- `403 forbiddenRole`
- `403 notMember`
- `404 notFound`
- `409 tournamentLocked`
- `409 matchdayClosed`
- `409 idempotencyKeyReused`
- `412 etagMismatch`

### `submissionClearOperation`

- `403 forbiddenRole`
- `403 notMember`
- `404 notFound`
- `409 matchdayClosed`
- `409 idempotencyKeyReused`

### `publicReadOperation`

- `404 notFound`

## Per-operation mapping

El mapeo completo per-operation vive en `diagnostics/parity-baseline-problem-codes.json` (`operationProfiles`).

Resumen por operación:

| operationId | profile |
| --- | --- |
| `archiveTournament` | `genericProtectedOperation` |
| `clearMyMatchdaySubmission` | `submissionClearOperation` |
| `createDuel` | `genericProtectedOperation` |
| `createDuelRematch` | `genericProtectedOperation` |
| `createTournament` | `genericProtectedOperation` |
| `deleteTournament` | `genericProtectedOperation` |
| `getMatchdayResultsSummary` | `genericProtectedOperation` |
| `getMyMatchdayResults` | `genericProtectedOperation` |
| `getMyMatchdaySubmission` | `genericProtectedOperation` |
| `getMyTournamentMatchdayRankingWindow` | `genericProtectedOperation` |
| `getMyTournamentSeasonRankingWindow` | `genericProtectedOperation` |
| `getTournament` | `genericProtectedOperation` |
| `getTournamentMatchday` | `genericProtectedOperation` |
| `getTournamentMatchdayAvailability` | `genericProtectedOperation` |
| `getTournamentRules` | `genericProtectedOperation` |
| `getUserMatchdayResults` | `genericProtectedOperation` |
| `getUserMatchdaySubmission` | `genericProtectedOperation` |
| `getUserPublicProfile` | `publicReadOperation` |
| `joinTournament` | `joinOperation` |
| `joinTournamentByInvitationCode` | `joinOperation` |
| `listDiscoverableTournaments` | `genericProtectedOperation` |
| `listCompetitions` | `genericProtectedOperation` |
| `listMatchdaySubmissions` | `genericProtectedOperation` |
| `listMyDuels` | `genericProtectedOperation` |
| `listMyTournaments` | `genericProtectedOperation` |
| `listTournamentMatchdayMatches` | `genericProtectedOperation` |
| `listTournamentMatchdayRanking` | `genericProtectedOperation` |
| `listTournamentMatchdays` | `genericProtectedOperation` |
| `listTournamentSeasonRanking` | `genericProtectedOperation` |
| `listTournamentUpdates` | `genericProtectedOperation` |
| `lockTournament` | `genericProtectedOperation` |
| `oauthAuthorize` | `genericProtectedOperation` |
| `oauthTokenExchange` | `genericProtectedOperation` |
| `streamTournamentLive` | `genericProtectedOperation` |
| `transferTournamentOwnership` | `genericProtectedOperation` |
| `unarchiveTournament` | `genericProtectedOperation` |
| `unlockTournament` | `genericProtectedOperation` |
| `updateTournament` | `genericProtectedOperation` |
| `upsertMyMatchdaySubmission` | `submissionUpsertOperation` |
