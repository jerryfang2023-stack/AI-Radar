---
date: 2026-05-17
owner: intelligence-data-agent / workflow-agent
status: implemented
---

# Raw 全文保存与关键词探索层更新

## 背景

用户提出两个问题：

1. 赛道词如果过少，是否会导致后续抓取范围太窄，所有内容都集中在少数赛道。
2. Raw 原文证据只有 `clean_text`，缺少真正用于回查的 `full_text`。

## 处理结果

### 关键词范围

- 当前关键词表不是 5 个赛道，而是 8 个 P0 赛道锚点、4 个必覆盖信号层。
- 本次新增第 5 个主题组：`outside-core-exploration`。
- 新增策略字段：
  - `p0_tracks_are_anchors_not_boundaries: true`
  - `exploration_query_share: 0.15`
  - `outside_core_track_min_raw: 10`
- 关键词总查询从 42 条增至 50 条。

原则：P0 赛道词是监测锚点，不是内容边界。每日必须保留外围探索层，持续扫描当前 P0 未覆盖的新行业、新岗位、新流程、新客户和弱变化。

### Raw 全文证据

- Raw schema 新增 `full_text` 和 `full_text_hash`。
- `full_text` 作为证据底座，尽量保存原文可读全文、社区可见文本或聚合源 fallback 文本。
- `clean_text` 继续作为 AI 分析入口，可以清洗和截断。
- Markdown 原文档案现在同时写入 `clean_text` 和 `full_text`。
- Pool 现在携带 `raw_full_text_hash`，方便后续卡片和文章回源核查。

## 修改文件

- `01-SiteV2/content/09-databases/keyword-monitoring-v2.json`
- `agent-workflow/tools/run-v2-daily-pipeline.mjs`
- `agent-workflow/tools/v2-raw-evidence-gate.mjs`
- `agent-workflow/product/raw-evidence-schema.md`
- `agent-workflow/product/source-intelligence.md`
- `01-SiteV2/content/README.md`
- `agent-workflow/automation-prompts/daily-monitor-router.md`

## 验证

- 关键词 JSON 解析通过：5 个 theme group、8 个 P0 track、50 条 keyword_search query、包含 `outside-core-exploration`。
- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs` passed。
- `node --check agent-workflow/tools/v2-raw-evidence-gate.mjs` passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` passed。

## 注意

历史 Raw 不会自动补出 `full_text`。下一次重新运行 `daily-monitor-router` 后，新 Raw 会按新 schema 生成；旧 Raw 若要补齐，需要单独跑回填。
