# Engine No-PII Logging Policy (Baseline v1)

## Scope

-   `packages/rankup/src/runtime/**`
-   `packages/rankup/src/algorithms/**`
-   `packages/rankup/src/registry/**`
-   `packages/rankup/src/shared/**`
-   `packages/api-mock/src/core/engine-runtime.ts`

## Policy

Engine runtime code must not emit direct process/application logs from domain execution paths.

-   Forbidden sinks:
	-   `console.log|info|warn|error|debug|trace`
	-   `process.stdout.write`
	-   `process.stderr.write`
	-   direct `logger.*` sinks
-   Rationale:
	-   prevent accidental leakage of PII/sensitive payloads from submissions/auth contexts,
	-   keep observability in deterministic domain events and snapshot metadata (`requestId`, `correlationId`, `causationId`) instead of raw payload logs.

## Enforcement

-   Guardrail script: `scripts/repo-engine-no-pii-logging.ts`
-   Integrated in `repo:guardrails` and therefore in `yarn validate`.

## Change process

Any exception to this policy requires:

1. ADR update,
2. explicit redaction strategy,
3. guardrail update with scoped allowlist.
