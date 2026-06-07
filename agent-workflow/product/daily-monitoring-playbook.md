---
title: Daily Monitoring Playbook
date: 2026-05-22
status: active-v2.2
owner: intelligence-engine / build-release
skill: guanlan-daily-monitor
---

# Daily Monitoring Playbook

每日监测只产出 Raw、Pool、监测日志和 QC 输入，不写文章，不生成卡片，不同步网站。

## 1. 默认入口

执行顺序：

```text
AI HOT daily selected
→ AI HOT recent 24h mode=all
→ follow-builders
→ keyword multi-path search
→ 必要时外部补采
```

## 2. 精选入口权重

AI HOT daily 是每日精选：

- 必须全量进入 Raw 候选和 Pool index。
- 可以获得更高采集优先级。
- 不自动进入 `core_pool`。
- 进入事实资产前必须看原文、快照、证据对象和页面类型。

follow-builders 是精选 Builder 入口：

- 必须全量扫描。
- 可以获得更高采集优先级。
- 默认先进入 `opinion_intake`，并在入库时写入中文翻译。
- 只能证明“谁在何时何处说了什么”。
- 涉及公司动作、客户、收入、融资、采购、监管或市场规模时，必须按原文来源重新判定。
- 每日监测不决定观点卡前台位置；前台展示必须由资产链补齐四档评级后决定。

精选权重不等于 `S/A/B/C/D/M` 加分。

## 3. 来源类型

`S/A/B/C/D/M` 只区分来源类型，不是价值评级。

- S：海外一手事件源。
- A：高质量报道或研究。
- B：垂直行业、融资、生态、创业公司来源。
- C：社区、观点、反馈、讨论。
- D：噪音、SEO、无事件页面。
- M：采集入口。

内容价值只看六类重要性：重要案例、重要融资事件、重要技术趋势、重要产品和服务产生、重要垂直行业解决方案、影响行业的重要发言 / 观点 / 文章。

## 4. S 类边界

S 只看海外一手事件源。

可用 S：

- 官方公告、新闻、release note、changelog。
- 客户案例、合作公告、上线公告。
- 监管文件、采购公告、证券披露。
- 官方仓库 release / changelog / security advisory。
- 可核验的创始人、高管或项目方原帖。

不可用 S：

- 官网首页。
- 产品页、Demo 页、产品目录。
- 文档首页、API / SDK 目录。
- 价格导航页。
- GitHub README / repo index。
- Hugging Face / npm / PyPI 包页或模型页。
- 控制台、登录页、搜索结果页。
- 百度、阿里云、腾讯云、华为云、火山引擎等国内官网和 SEO 页面。

这些页面如无明确时间、主体、可核验事实或完整观点正文，只能 `index_only`。

## 5. B 类边界

B 类有原文即可采信，不要求强制回到 S/A 补证。

B 类仍必须有具体变化：

- 融资。
- 产品发布。
- 客户或试点。
- 部署或集成。
- 开源采用。
- Marketplace 分发。
- 垂直行业落地。
- 预算、采购或岗位流程变化。

只有项目页、包页、模型页、公司介绍或榜单时，不能当作事实变化。

## 6. 关键词检索

关键词检索必须补足：

- 海外大厂事件。
- 垂直赛道产品新闻。
- 创业公司融资。
- 客户采用和行业落地。
- 开发生态发布。
- 采购、监管和反证信号。

HN / Reddit / X 只作为社区反馈补充，不得成为关键词结果的主体。

搜索路径只代表采集意图，不代表证据等级。命中页面仍按页面类型、原文和证据对象判定。

## 7. Raw 数量

Raw 是覆盖目标，不是固定 100，也不是旧版 80-150 区间。

- 正常日：至少 150 条 active Raw candidates。
- Pool：至少 75 条 Pool candidates，其中 routed Pool 至少 60 条。
- Core Pool：至少 30 条可用 core_pool evidence，且非大厂 core_pool 至少 20 条。
- 低于上述门槛：下游默认暂停，除非 QC 明确允许降级使用，或用户明确人工放行。

每日监测应该保留足够多的有效候选，不要为了稳定输出而把数量截死在 100。

## 8. 重要性覆盖

每日必须覆盖六类 `importance_type`：

- `important_case`
- `important_funding`
- `important_technical_trend`
- `important_product_or_service`
- `important_vertical_solution`
- `important_viewpoint_or_article`

缺口必须写入 `importance_coverage_gaps`，不能用首页、SEO、工具导航、社区热帖、入口摘要或低信息页面补数。

## 9. Pool 原则

Source Layer Governance includes Raw-to-Pool routing governance. Raw-to-Pool 属于本流程；Pool-to-Content 属于下一个流程。

Pool 是候选索引，不是事实正文。

`core_pool` 至少需要：

- 有原始 URL。
- 有全文。
- 抽取质量为 high / medium。
- 证据对象不是 index-only 类型。
- 有 content hash 和 full text hash。
- 有关键摘录。
- `raw_qc_decision=allow`。
- `importance_score >= 4`。
- `importance_type` 属于六类核心重要性。

B 类材料可直接入候选，只要原文证据足够；不需要强制 S/A 补证。

`importance_score` 不是黑箱排序。1-2 分只能归档、索引或 supporting context；3 分是潜在线索但不能核心化；4 分是明确重要变化；5 分是平台级、头部客户、知名机构、前沿能力或行业判断框架变化。

非核心路由：

- `watchlist`：有明确主体、方向或早期信号，但缺全文、快照、hash、关键摘录或二搜确认，只能追踪和补采。
- `index_only`：首页、目录、产品页、包页、模型页、搜索结果、SEO 页或精选入口摘要，只保留索引和回溯，不作为事实证据。
- `discard`：无 URL、无可用快照、明显噪音或 `raw_qc_decision=block`，保存排除记录但不进入下游。
- AI HOT daily selected 全量保留进 Pool index，但没有 `raw_qc_decision=allow` 和核心证据门槛时不得进入 `core_pool`。
- `allow_with_degradation` 只能进入非核心路由；资产链、今日观察、商业信号、趋势追踪和商业内参必须等最终 QC 列明可用范围。

降级上限：

- `missing_full_text` / `missing_snapshot`：最高 `watchlist`，入口摘要只能 `index_only`。
- `missing_hash` / `missing_excerpt`：最高 `watchlist`。
- `index_only_or_directory_page`：最高 `index_only`。
- `discovery_or_feedback_source_boundary`：社区材料最高 `user_feedback_pool`，聚合入口最高 `index_only`，除非回源成功。
- `raw_qc_decision=block`：`discard`；AI HOT daily selected 可保留为 `index_only`，但仍不得下游使用。

日志必须拆分 Pool 指标：`pool_index_count`、`routed_pool_count`、`core_pool_count`、`index_only_pool_count`、`aihot_index_only_count`、`aihot_core_count`。不得只用 `pool_count` 判断 Pool 健康度。

## 10. 监测日志

日志必须写清：

- `source_distribution`
- `raw_count_by_channel`
- `raw_count_by_source_type`
- `source_level_distribution`
- `keyword_search_path_distribution`
- `keyword_search_non_community_count`
- `theme_distribution`
- `theme_concentration_warning`
- `pool_route_distribution`
- `pool_index_route_distribution`
- `pool_index_count`
- `routed_pool_count`
- `non_core_pool_count`
- `index_only_pool_count`
- `aihot_index_only_count`
- `aihot_core_count`
- `importance_coverage_gaps`
- `pool_importance_coverage_gaps`
- `failed_sources`
- `fallback_used`
- `evidence_gaps`

## 11. 禁止项

- 禁止把 `S/A/B/C/D/M` 当价值分。
- 禁止把 AI HOT 摘要当事实。
- 禁止把 follow-builders 观点当公司事实。
- 禁止把未评级、缺中文翻译、`archive` 或 `discard` 的观点卡当作前台可展示内容。
- 禁止让 HN / 社区结果挤占关键词检索主体。
- 禁止把国内官网首页、SEO 首页、产品陈列页当 S。
- 禁止用首页、目录、README、包页、模型页、搜索结果页补 Raw / Pool 数量。
- 禁止把 Raw 固定截成 100。

## Layered Search Provider Runtime Sync

Runtime provider order after WSD-20260520-05:

- Semantic keyword discovery: Anysearch -> Tavily -> Exa -> DuckDuckGo -> Bing fallback.
- A-media / news verification: GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback.

NewsAPI is retired from the current monitoring path and must not be treated as an active provider or environment requirement. Provider availability is detected from local environment variables and project-local ignored env files. Missing providers are skipped automatically. Provider output is discovery only until original evidence is fetched, captured, checked by Raw QC, and routed through the six-lane importance gate.
