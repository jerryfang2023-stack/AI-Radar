---
task_id: WSD-20260507-11-v2-preflight-governance-autopilot
report_type: baseline-decision-package
date: 2026-05-07
status: draft-for-user-confirmation
owner: workflow / dev / qa
encoding: UTF-8
automation_impact: none
---

# V2 Baseline Decision Package

## 0. Conclusion

The V1 baseline is still blocked by user confirmation. The working tree is not clean and contains accepted V2 planning, governance updates, V2 isolation skeleton files, production content candidates, generated site data, test-only pipeline files, abandoned / stopped page work, external local radar assets, and many report files.

Recommended baseline sequence remains:

1. Commit accepted V2 planning, governance, and V2 isolation skeleton files first.
2. Keep 2026-05-05 / 2026-05-06 production content and generated site data pending Data / Workflow confirmation.
3. Keep P0-12 test-only monitoring pipeline outside the trusted V1 baseline unless the user explicitly wants it archived as V2 planning history.

This task did not run `git add`, `git commit`, tag, branch, or worktree commands.

## 1. Git Status Summary

Observed command:

```powershell
git status --short --branch
```

Summary:

- Branch: `main...origin/main`.
- No ahead / behind marker shown.
- Working tree: not clean.
- Modified files include site implementation, generated site data, workflow governance, progress, feature list, handoff, and latest quality reports.
- Untracked files include V2 planning / execution / closeout files, V2 content skeleton, V2 schemas / rules / migration / quality gates, 2026-05-05 and 2026-05-06 content, P0-12 test-only pipeline, external `09-ai-news-radar/`, and a large quantity of historical quality reports.

## 2. Recommended Include List: Batch 1

Batch 1 should be the trusted V2 planning and governance baseline. These files document accepted or preflight V2 architecture and do not change production scripts or site runtime by themselves.

Recommended include:

```text
docs/agent-handoff.md
agent-workflow/execution/dispatch-board.md
agent-workflow/progress.md
agent-workflow/feature_list.json
agent-workflow/governance/window-dispatch-hub.md
agent-workflow/governance/agent-memory.md
agent-workflow/governance/README.md
agent-workflow/governance/long-term-agent-dispatch-policy.md
agent-workflow/governance/plan-first-policy.md
agent-workflow/governance/quality-gates.md
agent-workflow/governance/automation-fallback-policy.md
agent-workflow/agents/agent-registry.json
agent-workflow/agents/ui-ue-agent.md
agent-workflow/execution/TASK-window-dispatch-template.md
agent-workflow/reports/TASK-window-closeout-template.md
agent-workflow/v2/
06-content/v2/
agent-workflow/execution/WSD-20260507-01-v2-transition-planning.md
agent-workflow/execution/WSD-20260507-02-v2-agent-system-design.md
agent-workflow/execution/WSD-20260507-03-v2-algorithm-source-architecture.md
agent-workflow/execution/WSD-20260507-04-v2-vi-design-direction.md
agent-workflow/execution/WSD-20260507-05-v2-product-architecture-prd.md
agent-workflow/execution/WSD-20260507-06-v2-dev-workspace-baseline.md
agent-workflow/execution/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan.md
agent-workflow/execution/WSD-20260507-08-v1-accepted-baseline-tag-branch.md
agent-workflow/execution/WSD-20260507-09-v2-directory-content-architecture.md
agent-workflow/execution/WSD-20260507-10-v2-directory-migration-autopilot.md
agent-workflow/execution/WSD-20260507-11-v2-preflight-governance-autopilot.md
agent-workflow/reports/WSD-20260507-01-v2-transition-planning-closeout.md
agent-workflow/reports/WSD-20260507-02-v2-agent-system-design-closeout.md
agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-closeout.md
agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-stage1-plan.md
agent-workflow/reports/WSD-20260507-04-v2-vi-design-direction-closeout.md
agent-workflow/reports/WSD-20260507-05-v2-product-architecture-prd-closeout.md
agent-workflow/reports/WSD-20260507-06-v2-dev-workspace-baseline-closeout.md
agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md
agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md
agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md
agent-workflow/reports/WSD-20260507-10-stage-6A-summary.md
agent-workflow/reports/WSD-20260507-10-stage-6B-summary.md
agent-workflow/reports/WSD-20260507-10-stage-6C-summary.md
agent-workflow/reports/WSD-20260507-10-stage-6D-summary.md
agent-workflow/reports/WSD-20260507-10-stage-6E-summary.md
agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md
agent-workflow/reports/WSD-20260507-11-v2-baseline-decision-package.md
agent-workflow/reports/WSD-20260507-11-v2-schema-quality-review.md
agent-workflow/reports/WSD-20260507-11-v2-preflight-governance-autopilot-closeout.md
```

Recommended latest syntax reports to include with Batch 1:

```text
agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-100843.md
agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-101131.md
agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-101733.md
```

## 3. Pending Include List: Batch 2

Batch 2 should only be included if Data / Workflow confirms these are accepted production history for 2026-05-05 and 2026-05-06.

Pending:

```text
01-Signals/2026-05-05-AI商业雷达.md
01-Signals/2026-05-06-AI商业雷达.md
02-Scoring/2026-05-05-AI机会评分.md
02-Scoring/2026-05-06-AI机会评分.md
03-Trends/AI趋势总表.md
05-point/2026-05-05-The-Point.md
05-point/2026-05-06-The-Point.md
05-point/sources/2026-05-05/
05-point/sources/2026-05-06/
07-Opportunities/企业客户体验Agent平台.md
04-Site/data/radar-data.json
04-Site/data/radar-data.js
agent-workflow/reports/relation-check-2026-05-05.md
agent-workflow/reports/relation-check-2026-05-06.md
agent-workflow/reports/tag-quality-check-2026-05-05.md
agent-workflow/reports/tag-quality-check-2026-05-06.md
agent-workflow/reports/the-point-quality-check-2026-05-05.md
agent-workflow/reports/the-point-quality-check-2026-05-06.md
agent-workflow/reports/unified-site-sync-2026-05-05.md
agent-workflow/reports/unified-site-sync-2026-05-06.md
agent-workflow/reports/daily-radar-run-2026-05-05.md
agent-workflow/reports/daily-radar-run-2026-05-06.md
agent-workflow/reports/the-point-run-2026-05-05.md
agent-workflow/reports/the-point-run-2026-05-06.md
```

Risk if included too early:

- This locks current content and generated site data into the baseline without a separate Data / Workflow acceptance pass.
- It may blur the boundary between V1 frozen content and V2 preflight planning.

## 4. Pending Include List: Batch 3

Batch 3 is optional and should be described as test-only archive, not trusted production baseline.

Pending:

```text
06-content/
04-Site/signal-lab.html
04-Site/data/signal-lab-data.json
04-Site/data/signal-lab-data.js
04-Site/scripts/sync-signal-lab.mjs
agent-workflow/product/daily-monitoring-algorithm-v2.md
agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-test-pipeline.md
agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-manual-runbook.md
agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md
agent-workflow/reports/daily-monitoring-v2-test-pipeline-2026-05-05.md
agent-workflow/reports/daily-monitoring-v2-run-2026-05-06.md
提示词/日常监测算法V2测试.md
提示词/Signal精选与机会深挖V2.md
```

Risk if included too early:

- P0-12 is accepted as `test-only`, not production.
- Its old `06-content/` structure should not be confused with the formal `06-content/v2/` content library.

## 5. Must Exclude From Trusted Baseline

Exclude unless the user gives a separate archival decision:

```text
09-ai-news-radar/
04-Site/assets/home-ai-trends-business-future.png
agent-workflow/reports/homepage-desk-style-options.html
agent-workflow/execution/WSD-20260504-26-homepage-desk-visual-asset-window-prompt.md
agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md
agent-workflow/execution/WSD-20260505-03-non-home-column-detail-reading-implementation.md
agent-workflow/execution/WSD-20260505-03-non-home-column-detail-reading-implementation-window-prompt.md
agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md
agent-workflow/reports/page-audit-20260505/
agent-workflow/reports/page-audit-20260505-v2/
agent-workflow/reports/page-audit-20260505-v3/
agent-workflow/reports/page-audit-20260505-v3-mobile/
```

Reason:

- `P0-11` is abandoned / not accepted / superseded by V2.
- `P1-4B` was stopped / not accepted.
- `09-ai-news-radar/` is an external local radar candidate and needs explicit user confirmation.
- Large screenshot / audit directories should not enter trusted baseline by default.

## 6. Site Implementation Files: Hold

Hold these out of Batch 1:

```text
04-Site/css/styles.css
04-Site/index.html
04-Site/js/app.js
```

Reason:

- They overlap historical page work and generated state.
- V2 front-end implementation should wait for a clean baseline, branch / worktree, and V2 UI/UE page task.

## 7. Non-Interactive Git Command Draft

Do not run these until the user confirms the exact include scope.

Suggested Batch 1 commit:

```powershell
git status --short --branch
git add -- docs/agent-handoff.md agent-workflow/execution/dispatch-board.md agent-workflow/progress.md agent-workflow/feature_list.json agent-workflow/governance agent-workflow/agents/agent-registry.json agent-workflow/agents/ui-ue-agent.md agent-workflow/execution/TASK-window-dispatch-template.md agent-workflow/reports/TASK-window-closeout-template.md agent-workflow/v2 06-content/v2 agent-workflow/execution/WSD-20260507-01-v2-transition-planning.md agent-workflow/execution/WSD-20260507-02-v2-agent-system-design.md agent-workflow/execution/WSD-20260507-03-v2-algorithm-source-architecture.md agent-workflow/execution/WSD-20260507-04-v2-vi-design-direction.md agent-workflow/execution/WSD-20260507-05-v2-product-architecture-prd.md agent-workflow/execution/WSD-20260507-06-v2-dev-workspace-baseline.md agent-workflow/execution/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan.md agent-workflow/execution/WSD-20260507-08-v1-accepted-baseline-tag-branch.md agent-workflow/execution/WSD-20260507-09-v2-directory-content-architecture.md agent-workflow/execution/WSD-20260507-10-v2-directory-migration-autopilot.md agent-workflow/execution/WSD-20260507-11-v2-preflight-governance-autopilot.md agent-workflow/reports/WSD-20260507-01-v2-transition-planning-closeout.md agent-workflow/reports/WSD-20260507-02-v2-agent-system-design-closeout.md agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-closeout.md agent-workflow/reports/WSD-20260507-03-v2-algorithm-source-architecture-stage1-plan.md agent-workflow/reports/WSD-20260507-04-v2-vi-design-direction-closeout.md agent-workflow/reports/WSD-20260507-05-v2-product-architecture-prd-closeout.md agent-workflow/reports/WSD-20260507-06-v2-dev-workspace-baseline-closeout.md agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md agent-workflow/reports/WSD-20260507-10-stage-6A-summary.md agent-workflow/reports/WSD-20260507-10-stage-6B-summary.md agent-workflow/reports/WSD-20260507-10-stage-6C-summary.md agent-workflow/reports/WSD-20260507-10-stage-6D-summary.md agent-workflow/reports/WSD-20260507-10-stage-6E-summary.md agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md agent-workflow/reports/WSD-20260507-11-v2-baseline-decision-package.md agent-workflow/reports/WSD-20260507-11-v2-schema-quality-review.md agent-workflow/reports/WSD-20260507-11-v2-preflight-governance-autopilot-closeout.md
git commit -m "docs: record accepted v2 planning baseline"
node agent-workflow/tools/run-quality-gates.mjs syntax
git tag -a v1.0-baseline-20260507 -m "V1.0 baseline before V2 formal upgrade"
git branch codex/v2-planning v1.0-baseline-20260507
```

Optional worktree after user confirms path:

```powershell
git worktree add "..\01-WaveSight-v2-lab" codex/v2-planning
```

## 8. Rollback Notes

- No rollback is needed for this preflight task because it did not stage or commit.
- For future baseline creation, use a tag only after the baseline commit is auditable.
- Do not use destructive reset commands to clean the mixed working tree.
- If the user later rejects a file category, remove it from the command draft before staging.

## 9. User Decisions Still Required

1. Confirm whether Batch 1 can be committed.
2. Confirm whether Batch 2 production content and generated data should enter baseline.
3. Confirm whether Batch 3 test-only pipeline should be archived.
4. Confirm exclusion of `09-ai-news-radar/`, P0-11, P1-4B, and bulk screenshot audit directories.
5. Confirm whether to create `v1.0-baseline-20260507`, `codex/v2-planning`, and optional `..\01-WaveSight-v2-lab` after Batch 1 commit.
