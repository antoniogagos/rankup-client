# Rankup Engine — Propuesta de partición de dominios

Fecha: 2026-02-03

## Hechos

-	Tenéis 21 bounded contexts definidos por negocio, con un context map razonable (Sports → Scoring/Live; Rules consultado por Submissions/Scoring; Verified habilita Ranked/Achievements; etc.).
-	Hay no negociables que afectan directamente a partición:
	-	Tournament‑centric, sin spectator (solo preview mínimo).
	-	Rulesets inmutables versionados.
	-	Submissions, Scoring, Ranked, Achievements como concerns separados.
	-	Sports detrás de ACL (no contaminar el dominio con el provider).
	-	Backoffice staff‑only con auditoría, no data owner.
-	Estado actual: en packages/rankup existe domains/tournaments (lifecycle + matchdays + membership + invites/codes + analysis + fixtures); rankings viven en domains/scoring/ranking. Sports ya implementa catalog/schedule (contratos + gateways). Rules ya implementa game modes + rulesets (contratos + gateways). Accounts ya implementa auth/me/users/social (contratos + gateways). Submissions ya implementa scorePrediction (contratos + gateways). Se añadió scaffolding (README placeholders) para shared/algorithms/registry/runtime y los dominios engagement, verified, ranked, achievements, media, trustSafety, promotions, creators, admin.
-	Restricciones técnicas clave:
	-	OpenAPI‑first, mock‑first.
	-	UI solo consume contracts/services; no SDK ni implementations.
	-	Composition root decide mock vs real.
	-	Platform es infra‑only.

---

## Juicio técnico

### 1) Lista recomendada de dominios en Rankup Engine

Mi recomendación es no intentar codificar los 21 contexts como 21 dominios “duros” desde el día 1, pero sí fijar como dominios separados aquellos contexts que son:

-	guardrail‑critical (no spectator, rulesets versionados),
-	con alto riesgo de acoplamiento por roadmap (multi‑mode, multi‑sport),
-	explícitamente separados por no negociable (Submissions/Scoring/Ranked/Achievements),
-	transversales (ACL Sports, Trust & Safety, Media).

#### Dominios mínimos (Fase 0) — viable sin hipotecar Fase 1–3

1.	accounts (capabilities: auth, me, users, social)
2.	sports (ACL client contract + normalización)
3.	rules (game modes + rulesets versionados)
4.	tournaments (lifecycle + membership + join policy + invites/codes + matchday navigation)
5.	submissions (modo‑agnóstico; incluye ScorePrediction como capability)
6.	scoring (rankings/results/timeline; snapshots versionados)
7.	engagement (capabilities: chat, live, stats/recap (stub en F0))

Nota: en Fase 0 podéis dejar stats/recap como stub dentro de engagement, pero chat y live ya existen como superficies (aunque “básicas”).

#### Dominios a añadir por roadmap

-	verified (Fase 1): hub curado + eventos verificados + attachments a tournaments.
-	ranked (Fase 1): rating por modo + temporadas/divisiones.
-	achievements (Fase 1): definiciones + grants con evidence.
-	media (Fase 1): uploads + assets + moderation status (necesario para badges/branding).
-	trustSafety (Fase 1, mínimo): reports + enforcement + antifraud signals (aunque sea básico).
-	promotions (Fase 1–2 según premios): campañas + opt‑in + grants/claim/fulfillment.
-	creators (Fase 2): perfiles de creador + branding + catálogo + colecciones.
-	admin (cuando exista app staff): overlay staff‑only; no SoT.

---

### 2) Mapa de dominios (tabla concreta)

| Dominio (engine) | Fase mínima | Propósito | Datos que posee (SoT lógico) | Dependencias (consume) |
| --- | ---: | --- | --- | --- |
| accounts (auth/me/users/social) | 0 | Identidad, perfil, privacidad, dispositivos, directorio y grafo social | UserIdentity (semántica), UserProfile, PrivacySettings, Device, PublicUserIndex (read model), edges Friend/Follow/Block | media (avatar), trustSafety (restricciones) |
| sports | 0 | Catálogo y calendario normalizado (ACL) | Sport/Competition/Season/Matchday/Match/Team/MatchEvent (IDs canónicos, estados monotónicos) | Ninguna; evita dependencia bidireccional |
| rules | 0 | Game modes + rulesets inmutables versionados + resolución de reglas efectivas | GameMode, RulesetSnapshot, estados active/deprecated/retired | Ninguna; solo shared + registry |
| tournaments | 0 | Lifecycle torneo + membership/roles + join policy + invites/codes + preview mínimo + matchday nav | Tournament, TournamentMembership, JoinPolicy, InvitationCode, DirectInvite, TournamentPreview, TournamentMatchdayNav (read model) | media (banners), trustSafety (restricciones); consume IDs de sports/rules |
| submissions | 0 | Acciones de usuario (modo‑agnóstico) por torneo/jornada; lock e idempotencia | SubmissionSet, SubmissionItem, estados draft/submitted/locked, idempotency records | rules (validación), tournaments (authz/membership), sports (lock/kickoff) |
| scoring | 0 | Puntos + rankings + results + timeline; snapshots versionados/auditables | ScoreLedger, RankingSnapshot, MatchdayResults, PositionTimeline, ScoreCorrection | sports (match finished/corrected), submissions, rules (scoring/tiebreakers), tournaments (visibilidad member‑only) |
| engagement (chat/live/stats) | 0 | Feed+notifs, chat, y derivados (stats/recap/wrapped) | FeedItem, Notification, ChatMessage/ReadState/ModerationAction, TournamentRecap/WrappedArtifact (derivados) | tournaments (authz), scoring (snapshots), sports (eventos), trustSafety (enforcement), media (assets si aplica) |
| verified | 1 | Hub curado de eventos verificados + branding + elegibilidad + attachments | VerifiedEvent, Curation, Eligibility, VerifiedTournamentAttachment | tournaments, media, trustSafety, (opcional) creators, promotions |
| ranked | 1 | Rating por modo + temporadas/divisiones + leaderboards | UserRating, RankedSeason, Division, RankedTrack | verified (gating), scoring (snapshots verificados), trustSafety |
| achievements | 1 | Definiciones + grants/revocaciones con evidencia | AchievementDefinition, AchievementGrant, EvidenceRef | verified, scoring, trustSafety |
| media | 1 | Upload sessions + media registry + moderation status | UploadSession, MediaAsset, Variant, ModerationStatus | trustSafety (policy/moderation signals) |
| trustSafety | 1 | Reports, enforcement, appeals, fraud signals | Report, EnforcementAction, Appeal, PolicyDocument, FraudSignal | Ninguna; aplica restricciones a otras |
| promotions | 1–2 | Promos oficiales + opt‑in + rewards/claim/fulfillment (sin betting) | Promotion, OptIn, EligibilitySnapshot, RewardGrant, FulfillmentProfile | verified, trustSafety, scoring, media |
| creators | 2 | Perfiles de creador, branding, catálogo/colecciones, links | CreatorProfile, Branding, Collections, Links | media, trustSafety, (opcional) verified |
| admin (overlay) | 1–2 (si hay staff UI) | Operación staff‑only con auditoría; no inventa modelos paralelos | No SoT. Solo staff views + comandos operativos + audit references | Depende de todos (solo contracts). Requiere auth staff separado |

---

### 3) Granularidad: dominios vs capabilities

Recomendación de partición (criterio “no hipotecar”):

-	Dominios separados obligatorios (por guardrails o crecimiento):
	-	sports, rules, tournaments, submissions, scoring, ranked, achievements, trustSafety, media.
-	Dominios agrupables por eficiencia (capabilities internas):
	-	accounts agrupa auth + me + users + social (cohesión alta, baja fricción).
	-	engagement agrupa chat + live + stats mientras el equipo sea pequeño; si chat/live crecen en complejidad (streams, moderación avanzada), separarlos es trivial si nunca comparten models fuera de shared/.

Regla práctica:
Si un capability empieza a “definir” reglas de otro (p. ej. chat decide membership), ese capability debe moverse o refactorizarse: la autorización y ownership no se duplican.

---

### 4) Ownership y límites (poseer vs consumir)

Propuesta estricta alineada con no‑negociables:

-	tournaments es la única fuente de verdad de:
	-	membership/roles, join policy y el gate de “no spectator”.
	-	Otros dominios solo consumen decisiones de authz (idealmente vía runtime).
-	rules es la única fuente de verdad de:
	-	ruleset versioning e inmutabilidad; ResolveEffectiveRules(tournamentId) vive aquí.
	-	submissions y scoring no embeben reglas hardcoded; aplican ruleset.
-	submissions es la única fuente de verdad de:
	-	acciones de usuario (sets/items) y estados draft/submitted/locked.
-	scoring es la única fuente de verdad de:
	-	puntos, ledger, snapshots y correcciones versionadas.
	-	ranked/achievements/stats/live/promotions solo consumen snapshots/resultados.
-	verified es la única fuente de verdad de:
	-	qué es verificado y qué habilita; ranked/achievements/promotions no reinterpretan verificado.
-	trustSafety es la única fuente de verdad de:
	-	enforcement y señales; el resto aplica restricciones pero no inventa ban state.
-	admin:
	-	opera sobre dominios; no crea modelos paralelos.

---

### 5) Capas no‑dominio dentro de Rankup Engine: registry / runtime / algorithm

Mi posición: deben vivir dentro de Rankup Engine, pero fuera de domains/, con dependencias controladas.

#### 5.1 registry/ (sí, dentro del engine)

Qué es: catálogo interno de capacidades por gameModeId y sportId (mapeo a validadores, UI hints, motores puros).
Por qué aquí: es producto‑específico y central para escalar a nuevos modos/deportes sin acoplar UI a implementations.

Dependencias permitidas:
-	shared/ + tipos de rules (schemas) + algorithms/.

Prohibido:
-	IO (HTTP/storage), dependencias a domains/*/services.

#### 5.2 algorithms/ (sí, dentro del engine)

Qué es: lógica pura determinista (scoring, tie‑breakers, lock rules, draft rules).
Por qué aquí: encaja con “solo tests de algoritmos” y reduce divergencia de reglas entre UI/backend si se reutiliza TS.

Reglas:
-	100% puro, sin reloj real (inyectar IClockService o timestamps como input).
-	Test unitario obligatorio por cada motor usado en producción.
-	Versionado a través de rulesetVersionId + schemaHash (no por if/else disperso).

#### 5.3 runtime/ (sí, dentro del engine)

Qué es: orquestación product‑side por scope (tourney), sin mezclar en UI:

-	ITourneyContextService: resuelve tournamentId + role + gameModeId + rulesetVersionId + verificationStatus.
-	IGameRuntimeService: dispatch por modo usando IGameModeRegistry.

Clave: runtime es el lugar correcto para coordinación cross‑domain (application layer), no dentro de dominios.

---

### 6) Riesgos y trade‑offs (impacto en OpenAPI/mocks/ownership)

#### 6.1 Muchos dominios pequeños

Riesgos:
-	Wiring más pesado en composition root (más servicios/gateways).
-	Más fixtures coherentes cross‑dominio (IDs, coherencia de estados).

Beneficios:
-	Reduce el riesgo de violar no‑negociables por “comodidad”.
-	Facilita ownership real por roadmap (Ranked/Achievements/Verified no contaminan core).

Impacto:
-	OpenAPI: mejor trazabilidad tag→dominio/capability.
-	Mock‑first: más mocks, pero más simples y aislados.

#### 6.2 Pocos dominios grandes (status quo tourney como contenedor)

Riesgos:
-	Acoplamiento silencioso: ranking/submissions/chat terminan compartiendo tipos/decisiones.
-	Split posterior caro (paths de import UI, fixtures, contratos).

Beneficios:
-	Velocidad inicial.

Mi juicio: dado el roadmap (multi‑sport + multi‑mode + verificado como “programa”), el coste de no separar submissions/scoring/ranked/achievements desde temprano es alto y probable.

#### 6.3 Riesgo específico: Odds calculator

Aunque no haya betting, el término/feature puede:
-	introducir ambigüedad regulatoria/perceptiva,
-	contaminar el lenguaje de producto.

Mitigación:
-	Si existe, tratarlo como probability estimator para UX/insights.
-	Mantenerlo estrictamente en algorithms/ + registry, no como mecánica.

---

### 7) Estructura física recomendada (packages/rankup/src)

```text
packages/rankup/src/
	shared/
		models/
		contracts/
		validation/
		fixtures/
	algorithms/
		scoring/
		lockRules/
		tieBreakers/
		draft/
	registry/
		gameModes/
		sports/
	runtime/
		tourney/
		game/
	domains/
		accounts/
			shared/
			auth/
				models/
				contracts/
				services/
				validation/
			me/
				models/
				contracts/
				services/
				validation/
			users/
				models/
				contracts/
				services/
			social/
				models/
				contracts/
				services/
		sports/
			shared/
			catalog/
			schedule/
		rules/
			shared/
			gameModes/
			rulesets/
		tournaments/
			shared/
			core/
			members/
			codes/
			invites/
			matchdays/
			preview/
		submissions/
			shared/
			scorePrediction/
			draft/
		scoring/
			shared/
			ranking/
			results/
			timeline/
		engagement/
			shared/
			chat/
			live/
			stats/
		verified/
			shared/
			hub/
			events/
		ranked/
			shared/
			seasons/
			leaderboards/
		achievements/
			shared/
			catalog/
			grants/
		promotions/
			shared/
			campaigns/
			rewards/
		trustSafety/
			shared/
			reports/
			enforcement/
			appeals/
		media/
			shared/
			uploads/
			assets/
		admin/
			shared/
			ops/
```

Movimiento recomendado desde domains/tournaments:

-	core/members/codes/invites/matchdays → domains/tournaments/*
-	ranking → domains/scoring/ranking
-	analysis → algorithms/ (si es puro) o rules/ (si es resolución de reglas)
-	fixtures → shared/fixtures o fixtures por dominio (evitar fixtures globales no tipados)

---

### 8) Roadmap de rollout de dominios (migración explícita)

Fase 0
-	Crear domains/tournaments y migrar capabilities existentes excepto ranking.
-	Crear domains/scoring y mover ranking allí (sin alias de compatibilidad).
-	Crear domains/submissions (capability scorePrediction).
-	Crear domains/accounts (mínimo: me + social).
-	Crear domains/sports y domains/rules como read‑only contracts.
-	Crear domains/engagement con chat y live básicos.
-	Introducir registry mínimo: IGameModeRegistry con ScorePrediction + stubs.
-	Introducir algorithms mínimo: validadores/lock/tiebreakers si se necesitan client‑side; si no, stubs pero fijar estructura.

Fase 1
-	Añadir domains/verified, domains/ranked, domains/achievements.
-	Añadir domains/media y domains/trustSafety (reports/enforcement mínimo).
-	engagement/stats deja de ser stub: recaps básicos por torneo desde snapshots.

Fase 2
-	Añadir domains/creators.
-	Extender verified para eventos de creador y tooling de comunidad.
-	Endurecer moderación: chat + media + antifraude signals.

Fase 3
-	Expandir sports con nuevos deportes (sin filtrar provider details).
-	Expandir rules/registry para nuevos modos.
-	Implementar submissions/draft + algorithms/draft + scoring para draft.

---

## Preguntas abiertas (impactan partición o contratos)

1.	ScorePrediction ruleset final: lock policy, postpuestos/cancelados, negativos, tie‑breakers/versionado.
2.	Definición operativa de verificado (quién crea, criterios, revocación) → afecta verified + admin + trustSafety.
3.	Temporadas Ranked: duración, compresión/reset, reglas de tracks por modo → define modelos en ranked.
4.	Preview exacto pre‑join (campos permitidos) → contratos estrictos en tournaments/preview.
5.	Premios oficiales (eligibilidad, países, edades, claim) → si entra en Fase 1, promotions requiere dominio propio.
6.	Modelo de eventos Live (catálogo y envelope) → sin decisión temprana rompe live + notifs + stats.
7.	Estrategia de drift OpenAPI vs domain DTOs: sin import de @rankup/api en dominios, se requiere verificación automática para evitar divergencia.
