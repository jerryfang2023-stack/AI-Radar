---
id: CASE-YYYYMMDD-XX
type: case_card
title:
date:
status: draft
created_at:
updated_at:

# 深度层级：l1_monitoring | l2_research | l3_deep_case
case_depth: l1_monitoring

# 案例类型：company | product | customer_adoption | technical_route | funding | partnership | failure_case | other
case_type:

# 资产状态：candidate | formal | frontstage
asset_level: candidate

# 证据门槛：core_evidence_passed | needs_backfill | watchlist_only | rejected
evidence_gate: needs_backfill

# 对象信息
company_name:
product_name:
organization:
website:
region:

# Raw / Pool 回源。正式或前台案例卡必须至少有 1 条 core Raw 证据。
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

# 案例解释字段
case_event:
case_value:
supported_change:
customer_or_scene:
business_model: 暂无公开信息
same_or_adjacent_cases: 暂未监测到明确同行或相邻案例
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

# {{案例标题}}

## 这个案例是谁

用 2-4 句话说明对象是谁、产品或项目做什么、为什么值得记录。

案例卡写“对象”，但必须服务变化解释。不要写成公司百科、产品黄页或投资备忘录。

## 发生了什么

先写事实：公司 / 产品 / 客户具体做了什么，是发布、客户采用、合作、融资、价格变化、技术路线变化，还是失败 / 降温案例。

不得用“证明某趋势成立”倒推事件。

## 它支撑的变化

说明这个案例支撑了哪类 AI 商业变化。

必须关联至少 1 张变化卡；如果暂时没有正式变化卡，写明候选变化方向，并标记 `evidence_gate: needs_backfill`。

## 原始出处与证据

- [来源名称](URL)
- Raw：`raw_ref`
- 本地快照：`raw_archive`
- 结构化记录：`raw_json`

说明该来源提供了什么增量信息。聚合源、社区讨论和搜索摘要只能写成发现线索，不能写成事实主证据。

## 数据来源

- 数据来源：暂无公开信息

如果涉及融资、收入、客户数量、市场规模、估值、下载量、使用量、增长率等数字，必须列出对应数据源。没有可靠公开来源时，保留“暂无公开信息”，不得编造估算。

## 产品 / 项目做法

说明该对象具体做了什么：

- 产品形态是什么？
- 服务什么客户或场景？
- 替代、增强或重组了什么流程？
- 当前是发布、试点、客户采用、融资、合作、收入增长，还是失败 / 降温案例？

## 技术路线 / 方法变化

说明该案例采用了什么新技术、新方法、新架构、新交互、新工作流或成本优化方式。

只解释商业含义，不做开发者教程。

## 客户与场景

说明目标客户、使用者、采购方、使用场景或行业对象。

如果暂未看到清晰客户线索，写明“暂无公开客户线索”，不要补空泛推测。

## 同行 / 竞品 / 相邻案例

L1 阶段可以先列初步对象；L2 阶段应二次搜索补全。

- 暂未监测到明确同行或相邻案例

不允许为空。未发现时使用上述标准写法，并在 frontmatter 标记 `related_case_status: needs_research`。

## 商业模式

说明 subscription、usage-based、enterprise license、service fee、outcome-based、marketplace / take rate 等模式。如没有公开信息，写“暂无公开信息”。

## 赛道前景

说明该案例所在赛道为什么值得观察。必须基于已出现的案例、来源、数据或行为信号，不写空泛市场判断。

## 竞争分析

比较同行 / 竞品在客户、产品形态、技术路线、渠道、商业模式、定价、集成深度、数据壁垒、合规要求等方面的差异。

如果公开信息不足，写缺口，不写空泛 SWOT。

## 风险与反证

记录客户需求不明确、产品同质化、集成成本高、平台依赖、监管风险、毛利压力、客户流失、失败案例等反证。

## 关联资产

系统可自动建立关联，但本节用于人工补充或修正关联理由。

建议说明：

- 支撑哪些变化卡。
- 与哪些案例同类或相邻。
- 是否呼应某些前沿观点。
- 是否进入某个变化簇。
- 是否可能支撑趋势追踪。

## 证据缺口

内部使用。同步 Raw 的 `missing_information`，说明来源不足、数据缺口、潜在误读、反证、市场噪音或尚不能下结论的部分。

缺真实客户、成本数字、变化前流程、付费数据、市场规模、同类案例时，必须明确写缺口，不能由模型补戏。
