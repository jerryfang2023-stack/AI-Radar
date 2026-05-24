---
task_id: WSD-20260522-opinion-rating-followbuilders
date: 2026-05-22
status: completed
owner: Codex / Product Commander
scope: opinion-card-rating-governance
sync_target: main-window
---

# 522 观点卡评级与 follow-builders 权重收口

## 1. 问题总结

本次问题不是单张观点卡内容问题，而是资产链路断点：

1. 资产生成后没有把 2026-05-22 的全量观点卡统一交给评级脚本治理。
2. `content/05-frontier-opinions/2026-05-22-opinion-cards.md` 曾被生成成一张观点卡索引，导致前台看起来只有一张观点卡。
3. 评级后没有及时执行站点数据同步，前台数据仍然停留在旧状态。
4. follow-builders 被当成普通弱来源处理，未体现“知名人物池入口”的候选价值。
5. 旧规则没有充分区分“有判断价值的观点”和“回复 / 寒暄 / 招募 / 纯链接 / 祝贺式转发”等噪音。
6. 评级脚本会重写 `frontend.originalQuote`，长英文摘录曾触发 `cardcopy` 的“前台长英文直出”问题。

## 2. 已执行修复

### 2.1 评级规则

已更新 `agent-workflow/tools/govern-opinion-card-ratings.mjs`：

- 增加 522 人工精选：
  - `OPN-FB-20260522-07` 进入 `feature`。
  - `OPN-FB-20260522-02 / 10 / 11 / 18 / 26` 进入人工 `sidebar`。
- follow-builders 作为“知名人物池入口”给候选加权。
- 扩展高价值人物与机构识别：Garry Tan、Zara Zhang、Dan Shipper、Kevin Weil、Matt Turck、Aditya Agarwal、Josh Woodward、Peter Steinberger 等。
- 扩展商业 / 产品变量词：AI-native team、delegate、verify output、Exa、YC、Stainless、API、SDK、MCP server、business copilots、model performance、agent lab、Google I/O 等。
- 加强噪音扣分：glad / you found it / apply to / can't recommend / pod link / youtube / spotify / idea fusion / 招募、祝贺、纯链接和弱回复类内容会被压低。
- 修复原文读取顺序：优先读取 `原文说了什么`，避免只拿到短摘录导致中文标题规则失效。
- 前台 `originalQuote` 对长英文改为 `见正文原文摘录`，完整原文仍保留在正文证据区。
- 增加中文标题规则，避免前台出现半截英文标题。

### 2.2 文档同步

已同步两个最小真源：

- `agent-workflow/automation-prompts/asset-card-generator.md`
  - 明确资产生成后必须执行：
    1. `govern-opinion-card-ratings.mjs`
    2. `cardcopy --require-gates=true`
    3. `sync-v2-site-data.mjs`
  - 明确不能只写 `content/05-frontier-opinions/<date>-opinion-cards.md` 索引后结束。

- `context/08-card-asset-qc-checklist.md`
  - 增加前沿观点卡前台同步顺序。
  - 明确 `opinion-cards.md` 是评级结果索引，不是前台展示的唯一来源。

## 3. 相关脚本 / 文档排查结果

### 已确认正常

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
  - `frontstageOpinionReady` 已强制要求：
    - `type = opinion_card`
    - `fact_draft_gate / frontend_copy_gate / cardcopy_gate = passed`
    - `opinion_tier = feature | sidebar`
    - `display_lane = daily_feature | signal_sidebar`
  - 不会把 `archive` / `discard` 因为存在 `frontend` 字段带到前台。

- `context/05-daily-monitoring.md`
  - 已说明每日监测只产出观点候选，不决定前台展示。

- `context/06-execution-harness.md`
  - 已说明前沿观点卡必须执行四档评级。

- `context/07-card-asset-stage-model.md`
  - 已说明四档评级和前台同步边界。

- `agent-workflow/product/card-asset-copy-governance.md`
  - 已说明观点卡四档评级与 `archive` / `discard` 不得前台同步。

- `01-SiteV2/content/05-frontier-opinions/README.md`
  - 已说明进入本目录的前台观点索引只能来自已评级观点卡。

### 已补齐的缺口

- 资产生成提示之前只要求 `cardcopy`，没有把“观点评级治理”和“站点同步”写成硬步骤。
- QC 清单之前说明了评级字段，但没有明确脚本执行顺序。

## 4. 当前 522 结果

重新执行 2026-05-22 评级后：

```text
governed: 29
feature: 1
sidebar: 11
archive: 2
discard: 15
```

前台数据唯一展示项：

```text
feature: 1
sidebar: 11
total: 12
```

前台展示观点包括：

- Aaron Levie：Agent 落地需要技术交付和变更管理
- Garry Tan：Exa 正成为 Agent 搜索基础设施
- Dan Shipper：MCP 设计要少而准，才能服务 Agent
- AI & I by Every：MCP 设计要少而准，才能服务 Agent
- Zara Zhang：AI-native 团队需要重新分配人和 Agent 的任务
- Swyx：模型能力提升会改变 Agent 产品的商业回报
- Swyx：Exa 在 Agent 搜索评测中胜出
- Google Labs：AI 工具把游戏设计压缩到分钟级
- Garry Tan：AI 红利需要留住关键人才
- Sam Altman：AGI 优先加速科研、公司和个人创造
- Guillermo Rauch：AI 能力将进入更大规模 Web 工作流
- Sam Altman：通用模型开始攻克开放数学问题

## 5. 后续执行防复发规则

以后执行 Card / 观点卡资产链，必须按以下顺序：

```powershell
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=assets --date=<YYYY-MM-DD>
node agent-workflow/tools/generate-asset-cards-from-pool.mjs --date=<YYYY-MM-DD>
node agent-workflow/tools/govern-opinion-card-ratings.mjs --date=<YYYY-MM-DD>
node agent-workflow/tools/run-quality-gates.mjs cardcopy --date=<YYYY-MM-DD> --require-gates=true
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=<YYYY-MM-DD>
node agent-workflow/tools/run-quality-gates.mjs syntax
```

硬规则：

- 不得只生成单张观点索引后结束。
- 不得手改 `opinion-cards.md` 代替评级脚本。
- 不得在 `cardcopy` 未通过时同步前台数据。
- follow-builders 应作为知名人物候选池加权，但回复、寒暄、招募、纯链接、祝贺式转发应进入 `discard` 或至多 `archive`。
- 前台标题必须是中文判断式，不得出现半截英文。
- 前台 `originalQuote` 不承载长英文；完整原文保留在正文“原文摘录”中。

## 6. 验证

已执行：

```powershell
node --check agent-workflow/tools/govern-opinion-card-ratings.mjs
node agent-workflow/tools/govern-opinion-card-ratings.mjs --date=2026-05-22
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-22
node agent-workflow/tools/run-quality-gates.mjs cardcopy --date=2026-05-22 --require-gates=true
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：

- `govern-opinion-card-ratings`：通过，29 张观点卡完成治理。
- `cardcopy`：passed，失败项 0。
- `syntax`：passed，13/13。
- 前台数据：1 个 `feature`，11 个 `sidebar`，共 12 个唯一 522 观点展示项。

## 7. 文件变化

本任务相关变更：

- `agent-workflow/tools/govern-opinion-card-ratings.mjs`
- `agent-workflow/automation-prompts/asset-card-generator.md`
- `context/08-card-asset-qc-checklist.md`
- `01-SiteV2/content/05-frontier-opinions/2026-05-22-opinion-cards.md`
- `01-SiteV2/knowledge/02-Opinion-Cards/2026-05-22--frontier-opinion-index.md`
- `01-SiteV2/knowledge/02-Opinion-Cards/2026-05-22--frontier-opinion-*.md`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`

未删除文件。工作区中存在大量历史删除 / 未跟踪项，本任务未回滚、未清理、未纳入结论。

## 8. 给主窗口的同步结论

522 观点卡问题已闭环。后续主窗口如继续派发资产链或前台内容同步任务，应把 `govern-opinion-card-ratings.mjs -> cardcopy -> sync-v2-site-data.mjs` 作为 Card 资产链的固定后置步骤；不要再以 `content/05-frontier-opinions/<date>-opinion-cards.md` 的单文件数量判断前台观点数量。
