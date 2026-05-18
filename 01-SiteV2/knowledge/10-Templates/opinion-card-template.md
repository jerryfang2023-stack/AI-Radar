---
id: OPN-YYYYMMDD-XX
type: opinion_card
title:
date:
status: draft
created_at:
updated_at:

# 人物 / 机构
person_name:
organization:
title_at_time:
role_type: builder
person_id:

# 发表信息
published_at:
collected_at:
platform:
original_url:
canonical_url:
language:

# 资产状态：candidate | formal | frontstage
asset_level: candidate

# 观点证据门槛：opinion_captured | needs_context | weak_signal_only | rejected
opinion_evidence_gate: needs_context

# 观点原文证据。观点卡证明的是“谁在何时何处说了什么”，不是证明事实成立。
opinion_capture:
  raw_ref:
  raw_archive:
  raw_json:
  source_url:
  full_text_hash:
  source_level:
  source_volatility:
  capture_scope:
  evidence_level:
  has_visible_text:
  screenshot_path:
  markdown_snapshot:

# 若观点中包含事实主张，必须另补 S/A/B 来源；没有则写“暂无公开信息”。
fact_claim_support:
  required: false
  status: 暂无公开信息
  supporting_raw_refs: []
  missing_information: []

# 是否高影响观点
high_impact: false
impact_reason:

# 后台结构化字段，不直接作为前台标签展示
structured_claim:
opinion_object:
opinion_tendency:
opinion_status:
triggers_change_candidate: false

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

# {{观点标题}}

## 人物 / 机构

记录观点来自谁。

- 人物：
- 机构：
- 当时 title / 身份：

## 原文摘录

> 粘贴原文关键摘录。

原文摘录是观点卡的核心内容，优先于摘要。不要用中文概括替代原文。

如原文较长，只摘取最能代表观点的片段；注意不要超出合理引用范围。

## 发表时间与出处

- 发表时间：
- 抓取时间：
- 原文出处：[来源名称](URL)
- 平台：
- 可见范围：

X / Reddit / HN / 播客摘录等高波动来源，必须记录当时可见文本、抓取时间、capture_scope，必要时保存截图或快照。

## 中文转述

可选。

如果原文为英文或信息密度较高，可用中文转述核心意思。中文转述是辅助，不替代原文摘录。

## 观澜解读

说明这条观点为什么重要。

可回答：

- 它和哪类 AI 商业变化有关？
- 它是否影响行业预期、产品路线、资本关注点或客户判断？
- 它和哪些变化卡、案例卡或趋势卡互相呼应？
- 它是否可能触发变化卡候选？

观点不能替代事实。观点中提到的公司动作、客户采用、收入、融资、市场规模等事实，必须另补 S/A/B 来源。

## 事实主张校验

如果这条观点包含可验证事实，列出补证状态：

- 事实主张：
- 支撑来源：暂无公开信息
- 缺口：

没有补证前，不得把观点里的事实写进变化卡、案例卡、趋势卡或前台文章的事实段落。

## Tags

使用正式标签体系。前台可自然展示标签，但不展示内部 tag_id。

建议包含：

- 观点主题：`point`
- 技术 / 赛道：`track`
- 来源类型：`source`
- 如有关联场景，可补 `scenario` 或 `function`

## 关联资产

列出与这条观点相关的资产：

- 变化卡：
- 案例卡：
- 趋势卡：
- 变化簇：
- 今日观察 / 趋势报告 / 商业内参：

## 对人物时间线的意义

说明这条观点在该人物的连续观点中处于什么位置。

前台不要直接显示“新观点 / 延续 / 转向 / 分歧 / 被验证 / 被反证”等机械标签；如果有价值，应在人物档案页用自然语言解释。

## 后台结构化主张

本节用于检索、聚合和自动关联，可隐藏或仅内部可见。

- 结构化观点主张：
- 观点对象：
- 观点倾向：
- 观点状态：
- 是否高影响观点：
- 是否触发变化卡候选：

## 证据缺口

内部使用。说明上下文缺失、转述风险、来源限制、是否为玩笑 / 修辞 / 营销表达、是否需要更多事实交叉验证。

缺原文、缺上下文、缺身份、缺发布时间、缺可见文本或缺事实补证时，必须明确写缺口，不能由模型补戏。
