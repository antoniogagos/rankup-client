# Libro de Secuencias Críticas (5 flujos)

Formato: diagramas textuales + contratos mínimos (comandos, lecturas, eventos) para arrancar **OpenAPI Fase 0** y **Fase 1** sin retrabajo.

---

## Flujo 1 — Torneo privado: crear → invitar → jugar → ranking

**Objetivo:** que un usuario cree un torneo privado, invite a amigos, envíe submissions (p. ej. ScorePrediction) y vea ranking.

### Precondiciones

* Usuario autenticado (`Identity`).
* Catálogo deportivo accesible (competiciones/partidos) (`Sports`).
* Existe al menos un `rulesetId` válido para el modo (`Rules`).

### Secuencia (texto/diagrama)

1. **Cliente** → `Tournaments`: **CreateTournament(private)**

   * Incluye: `name`, `sportId`, `gameModeId`, `competitionRef`, `seasonRef`, `modality`, `joinPolicy`, `rulesetRef`.
2. `Tournaments` → Bus: `tournament.created`
3. `Tournaments` (opcional) → `Tournaments`: **RotateInvitationCode**
4. `Tournaments` → Bus: `tournament.invitation_code_rotated`
5. **Cliente** comparte código / invita amigos (out‑of‑band o por social invite):

   * 5a) (Opcional) **Cliente** → `Social`: `SendFriendRequest` / `InviteFriendToTournament`
6. **Amigo** → `Tournaments`: **JoinTournament(invitationCode)** *(idempotente)*
7. `Tournaments` → Bus: `tournament.member_joined`
8. **Cliente** → `Sports`: **GetMatchday(competition, season, matchday)**
9. **Cliente** → `Submissions`: **UpsertSubmissionSet(tournamentId, matchdayRef, items[])**
10. `Submissions` → Bus: `submission.upserted`
11. `Sports` → Bus: `sports.match_kickoff` (o status LIVE)
12. `Submissions` (consume kickoff) → **LockSubmissionSet**
13. `Submissions` → Bus: `submission.locked`
14. `Sports` → Bus: `sports.match_finished`
15. `Scoring` (consume finished + submissions) → calcula → publica
16. `Scoring` → Bus: `scoring.user_points_changed` (opcional granular)
17. `Scoring` → Bus: `ranking.snapshot_published` (matchday + total)
18. **Cliente** → `Scoring`: **GetRanking(tournamentId, scope=total, view=topN+aroundMe)**
19. (Opcional) **Cliente** → `Chat`: `SendMessage` / `ListMessages`

### Contratos mínimos (Fase 0)

**Comandos**

* `CreateTournament`
* `RotateInvitationCode` (opcional, pero recomendable)
* `JoinTournament`
* `UpsertSubmissionSet`
* (interno) `LockSubmissionSet`

**Lecturas**

* `ListUserTournaments`
* `GetTournament` (requiere membership)
* `ListTournamentMembers`
* `GetMatchday / ListMatches`
* `GetMySubmissionSet`
* `GetRanking` (topN + aroundMe)
* (chat) `ListMessages`

**Eventos**

* `tournament.created`
* `tournament.member_joined`
* `submission.upserted`
* `submission.locked`
* `sports.match_finished`
* `ranking.snapshot_published`

### Consistencia y fallos esperables

* **Idempotencia:** `JoinTournament` y `UpsertSubmissionSet` deben aceptar `idempotencyKey`.
* **Lock:** si el usuario intenta editar tras lock → error determinista `SUBMISSION_LOCKED`.
* **Datos deportivos:** si el proveedor cambia hora/kickoff, el lock debe derivarse de `Sports` (no del cliente).
* **Ranking grande:** en privados normalmente pequeño, pero usad `topN+aroundMe` igualmente (patrón estable).

---

## Flujo 2 — Evento oficial verificado: hub → join → lock → scoring → ranking → rating

**Objetivo:** participación en torneo verificado que actualiza **rating** y desbloquea **logros**.

### Precondiciones

* Existe un torneo con `verificationStatus=verified_*`.
* El torneo usa `rulesetId` aprobado.
* El usuario está autenticado y cumple elegibilidad (si aplica, p. ej. país/edad para premios).

### Secuencia

1. **Cliente** → `Verified`: **GetEventHubCatalog(locale, filters)**

   * Devuelve cards (no buscador): “Ahora / Esta semana / Oficiales / Creadores”.
2. **Cliente** → `Tournaments`: **GetTournamentPreview(tournamentId)** *(teaser mínimo pre‑join)*
3. **Cliente** → `Tournaments`: **JoinTournament(tournamentId)** *(sin espectadores; unirse = entrar)*
4. `Tournaments` → Bus: `tournament.member_joined`
5. **Cliente** → `Sports`: fixtures/jornada (igual que flujo 1)
6. **Cliente** → `Submissions`: `UpsertSubmissionSet(...)`
7. `Sports` → Bus: kickoff / match events
8. `Submissions` → lock → `submission.locked`
9. `Sports` → Bus: `sports.match_finished`
10. `Scoring` → publica `ranking.snapshot_published` (incluye `isVerified=true` y `rulesetId`)
11. `Progression` (consume snapshot verificado) → aplica rating:

    * actualiza `RankedRating(userId, gameModeId)`
12. `Progression` → Bus: `rank.changed`
13. `Achievements` (puede ser parte de Progression o módulo) evalúa hitos →
14. `Achievements` → Bus: `achievement.unlocked` (si aplica)
15. **Cliente** → `Progression`: **GetMyRankedProfile** (ratings/división)
16. (Opcional) **Cliente** → `Progression`: **GetLeaderboard(gameModeId, seasonId, aroundMe)**

### Contratos mínimos (Fase 1)

**Comandos**

* (ya Fase 0) `JoinTournament`, `UpsertSubmissionSet`
* (interno/event-driven) `ApplyVerifiedResultSnapshot` (rating)
* (interno/event-driven) `GrantAchievement` (si no es derivación pura)

**Lecturas**

* `GetEventHubCatalog` (Verified)
* `GetTournamentPreview` (Verified/Tournaments)
* `GetMyRankedProfile`
* `GetLeaderboard` (topN + aroundMe)
* `ListMyAchievements`

**Eventos**

* `verified.tournament_verified` (ya ocurrió al crearlo)
* `ranking.snapshot_published` (marcado verificado)
* `rank.changed`
* `achievement.unlocked`

### Consistencia y fallos

* **No progreso en privados:** `Progression` debe ignorar snapshots no verificados.
* **Elegibilidad:** si hay premios, `Trust/Rewards` valida en *claim*, no en *join* (reduce fricción). Si necesitáis bloqueo temprano, hacedlo solo en torneos con requisitos fuertes.
* **Resets de temporada:** `season.reset_applied` nunca borra logros históricos.

---

## Flujo 3 — Corrección de partido: recompute → ranking corregido → rating corregido

**Objetivo:** soportar correcciones del proveedor (resultado cambiado, partido reanudado, etc.) sin romper integridad ni confianza.

### Precondiciones

* Existe `ScoreLedger` y `RankingSnapshot` ya publicados para el torneo.
* Corrección llega como evento explícito (no “editar en silencio”).

### Secuencia

1. Proveedor → ACL → `Sports`: **CorrectMatch(matchId, correctedFields, reason)**
2. `Sports` → Bus: `sports.match_corrected` (incluye `correctionReason`, `previousStateHash?`)
3. `Scoring` (consume corrected) → **RecomputeTournament(tournamentId, fromMatchId)**
4. `Scoring` → Bus: `ranking.corrected` (nuevo snapshot + diff metadata)
5. `Progression` (consume corrected snapshot verificado) → recalcula rating afectado
6. `Progression` → Bus: `rank.changed` (con `reason=correction`)
7. `LiveFeed` → notifica a usuarios impactados (anti-fatiga):

   * “Corrección oficial aplicada: tu posición cambió de X a Y”
8. **Cliente** → `Scoring`: `GetRanking` (ya ve versión corregida)
9. (Opcional) **Cliente** → `Scoring`: `GetScoreBreakdown` (ver explicación)

### Contratos mínimos (Fase 1, imprescindible si hay live)

**Comandos internos**

* `CorrectMatch`
* `RecomputeTournament`

**Lecturas**

* `GetRanking` con `snapshotVersion`
* `GetScoreBreakdown` con “antes/después” (ideal, aunque no MVP)

**Eventos**

* `sports.match_corrected`
* `ranking.corrected`
* `rank.changed` (reason: correction)

### Consistencia y fallos

* **Auditabilidad:** el usuario debe poder entender “por qué cambió”. Si no, erosiona confianza.
* **Idempotencia:** correcciones duplicadas deben dedupear por `providerCorrectionId`.
* **Tiempo real:** no spamear; agrupar notificaciones (“se aplicaron 3 correcciones”).

---

## Flujo 4 — Creator verified: branding + moderación + comunidad

**Objetivo:** torneos verificados de creadores con identidad propia y herramientas mínimas de moderación.

### Precondiciones

* El creador está verificado (`Verified`).
* Existe política de branding permitida (assets, enlaces).

### Secuencia (modelo recomendado: “crear normal + verificar después”)

1. **Staff/Rankup** → `Verified`: **VerifyCreator(creatorId, branding, criteria)**
2. `Verified` → Bus: `verified.creator_verified`
3. **Creador** → `Tournaments`: **CreateTournament(public, requestedVerificationType=verified_creator, brandingDraftRef)**
4. `Tournaments` → Bus: `tournament.created` (incluye `requestedVerificationType`)
5. `Verified` (consume tournament.created) → valida: creador verificado + policy + ruleset aprobado
6. `Verified` → `VerifyTournament(tournamentId, verified_creator, brandingRef)`
7. `Verified` → Bus: `verified.tournament_verified`
8. `Tournaments` (consume) → actualiza `verificationStatus` y `brandingRef`
9. **Creador** → `Verified`: **AssignModerator(tournamentId, moderatorUserId, permissions)**
10. `Verified` → Bus: `verified.moderator_assigned`
11. **Moderador** → `Chat`: `DeleteMessage` / `MuteUser`
12. `Chat` → Bus: `chat.message_deleted` / `chat.user_muted`
13. (Escalado) Usuario → `Trust`: `SubmitReport(messageId, reason)`
14. `Trust` → acciones: strike/ban → `trust.user_banned`
15. `Chat`/`Tournaments` consumen ban → restringen acceso

### Contratos mínimos (Fase 1.5 o Fase 2, pero conviene reservar YA)

**Comandos**

* `VerifyCreator`
* `CreateTournament(requestedVerificationType=creator)`
* `VerifyTournament`
* `AssignModerator`
* Moderación chat (`DeleteMessage`, `MuteUser`)
* `SubmitReport`, `BanUser` (staff)

**Lecturas**

* `GetCreatorEvents`
* `GetVerifiedTournamentPreview` (branding)
* `ListMessages`

**Eventos**

* `verified.creator_verified`
* `verified.tournament_verified`
* `verified.moderator_assigned`
* `trust.user_banned`

### Consistencia y fallos

* **Branding seguro:** whitelist de assets/links; evitar spam.
* **Roles:** moderación delegada nunca debe permitir “ver submissions” ni tocar scoring.
* **Confianza:** sello verificado visible y verificable (metadatos claros).

---

## Flujo 5 — Cierre de torneo: historial + “wrapped” + revivir

**Objetivo:** que al terminar un torneo se genere una experiencia contundente (ganador, recap, wrapped) y que quede en historial.

### Precondiciones

* Existe criterio objetivo de “torneo finaliza”:

  * torneo por jornada: cuando termina la jornada objetivo;
  * torneo temporada: cuando termina la última matchday configurada.
    (Esto debe estar definido en Tournaments o derivado de Sports+Tournaments).

### Secuencia

1. `Sports` → Bus: `sports.match_finished` (último match relevante)
2. `Scoring` → publica `ranking.snapshot_published` con `isFinal=true` (matchday o total)
3. `Tournaments` (consume snapshot final) → **MarkTournamentCompleted(tournamentId, completedAt)**
4. `Tournaments` → Bus: `tournament.completed`
5. `Insights/Wrapped` (puede vivir dentro de Scoring como read model) consume:

   * snapshots + ledger + timeline
6. `Insights` → genera `TournamentRecap` + `UserWrapped`
7. `Insights` → Bus: `tournament.recap_published` (opcional)
8. **Cliente** → `Tournaments`: `ListUserTournaments(filter=completed)`
9. **Cliente** → `Insights`: `GetTournamentRecap(tournamentId)` + `GetMyWrapped(tournamentId)`
10. Si torneo verificado:

    * `Achievements` puede otorgar trofeos de temporada (`achievement.unlocked`)

### Contratos mínimos (Fase 0 con versión simple; Fase 1 con “prestigio”)

**Comandos internos**

* `MarkTournamentCompleted`

**Lecturas**

* `ListUserTournaments(status=completed)`
* `GetTournamentRecap` (global del torneo)
* `GetMyWrapped` (por usuario)
* `GetPositionTimeline` (si lo usáis para wrapped)

**Eventos**

* `tournament.completed`
* (opcional) `tournament.recap_published`
* `achievement.unlocked` (solo verificados)

### Consistencia y fallos

* **Reproducible:** wrapped debe derivar de datos auditables (ledger + snapshots).
* **Privacidad:** por defecto, publicar solo logros verificados; lo privado queda en historial del usuario (no público).

---

# Set mínimo para empezar OpenAPI por fases (derivado de los 5 flujos)

## Fase 0 — MVP social + torneo privado + ScorePrediction básico

**Contexts y contratos mínimos**

1. Identity & Access

   * `RegisterUser`, `Authenticate`, `RefreshSession`, `Logout`
2. Profiles

   * `GetProfile`, `UpdateProfile`, `UpdatePreferences`
3. Social Graph (mínimo viable)

   * `SendFriendRequest`, `RespondFriendRequest`, `ListFriends`
4. Sports (solo lectura)

   * `ListCompetitions`, `GetMatchday`, `GetMatch`
5. Tournaments

   * `CreateTournament(private)`, `RotateInvitationCode`, `JoinTournament`, `LeaveTournament`, `ListUserTournaments`, `GetTournament`, `ListMembers`
6. Rules (lectura de ruleset fijo al principio)

   * `GetRuleset` (aunque sea uno)
7. Submissions

   * `UpsertSubmissionSet`, `GetMySubmissionSet`, `GetSubmissionAvailability`
8. Scoring & Rankings

   * `GetRanking`, `GetMatchdayResults` (mínimo), snapshots
9. Chat (opcional MVP)

   * `SendMessage`, `ListMessages`

**Eventos imprescindibles**

* `sports.match_finished`
* `submission.locked`
* `ranking.snapshot_published`
* `tournament.member_joined`

## Fase 1 — Verificados + Hub + Rating + Logros verificados

**Añade**

1. Verified & Creator (solo “official” al inicio)

   * `GetEventHubCatalog`, `VerifyTournament` (interno), `GetTournamentPreview`
2. Progression/Achievements

   * `GetMyRankedProfile`, `GetLeaderboard`, `ListMyAchievements`
3. LiveFeed & Notifications (mínimo)

   * `ListNotifications`, `GetLiveFeed` (torneos verificados), `UpdateNotificationPrefs`
4. Trust & Safety (mínimo para verificados)

   * `SubmitReport`, `BanUser` (interno)

**Eventos nuevos críticos**

* `verified.tournament_verified`
* `rank.changed`
* `achievement.unlocked`
* `ranking.corrected` (si vais a producción con datos reales)

---
