status: resolved
priority: urgent
lane: automation
category: control_plane_liveness
failed_gate: hermes_control_plane_watchdog
report_path: ../../../../AppData/Local/WaveSight/runtime/2026-08-26-hermes-control-plane-watchdog.md
data_generated: yes
needed_action: none
created_at: 2026-08-26T17:19:51+08:00
updated_at: 2026-08-26T18:30:03+08:00
resolved_at: 2026-08-26T18:30:03+08:00
resolver: codex
fix_commit: 2c15f7c894b7f67f898b6ace27299976485e95d8
validation: control-plane-tests-and-live-supervision-passed
prevention_added: gate
source: hermes-control-plane-watchdog

# Control Plane Liveness Incident - 2026-08-26

## Evidence

- Windows `StartWhenAvailable` triggered all seven missed tasks together at 2026-08-26 17:19 +08:00.
- The watchdog inspected controller reports before the concurrently launched controllers had written them, so it opened an early liveness incident.
- Business Signals completed in GitHub PR #714 and generated the 2026-08-26 data and funding bundles.
- Community Intelligence then completed in GitHub PR #715 with 480 collected records and 39 published items.

## Root Cause

Task Scheduler only applied `IgnoreNew` within each task. It did not serialize the distinct morning, recovery, closure, final-closure, watchdog, community, and follow-builders tasks that were all catching up after the workstation became available.

## Resolution

1. Stale scheduled morning, recovery, and closure phases now write an observable `superseded` report instead of starting duplicate heavy production work.
2. Manual controller runs and final closure remain executable for deliberate recovery.
3. The Hermes watchdog allows a 15-second report grace period before opening a liveness incident.
4. Community Intelligence writes its gate report to the isolated runtime directory instead of modifying the primary worktree.

The control-plane tests, Funding Insight full gate, and current-day data projections passed after the repair.

## Resolution - 2026-08-26T18:30:03+08:00

- fix_commit: 2c15f7c894b7f67f898b6ace27299976485e95d8
- validation: control-plane-tests-and-live-supervision-passed
- prevention_added: gate
