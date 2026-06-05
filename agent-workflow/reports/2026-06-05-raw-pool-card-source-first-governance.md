---
date: 2026-06-05
status: active
scope: raw-pool-card-frontstage-source-first
---

# Raw / Pool / Card 源材料优先治理

## 结论

Raw / Pool 字段不应一刀切删除。证据、门禁、去重、回溯字段要保留在后台；前台内容字段必须精简，并且只能从 Raw 原文、Raw `key_excerpts`、Pool `evidence_seed` 或明确补证后的来源生成。

禁止再用前台摘要、旧 `event`、旧 `why_selected`、旧 `business_meaning`、标签解释或 `business_elements` 二次生成事实、观点、趋势和关系文案。

## 字段治理表

| 层级 | 保留字段 | 用途 | 前台可直接展示 |
|---|---|---|---|
| Raw 原文 | `title` / `original_url` / `canonical_url` / `source_name` / `published_at` / `full_text` / `clean_text` | 原始事实和出处 | 仅标题、来源、日期、原文链接可展示 |
| Raw 证据 | `key_excerpts` / `evidence_seed` / `markdown_snapshot_path` / `json_snapshot_path` / `full_text_hash` | 事实摘录、回溯、验真 | `key_excerpts` 与 `evidence_seed` 可被翻译、提炼后展示 |
| Raw 门禁 | `raw_qc_decision` / `evidence_completeness` / `missing_information` / `degradation_reasons` | 决定能否下游使用 | 不直接展示，只能转成“证据边界” |
| Raw 诊断 | `extraction_method` / `readability_score` / `extractor_diagnostics` / `fetch_status` | 采集质量诊断 | 不展示 |
| 分流字段 | `pool_routes` / `importance_type` / `importance_score` / `usable_for` | 后台路由和候选资格 | 不展示 |
| 分析辅助 | `business_elements` / `guanlan_scores` / `source_level` / `acquisition_channel` | 后台分类、统计、检索 | 不直接展示 |
| Card 前台 | 新闻事实 / 原文要点 / 简要价值描述 / 可见原文片段 / 标题 / 主体 / 标签 / 来源 | 读者可见内容 | 可展示，但必须回源生成 |
| 废止前台源 | `event` / `why_selected` / `business_meaning` / `watch_reason` / `frontend.eventLine` / `frontend.whyWatch` / `frontend.businessMeaning` | 旧前台摘要和文案门禁残留 | 不得作为前台事实、价值、趋势或关系来源 |

## 四个前台字段的来源顺序

| 字段 | 第一来源 | 第二来源 | 禁止来源 |
|---|---|---|---|
| 新闻事实 | Raw `full_text` / `key_excerpts` | Pool `evidence_seed` | 旧 `event`、旧标题改写、标签解释 |
| 原文要点 | Raw `key_excerpts` / Raw 正文句子 | Pool `evidence_seed` | `business_elements` 的流程/角色/产品枚举 |
| 简要价值描述 | 原文要点里的具体数据、案例、能力、结果 | 证据边界里的缺口说明 | `why_selected`、泛泛商业判断、正确但无信息量的话 |
| 可见原文片段 | Raw 正文或 `key_excerpts` 的可读片段 | Pool 原文摘录 | 摘要字段、标签字段、内部规则字段 |

## 趋势与关系模块

- 关系模块只允许基于当日真实 Card 的主体、标题、事实和标签关系生成说明。
- 趋势模块只使用趋势资产的正式假设、正文关系说明、方法变化和直接关联材料。
- 旧 `frontendWhy` / `frontend.relationSummary` / `frontend.publicBoundary` 不得作为趋势前台生成来源。
- 标签只负责聚合候选，不负责替读者下结论。页面必须说明“哪些主体、哪些事实、为什么构成关系”。

## 当前修复

- V3 前台 JSON 删除 `eventLine`、`keyExcerpts`、`rawRef`、`rawArchive`、`rawJson`、`cardPath` 等非必要公开字段。
- V3 前台详情页只使用 `translatedFact`、`originalHighlights`、`summary`、`visibleFragment` 四个必要内容字段。
- `generate-asset-cards-from-pool.mjs` 生成新 `signal_card` 时不再写入 `event`、`why_selected`、`business_meaning`、`watch_reason` 和旧前台文案门禁字段。
- Card 正文改为：新闻事实、原文要点、简要价值描述、可见原文片段、证据边界。
