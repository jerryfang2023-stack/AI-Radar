---
id: SIG-20260521-07
type: signal_card
signal_type: case
title: "Choco 部署 OpenAI Agent 处理食品分销订单"
date: 2026-05-21
status: draft
asset_level: candidate
evidence_gate: core_evidence_passed
fact_draft_gate: passed
frontend_copy_gate: passed
cardcopy_gate: passed
created_at: 2026-05-21T15:17:11.953Z
updated_at: 2026-05-21T15:17:11.953Z

raw_refs: ["R-085"]
pool_refs: ["P-048"]
primary_raw:
  raw_ref: R-085
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-05-21/r-085-choco-automates-food-distribution-with-ai-agents.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-05-21/r-085-choco-automates-food-distribution-with-ai-agents.json"
  source_url: "https://openai.com/index/choco/"
  full_text_hash: "aeb0d9ad2715c26a"
  source_level: S
  extraction_quality: high
  has_full_text: true
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: important_vertical_solution
  importance_score: 5

event: "OpenAI 案例显示，Choco 用 OrderAgent 和 VoiceAgent 减少分销商人工录单。"
business_meaning: "影响的是订单录入、电话沟通、分销商人力和供应链响应速度。"
why_selected: "它落在传统分销行业的订单流，不是通用聊天，而是具体运营任务。"
signal_owner: "Choco / OpenAI"
watch_reason: "继续看 Choco 是否披露订单量、错误率和分销商采用范围。"

frontend:
  displayTitle: "Choco 部署 OpenAI Agent 处理食品分销订单"
  eventLine: "OpenAI 案例显示，Choco 用 OrderAgent 和 VoiceAgent 减少分销商人工录单。"
  whyWatch: "它落在传统分销行业的订单流，不是通用聊天，而是具体运营任务。"
  businessMeaning: "影响的是订单录入、电话沟通、分销商人力和供应链响应速度。"
  evidenceBoundary: "OpenAI 案例确认应用方向，仍需观察第三方指标和客户侧复盘。"
  watchWindow: "继续看 Choco 是否披露订单量、错误率和分销商采用范围。"
  sourceExcerpt: "Choco embedded OpenAI APIs at the core of its platform to power a new generation of AI-native products. The company introduced OrderAgent, which processes multimodal inputs—including emails, SMS, images, and documents—and converts them into structured, ERP-ready orders."
  sourceExcerptType: "original_excerpt"
  sourceExcerptSource: "OpenAI"
  sourceLinks:
    - "https://openai.com/index/choco/"

formal_tags:
  track: ["track-enterprise-workflow"]
  function: ["function-operations"]
  scenario: ["scenario-logistics-supply-chain"]
  customer: ["customer-enterprise"]
  evidence: ["evidence-customer-adoption"]
  stage: []
  region: []
  source: ["source-first-party"]
  opinion: []

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["operations_team"]
  team_or_function: ["operations"]
  specific_task: ["logistics_coordination"]
  business_action: ["customer_deployment", "failure_postmortem"]
  product_form: []
  delivery_model: []
  pain_or_constraint: []
  adoption_evidence: []
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "Choco 部署 OpenAI Agent 处理食品分销订单 Choco automates food distribution with AI agents Choco uses OpenAI-powered agents to automate food distribution order workflows."
  missing_fields: ["product_form", "adoption_evidence", "delivery_model"]
---

# Choco 部署 OpenAI Agent 处理食品分销订单

## 信号底稿

谁：Choco / OpenAI。

做了什么：OpenAI 案例显示，Choco 用 OrderAgent 和 VoiceAgent 减少分销商人工录单。

证据是什么：来源为 https://openai.com/index/choco/，对应本地证据 R-085，材料已保留全文、哈希和出处。

缺什么：OpenAI 案例确认应用方向，仍需观察第三方指标和客户侧复盘。

## 发生了什么

OpenAI 案例显示，Choco 用 OrderAgent 和 VoiceAgent 减少分销商人工录单。

## 为什么值得看

它落在传统分销行业的订单流，不是通用聊天，而是具体运营任务。

## 商业含义

影响的是订单录入、电话沟通、分销商人力和供应链响应速度。

## 证据边界

OpenAI 案例确认应用方向，仍需观察第三方指标和客户侧复盘。

## 继续观察

继续看 Choco 是否披露订单量、错误率和分销商采用范围。
