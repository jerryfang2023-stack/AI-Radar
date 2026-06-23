---
schema_version: raw-evidence-v2
raw_id: R-086
title: "Claude Code 的\"扩展思维\"只是总结，而非真实推理"
original_url: "https://patrickmccanna.net/the-text-in-claude-codes-extended-thinking-output-is-not-authentic"
canonical_url: "https://patrickmccanna.net/the-text-in-claude-codes-extended-thinking-output-is-not-authentic"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: community_feedback
evidence_object_usable: false
event_evidence: false
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-22T16:28:15.889Z"
collected_at: 2026-06-23T02:03:46.688Z
language: mixed
full_text_hash: c9a286596a8893d4
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-23/r-086-claude-code-的-扩展思维-只是总结-而非真实推理.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-23/r-086-claude-code-的-扩展思维-只是总结-而非真实推理.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: medium
extraction_method: "content-container"
readability_score: 73
extractor_diagnostics: {"readability_score":73,"text_length":1910,"paragraph_count":15,"sentence_count":21,"boilerplate_hits":0,"symbol_ratio":0.001,"method":"content-container"}
has_full_text: true
content_length: 1910
fetch_error: ""
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["insufficient_usable_evidence_object"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"c9a286596a8893d4","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Claude Code 的\"扩展思维\"只是总结，而非真实推理","discovery_summary":"Claude Code 将会话记录写入磁盘，其中包含\"thinking blocks\"，但实际存储的是 600 字符的加密签名，而非推理文本。Anthropic 持有密钥，本地机器无法获取。API 仅返回推理的摘要，而非完整推理过程，获取完整思维输出需要企业协议。作者指出，通过 ctrl+o 获取的\"扩展思维\"输出是 Fable/Opus 推理的摘要，而非驱动模型行为的实际推理，存在数据丢失。本地文件无法提供智能体使用的逻辑记录，即使抓取输入、输出和动作，也无法获得实际推理。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://patrickmccanna.net/the-text-in-claude-codes-extended-thinking-output-is-not-authentic","discovered_at":"2026-06-23T01:57:11.608Z","rank_on_page":123,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 94dcf38c7dde1b53
content_hash: c9a286596a8893d4
semantic_hash: 066a7c4b11bf1426
duplicate_of: ""
first_seen_at: "2026-06-22T16:28:15.889Z"
last_seen_at: 2026-06-23T02:03:46.688Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":true,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":[],"novelty":3,"evidence_strength":3,"case_richness":2,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Anthropic"],"products":["Claude","claude","AGENT","agent"],"people":[],"industries":["开发者工具","企业服务"],"roles":[],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["600"],"quotes":["只是总结，而非真实推理\nClaude Code 将会话记录写入磁盘，其中包含","，但实际存储的是 600 字符的加密签名，而非推理文本。Anthropic 持有密钥，本地机器无法获取。API 仅返回推理的摘要，而非完整推理过程，获取完整思维输出需要企业协议。作者指出，通过 ctrl+o 获取的","thinking blocks","extended-thinking","extended thinking returns a summary of Claude’s full thinking process"]}
evidence_seed: {"company_actions":["Skip to content Claude Code records each session to disk.","I went to inspect that reasoning this weekend and found a signature (600 characters long) and no text.","So I read the docs: https://platform."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"quote","text":"Claude Code 将会话记录写入磁盘，其中包含\"thinking blocks\"，但实际存储的是 600 字符的加密签名，而非推理文本。Anthropic 持有密钥，本地机器无法获取。API 仅返回推理的摘要，而非完整推理过程，获取完整思维输出需要企业协议。作者指出，通过 ctrl+o 获取的\"扩展思维\"输出是 Fable/Opus 推理的摘要，而非驱动模型行为的实际推理，存在数据丢失。本地文件无法提供智能体使用的逻辑记录，即使抓取输入、输出和动作，也无法获得实际推理。","supports":["daily_observation","heatmap","viewpoint"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"Skip to content Claude Code records each session to disk.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"quote","text":"Those logs include “thinking blocks” — the model’s own reasoning as it works.","supports":["daily_observation","heatmap","viewpoint"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"I went to inspect that reasoning this weekend and found a signature (600 characters long) and no text.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"So I read the docs: https://platform.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"com/docs/en/build-with-claude/extended-thinking Some details worth being aware of: Claude encrypts its reasoning into that signature.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"medium"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Claude Code 的"扩展思维"只是总结，而非真实推理

## clean_text

Skip to content
Claude Code records each session to disk. Those logs include “thinking blocks” — the model’s own reasoning as it works.
I went to inspect that reasoning this weekend and found a signature (600 characters long) and no text.
So I read the docs: https://platform.claude.com/docs/en/build-with-claude/extended-thinking
Some details worth being aware of:
Claude encrypts its reasoning into that signature.
Anthropic holds the key. Your machine doesn’t receive it.
The API hands back a SUMMARY of reasoning, NOT the reasoning itself.
Getting the full thinking output requires an enterprise agreement.
Matt Green looked into this and has some more detailed observations on the signature blocks.
This is worth knowing before you promise anyone an audit trail. Also- BEWARE: T he “extended-thinking” output from ctrl+o is a summary of Fable/Opus’ thinking. It isn’t the actual thinking that drove the model’s actions in a session- but a summary of the thinking logic. This is like saving a bmp as a .jpeg and then editing the .jpeg and saving it back as a .bmp. The conversion produces data loss. [edit: I originally had the order inverted, which triggered some HN readers. Apologies!]
I’m underwhelmed by how Anthropic is presenting the behavior of their application. If you ever need a record of the logic a used by YOUR AGENT during a session:
you can’t produce the logic using the local files. The reasoning logs on your system are not accessible to you.
You can log the inputs, the outputs, and the actions of a running Claude code with some scrappy scraping- but even then- it’s not the actual reasoning that drove the agent’s behavior.
And the language in the docs is awfully indirect. If you haven’t had your coffee, you might miss that “extended thinking returns a summary of Claude’s full thinking process”
Screenshot
Performance improvements in Open Source models need to come faster.
Related

## full_text

Skip to content
Claude Code records each session to disk. Those logs include “thinking blocks” — the model’s own reasoning as it works.
I went to inspect that reasoning this weekend and found a signature (600 characters long) and no text.
So I read the docs: https://platform.claude.com/docs/en/build-with-claude/extended-thinking
Some details worth being aware of:
Claude encrypts its reasoning into that signature.
Anthropic holds the key. Your machine doesn’t receive it.
The API hands back a SUMMARY of reasoning, NOT the reasoning itself.
Getting the full thinking output requires an enterprise agreement.
Matt Green looked into this and has some more detailed observations on the signature blocks.
This is worth knowing before you promise anyone an audit trail. Also- BEWARE: T he “extended-thinking” output from ctrl+o is a summary of Fable/Opus’ thinking. It isn’t the actual thinking that drove the model’s actions in a session- but a summary of the thinking logic. This is like saving a bmp as a .jpeg and then editing the .jpeg and saving it back as a .bmp. The conversion produces data loss. [edit: I originally had the order inverted, which triggered some HN readers. Apologies!]
I’m underwhelmed by how Anthropic is presenting the behavior of their application. If you ever need a record of the logic a used by YOUR AGENT during a session:
you can’t produce the logic using the local files. The reasoning logs on your system are not accessible to you.
You can log the inputs, the outputs, and the actions of a running Claude code with some scrappy scraping- but even then- it’s not the actual reasoning that drove the agent’s behavior.
And the language in the docs is awfully indirect. If you haven’t had your coffee, you might miss that “extended thinking returns a summary of Claude’s full thinking process”
Screenshot
Performance improvements in Open Source models need to come faster.
Related

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 73
- fetch_status: fetched-readable-text-content-container
- extraction_quality: medium
- diagnostics: {"readability_score":73,"text_length":1910,"paragraph_count":15,"sentence_count":21,"boilerplate_hits":0,"symbol_ratio":0.001,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=daily_observation, heatmap, viewpoint｜importance=high｜confidence=medium
   Claude Code 将会话记录写入磁盘，其中包含"thinking blocks"，但实际存储的是 600 字符的加密签名，而非推理文本。Anthropic 持有密钥，本地机器无法获取。API 仅返回推理的摘要，而非完整推理过程，获取完整思维输出需要企业协议。作者指出，通过 ctrl+o 获取的"扩展思维"输出是 Fable/Opus 推理的摘要，而非驱动模型行为的实际推理，存在数据丢失。本地文件无法提供智能体使用的逻辑记录，即使抓取输入、输出和动作，也无法获得实际推理。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   Skip to content Claude Code records each session to disk.

3. **quote**｜supports=daily_observation, heatmap, viewpoint｜importance=high｜confidence=medium
   Those logs include “thinking blocks” — the model’s own reasoning as it works.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   I went to inspect that reasoning this weekend and found a signature (600 characters long) and no text.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   So I read the docs: https://platform.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=medium
   com/docs/en/build-with-claude/extended-thinking Some details worth being aware of: Claude encrypts its reasoning into that signature.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Anthropic
- products: Claude, claude, AGENT, agent
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: 暂无公开信息
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 600
- quotes: 只是总结，而非真实推理
Claude Code 将会话记录写入磁盘，其中包含 / ，但实际存储的是 600 字符的加密签名，而非推理文本。Anthropic 持有密钥，本地机器无法获取。API 仅返回推理的摘要，而非完整推理过程，获取完整思维输出需要企业协议。作者指出，通过 ctrl+o 获取的 / thinking blocks / extended-thinking / extended thinking returns a summary of Claude’s full thinking process

## evidence_seed

- company_actions: Skip to content Claude Code records each session to disk. / I went to inspect that reasoning this weekend and found a signature (600 characters long) and no text. / So I read the docs: https://platform.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: 
- novelty: 3
- evidence_strength: 3
- case_richness: 2
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: true
- case: false
- change: false
- trend: false
- daily_observation: false
- heatmap: false
- briefing: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有具体客户或真实企业案例
- 没有变化前后流程线索

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Claude Code 的\"扩展思维\"只是总结，而非真实推理","discovery_summary":"Claude Code 将会话记录写入磁盘，其中包含\"thinking blocks\"，但实际存储的是 600 字符的加密签名，而非推理文本。Anthropic 持有密钥，本地机器无法获取。API 仅返回推理的摘要，而非完整推理过程，获取完整思维输出需要企业协议。作者指出，通过 ctrl+o 获取的\"扩展思维\"输出是 Fable/Opus 推理的摘要，而非驱动模型行为的实际推理，存在数据丢失。本地文件无法提供智能体使用的逻辑记录，即使抓取输入、输出和动作，也无法获得实际推理。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://patrickmccanna.net/the-text-in-claude-codes-extended-thinking-output-is-not-authentic","discovered_at":"2026-06-23T01:57:11.608Z","rank_on_page":123,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Claude Code 将会话记录写入磁盘，其中包含"thinking blocks"，但实际存储的是 600 字符的加密签名，而非推理文本。Anthropic 持有密钥，本地机器无法获取。API 仅返回推理的摘要，而非完整推理过程，获取完整思维输出需要企业协议。作者指出，通过 ctrl+o 获取的"扩展思维"输出是 Fable/Opus 推理的摘要，而非驱动模型行为的实际推理，存在数据丢失。本地文件无法提供智能体使用的逻辑记录，即使抓取输入、输出和动作，也无法获得实际推理。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
