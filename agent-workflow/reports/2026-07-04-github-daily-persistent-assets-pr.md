# GitHub Business Signals PR

- date: 2026-07-04
- generated_at: 2026-07-04T12:25:18+08:00
- mode: business_signals_pr
- trigger: schedule
- schedule: 08:57 Asia/Shanghai primary; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox
- business_signal_skip: false
- business_signal_skip_reason: not_applicable
- existing_automation_branch: false
- existing_signal_card_count: 3
- anysearch_secret: configured
- tavily_secret: disabled
- exa_secret: configured
- openai_or_deepseek_required: false

This V3.3 workflow commits Raw / Pool / business-signal Card assets, business-signal frontstage data, intelligence map data, and operations dashboard data to an automation branch, opens or updates a PR, and auto-merges the PR after all gates pass.
Raw / Pool are persisted after monitor gates pass. Card assets are persisted after asset generation. Site data is persisted only after frontstage gates pass.
Business Signals monitor now defaults to source artifact aggregation: AI HOT, keyword, GDELT, and RSS are collected as independent source artifacts before the unified Raw / Pool chain runs.
First-line viewpoints are produced by .github/workflows/daily-first-line-viewpoints-pr.yml and are not part of this business-signal PR.
It never pushes directly to main. GitHub Pages deploys automatically after the PR merge updates main.

Production order:
1. Collect source Raw artifacts independently and in parallel.
2. Run Daily Monitor with QC from source artifacts.
3. Confirm final active Raw / Pool post-dedupe counts and historical duplicate count.
4. Regenerate business-signal Card assets in the runner workspace.
5. Run Pool-to-Card duplicate gate.
6. Build Business Signals frontstage data and immediately run the unified Business frontstage gate.
7. Build operations dashboard data only after the Business frontstage gate passes.
8. Confirm same-date downstream assets are no longer stale.
9. Write a persistent asset manifest.
10. Commit generated assets to an automation branch and open or update a PR.
11. Auto-merge the PR after all gates pass, so main triggers GitHub Pages deployment.

Skipped by design:
- Trend candidate / no-decision shell.
- paused opinion lane.
- Direct main commit.
- Direct deploy from the automation branch.
