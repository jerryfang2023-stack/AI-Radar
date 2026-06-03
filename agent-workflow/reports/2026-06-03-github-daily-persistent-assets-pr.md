# GitHub Daily Persistent Assets PR

- date: 2026-06-03
- generated_at: 2026-06-03T11:17:02+08:00
- mode: persistent_assets_pr
- trigger: workflow_dispatch
- schedule: 09:17 Asia/Shanghai daily
- skip_existing_assets: false
- skip_reason: not_applicable
- anysearch_secret: configured
- tavily_secret: configured
- exa_secret: configured
- openai_or_deepseek_required: false

This workflow commits Raw / Pool / Card assets to an automation branch, opens or updates a PR, and auto-merges the PR after all gates pass.
Raw / Pool are persisted after monitor gates pass. Card assets are persisted after asset generation. Site data is persisted only after frontstage gates pass.
It never pushes directly to main. GitHub Pages deploys automatically after the PR merge updates main.

Production order:
1. Run Daily Monitor with QC.
2. Confirm final active Raw / Pool post-dedupe counts and historical duplicate count.
3. Regenerate Card / Opinion assets in the runner workspace.
4. Run Pool-to-Card duplicate gate.
5. Write a persistent asset manifest.
6. Sync local site data in the runner workspace.
7. Confirm same-date downstream assets are no longer stale.
8. Commit generated assets to an automation branch and open or update a PR.
9. Auto-merge the PR after all gates pass, so main triggers GitHub Pages deployment.

Skipped by design:
- Trend candidate / no-decision shell.
- Daily Observation Write / QC.
- Direct main commit.
- Direct deploy from the automation branch.
