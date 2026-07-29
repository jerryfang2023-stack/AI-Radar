---
id: SIG-20260707-A05
type: signal_card
signal_type: product_service
title: "Cloudflare 将一键屏蔽 AI 爬虫改为细粒度控制，按搜索/训练/智能体分类"
date: 2026-07-07
status: published
source_title: "Cloudflare 将一键屏蔽 AI 爬虫改为细粒度控制，按搜索/训练/智能体分类"
asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-07T03:23:37.092Z
updated_at: 2026-07-07T03:23:37.092Z

raw_refs: ["R-014"]
pool_refs: ["P-014"]
primary_raw:
  raw_ref: R-014
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-07/r-014-cloudflare-将一键屏蔽-ai-爬虫改为细粒度控制-按搜索-训练-智能体分类.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-07/r-014-cloudflare-将一键屏蔽-ai-爬虫改为细粒度控制-按搜索-训练-智能体分类.json"
  source_url: "https://the-decoder.com/cloudflare-replaces-its-blanket-ai-bot-block-with-granular-controls-for-search-training-and-agent-crawlers"
  full_text_hash: "edcc21e1f9fdef3f"
  source_level: A
  extraction_quality: high
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: important_product_or_service
  importance_score: 5

formal_tags:
  track: ["track-ai-coding", "track-enterprise-data"]
  function: ["function-engineering"]
  scenario: ["scenario-knowledge-base"]
  customer: ["customer-developer-team"]
  evidence: ["evidence-product-launch"]
opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["enterprise_ai_owner", "it_security_team"]
  team_or_function: ["it_security"]
  specific_task: []
  business_action: ["product_launch", "governance_requirement"]
  product_form: []
  delivery_model: []
  pain_or_constraint: ["permission_boundary"]
  adoption_evidence: ["deployment_scale"]
  source_evidence_type: ["business_media"]
  evidence_basis: "raw_source_text"
  source_excerpt: "自2024年7月提供一键屏蔽所有AI爬虫后，Cloudflare现为所有用户（含免费计划）推出细粒度控制，将爬虫分为搜索（搜索引擎索引）、训练（AI模型训练数据采集）、智能体（代表用户行动的bot，如ChatGPT）三类。2026年9月15日起，带广告的页面默认屏蔽训练和智能体爬虫，保留搜索爬虫；多用途爬虫（如Googlebot）按最严格规则处理。Cloudflare同时为企业用户推出BotBase数据库，可查询每个bot的分类与内容..."
  missing_fields: ["specific_task", "product_form", "delivery_model"]

signal_owner: "The-Decoder"

frontend:
  displayTitle: "Cloudflare 将一键屏蔽 AI 爬虫改为细粒度控制，按搜索/训练/智能体分类"
  sourceLinks:
    - "https://the-decoder.com/cloudflare-replaces-its-blanket-ai-bot-block-with-granular-controls-for-search-training-and-agent-crawlers"
---

# Cloudflare 将一键屏蔽 AI 爬虫改为细粒度控制，按搜索/训练/智能体分类

## 新闻事实

原始来源标题显示：Cloudflare 将一键屏蔽 AI 爬虫改为细粒度控制，按搜索/训练/智能体分类。

## 原文要点

- 自2024年7月提供一键屏蔽所有AI爬虫后，Cloudflare现为所有用户（含免费计划）推出细粒度控制，将爬虫分为搜索（搜索引擎索引）、训练（AI模型训练数据采集）、智能体（代表用户行动的bot，如ChatGPT）三类。2026年9月15日起，带广告的页面默认屏蔽训练和智能体爬虫，保留搜索爬虫；多用途爬虫（如Googlebot）按最严格规则处理。Cloudflare同时为企业用户推出BotBase数据库，可查询每个bot的分类与内容...
- 原文称，The new options are available to users on the free plan as well.

## 价值描述

原文称，The new options are available to users on the free plan as well.

## 可见原文片段

原始来源标题显示：Cloudflare 将一键屏蔽 AI 爬虫改为细粒度控制，按搜索/训练/智能体分类。

## 证据边界

none
