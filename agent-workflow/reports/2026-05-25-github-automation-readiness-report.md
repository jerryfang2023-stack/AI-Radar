# 2026-05-25 GitHub Automation Readiness Report

- generated_at: 2026-05-25T07:40:51.017Z
- status: partial_ready_daily_observation_blocked
- recommendation: keep GitHub Actions on manual `workflow_dispatch` first; confirm stability before enabling `schedule`
- full_scheduled_workflow: not_created
- daily_monitor_dry_run_schedule: removed
- daily_monitor_dry_run_trigger: workflow_dispatch_only
- push_status: not_pushed_by_this_report
- commit_push_pr_deploy_behavior: forbidden_for_current_workflow

## Current Small PR Files

- `.github/workflows/daily-monitor-dry-run.yml`
- `agent-workflow/reports/2026-05-25-github-automation-readiness-report.md`
- `agent-workflow/tools/assert-daily-production-chain.mjs`
- `agent-workflow/tools/assert-pool-to-card-dedupe.mjs`
- `agent-workflow/tools/generate-asset-cards-from-pool.mjs`
- `agent-workflow/tools/run-daily-observation-chain.mjs`
- `agent-workflow/tools/run-quality-gates.mjs`
- `agent-workflow/tools/run-trend-candidate-decision.mjs`
- `agent-workflow/tools/write-automation-readiness-report.mjs`

## Existing Workflow Status

- `.github/workflows/daily-monitor-dry-run.yml` is dry-run only.
- It uploads artifacts only.
- It must not commit, push, open PRs, or deploy.
- `schedule` has been removed for now; only `workflow_dispatch` remains.
- Reason for removing `schedule`: the full daily production chain is not yet proven stable in GitHub Actions, and Daily Observation remains blocked for cloud execution until `OPENAI_API_KEY` and cloud-available skills are settled.

## Step Readiness

| Step | Status | Script |
|---|---|---|
| Run Daily Monitor with QC | ready | `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs` |
| Raw / Pool post-dedupe active count gate | ready | `agent-workflow/tools/assert-daily-production-chain.mjs` |
| Historical duplicate blocker | ready | `agent-workflow/tools/assert-daily-production-chain.mjs` |
| Raw / Pool changed stale marker | ready | `agent-workflow/tools/assert-daily-production-chain.mjs` |
| Regenerate Card / Opinion | ready | `agent-workflow/tools/generate-asset-cards-from-pool.mjs` |
| Pool-to-Card duplicate gate | ready | `agent-workflow/tools/assert-pool-to-card-dedupe.mjs` |
| Cardcopy gate | ready | `agent-workflow/tools/run-quality-gates.mjs` |
| Trend candidate / no-decision CLI | ready | `agent-workflow/tools/run-trend-candidate-decision.mjs` |
| Daily Observation Write / QC CLI | blocked_without_openai_key | `agent-workflow/tools/run-daily-observation-chain.mjs` |
| Sync site data after gates | ready | `01-SiteV2/site/scripts/sync-v2-site-data.mjs` |

## Gates Added

- Raw / Pool active count gate: `agent-workflow/tools/assert-daily-production-chain.mjs` reports `final_active_raw_count` and `final_active_pool_count` from final files, not pre-dedupe counters.
- Historical duplicate blocker: `agent-workflow/tools/assert-daily-production-chain.mjs` fails if historical duplicates remain active in Raw / Pool.
- Stale marker: `agent-workflow/tools/assert-daily-production-chain.mjs` writes `downstream_assets_stale=true` report and blocks later stages when Raw / Pool are newer than downstream assets.
- Pool-to-Card duplicate gate: `agent-workflow/tools/assert-pool-to-card-dedupe.mjs` blocks duplicate signal cards by raw ref, pool ref, source URL, full-text hash, and fact fingerprint.
- Trend candidate CLI: `agent-workflow/tools/run-trend-candidate-decision.mjs` validates repo-local `skills/guanlan-trend-candidate-writer/SKILL.md` usage and allows only trend candidates or `no_trend_candidate_decision`.
- Daily Observation Write / QC CLI: `agent-workflow/tools/run-daily-observation-chain.mjs` exists, requires `OPENAI_API_KEY`, and writes a blocked report rather than pretending completion when the key or skills are unavailable.

## Cloud Skill Availability

- Trend candidate skill is repo-local: `skills/guanlan-trend-candidate-writer/SKILL.md`.
- Daily Observation pitch / writer / QC skills are local user skills today, not guaranteed on GitHub runners.
- Before Daily Observation can run fully in GitHub Actions, either vendor those skills into repo `skills/` or provide an approved cloud skill-loading mechanism.

Current local Daily Observation skill paths:

- `C:/Users/86186/.skill-store/guanlan-daily-observation-pitch/SKILL.md`
- `C:/Users/86186/.skill-store/guanlan-daily-observation/SKILL.md`
- `C:/Users/86186/.skill-store/guanlan-daily-observation-qc/SKILL.md`

## Still Missing / Blocked

- Daily Observation cloud run remains blocked until `OPENAI_API_KEY` is configured and Daily Observation skills are available to the runner.
- A full scheduled GitHub Actions production workflow has not been created yet.
- Direct commit / push / PR / deploy from the current dry-run workflow remains forbidden.

## Required GitHub Secrets

- `ANYSEARCH_API_KEY`: required for search discovery
- `TAVILY_API_KEY`: required for search fallback
- `EXA_API_KEY`: required for search fallback
- `OPENAI_API_KEY`: required_for_daily_observation

## Can Enter Next GitHub Actions Stage?

- Yes, but only as a manual `workflow_dispatch` dry-run workflow.
- No, do not enable scheduled full automation yet.
- No, do not enable direct commit-to-main workflow.

## Recommended Workflow Mode

- First: full-chain dry-run workflow with `workflow_dispatch` only and artifacts only.
- After several stable manual runs: enable `schedule`.
- Later: PR workflow after dry-run proves all gates.
- Not recommended yet: direct commit to `main`.
