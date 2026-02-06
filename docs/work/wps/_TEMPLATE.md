# WP-XXX-YY: <Título corto>

## Status

-   Status: Planned | Ready | In Progress | Blocked | Done
-   Epic: `docs/work/epics/XXX-____.md`
-   Skill: `<skill-name-from-.codex/skills/README.md>`
-   Owner: <name/agent>
-   Last updated: YYYY-MM-DD

## Goal

(1–2 frases: qué outcome verificable deja este WP)

## Non-goals

-   (Qué no se toca para evitar scope creep)

## Definition of Ready (DoR)

-   [ ] Epic activo confirmado en `docs/work/CURRENT.md`
-   [ ] Este WP está listado en el epic y marcado como `Ready`
-   [ ] No hay decisiones bloqueantes en `docs/adr/PENDING.md` que afecten a este WP
-   [ ] Se conocen los invariantes relevantes (lista abajo) y cómo verificarlos
-   [ ] Se sabe qué carpetas/archivos se tocarán (para evitar conflictos)

## Expected changes (files/areas)

-   (Lista concreta de rutas/archivos; si es muy grande, globs)

## Implementation plan

1.
2.
3.

## Invariants / constraints (must not regress)

-   (Lista de reglas que este WP podría romper si se hace mal)

## Verification (must provide evidence)

### Commands

-   `yarn validate` -> PASS/FAIL
-   (Opcional) `yarn lint` -> PASS/FAIL
-   (Opcional) otros: openapi:lint, openapi:check, etc.

### Ripgrep checks (if applicable)

-   `rg -n "..." ...` -> no matches

## Definition of Done (DoD)

-   [ ] Código/Docs implementados según el goal
-   [ ] `yarn validate` PASS (o FAIL documentado con causa y bloqueo explícito)
-   [ ] Work log del día actualizado con evidencia: `docs/work/log/YYYY-MM-DD.md`
-   [ ] Epic actualizado (checklist y estado del WP)
-   [ ] Si es structural change: ADR + índice ADR actualizado
