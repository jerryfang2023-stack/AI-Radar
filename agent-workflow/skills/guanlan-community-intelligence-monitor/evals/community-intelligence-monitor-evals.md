# Community Intelligence Monitor Evals

Run these pass/fail checks when supervising, repairing, or updating the Community Intelligence lane.

## Required Checks

1. `lane_owner_loaded`
   - Pass when Community Intelligence work routes through this skill before local collector or publisher scripts.

2. `local_collection_boundary`
   - Pass when logged-in collection is treated as a local task and not expected to run in GitHub Actions.

3. `community_gate`
   - Pass when `npm run assert:community-intelligence -- --date=<YYYY-MM-DD>` passes before publication.

4. `archive_outputs`
   - Pass when daily snapshots, Obsidian archive files, and gate reports exist for the production date.

5. `publication_complete`
   - Pass when validated community data reaches automation branch -> PR -> `main` -> GitHub Pages when publication is required.

6. `lead_not_fact`
   - Pass when community posts remain leads and are not used as Business Signal facts unless separately verified through Raw / Pool.

7. `lane_isolation`
   - Pass when the Community Intelligence PR stages no Business Signals or First-Line Viewpoints data.

8. `hermes_repair_closure`
   - Pass when any related Hermes inbox item is closed only after validation and a prevention artifact is recorded.

9. `three_lane_early_handoff`
   - Pass when Hermes three-lane early handoff checks Community Intelligence publication at 09:30 Asia/Shanghai, rechecks at 09:45 / 09:55 when needed, dispatches the GitHub publish workflow if same-date local output exists but publication is missing, and records that GitHub cannot run the logged-in Chrome collector.
   - Fail when a GitHub run is described as fresh community collection, or when missing local Chrome collector output is hidden behind repeated publish retries.

## Repair Loop

When a check fails, repair the local collection, archive, gate, or publisher path. Do not treat local collection success as complete publication until the community PR reaches `main` and Pages deploys when required.
