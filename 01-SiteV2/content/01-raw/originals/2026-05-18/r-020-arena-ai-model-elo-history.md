---
schema_version: raw-evidence-v2
raw_id: R-020
title: "Arena AI Model ELO History"
original_url: "https://mayerwin.github.io/AI-Arena-History/"
canonical_url: "https://mayerwin.github.io/AI-Arena-History"
source_name: "Hacker News"
source_type: web
source_level: B
acquisition_source_level: ""
acquisition_channel: hn
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-05-14T03:19:05Z"
collected_at: 2026-05-18T07:52:02.251Z
language: mixed
full_text_hash: 077d62522b3048e4
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-18/r-020-arena-ai-model-elo-history.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-18/r-020-arena-ai-model-elo-history.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-clean-text
extraction_quality: medium
has_full_text: true
content_length: 2382
fetch_error: ""
source_volatility: high
community_name: "Hacker News"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: ""
discovery_record: null
source_role: primary_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 90e55533f0a67fb7
content_hash: 077d62522b3048e4
semantic_hash: 20ab8fe80f05608b
duplicate_of: ""
first_seen_at: "2026-05-14T03:19:05Z"
last_seen_at: 2026-05-18T07:52:02.251Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":false,"daily_observation":true,"heatmap":true,"briefing":false,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["core_pool","emerging_pool","user_feedback_pool"]
guanlan_scores: {"commercial_value":3,"novelty":3,"evidence_strength":3,"case_richness":4,"trend_relevance":3,"guanlan_relevance":4,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News","GitHub"],"products":["gemini","chatgpt","Claude"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":["计费 / 预算管理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","财务 / 预算"],"numbers":["70","59","01","02","2026"],"quotes":[]}
evidence_seed: {"company_actions":["70 points / 59 comments / query=open source AI evals","Arena AI Model Elo History Auto Arena AI Model Elo History Tracking the public Elo lifecycle of flagship AI models over time to reveal potential nerfing.","Show All Models Why this exists AI labs frequently update their models post-launch, and users regularly report perceived \"nerfs\": excessive quantization (to save compute costs), aggressive censorship, or behavioral degradation."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"company_action","text":"70 points / 59 comments / query=open source AI evals","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Arena AI Model Elo History Auto Arena AI Model Elo History Tracking the public Elo lifecycle of flagship AI models over time to reveal potential nerfing.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"product_update","text":"Show All Models Why this exists AI labs frequently update their models post-launch, and users regularly report perceived \"nerfs\": excessive quantization (to save compute costs), aggressive censorship, or behavioral degradation.","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"This chart plots each flagship's public Elo lifecycle on one timeline, so any such trend would be visible at a glance.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Data is fetched daily from the official Arena AI Leaderboard Dataset on Hugging Face, built from thousands of blind, crowdsourced head-to-head human votes.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"It's an imperfect lens (see caveats below) but the most consistent long-running signal currently available.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Arena AI Model ELO History

## clean_text

Arena AI Model Elo History
Auto
Arena AI Model Elo History
Tracking the public Elo lifecycle of flagship AI models over time to reveal potential nerfing.
Show All Models
Why this exists
AI labs frequently update their models post-launch, and users regularly report perceived "nerfs": excessive quantization (to save compute costs), aggressive censorship, or behavioral degradation. This chart plots each flagship's public Elo lifecycle on one timeline, so any such trend would be visible at a glance.
Data is fetched daily from the official Arena AI Leaderboard Dataset on Hugging Face, built from thousands of blind, crowdsourced head-to-head human votes. It's an imperfect lens (see caveats below) but the most consistent long-running signal currently available.
How the chart works
Each lab gets exactly one curve , tracking that lab's highest-rated flagship-eligible model at every point in time, not just the most recently announced one.
If a lab ships a mid-tier model (e.g. Sonnet) while a higher-tier one (e.g. Opus) still ranks above it, the curve stays on Opus.
Inference-mode variants (suffixes like -thinking , -reasoning , -high ) are merged into the parent so the curve doesn't flip-flop between modes.
New releases appear as labeled marker points, often with a jump in score.
Downward trends between releases are visible too, but read the caveats below before treating them as proof.
Caveats
01
Web UIs vs. API
Arena tests models via API endpoints, i.e. the "raw" model. Consumer chat interfaces (gemini.com, chatgpt.com, etc.) add system prompts, safety filters, and UI wrappers not present in the raw API, and providers may silently switch to quantized (lower-precision) versions under load. Perceived "nerfing" in those products may not show up here.
02
Elo is relative
Ratings shift against the rest of the leaderboard. When stronger models enter (or peers improve), an unchanged model's Elo can drift down anyway; conversely, if every model regresses in parallel, Elo won't reveal it. A fixed-benchmark longitudinal dataset would be cleaner, but no such public archive seems to exist.
Related: for a Claude-only view, marginlab.ai's Claude Code tracker follows Claude specifically and can surface signals an Arena-wide Elo view misses. PRs welcome for web-interface evaluations or other longitudinal trackers worth linking.
&copy; 2026 Erwin Mayer
View on GitHub

## full_text

Arena AI Model Elo History
Auto
Arena AI Model Elo History
Tracking the public Elo lifecycle of flagship AI models over time to reveal potential nerfing.
Show All Models
Why this exists
AI labs frequently update their models post-launch, and users regularly report perceived "nerfs": excessive quantization (to save compute costs), aggressive censorship, or behavioral degradation. This chart plots each flagship's public Elo lifecycle on one timeline, so any such trend would be visible at a glance.
Data is fetched daily from the official Arena AI Leaderboard Dataset on Hugging Face, built from thousands of blind, crowdsourced head-to-head human votes. It's an imperfect lens (see caveats below) but the most consistent long-running signal currently available.
How the chart works
Each lab gets exactly one curve , tracking that lab's highest-rated flagship-eligible model at every point in time, not just the most recently announced one.
If a lab ships a mid-tier model (e.g. Sonnet) while a higher-tier one (e.g. Opus) still ranks above it, the curve stays on Opus.
Inference-mode variants (suffixes like -thinking , -reasoning , -high ) are merged into the parent so the curve doesn't flip-flop between modes.
New releases appear as labeled marker points, often with a jump in score.
Downward trends between releases are visible too, but read the caveats below before treating them as proof.
Caveats
01
Web UIs vs. API
Arena tests models via API endpoints, i.e. the "raw" model. Consumer chat interfaces (gemini.com, chatgpt.com, etc.) add system prompts, safety filters, and UI wrappers not present in the raw API, and providers may silently switch to quantized (lower-precision) versions under load. Perceived "nerfing" in those products may not show up here.
02
Elo is relative
Ratings shift against the rest of the leaderboard. When stronger models enter (or peers improve), an unchanged model's Elo can drift down anyway; conversely, if every model regresses in parallel, Elo won't reveal it. A fixed-benchmark longitudinal dataset would be cleaner, but no such public archive seems to exist.
Related: for a Claude-only view, marginlab.ai's Claude Code tracker follows Claude specifically and can surface signals an Arena-wide Elo view misses. PRs welcome for web-interface evaluations or other longitudinal trackers worth linking.
&copy; 2026 Erwin Mayer
View on GitHub

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   70 points / 59 comments / query=open source AI evals

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   Arena AI Model Elo History Auto Arena AI Model Elo History Tracking the public Elo lifecycle of flagship AI models over time to reveal potential nerfing.

3. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=medium
   Show All Models Why this exists AI labs frequently update their models post-launch, and users regularly report perceived "nerfs": excessive quantization (to save compute costs), aggressive censorship, or behavioral degradation.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   This chart plots each flagship's public Elo lifecycle on one timeline, so any such trend would be visible at a glance.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   Data is fetched daily from the official Arena AI Leaderboard Dataset on Hugging Face, built from thousands of blind, crowdsourced head-to-head human votes.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   It's an imperfect lens (see caveats below) but the most consistent long-running signal currently available.

## business_elements

- companies: Hacker News, GitHub
- products: gemini, chatgpt, Claude
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 计费 / 预算管理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 财务 / 预算
- numbers: 70, 59, 01, 02, 2026
- quotes: 暂无公开信息

## evidence_seed

- company_actions: 70 points / 59 comments / query=open source AI evals / Arena AI Model Elo History Auto Arena AI Model Elo History Tracking the public Elo lifecycle of flagship AI models over time to reveal potential nerfing. / Show All Models Why this exists AI labs frequently update their models post-launch, and users regularly report perceived "nerfs": excessive quantization (to save compute costs), aggressive censorship, or behavioral degradation.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- commercial_value: 3
- novelty: 3
- evidence_strength: 3
- case_richness: 4
- trend_relevance: 3
- guanlan_relevance: 4
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: false
- daily_observation: true
- heatmap: true
- briefing: false
- emerging_pool: true
- user_feedback_pool: true
- watchlist: true

## pool_routes

- core_pool
- emerging_pool
- user_feedback_pool

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: none
- source_role: primary_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

70 points / 59 comments / query=open source AI evals

## 采集备注

该条目由 hn 发现，事实来源等级初判为 B。S/A/B/C/D 只判断事实可靠度，不判断商业价值；M 只表示 acquisition_source_level，即 AI HOT / 搜索聚合等采集通道。M 级通道必须回源；HN / Reddit / X 等 C 级社区材料可用于讨论升温、用户反馈和早期观察，但进入事实主证据前必须寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。创始人 / 高管 / 项目方原帖可作为 S 级一手来源，但高波动平台必须保存快照和抓取时间。
