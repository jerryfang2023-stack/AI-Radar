# Hermes Control Plane Watchdog - 2026-07-26

- generated_at: 2026-07-26T02:20:02.148Z
- status: passed
- scope: controller liveness only

| Controller | Observable | Controller status | Report | Note |
|---|---|---|---|---|
| morning | yes | passed | `agent-workflow/reports/2026-07-26-daily-automation-morning.json` | controller executed; downstream status remains owned by Closure/Codex |
| recovery | yes | passed_or_waiting | `agent-workflow/reports/2026-07-26-daily-automation-recovery.json` | controller executed; downstream status remains owned by Closure/Codex |
| closure | yes | repair_required | `agent-workflow/reports/2026-07-26-daily-automation-closure.json` | controller executed; downstream status remains owned by Closure/Codex |

Hermes does not evaluate lane data quality, compatibility Card counts, or downstream repair results.
