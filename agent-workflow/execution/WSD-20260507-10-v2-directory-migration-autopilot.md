# WSD-20260507-10-v2-directory-migration-autopilot 派发单

日期：2026-05-07  
状态：dispatched  
调度窗口：当前主窗口  
牵头 Agent：`workflow` / `data` / `dev` / `qa`

## 0. 快速执行卡

- 看板编号：`V2-6AUTO`
- Task ID：`WSD-20260507-10-v2-directory-migration-autopilot`
- 任务类型：V2-6A 到 V2-6E 单窗口顺序执行包
- 派发单：`agent-workflow/execution/WSD-20260507-10-v2-directory-migration-autopilot.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md`
- 调度口令：`收口：WSD-20260507-10-v2-directory-migration-autopilot`
- 是否可能影响自动化：是。6C / 6D 涉及自动化与同步脚本，但本任务默认只做 V2 隔离层和方案 / 草案，不切换生产自动化。

## 1. 任务目标

把 `V2-6A` 到 `V2-6E` 合并为一个独立执行窗口的连续任务，减少每一小段来回调度。

执行窗口必须按顺序完成：

1. `V2-6A`：创建 V2 内容目录骨架和 README。
2. `V2-6B`：定义 V2 schemas / Source Registry / HeatEvidence 文件规范。
3. `V2-6C`：准备 ai-2 入站到 V2 内容库的隔离版规则、提示词、runbook 和样例，不替换生产 ai-2。
4. `V2-6D`：准备 ai-3 / sync-data / relation checks 支持 V2 数据的隔离版方案、fixtures 和开发草案，不替换生产同步脚本。
5. `V2-6E`：建立 V1 历史内容 legacy index，不移动 V1 原文件。

本任务允许执行 6A / 6B / 6E 的文件创建；允许执行 6C / 6D 的隔离层文档、schema、fixtures、runbook 和草案；禁止直接切换生产自动化、生产同步脚本或生产路径。

## 2. 必读

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/execution/dispatch-board.md`
4. `agent-workflow/v2/v2-directory-content-architecture.md`
5. `agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md`
6. `agent-workflow/v2/v2-algorithm-source-architecture.md`
7. `agent-workflow/v2/v2-product-architecture-prd.md`，如存在则读取最新版。
8. `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`
9. `agent-workflow/v2/v2-dev-workspace-baseline.md`
10. `agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md`
11. `04-Site/config/content-paths.json`
12. `04-Site/README.md`

## 3. 执行机制

执行窗口不需要每完成一个阶段就回调度中枢，但必须在每个阶段结束时写阶段摘要：

- `agent-workflow/reports/WSD-20260507-10-stage-6A-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6B-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6C-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6D-summary.md`
- `agent-workflow/reports/WSD-20260507-10-stage-6E-summary.md`

最终只回调度窗口一次：

```text
收口：WSD-20260507-10-v2-directory-migration-autopilot
```

## 4. 阶段要求

### 4.1 V2-6A：创建 V2 内容目录骨架

允许创建：

```text
06-content/v2/
  README.md
  00-raw/README.md
  01-pool/README.md
  02-structured/README.md
  03-front-signals/README.md
  04-deep-dives/README.md
  05-trends/README.md
  06-heat-evidence/README.md
  07-heat-cards/README.md
  08-ai-brief/README.md
  09-opportunity-maps/README.md
  10-counter-evidence/README.md
  11-source-registry/README.md
  12-legacy-index/README.md
```

必须说明：

- V1 内容冻结。
- V2 新内容默认进入 `06-content/v2/`。
- 旧 `06-content/` P0-12 结构是 test-only / pilot，不等同正式 V2 内容库。
- 这些目录不自动进入网站同步。

### 4.2 V2-6B：定义 schemas / rules / quality gates

允许创建：

```text
agent-workflow/v2/schemas/
agent-workflow/v2/rules/
agent-workflow/v2/migration/
agent-workflow/v2/quality-gates/
```

至少输出：

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

### 4.3 V2-6C：ai-2 V2 入站隔离准备

允许创建：

- V2 ai-2 入站 runbook。
- V2 日更提示词草案。
- V2 内容样例模板。
- V2 入站质量检查说明。

推荐位置：

```text
agent-workflow/v2/migration/ai-2-v2-ingestion-plan.md
agent-workflow/v2/rules/ai-2-v2-daily-radar-prompt.md
06-content/v2/README.md 或对应目录 README 中补充入站说明
```

禁止：

- 不得修改生产 `ai-2` 自动化本体。
- 不得继续把 V2 新内容写入 `01-Signals/` / `02-Scoring/`。
- 不得修改 `sync-data.mjs` 或 `content-paths.json`。

如执行窗口判断必须改生产自动化，必须停止在 6C，并在 closeout 写 `blocked / production-automation-change-required`。

### 4.4 V2-6D：ai-3 / sync-data / relation checks V2 支持隔离准备

允许创建：

- V2 同步与关系检查方案。
- V2 fixtures / sample data 说明。
- V1 fallback / V2 output / rollback 方案。
- 未来 Dev 任务拆分。

推荐位置：

```text
agent-workflow/v2/migration/ai-3-v2-sync-gate-plan.md
agent-workflow/v2/migration/content-paths-v2-draft.md
agent-workflow/v2/migration/v2-sync-relation-check-plan.md
agent-workflow/v2/migration/rollback-plan.md
```

禁止：

- 不得修改 `04-Site/config/content-paths.json`。
- 不得修改 `04-Site/scripts/sync-data.mjs`。
- 不得修改 `04-Site/scripts/check-relations.mjs`。
- 不得修改 `04-Site/scripts/check-tags.mjs`。
- 不得修改 `agent-workflow/tools/unified-site-sync.mjs`。
- 不得修改生产 `ai-3` 自动化本体。

如执行窗口判断必须改生产同步脚本，必须停止在 6D，并在 closeout 写 `blocked / production-sync-change-required`。

### 4.5 V2-6E：V1 legacy index

允许创建：

```text
06-content/v2/12-legacy-index/v1-signals-index.md
06-content/v2/12-legacy-index/v1-priority-index.md
06-content/v2/12-legacy-index/v1-trends-index.md
06-content/v2/12-legacy-index/v1-point-index.md
06-content/v2/12-legacy-index/v1-opportunities-index.md
```

要求：

- 不移动 V1 原文件。
- 不修改 V1 原内容。
- 只建立索引、路径、类型、日期、状态、是否可复用、V2 映射建议。
- failed / abandoned / stopped / review 成果不得标为 accepted source。

## 5. 总体硬规则

- 不得使用 `git reset --hard`。
- 不得删除、移动、重命名 V1 目录。
- 不得修改 `04-Site/config/content-paths.json`。
- 不得修改生产同步脚本。
- 不得修改生产自动化任务。
- 不得修改 Netlify 配置。
- 不得把 P0-11、P0-2A、P0-2B、P1-4B 等未验收 / failed / stopped 成果作为 V2 正式资产。
- 所有 Markdown 保存为 UTF-8。

## 6. 必跑检查

每个阶段完成后至少确认文件存在与 UTF-8 可读。

最终必须运行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如创建 JSON 或脚本草案，必须做相应语法检查。

## 7. 输出

最终 closeout：

- `agent-workflow/reports/WSD-20260507-10-v2-directory-migration-autopilot-closeout.md`

closeout 必须包含：

- 每个阶段完成 / 跳过 / 阻塞状态。
- 新增文件清单。
- 明确未修改的生产路径和自动化。
- 自动化影响说明。
- Quality Gates 结果。
- 后续需要单独派发的生产切换任务。
