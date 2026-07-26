# WaveSight Daily Self Check - 2026-07-26

- generated_at: 2026-07-26T01:52:32.567Z
- status: repair_required
- repair_mode: safe
- supervision_report: agent-workflow/reports/2026-07-26-daily-supervision-report.md

## Issues

| Lane | Kind | Severity | Message |
|---|---|---|---|
| community_intelligence | warning | warning | community scheduled task last result is 1, but same-date data and gate are healthy |
| business_signals | problem | failed | business-signal activeDate is 2026-07-25, expected 2026-07-26 |
| business_signals | problem | failed | public Card count is 0 for 2026-07-26 |
| business_signals | problem | failed | no same-date signal Card files or frontstage Core Signal Cards |
| business_signals | problem | failed | Business Signals workflow conclusion is failure |
| business_signals | warning | warning | missing same-date persistent asset manifest: agent-workflow/reports/2026-07-26-persistent-asset-manifest.json |
| business_signals | warning | warning | missing quality gate report: agent-workflow/reports/2026-07-26-guanlan-monitor-quality-gate.md |
| business_signals | warning | warning | latest same-date GitHub Pages workflow conclusion is skipped |
| business_signals | warning | warning | local Obsidian sync may be blocked by 17 dirty file(s) |

## Safe Repair Attempts

| Attempt | Status | Command |
|---|---|---|
| rerun Business Signals frontstage gate | failed | `npm run assert:business-frontstage -- --date=2026-07-26` |

## Codex Repair Tasks

- business_signals: Read AGENTS.md and current context rules. Read agent-workflow/reports/2026-07-26-daily-supervision-report.md. Inspect failed gate/report: agent-workflow/reports/2026-07-26-daily-production-chain-readiness.md. Resolve these issue(s): business-signal activeDate is 2026-07-25, expected 2026-07-26 | public Card count is 0 for 2026-07-26 | no same-date signal Card files or frontstage Core Signal Cards | Business Signals workflow conclusion is failure. Classify the earliest responsible stage. Repair the smallest script, gate, rule, eval, or generated-report path. Rerun the exact failed gate or smallest validation. Do not lower evidence gates, do not use builders/community material as Business Signal facts, and do not blindly rerun the full Business Signals chain.
- self_repair: Self-repair command failed: npm run assert:business-frontstage -- --date=2026-07-26. Inspect stdout/stderr in the self-check report and repair the smallest failing path.
