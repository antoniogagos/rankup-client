# Rankup Engine — Baseline Inputs for VSCODE Architects

Este documento adjunta los **insumos mínimos** solicitados por el equipo de VSCODE para poder producir “Rankup Engine — Architecture Baseline v1”.

## 1) OpenAPI extract (scoring/submissions/tournaments)

Archivo generado desde `packages/api/openapi.yaml` y filtrado por tags de torneos, submissions y scoring. Para cumplir el límite de 5k LOC se eliminaron campos no esenciales (`description`, `summary`, `examples`, `title`, `externalDocs`) y se conservaron únicamente paths y components referenciados por `$ref`.

Path: `docs/architecture/vscode-openapi-extract.yaml` (≤ 5k LOC)

Tags incluidos: `tournaments`, `tournaments.core`, `tournaments.lifecycle`, `tournaments.preview`, `tournaments.matchdays`, `tournaments.members`, `tournaments.invites`, `tournaments.invitationCodes`, `tournaments.duels`, `tournaments.rankings`, `tournaments.results`, `tournaments.submissions`, `me.tournamentInvites`.

Nota: el extract mantiene `components` completo para preservar referencias `$ref`.

## 2) Contratos de negocio (extractos D.9 y D.10)

Origen: `docs/negocio/documento-contratos-dominio-rankup.md`.

### D.9 Submissions (modo-agnóstico)

Agregados:

- `SubmissionSet` (userId+tournamentId+matchday), `SubmissionItem`, state `draft|submitted|locked`

Comandos:

- `UpsertSubmissionSet(userId, tournamentId, matchday, items[])`
- `SubmitSubmissionSet(userId, tournamentId, matchday)` *(si distinguís draft vs submit)*
- `LockSubmissionSet(tournamentId, matchday)` (interno por lockPolicy/kickoff)

Lecturas:

- `GetMySubmissionSet(userId, tournamentId, matchday)`
- `GetSubmissionAvailability(userId, tournamentId, matchday)` (open/closed + reason)

Eventos publicados:

- `submission.upserted`, `submission.submitted`, `submission.locked`

Eventos consumidos:

- `sports.match_status_changed` / kickoff para lock
- membership changes para permisos

Invariantes / fallos:

- No edits tras lock.
- Validación por ruleset efectivo.
- Idempotencia fuerte.

### D.10 Scoring & Rankings

Agregados:

- `ScoreLedger`, `RankingSnapshot`, `PositionTimeline`, `ScoreCorrection`

Comandos (internos):

- `ApplyMatchFinished(matchId)` (deriva puntos si procede)
- `RecomputeTournament(tournamentId, reason, scope?)`
- `PublishRankingSnapshot(tournamentId, scope: matchday|total)`

Lecturas:

- `GetRanking(tournamentId, scope, view: topN|aroundMe, cursor)`
- `GetMatchdayResults(tournamentId, matchday)` (puntos por match)
- `GetUserScoreBreakdown(tournamentId, userId)`
- `GetPositionTimeline(tournamentId, userId)` (para live + wrapped)

Eventos publicados:

- `scoring.user_points_changed`
- `ranking.snapshot_published`
- `ranking.corrected`

Eventos consumidos:

- `submission.locked/submitted`
- `sports.match_finished`
- `sports.match_corrected`

Invariantes / fallos:

- Ranking snapshots incluyen `gameModeId` + `rulesetVersionId` y metadata de auditoría.
- Recomputable + auditable.
- Snapshots versionados (correcciones crean nueva versión).
- Rendimiento: precompute “aroundMe”.
