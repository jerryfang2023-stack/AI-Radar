---
schema_version: raw-evidence-v2
raw_id: R-104
title: "Claude Design 与 Claude Code 联动示例：设计变更自动改代码"
original_url: "https://x.com/dotey/status/2065940342264770589"
canonical_url: "https://x.com/dotey/status/2065940342264770589"
source_name: "X：宝玉 (@dotey)"
source_type: community
source_level: C
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-13T23:32:15.000Z"
collected_at: 2026-06-14T04:27:51.571Z
language: mixed
full_text_hash: bbf3f4888b86f8d2
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-14/r-104-claude-design-与-claude-code-联动示例-设计变更自动改代码.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-14/r-104-claude-design-与-claude-code-联动示例-设计变更自动改代码.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 69
extractor_diagnostics: {"readability_score":69,"text_length":2755,"paragraph_count":14,"sentence_count":4,"boilerplate_hits":1,"symbol_ratio":0.0221,"method":"main"}
has_full_text: true
content_length: 2755
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"bbf3f4888b86f8d2","missing":[]}
source_volatility: high
community_name: "X：宝玉 (@dotey)"
capture_scope: visible_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: community_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Claude Design 与 Claude Code 联动示例：设计变更自动改代码","discovery_summary":"宝玉分享了 Claude Design 与 Claude Code 联动的实际案例：在 Claude Design 上修改字幕编辑器 UI 设计稿后，导出 zip 并用 git diff 查看变更，然后通过一句提示让 Claude Code 参考设计目录变更自动修改 Swift 代码，全程只需手动同步设计文件。他解释为何 Codex 没有类似产品：Claude Design 依赖 Claude Opus 4.8 模型同时具备 UI/UX 设计和系统架构设计能力，能一次性交付可交互原型（含数据结构、状态管理、交互逻辑）；而 GPT-5.5 还做不到。Harness 层可复制，模型层才是关键门槛。","source_name":"X：宝玉 (@dotey)","origin_url":"https://x.com/dotey/status/2065940342264770589","discovered_at":"2026-06-14T04:21:16.512Z","rank_on_page":30,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: d455f6a19e82eec9
content_hash: bbf3f4888b86f8d2
semantic_hash: 54b012db394c4e4f
duplicate_of: ""
first_seen_at: "2026-06-13T23:32:15.000Z"
last_seen_at: 2026-06-14T04:27:51.571Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["user_feedback_pool","watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":[],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["X","宝玉 (@dotey)","Anthropic"],"products":["Claude","Codex","GPT-5","Agent"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":["部署 / 集成交付"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["4.8","5.5","1","4","9","11","32","13"],"quotes":[]}
evidence_seed: {"company_actions":["Post Log in Sign up Post 宝玉 @dotey 举一个具体的用 Claude Design 更新设计和代码的例子 我有一个视频字幕编辑器工具，是 Claude Design 做的设计，之前标题文字和下面的信息是放在一行，标题一长就放不下，于是我就让它变成两行。","图1 是我在设计稿上做的修改，修改好了后导出下载 zip 文件，放到项目中，用 git diff 的提示给 Claude Code： > 参考设计稿 design 目录下的相关变更，对 UI 进行变更 Claude 自己通过 git diff 去分析变更，然后找出所有设计稿修改了的位置，自己帮我修改了相应的 Swift 代码，任务完成！","（图4是修改后的效果） 全程我主要是在 Claude Design 上修改，然后需要手工去同步一下。"],"case_details":["宝玉分享了 Claude Design 与 Claude Code 联动的实际案例：在 Claude Design 上修改字幕编辑器 UI 设计稿后，导出 zip 并用 git diff 查看变更，然后通过一句提示让 Claude Code 参考设计目录变更自动修改 Swift 代码，全程只需手动同步设计文件。他解释为何 Codex 没有类似产品：Claude Design 依赖 Claude Opus 4.8 模型同时具备 UI/UX 设计和系统架构设计能力，能一次性交付可交互原型（含数据结构、状态管理、交互逻辑）；而 GPT-5.5 还做不到。Harness 层可复制，模型层才是关键门槛。"],"workflow_changes":[],"before_after_clues":["可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"case_detail","text":"宝玉分享了 Claude Design 与 Claude Code 联动的实际案例：在 Claude Design 上修改字幕编辑器 UI 设计稿后，导出 zip 并用 git diff 查看变更，然后通过一句提示让 Claude Code 参考设计目录变更自动修改 Swift 代码，全程只需手动同步设计文件。他解释为何 Codex 没有类似产品：Claude Design 依赖 Claude Opus 4.8 模型同时具备 UI/UX 设计和系统架构设计能力，能一次性交付可交互原型（含数据结构、状态管理、交互逻辑）；而 GPT-5.5 还做不到。Harness 层可复制，模型层才是关键门槛。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"product_update","text":"Post Log in Sign up Post 宝玉 @dotey 举一个具体的用 Claude Design 更新设计和代码的例子 我有一个视频字幕编辑器工具，是 Claude Design 做的设计，之前标题文字和下面的信息是放在一行，标题一长就放不下，于是我就让它变成两行。","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"图1 是我在设计稿上做的修改，修改好了后导出下载 zip 文件，放到项目中，用 git diff 的提示给 Claude Code： > 参考设计稿 design 目录下的相关变更，对 UI 进行变更 Claude 自己通过 git diff 去分析变更，然后找出所有设计稿修改了的位置，自己帮我修改了相应的 Swift 代码，任务完成！","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"（图4是修改后的效果） 全程我主要是在 Claude Design 上修改，然后需要手工去同步一下。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"宝玉 @dotey 9h 为啥 Codex 还不推出类似 Codex Design 的产品？","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"Anthropic 最近推出了 Claude Design，是我除了编程之外用得最多的 Agent，也推荐过很多次。","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Claude Design 与 Claude Code 联动示例：设计变更自动改代码

## clean_text

Post
Log in Sign up
Post
宝玉
@dotey
举一个具体的用 Claude Design 更新设计和代码的例子
我有一个视频字幕编辑器工具，是 Claude Design 做的设计，之前标题文字和下面的信息是放在一行，标题一长就放不下，于是我就让它变成两行。
图1 是我在设计稿上做的修改，修改好了后导出下载 zip 文件，放到项目中，用 git diff 的提示给 Claude Code：
> 参考设计稿 design 目录下的相关变更，对 UI 进行变更
Claude 自己通过 git diff 去分析变更，然后找出所有设计稿修改了的位置，自己帮我修改了相应的 Swift 代码，任务完成！（图4是修改后的效果）
全程我主要是在 Claude Design 上修改，然后需要手工去同步一下。
宝玉
@dotey
9h
为啥 Codex 还不推出类似 Codex Design 的产品？
Anthropic 最近推出了 Claude Design，是我除了编程之外用得最多的 Agent，也推荐过很多次。效果真的好：你用一句话描述想要的 App，它直接给你生成一个可交互的原型，点哪哪都有反应，不仔细看还以为在操作真实的 App。
有网友问：为啥 Codex Show more
11:32 PM · Jun 13, 2026 11.1K Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 9 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 9
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 5 0 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 50
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 5 7 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 57
Read 9 replies

## full_text

Post
Log in Sign up
Post
宝玉
@dotey
举一个具体的用 Claude Design 更新设计和代码的例子
我有一个视频字幕编辑器工具，是 Claude Design 做的设计，之前标题文字和下面的信息是放在一行，标题一长就放不下，于是我就让它变成两行。
图1 是我在设计稿上做的修改，修改好了后导出下载 zip 文件，放到项目中，用 git diff 的提示给 Claude Code：
> 参考设计稿 design 目录下的相关变更，对 UI 进行变更
Claude 自己通过 git diff 去分析变更，然后找出所有设计稿修改了的位置，自己帮我修改了相应的 Swift 代码，任务完成！（图4是修改后的效果）
全程我主要是在 Claude Design 上修改，然后需要手工去同步一下。
宝玉
@dotey
9h
为啥 Codex 还不推出类似 Codex Design 的产品？
Anthropic 最近推出了 Claude Design，是我除了编程之外用得最多的 Agent，也推荐过很多次。效果真的好：你用一句话描述想要的 App，它直接给你生成一个可交互的原型，点哪哪都有反应，不仔细看还以为在操作真实的 App。
有网友问：为啥 Codex Show more
11:32 PM · Jun 13, 2026 11.1K Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 9 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 9
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 5 0 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 50
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:var(--number-flow-char-height, 1em) !important}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 5 7 number-flow-react > span{font-kerning:none;display:inline-block;line-height:var(--number-flow-char-height, 1em) !important;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 57
Read 9 replies

## extraction_diagnostics

- extraction_method: main
- readability_score: 69
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":69,"text_length":2755,"paragraph_count":14,"sentence_count":4,"boilerplate_hits":1,"symbol_ratio":0.0221,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   宝玉分享了 Claude Design 与 Claude Code 联动的实际案例：在 Claude Design 上修改字幕编辑器 UI 设计稿后，导出 zip 并用 git diff 查看变更，然后通过一句提示让 Claude Code 参考设计目录变更自动修改 Swift 代码，全程只需手动同步设计文件。他解释为何 Codex 没有类似产品：Claude Design 依赖 Claude Opus 4.8 模型同时具备 UI/UX 设计和系统架构设计能力，能一次性交付可交互原型（含数据结构、状态管理、交互逻辑）；而 GPT-5.5 还做不到。Harness 层可复制，模型层才是关键门槛。

2. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   Post Log in Sign up Post 宝玉 @dotey 举一个具体的用 Claude Design 更新设计和代码的例子 我有一个视频字幕编辑器工具，是 Claude Design 做的设计，之前标题文字和下面的信息是放在一行，标题一长就放不下，于是我就让它变成两行。

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   图1 是我在设计稿上做的修改，修改好了后导出下载 zip 文件，放到项目中，用 git diff 的提示给 Claude Code： > 参考设计稿 design 目录下的相关变更，对 UI 进行变更 Claude 自己通过 git diff 去分析变更，然后找出所有设计稿修改了的位置，自己帮我修改了相应的 Swift 代码，任务完成！

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   （图4是修改后的效果） 全程我主要是在 Claude Design 上修改，然后需要手工去同步一下。

5. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   宝玉 @dotey 9h 为啥 Codex 还不推出类似 Codex Design 的产品？

6. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   Anthropic 最近推出了 Claude Design，是我除了编程之外用得最多的 Agent，也推荐过很多次。

## business_elements

- companies: X, 宝玉 (@dotey), Anthropic
- products: Claude, Codex, GPT-5, Agent
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 部署 / 集成交付
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 4.8, 5.5, 1, 4, 9, 11, 32, 13
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Post Log in Sign up Post 宝玉 @dotey 举一个具体的用 Claude Design 更新设计和代码的例子 我有一个视频字幕编辑器工具，是 Claude Design 做的设计，之前标题文字和下面的信息是放在一行，标题一长就放不下，于是我就让它变成两行。 / 图1 是我在设计稿上做的修改，修改好了后导出下载 zip 文件，放到项目中，用 git diff 的提示给 Claude Code： > 参考设计稿 design 目录下的相关变更，对 UI 进行变更 Claude 自己通过 git diff 去分析变更，然后找出所有设计稿修改了的位置，自己帮我修改了相应的 Swift 代码，任务完成！ / （图4是修改后的效果） 全程我主要是在 Claude Design 上修改，然后需要手工去同步一下。
- case_details: 宝玉分享了 Claude Design 与 Claude Code 联动的实际案例：在 Claude Design 上修改字幕编辑器 UI 设计稿后，导出 zip 并用 git diff 查看变更，然后通过一句提示让 Claude Code 参考设计目录变更自动修改 Swift 代码，全程只需手动同步设计文件。他解释为何 Codex 没有类似产品：Claude Design 依赖 Claude Opus 4.8 模型同时具备 UI/UX 设计和系统架构设计能力，能一次性交付可交互原型（含数据结构、状态管理、交互逻辑）；而 GPT-5.5 还做不到。Harness 层可复制，模型层才是关键门槛。
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: 
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: true
- emerging_pool: false
- user_feedback_pool: true
- watchlist: true

## pool_routes

- user_feedback_pool
- watchlist

## missing_information

- none

## volatile_and_discovery_handling

- source_volatility: high
- community_name: X：宝玉 (@dotey)
- capture_scope: visible_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: community_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Claude Design 与 Claude Code 联动示例：设计变更自动改代码","discovery_summary":"宝玉分享了 Claude Design 与 Claude Code 联动的实际案例：在 Claude Design 上修改字幕编辑器 UI 设计稿后，导出 zip 并用 git diff 查看变更，然后通过一句提示让 Claude Code 参考设计目录变更自动修改 Swift 代码，全程只需手动同步设计文件。他解释为何 Codex 没有类似产品：Claude Design 依赖 Claude Opus 4.8 模型同时具备 UI/UX 设计和系统架构设计能力，能一次性交付可交互原型（含数据结构、状态管理、交互逻辑）；而 GPT-5.5 还做不到。Harness 层可复制，模型层才是关键门槛。","source_name":"X：宝玉 (@dotey)","origin_url":"https://x.com/dotey/status/2065940342264770589","discovered_at":"2026-06-14T04:21:16.512Z","rank_on_page":30,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

宝玉分享了 Claude Design 与 Claude Code 联动的实际案例：在 Claude Design 上修改字幕编辑器 UI 设计稿后，导出 zip 并用 git diff 查看变更，然后通过一句提示让 Claude Code 参考设计目录变更自动修改 Swift 代码，全程只需手动同步设计文件。他解释为何 Codex 没有类似产品：Claude Design 依赖 Claude Opus 4.8 模型同时具备 UI/UX 设计和系统架构设计能力，能一次性交付可交互原型（含数据结构、状态管理、交互逻辑）；而 GPT-5.5 还做不到。Harness 层可复制，模型层才是关键门槛。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
