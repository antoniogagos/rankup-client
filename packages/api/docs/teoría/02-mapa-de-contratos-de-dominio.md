# Rankup — Mapa de Contratos de Dominio (Formato B)

**Objetivo:** definir *contratos de dominio* (comandos, lecturas, eventos, invariantes y límites) por bounded context para que arquitectura/ingeniería puedan diseñar la OpenAPI por fases **sin acoplar dominios**.

## 0) Hechos y Juicio técnico

### Hechos

* Rankup es **tournament‑centric**, multi‑game mode, multi‑deporte.
* **No betting**.
* No hay “espectador”: para ver detalle de un torneo hay que ser miembro; sí puede haber **preview** mínimo (teaser) para decidir unirse.
* Torneos verificados son la única fuente de **rating/logros**.
* Producto social: amigos + invitaciones + follow (opcional), sin feed global abierto.

### Juicio técnico

* La separación contractual clave es:
  **Submissions ≠ Scoring ≠ Progression**
  y **Sports ingest ≠ dominio interno** (ACL obligatoria).
* Los contratos deben soportar: *versionado de reglas*, *recomputación*, *correcciones*, *idempotencia* y *concurrencia*.

---

## 1) Convenciones globales de contrato (aplican a todos los contextos)

### 1.1 Identificadores

* IDs tipados: `userId`, `tournamentId`, `matchId`, `rulesetId`, `submissionId`, `eventId`, `seasonId`.
* Recomendación: ULID (ordenable) o UUIDv7.
* IDs canónicos ASCII para catálogos: `sportId`, `gameModeId`, `competitionId`.

### 1.2 Tiempo

* `occurredAt`, `createdAt`, `updatedAt`: RFC3339 UTC.
* Si necesitáis epoch: **solo** como derivado (evitar mezclar en contratos).

### 1.3 Versionado y concurrencia

* **Optimistic concurrency** por agregado: `aggregateVersion` (int) o `etag`.
* Mutaciones con `ifMatchVersion` para evitar overwrites silenciosos.

### 1.4 Idempotencia

* Comandos externos que crean/actualizan deben aceptar `idempotencyKey`.
* Semántica: misma key + mismo actor + misma ruta de comando ⇒ mismo resultado.

### 1.5 Paginación

* Cursor-based: `pageSize`, `cursor`, `nextCursor`.
* Orden estable explícito.

### 1.6 Internacionalización

* Recomendación: **no** localizar rutas API; locale por header/param (`Accept-Language`, `locale`).
* El contrato de dominio siempre usa IDs canónicos y textos opcionales localizables vía catálogos.

### 1.7 Estados “verificados”

* `verificationStatus`: `private | community | verified_official | verified_creator | verified_sponsored`
* Solo estados `verified_*` actualizan Progression/Achievements.

---

## 2) Contrato de eventos de dominio (envelope estándar)

### 2.1 Envelope (mínimo)

* `eventId` (único)
* `eventType` (string estable, p.ej. `tournament.member_joined`)
* `schemaVersion` (int)
* `producer` (boundedContext/service)
* `occurredAt` (UTC)
* `aggregate`:

  * `aggregateType`
  * `aggregateId`
  * `aggregateVersion` (monótono por agregado)
* `correlationId` (traza request/flujo)
* `causationId` (evento que lo provocó, si aplica)
* `payload` (objeto por `eventType`)

### 2.2 Semántica de entrega

* *At-least-once*: consumidores deben ser idempotentes (dedupe por `eventId`).
* Ordering: solo garantizable por `aggregateId` (usar `aggregateVersion`).
* Errores: dead-letter + reintentos con backoff.

---

## 3) Context Map de integración (quién publica/consume)

* **Sports Catalog & Schedule** → publica → **Scoring & Rankings**, **Live Feed**
* **Game Mode Registry & Rules** → usado por → **Submissions**, **Scoring**
* **Tournaments & Membership** → autoriza → **Submissions**, **Chat**, **Scoring**
* **Verified & Creator Programs** → publica → **Tournaments**, **Progression**
* **Scoring & Rankings** → publica → **Progression**, **Live Feed**, **Analytics**
* **Trust & Safety** → consume → **Chat**, **Profiles**, **Tournaments** → publica sanciones
* **Analytics** observa todo (event sink)

---

# 4) Contratos por Bounded Context

A continuación, cada contexto se describe como:

* **Agregados (propiedad)**
* **Comandos (write contracts)**
* **Lecturas (read contracts)**
* **Eventos publicados**
* **Eventos consumidos**
* **Invariantes y fallos esperables**
* **Autorización (policy)**

---

## 4.1 Identity & Access

### Agregados

* `UserIdentity`
* `Session`
* `OAuthLink`
* `PasswordResetToken`

### Comandos

* `RegisterUser(email, password | oauthProvider, locale, country?)`
* `Authenticate(email/password | oauthCode)`
* `RefreshSession(refreshToken)`
* `RevokeSession(sessionId | refreshToken)`
* `RequestPasswordReset(email)`
* `ConfirmPasswordReset(token, newPassword)`
* `DeleteAccount(userId)` (requiere reautenticación)

**Contratos críticos:** idempotencia en registro (por email), rotación de refresh tokens.

### Lecturas

* `GetSessionContext(accessToken)` (interno)

### Eventos publicados

* `identity.user_registered`
* `identity.session_issued`
* `identity.session_revoked`
* `identity.user_deleted`

### Invariantes / fallos

* Email único (si aplica).
* Revocación inmediata de sesiones en `user_deleted`.

### Autorización

* Público (register/login/reset).
* Autenticado (logout/delete).

---

## 4.2 Profiles & Preferences

### Agregados

* `UserProfile`
* `PrivacySettings`
* `NotificationPreferences`
* `UserInterests` (deportes)

### Comandos

* `UpdateProfile(userId, displayName, avatarUrl?, bio?)`
* `UpdatePrivacy(userId, profileVisibility, historyVisibility, allowFriendRequests, allowFollows)`
* `UpdatePreferences(userId, locale, country, sportsInterests[], quietHours, notificationOptIns[])`

### Lecturas

* `GetProfile(viewerId?, userId)` (aplica reglas de privacidad)
* `GetMyPreferences(userId)`

### Eventos publicados

* `profile.updated`
* `preferences.updated`
* `privacy.updated`

### Invariantes / fallos

* Validación de nombres (filtro + longitud + caracteres).
* Si `historyVisibility=verified_only_public`: solo exponer logros verificados.

### Autorización

* Editar: solo el propio usuario.
* Ver: según privacidad + bloqueos.

---

## 4.3 Social Graph

### Agregados

* `FriendRequest`
* `Friendship`
* `FollowEdge`
* `BlockEdge`

### Comandos

* `SendFriendRequest(fromUserId, toUserId, message?)`
* `RespondFriendRequest(requestId, accept|decline)`
* `RemoveFriend(userId, friendUserId)`
* `FollowUser(followerId, followeeId)`
* `UnfollowUser(followerId, followeeId)`
* `BlockUser(blockerId, blockedId)`
* `UnblockUser(blockerId, blockedId)`

### Lecturas

* `ListFriends(userId, cursor)`
* `ListFollowers(userId, cursor)`
* `ListFollowing(userId, cursor)`
* `GetRelationship(viewerId, targetId)` (para UI/permiso rápido)

### Eventos publicados

* `social.friend_requested`
* `social.friend_accepted`
* `social.friend_removed`
* `social.user_followed`
* `social.user_blocked`

### Invariantes / fallos

* `block` invalida follow + friend requests.
* Anti-spam: límites por día en requests.

### Autorización

* Autenticado.

---

## 4.4 Sports Catalog & Schedule (con ACL de proveedor)

### Agregados

* `Sport`
* `Competition`
* `Season`
* `Matchday`
* `Match`
* `Team` (si aplica)
* `MatchEvent` (goal, red card, etc.) *normalizado*

### Comandos (internos/ingesta)

* `UpsertCompetition(...)`
* `UpsertMatch(...)`
* `ApplyMatchEvent(matchId, eventType, eventTime, metadata)`
* `FinalizeMatch(matchId, result)`
* `CorrectMatch(matchId, correctedFields, correctionReason)`

### Lecturas

* `ListCompetitions(sportId?, status?, locale)`
* `GetMatchday(competitionId, seasonId, matchdayNumber)`
* `ListMatches(filters...)`
* `GetMatch(matchId)`

### Eventos publicados (críticos)

* `sports.match_status_changed`
* `sports.match_event_recorded` (goal, etc.)
* `sports.match_finished`
* `sports.match_corrected`

### Invariantes / fallos

* Estados monotónicos; correcciones explícitas.
* Idempotencia por `providerEventId` en ingesta.

### Autorización

* Lecturas: autenticado (o público si queréis).
* Escrituras: solo pipeline interno.

---

## 4.5 Tournaments & Membership

### Agregados

* `Tournament`
* `TournamentMembership` (role, joinedAt, status)
* `JoinPolicy` (open/closed/code, joinMidSeason, maxPlayers, joinWindow)
* `InvitationCode` (rotación)
* `TournamentInvite` (direct invite a userId)
* `TournamentSettings` (chatEnabled, etc.)

### Comandos

* `CreateTournament(ownerId, name, sportId, gameModeId, competitionRef, seasonRef, modality: matchday|season, visibility: private|public, joinPolicy, rulesetRef, initialSettings)`
* `UpdateTournament(tournamentId, patch)` (limitado y auditado)
* `RotateInvitationCode(tournamentId)`
* `JoinTournament(tournamentId, userId, invitationCode? , idempotencyKey)`
* `LeaveTournament(tournamentId, userId, idempotencyKey)`
* `KickMember(tournamentId, adminId, targetUserId, reason?)`
* `TransferOwnership(tournamentId, ownerId, newOwnerId)`
* `SetJoinPolicy(tournamentId, adminId, joinPolicyPatch)`
* `CloseTournament(tournamentId, adminId)` (si aplica)
* `ArchiveTournament(tournamentId, adminId)` (para historial)

**Nota:** “verificar torneo” NO se hace aquí; se consume del contexto Verified.

### Lecturas

* `GetTournamentPreview(viewerId, tournamentId)` (solo metadata permitida pre-join)
* `GetTournament(tournamentId, memberId)` (requiere membership)
* `ListUserTournaments(userId, filters...)`
* `ListTournamentMembers(tournamentId, memberId, cursor)`
* `GetTournamentRulesEffective(tournamentId)` (puede delegar a Rules context)

### Eventos publicados

* `tournament.created`
* `tournament.updated`
* `tournament.invitation_code_rotated`
* `tournament.member_joined`
* `tournament.member_left`
* `tournament.member_kicked`
* `tournament.ownership_transferred`
* `tournament.archived`

### Eventos consumidos

* `verified.tournament_verified` → actualizar `verificationStatus`, `brandingRef`

### Invariantes / fallos

* No doble membership activa.
* Join policy coherente con estado del torneo.
* En torneos verificados: restricciones más estrictas (p.ej. no cambiar ruleset tras start).

### Autorización

* Create: autenticado (pero crear `verified_*` requiere permiso del contexto Verified).
* Admin actions: owner/admin/mod.

---

## 4.6 Game Mode Registry & Rules

### Agregados

* `GameMode`
* `Ruleset` (inmutable, versionado)
* `RulesetTemplate` (plantilla configurable)

### Comandos (internos/admin)

* `RegisterGameMode(gameModeId, capabilities, uiHints)`
* `PublishRuleset(gameModeId, schema, scoringLogicParams, tieBreakers, lockPolicy, schemaVersion)`
* `DeprecateRuleset(rulesetId, sunsetAt)`

### Lecturas

* `ListGameModes()`
* `GetRuleset(rulesetId)`
* `ListRulesets(gameModeId, status)`
* `ResolveEffectiveRules(tournamentRulesRef)` (template + overrides)

### Eventos publicados

* `ruleset.published`
* `ruleset.deprecated`

### Invariantes / fallos

* Ruleset publicado no se edita: solo “nueva versión”.
* Validación: schema de configuración y constraints.

### Autorización

* Lecturas: autenticado.
* Escrituras: staff.

---

## 4.7 Gameplay Submissions

### Agregados

* `SubmissionSet` (userId + tournamentId + matchdayRef)
* `SubmissionItem` (por match/event dentro del set)
* Estado: `draft | submitted | locked`

### Comandos

* `UpsertSubmissionSet(userId, tournamentId, matchdayRef, items[], idempotencyKey)`
* `SubmitSubmissionSet(userId, tournamentId, matchdayRef, idempotencyKey)` (opcional si distinguís draft/submit)
* `LockSubmissionSet(tournamentId, matchdayRef)` (interno; se dispara por lockPolicy o kickoff)
* `UnlockSubmissionSet(...)` (solo si hay corrección/edge case, muy controlado)

### Lecturas

* `GetMySubmissionSet(userId, tournamentId, matchdayRef)`
* `ListMySubmissions(userId, tournamentId, range)`
* `GetSubmissionAvailability(userId, tournamentId, matchdayRef)` (si está abierto/cerrado)

### Eventos publicados

* `submission.upserted`
* `submission.submitted`
* `submission.locked`

### Eventos consumidos

* `sports.match_status_changed` / `sports.match_kickoff` → decidir lock
* `tournament.member_joined/left` (para permisos)

### Invariantes / fallos

* No edits tras `locked`.
* Validación por `rulesetId` efectivo del torneo.
* Idempotencia fuerte.

### Autorización

* Solo miembro del torneo.
* Admin no edita submissions de otros (salvo soporte interno, si existiera).

---

## 4.8 Scoring & Rankings

### Agregados

* `ScoreLedger` (puntos por user/tournament/match)
* `MatchResolution` (resultado aplicado + rulesetVersion)
* `RankingSnapshot` (por matchday y total)
* `ScoreCorrection` (audit)

### Comandos (internos, event-driven)

* `ApplyMatchResult(tournamentId, matchId, result, rulesetId)`
* `ApplyMatchEventImpact(...)` (si puntuáis en vivo)
* `RecomputeTournament(tournamentId, reason, fromMatchId?)`
* `PublishRankingSnapshot(tournamentId, scope: matchday|total)`

### Lecturas

* `GetRanking(tournamentId, scope, view: topN + aroundMe, cursor)`
* `GetMatchdayResults(tournamentId, matchdayRef)` (puntos por match)
* `GetUserScoreBreakdown(tournamentId, userId, range)`
* `GetPositionTimeline(tournamentId, userId)` (para “app viva” y wrapped)

### Eventos publicados

* `scoring.user_points_changed` (granular)
* `ranking.snapshot_published` (snapshot completo/segmentado)
* `ranking.corrected`

### Eventos consumidos

* `submission.locked/submitted`
* `sports.match_finished`
* `sports.match_corrected`
* `ruleset.deprecated` (solo para warnings, no cambia histórico)

### Invariantes / fallos

* Recomputable y auditable.
* Correcciones generan nueva versión de snapshot.
* Rendimiento: snapshots y “aroundMe” precomputados para torneos grandes.

### Autorización

* Lecturas: solo miembros (excepto preview mínimo en verificados si lo decidís).
* Escrituras: interno.

---

## 4.9 Live Feed & Notifications

### Agregados

* `Notification`
* `DeliveryAttempt`
* `FeedItem`
* `Subscription` (a torneos/deportes/amigos)

### Comandos

* `UpdateSubscriptions(userId, subscriptionsPatch)` (o en Preferences)
* `MarkNotificationRead(userId, notificationId)`
* `AcknowledgeFeed(userId, lastSeenAt)`
* `EnqueueNotification(eventRef)` (interno)

### Lecturas

* `ListNotifications(userId, cursor, filters)`
* `GetLiveFeed(userId, scope: tournament|global_official, cursor)`
* `GetUnreadCounts(userId)`

### Eventos publicados

* `notification.sent`
* `notification.failed`
* `feed.item_published`

### Eventos consumidos

* `sports.match_event_recorded`
* `ranking.snapshot_published` / `scoring.user_points_changed`
* `social.friend_accepted`
* `tournament.member_joined`
* `verified.tournament_verified`

### Invariantes / fallos

* Anti-fatiga (rate limit + dedupe).
* Personalización por preferencias.

### Autorización

* Autenticado.

---

## 4.10 Achievements & Progression (Ranked)

### Agregados

* `RankedRating` (userId + gameModeId [+ sportId opcional])
* `Season` (por gameModeId)
* `Division` (umbrales)
* `AchievementDefinition` (staff)
* `AchievementGrant` (usuario)
* `XPProfile` (progreso global no competitivo)

### Comandos (internos/event-driven)

* `ApplyVerifiedResultSnapshot(tournamentId, snapshotRef)` (actualiza rating)
* `GrantAchievement(userId, achievementId, evidenceRef)`
* `AccrueXP(userId, xpDelta, reason)`
* `StartSeason(gameModeId, seasonConfig)`
* `EndSeason(gameModeId, seasonId)`
* `ApplySeasonReset(gameModeId, seasonId, resetPolicy)`

### Lecturas

* `GetMyRankedProfile(userId)` (ratings por modo + división)
* `GetLeaderboard(gameModeId, seasonId, cursor, view: topN + aroundMe)`
* `ListMyAchievements(userId, filters: verifiedOnly=true)`
* `GetSeasonInfo(gameModeId)`

### Eventos publicados

* `rank.changed`
* `achievement.unlocked`
* `season.started`
* `season.ended`
* `season.reset_applied`

### Eventos consumidos

* `ranking.snapshot_published` (solo si `verificationStatus` del torneo es `verified_*`)
* `verified.tournament_verified` (para permitir progreso)
* `trust.user_banned` (congelar progresión si aplica)

### Invariantes / fallos

* Rating competitivo **solo** por torneos verificados.
* Resets auditables; nunca borrar histórico de logros.
* Evitar “ruido”: pocas divisiones, reglas explícitas.

### Autorización

* Lecturas: autenticado (algunas leaderboards públicas si queréis, pero cuidado privacidad).
* Escrituras: interno.

---

## 4.11 Verified & Creator Programs

### Agregados

* `Creator`
* `CreatorBranding`
* `VerifiedTournamentPolicy`
* `VerifiedTournamentRecord`
* `ModeratorAssignment`

### Comandos

* `VerifyCreator(creatorId, criteria, branding)`
* `UpdateCreatorBranding(creatorId, brandingPatch)`
* `VerifyTournament(tournamentId, verificationType, policyRef, brandingRef, effectiveFrom)`
* `AssignModerator(tournamentId, adminId, moderatorUserId, permissions)`
* `RevokeVerification(tournamentId, reason)`

### Lecturas

* `GetEventHubCatalog(userId, locale, filters)` (cards curadas)
* `GetVerifiedTournamentPreview(tournamentId)` (info permitida)
* `ListCreatorEvents(creatorId, cursor)`

### Eventos publicados

* `verified.creator_verified`
* `verified.tournament_verified`
* `verified.branding_updated`
* `verified.verification_revoked`

### Eventos consumidos

* `tournament.created` (para pipelines internos de revisión)
* `trust.fraud_flagged` (para revocar/pausar verificación)

### Invariantes / fallos

* Un verificado debe apuntar a rulesets aprobados.
* Políticas de elegibilidad por país/edad si hay premios.

### Autorización

* Staff/ops + partners verificados (según políticas).

---

## 4.12 Chat & Community

### Agregados

* `ChatRoom` (por tournamentId)
* `Message`
* `ModerationAction` (delete/mute/pin)

### Comandos

* `SendMessage(tournamentId, userId, text, idempotencyKey)`
* `DeleteMessage(tournamentId, moderatorId, messageId, reason)`
* `MuteUser(tournamentId, moderatorId, targetUserId, duration)`
* `PinMessage(tournamentId, moderatorId, messageId)`

### Lecturas

* `ListMessages(tournamentId, userId, cursor)`
* `GetUnreadState(tournamentId, userId)`

### Eventos publicados

* `chat.message_sent`
* `chat.message_deleted`
* `chat.user_muted`

### Eventos consumidos

* `tournament.member_joined/left` (autorización)
* `trust.user_banned` (bloquear chat)

### Invariantes / fallos

* Rate limits.
* Filtro de lenguaje (o delega a Trust & Safety).

### Autorización

* Enviar: miembro.
* Moderar: admin/mod.

---

## 4.13 Trust, Safety & Anti‑Fraud

### Agregados

* `ContentReport`
* `UserStrike`
* `Ban`
* `FraudFlag`
* `EligibilityCheck`

### Comandos

* `SubmitReport(reporterId, targetType, targetId, reason, evidence)`
* `IssueStrike(userId, reason, evidence)`
* `BanUser(userId, scope, duration, reason)`
* `UnbanUser(userId, reason)`
* `FlagFraud(userId, signals, riskScore)`
* `VerifyEligibilityForReward(userId, promotionId)` (si hay premios)

### Lecturas

* Usuario: `GetMySafetyStatus(userId)` (opcional)
* Interno: colas de reports, fraude, appeals.

### Eventos publicados

* `trust.content_reported`
* `trust.user_banned`
* `trust.user_unbanned`
* `trust.fraud_flagged`
* `trust.content_removed`

### Eventos consumidos

* `chat.message_sent`
* `profile.updated`
* `tournament.created` (nombres ofensivos)
* `rewards.reward_granted` (chequeos)

### Invariantes / fallos

* Auditoría obligatoria para sanciones.
* Multi-cuenta: señales por dispositivo + comportamiento.

### Autorización

* Reportar: autenticado.
* Sancionar: staff.

---

## 4.14 Analytics & Experimentation

### Agregados

* `Experiment`
* `Assignment`
* `AnalyticsEvent` (stream)

### Comandos

* `LogAnalyticsEvent(userId?, eventName, properties, occurredAt)` (cliente)
* `AssignExperimentVariant(userId, experimentId)` (interno)
* `CreateExperiment(...)` (interno)

### Lecturas

* Interno: dashboards (fuera de dominio transaccional).

### Eventos publicados

* (opcional) `analytics.event_logged`

### Invariantes / fallos

* Privacidad y minimización: no loggear PII innecesaria.
* Cohortes: país/idioma/deporte interés como dimensiones.

---

## 4.15 Rewards & Promotions (reservado, aunque no MVP)

### Agregados

* `Promotion`
* `Prize`
* `Winner`
* `RewardGrant`
* `RewardClaim`
* `Fulfillment`

### Comandos

* `CreatePromotion(name, eligibilityRules, prizes, termsRef)`
* `GrantReward(promotionId, userId, prizeId, evidenceRef)`
* `ClaimReward(rewardGrantId, userId, claimData)`
* `FulfillReward(rewardGrantId, fulfillmentProviderRef)`

### Lecturas

* `ListMyRewards(userId)`
* `GetPromotion(promotionId)`

### Eventos publicados

* `rewards.reward_granted`
* `rewards.reward_claimed`
* `rewards.reward_fulfilled`

### Eventos consumidos

* `ranking.snapshot_published` (para determinar winners)
* `trust.eligibility_verified` / `trust.fraud_flagged`

---

# 5) Contratos transversales de “preview” (para no violar “no espectadores”)

Para permitir Hub de Eventos sin “espectar” torneos:

### Tournament Preview (solo lectura)

* Campos permitidos:

  * `tournamentId`, `name`, `verificationStatus`, `gameModeId`, `sportId`
  * `startsAt/endsAt`, `joinClosesAt`
  * `participantsCount`
  * `rewardsSummary?` (si oficial)
  * `top3Anonymized?` (opcional)
  * `callToAction` (join now / closed / starts soon)
* Campos prohibidos pre-join:

  * submissions de otros, chat, ranking completo, historial detallado.

Este preview puede vivir como *read model* en **Verified** (catálogo curado) y resolver detalles con **Tournaments**.

---

# 6) Lista de “contratos que deben congelarse” antes de OpenAPI

1. Envelope de eventos + naming + schemaVersion.
2. Versionado inmutable de rulesets.
3. Política exacta de `verificationStatus` y qué activa (rating/logros).
4. Regla “no espectador” implementada vía permisos + preview mínimo.
5. IdempotencyKey + concurrencyVersion en comandos críticos.
6. Correcciones de resultados: evento explícito + recomputación auditable.

---

