---
id: SIG-20260704-A08
type: signal_card
signal_type: product_service
title: "在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半"
date: 2026-07-04
status: published
source_title: "在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半"
asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-04T04:51:45.614Z
updated_at: 2026-07-04T04:51:45.614Z

raw_refs: ["R-013"]
pool_refs: ["P-013"]
primary_raw:
  raw_ref: R-013
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-04/r-013-在-amd-mi355x-上运行的-glm5-2-每节点吞吐量达-2626-tok-s-成本仅为-blackwell-的不到一半.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-04/r-013-在-amd-mi355x-上运行的-glm5-2-每节点吞吐量达-2626-tok-s-成本仅为-blackwell-的不到一半.json"
  source_url: "https://www.wafer.ai/blog/glm52-amd"
  full_text_hash: "fbdd025066f9383b"
  source_level: B
  extraction_quality: high
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - core_pool
    - user_feedback_pool
  raw_qc_decision: allow
  importance_type: important_product_or_service
  importance_score: 5

formal_tags:
  track: ["track-ai-infra"]
  function: []
  scenario: []
  customer: []
  evidence: ["evidence-pricing-cost", "evidence-customer-metric"]
opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["sales_team"]
  team_or_function: ["sales"]
  specific_task: ["sales_lead_research"]
  business_action: ["customer_deployment", "product_launch", "pricing_change"]
  product_form: []
  delivery_model: []
  pain_or_constraint: ["api_cost_spike"]
  adoption_evidence: []
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半 在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半 原始来源标题显示：在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半。"
  missing_fields: ["product_form", "adoption_evidence", "delivery_model"]

signal_owner: "Wafer"

frontend:
  displayTitle: "在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半"
  sourceLinks:
    - "https://www.wafer.ai/blog/glm52-amd"
---

# 在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半

## 新闻事实

原始来源标题显示：在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半。

## 原文要点

- Wafer 团队在 AMD MI355X 上优化 GLM5.2，使用 AMD Quark 将模型从 bf16 量化至 MXFP4（精度无损，GPQA-Diamond、tau2、GSM8K 指标与 FP8 基线持平），并以 sglang 为推理引擎。通过修复 MTP 头的模块前缀不匹配、添加 ROCm 编译宏，成功启用推测解码，单流吞吐达 213 tok/s（10k 输入 / 1.5k 输出）。在 20k 输入 / 1k 输出、60% ...
- 原文称，With frontier models being released almost every other week — Claude Fable, GLM5.

## 价值描述

原文称，With frontier models being released almost every other week — Claude Fable, GLM5.

## 可见原文片段

原始来源标题显示：在 AMD MI355X 上运行的 GLM5.2，每节点吞吐量达 2626 tok/s，成本仅为 Blackwell 的不到一半。

## 证据边界

证据边界：缺失项作为内部复核线索保留；公开判断只采用原文标题、摘录和来源链接。
