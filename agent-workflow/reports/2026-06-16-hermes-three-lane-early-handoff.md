# Hermes Three-Lane Early Handoff - 2026-06-16

- generated_at: 2026-06-16T03:24:13.833Z
- ok: true
- dry_run: false
- schedule: 09:30 / 09:45 / 09:55 Asia/Shanghai
- handoff_stage: 09:30
- lanes: business_signals, first_line_viewpoints, community_intelligence

## Business Signals
- ok: true
- action: skipped
- reason: same-date successful workflow already exists: https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/27591153356
- workflow: daily-persistent-assets-pr.yml
- primary_window: 08:57 primary production / 09:27 conditional health dispatch
- primary_end: 09:45
- handoff_stage: 09:30
- takeover_after: 09:45
- dispatch_allowed: false
- active_run: none
- successful_run: https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/27591153356
- same_date_failures: 4
- assets: `{"ready":true,"activeDate":"2026-06-16","top10":10,"badTitleCount":0}`
- good_example: A formal Signal Card keeps a source-backed original event, an accurate title, and a first-party or reporting URL.
- bad_example: A LinkedIn repost, GitHub repo tree, or generic funding list is promoted as a Top10 business fact.
- inbox: none
## First-Line Viewpoints
- ok: true
- action: skipped
- reason: same-date successful workflow already exists: https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/27587942495
- workflow: daily-first-line-viewpoints-pr.yml
- primary_window: 08:30 local Codex RSS collection + sync / 09:17 GitHub fallback
- primary_end: 09:30
- handoff_stage: 09:30
- takeover_after: 09:30
- dispatch_allowed: true
- active_run: none
- successful_run: https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/27587942495
- same_date_failures: 0
- assets: `{"ready":true,"dataDate":"2026-06-16","builders":16,"items":0,"timelineFiles":1}`
- good_example: Builder viewpoints publish same-date Chinese data and sync person/date Obsidian timeline files.
- bad_example: A builders run finishes but leaves no same-date timeline file or leaves untranslated English as primary display text.
- inbox: none
## Community Intelligence
- ok: true
- action: skipped
- reason: same-date publication PR is already merged: https://github.com/jerryfang2023-stack/AI-Radar/pull/84
- workflow: daily-community-intelligence-pr.yml
- primary_window: 08:30 local collection / 08:45 GitHub publish; 10:45 publish fallback
- primary_end: 09:30
- handoff_stage: 09:30
- takeover_after: 09:30
- dispatch_allowed: true
- active_run: none
- successful_run: https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/27591840052
- same_date_failures: 0
- assets: `{"ready":true,"localCollectionReady":true,"dataDate":"2026-06-16","items":61,"links":69,"errors":0,"dailySnapshot":"present","archive":"present"}`
- limitation: GitHub can verify and publish community files, but cannot run the logged-in local Chrome collector.
- good_example: Local Chrome collection writes same-date items/links/errors=0, archive files exist, then GitHub publishes them.
- bad_example: GitHub publish runs without same-date local collector output and cannot create fresh community data by itself.
- inbox: none
## Operating Notes

- Scheduled GitHub / local lane monitors run first. Hermes takes over only after primary monitoring fails, healthy same-date output is missing after the lane's takeover window, and no same-date run is active.
- 09:30 can dispatch Community Intelligence publish and First-Line Viewpoints RSS; Business Signals waits.
- 09:45 can dispatch Business Signals and only rechecks Community / First-Line state.
- 09:55 is final review only: wait for active runs, record dispatch failures, or mark manual_required. It must not start a new routine dispatch.
- Hermes starts the relevant workflow or publish path; lane workflows push automation branches / PRs and Pages deploys after main updates. Hermes does not push directly to main.
- Community Intelligence still depends on the local logged-in Chrome collector; GitHub can only publish validated local output.
- Repeated failures must become Codex repair items with a report path and a prevention artifact.

