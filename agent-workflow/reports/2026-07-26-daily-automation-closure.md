# WaveSight Daily Automation closure - 2026-07-26

- generated_at: 2026-07-26T01:52:32.989Z
- status: repair_required
- ok: false
- dry_run: false

## Actions

| Action | Status | Command |
|---|---|---|
| Data Center projection coverage | failed | `node agent-workflow/tools/assert-data-center-projection-coverage.mjs --date=2026-07-26` |
| Daily self-check and safe repair | failed | `node agent-workflow/tools/run-daily-self-check.mjs --date=2026-07-26 --repair=safe` |
| Codex targeted repair handoff | failed | `node agent-workflow/tools/run-codex-self-repair.mjs --date=2026-07-26 --repair=safe --invoke=on --codex-command=codex` |

## Notes

- none
