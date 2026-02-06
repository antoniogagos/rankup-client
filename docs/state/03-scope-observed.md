# Product scope observed in code

## High-level summary

-   Web client for Rankup with public and authenticated flows.
-   Core flow centers on tournaments (tourneys) and match result predictions.
-   packages/api/openapi.yaml is ALWAYS the source of truth for the API (maintainers decision). The frontend may extend the spec ahead of backend implementation.

## Pages and screens (observed)

Public:

-   Welcome
-   Sign in (password + Google OAuth)
-   Sign up + confirm registration
-   Forgot password + reset password
-   404

Authenticated:

-   Home / tourney list
-   Create tourney
-   Join tourney
-   Tourney shell with tabs:
    -   Matchday (fixtures + betting)
    -   Ranking (season or matchday)
    -   Chat (local list)
    -   Share tourney
    -   Settings (notification toggles, leave tourney)
    -   Rules / scoring system

## Game modes (observed)

-   ScorePrediction (SCORE_PREDICTION in rk-sb-\* components).
-   No "draft" references found in the codebase.

## Entities and data types (observed)

-   Session: accessToken, idToken, refreshToken, provider, expiresAt, userId, email.
-   User: inferred from mock data returned by GetUser().
-   Competition, Match, Ranking types now live in domain contracts and are mapped from `@rankup/api`.
-   Chat and ChatMessage types exist but no API methods are wired.

## Sports and competition assumptions (observed)

-   CompetitionId enum lists football competitions only (Spain, UK, Champions League, etc).
-   UI assets and mock data reference football leagues and teams (Sevilla, Betis, La Liga, Premier League, Champions League).
-   Match statuses and weather enums align with football API conventions.

## UNKNOWN (needs info)

-   Exact tournament admin capabilities and moderation rules (see `docs/scope/questions.md`).
-   Detailed ScorePrediction scoring/tie-break rules (see `docs/scope/questions.md`).
-   Draft rules and constraints (see `docs/scope/questions.md`).
-   Hosting/deploy target and auth requirements (see `docs/scope/questions.md`).

## Note

Planned scope and product decisions are documented in `docs/scope/` and are not inferred from the current code snapshot.
