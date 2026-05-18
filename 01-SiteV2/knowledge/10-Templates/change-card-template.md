---
id: CHG-YYYYMMDD-XX
type: change_card
title:
date:
status: draft
created_at:
updated_at:

# 前台生命周期：recent_observation | heating_up | trend_tracking
frontend_state: recent_observation

# 后台生命周期：new | continuing | clustered | trend_candidate | merged_into_trend | historical_reference
lifecycle_state: new

# 资产状态：candidate | formal | frontstage
asset_level: candidate

# 证据门槛：core_evidence_passed | needs_backfill | watchlist_only | rejected
evidence_gate: needs_backfill

# Raw / Pool 回源。正式或前台变化卡必须至少有 1 条 core Raw 证据。
raw_refs: []
pool_refs: []
primary_raw:
  raw_ref:
  raw_archive:
  raw_json:
  source_url:
  full_text_hash:
  source_level:
  extraction_quality:
  has_full_text:
  pool_routes: []

# 原始出处与数据。聚合源只能作为 discovery_source，不得作为事实主证据。
source_evidence:
  original_sources:
    - name:
      url:
      source_level:
      source_type:
      published_at:
      role: primary_evidence
  discovery_sources: []
  data_sources:
    - name: 暂无公开信息
      url:
      data_type:

# Raw 结构化证据入口
key_excerpts:
  - type:
    text:
    supports: []
    importance:
    confidence:
business_elements:
  companies: []
  products: []
  people: []
  industries: []
  roles: []
  workflows: []
  business_actions: []
  affected_departments: []
  numbers: []
  quotes: []
evidence_seed:
  company_actions: []
  case_details: []
  workflow_changes: []
  before_after_clues: []
  affected_roles: []
  risks_or_constraints: []
missing_information: []

# 对外内容字段
event:
business_meaning:
why_selected:
technical_route_business_meaning:
same_or_adjacent_cases: 暂未监测到同类案例
related_case_status: needs_research

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

# 内部治理字段
internal:
  admission_status: candidate
  publish_status: internal
  review_status: pending
  evidence_boundary:
  last_reviewed:
---

# {{变化标题}}

## 发生了什么

用 2-4 句话说明这条 AI 商业变化。先写事实：谁、做了什么、产品 / 合作 / 发布 / 争议是什么。

不要写成公司新闻摘要。变化卡写“现象”，不是写“某公司发布了什么”。

## 原始出处与证据

- [来源名称](URL)
- Raw：`raw_ref`
- 本地快照：`raw_archive`
- 结构化记录：`raw_json`

说明该来源提供了什么增量信息。聚合源、社区讨论和搜索摘要只能写成发现线索，不能写成事实主证据。

## 数据来源

- 数据来源：暂无公开信息

如果涉及融资、收入、客户数量、市场规模、下载量、招聘数量、使用量、增长率等数字，必须列出对应数据源。没有可靠公开来源时，保留“暂无公开信息”，不得编造估算。

## 一句解释

用一句话说明这条变化为什么值得记录。

示例：

> 这条变化说明企业 Agent 的关注点正在从“能否完成任务”转向“能否被审计、控制和接入真实流程”。

## 为什么值得看

说明这条变化进入观察的原因：它碰到了什么客户、流程、预算、责任边界、交付组织或竞争变化。

不要写空泛趋势词。不要把“可能很重要”当理由。

## 商业含义

说明它可能影响谁、影响什么流程、改变什么购买或使用方式。能写具体岗位、部门、客户类型时，不写泛泛的“企业用户”。

## 技术路线 / 方法变化

说明这条变化背后的技术路线、方法、架构、交互、工作流或成本结构变化。

只解释商业含义，不做开发者教程。

可回答：

- 新模型、新方法或新架构改变了什么？
- 它降低了什么成本、门槛或交付复杂度？
- 它改善了什么效果、体验或流程？
- 它带来了什么新的限制、依赖或风险？

## 同类产品 / 相邻案例

- 暂未监测到同类案例

不允许为空。若暂未发现，使用上述标准写法，并在 frontmatter 标记 `related_case_status: needs_research`。

如已发现，列出同类产品、相邻案例或相关公司，并说明相似点或差异点。不得为了填满字段生造案例。

## 继续观察

写 2-4 条具体观察点，例如：

- 是否出现更多一手发布、客户案例、采购或价格变化。
- 是否有同类产品跟进。
- 是否出现真实客户采用、预算变化、事故、反证或监管约束。

## 关联资产

系统可自动建立关联，但本节用于人工补充或修正关联理由。

建议说明：

- 与哪些变化卡同类。
- 支撑哪些案例卡。
- 呼应哪些前沿观点。
- 是否进入某个变化簇。
- 是否可能进入趋势追踪。

## 证据缺口

内部使用。同步 Raw 的 `missing_information`，说明来源不足、数据缺口、潜在误读、反证、市场噪音或尚不能下结论的部分。

缺真实客户、成本数字、变化前流程、付费数据、市场规模、同类案例时，必须明确写缺口，不能由模型补戏。
