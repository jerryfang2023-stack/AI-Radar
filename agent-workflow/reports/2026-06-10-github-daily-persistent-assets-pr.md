# GitHub Business Signals PR

- date: 2026-06-10
- generated_at: 2026-06-10T12:01:52+08:00
- mode: business_signals_pr
- trigger: workflow_dispatch
- schedule: 09:07 Asia/Shanghai daily
- business_signal_skip: false
- business_signal_skip_reason: not_applicable
- existing_automation_branch: false
- anysearch_secret: configured
- tavily_secret: configured
- exa_secret: configured
- openai_or_deepseek_required: false

This V3.3 workflow commits Raw / Pool / business-signal Card assets, business-signal frontstage data, intelligence map data, topic-center data, and operations dashboard data to an automation branch, opens or updates a PR, and auto-merges the PR after all gates pass.
Raw / Pool are persisted after monitor gates pass. Card assets are persisted after asset generation. Site data is persisted only after frontstage gates pass.
First-line viewpoints are produced by .github/workflows/daily-first-line-viewpoints-pr.yml and are not part of this business-signal PR.
It never pushes directly to main. GitHub Pages deploys automatically after the PR merge updates main.

Production order:
1. Run Daily Monitor with QC.
2. Confirm final active Raw / Pool post-dedupe counts and historical duplicate count.
3. Regenerate business-signal Card assets in the runner workspace.
4. Run Pool-to-Card duplicate gate.
5. Write a persistent asset manifest.
6. Sync V3.3 business-signal site data when business-signal gates pass.
7. Confirm same-date downstream assets are no longer stale.
8. Commit generated assets to an automation branch and open or update a PR.
9. Auto-merge the PR after all gates pass, so main triggers GitHub Pages deployment.

Skipped by design:
- Trend candidate / no-decision shell.
- paused opinion lane.
- Direct main commit.
- Direct deploy from the automation branch.
