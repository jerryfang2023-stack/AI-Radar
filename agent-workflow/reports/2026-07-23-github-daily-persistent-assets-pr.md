# GitHub Business Signals PR

- date: 2026-07-23
- generated_at: 2026-07-23T11:43:20+08:00
- mode: business_signals_pr
- trigger: workflow_dispatch
- schedule: local 08:10 conditional dispatch; 09:15 targeted recovery; 10:30 cloud safety fallback
- business_signal_skip: false
- business_signal_skip_reason: not_applicable
- existing_automation_branch: false
- existing_signal_card_count: 0
- anysearch_secret: configured
- tavily_secret: disabled
- exa_secret: configured
- deepseek_v4_title_translation: configured

This V4 workflow commits the Data Center factual bundle plus frozen V3 page-compatibility assets to an automation branch, opens or updates a PR, and auto-merges only after factual-integrity and compatibility gates pass.
Raw / Pool are persisted after V3 monitor hard gates pass. Card assets are persisted after asset generation. Site data is persisted only after Card/source-first/frontstage gates pass.
Business Signals monitor now defaults to source artifact aggregation: AI HOT, keyword, GDELT, and RSS are collected as independent source artifacts before the unified Raw / Pool chain runs.
First-line viewpoints are produced by .github/workflows/daily-first-line-viewpoints-pr.yml and are not part of this business-signal PR.
It never pushes directly to main. GitHub Pages deploys automatically after the PR merge updates main.

Production order:
1. Collect source Raw artifacts independently and in parallel.
2. Run the V3 evidence-supply gate from source artifacts.
3. Confirm Raw / Pool integrity and historical duplicate state without re-blocking diagnostic volume targets.
4. Build and gate the Data Center V4 factual bundle.
5. Materialize V4 JSONL serving tables.
6. Run frozen V3 Card, trend, and frontstage compatibility stages.
7. Build operations data after V4 and compatibility gates pass.
8. Confirm same-date downstream assets are no longer stale.
9. Write a persistent asset manifest.
10. Commit generated assets to an automation branch and open or update a PR.
11. Auto-merge the PR after all gates pass, so main triggers GitHub Pages deployment.

Skipped by design:
- paused opinion lane.
- Direct main commit.
- Direct deploy from the automation branch.
