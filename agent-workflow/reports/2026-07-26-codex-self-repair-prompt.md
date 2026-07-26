# WaveSight Codex Self Repair Request - 2026-07-26

You are Codex working in the WaveSight repo.

Goal: repair the unresolved daily monitoring problem(s) from the non-Hermes self-check, using the smallest safe code/rule/gate change and the smallest relevant validation.

Required routing:

1. Read `AGENTS.md` first.
2. Read the current task context in `context/08-v3-3-automation.md` and the linked report files.
3. Read `agent-workflow/reports/2026-07-26-daily-self-check.md` and `agent-workflow/reports/2026-07-26-daily-supervision-report.md`.
4. Do not use the legacy Hermes inbox as the repair queue for this run.
5. Work only on the task(s) below unless a directly required dependency blocks them.

Hard boundaries:

- Do not lower evidence gates or promote weak Business Signal evidence.
- Do not use First-Line Viewpoints or Community Intelligence as Business Signal facts.
- Do not blindly rerun the full Business Signals chain.
- Do not deploy directly from an automation branch.
- Do not force pull, reset, stash, or overwrite local uncommitted work.
- If a same-date workflow is queued or in progress, classify it as waiting instead of missing data.
- If code changes are made, run the exact failed gate or the smallest relevant validation.

Branch / PR path:

- If edits are needed and the worktree is clean, create or reuse `automation/codex-self-repair-2026-07-26`.
- Stage only files required for the repair and prevention artifact.
- Commit after validation passes.
- Push the branch and open or update a PR when `gh` credentials permit it.
- If branch, push, or PR creation is blocked, leave the validated local diff and report the exact blocker.

Repair task(s):

## Task 1: business_signals
- severity: failed
- report_path: agent-workflow/reports/2026-07-26-daily-supervision-report.md

- failed_gate: agent-workflow/reports/2026-07-26-daily-production-chain-readiness.md
Read AGENTS.md and current context rules. Read agent-workflow/reports/2026-07-26-daily-supervision-report.md. Inspect failed gate/report: agent-workflow/reports/2026-07-26-daily-production-chain-readiness.md. Resolve these issue(s): business-signal activeDate is 2026-07-25, expected 2026-07-26 | public Card count is 0 for 2026-07-26 | no same-date signal Card files or frontstage Core Signal Cards | Business Signals workflow conclusion is failure. Classify the earliest responsible stage. Repair the smallest script, gate, rule, eval, or generated-report path. Rerun the exact failed gate or smallest validation. Do not lower evidence gates, do not use builders/community material as Business Signal facts, and do not blindly rerun the full Business Signals chain.

Finish with changed files, validation performed, and remaining risk. Leave generated report artifacts out of the final diff unless they are required prevention artifacts.

Prompt file: agent-workflow/reports/2026-07-26-codex-self-repair-prompt.md
Self-check status: repair_required