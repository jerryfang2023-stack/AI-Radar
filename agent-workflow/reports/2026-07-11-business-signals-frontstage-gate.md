# 2026-07-11 Business Signals Frontstage Gate

- generated_at: 2026-07-11T05:17:28.677Z
- status: passed
- failure_categories: none

## Gate Results

### Signal Card editorial quality gate

- status: passed
- script: agent-workflow/tools/assert-signal-card-editorial-quality.mjs
- exit_code: 0

```text
{
  "ok": true,
  "date": "2026-07-11",
  "card_count": 9,
  "problems": []
}
```

### V3 source-first frontstage gate

- status: passed
- script: agent-workflow/tools/assert-v3-source-first-frontstage.mjs
- exit_code: 0

```text
{
  "ok": true,
  "status": "passed",
  "checked_file": "01-SiteV2/site/data/v3-data-observation-desk.json",
  "card_count": 520,
  "frontstage_card_count": 520,
  "issue_count": 0,
  "issues": []
}
```

### Frontstage regression gate

- status: passed
- script: agent-workflow/tools/frontstage-regression-gate.mjs
- exit_code: 0

```text
{
  "ok": true,
  "status": "passed",
  "issue_count": 0,
  "report": "agent-workflow/reports/frontstage-regression-gate-20260711051728.md"
}
```
