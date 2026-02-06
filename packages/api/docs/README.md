# Specification Documents

This directory contains documents that inform the API-first design process for Rankup.

## Purpose

These documents consolidate product vision, domain knowledge, and technical context into a single location that serves as the foundation for OpenAPI specification work.

## Contents

| Document                                            | Purpose                                                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------------- |
| [SPEC-CONTEXT.md](SPEC-CONTEXT.md)                  | Master context document for API specification design                          |
| [BREVIARIO.md](BREVIARIO.md)                        | Visión de producto y respuestas base de negocio (brief fundador)              |
| [API-ARCHITECT-PROMPT.md](API-ARCHITECT-PROMPT.md)  | System prompt for LLM-assisted API design sessions                            |
| [errors/README.md](errors/README.md)                | Canonical catalog of RFC 9457 Problem Details error types                     |

## How to Use

### Starting an API Design Session

1. Open a new conversation with an LLM (Claude, GPT-4, etc.)
2. Copy the entire contents of `API-ARCHITECT-PROMPT.md` as the system prompt or initial context
3. Attach `SPEC-CONTEXT.md` and `packages/api/openapi.yaml` as reference documents
4. Follow the session protocol defined in the prompt

1. **Before designing new API endpoints**: Read SPEC-CONTEXT.md to understand the full product vision, domain model, and existing constraints.

2. **When answering open questions**: Update SPEC-CONTEXT.md with decisions, then propagate to `docs/scope/questions.md` and `docs/scope/decisions.md`.

3. **After OpenAPI changes**: Ensure SPEC-CONTEXT.md reflects the current state (Section 13: Current OpenAPI Status).

## Relationship to Other Docs

- `docs/scope/` - High-level product scope and decisions (source of truth for product vision)
- `docs/domain/` - Domain glossary (authoritative definitions)
- `docs/architecture/` - Technical architecture (how the system is built)
- `docs/state/` - Observed reality snapshots (what currently exists)
- `packages/api/openapi.yaml` - The OpenAPI specification itself (source of truth for API contract)

SPEC-CONTEXT.md synthesizes information from all these sources into a single document optimized for API design discussions.

## Maintenance

- Update when product decisions are made (add to Sections 4, 5, 7, 8)
- Update when open questions are resolved (move from Section 11 to relevant sections)
- Update when new API operations are added (Section 13)
- Review periodically to ensure alignment with other docs
