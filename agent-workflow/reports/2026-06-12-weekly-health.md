# WaveSight Weekly Health - 2026-06-06 to 2026-06-12

- generated_at: 2026-06-12T05:27:30.207Z
- status: review
- days: 7

## Daily Supervision Coverage

| Date | Status | Lane statuses |
|---|---|---|
| 2026-06-06 | missing | none |
| 2026-06-07 | missing | none |
| 2026-06-08 | missing | none |
| 2026-06-09 | warning | community_intelligence:passed<br>business_signals:warning<br>first_line_viewpoints:warning |
| 2026-06-10 | missing | none |
| 2026-06-11 | missing | none |
| 2026-06-12 | passed | community_intelligence:passed<br>business_signals:passed<br>first_line_viewpoints:passed |

## Lane Status Totals

- community_intelligence:passed: 2
- business_signals:passed: 1
- business_signals:warning: 1
- first_line_viewpoints:passed: 1
- first_line_viewpoints:warning: 1

## Recurring Problems

- none

## Recurring Warnings

- none

## Hermes Incident Loop

- incidents_in_window: 2
- unresolved_incidents: 0

| Date | Lane | Status | Failed Gate | Categories | File |
|---|---|---|---|---|---|
| 2026-06-11 | business_signals | resolved | frontstage Top10 selection | business_signals_top10_missing<br>monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-06-11-business-signals-top10-empty.md` |
| 2026-06-12 | business_signals | resolved | source_first_frontstage_gate + top10 missing | business_signals_top10_missing<br>source_first_frontstage_gate<br>frontstage_title_translation<br>monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-06-12-business-signals-gate-failure-and-top10-empty.md` |

## Repeated Incident Categories

- business_signals: business_signals_top10_missing: 2
- business_signals: monitor_or_gate_failure: 2

## Action Log Loop

- action_records_in_window: 3
- failed_or_partial_records: 0
- unregistered_records: 0

- none

## Repeated Action Log Issues

- none

## Learning Loop Escalations

- Hermes incident category repeated (2x): business_signals: business_signals_top10_missing. Add a regression eval and durable MEMORY entry if not already present.
- Hermes incident category repeated (2x): business_signals: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.

## GitHub Workflow Health

| Workflow | Available | Runs | Failures | In progress |
|---|---:|---:|---:|---:|
| daily-persistent-assets-pr.yml | yes | 0 | 0 | 0 |
| daily-first-line-viewpoints-pr.yml | yes | 0 | 0 | 0 |
| github-pages.yml | yes | 0 | 0 | 0 |

## Historical / Conflict Signals To Review

- suspicious_match_count: 34

- AGENTS.md:85:- daily observation;
- AGENTS.md:86:- business brief;
- AGENTS.md:87:- trend report;
- AGENTS.md:143:- Trend candidate is not trend report.
- context\version-ledger.md:32:- WaveSight AI is now a unified intelligence frontstage, not a V2 four-column content site.
- context\version-ledger.md:77:- V2 four-column pages, old homepage, old trend page, old business-brief page.
- context\version-ledger.md:78:- Daily observation, trend report, or business brief as required outputs.
- context\version-ledger.md:85:- Netlify configuration, Netlify deploy scripts, or Netlify as a fallback deployment path.
- context\version-ledger.md:110:| `V3.3.3.2-freeze-project-health-automation-20260610` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-10 | 2026-06-10T00:44:49+08:00 | V3.3.3.2-project-health-automation | project maintenance only living in chat checklists; weekly recurring failures without a report; monthly cleanup performed before review; deletion-first Git cleanup; Netlify or artifact residue returning unnoticed | `npm run health:daily` + `npm run health:weekly` + `npm run health:monthly` |
- context\version-ledger.md:119:| `V3.0.0-freeze-data-observation-desk-20260604` | Data Observation Desk | 2026-06-04 | 2026-06-04 | V3.0.0-data-observation-desk | V2 four-column pages, old homepage, tag-count pseudo trends, internal status language | upgraded |
- context\07-v3-intelligence-generation-rules.md:28:V3 does not require daily observation, trend report, or business brief output.
- context\07-v3-intelligence-generation-rules.md:190:Trend candidate is not trend report.
- context\frontstage-page-contracts.md:22:| Business Signals | `01-SiteV2/site/v3-data-observation.html` | V3.3 main business-signal desk; date selection; product / funding / case Cards; visual relationship graph; trend candidates; source-first details | V2 homepage modules; daily observation; business brief; trend-report prose; follow-builders evidence; backend fields such as Raw / Pool / threshold / gate in frontstage copy | syntax + source-first gate + frontstage regression |
- context\01-product-map.md:94:- daily observation;
- context\01-product-map.md:95:- trend report;
- context\01-product-map.md:96:- business brief / internal reference;
- context\context-index.md:62:- Daily observation writing, business brief, and trend report are not V3.3 required outputs.
- context\06-execution-harness.md:44:Does not produce articles, briefs, trend reports, frontstage copy, or recommendations.
- context\06-execution-harness.md:99:Trend candidate is not a trend report.
- context\06-execution-harness.md:116:- daily observation;
- context\06-execution-harness.md:117:- trend report;
- context\06-execution-harness.md:118:- business brief / business internal reference;
- context\00-current-state.md:62:- daily observation;
- context\00-current-state.md:63:- business brief / business internal reference;
- context\00-current-state.md:64:- trend report;
- context\11-hermes-daily-supervision-instructions.md:104:- Do not use `05-frontier-opinions/*` as current First-Line Viewpoints evidence.
- context\05-daily-monitoring.md:31:- daily observation;
- context\05-daily-monitoring.md:32:- business brief;
- context\05-daily-monitoring.md:33:- trend report;
- context\09-v3-3-current-action-index.md:43:| Trend candidate judgment | `current` | Judge repeated same-direction signals, not trend reports. |
- context\09-v3-3-current-action-index.md:105:- Do not produce daily observation, business brief, trend report, or opinion lane output.
- context\09-v3-3-current-action-index.md:220:- Trend candidate is not trend report.
- context\09-v3-3-current-action-index.md:286:- Do not restore V2 homepage modules, daily observation, business brief, or trend-report prose.
- context\08-v3-3-automation.md:387:- Do not restore daily observation, trend report, or business brief as required outputs.

## Recommended Actions

- Backfill or intentionally skip missing daily supervision reports: 2026-06-06, 2026-06-07, 2026-06-08, 2026-06-10, 2026-06-11
- Review Learning Loop Escalations and convert repeated incidents into gate / eval / MEMORY changes.
- Review historical / conflicting wording matches and clean only the ones that contradict current V3.3 rules.
