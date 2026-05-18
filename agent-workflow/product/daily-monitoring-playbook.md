---
title: Daily Monitoring Playbook
date: 2026-05-18
status: active
owner: workflow-agent / intelligence-data-agent
skill: guanlan-daily-monitor
---

# Daily Monitoring Playbook｜每日监测任务规则

每日监测是独立任务，不是 Raw schema、Pool 分流、卡片生成或今日观察写作的附属步骤。

它只回答四件事：

- 今天 AI 商业世界出现了哪些可追踪变化。
- 哪些材料有原文证据，哪些只是线索。
- 哪些 Raw 值得进入 Pool，哪些只保留索引、观察或丢弃。
- 哪些证据缺口会影响后续内容资产和文章生产。

每日监测不写今日观察，不生成完整卡片，不写趋势报告，不做深度竞品研究。

## 1. 执行入口

执行技能：

```text
skills/guanlan-daily-monitor/SKILL.md
```

当前自动化：

```text
guanlan-daily-monitor
```

默认时间：

```text
09:00 Asia/Shanghai
```

## 2. 必读顺序

每日监测执行前必须读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. `skills/guanlan-daily-monitor/SKILL.md`
4. `agent-workflow/product/daily-monitoring-playbook.md`
5. `agent-workflow/product/source-intelligence.md`
6. `agent-workflow/product/raw-evidence-schema.md`
7. `agent-workflow/product/pool-routing-rules.md`
8. `01-SiteV2/content/README.md`
9. `01-SiteV2/content/09-databases/keyword-monitoring-v2.json`
10. `01-SiteV2/content/09-databases/source-registry-v2.json`

其中：

- 本 Playbook 定义每日怎么监测。
- `source-intelligence.md` 定义来源等级、采集通道、关键词和来源治理。
- `raw-evidence-schema.md` 定义 Raw 必填字段和证据门槛。
- `pool-routing-rules.md` 定义 Pool 分流细则。
- `keyword-monitoring-v2.json` 是关键词和主题覆盖的可执行版本。
- `source-registry-v2.json` 是来源池和降权规则的可执行版本。

## 3. 默认三段式入口

每日默认按三段式执行：

```text
AI HOT 全量
→ follow-builders 全量
→ 关键词规则补齐
→ 不足或重要卡片缺证时启动外部多路搜索
```

### AI HOT

- 拉取最近 24 小时 `mode=all` 全量。
- AI HOT 是 Raw 主发现入口，不是事实主证据。
- 先按类目、P0/P1 关键词、商业动作和噪音规则筛选。
- `industry`、`ai-products`、`ai-models` 可默认进入候选。
- `paper` 必须命中技术迭代、商业动作、开发者生态或明确应用场景。
- `tip` 必须命中关键词、P0/P1 赛道词或商业动作。
- 进入重要卡片、今日观察、趋势报告或商业内参前，必须回到 `origin_url` / `original_url` 抓全文并重新判定 S/A/B/C/D。

### follow-builders

- 每日全量扫描。
- 全量写入 `01-SiteV2/knowledge/03-Opinion-Cards/` 前沿观点库或对应候选目录。
- 它用于观点、人物时间线、实践线索、分歧、转向和早期变化。
- Builder 观点不能直接证明公司动作、客户采用、收入、融资或市场规模。
- 观点卡的核心证据是“谁在何时何处说了什么”，必须保存人物 / title / 原文链接 / 原文摘录或当时可见文本 / 发布时间 / 抓取时间 / 观察边界或 `capture_scope`。

### 关键词补齐

关键词规则负责补齐：

- P0 赛道锚点。
- P1 证据词。
- 成熟信号、早期信号、技术迭代信号、开发者生态信号。
- 外围探索层，避免内容被大厂和固定赛道锁死。

关键词搜索必须多路检索，不得只依赖 HN / Reddit / X。

## 4. 何时启动外部搜索

只有出现以下情况，才启动外部多路搜索：

- AI HOT + follow-builders 不足 Raw 目标。
- 四类信号覆盖明显不足。
- P0 / P1 关键词覆盖缺口明显。
- 重要卡片缺 S/A/B 原始来源。
- 社区讨论升温，但没有官方、生态、融资、行业、采购或 A 级媒体证据。
- 需要反大厂偏置，补中小创业公司、开源项目、垂直 SaaS、marketplace、客户故事或招投标线索。

外部搜索只补缺口和补证，不得把搜索结果页本身当事实主证据。

## 5. Raw 目标

常规日：

```text
Raw 80-150 条
```

低信号日或关键接口失败日：

```text
Raw 50-80 条
```

如果低于 50 条，必须在 source-router log 写明：

- 哪些来源失败。
- 尝试过哪些 fallback。
- 哪些信号类别缺口最大。
- 后续是否需要手工补抓或延后今日观察。

## 6. Raw 保存要求

每条 Raw 必须尽量保存：

- `raw_id`
- `title`
- `original_url`
- `canonical_url`
- `source_name`
- `source_type`
- `source_level`
- `acquisition_source_level`
- `author`
- `published_at`
- `collected_at`
- `language`
- `full_text`
- `clean_text`
- `markdown_snapshot`
- `html_snapshot_path`
- `screenshot_path`
- `fetch_status`
- `extraction_quality`
- `has_full_text`
- `content_length`
- `fetch_error`
- `url_hash`
- `content_hash`
- `full_text_hash`
- `semantic_hash`
- `duplicate_of`
- `first_seen_at`
- `last_seen_at`
- `update_detected`
- `key_excerpts`
- `business_elements`
- `evidence_seed`
- `guanlan_scores`
- `emerging_signal_score`
- `usable_for`
- `pool_routes`
- `missing_information`
- `raw_status`

`full_text` 是证据底座。`clean_text` 是分析入口。后续卡片和文章不能只看 Pool 摘要。

## 7. 高波动与聚合来源

X、HN、Reddit、Discord、Telegram、Product Hunt 评论、GitHub issue 等来源不得按来源类型默认降级为 `summary_only` 或 `failed`。

抓到正文、讨论串、评论或当时可见文本时，必须保存：

- 当时可见文本。
- 抓取时间。
- 原始 URL。
- 作者 / 社区 / 发布时间。
- 可见范围。
- 必要截图或快照。

并标记：

- `source_volatility`
- `capture_scope`
- `evidence_level`

AI HOT 等聚合来源只保存 discovery record。必须优先回源。原始页面抓取失败时，才允许保存聚合源可见文本作为 fallback，且只能作为 `discovery_only` / `weak_signal`。

## 8. Pool 目标

常规 Pool：

```text
20-40 条
```

Pool 是候选索引，不是事实正文。每条 Pool 必须能回到 Raw：

- `raw_ref`
- `raw_archive`
- `raw_json`
- `source_url`
- `full_text_hash`
- `key_excerpts`
- `business_elements`
- `evidence_seed`
- `missing_information`

Pool 分流只允许：

- `core_pool`
- `emerging_pool`
- `user_feedback_pool`
- `watchlist`
- `index_only`
- `discard`

不得为了凑数量把 `index_only`、`watchlist`、C 级社区材料或 M 级发现通道硬升为 `core_pool`。

## 9. core_pool 门槛

进入 `core_pool` 必须同时满足：

```text
has_full_text = true
extraction_quality = high | medium
source_level = S | A | B
有明确商业变化
commercial_value >= 3
guanlan_relevance >= 3
```

`core_pool` 可作为变化卡、案例卡、趋势报告、今日观察和商业内参的事实候选，但进入前台前仍要检查 `missing_information`，必要时补证。

## 10. 早期与社区线索

`emerging_pool` 可接纳 B/C 级早期线索，但需要：

```text
emerging_signal_score >= 4
```

`user_feedback_pool` 接纳：

- 讨论升温。
- 开发者阻力。
- 客户痛点。
- 用户反馈。
- 反证观察。

它们不得单独证明公司动作、客户采用、收入、融资或市场规模。

只找到社区讨论时，不得生成正式 Pool、变化卡、案例卡、趋势报告或今日观察。若满足观点证据门槛，可以进入前沿观点候选。

## 11. 多样性硬要求

每日监测必须覆盖四类信号：

- 成熟信号：大企业、大融资、并购、平台发布、客户采用、收入、定价、生态发布。
- 早期信号：pre-seed、seed、angel、grant、YC、accelerator、stealth、spinout。
- 技术迭代信号：成本、能力、部署、协议、工具链、运行时、沙箱、评测。
- 开发者生态信号：开源、SDK、框架、插件市场、GitHub 采用、云市场上架、开发者分发。

常规目标：

- Raw 每类信号不少于 8 条候选。
- Pool 每类信号不少于 3 条候选。
- Raw 单一主题默认不得超过 35%。
- Pool 单一主题默认不得超过 40%。

不足时写入 `evidence_gaps`，不能用大企业新闻硬补齐。

## 12. 输出

每日监测输出：

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
01-SiteV2/content/04-business-signals/
01-SiteV2/knowledge/03-Opinion-Cards/
agent-workflow/reports/<YYYY-MM-DD>-v2-daily-source-router-log.md
```

## 13. 日志必填

source-router log 必须包含：

- `source_distribution`
- `raw_count_by_channel`
- `raw_count_by_source_type`
- `aihot_discovered_count`
- `aihot_rejected_by_raw_entry_rules`
- `external_search_activated`
- `keyword_group_distribution`
- `theme_distribution`
- `theme_concentration_warning`
- `source_level_distribution`
- `pool_route_distribution`
- `raw_snapshot_status_distribution`
- `failed_sources`
- `fallback_used`
- `evidence_gaps`

## 14. 禁止项

- 禁止把 AI HOT 摘要当事实。
- 禁止把 HN / Reddit / X 讨论当公司事实。
- 禁止把搜索结果页当事实来源。
- 禁止只凭 Pool 标签写变化卡、案例卡、今日观察、趋势报告或商业内参。
- 禁止为凑数量把低证据线索硬升为 `core_pool`。
- 禁止因大厂新闻多就让全天信号被大厂占满。
- 禁止每日监测直接写今日观察长文或深度趋势报告。

## 15. 验证

完成后至少运行：

```powershell
node --check agent-workflow/tools/run-v2-daily-pipeline.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如果运行失败，必须写明：

- 失败来源。
- 失败阶段。
- fallback 是否启用。
- Raw / Pool 是否达标。
- 哪些下游任务应暂停或降级。
