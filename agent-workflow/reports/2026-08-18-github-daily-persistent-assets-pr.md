# GitHub Business Signals PR

- date: 2026-08-18
- generated_at: 2026-08-18T08:12:03+08:00
- mode: business_signals_pr
- trigger: workflow_dispatch
- schedule: local 08:10 conditional dispatch; 09:15 targeted recovery; 10:30 cloud safety fallback
- business_signal_skip: false
- business_signal_skip_reason: not_applicable
- existing_automation_branch: false
- anysearch_secret: configured
- tavily_secret: disabled
- exa_secret: configured
- deepseek_v4_title_translation: configured

This V4 workflow stores complete originals only in the private evidence repository and commits body-free locators, the factual bundle, application projections, and operations data to an automation branch.
The source collector writes SourceArtifact / RawDocument intake directly; legacy compatibility writers are disabled.
AI HOT, keyword, GDELT, and RSS are collected as independent source artifacts before V4 normalization.
First-line viewpoints are produced by .github/workflows/daily-first-line-viewpoints-pr.yml and are not part of this business-signal PR.
It never pushes directly to main. GitHub Pages deploys automatically after the PR merge updates main.

Production order:
1. Collect source Raw artifacts independently and in parallel.
2. Build and gate structured SourceArtifact / RawDocument intake.
3. Confirm source integrity and historical duplicate state.
4. Build and gate the Data Center V4 factual bundle.
5. Materialize V4 JSONL serving tables.
6. Build Opportunity Map, Trend Radar, and Funding Insights projections.
7. Build operations data after V4 materialization.
8. Confirm same-date downstream assets are no longer stale.
9. Write a persistent asset manifest.
10. Commit generated assets to an automation branch and open or update a PR.
11. Auto-merge the PR after all gates pass, so main triggers GitHub Pages deployment.

Skipped by design:
- paused opinion lane.
- Direct main commit.
- Direct deploy from the automation branch.
