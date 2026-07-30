# Production Incident Registry

This is the current neutral incident queue for WaveSight automation and production failures.

Routine lane quality findings are owned by their gates, Daily Closure, and Codex self-repair. Hermes may write here only when the daily automation controllers are missing or unobservable.

Retired Hermes handoff records are available through Git history only. Current readers and writers use this registry exclusively.

## Record path

```text
agent-workflow/inbox/production-incidents/YYYY-MM-DD-<lane>-<short-slug>.md
```

## Required fields

```text
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
```
