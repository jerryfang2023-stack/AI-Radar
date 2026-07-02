status: open
priority: urgent
lane: business_signals
failed_gate: daily_problem_watchdog
report_path: agent-workflow/reports/2026-07-02-daily-recovery-watchdog.md
data_generated: unknown
needed_action: inspect failed production report and repair the smallest responsible stage; do not dispatch a full rerun from Hermes
created_at: 2026-07-02T02:44:07.950Z
source: daily_problem_watchdog
source_workflow: WaveSight Business Signals PR
source_run_id: 28559645419
source_conclusion: failure

# Business Signals Daily Problem Watchdog (2026-07-02)

## Evidence

- action: inbox_required
- reason: same-date healthy output is not visible after 2 failed attempt(s); record inbox and wait for targeted repair
- failed_attempts: 2
- max_attempts_reference: 4
- source_workflow: WaveSight Business Signals PR
- source_run_id: 28559645419
- source_conclusion: failure

## Expected Codex Action

1. Read the report_path and the failed production workflow artifact first.
2. Classify the earliest responsible stage before running anything.
3. Repair the smallest script, gate, rule, or data build path that caused the incident.
4. Rerun only the exact failed gate or the smallest relevant validation.
5. Close with `npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>`.

