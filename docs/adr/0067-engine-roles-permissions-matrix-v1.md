# ADR 0067: Engine roles and permissions matrix v1

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup, packages/api

## Context

Critical mutation paths lacked one normative authorization matrix across runtime and contract responses.

## Decision

-   Define explicit role matrix (`owner`, `admin`, `moderator`, `player`, `staff`) for core tournament actions.
-   Action policy baseline:
	- Join tournament: `player` and above, subject to join policy and trust-safety constraints.
	- Lock/unlock/archive/unarchive/transfer ownership: `owner|admin` (staff override allowed).
	- Membership modifications: `owner|admin`.
	- Submissions upsert/clear: `player` member only, blocked by lock/enforcement.
	- Lifecycle cancellation: `staff` override only.
-   Authorization failures map to stable Problem codes (`forbiddenRole`, `notMember`, `tournamentLocked`).
-   Privileged actions require audit metadata (`actorId`, reason, timestamp).

## Constraints

-   Matrix is runtime-enforced, not UI-only.
-   TrustSafety restrictions can further reduce allowed actions.

## Consequences

### Positive

-   Consistent authorization behavior across use-cases and handlers.

### Negative / Risks

-   Existing handlers may require policy alignment updates.

## Alternatives considered

-   Leave permissions endpoint-specific and implicit (rejected).

## Implementation plan

-   [x] Introduce AuthorizationPort and policy helpers.
-   [x] Enforce role matrix in join/submission/lifecycle use-cases.

## Verification

-   `yarn engine:test`
-   `yarn validate`
