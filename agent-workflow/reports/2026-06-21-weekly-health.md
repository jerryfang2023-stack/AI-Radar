# WaveSight Weekly Health - 2026-06-15 to 2026-06-21

- generated_at: 2026-06-21T05:38:47.076Z
- status: review
- days: 7

## Daily Supervision Coverage

| Date | Status | Lane statuses |
|---|---|---|
| 2026-06-15 | historical_coverage | business_signals:historical_evidence_passed<br>first_line_viewpoints:historical_evidence_passed<br>community_intelligence:historical_evidence_passed |
| 2026-06-16 | historical_coverage | business_signals:historical_evidence_passed<br>first_line_viewpoints:historical_evidence_passed<br>community_intelligence:historical_evidence_passed |
| 2026-06-17 | manual_required | skill_ops:manual_required<br>community_intelligence:manual_required<br>business_signals:passed<br>first_line_viewpoints:warning<br>follow_builders_skill:passed |
| 2026-06-18 | historical_coverage | business_signals:historical_evidence_passed<br>first_line_viewpoints:historical_evidence_passed<br>community_intelligence:historical_evidence_passed |
| 2026-06-19 | historical_coverage | business_signals:historical_evidence_passed<br>first_line_viewpoints:historical_evidence_passed<br>community_intelligence:historical_evidence_passed |
| 2026-06-20 | failed | skill_ops:manual_required<br>community_intelligence:manual_required<br>business_signals:failed<br>first_line_viewpoints:passed<br>follow_builders_skill:passed |
| 2026-06-21 | warning | skill_ops:passed<br>community_intelligence:warning<br>business_signals:warning<br>first_line_viewpoints:passed<br>follow_builders_skill:passed |

## Lane Status Totals

- business_signals:historical_evidence_passed: 4
- community_intelligence:historical_evidence_passed: 4
- first_line_viewpoints:historical_evidence_passed: 4
- follow_builders_skill:passed: 3
- community_intelligence:manual_required: 2
- first_line_viewpoints:passed: 2
- skill_ops:manual_required: 2
- business_signals:failed: 1
- business_signals:passed: 1
- business_signals:warning: 1
- community_intelligence:warning: 1
- first_line_viewpoints:warning: 1
- skill_ops:passed: 1

## Recurring Problems

- skill_ops: guanlan-raw-pool-card: .skill-store sync state is drift: 2

## Recurring Warnings

- business_signals: local Obsidian sync may be blocked by <n> dirty file(s): 2

## Hermes Incident Loop

- incidents_in_window: 13
- unresolved_incidents: 0

| Date | Lane | Status | Failed Gate | Categories | File |
|---|---|---|---|---|---|
| 2026-06-15 | site_version | resolved | n/a | frontstage_detail_content<br>monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-06-15-site-v337-weekly-report-integration.md` |
| 2026-06-17 | community_intelligence | resolved | agent-workflow/reports/2026-06-17-community-intelligence-gate.md | monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-06-17-community_intelligence-community-intelligence.md` |
| 2026-06-17 | skill_ops | resolved | skill_ops daily supervision | monitor_or_gate_failure<br>obsidian_sync | `agent-workflow/inbox/hermes-to-codex/2026-06-17-skill_ops-obsidian-sync.md` |
| 2026-06-19 | business_signals | resolved | missing | business_signals_top10_missing<br>source_first_frontstage_gate<br>monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-06-19-business_signals-business-signals-top10-missing.md` |
| 2026-06-20 | business_signals | resolved | missing | business_signals_top10_missing<br>frontstage_detail_content<br>monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-06-20-business_signals-business-signals-top10-missing.md` |
| 2026-06-20 | business_signals | resolved | passed | monitor_or_gate_failure<br>obsidian_sync | `agent-workflow/inbox/hermes-to-codex/2026-06-20-business_signals-monitor-or-gate-failure.md` |
| 2026-06-20 | community_intelligence | resolved | agent-workflow/reports/2026-06-20-community-intelligence-gate.md | monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-06-20-community_intelligence-monitor-or-gate-failure.md` |
| 2026-06-20 | skill_ops | resolved | skill_ops daily supervision | monitor_or_gate_failure<br>obsidian_sync | `agent-workflow/inbox/hermes-to-codex/2026-06-20-skill_ops-monitor-or-gate-failure.md` |
| 2026-06-21 | business_signals | resolved | missing | business_signals_top10_missing<br>monitor_or_gate_failure<br>obsidian_sync | `agent-workflow/inbox/hermes-to-codex/2026-06-21-business_signals-business-signals-top10-missing.md` |
| 2026-06-21 | business_signals | resolved | passed | monitor_or_gate_failure<br>obsidian_sync | `agent-workflow/inbox/hermes-to-codex/2026-06-21-business_signals-monitor-or-gate-failure.md` |
| 2026-06-21 | community_intelligence | resolved | missing | monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-06-21-community_intelligence-monitor-or-gate-failure.md` |
| 2026-06-21 | first_line_viewpoints | resolved | missing | monitor_or_gate_failure | `agent-workflow/inbox/hermes-to-codex/2026-06-21-first_line_viewpoints-monitor-or-gate-failure.md` |
| 2026-06-21 | skill_ops | resolved | skill_ops daily supervision | monitor_or_gate_failure<br>obsidian_sync | `agent-workflow/inbox/hermes-to-codex/2026-06-21-skill_ops-obsidian-sync.md` |

## Repeated Incident Categories

- business_signals: monitor_or_gate_failure: 5
- business_signals: business_signals_top10_missing: 3
- business_signals: obsidian_sync: 3
- community_intelligence: monitor_or_gate_failure: 3
- skill_ops: monitor_or_gate_failure: 3
- skill_ops: obsidian_sync: 3

## Action Log Loop

- action_records_in_window: 5
- failed_or_partial_records: 0
- unregistered_records: 4

- none

## Repeated Action Log Issues

- none

## Learning Loop Escalations

- Daily supervision recurring problem (2x): skill_ops: guanlan-raw-pool-card: .skill-store sync state is drift. Add or tighten the owning lane gate/eval.
- Daily supervision recurring warning (2x): business_signals: local Obsidian sync may be blocked by <n> dirty file(s). Decide whether it should stay warning or become a gate.
- Hermes incident category repeated (3x): community_intelligence: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.
- Hermes incident category repeated (3x): skill_ops: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.
- Hermes incident category repeated (3x): skill_ops: obsidian_sync. Add a regression eval and durable MEMORY entry if not already present.
- Hermes incident category repeated (3x): business_signals: business_signals_top10_missing. Add a regression eval and durable MEMORY entry if not already present.
- Hermes incident category repeated (5x): business_signals: monitor_or_gate_failure. Add a regression eval and durable MEMORY entry if not already present.
- Hermes incident category repeated (3x): business_signals: obsidian_sync. Add a regression eval and durable MEMORY entry if not already present.

## GitHub Workflow Health

| Workflow | Available | Runs | Failures | In progress |
|---|---:|---:|---:|---:|
| daily-persistent-assets-pr.yml | yes | 0 | 0 | 0 |
| daily-first-line-viewpoints-pr.yml | yes | 0 | 0 | 0 |
| github-pages.yml | yes | 0 | 0 | 0 |

## Historical / Conflict Signals To Review

- suspicious_match_count: 35

- AGENTS.md:89:- daily observation;
- AGENTS.md:90:- business brief;
- AGENTS.md:91:- trend report;
- AGENTS.md:149:- Trend candidate is not trend report.
- context\00-current-state.md:63:- daily observation;
- context\00-current-state.md:64:- business brief / business internal reference;
- context\00-current-state.md:65:- trend report;
- context\01-product-map.md:94:- daily observation;
- context\01-product-map.md:95:- trend report;
- context\01-product-map.md:96:- business brief / internal reference;
- context\06-execution-harness.md:44:Does not produce articles, briefs, trend reports, frontstage copy, or recommendations.
- context\06-execution-harness.md:99:Trend candidate is not a trend report.
- context\06-execution-harness.md:116:- daily observation;
- context\06-execution-harness.md:117:- trend report;
- context\06-execution-harness.md:118:- business brief / business internal reference;
- context\07-v3-intelligence-generation-rules.md:28:V3 does not require daily observation, trend report, or business brief output.
- context\07-v3-intelligence-generation-rules.md:233:Trend candidate is not trend report.
- context\05-daily-monitoring.md:31:- daily observation;
- context\05-daily-monitoring.md:32:- business brief;
- context\05-daily-monitoring.md:33:- trend report;
- context\08-v3-3-automation.md:519:- Do not restore daily observation, trend report, or business brief as required outputs.
- context\11-hermes-daily-supervision-instructions.md:235:- Do not use `05-frontier-opinions/*` as current First-Line Viewpoints evidence.
- context\09-v3-3-current-action-index.md:46:| Trend candidate judgment | `current` | Judge repeated same-direction signals, not trend reports. |
- context\09-v3-3-current-action-index.md:111:- Do not produce daily observation, business brief, trend report, or opinion lane output.
- context\09-v3-3-current-action-index.md:242:- Trend candidate is not trend report.
- context\09-v3-3-current-action-index.md:342:- Do not restore V2 homepage modules, daily observation, business brief, or trend-report prose.
- context\context-index.md:65:- Daily observation writing, business brief, and trend report are not V3.3 required outputs.
- context\project-memory.md:29:- Do not restore daily observation, business brief, or long-form trend report as required outputs.
- context\frontstage-page-contracts.md:22:| Business Signals | `01-SiteV2/site/v3-data-observation.html` | V3.3 main business-signal desk; date selection; product / funding / case Cards; 企业AI化 secondary lens; visual relationship graph; trend candidates; source-first details | V2 homepage modules; daily observation; business brief; trend-report prose; follow-builders evidence; backend fields such as Raw / Pool / threshold / gate in frontstage copy | syntax + source-first gate + frontstage regression |
- context\version-ledger.md:40:- WaveSight AI is now a unified intelligence frontstage, not a V2 four-column content site.
- context\version-ledger.md:103:- V2 four-column pages, old homepage, old trend page, old business-brief page.
- context\version-ledger.md:104:- Daily observation, trend report, or business brief as required outputs.
- context\version-ledger.md:111:- Netlify configuration, Netlify deploy scripts, or Netlify as a fallback deployment path.
- context\version-ledger.md:145:| `V3.3.3.2-freeze-project-health-automation-20260610` | Business Signals / Intelligence Map / First-Line Viewpoints / Community Intelligence | 2026-06-10 | 2026-06-10T00:44:49+08:00 | V3.3.3.2-project-health-automation | project maintenance only living in chat checklists; weekly recurring failures without a report; monthly cleanup performed before review; deletion-first Git cleanup; Netlify or artifact residue returning unnoticed | `npm run health:daily` + `npm run health:weekly` + `npm run health:monthly` |
- context\version-ledger.md:154:| `V3.0.0-freeze-data-observation-desk-20260604` | Data Observation Desk | 2026-06-04 | 2026-06-04 | V3.0.0-data-observation-desk | V2 four-column pages, old homepage, tag-count pseudo trends, internal status language | upgraded |

## Recommended Actions

- Convert recurring production problems into monitor skill evals, gates, or recovery rules.
- Review Learning Loop Escalations and convert repeated incidents into gate / eval / MEMORY changes.
- Review historical / conflicting wording matches and clean only the ones that contradict current V3.3 rules.
