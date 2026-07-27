# Hermes Control Plane Watchdog - 2026-07-27

- generated_at: 2026-07-27T06:17:09.887Z
- status: passed
- scope: controller liveness only

| Controller | Observable | Controller status | Report | Note |
|---|---|---|---|---|
| morning | yes | passed | `agent-workflow/reports/2026-07-27-daily-automation-morning.json` | controller executed; downstream status remains owned by Closure/Codex |
| recovery | yes | passed_or_waiting | `agent-workflow/reports/2026-07-27-daily-automation-recovery.json` | controller executed; downstream status remains owned by Closure/Codex |
| closure | yes | closed | `agent-workflow/reports/2026-07-27-daily-automation-closure.json` | controller executed; downstream status remains owned by Closure/Codex |

Hermes does not evaluate lane data quality, compatibility Card counts, or downstream repair results.
