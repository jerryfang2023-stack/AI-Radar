---
id: SIG-20260728-A25
type: signal_card
signal_type: product_service
title: "ESP32-AI 项目在8MB PSRAM上运行2890万参数模型"
date: 2026-07-28
status: published
source_title: "ESP32-AI 项目在8MB PSRAM上运行2890万参数模型"
asset_level: frontstage
title_translation_status: not_required
title_translation_method: source_title
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-28T06:19:54.961Z
updated_at: 2026-07-28T06:19:54.961Z

raw_refs: ["R-080"]
pool_refs: ["P-079"]
primary_raw:
  raw_ref: R-080
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-28/r-080-esp32-ai-项目在8mb-psram上运行2890万参数模型.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-28/r-080-esp32-ai-项目在8mb-psram上运行2890万参数模型.json"
  source_url: "https://www.ithome.com/0/982/494.htm"
  full_text_hash: "c2592318ab05369e"
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
  track: ["track-ai-coding", "track-enterprise-data", "track-ai-infra"]
  function: ["function-engineering"]
  scenario: ["scenario-knowledge-base"]
  customer: ["customer-developer-team"]
  evidence: ["evidence-product-launch"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["engineering_team"]
  team_or_function: ["engineering"]
  specific_task: ["internal_tool_building"]
  business_action: ["customer_deployment", "product_launch"]
  product_form: []
  delivery_model: []
  pain_or_constraint: ["latency_sensitive"]
  adoption_evidence: []
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "ESP32-AI 项目在8MB PSRAM上运行2890万参数模型 ESP32-AI 项目在8MB PSRAM上运行2890万参数模型 乌克兰开发者Slava S发布ESP32-AI项目，在乐鑫ESP32-S3开发板上成功部署2890万个参数的本地AI模型。"
  missing_fields: ["product_form", "adoption_evidence", "delivery_model"]

signal_owner: "ESP32"

frontend:
  displayTitle: "ESP32-AI 项目在8MB PSRAM上运行2890万参数模型"
  sourceLinks:
    - "https://www.ithome.com/0/982/494.htm"
---

# ESP32-AI 项目在8MB PSRAM上运行2890万参数模型

## 新闻事实

乌克兰开发者Slava S发布ESP32-AI项目，在乐鑫ESP32-S3开发板上成功部署2890万个参数的本地AI模型。

## 原文要点

- 该模型采用分层嵌入技术，经4-bit量化后文件大小为14.9MB，每生成1个Token只需读取嵌入表中的少量数据。
- 配备 512KB 的 SRAM（片上高速存储，访问周期仅需 1 个 CPU 时钟）
- 访问速度取决于 SPI 时钟配置）和 16MB 的闪存，由于内存容量受限

## 价值描述

IT之家注：ESP32-S3 开发板由乐鑫推出，配备 512KB 的 SRAM（片上高速存储，访问周期仅需 1 个 CPU 时钟）、8MB 的 PSRAM（通过 SPI 总线扩展的 8MB 内存，访问速度取决于 SPI 时钟配置）和 16MB 的闪存，由于内存容量受限，此前 Dave Bennett 针对该开发板部署 AI 参数上限为 26 万个。

## 可见原文片段

Slava S 采用 Google Gemma 使用的 P er-Layer Embeddings（分层嵌入）技术。

## 证据边界

证据边界：本卡只使用已保留的 Raw / Pool 原文标题、摘录和来源链接。
