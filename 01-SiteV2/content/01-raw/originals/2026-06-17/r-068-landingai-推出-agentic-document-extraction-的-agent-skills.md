---
schema_version: raw-evidence-v2
raw_id: R-068
title: "LandingAI 推出 Agentic Document Extraction 的 Agent Skills"
original_url: "https://x.com/shao__meng/status/2066853435618869361"
canonical_url: "https://x.com/shao__meng/status/2066853435618869361"
source_name: "X：邵猛 (@shao__meng)"
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
published_at: "2026-06-16T12:00:33.000Z"
collected_at: 2026-06-17T01:51:13.258Z
language: mixed
full_text_hash: 6e945e72117b9ad3
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-17/r-068-landingai-推出-agentic-document-extraction-的-agent-skills.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-17/r-068-landingai-推出-agentic-document-extraction-的-agent-skills.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 73
extractor_diagnostics: {"readability_score":73,"text_length":2892,"paragraph_count":22,"sentence_count":5,"boilerplate_hits":1,"symbol_ratio":0.0242,"method":"main"}
has_full_text: true
content_length: 2892
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"6e945e72117b9ad3","missing":[]}
source_volatility: high
community_name: "X：邵猛 (@shao__meng)"
capture_scope: visible_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: community_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"LandingAI 推出 Agentic Document Extraction 的 Agent Skills","discovery_summary":"LandingAI 将 Agentic Document Extraction 升级为 Agent Skills，支持在 Codex、Claude Code、Cursor 等 coding agent 的对话中直接调用，实现零脚本文档处理流水线。两个 Skill 分工明确：document-extraction 提供结构化 Markdown/层级 JSON 解析、基于 JSON Schema/Pydantic 的字段抽取、按文档类型拆分、按页分类路由（预览）、目录生成（预览）、异步大文件处理（最高约 1GB/6000 页）及元素级坐标与置信度可视化；document-workflows 封装并行批处理、Classify→Extract 混合流水线、RAG 准备（语义分块、embedding、ChromaDB/FAISS）、DataFrame/CSV/Snowflake 导出、bbox 标注叠加及 Streamlit 交互 UI。安装命令：`/plugin marketplace add landing-ai/ade-document-processing-skills`。","source_name":"X：邵猛 (@shao__meng)","origin_url":"https://x.com/shao__meng/status/2066853435618869361","discovered_at":"2026-06-17T01:46:29.099Z","rank_on_page":257,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 1ad9706144395354
content_hash: 6e945e72117b9ad3
semantic_hash: 401b65fa6e2ef78b
duplicate_of: ""
first_seen_at: "2026-06-16T12:00:33.000Z"
last_seen_at: 2026-06-17T01:51:13.258Z
update_detected: false
raw_status: candidate
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["emerging_pool","user_feedback_pool","watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_vertical_solution","importance_score":5,"importance_reason":"vertical industry solution; rubric=5 major/platform/industry-shaping","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["X","邵猛 (@shao__meng)","GitHub","Cursor"],"products":["Agent","Codex","Claude","Cursor","agent","Agents","agents"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":["合同审阅 / 法律研究"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["1","6000","2","15","12","00","16","2026"],"quotes":[]}
evidence_seed: {"company_actions":["Post Log in Sign up Post meng shao @shao__meng LandingAI 把 Agentic Document Extraction 从「API 文档 + 手写脚本」升级成 Agent Skills ——让 Codex、Claude Code、Cursor 等 Coding Agents 在对话里直接写出可用的文档处理流水线 github.","com/landing-ai/ade… # 两个 Skill 的分工 1.","document-extraction — 原子操作 · Parse：结构化 Markdown + Schema / Pydantic 字段抽取（发票、表单、表格等） · Split：混合批次按文档类型拆分 · Classify：按页分类路由（Preview） · TOC：生成目录结构（Preview） · 大文件：异步处理（最高约 1GB / 6000 页） · Visual grounding：元素级坐标与置信度 2."],"case_details":[],"workflow_changes":["LandingAI 将 Agentic Document Extraction 升级为 Agent Skills，支持在 Codex、Claude Code、Cursor 等 coding agent 的对话中直接调用，实现零脚本文档处理流水线。两个 Skill 分工明确：document-extraction 提供结构化 Markdown/层级 JSON 解析、基于 JSON Schema/Pydantic 的字段抽取、按文档类型拆分、按页分类路由（预览）、目录生成（预览）、异步大文件处理（最高约 1GB/6000 页）及元素级坐标与置信度可视化；document-workflows 封装并行批处理、Classify→Extract 混合流水线、RAG 准备（语义分块、embedding、ChromaDB/FAISS）、DataFrame/CSV/Snowflake 导出、bbox 标注叠加及 Streamlit 交互 UI。安装命令：`/plugin marketplace add landing-ai/ade-document-processing-skills`。","document-workflows — 生产级组合 · 并行批处理（ThreadPool / async） · Classify → Extract 混合文档流水线 · RAG 准备：语义分块、embedding、ChromaDB/FAISS · 导出 DataFrame / CSV / Snowflake · 可视化标注（bbox 叠加、词级高亮） · Streamlit 交互 UI LandingAI @LandingAI 15h Turn Claude Code into a Document Processing Agent!"],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"workflow_change","text":"LandingAI 将 Agentic Document Extraction 升级为 Agent Skills，支持在 Codex、Claude Code、Cursor 等 coding agent 的对话中直接调用，实现零脚本文档处理流水线。两个 Skill 分工明确：document-extraction 提供结构化 Markdown/层级 JSON 解析、基于 JSON Schema/Pydantic 的字段抽取、按文档类型拆分、按页分类路由（预览）、目录生成（预览）、异步大文件处理（最高约 1GB/6000 页）及元素级坐标与置信度可视化；document-workflows 封装并行批处理、Classify→Extract 混合流水线、RAG 准备（语义分块、embedding、ChromaDB/FAISS）、DataFrame/CSV/Snowflake 导出、bbox 标注叠加及 Streamlit 交互 UI。安装命令：`/plugin marketplace add landing-ai/ade-document-processing-skills`。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Post Log in Sign up Post meng shao @shao__meng LandingAI 把 Agentic Document Extraction 从「API 文档 + 手写脚本」升级成 Agent Skills ——让 Codex、Claude Code、Cursor 等 Coding Agents 在对话里直接写出可用的文档处理流水线 github.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"com/landing-ai/ade… # 两个 Skill 的分工 1.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"document-extraction — 原子操作 · Parse：结构化 Markdown + Schema / Pydantic 字段抽取（发票、表单、表格等） · Split：混合批次按文档类型拆分 · Classify：按页分类路由（Preview） · TOC：生成目录结构（Preview） · 大文件：异步处理（最高约 1GB / 6000 页） · Visual grounding：元素级坐标与置信度 2.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"document-workflows — 生产级组合 · 并行批处理（ThreadPool / async） · Classify → Extract 混合文档流水线 · RAG 准备：语义分块、embedding、ChromaDB/FAISS · 导出 DataFrame / CSV / Snowflake · 可视化标注（bbox 叠加、词级高亮） · Streamlit 交互 UI LandingAI @LandingAI 15h Turn Claude Code into a Document Processing Agent!","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"product_update","text":"We just released Agentic Document Extraction (ADE) skills for AI coding agents.","supports":["daily_observation","heatmap","change"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# LandingAI 推出 Agentic Document Extraction 的 Agent Skills

## clean_text

Post
Log in Sign up
Post
meng shao
@shao__meng
LandingAI 把 Agentic Document Extraction 从「API 文档 + 手写脚本」升级成 Agent Skills ——让 Codex、Claude Code、Cursor 等 Coding Agents 在对话里直接写出可用的文档处理流水线
github.com/landing-ai/ade…
# 两个 Skill 的分工
1. document-extraction — 原子操作
· Parse：结构化 Markdown + Schema / Pydantic 字段抽取（发票、表单、表格等）
· Split：混合批次按文档类型拆分
· Classify：按页分类路由（Preview）
· TOC：生成目录结构（Preview）
· 大文件：异步处理（最高约 1GB / 6000 页）
· Visual grounding：元素级坐标与置信度
2. document-workflows — 生产级组合
· 并行批处理（ThreadPool / async）
· Classify → Extract 混合文档流水线
· RAG 准备：语义分块、embedding、ChromaDB/FAISS
· 导出 DataFrame / CSV / Snowflake
· 可视化标注（bbox 叠加、词级高亮）
· Streamlit 交互 UI
LandingAI
@LandingAI
15h
Turn Claude Code into a Document Processing Agent!
We just released Agentic Document Extraction (ADE) skills for AI coding agents. Install them in Claude Code, Cursor, or any AI coding agent that supports the Agent Skills convention.
The skills help you incorporate ADE into Show more
12:00 PM · Jun 16, 2026 2.3K Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 :where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 :where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 2 :where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 12
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 4 :where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 14
Read 2 replies

## full_text

Post
Log in Sign up
Post
meng shao
@shao__meng
LandingAI 把 Agentic Document Extraction 从「API 文档 + 手写脚本」升级成 Agent Skills ——让 Codex、Claude Code、Cursor 等 Coding Agents 在对话里直接写出可用的文档处理流水线
github.com/landing-ai/ade…
# 两个 Skill 的分工
1. document-extraction — 原子操作
· Parse：结构化 Markdown + Schema / Pydantic 字段抽取（发票、表单、表格等）
· Split：混合批次按文档类型拆分
· Classify：按页分类路由（Preview）
· TOC：生成目录结构（Preview）
· 大文件：异步处理（最高约 1GB / 6000 页）
· Visual grounding：元素级坐标与置信度
2. document-workflows — 生产级组合
· 并行批处理（ThreadPool / async）
· Classify → Extract 混合文档流水线
· RAG 准备：语义分块、embedding、ChromaDB/FAISS
· 导出 DataFrame / CSV / Snowflake
· 可视化标注（bbox 叠加、词级高亮）
· Streamlit 交互 UI
LandingAI
@LandingAI
15h
Turn Claude Code into a Document Processing Agent!
We just released Agentic Document Extraction (ADE) skills for AI coding agents. Install them in Claude Code, Cursor, or any AI coding agent that supports the Agent Skills convention.
The skills help you incorporate ADE into Show more
12:00 PM · Jun 16, 2026 2.3K Views
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 :where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 2 :where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 2
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 2 :where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 12
:host{display:inline-block;direction:ltr;white-space:nowrap;line-height:1}span{display:inline-block}:host([data-will-change]) span{will-change:transform}.number,.digit{padding:round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) 0}.symbol{white-space:pre} 1 4 :where(number-flow-react){line-height:1}number-flow-react > span{font-kerning:none;display:inline-block;padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0} 14
Read 2 replies

## extraction_diagnostics

- extraction_method: main
- readability_score: 73
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":73,"text_length":2892,"paragraph_count":22,"sentence_count":5,"boilerplate_hits":1,"symbol_ratio":0.0242,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **workflow_change**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   LandingAI 将 Agentic Document Extraction 升级为 Agent Skills，支持在 Codex、Claude Code、Cursor 等 coding agent 的对话中直接调用，实现零脚本文档处理流水线。两个 Skill 分工明确：document-extraction 提供结构化 Markdown/层级 JSON 解析、基于 JSON Schema/Pydantic 的字段抽取、按文档类型拆分、按页分类路由（预览）、目录生成（预览）、异步大文件处理（最高约 1GB/6000 页）及元素级坐标与置信度可视化；document-workflows 封装并行批处理、Classify→Extract 混合流水线、RAG 准备（语义分块、embedding、ChromaDB/FAISS）、DataFrame/CSV/Snowflake 导出、bbox 标注叠加及 Streamlit 交互 UI。安装命令：`/plugin marketplace add landing-ai/ade-document-processing-skills`。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Post Log in Sign up Post meng shao @shao__meng LandingAI 把 Agentic Document Extraction 从「API 文档 + 手写脚本」升级成 Agent Skills ——让 Codex、Claude Code、Cursor 等 Coding Agents 在对话里直接写出可用的文档处理流水线 github.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   com/landing-ai/ade… # 两个 Skill 的分工 1.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   document-extraction — 原子操作 · Parse：结构化 Markdown + Schema / Pydantic 字段抽取（发票、表单、表格等） · Split：混合批次按文档类型拆分 · Classify：按页分类路由（Preview） · TOC：生成目录结构（Preview） · 大文件：异步处理（最高约 1GB / 6000 页） · Visual grounding：元素级坐标与置信度 2.

5. **workflow_change**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   document-workflows — 生产级组合 · 并行批处理（ThreadPool / async） · Classify → Extract 混合文档流水线 · RAG 准备：语义分块、embedding、ChromaDB/FAISS · 导出 DataFrame / CSV / Snowflake · 可视化标注（bbox 叠加、词级高亮） · Streamlit 交互 UI LandingAI @LandingAI 15h Turn Claude Code into a Document Processing Agent!

6. **product_update**｜supports=daily_observation, heatmap, change｜importance=high｜confidence=high
   We just released Agentic Document Extraction (ADE) skills for AI coding agents.

## business_elements

- companies: X, 邵猛 (@shao__meng), GitHub, Cursor
- products: Agent, Codex, Claude, Cursor, agent, Agents, agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 合同审阅 / 法律研究
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 1, 6000, 2, 15, 12, 00, 16, 2026
- quotes: 暂无公开信息

## evidence_seed

- company_actions: Post Log in Sign up Post meng shao @shao__meng LandingAI 把 Agentic Document Extraction 从「API 文档 + 手写脚本」升级成 Agent Skills ——让 Codex、Claude Code、Cursor 等 Coding Agents 在对话里直接写出可用的文档处理流水线 github. / com/landing-ai/ade… # 两个 Skill 的分工 1. / document-extraction — 原子操作 · Parse：结构化 Markdown + Schema / Pydantic 字段抽取（发票、表单、表格等） · Split：混合批次按文档类型拆分 · Classify：按页分类路由（Preview） · TOC：生成目录结构（Preview） · 大文件：异步处理（最高约 1GB / 6000 页） · Visual grounding：元素级坐标与置信度 2.
- case_details: 暂无公开信息
- workflow_changes: LandingAI 将 Agentic Document Extraction 升级为 Agent Skills，支持在 Codex、Claude Code、Cursor 等 coding agent 的对话中直接调用，实现零脚本文档处理流水线。两个 Skill 分工明确：document-extraction 提供结构化 Markdown/层级 JSON 解析、基于 JSON Schema/Pydantic 的字段抽取、按文档类型拆分、按页分类路由（预览）、目录生成（预览）、异步大文件处理（最高约 1GB/6000 页）及元素级坐标与置信度可视化；document-workflows 封装并行批处理、Classify→Extract 混合流水线、RAG 准备（语义分块、embedding、ChromaDB/FAISS）、DataFrame/CSV/Snowflake 导出、bbox 标注叠加及 Streamlit 交互 UI。安装命令：`/plugin marketplace add landing-ai/ade-document-processing-skills`。 / document-workflows — 生产级组合 · 并行批处理（ThreadPool / async） · Classify → Extract 混合文档流水线 · RAG 准备：语义分块、embedding、ChromaDB/FAISS · 导出 DataFrame / CSV / Snowflake · 可视化标注（bbox 叠加、词级高亮） · Streamlit 交互 UI LandingAI @LandingAI 15h Turn Claude Code into a Document Processing Agent!
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_vertical_solution
- importance_score: 5
- importance_reason: vertical industry solution; rubric=5 major/platform/industry-shaping
- supporting_signals: adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: true
- emerging_pool: true
- user_feedback_pool: true
- watchlist: true

## pool_routes

- emerging_pool
- user_feedback_pool
- watchlist

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: high
- community_name: X：邵猛 (@shao__meng)
- capture_scope: visible_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: community_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"LandingAI 推出 Agentic Document Extraction 的 Agent Skills","discovery_summary":"LandingAI 将 Agentic Document Extraction 升级为 Agent Skills，支持在 Codex、Claude Code、Cursor 等 coding agent 的对话中直接调用，实现零脚本文档处理流水线。两个 Skill 分工明确：document-extraction 提供结构化 Markdown/层级 JSON 解析、基于 JSON Schema/Pydantic 的字段抽取、按文档类型拆分、按页分类路由（预览）、目录生成（预览）、异步大文件处理（最高约 1GB/6000 页）及元素级坐标与置信度可视化；document-workflows 封装并行批处理、Classify→Extract 混合流水线、RAG 准备（语义分块、embedding、ChromaDB/FAISS）、DataFrame/CSV/Snowflake 导出、bbox 标注叠加及 Streamlit 交互 UI。安装命令：`/plugin marketplace add landing-ai/ade-document-processing-skills`。","source_name":"X：邵猛 (@shao__meng)","origin_url":"https://x.com/shao__meng/status/2066853435618869361","discovered_at":"2026-06-17T01:46:29.099Z","rank_on_page":257,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

LandingAI 将 Agentic Document Extraction 升级为 Agent Skills，支持在 Codex、Claude Code、Cursor 等 coding agent 的对话中直接调用，实现零脚本文档处理流水线。两个 Skill 分工明确：document-extraction 提供结构化 Markdown/层级 JSON 解析、基于 JSON Schema/Pydantic 的字段抽取、按文档类型拆分、按页分类路由（预览）、目录生成（预览）、异步大文件处理（最高约 1GB/6000 页）及元素级坐标与置信度可视化；document-workflows 封装并行批处理、Classify→Extract 混合流水线、RAG 准备（语义分块、embedding、ChromaDB/FAISS）、DataFrame/CSV/Snowflake 导出、bbox 标注叠加及 Streamlit 交互 UI。安装命令：`/plugin marketplace add landing-ai/ade-document-processing-skills`。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
