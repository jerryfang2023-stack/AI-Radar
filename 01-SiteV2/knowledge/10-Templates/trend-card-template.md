---
id: TRD-YYYYMMDD-XX
type: trend_card
title:
date:
status: draft
created_at:
updated_at:

# 趋势状态：early | strengthening | splitting | mature | cooling | risk
trend_status: early

# 资产状态：candidate | formal | frontstage
asset_level: candidate

# 趋势证据门槛：threshold_passed | threshold_pending | watchlist_only | rejected
trend_evidence_gate: threshold_pending

# 时间窗口
time_window:
first_seen:
last_updated:

# 趋势门槛
threshold:
  supporting_change_count:
  supporting_case_count:
  source_type_count:
  has_technical_route: false
  has_counter_evidence: false
  status: candidate

# Raw / Pool / Asset 证据汇总。趋势卡不由单条 Raw 或单个观点生成。
evidence_summary:
  primary_raw_refs: []
  supporting_raw_refs: []
  pool_refs: []
  raw_source_levels:
    S: 0
    A: 0
    B: 0
    C: 0
    M: 0
  primary_source_count:
  total_source_count:
  source_type_count:
  missing_information: []

# 数据来源。没有可靠公开来源时保留标准写法。
data_sources:
  - name: 暂无公开信息
    url:
    data_type:

# Tags 使用 agent-workflow/product/tag-taxonomy.md 的正式 tag_id
formal_tags:
  track: []
  function: []
  scenario: []
  customer: []
  evidence: []
  stage: []
  region: []
  source: []
  point: []

# 关联资产
related_change_cards: []
related_case_cards: []
related_opinion_cards: []
related_trend_cards: []
related_change_clusters: []
related_sources: []
related_people: []
related_companies: []
related_publications: []

# 后续观察
watch_windows:
  7d:
  30d:
  90d:

# 内部治理字段
internal:
  admission_status: candidate
  publish_status: internal
  review_status: pending
  evidence_boundary:
  last_reviewed:
---

# {{趋势标题}}

## 趋势判断

用 3-6 句话说明这个趋势是什么，以及它当前处于什么阶段。

趋势卡记录一组变化背后的阶段性趋势判断，不由单条新闻或单个观点生成。

## 趋势成立门槛

最低门槛：

- 至少 3 张相关变化卡。
- 至少 2 个不同案例或对象。
- 至少 2 类来源。
- 至少 1 条技术路线或场景进程说明。

说明当前是否达到门槛。如果尚未达到，只能作为趋势候选或观察清单。

## 变化簇来源

列出支撑该趋势的变化簇。

- 变化簇：

说明这些变化簇如何共同指向该趋势。

## 支撑变化卡

列出关键变化卡，并说明每张变化卡提供了什么增量信息。

- 变化卡：

每张支撑变化卡必须能回看 Raw 证据。未完成 Raw 回填的旧变化卡只能作背景，不得作为趋势成立主证据。

## 支撑案例卡

列出关键案例卡，并说明它们分别代表哪些公司、产品、客户采用、技术路线或商业模式。

- 案例卡：

每张案例卡必须说明它如何支撑该趋势，而不是只列公司名。

## 来源与证据摘要

列出关键 Raw、来源等级、抓取质量和证据缺口。

- 核心 Raw：
- 支撑 Raw：
- 来源类型：
- 证据缺口：

满足核心证据门槛的 Raw 才能作为趋势事实主证据：`has_full_text=true`、`extraction_quality=high|medium`、`source_level=S|A|B`。

## 技术路线 / 方法变化

说明该趋势背后的技术路线、方法、架构、交互、工作流或成本结构变化。

只解释商业含义，不做开发者教程。

## 行业 / 赛道结构

说明该趋势涉及的行业、赛道、细分方向和主要参与者。

趋势卡不替代趋势深度报告，但应保留足够结构，方便后续报告引用和更新。

## 客户需求与场景进程

说明客户需求来自哪里，场景处于概念验证、产品化、采购、集成、规模化、分化还是风险阶段。

## 前沿观点

列出相关观点卡。

观点不能作为事实主证据，但可以说明行业预期、叙事变化、产品路线或资本关注点。观点中的事实主张必须另补 S/A/B 来源。

## 数据来源

- 数据来源：暂无公开信息

如果涉及市场规模、客户数量、收入、融资、采购、下载、招聘、使用量、增长率等数字，必须列出对应数据源。没有可靠公开来源时，保留“暂无公开信息”，不得编造估算。

## 风险与反证

说明哪些证据可能削弱该趋势：

- 客户不买单。
- 产品同质化。
- 交付成本高。
- 平台依赖。
- 监管或合规风险。
- 数据不可得。
- 资金热度高但收入证据弱。
- 关键案例失败或降温。

## 当前判断

用自然语言说明该趋势当前应被如何理解。

可表达为：早期趋势、证据增强、分化中、成熟化、降温或风险升高。前台不必展示内部字段名。

## 后续更新条件

说明哪些新增变化会增强、修正或削弱该趋势。

建议至少写 7 / 30 / 90 天观察变量。

## 关联趋势报告

列出分析过该趋势的长文报告：

- 趋势追踪报告：
- 商业内参：
- 今日观察：

## 证据缺口

内部使用。同步 Raw、变化卡、案例卡和观点卡中的 `missing_information`。

缺真实客户、成本数字、变化前流程、付费数据、市场规模、同类案例、反证或多来源确认时，必须明确写缺口，不能由模型补戏。
