# Work tracking (inviolable)

## Invariants

-   `docs/work/CURRENT.md` always reflects the active epic and its status.
-   Every structural change requires:
    -   updating `docs/work/CURRENT.md`
    -   updating the active epic file under `docs/work/epics/`
    -   adding a daily entry under `docs/work/log/YYYY-MM-DD.md`
-   Structural changes must also update `AGENTS.md` (see ADR 0015).
-   If a rule changes, record it via ADR and update this README.

## Resume procedure (agents)

1. Read `docs/work/CURRENT.md` before doing anything else.
2. Read the active epic file referenced in CURRENT.
3. Read the latest log entry in `docs/work/log/`.
4. Only then begin work.

## Updating the work log

-   Add a dated entry for each day you make structural changes.
-   Include summary, files touched, and verification status.
