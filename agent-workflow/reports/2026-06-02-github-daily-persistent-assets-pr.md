# GitHub Daily Persistent Assets PR

- date: 2026-06-02
- generated_at: 2026-06-02T11:42:49+08:00
- mode: persistent_assets_pr
- trigger: workflow_dispatch
- schedule: 08:30 Asia/Shanghai daily
- anysearch_secret: configured
- tavily_secret: configured
- exa_secret: configured
- openai_or_deepseek_required: false

This workflow commits Raw / Pool / Card assets to an automation branch and opens or updates a PR.
Raw / Pool are persisted after monitor gates pass. Card assets are persisted after asset generation. Site data is persisted only after frontstage gates pass.
It never pushes directly to main, never merges PRs, and never deploys.

Production order:
1. Run Daily Monitor with QC.
2. Confirm final active Raw / Pool post-dedupe counts and historical duplicate count.
3. Regenerate Card / Opinion assets in the runner workspace.
4. Run cardcopy gate.
5. Run Pool-to-Card duplicate gate.
6. Write a persistent asset manifest.
7. Sync local site data in the runner workspace only if card gates pass.
8. Confirm same-date downstream assets are no longer stale.
9. Commit generated assets to an automation branch and open or update a PR.

Skipped by design:
- Trend candidate / no-decision shell.
- Daily Observation Write / QC.
- Direct main commit.
- Auto-merge.
- Deploy.
