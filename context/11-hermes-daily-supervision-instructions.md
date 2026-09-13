---
status: current
scope: manual-control-plane-inspection
last_updated: 2026-09-13
---

# Manual supervision and optional Hermes inspection

Daily production inspection and repair are operator-owned. The current Windows
schedule is four tasks: 08:10 Morning (domestic/overseas financing and other Business Signals + independent Builder RSS),
08:30 Community, 16:10 Follow Builders, 16:45 Final Closure.

The 09:15 Recovery, 09:50 Closure and 10:20 Hermes timers are retired. Do not
recreate them during routine installation. The former seven-task contract and
its historical receipts do not define current required task presence.

## Daily operator check

Check domestic financing, overseas/general financing and Builder RSS separately.
A successful main dispatch does not prove that all three lanes completed.
Read the actual production date and stage results, GitHub production/PR/deployment
results and runtime receipts. A successful dispatch is not completed publication.
Final Closure continues to own the data lake, external Vault, Funding Portal and
protected OPS publication. Use its receipt as the combined end-of-day evidence.

Preserve accepted upstream snapshots; resume the earliest failed stage and its
dependents. Never recollect solely because a downstream build or publication failed.

## Optional manual tools

- `node agent-workflow/tools/run-daily-automation-controller.mjs --phase=recovery`
  checks lane status and may dispatch missing production.
- `node agent-workflow/tools/run-daily-automation-controller.mjs --phase=closure --invoke-codex=false`
  performs local self-check and safe repair without invoking Codex. This is a
  write-capable manual action, not a read-only report command.
- `node agent-workflow/tools/run-hermes-control-plane-watchdog.mjs --force=true --reports-dir=<runtime> --incident-dir=<runtime>/production-incidents`
  checks Morning controller liveness only. It does not require receipts for retired
  Recovery or Closure timers, and it does not evaluate business output quality.
- The heartbeat publisher remains available for explicit manual use. Retired
  phases are `not_scheduled` and excluded from active health aggregation. V1 payloads
  retain their phase entries for compatibility with the existing cloud receiver.

There is no expected daily Hermes heartbeat and no 10:30 heartbeat deadline.
Absence of a new heartbeat must not create a missing-schedule or production incident.
Historical heartbeat failures remain historical evidence.

The cloud Business Signals fallback, production-failure artifacts, weekly health,
weekly reports and monthly reports remain enabled. The Hermes Gateway login task
is separate from WaveSight's retired watchdog timer.
