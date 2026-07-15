---
id: SIG-20260715-A21
type: signal_card
signal_type: product_service
title: "腾讯混元发布 1bit 与 4bit 量化版 Hy3 模型，旗舰 AI 模型可单卡本地运行"
date: 2026-07-15
status: published
source_title: "腾讯混元发布 1bit 与 4bit 量化版 Hy3 模型，旗舰 AI 模型可单卡本地运行"
asset_level: frontstage
title_translation_status: not_required
title_translation_method: source_title
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-15T08:18:16.079Z
updated_at: 2026-07-15T08:18:16.079Z

raw_refs: ["R-093"]
pool_refs: ["P-093"]
primary_raw:
  raw_ref: R-093
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-15/r-093-腾讯混元发布-1bit-与-4bit-量化版-hy3-模型-旗舰-ai-模型可单卡本地运行.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-15/r-093-腾讯混元发布-1bit-与-4bit-量化版-hy3-模型-旗舰-ai-模型可单卡本地运行.json"
  source_url: "https://www.ithome.com/0/976/642.htm"
  full_text_hash: "0535372d0752e27e"
  source_level: B
  extraction_quality: medium
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: important_product_or_service
  importance_score: 4

formal_tags:
  track: ["track-ai-coding", "track-ai-agent", "track-ai-infra"]
  function: ["function-engineering"]
  scenario: []
  customer: ["customer-developer-team"]
  evidence: ["evidence-customer-metric", "evidence-product-launch"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["engineering_team"]
  team_or_function: ["engineering"]
  specific_task: ["internal_tool_building"]
  business_action: ["customer_deployment", "product_launch", "open_source_release"]
  product_form: []
  delivery_model: []
  pain_or_constraint: []
  adoption_evidence: ["customer_metric"]
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "腾讯混元发布 1bit 与 4bit 量化版 Hy3 模型，旗舰 AI 模型可单卡本地运行 腾讯混元发布 1bit 与 4bit 量化版 Hy3 模型，旗舰 AI 模型可单卡本地运行 腾讯混元将 295B 参数的旗舰模型 Hy3 量化至 1bit 与 4bit，并打包成 GGUF 格式。"
  missing_fields: ["product_form", "delivery_model"]

signal_owner: "腾讯混元"

frontend:
  displayTitle: "腾讯混元发布 1bit 与 4bit 量化版 Hy3 模型，旗舰 AI 模型可单卡本地运行"
  sourceLinks:
    - "https://www.ithome.com/0/976/642.htm"
---

# 腾讯混元发布 1bit 与 4bit 量化版 Hy3 模型，旗舰 AI 模型可单卡本地运行

## 新闻事实

腾讯混元将 295B 参数的旗舰模型 Hy3 量化至 1bit 与 4bit，并打包成 GGUF 格式。

## 原文要点

- 1bit 版本（IQ1_M）将权重从 598 GB 压缩至 85.5 GiB，单张 96GB 推理显卡即可部署；4bit 版本（Q4_K_M）体积 169.9 GiB，需两张显卡。
- 团队还开发了 llama.cpp 的 MTP 投机解码 patch，开启后 1bit 版本解码速度提升约 50%，4bit 版本提升接近 60%。
- 此外还提供 GPTQ Int4 版本，可通过 vLLM 部署。
- IT之家 7 月 14 日消息，今日腾讯混元发文表示，Hy3 上线并开源后，社区一直在呼吁量化版本，希望单卡跑参数量达 295B 的 Hy3。

## 价值描述

量化版本在 Agent 能力、多语言代码、工具调用和长文理解等任务上贴近满血模型。

## 可见原文片段

团队针对开源社区需求，把 Hy3 的权重量化到 1bit 与 4bit 并打包成 GGUF，配合 llama.

## 证据边界

证据边界：本卡只使用已保留的 Raw / Pool 原文标题、摘录和来源链接。
