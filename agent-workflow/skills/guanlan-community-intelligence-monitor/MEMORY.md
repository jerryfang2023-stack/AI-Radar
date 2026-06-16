# Guanlan Community Intelligence Monitor Memory

Keep this file short. Add only durable lane-level lessons from repeated production failures.

## 2026-06-12

- Community Intelligence collection depends on local logged-in browser state. GitHub Actions can publish validated same-date files, but it cannot replace the local collector when login state or Chrome profile access is missing.

## 2026-06-14

- Do not raise a Community Intelligence missing-data failure before the 08:45 / 09:30 production windows unless a same-day local collector failure log already exists. The 2026-06-14 03:17 alert was a pre-window false positive.
- Weekend source scarcity was not the cause of the 2026-06-13 / 2026-06-14 issues: both days produced 61+ items and 57+ links after local collection. Route weekend red states through local-run and publish-stage checks before changing thresholds.

## 2026-06-16

- Treat healthy same-date local Community Intelligence files as publish-ready, not publication-complete. Hermes early handoff must still require a same-date community publish workflow / PR path before marking the lane complete.
