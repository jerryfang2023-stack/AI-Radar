---
id: SIG-20260718-A12
type: signal_card
signal_type: product_service
title: "Zyphra 发布 ZUNA1.1：Apache 2.0 许可的 EEG 基础模型，支持 0.5 至 30 秒可变长度输入"
date: 2026-07-18
status: published
source_title: "Zyphra 发布 ZUNA1.1：Apache 2.0 许可的 EEG 基础模型，支持 0.5 至 30 秒可变长度输入"
asset_level: frontstage
title_translation_status: not_required
title_translation_method: source_title
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-18T02:44:14.529Z
updated_at: 2026-07-18T02:44:14.529Z

raw_refs: ["R-034"]
pool_refs: ["P-034"]
primary_raw:
  raw_ref: R-034
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-18/r-034-zyphra-发布-zuna1-1-apache-2-0-许可的-eeg-基础模型-支持-0-5-至-30-秒可变长度输入.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-18/r-034-zyphra-发布-zuna1-1-apache-2-0-许可的-eeg-基础模型-支持-0-5-至-30-秒可变长度输入.json"
  source_url: "https://www.marktechpost.com/2026/07/17/zyphra-releases-zuna1-1-an-apache-2-0-eeg-foundation-model-with-variable-length-inputs-from-0-5-to-30-seconds"
  full_text_hash: "ee2eb8255cda096a"
  source_level: B
  extraction_quality: high
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: important_product_or_service
  importance_score: 5

formal_tags:
  track: ["track-ai-models", "track-enterprise-data", "track-ai-infra"]
  function: []
  scenario: ["scenario-knowledge-base"]
  customer: []
  evidence: ["evidence-product-launch"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: []
  team_or_function: []
  specific_task: []
  business_action: ["customer_deployment", "product_launch", "open_source_release"]
  product_form: []
  delivery_model: []
  pain_or_constraint: ["evaluation_gap"]
  adoption_evidence: []
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "Zyphra 发布 ZUNA1.1：Apache 2.0 许可的 EEG 基础模型，支持 0.5 至 30 秒可变长度输入 Zyphra 发布 ZUNA1.1：Apache 2.0 许可的 EEG 基础模型，支持 0.5 至 30 秒可变长度输入 Zyphra 发布 ZUNA1.1，一个 3.8 亿参数的掩码扩散自编码器，用于头皮 EEG 信号。"
  missing_fields: ["buyer_or_user", "specific_task", "product_form", "adoption_evidence", "delivery_model"]

signal_owner: "Zyphra"

frontend:
  displayTitle: "Zyphra 发布 ZUNA1.1：Apache 2.0 许可的 EEG 基础模型，支持 0.5 至 30 秒可变长度输入"
  sourceLinks:
    - "https://www.marktechpost.com/2026/07/17/zyphra-releases-zuna1-1-an-apache-2-0-eeg-foundation-model-with-variable-length-inputs-from-0-5-to-30-seconds"
---

# Zyphra 发布 ZUNA1.1：Apache 2.0 许可的 EEG 基础模型，支持 0.5 至 30 秒可变长度输入

## 新闻事实

Zyphra 发布 ZUNA1.1，一个 3.8 亿参数的掩码扩散自编码器，用于头皮 EEG 信号。

## 原文要点

- 相比固定 5 秒输入的 ZUNA1，新模型支持 0.5 至 30 秒可变长度输入，并采用 4D 旋转位置编码实现任意通道布局的降噪、重建与上采样。
- 新模型支持 0.5 至 30 秒可变长度输入，并采用 4D 旋转位置编码实现任意通道布局的降噪
- 并采用 4D 旋转位置编码实现任意通道布局的降噪，重建与上采样。
- 新模型支持 0.5 至 30 秒可变长度输入，并采用 4D 旋转位置编码实现任意通道布局的降噪、重建与上采样。

## 价值描述

训练数据从约 200 万通道小时扩展至约 350 万通道小时，在重建 NMSE 上持平或优于前代，并在区域电极删除测试中超越经典球面样条插值。

## 可见原文片段

The EEG foundation model reconstructs, denoises, and upsamples data across arbitrary channel layouts.

## 证据边界

证据边界：缺失项作为内部复核线索保留；公开判断只采用原文标题、摘录和来源链接。
