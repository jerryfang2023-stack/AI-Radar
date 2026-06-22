# Guanlan Community Intelligence Monitor Memory

Keep this file short. Add only durable lane-level lessons from repeated production failures.

## 2026-06-21 Supervision Classification

- Community supervision must judge same-date local data and gate before Windows task history or latest GitHub run state. If `community-intelligence.json` is same-date, items / links meet floors, collector errors are zero, and the community gate passes, the local collection stage is healthy.
- A non-zero Windows scheduled task `LastTaskResult` is a warning when same-date data and gate are healthy. It is a local task reliability signal, not proof that the community lane needs recollection.
- If a same-date community automation PR has merged, or same-date data / gate are healthy and the publish workflow is red, classify the problem as publish workflow / PR handling only. Do not rerun browser collection unless data is stale, missing, or gate-failed.
- After a local repair produces same-date data and gate, rerun daily supervision before leaving Hermes inbox items open; stale supervision reports can otherwise keep obsolete red lights alive.

## 2026-06-12

- Community Intelligence collection depends on local logged-in browser state. GitHub Actions can publish validated same-date files, but it cannot replace the local collector when login state or Chrome profile access is missing.

## 2026-06-14

- Do not raise a Community Intelligence missing-data failure before the 08:45 / 09:30 production windows unless a same-day local collector failure log already exists. The 2026-06-14 03:17 alert was a pre-window false positive.
- Weekend source scarcity was not the cause of the 2026-06-13 / 2026-06-14 issues: both days produced 61+ items and 57+ links after local collection. Route weekend red states through local-run and publish-stage checks before changing thresholds.

## 2026-06-16

- If `npm run collect:community-intelligence` fails because `http://127.0.0.1:9333/json/version` is unavailable or returns 503, use the local launcher wrapper to start Chrome with `.codex-browser-profile/community-scan` and the CDP port instead of treating the lane as unhealthy.

## 2026-06-18

- Same-date Community Intelligence publication can arrive through the local publisher branch `automation/community-intelligence-<date>` before any same-date `daily-community-intelligence-pr.yml` workflow run exists. Hermes daily supervision must treat that PR state as publication evidence instead of raising a false missing-workflow repair.
