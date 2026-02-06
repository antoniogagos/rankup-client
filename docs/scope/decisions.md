# Rankup scope decisions (log)

-   This file logs product-level scope decisions.
-   Engineering decisions remain in ADRs under `docs/adr/`.

| ID     | Date       | Status   | Decision                                                                                                        |
| ------ | ---------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| S-0001 | 2026-01-28 | Accepted | Rankup has no real-money features.                                                                              |
| S-0002 | 2026-01-28 | Accepted | All gameplay happens inside tournaments (public or private).                                                    |
| S-0003 | 2026-01-28 | Accepted | Current game mode is ScorePrediction.                                                                           |
| S-0004 | 2026-01-28 | Accepted | Draft (FUT Draft-style) is planned as a second game mode; detailed rules TBD.                                   |
| S-0005 | 2026-01-28 | Accepted | Each game mode can support multiple sports (football now; basketball/esports planned).                          |
| S-0006 | 2026-01-28 | Accepted | Tournaments have an admin role.                                                                                 |
| S-0007 | 2026-01-28 | Accepted | Hosting target is unknown for now; frontend development is local with mocks; backend is implemented last.       |
| S-0008 | 2026-01-29 | Accepted | Rankup is in greenfield mode; breaking changes are allowed until production readiness is declared.              |
| S-0009 | 2026-01-29 | Accepted | Canonical IDs are fixed: gameModeId `scorePrediction` / `draft`; sportId `football` / `basketball` / `esports`. |
