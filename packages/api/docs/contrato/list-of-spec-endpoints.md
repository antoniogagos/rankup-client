### Meta / Config

* `/healthz` (get)
* `/readyz` (get)
* `/app/config` (get)
* `/app/bootstrap` (get)

### Auth

* `/auth/registrations` (post)
* `/auth/registrations/confirm` (post)
* `/auth/registrations/resend-confirmation` (post)
* `/auth/sessions` (post)
* `/auth/sessions/refresh` (post)
* `/auth/sessions/me` (delete)
* `/auth/password-resets` (post)
* `/auth/password-resets/confirm` (post)
* `/auth/oauth/authorize` (get)
* `/auth/oauth/token` (post)
* `/auth/oauth/links` (post)
* `/auth/oauth/links/{provider}` (delete)

### Me (perfil, ajustes, privacidad, dispositivos)

* `/me` (get, patch, delete)
* `/me/password` (post)
* `/me/preferences` (get, patch)
* `/me/privacy` (get, patch)
* `/me/notification-preferences` (get, patch)
* `/me/devices` (get, post)
* `/me/devices/{deviceId}` (delete)

### Users (directorio y perfil público)

* `/users` (get)
* `/users/{userId}` (get)
* `/users/{userId}/history` (get)
* `/users/{userId}/achievements` (get)
* `/usernames/{username}` (get)

### Social (friends, follow, blocks)

* `/me/friend-requests` (get, post)
* `/me/friend-requests/{requestId}` (patch, delete)
* `/me/friends` (get)
* `/me/friends/{userId}` (delete)
* `/me/following` (get)
* `/me/followers` (get)
* `/me/following/{userId}` (put, delete)
* `/me/blocks` (get)
* `/me/blocks/{userId}` (put, delete)

### Invitaciones a torneos (direct-to-user)

* `/me/tournament-invites` (get)
* `/me/tournament-invites/{inviteId}` (patch, delete)

### Sports (catálogo y calendario)

* `/sports` (get)
* `/competitions` (get)
* `/competitions/{competitionId}` (get)
* `/competitions/{competitionId}/seasons` (get)
* `/competitions/{competitionId}/seasons/{seasonId}` (get)
* `/competitions/{competitionId}/seasons/{seasonId}/matchdays` (get)
* `/competitions/{competitionId}/seasons/{seasonId}/matchdays/{matchday}/matches` (get)
* `/matches` (get)
* `/matches/{matchId}` (get)
* `/matches/{matchId}/events` (get)
* `/teams/{teamId}` (get)

### Game Modes & Rules
* `/game-modes` (get)
* `/game-modes/{gameModeId}` (get)
* `/rulesets` (get)
* `/rulesets/{rulesetId}` (get)

### Tournaments (listado, preview, lifecycle)

* `/me/tournaments` (get)
* `/tournaments` (get, post)
* `/tournaments/{tournamentId}/preview` (get)
* `/tournaments/{tournamentId}` (get, patch, delete)
* `/tournaments/{tournamentId}/lock` (put, delete)
* `/tournaments/{tournamentId}/archive` (put, delete)
* `/tournaments/{tournamentId}/owner` (put)
* `/tournaments/{tournamentId}/rules` (get)

### Invitation Codes (join por código sin “espectador”)

* `/tournaments/{tournamentId}/invitation-codes` (get, post)
* `/invitation-codes/{code}` (get)
* `/invitation-codes/{code}/members/me` (put)

### Tournaments (invites y membership)

* `/tournaments/{tournamentId}/invites` (get, post)
* `/tournaments/{tournamentId}/invites/{inviteId}` (delete)
* `/tournaments/{tournamentId}/members/me` (put, delete)
* `/tournaments/{tournamentId}/members` (get)
* `/tournaments/{tournamentId}/members/{userId}` (patch, delete)

### Tournament Matchdays (navegación)

* `/tournaments/{tournamentId}/matchdays` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/matches` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/availability` (get)

### Submissions (modo-agnóstico, p. ej. ScorePrediction)

* `/tournaments/{tournamentId}/matchdays/{matchday}/submissions/me` (get, put, delete)
* `/tournaments/{tournamentId}/matchdays/{matchday}/submissions` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/submissions/{userId}` (get)

### Draft (por jornada) -> Pendiente

* `/tournaments/{tournamentId}/matchdays/{matchday}/draft` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/pool` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/picks` (get, post)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/picks/{pickId}` (get, delete)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/rosters` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/rosters/me` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/lineups/me` (get, put)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/standings` (get)

### Rankings / Results / Live ranking

* `/tournaments/{tournamentId}/ranking` (get)
* `/tournaments/{tournamentId}/ranking/stream` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/ranking` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/results` (get)
* `/tournaments/{tournamentId}/timeline/me` (get)
* `/tournaments/{tournamentId}/timeline/{userId}` (get)

### Stats / Recap / Wrapped (retención + historial)

* `/tournaments/{tournamentId}/stats` (get)
* `/tournaments/{tournamentId}/stats/me` (get)
* `/tournaments/{tournamentId}/recap` (get)
* `/tournaments/{tournamentId}/wrapped/me` (get)

### Chat (incluye moderación por roles)

* `/tournaments/{tournamentId}/chat/messages` (get, post)
* `/tournaments/{tournamentId}/chat/messages/{messageId}` (delete)
* `/tournaments/{tournamentId}/chat/mutes/{userId}` (put, delete)
* `/tournaments/{tournamentId}/chat/pins/{messageId}` (put, delete)
* `/tournaments/{tournamentId}/chat/read-state/me` (get, put)
* `/tournaments/{tournamentId}/chat/stream` (get)

### Live (notificaciones + feed)

* `/me/notifications` (get)
* `/me/notifications/{notificationId}` (patch)
* `/me/notifications/mark-read` (post)
* `/me/feed` (get)
* `/me/feed/stream` (get)
* `/tournaments/{tournamentId}/feed` (get)
* `/tournaments/{tournamentId}/feed/stream` (get)
* `/tournaments/{tournamentId}/subscriptions/me` (get, patch)

### Verified (Hub de eventos curado)

* `/events` (get)
* `/events/{eventId}` (get)
* `/events/{eventId}/members/me` (put, delete)

### Creadores (descubrimiento + catálogo)

* `/creators` (get)
* `/creators/{creatorId}` (get)
* `/creators/{creatorId}/egetvents` ()

### Ranked (progresión verificada)

* `/me/ranked` (get)
* `/ranked/seasons` (get)
* `/ranked/seasons/{seasonId}` (get)
* `/ranked/divisions/{gameModeId}` (get)
* `/ranked/leaderboards/{gameModeId}` (get)

### Achievements (verificados)

* `/me/achievements` (get)
* `/achievements` (get)
* `/achievements/{achievementId}` (get)

### Promotions / Rewards (oficiales, sin betting)

* `/promotions` (get)
* `/promotions/{promotionId}` (get)
* `/me/rewards` (get)
* `/me/rewards/{rewardGrantId}` (get)
* `/me/rewards/{rewardGrantId}/claim` (post)


### Trust & Safety

* `/reports` (post)
* `/me/reports` (get)
* `/appeals` (post)
* `/me/appeals` (get)
* `/me/safety-status` (get)

### Uploads / Media (branding, avatars, assets)

* `/uploads` (post)
* `/uploads/{uploadId}` (get, delete)
* `/uploads/{uploadId}/complete` (post)
* `/media/{mediaId}` (get)

---



## Admin / Backoffice (staff-only)

* `/admin/reports` (get)
* `/admin/reports/{reportId}` (patch)
* `/admin/users/{userId}/bans` (post)
* `/admin/users/{userId}/bans/{banId}` (delete)
* `/admin/creators/{creatorId}/verify` (post)
* `/admin/creators/{creatorId}/branding` (patch)
* `/admin/tournaments/{tournamentId}/verify` (post)
* `/admin/tournaments/{tournamentId}/revoke-verification` (post)
* `/admin/tournaments/{tournamentId}/moderators` (post)
* `/admin/tournaments/{tournamentId}/moderators/{userId}` (delete)
* `/admin/events` (post)
* `/admin/events/{eventId}` (patch, delete)
* `/admin/rulesets` (post)
* `/admin/rulesets/{rulesetId}` (patch)
* `/admin/achievements` (post)
* `/admin/achievements/{achievementId}` (patch)
* `/admin/promotions` (post)
* `/admin/promotions/{promotionId}` (patch)
* `/admin/tournaments/{tournamentId}/recompute` (post)
* `/admin/sports/matches/{matchId}/correct` (post)
* `/admin/notifications/templates` (post)
* `/admin/notifications/templates/{templateId}` (patch)
* `/admin/feature-flags` (get, patch)
