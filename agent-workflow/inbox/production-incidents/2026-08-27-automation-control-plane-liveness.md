status: resolved
priority: urgent
lane: automation
category: control_plane_liveness
failed_gate: hermes_control_plane_watchdog
report_path: ../../../../AppData/Local/WaveSight/runtime/2026-08-27-hermes-control-plane-watchdog.md
data_generated: unknown
needed_action: inspect the missing controller task or report writer; do not rerun production from Hermes
created_at: 2026-08-27T11:10:44+08:00
updated_at: 2026-08-27T11:42:33+08:00
resolved_at: 2026-08-27T11:42:33+08:00
resolver: codex
fix_commit: ec9c3a5dc5bdf62df2c729463ae46ead8a89a9ac
validation: 21 controller/watchdog tests passed; Standards audit 0; Spec audit 0
prevention_added: gate
source: hermes-control-plane-watchdog

# Control Plane Liveness Incident - 2026-08-27

## Evidence

- closure: closure controller report is missing or unreadable; expected report: ../../../../AppData/Local/WaveSight/runtime/2026-08-27-daily-automation-closure.json

## Expected Action

1. Verify the scheduled controller task and its local execution result.
2. Restore the missing controller or report-writing path.
3. Let Closure/Codex own any downstream data repair.
4. Do not inspect V3 Card counts or lower V4 evidence gates.

## Resolution - 2026-08-27T11:42:33+08:00

- fix_commit: ec9c3a5dc5bdf62df2c729463ae46ead8a89a9ac
- validation: 21 controller/watchdog tests passed; Standards audit 0; Spec audit 0
- prevention_added: gate
