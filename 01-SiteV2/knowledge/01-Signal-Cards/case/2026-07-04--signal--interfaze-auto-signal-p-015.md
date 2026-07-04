---
id: SIG-20260704-A02
type: signal_card
signal_type: case
title: "Interfaze 开源 diffusion-gemma-asr-small，基于 DiffusionGemma 并行去噪解码器的多语言扩散 ASR 模型"
date: 2026-07-04
status: published
source_title: "Interfaze 开源 diffusion-gemma-asr-small，基于 DiffusionGemma 并行去噪解码器的多语言扩散 ASR 模型"
asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-04T04:51:45.614Z
updated_at: 2026-07-04T04:51:45.614Z

raw_refs: ["R-015"]
pool_refs: ["P-015"]
primary_raw:
  raw_ref: R-015
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-04/r-015-interfaze-开源-diffusion-gemma-asr-small-基于-diffusiongemma-并行去噪解码器的多语言扩散.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-04/r-015-interfaze-开源-diffusion-gemma-asr-small-基于-diffusiongemma-并行去噪解码器的多语言扩散.json"
  source_url: "https://www.marktechpost.com/2026/07/02/interfaze-ships-diffusion-gemma-asr-small-an-open-source-diffusion-asr-model-transcribing-six-languages-via-diffusiongemmas-parallel-denoising-decoder"
  full_text_hash: "2e7fbf4bbb7df9a4"
  source_level: B
  extraction_quality: high
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: important_vertical_solution
  importance_score: 5

formal_tags:
  track: ["track-ai-agent", "track-ai-infra", "track-ai-customer-service"]
  function: ["function-customer-service"]
  scenario: ["scenario-customer-ticket"]
  customer: []
  evidence: ["evidence-customer-adoption"]
  stage: []
  region: []
  source: []

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["sales_team"]
  team_or_function: ["sales"]
  specific_task: ["sales_lead_research"]
  business_action: ["customer_deployment", "open_source_release"]
  product_form: ["model_gateway"]
  delivery_model: ["open_source_commercial"]
  pain_or_constraint: ["latency_sensitive"]
  adoption_evidence: ["customer_metric"]
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "[{\"type\":\"number\",\"text\":\"Interfaze 开源了 diffusion-gemma-asr-small，据称是首个开源多语言扩散 ASR 模型。该模型使用 DiffusionGemma 的离散扩散解码器（26B MoE 骨干，4B 激活参数，128 专家 top-8 路由）进行非自回归语音转文本。仅训练约 42M 参数适配器，冻结 backbone；采用 frozen whisper-small 编码器提取..."
  missing_fields: []

signal_owner: "Interfaze"

frontend:
  displayTitle: "Interfaze 开源 diffusion-gemma-asr-small，基于 DiffusionGemma 并行去噪解码器的多语言扩散 ASR 模型"
  sourceLinks:
    - "https://www.marktechpost.com/2026/07/02/interfaze-ships-diffusion-gemma-asr-small-an-open-source-diffusion-asr-model-transcribing-six-languages-via-diffusiongemmas-parallel-denoising-decoder"
---

# Interfaze 开源 diffusion-gemma-asr-small，基于 DiffusionGemma 并行去噪解码器的多语言扩散 ASR 模型

## 新闻事实

原始来源标题显示：Interfaze 开源 diffusion-gemma-asr-small，基于 DiffusionGemma 并行去噪解码器的多语言扩散 ASR 模型。

## 原文要点

- Interfaze 开源了 diffusion-gemma-asr-small，据称是首个开源多语言扩散 ASR 模型。该模型使用 DiffusionGemma 的离散扩散解码器（26B MoE 骨干，4B 激活参数，128 专家 top-8 路由）进行非自回归语音转文本。仅训练约 42M 参数适配器，冻结 backbone；采用 frozen whisper-small 编码器提取 1500 帧 768 维特征，经可训练投影器（约 ...

## 价值描述

Interfaze 开源了 diffusion-gemma-asr-small，据称是首个开源多语言扩散 ASR 模型。该模型使用 DiffusionGemma 的离散扩散解码器（26B MoE 骨干，4B 激活参数，128 专家 top-8 路由）进行非自回归语音转文本。仅训练约 42M 参数适配器，冻结 backbone；采用 frozen whisper-small 编码器提取 1500 帧 768 维特征，经可训练投影器（约 ...

## 可见原文片段

原始来源标题显示：Interfaze 开源 diffusion-gemma-asr-small，基于 DiffusionGemma 并行去噪解码器的多语言扩散 ASR 模型。

## 证据边界

证据边界：缺失项作为内部复核线索保留；公开判断只采用原文标题、摘录和来源链接。
