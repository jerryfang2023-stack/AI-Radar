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

# 观点证据闸门：opinion_captured | needs_context | weak_signal_only | rejected
opinion_evidence_gate: needs_context

# 四道闸门：观点底稿 -> 前后台分离 -> 观澜文案闸门 -> 脚本质检
fact_draft_gate: pending
frontend_copy_gate: pending
cardcopy_gate: pending

# 四档评级：feature | sidebar | archive | discard
opinion_tier: archive
display_lane: archive_only
selection_reason:
opinion_rating_score: 0
opinion_rating_version: 2026-05-22-v1
publish_status: internal_archive

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
  acquisition_source:
  community_or_frontier_boundary: true

# 若观点中包含事实主张，必须另补 S/A/B 来源；没有则写“暂无公开信息”。
fact_claim_support:
  required: false
  status: 暂无公开信息
  supporting_raw_refs: []
  missing_information: []

# 是否高影响观点
high_impact: false
impact_reason:

# 前台展示字段。只有 frontend_copy_gate / cardcopy_gate 均为 passed 且评级允许时才可同步。
frontend:
  displayTitle:
  speakerLine:
  originalQuote:
  originalTranslation:
  interpretation:
  factBoundary:
  sourceLinks: []
  relatedAssets: []
  evidenceBoundary: []

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
  opinion: []

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
  review_status: pending
  evidence_boundary:
  last_reviewed:
---

# {{观点标题}}

## 观点底稿

观点卡先证明“谁在何时何处说了什么”，再写观澜解读。

- 谁：
- 当时身份：
- 在哪里说：
- 原文说了什么：
- 事实主张是否需要补证：

原文摘录或当时可见文本不足时，`opinion_evidence_gate` 只能是 `needs_context` 或 `weak_signal_only`，不得进入前台。

follow-builders / 社区材料可以生成观点卡，但只证明“谁在何时何处说了什么”。观点里的公司动作、客户采用、收入、融资、市场规模等事实主张，必须另补 S/A/B 或 eligible `core_pool` 来源；没有补证时，不得写成商业信号、成熟变化短专题、趋势判断或前台文章事实段落。

## 四档评级

每张观点卡必须评级：

| 档位 | display_lane | publish_status | 用途 |
|---|---|---|---|
| `feature` | `daily_feature` | `frontstage_feature` | 今日观察主推观点 |
| `sidebar` | `signal_sidebar` | `frontstage_sidebar` | 商业信号页观点模块 / 侧栏 |
| `archive` | `archive_only` | `internal_archive` | 知识库归档，不进前台 |
| `discard` | `hidden` | `hidden` | 隐藏或后续清理 |

评级理由必须写在 `selection_reason`，不能只写分数。

## 人物 / 机构

- 人物：
- 机构：
- 当时 title / 身份：

## 原文摘录

> 粘贴原文关键摘录。

原文摘录是观点卡的核心内容，优先于摘要。不要用中文概括替代原文。

如果原文较长，只摘取最能代表观点的片段，并保留原文链接。

## 发表时间与出处

- 发表时间：
- 抓取时间：
- 原文出处：[来源名称](URL)
- 平台：
- 可见范围：

X / Reddit / HN / 播客摘录等高波动来源，必须记录当时可见文本、抓取时间、capture_scope，必要时保存截图或快照。

index-only AI HOT、搜索摘要和 failed provider text 不能生成观点卡；只能作为发现入口或排除记录。

## 中文翻译

必填。中文翻译是辅助阅读层，写入 `frontend.originalTranslation` 或正文中的“中文翻译”，但不得替代原文摘录。

## 观澜解读

说明这条观点为什么重要，可回答：

- 它和哪类 AI 商业变化有关？
- 它是否影响行业预期、产品路线、资本关注点或客户判断？
- 它和哪些商业信号、变化候选、场景候选或趋势候选相互呼应？
- 它是否可能触发变化候选？

观点不能替代事实。观点中提到的公司动作、客户采用、收入、融资、市场规模等事实，必须另补 S/A/B 来源。

## 事实主张校验

如果这条观点包含可验证事实，列出补证状态：

- 事实主张：
- 支撑来源：暂无公开信息
- 缺口：

没有补证前，不得把观点里的事实写进商业信号、成熟变化短专题、趋势判断或前台文章的事实段落。

## Tags

使用正式标签体系。前台可自然展示标签，但不展示内部 tag_id。

建议包含：

- 观点主题：`opinion`
- 技术 / 赛道：`track`
- 来源类型：`source`
- 如有关联场景，可补 `scenario` 或 `function`

## 关联资产

- 商业信号：
- 变化候选：
- 场景候选：
- 趋势候选：
- 今日观察 / 趋势报告 / 商业内参：

## 前台展示文案

仅在 `frontend_copy_gate: passed`、`cardcopy_gate: passed` 且 `opinion_tier` 为 `feature` 或 `sidebar` 时填写或同步 `frontend` 对象。

- 原文摘录优先，观澜解读不能替代原文。
- 观点只证明“谁在何时何处说了什么”，不能直接证明公司动作、客户采用、收入、融资或市场规模。
- 事实主张未补 S/A/B 来源时，前台必须自然说明这是观点参照或待证信息。
- 不展示 Raw / Pool / gate / 补证 / 强证据等内部生产语言。

## 证据缺口

内部使用。说明上下文缺失、转述风险、来源限制、是否为玩笑 / 修辞 / 营销表达、是否需要更多事实交叉验证。

缺原文、缺上下文、缺身份、缺发布时间、缺可见文本或缺事实补证时，必须明确写缺口，不能由模型补戏。
