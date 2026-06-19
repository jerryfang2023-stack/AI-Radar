# 2026-06-19 Business Signals Frontstage Gate

- generated_at: 2026-06-19T08:10:51.160Z
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
  "card_count": 326,
  "frontstage_card_count": 187,
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
  "report": "agent-workflow/reports/frontstage-regression-gate-20260619081051.md"
}
```
