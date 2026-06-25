# 2026-06-25 Business Signals Frontstage Gate

- generated_at: 2026-06-25T03:26:38.738Z
- status: passed
- failure_categories: none

## Gate Results

### V3 source-first frontstage gate

- status: passed
- script: agent-workflow/tools/assert-v3-source-first-frontstage.mjs
- exit_code: 0

```text
{
  "ok": true,
  "status": "passed",
  "checked_file": "01-SiteV2/site/data/v3-data-observation-desk.json",
  "card_count": 205,
  "frontstage_card_count": 146,
  "top10_count": 10,
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
  "report": "agent-workflow/reports/frontstage-regression-gate-20260625032638.md"
}
```
