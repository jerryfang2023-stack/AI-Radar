---
id: SIG-20260704-A10
type: signal_card
signal_type: product_service
title: "英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型"
date: 2026-07-04
status: published
source_title: "英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型"
asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-04T04:51:45.614Z
updated_at: 2026-07-04T04:51:45.614Z

raw_refs: ["R-036"]
pool_refs: ["P-036"]
primary_raw:
  raw_ref: R-036
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-04/r-036-英伟达开源-nemotron-labs-twotower-双塔扩散语言模型.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-04/r-036-英伟达开源-nemotron-labs-twotower-双塔扩散语言模型.json"
  source_url: "https://www.ithome.com/0/972/162.htm"
  full_text_hash: "5bb1e7936a251c63"
  source_level: B
  extraction_quality: medium
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: important_product_or_service
  importance_score: 5

formal_tags:
  track: ["track-ai-agent", "track-ai-infra"]
  function: []
  scenario: []
  customer: []
  evidence: ["evidence-customer-metric", "evidence-product-launch"]
  stage: []
  region: []
  source: []

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["sales_team"]
  team_or_function: ["sales"]
  specific_task: ["sales_lead_research"]
  business_action: ["customer_deployment", "product_launch", "open_source_release", "research_benchmark"]
  product_form: ["model_gateway"]
  delivery_model: []
  pain_or_constraint: ["permission_boundary", "data_silo", "evaluation_gap"]
  adoption_evidence: ["customer_metric"]
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "英伟达7月2日开源 Nemotron-Labs-TwoTower，一种基于预训练自回归骨干的离散扩散语言模型。总参数60B，采用双塔架构：30B自回归/上下文塔（冻结）与30B扩散/去噪塔（可训练），每塔激活3B参数，含128个可路由专家。两塔通过逐层交叉注意力协作，分离上下文表示与去噪过程。综合基准测试显示质量保留98.7%，实际生成吞吐量提升2.42倍。模型以开源权重形式发布在 HuggingFace，采用 NVIDIA Nemo..."
  missing_fields: ["delivery_model"]

signal_owner: "英伟达开源 Nemotron"

frontend:
  displayTitle: "英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型"
  sourceLinks:
    - "https://www.ithome.com/0/972/162.htm"
---

# 英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型

## 新闻事实

原始来源标题显示：英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型。

## 原文要点

- 英伟达7月2日开源 Nemotron-Labs-TwoTower，一种基于预训练自回归骨干的离散扩散语言模型。总参数60B，采用双塔架构：30B自回归/上下文塔（冻结）与30B扩散/去噪塔（可训练），每塔激活3B参数，含128个可路由专家。两塔通过逐层交叉注意力协作，分离上下文表示与去噪过程。综合基准测试显示质量保留98.7%，实际生成吞吐量提升2.42倍。模型以开源权重形式发布在 HuggingFace，采用 NVIDIA Nemo...
- IT之家 7 月 3 日消息，英伟达昨日（7 月 2 日）发布博文，宣布推出 Nemotron-Labs-TwoTower，是一种基于预训练自回归骨干网络的离散扩散语言模型， 致力于解决大模型 Token 生成速度瓶颈。
- 在开源方面，该模型以开源权重形式在 Huggingface 平台发布，授权协议为 NVIDIA Nemotron Open Model License。
- 参数方面，该模型总参数为 60B，采用双塔（TwoTower）架构，包括 30B 的自回归模型（AR）/context Tower 和 30B 的扩散 / 降噪 Tower，每个 Tower 激活 3B 模型，128 个可路由专家。
- 架构方面，TwoTower 最大的亮点，在于拆分传统扩散语言模型中的网络任务，将文本生成任务中的上下文表示与去噪过程分离到两个独立的神经网络“塔”中。

## 价值描述

IT之家 7 月 3 日消息，英伟达昨日（7 月 2 日）发布博文，宣布推出 Nemotron-Labs-TwoTower，是一种基于预训练自回归骨干网络的离散扩散语言模型， 致力于解决大模型 Token 生成速度瓶颈。

## 可见原文片段

原始来源标题显示：英伟达开源 Nemotron-Labs-TwoTower 双塔扩散语言模型。

## 证据边界

没有变化前后流程线索
