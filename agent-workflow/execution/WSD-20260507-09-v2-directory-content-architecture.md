# WSD-20260507-09-v2-directory-content-architecture 派发单

日期：2026-05-07  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`workflow` / `data` / `dev`

## 0. 快速执行卡

- 看板编号：`V2-6`
- Task ID：`WSD-20260507-09-v2-directory-content-architecture`
- 任务类型：V2 目录架构 / 内容资产治理 / 自动化影响评估
- 派发单：`agent-workflow/execution/WSD-20260507-09-v2-directory-content-architecture.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md`
- 调度口令：`收口：WSD-20260507-09-v2-directory-content-architecture`
- 是否可能影响自动化：是。本任务只做方案，不改生产路径；未来执行迁移会影响 `ai-2` / `ai-3` / `content-paths.json` / 同步脚本。

## 1. 任务背景

用户已明确：

- V1 阶段未完成任务全部放弃。
- V1 版网站内容不再继续更新。
- V2.0 是正式升级项目，需要新的算法、内容源、栏目结构、AI商业内参、热力图和内容资产目录。

当前顶层目录仍包含 V1 生产兼容路径：

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `05-point/`
- `07-Opportunities/`
- `04-Site/`
- `06-content/`
- `08-AI news/`
- `09-ai-news-radar/`
- `提示词/`
- `测试期文档/`

其中部分路径被 `04-Site/config/content-paths.json`、同步脚本、关系检查和长期自动化任务引用，不能在本任务中直接移动。

## 2. 任务目标

输出 V2 文件目录与内容资产架构方案，明确：

- V1 内容冻结后的目录状态。
- V1 生产兼容目录如何归档、保留、只读或迁移。
- V2 正式内容库、算法证据库、AI商业内参、热力图、机会地图、后台资产和测试资产应如何组织。
- 哪些目录未来需要改名、合并、迁移或新增。
- 哪些路径会影响 `ai-the-point`、`ai-2`、`ai-3`、`content-paths.json`、`sync-data.mjs`、`unified-site-sync.mjs`。
- 未来实际迁移的任务拆分、风险、回滚和验收要求。

本任务只输出方案，不移动文件、不改路径、不改脚本、不改自动化。

## 3. 必读

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/execution/dispatch-board.md`
4. `agent-workflow/v2/v2-transition-charter.md`
5. `agent-workflow/v2/v2-workspace-strategy.md`
6. `agent-workflow/v2/v2-dev-workspace-baseline.md`
7. `agent-workflow/v2/v2-algorithm-source-architecture.md`
8. `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`
9. `agent-workflow/v2/v2-vi-design-direction.md`
10. `agent-workflow/v2/v2-product-architecture-prd.md`，如果 V2-4 已收口则必须读取最新版本和 closeout。
11. `agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md`
12. `04-Site/config/content-paths.json`
13. `04-Site/README.md`

## 4. 必须输出

### 4.1 V1 内容冻结规则

必须明确：

- V1 网站内容不再日更。
- V1 内容目录默认转为 `legacy / read-only / compatibility` 层。
- 不得继续把新 V2 内容写入 V1 生产目录，除非另有迁移任务和自动化升级。
- V1 历史内容可供 V2 训练、回溯、迁移和关系校验参考，但不作为 V2 新内容入站默认位置。

### 4.2 V2 推荐目录树

必须给出建议目录树，至少覆盖：

```text
06-content/
  v2/
    00-raw/
    01-pool/
    02-structured/
    03-front-signals/
    04-deep-dives/
    05-trends/
    06-heat-evidence/
    07-heat-cards/
    08-ai-brief/
    09-opportunity-maps/
    10-counter-evidence/
    11-source-registry/
```

同时评估是否需要新增：

- `agent-workflow/v2/schemas/`
- `agent-workflow/v2/rules/`
- `agent-workflow/v2/migration/`
- `agent-workflow/v2/quality-gates/`
- `04-Site/v2/` 或 V2 分支 / worktree 内的新前端目录策略。

### 4.3 目录处置矩阵

必须输出矩阵：

| 当前目录 / 文件 | 当前用途 | V2 处置建议 | 是否移动 | 是否影响自动化 | 风险 | 后续任务 |
|---|---|---|---|---|---|---|

至少覆盖：

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `04-Site/`
- `05-point/`
- `06-content/`
- `07-Opportunities/`
- `08-AI news/`
- `09-ai-news-radar/`
- `agent-workflow/v2/`
- `提示词/`
- `测试期文档/`
- `04-Site/config/content-paths.json`

### 4.4 自动化影响表

必须说明如果未来迁移目录，会如何影响：

- `ai-the-point`
- `ai-2`
- `ai-3`
- `04-Site/scripts/sync-data.mjs`
- `04-Site/scripts/check-relations.mjs`
- `04-Site/scripts/check-tags.mjs`
- `agent-workflow/tools/unified-site-sync.mjs`
- `04-Site/config/content-paths.json`

必须给出“兼容期策略”：

- 哪些 V1 路径继续保留只读。
- 哪些 V2 路径先新增不替换。
- 哪个任务负责切换自动化入站。
- 哪个任务负责切换网站同步。
- 哪个任务负责 QA 和回滚。

### 4.5 迁移分阶段建议

必须拆成后续可派发任务，例如：

- `V2-6A`：创建 V2 内容目录骨架和 README，不移动旧内容。
- `V2-6B`：定义 V2 schemas / source registry / HeatEvidence 文件规范。
- `V2-6C`：升级 ai-2 入站到 V2 内容库，保留 V1 只读兼容。
- `V2-6D`：升级 ai-3 / sync-data / relation checks 支持 V2 数据。
- `V2-6E`：迁移或映射 V1 历史内容到 V2 legacy index。

## 5. 硬规则

- 不得直接移动、删除、重命名现有目录。
- 不得修改 `04-Site/config/content-paths.json`。
- 不得修改 `sync-data.mjs`、`unified-site-sync.mjs` 或长期自动化任务。
- 不得把 V1 frozen content 当成继续日更入口。
- 不得把 P0-11、P0-2A、P0-2B、P1-4B 等未验收 / failed / stopped 成果作为 V2 目录迁移依据。
- 必须说明 V2-4 产品架构尚未收口时的假设；如 V2-4 已收口，必须吸收其结论。
- 所有 Markdown 必须保存为 UTF-8。

## 6. 输出文件

- `agent-workflow/v2/v2-directory-content-architecture.md`
- `agent-workflow/reports/WSD-20260507-09-v2-directory-content-architecture-closeout.md`

## 7. 必跑检查

- `node agent-workflow/tools/run-quality-gates.mjs syntax`

如本任务没有修改代码和生产路径，页面截图、内容同步、关系检查、多身份权限验收可说明不适用。
