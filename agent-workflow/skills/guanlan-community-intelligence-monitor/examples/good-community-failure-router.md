# Good Community Failure Router Example

Use this pattern when a Community Intelligence morning run is red.

```yaml
---
date: 2026-06-14
lane: community_intelligence
check_time: 09:30 Asia/Shanghai
local_data_date: 2026-06-14
items: 61
links: 57
gate_report: agent-workflow/reports/2026-06-14-community-intelligence-gate.md
publish_pr: https://github.com/jerryfang2023-stack/AI-Radar/pull/66
classification: publish_verification
next_action: verify PR merge and Pages, do not rerun local browser collection
---
```

Why it passes:

- It separates local collection health from GitHub publication health.
- It avoids asking GitHub Actions to run the logged-in Chrome collector.
- It does not call stale data a failure before the 08:45 local check and 09:15 consolidated recovery.
- It chooses the smallest repair path for the earliest broken stage.
