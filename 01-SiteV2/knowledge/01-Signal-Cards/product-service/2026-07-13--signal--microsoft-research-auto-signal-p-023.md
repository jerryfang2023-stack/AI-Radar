---
id: SIG-20260713-A02
type: signal_card
signal_type: product_service
title: "微软研究院推出开源可视化中间语言 Flint，让 AI 智能体\"一句话生成专业图表\""
date: 2026-07-13
status: published
source_title: "微软研究院推出开源可视化中间语言 Flint，让 AI 智能体\"一句话生成专业图表\""
asset_level: frontstage
title_translation_status: not_required
title_translation_method: source_title
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-13T11:38:17.591Z
updated_at: 2026-07-13T11:38:17.591Z

raw_refs: ["R-023"]
pool_refs: ["P-023"]
primary_raw:
  raw_ref: R-023
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-13/r-023-微软研究院推出开源可视化中间语言-flint-让-ai-智能体-一句话生成专业图表.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-13/r-023-微软研究院推出开源可视化中间语言-flint-让-ai-智能体-一句话生成专业图表.json"
  source_url: "https://www.ithome.com/0/975/816.htm"
  full_text_hash: "17f70f5d01c9f522"
  source_level: B
  extraction_quality: medium
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - core_pool
    - emerging_pool
  raw_qc_decision: allow
  importance_type: important_market_structure
  importance_score: 5

formal_tags:
  track: ["track-ai-agent", "track-enterprise-data", "track-ai-infra"]
  function: []
  scenario: ["scenario-knowledge-base"]
  customer: []
  evidence: ["evidence-product-launch"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["sales_team", "engineering_team", "it_security_team"]
  team_or_function: ["sales", "engineering", "it_security"]
  specific_task: ["sales_lead_research", "internal_tool_building"]
  business_action: ["customer_deployment", "product_launch", "open_source_release", "research_benchmark"]
  product_form: []
  delivery_model: []
  pain_or_constraint: ["security_compliance", "evaluation_gap"]
  adoption_evidence: []
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "微软研究院推出开源可视化中间语言 Flint，让 AI 智能体\"一句话生成专业图表\" 微软研究院推出开源可视化中间语言 Flint，让 AI 智能体\"一句话生成专业图表\" 微软研究院与中国人民大学 IDEAS Lab 联合推出开源可视化中间语言 Flint，让 AI 智能体通过一句话即可生成 Vega-Lite、ECharts、Chart.js 的可渲染图表。"
  missing_fields: ["product_form", "adoption_evidence", "delivery_model"]

signal_owner: "Microsoft Research"

frontend:
  displayTitle: "微软研究院推出开源可视化中间语言 Flint，让 AI 智能体\"一句话生成专业图表\""
  sourceLinks:
    - "https://www.ithome.com/0/975/816.htm"
---

# 微软研究院推出开源可视化中间语言 Flint，让 AI 智能体"一句话生成专业图表"

## 新闻事实

微软研究院与中国人民大学 IDEAS Lab 联合推出开源可视化中间语言 Flint，让 AI 智能体通过一句话即可生成 Vega-Lite、ECharts、Chart.js 的可渲染图表。

## 原文要点

- 团队同步发布 flint-chart-mcp 服务器，支持 MCP 协议的 AI 智能体在对话中直接创建和预览图表。
- IT之家 7 月 12 日消息，微软研究院联合中国人民大学 IDEAS Lab 联合推出了开源可视化中间语言 Flint，可以让 AI 智能体“一句话生成” Vega-Lite、ECharts、 Chart.
- 据介绍，现有可视化库通常提供大量配置选项，若采用精简配置，生成的图表未必适合数据内容；若要求大语言模型直接输出完整配置，又容易因参数过多而出现冲突、遗漏或不一致。
- 因此 Flint 在设计之初将图表意图与底层可视化库实现分离，以减少 AI 生成配置时的复杂度。

## 价值描述

评测中，Flint 在 GPT-5.1、GPT-5-mini 和 GPT-4.1 三组测试中均获得比直接生成 Vega-Lite 配置的方案 DirectVL 更高的综合评分。

## 可见原文片段

数据部分可标注字段的语义类型，例如年月、价格、百分比、利润、国家或排名等；图表部分则用于指定图表类型，确认各字段映射到 X 轴、Y 轴、颜色、大小或分面（Facet）等视觉元素。

## 证据边界

没有变化前后流程线索
