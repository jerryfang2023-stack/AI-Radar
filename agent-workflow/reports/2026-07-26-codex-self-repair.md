# WaveSight Codex Self Repair - 2026-07-26

- generated_at: 2026-07-26T01:52:32.960Z
- status: blocked_dirty_worktree
- invoke_mode: on
- self_check_report: agent-workflow/reports/2026-07-26-daily-self-check.json
- prompt: agent-workflow/reports/2026-07-26-codex-self-repair-prompt.md

## Tasks

| Lane | Severity | Failed Gate | Report |
|---|---|---|---|
| business_signals | failed | agent-workflow/reports/2026-07-26-daily-production-chain-readiness.md | agent-workflow/reports/2026-07-26-daily-supervision-report.md |

## Self Check Command

- ok: false
- command: `node agent-workflow/tools/run-daily-self-check.mjs --date=2026-07-26 --repair=safe --github=auto --scheduled-task=auto`

## Codex Invocation

- none

## Block Reason

Working tree is dirty. Re-run with --allow-dirty=true only when the dirty diff is expected.
