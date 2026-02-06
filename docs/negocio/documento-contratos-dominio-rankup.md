# Rankup — Mapa de Contratos de Dominio (Formato B) (Refactor)

**Versión:** 2026-02-02
**Objetivo:** Definir *contratos de dominio* (comandos, lecturas, eventos, invariantes) por bounded context para construir OpenAPI por fases sin acoplar dominios.

> Este documento describe **qué significa** cada operación a nivel de negocio/arquitectura.
> La OpenAPI define **cómo** se expresa (paths/schemas), y debe ser trazable a estos contratos.

---

## A) Convenciones globales (aplican a todos los contextos)

### A.1 Identificadores
- IDs tipados: `userId`, `tournamentId`, `matchId`, `rulesetId`, `submissionSetId`, `mediaId`, `promotionId`, `rewardGrantId`, etc.
- Recomendación técnica: **ULID o UUIDv7** (ordenables; útiles para feeds).
- IDs canónicos (ASCII) para catálogos: `sportId`, `gameModeId`, `competitionId`.

### A.2 Tiempo
- Fechas RFC3339 UTC en contratos (`createdAt`, `updatedAt`, `occurredAt`).
- Evitar mezclar epoch en contratos; si existe, es derivado.

### A.3 Versionado y concurrencia
- Mutaciones críticas deben ser seguras ante overwrites:
  - `If-Match` con ETag, o
  - `expectedVersion` (int).
- Rulesets: **inmutables**. Cambios = nueva versión.
- Históricos: resultados/rankings se evalúan con el ruleset original; no hay migraciones entre versiones (correcciones = nuevos snapshots).

### A.4 Idempotencia
- Writes que crean/actualizan recursos deben aceptar `idempotencyKey`.
- Semántica: misma key + mismo actor + misma operación ⇒ mismo resultado.

### A.5 Paginación y “views” escalables
- Cursor-based: `pageSize`, `cursor`, `nextCursor`.
- Para rankings grandes: soportar vistas `topN` + `aroundMe`.

### A.6 Localización
- Contratos usan IDs canónicos; textos son localizables.
- Recomendación API: **no localizar rutas**. Locale por `Accept-Language` o param `locale`.

### A.7 Seguridad y clasificación de datos
- Separar claramente:
  - **public** (catálogos, políticas, promos públicas),
  - **authenticated** (perfil propio),
  - **member-only** (detalle de torneo),
  - **staff-only** (admin/backoffice).
- Staff-only siempre:
  - auth separado,
  - `X-Admin-Justification`,
  - audit log inmutable.

### A.8 “No espectador” con preview mínimo
- Detalle real del torneo (chat/ranking completo/submissions/histórico) requiere membership.
- Se permite un **Tournament Preview** limitado (teaser).

### A.9 Caching (criterio)
- Respuestas personalizadas o con signed URLs: `no-store`.
- Catálogos públicos: cache corto/medio según volatilidad.

---

## B) Contrato de eventos de dominio (envelope estándar)

### B.1 Envelope mínimo recomendado
- `eventId`
- `eventType` (string estable, p.ej. `tournament.member_joined`)
- `schemaVersion` (int)
- `producer` (boundedContext)
- `occurredAt` (UTC)
- `aggregate`:
  - `aggregateType`
  - `aggregateId`
  - `aggregateVersion`
- `correlationId` (traza request/flujo)
- `causationId` (evento previo)
- `payload` (objeto por `eventType`)

### B.2 Semántica de entrega
- At-least-once: consumidores idempotentes (dedupe por `eventId`).
- Ordering solo garantizable por `aggregateId` usando `aggregateVersion`.

---

## C) Context map (quién publica/consume)

- Sports → publica → Scoring, Live
- Rules → consultado por → Submissions, Scoring
- Tournaments → autoriza → Submissions, Chat, Rankings
- Verified → habilita → Ranked, Achievements, Promotions (elegibilidad)
- Scoring → publica → Ranked, Achievements, Live, Stats
- Trust & Safety → puede congelar/restringir → Chat, Ranked, Rewards
- Uploads/Media → sirve assets a → Profiles, Tournaments, Verified, Creators, Promotions
- Admin → opera sobre todo con auditoría

---

# D) Contratos por bounded context

> Formato:
> - **Agregados (propiedad)**
> - **Comandos (write contracts)**
> - **Lecturas (read contracts)**
> - **Eventos publicados**
> - **Eventos consumidos**
> - **Invariantes y fallos esperables**
> - **Autorización (policy)**

---

## D.1 Identity & Access

### Agregados
- `UserIdentity`, `Session`, `OAuthLink`, `PasswordReset`

### Comandos
- `RegisterUser(email|oauth, locale, country?)`
- `Authenticate(credentials|oauthCode)`
- `RefreshSession(refreshToken)`
- `RevokeSession(sessionId|refreshToken)`
- `RequestPasswordReset(email)`
- `ConfirmPasswordReset(token, newPassword)`
- `DeleteAccount(userId)` (requiere reauth)

### Lecturas
- `GetSessionContext(accessToken)` (interno)

### Eventos publicados
- `identity.user_registered`
- `identity.session_issued`
- `identity.session_revoked`
- `identity.user_deleted`

### Invariantes / fallos
- Rotación refresh tokens; revocación inmediata en delete.
- Registro idempotente (según política de email/identity).

### Autorización
- Público para register/login/reset.
- Autenticado para logout/delete.

---

## D.2 Profiles, Privacy & Devices

### Agregados
- `UserProfile`, `PrivacySettings`, `NotificationPreferences`, `Device`

### Comandos
- `UpdateProfile(userId, username, avatarMediaId?, bio?)`
- `UpdatePrivacy(userId, profileVisibility, historyVisibility, allowFriendRequests, allowFollows)`
- `UpsertDevice(userId, platform, pushToken, appVersion, locale)`
- `UpdateNotificationPreferences(userId, preferencesPatch)`

### Lecturas
- `GetMyProfile(userId)`
- `GetPublicProfile(viewerId, targetUserId)` (aplica privacidad + blocks)
- `ListMyDevices(userId)`

### Eventos publicados
- `profile.updated`, `privacy.updated`, `device.registered`, `preferences.updated`

### Invariantes / fallos
- Username pasa filtros + unicidad (si aplica).
- Cambios de privacidad deben reflejarse en “read models” y en feeds.

### Autorización
- Solo el propio usuario (writes).
- Reads según privacidad.

---

## D.3 Users Directory

### Agregados
- `PublicUserIndex` (read model derivado)

### Comandos
- Ninguno público; se deriva desde perfiles.

### Lecturas
- `SearchUsers(q, cursor)` (limitado, anti-scraping)
- `GetUserPublicProfile(userId)`

### Eventos consumidos
- `profile.updated`, `privacy.updated`, `trust.user_restricted`

### Invariantes / fallos
- Respeta blocks/privacidad.
- Rate limit fuerte.

---

## D.4 Social Graph

### Agregados
- `FriendRequest`, `Friendship`, `FollowEdge`, `BlockEdge`

### Comandos
- `SendFriendRequest(fromUserId, toUserId, message?)`
- `RespondFriendRequest(requestId, accept|decline)`
- `RemoveFriend(userId, friendId)`
- `FollowUser(followerId, followeeId)`
- `UnfollowUser(followerId, followeeId)`
- `BlockUser(blockerId, blockedId)`
- `UnblockUser(blockerId, blockedId)`

### Lecturas
- `ListFriends(userId)`
- `ListFollowers(userId)`
- `ListFollowing(userId)`
- `GetRelationship(viewerId, targetId)` (para UI)

### Eventos publicados
- `social.friend_requested`, `social.friend_accepted`, `social.user_followed`, `social.user_blocked`

### Invariantes / fallos
- Block domina: cancela follow + friend requests + invites.
- Anti-spam: límites diarios y por dispositivo.

---

## D.5 Sports Catalog & Schedule (ACL)

### Agregados
- `Sport`, `Competition`, `Season`, `Matchday`, `Match`, `Team`, `MatchEvent`

### Comandos (internos/ingesta)
- `UpsertMatch(...)`
- `RecordMatchEvent(matchId, providerEventId, type, minute, metadata)`
- `ChangeMatchStatus(matchId, newStatus)`
- `FinalizeMatch(matchId, result)`
- `CorrectMatch(matchId, correctedFields, reason)`

### Lecturas
- `ListCompetitions(sportId?, status?)`
- `GetCompetitionCalendar(competitionId, seasonId)`
- `GetMatchday(competitionId, seasonId, matchdayNumber)`
- `GetMatch(matchId)`

### Eventos publicados
- `sports.match_event_recorded`
- `sports.match_status_changed`
- `sports.match_finished`
- `sports.match_corrected`

### Invariantes / fallos
- Estado monotónico (LIVE no vuelve a NS).
- Corrección explícita y auditable.
- Dedupe por `providerEventId`.

---

## D.6 Game Modes & Rules

### Agregados
- `GameMode`, `RulesetSnapshot` (inmutable), `RulesetTemplate`

### Comandos (staff)
- `RegisterGameMode(gameModeId, capabilities, uiHints)`
- `PublishRulesetVersion(gameModeId, schema, scoring, tieBreakers, lockPolicy, parentVersionId?)`
- `DeprecateRulesetVersion(rulesetVersionId, sunsetAt?)`
- `RetireRulesetVersion(rulesetVersionId, reasonCode, reasonText?)`

### Lecturas
- `ListGameModes()` (resumen + latestVersionId)
- `GetGameMode(gameModeId)`
- `GetRulesetVersion(gameModeId, rulesetVersionId)`
- `GetLatestRulesetVersion(gameModeId)`
- `ResolveEffectiveRules(tournamentId)` (usa tournamentId → rulesetVersionId)

### Eventos publicados
- `ruleset.published`, `ruleset.deprecated`, `ruleset.retired`

### Invariantes / fallos
- Ruleset publicado no se edita; se versiona.
- Rulesets globales por gameMode; torneos apuntan a `rulesetVersionId`.
- Estados: `active` (seleccionable), `deprecated` (visible, no seleccionable), `retired` (oculto, resoluble histórico).
- Históricos inmutables: no migraciones entre ruleset versions; correcciones = nuevos snapshots.
- Validación de configuración por schema + hash de integridad.
- Auditoría mínima en snapshot: `createdAt`, `createdBy {id,type}`, `reasonCode`, `reasonText`, `correlationId`, `parentVersionId`, `schemaHash`, `source`.

---

## D.7 Tournaments & Membership

### Agregados
- `Tournament`, `TournamentMembership`, `JoinPolicy`, `InvitationCode`, `DirectInvite`, `TournamentSettings`

### Comandos
- `CreateTournament(ownerId, name, sportId, gameModeId, rulesetVersionId, competitionRef, seasonRef, modality, visibility, joinPolicy, settings)`
- `UpdateTournament(tournamentId, patch)` (limitado por estado)
- `RotateInvitationCode(tournamentId)`
- `JoinTournament(tournamentId, userId, invitationCode?)`
- `LeaveTournament(tournamentId, userId)`
- `KickMember(tournamentId, adminId, targetUserId, reason?)`
- `TransferOwnership(tournamentId, ownerId, newOwnerId)`
- `SetJoinPolicy(tournamentId, adminId, joinPolicyPatch)`
- `ArchiveTournament(tournamentId, adminId)`

### Lecturas
- `GetTournamentPreview(viewerId, tournamentId)` (pre-join safe)
- `GetTournament(tournamentId, memberId)` (requiere membership)
- `ListUserTournaments(userId, filters...)`
- `ListTournamentMembers(tournamentId, memberId)`

### Eventos publicados
- `tournament.created`, `tournament.updated`, `tournament.member_joined`, `tournament.member_left`, `tournament.member_kicked`, `tournament.archived`

### Eventos consumidos
- `verified.tournament_verified` (marca tournament como verified + branding)

### Invariantes / fallos
- No doble membership.
- No spectator: enforcement estricto.
- `gameModeId` + `rulesetVersionId` quedan fijados al crear el torneo.
- Cambios de rules/settings después de “start” deben ser muy limitados o versionados (nueva versión + nuevo snapshot).

---

## D.8 Tournament Matchdays (navegación)
> (Puede vivir como read model dentro de Tournaments o Sports; el contrato es lo importante.)

### Lecturas
- `ListTournamentMatchdays(tournamentId)` (qué matchdays existen / status)
- `GetTournamentMatchday(tournamentId, matchdayNumber)` (fixtures + estado)

### Invariantes
- Matchday status se deriva de matches + calendario real.
- Para torneos grandes, respuestas “ligeras” (paginación / lazy loading).

---

## D.9 Submissions (modo-agnóstico)

### Agregados
- `SubmissionSet` (userId+tournamentId+matchday), `SubmissionItem`, state `draft|submitted|locked`

### Comandos
- `UpsertSubmissionSet(userId, tournamentId, matchday, items[])`
- `SubmitSubmissionSet(userId, tournamentId, matchday)` *(si distinguís draft vs submit)*
- `LockSubmissionSet(tournamentId, matchday)` (interno por lockPolicy/kickoff)

### Lecturas
- `GetMySubmissionSet(userId, tournamentId, matchday)`
- `GetSubmissionAvailability(userId, tournamentId, matchday)` (open/closed + reason)

### Eventos publicados
- `submission.upserted`, `submission.submitted`, `submission.locked`

### Eventos consumidos
- `sports.match_status_changed` / kickoff para lock
- membership changes para permisos

### Invariantes / fallos
- No edits tras lock.
- Validación por ruleset efectivo.
- Idempotencia fuerte.

---

## D.10 Scoring & Rankings

### Agregados
- `ScoreLedger`, `RankingSnapshot`, `PositionTimeline`, `ScoreCorrection`

### Comandos (internos)
- `ApplyMatchFinished(matchId)` (deriva puntos si procede)
- `RecomputeTournament(tournamentId, reason, scope?)`
- `PublishRankingSnapshot(tournamentId, scope: matchday|total)`

### Lecturas
- `GetRanking(tournamentId, scope, view: topN|aroundMe, cursor)`
- `GetMatchdayResults(tournamentId, matchday)` (puntos por match)
- `GetUserScoreBreakdown(tournamentId, userId)`
- `GetPositionTimeline(tournamentId, userId)` (para live + wrapped)

### Eventos publicados
- `scoring.user_points_changed`
- `ranking.snapshot_published`
- `ranking.corrected`

### Eventos consumidos
- `submission.locked/submitted`
- `sports.match_finished`
- `sports.match_corrected`

### Invariantes / fallos
- Ranking snapshots incluyen `gameModeId` + `rulesetVersionId` y metadata de auditoría.
- Recomputable + auditable.
- Snapshots versionados (correcciones crean nueva versión).
- Rendimiento: precompute “aroundMe”.

---

## D.11 Live Feed & Notifications

### Agregados
- `FeedItem`, `Notification`, `DeliveryAttempt`, `Subscriptions`

### Comandos
- `UpdateSubscriptions(userId, patch)`
- `MarkFeedSeen(userId, cursor|timestamp)`
- `MarkNotificationRead(userId, notificationId)`
- `EnqueueNotification(eventRef)` (interno)

### Lecturas
- `GetLiveFeed(userId, scope, cursor)`
- `ListNotifications(userId, cursor)`
- `GetUnreadCounts(userId)`

### Invariantes / fallos
- Dedupe y anti-fatiga.
- Respeta quiet hours + preferencias.

---

## D.12 Stats / Recap / Wrapped

### Agregados
- `TournamentRecap`, `UserTournamentStats`, `WrappedArtifact`

### Comandos (internos)
- `GenerateTournamentRecap(tournamentId)`
- `GenerateUserWrapped(userId, season|period)`

### Lecturas
- `GetTournamentRecap(tournamentId, memberId)`
- `GetMyStats(userId, filters...)`
- `GetWrapped(userId, period)`

### Invariantes
- Derivado de scoring + timeline; reproducible.
- Privacidad: lo que es “público” depende de verificado.

---

## D.13 Chat & Community

### Agregados
- `ChatRoom`, `Message`, `ModerationAction`, `ReadState`

### Comandos
- `SendMessage(tournamentId, userId, text)`
- `DeleteMessage(tournamentId, moderatorId, messageId, reason)`
- `MuteUser(tournamentId, moderatorId, targetUserId, duration)`
- `PinMessage(tournamentId, moderatorId, messageId)` *(opcional)*

### Lecturas
- `ListMessages(tournamentId, userId, cursor)`
- `GetUnreadState(tournamentId, userId)`

### Invariantes / fallos
- Rate limits.
- Moderación auditada especialmente en verificados.

---

## D.14 Verified Hub & Events

### Agregados
- `VerifiedEvent`, `VerifiedHubCuration`, `VerifiedBranding`, `VerifiedEligibility`, `VerifiedTournamentAttachment`

### Comandos (staff)
- `CreateVerifiedEvent(...)`
- `UpdateVerifiedEvent(...)`
- `PublishVerifiedEvent(eventId)`
- `AttachTournament(eventId, tournamentId)`
- `DetachTournament(eventId, tournamentId)`

### Lecturas
- `GetVerifiedHub(userId?, locale, filters)` (catálogo curado)
- `GetVerifiedEvent(eventId)` (detalle pre-join safe)
- `ListVerifiedEventTournaments(eventId)`

### Invariantes
- Sin spectators: preview mínimo.
- Eligibility consistente si hay promos/premios.

---

## D.15 Creators Platform

### Agregados
- `CreatorProfile`, `CreatorBranding`, `CreatorCollections`, `CreatorLinks`

### Comandos (staff/partner)
- `CreateCreator(...)`
- `UpdateCreator(...)`
- `VerifyCreator(...)`

### Lecturas
- `ListCreators(filters...)`
- `GetCreator(creatorId)`
- `ListCreatorEvents(creatorId)`

### Invariantes
- Anti-spam (links y contenido).
- Branding assets via Uploads/Media.

---

## D.16 Ranked Progression

### Agregados
- `RankedTrack`, `RankedSeason`, `UserRating`, `Division/Tier`

### Comandos (internos + staff config)
- `ApplyVerifiedSnapshot(snapshotRef)` (actualiza rating)
- `StartSeason(trackId, config)`
- `EndSeason(trackId, seasonId)`
- `ApplySeasonReset(trackId, seasonId, policy)`
- `UpdateRankedTrack(trackId, patch)` (staff)

### Lecturas
- `GetMyRankedProfile(userId)`
- `GetRankedLeaderboard(trackId, seasonId, view)`
- `GetSeasonInfo(trackId)`

### Invariantes
- Solo torneos verificados mueven rating.
- Reset parcial, auditado.

---

## D.17 Achievements (verificados)

### Agregados
- `AchievementDefinition` (staff), `AchievementGrant`, `EvidenceRef`

### Comandos
- `PublishAchievementDefinition(...)` (staff)
- `GrantAchievement(userId, achievementId, evidenceRef)` (interno)
- `RevokeAchievement(grantId, reason)` (staff, antifraude)

### Lecturas
- `ListMyAchievements(userId, verifiedOnly=true)`
- `GetAchievementCatalog()`

### Invariantes
- Grants inmutables (con revocación auditada).
- Solo verificado “de prestigio”.

---

## D.18 Promotions & Rewards (sin betting)

### Agregados
- `Promotion`, `PromotionOptIn`, `EligibilitySnapshot`, `RewardGrant`, `FulfillmentProfile`, `WinnerPublication`

### Comandos
- `CreatePromotion(...)` (staff)
- `UpdatePromotion(...)` (staff)
- `OptInPromotion(userId, promotionId, termsVersion)`
- `OptOutPromotion(userId, promotionId)` (si permitido)
- `GrantRewards(promotionId, winners[])` (interno/staff)
- `ClaimReward(userId, rewardGrantId, fulfillmentData, termsVersion)`
- `UpdateFulfillmentProfile(userId, patch)`

### Lecturas
- `ListPromotions(filters...)` (public)
- `GetPromotion(promotionId)` (public)
- `GetMyPromotionState(promotionId)` (auth)
- `ListMyRewards(filters...)` (auth)
- `ListPromotionWinners(promotionId)` (public, con privacidad)

### Invariantes
- T&Cs versionadas + opt-in.
- Antifraude si hay premios.
- Transparencia sin exponer datos sensibles (consent/anonymize).

---

## D.19 Trust & Safety & Anti-Fraud

### Agregados
- `Report`, `EnforcementAction`, `Appeal`, `PolicyDocument`, `FraudSignal`

### Comandos
- `SubmitReport(reporterId, target, reason, comment?)`
- `CreateAppeal(userId, actionId, message)`
- `IssueEnforcementAction(userId, type, scope, duration, reason)` (staff)
- `UpdateEnforcementAction(actionId, patch)` (staff)
- `UpdateReport(reportId, status, resolutionNote)` (staff)
- `UpdateAppeal(appealId, status, response)` (staff)

### Lecturas
- `ListTrustPolicies()` (public)
- `GetMyEnforcementStatus(userId)` (auth)
- `ListMyReports(userId)` (auth)
- `ListMyAppeals(userId)` (auth)

### Invariantes
- Auditoría obligatoria para acciones staff.
- Bloqueos/restricciones deben reflejarse en permisos de Chat/Ranked/Rewards.

---

## D.20 Uploads & Media

### Agregados
- `UploadSession`, `MediaAsset`, `MediaVariant`, `ModerationStatus`

### Comandos
- `CreateUpload(purpose, scope, contentType, size?, checksum?)`
- `CompleteUpload(uploadId, metadata, crop?)`
- `AbortUpload(uploadId)`
- `DeleteMedia(mediaId)` (policy-based)

### Lecturas
- `GetUpload(uploadId)`
- `GetMedia(mediaId)` (public/unlisted/private policy)

### Invariantes
- purpose + scope autorizado (ej. tournament cover solo admin).
- constraints (size/type) en create.
- scanning/moderation para assets expuestos.

---

## D.21 Admin / Backoffice (staff-only overlay)

### Propósito
Operar dominios sin inventar modelos paralelos.

### Reglas obligatorias
- `StaffAuth` separado
- `X-Admin-Justification` requerido en writes
- `AuditEvent` inmutable por cada write
- Rate limit fuerte + logging

### Contratos típicos
- Buscar usuarios/torneos, ver campos ampliados (staff view).
- Ejecutar recomputes, publicar/unpublish, moderar media/chat, corregir deportes, operar promos.

---

# E) Contratos transversales de preview (para Hub sin spectator)

### E.1 Tournament Preview (pre-join safe)
Campos permitidos:
- `tournamentId`, `name`, `verificationStatus`, `sportId`, `gameModeId`
- `schedule` (start/end, join close)
- `participantsCount`, `maxPlayers?`, `callToAction`
- `rewardsSummary?`, `creatorBranding?`, `officialBadge?`

Campos prohibidos:
- ranking completo, chat, submissions de otros, histórico.

---

# F) Lista de decisiones que deben congelarse antes de avanzar OpenAPI (si no, se rompe)

1) Event envelope y naming.
2) Rulesets inmutables versionados.
3) “Verified” como único origen de ranked/logros/premios oficiales.
4) “No spectator” implementado por permisos + preview mínimo.
5) IdempotencyKey + concurrency control en comandos críticos.
6) Correcciones de partidos como eventos explícitos + recompute auditable.
7) Staff-only overlay con justificación + audit log.

---
