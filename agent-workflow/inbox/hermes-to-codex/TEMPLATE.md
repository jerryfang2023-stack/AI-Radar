status: open
priority: normal
lane: business_signals
category: monitor_or_gate_failure
failed_gate: agent-workflow/reports/YYYY-MM-DD-daily-supervision-report.md
report_path: agent-workflow/reports/YYYY-MM-DD-daily-supervision-report.md
data_generated: yes
needed_action: repair rule
created_at: YYYY-MM-DDTHH:mm:ss+08:00
updated_at: YYYY-MM-DDTHH:mm:ss+08:00
source: hermes

# Hermes Repair Request

## Evidence

- 

## Expected Codex Action

- 
- close with `npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>`

## User Escalation Needed

- no
