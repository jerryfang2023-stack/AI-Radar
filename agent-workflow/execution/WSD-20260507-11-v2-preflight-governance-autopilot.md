# WSD-20260507-11-v2-preflight-governance-autopilot 派发单

日期：2026-05-07  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`workflow` / `dev` / `data` / `qa`

## 0. 快速执行卡

- 看板编号：`V2-PREFLIGHT`
- Task ID：`WSD-20260507-11-v2-preflight-governance-autopilot`
- 任务类型：V2 preflight / baseline decision package / schema QA
- 派发单：`agent-workflow/execution/WSD-20260507-11-v2-preflight-governance-autopilot.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-11-v2-preflight-governance-autopilot-closeout.md`
- 调度口令：`收口：WSD-20260507-11-v2-preflight-governance-autopilot`
- 是否可能影响自动化：否。本任务不改生产自动化、同步脚本或网站页面。

## 1. 任务目标

把两个可并行的安全任务合并到一个执行窗口：

1. 承接 `V2-5A`：形成 baseline 提交范围决策包，列出建议纳入、暂缓、排除文件清单和后续 commit/tag/branch/worktree 命令草案。
2. 承接 `V2-6F`：Data / QA 复核 V2 schemas、rules、quality gates、Source Registry、HeatEvidence、AI Brief 规范，判断是否足以进入 7 日 V2 内容隔离验证。

本任务是 preflight governance，不直接执行生产切换，不直接提交 Git，不打 tag，不建 branch，不建 worktree。

## 2. 必读

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/execution/dispatch-board.md`
4. `agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md`
5. `agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md`
6. `agent-workflow/v2/v2-directory-content-architecture.md`
7. `agent-workflow/v2/schemas/`
8. `agent-workflow/v2/rules/`
9. `agent-workflow/v2/quality-gates/`
10. `agent-workflow/v2/migration/`
11. `06-content/v2/`
12. `04-Site/config/content-paths.json`

如 `V2-4` 已收口，也必须读取：

- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/reports/WSD-20260507-05-v2-product-architecture-prd-closeout.md`

如 V2-4 仍在执行，必须写明本任务基于当前已知 V2-4 草案，不替代 V2-4 最终产品架构。

## 3. Part A：V2-5A baseline 决策包

必须输出：

- 当前 Git 状态摘要。
- 建议纳入 baseline 的文件清单。
- 建议暂缓纳入的文件清单。
- 必须排除的文件 / 目录清单。
- 三段提交策略是否仍成立。
- 如果用户确认，后续可执行的非交互 Git 命令草案。
- 风险和回滚说明。

默认建议口径：

1. 第一批只纳入 accepted V2 planning + governance + V2 isolation skeleton 文档。
2. 生产内容与同步数据暂不纳入，需 Data / Workflow 单独确认。
3. P0-12 / V2 test-only 管线暂不纳入 baseline，只作为 planning 候选。
4. 排除 P0-11、P0-2A、P0-2B、P1-4B、`09-ai-news-radar/`、未确认临时审计目录和未验收页面实现。

禁止：

- 不得执行 `git add`。
- 不得执行 `git commit`。
- 不得创建 tag。
- 不得创建 branch。
- 不得创建 worktree。
- 不得删除或回滚文件。

如果执行窗口认为必须实际提交，必须停止并写入 closeout：`blocked / user-git-confirmation-required`。

## 4. Part B：V2-6F schema / rules / quality gate 复核

必须复核：

- `raw-candidate.schema.md`
- `structured-signal.schema.md`
- `heat-evidence.schema.md`
- `heat-card.schema.md`
- `ai-brief-issue.schema.md`
- `source-registry.schema.md`
- `v2-ingestion-rules.md`
- `v2-source-level-rules.md`
- `v2-counter-evidence-rules.md`
- `v2-tag-mapping-rules.md`
- `v2-frontstage-backstage-boundary.md`
- `v2-content-quality-gate.md`
- `heat-evidence-quality-gate.md`
- `ai-brief-quality-gate.md`
- `ai-2-v2-ingestion-plan.md`
- `ai-3-v2-sync-gate-plan.md`
- `content-paths-v2-draft.md`
- `v2-sync-relation-check-plan.md`
- `rollback-plan.md`

必须输出复核表：

| 文件 | 是否足够进入 7 日隔离验证 | 缺口 | 风险 | 建议动作 |
|---|---|---|---|---|

必须判断：

- schema 是否覆盖 Raw -> Pool -> Structured -> Front Signal -> Deep Dive -> HeatEvidence -> HeatCard -> AIBriefIssue。
- Source Registry 是否足以支持来源分层、S/A/B/C、X / LinkedIn / Product Hunt / YC / VC / Builder 来源。
- HeatEvidence 是否能反向追溯 Signal / Point / Opportunity / Trend。
- AI Brief 是否能承接 weekly MVP。
- Quality Gates 是否足以阻止浅新闻、重复新闻、无商业信号内容、缺少二次搜索来源和反证缺失。
- 是否足以启动 `V2-7` 7 日隔离验证。

## 5. 允许输出

- `agent-workflow/reports/WSD-20260507-11-v2-baseline-decision-package.md`
- `agent-workflow/reports/WSD-20260507-11-v2-schema-quality-review.md`
- `agent-workflow/reports/WSD-20260507-11-v2-preflight-governance-autopilot-closeout.md`

如需要，也可补充小范围 Markdown 修正到 `agent-workflow/v2/schemas/`、`rules/` 或 `quality-gates/`，但必须在 closeout 列出，并说明未改生产脚本 / 自动化。

## 6. 硬规则

- 不修改 `04-Site/config/content-paths.json`。
- 不修改 `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`、`unified-site-sync.mjs`。
- 不修改生产 `ai-the-point`、`ai-2`、`ai-3`。
- 不修改 Netlify 配置。
- 不执行 Git commit / tag / branch / worktree。
- 不移动、删除、重命名 V1 内容目录。
- 所有 Markdown 保存为 UTF-8。

## 7. 必跑检查

```powershell
git status --short --branch
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如修改 schema / rules / quality-gates Markdown，必须确认 UTF-8 可读。

## 8. 最终 closeout 必须包含

- Part A baseline 决策包结论。
- Part B schema / quality gate 复核结论。
- 是否建议启动 `V2-7`。
- 是否仍阻塞 Git baseline。
- 是否修改生产路径 / 自动化 / 同步脚本。
- Quality Gates 结果。
- 后续建议任务。
