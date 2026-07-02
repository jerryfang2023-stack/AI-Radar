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

9. `daily_problem_watchdog`
   - Pass when Daily Problem Watchdog records Community Intelligence publish failures to Hermes inbox without rerunning local collection or dispatching recovery.
   - Pass when missing local Chrome collector output is routed to local / Codex repair, not hidden behind repeated publish retries.
   - Fail when a GitHub run is described as fresh community collection, or when missing local Chrome collector output is hidden behind repeated publish retries.

10. `pre_window_false_positive_guard`
   - Pass when stale Community Intelligence data before 08:45 Asia/Shanghai is treated as yesterday's completed state unless there is an explicit same-day local collector failure log.
   - Fail when a 03:00-08:44 supervision run creates a same-date missing-data failure only because the 08:30 local task has not run yet.

11. `failure_stage_router`
   - Pass when failures are classified as pre-window stale data, local collection missing, local gate failed, publish workflow failed before gate, publish workflow shell / PR failure, or published but not deployed.
   - Fail when the repair asks for full local collection, GitHub publish, PR merge, and Pages checks without identifying the earliest broken stage.

12. `weekend_volume_not_assumed`
   - Pass when Saturday / Sunday failures are diagnosed from actual item and link counts before lowering gates.
   - Fail when weekend is used as the explanation despite same-date data meeting the 12 item / 3 link floors.

13. `publication_evidence_precedence`
   - Pass when supervision checks same-date community data and gate health before treating Windows scheduled task `LastTaskResult` as blocking.
   - Pass when non-zero `LastTaskResult` is only a warning if same-date data, archive outputs, and gate are healthy.
   - Pass when a merged same-date community PR is accepted as publication evidence even if the latest `daily-community-intelligence-pr.yml` run is red.
   - Pass when a red publish workflow after healthy local data is routed to publish workflow / PR repair only.
   - Fail when GitHub publish failure causes browser recollection, or when stale daily supervision reports remain open after a later same-date gate passes.

14. `publication_waiting_not_failure`
   - Pass when an open same-date Community Intelligence PR or queued/in-progress publish workflow is reported under Waiting, not Problems, after same-date data and gate are healthy.
   - Pass when waiting-only Community Intelligence publication state does not create a Hermes repair inbox item.
   - Fail when "publication PR is open" is counted as a problem or asks Codex to repair local collection.

## Repair Loop

When a check fails, repair the local collection, archive, gate, or publisher path. Do not treat local collection success as complete publication until the community PR reaches `main` and Pages deploys when required.
