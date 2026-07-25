status: open
priority: normal
lane: automation
category: control_plane_liveness
failed_gate: hermes_control_plane_watchdog
report_path: agent-workflow/reports/YYYY-MM-DD-hermes-control-plane-watchdog.md
data_generated: unknown
needed_action: inspect the missing controller task or report writer
created_at: YYYY-MM-DDTHH:mm:ss+08:00
source: hermes-control-plane-watchdog

# Production Incident

## Evidence

- Add exact report paths and observable controller state.

## Expected Action

1. Repair the smallest control-plane path.
2. Leave downstream data repair to Closure/Codex.
