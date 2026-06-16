# Bad Weekly Report Page Pattern

User asks: “生成本周周报页面。”

Bad output:

- Reads only `agent-workflow/reports/YYYY-MM-DD-weekly-ai-business-change-radar.md`.
- Places weekly report above the relationship network.
- Keeps Trend Candidates and History blocks on Intelligence Map.
- Shows hero cards for `日期 / 范围 / 版本`.
- Uses the generic H1 `本周 AI 商业变化判断`.
- Renders all Markdown tables as HTML `<table>`.
- Uses static date text instead of a time-window selector.
- Shows section headings as `01` plus `1. 标题`.
- Leaves visible footer text such as `报告版本：v3.3-merged`.

Why it fails: it exposes backend structure, ignores the accepted content source, and produces a table-heavy page instead of an editorial frontstage page.
