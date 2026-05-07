---
task_id: WSD-20260507-10-v2-directory-migration-autopilot
board_id: V2-6AUTO
status: accepted
recommended_status: accepted / isolation-skeleton
dispatch_path: agent-workflow/execution/WSD-20260507-10-v2-directory-migration-autopilot.md
closeout_path: agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md
changed_files: 45 new markdown files plus V2 directories
gates: file existence and UTF-8 read check passed; syntax Quality Gate passed
automation_impact: isolation documents only; production ai-the-point, ai-2, ai-3 unchanged
blockers: none for allowed scope; production cutover still requires separate task
next_action: return to dispatch hub with 收口：WSD-20260507-10-v2-directory-migration-autopilot
---

# WSD-20260507-10 V2 Directory Migration Autopilot Closeout

## 0. 调度摘要

- 任务：按顺序完成 V2-6A 到 V2-6E 的安全部分。
- 结论：允许范围内已完成。创建 V2 内容目录骨架、schema、rules、quality gates、ai-2/ai-3 隔离迁移方案、rollback plan 和 V1 legacy index。
- 推荐状态：`accepted / isolation-skeleton`。
- 阻塞项：无。生产自动化或同步切换不在本任务范围内，后续必须单独派发。

## 1. 阶段状态

| Stage | Status | Summary |
|---|---|---|
| V2-6A | completed | Created `06-content/v2/` directory skeleton and README files |
| V2-6B | completed | Created V2 schemas, rules, and quality gates |
| V2-6C | completed-isolation-plan | Created ai-2 V2 ingestion plan and prompt draft; production ai-2 unchanged |
| V2-6D | completed-isolation-plan | Created ai-3 / sync / relation check plans and content-paths draft; production scripts unchanged |
| V2-6E | completed | Created V1 legacy indexes without moving V1 files |

Stage summaries:

- `agent-workflow/reports/WSD-20260507-10-stage-6A-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6B-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6C-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6D-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6E-summary.md`

## 2. New Files

Content skeleton:

- `06-content/v2/README.md`
- `06-content/v2/00-raw/README.md`
- `06-content/v2/01-pool/README.md`
- `06-content/v2/02-structured/README.md`
- `06-content/v2/03-front-signals/README.md`
- `06-content/v2/04-deep-dives/README.md`
- `06-content/v2/05-trends/README.md`
- `06-content/v2/06-heat-evidence/README.md`
- `06-content/v2/07-heat-cards/README.md`
- `06-content/v2/08-ai-brief/README.md`
- `06-content/v2/09-opportunity-maps/README.md`
- `06-content/v2/10-counter-evidence/README.md`
- `06-content/v2/11-source-registry/README.md`
- `06-content/v2/12-legacy-index/README.md`

Schemas:

- `agent-workflow/v2/schemas/raw-candidate.schema.md`
- `agent-workflow/v2/schemas/structured-signal.schema.md`
- `agent-workflow/v2/schemas/heat-evidence.schema.md`
- `agent-workflow/v2/schemas/heat-card.schema.md`
- `agent-workflow/v2/schemas/ai-brief-issue.schema.md`
- `agent-workflow/v2/schemas/source-registry.schema.md`

Rules and quality gates:

- `agent-workflow/v2/rules/v2-ingestion-rules.md`
- `agent-workflow/v2/rules/v2-source-level-rules.md`
- `agent-workflow/v2/rules/v2-counter-evidence-rules.md`
- `agent-workflow/v2/rules/v2-tag-mapping-rules.md`
- `agent-workflow/v2/rules/v2-frontstage-backstage-boundary.md`
- `agent-workflow/v2/rules/ai-2-v2-daily-radar-prompt.md`
- `agent-workflow/v2/quality-gates/v2-content-quality-gate.md`
- `agent-workflow/v2/quality-gates/heat-evidence-quality-gate.md`
- `agent-workflow/v2/quality-gates/ai-brief-quality-gate.md`

Migration:

- `agent-workflow/v2/migration/ai-2-v2-ingestion-plan.md`
- `agent-workflow/v2/migration/ai-3-v2-sync-gate-plan.md`
- `agent-workflow/v2/migration/content-paths-v2-draft.md`
- `agent-workflow/v2/migration/v2-sync-relation-check-plan.md`
- `agent-workflow/v2/migration/rollback-plan.md`

Legacy indexes:

- `06-content/v2/12-legacy-index/v1-signals-index.md`
- `06-content/v2/12-legacy-index/v1-priority-index.md`
- `06-content/v2/12-legacy-index/v1-trends-index.md`
- `06-content/v2/12-legacy-index/v1-point-index.md`
- `06-content/v2/12-legacy-index/v1-opportunities-index.md`

Reports:

- Five stage summary files listed above.
- This closeout file.

## 3. Production Paths Not Modified

Confirmed within this task scope:

- Did not modify `04-Site/config/content-paths.json`.
- Did not modify `04-Site/scripts/sync-data.mjs`.
- Did not modify `04-Site/scripts/check-relations.mjs`.
- Did not modify `04-Site/scripts/check-tags.mjs`.
- Did not modify `agent-workflow/tools/unified-site-sync.mjs`.
- Did not modify production `ai-the-point`, `ai-2`, or `ai-3` automation tasks.
- Did not modify Netlify config.
- Did not move, delete, rename, or edit V1 content directories.

## 4. Automation Impact

This task is automation-impact aware but does not change production automation.

| Object | Modified | Impact |
|---|---:|---|
| `ai-the-point` | No | No direct impact |
| `ai-2` | No | Draft V2 prompt and ingestion plan only |
| `ai-3` | No | Draft V2 sync gate plan only |
| `content-paths.json` | No | Draft V2 content paths stored separately |
| Sync / relation scripts | No | Future planning only |

Future production cutover requires a separate automation-impact task, user confirmation, backup, rollback, and QA.

## 5. Quality Gates

File existence and UTF-8 read check:

- Passed.
- Checked 45 required Markdown files.

Syntax Quality Gate:

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
```

Result:

- Passed.
- 6 checks passed.
- 0 failures.
- Report: `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-095517.md`

Additional note:

- JSON/script syntax checks for new artifacts are not needed because this task created Markdown only. `content-paths-v2-draft.md` contains a draft JSON snippet, not a runtime JSON file.

## 6. Follow-Up Tasks

Recommended next tasks:

1. `V2-6F`: Review V2 schemas and quality gates with Data / QA before any 7-day validation.
2. `V2-7`: Run isolated 7-day V2 content validation using `06-content/v2/`, still without production sync.
3. `V2-13`: Production automation and sync cutover, only after user explicitly restarts website update / V2 production chain.
4. `V2-5A`: Resolve baseline confirmation before branch / worktree and production code development.

## 7. Dispatch Return

```text
收口：WSD-20260507-10-v2-directory-migration-autopilot
```
