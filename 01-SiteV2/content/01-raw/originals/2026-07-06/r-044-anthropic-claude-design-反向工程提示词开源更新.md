---
schema_version: raw-evidence-v2
raw_id: R-044
title: "Anthropic Claude Design 反向工程提示词开源更新"
title_zh: "Anthropic Claude Design 反向工程提示词开源更新"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://github.com/Trystan-SA/claude-design-system-prompt"
canonical_url: "https://github.com/Trystan-SA/claude-design-system-prompt"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: developer
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: repo_readme_or_index
evidence_object_usable: false
event_evidence: false
index_only_evidence: true
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-05T15:35:42.919Z"
collected_at: 2026-07-06T02:21:26.975Z
language: mixed
full_text_hash: 7b5426f7e3412a27
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-06/r-044-anthropic-claude-design-反向工程提示词开源更新.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-06/r-044-anthropic-claude-design-反向工程提示词开源更新.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 88
extractor_diagnostics: {"readability_score":88,"text_length":8012,"paragraph_count":90,"sentence_count":42,"boilerplate_hits":3,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 8012
fetch_error: ""
evidence_strength: blocked
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["index_only_or_directory_page"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"7b5426f7e3412a27","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Anthropic Claude Design 反向工程提示词开源更新","discovery_summary":"Anthropic 旗下 Claude Design 的反向工程系统提示词在 GitHub 以 MIT 许可证开源，包含 20 章提示词和 14 项技能，覆盖内容纪律、美学、无障碍（WCAG、语义 HTML、键盘导航）、交互状态、系统思维等。近日针对 Fable 5/Opus 4.7+ 系列校准，新增自主决策条款：小决定直接执行记录而不询问。项目支持 Claude Code/Claude.ai 及 Codex 两种变体。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/Trystan-SA/claude-design-system-prompt","discovered_at":"2026-07-06T02:07:37.965Z","rank_on_page":77,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 685b3e87a0b96587
content_hash: 7b5426f7e3412a27
semantic_hash: e2bb026126a13a08
duplicate_of: ""
first_seen_at: "2026-07-05T15:35:42.919Z"
last_seen_at: 2026-07-06T02:21:26.975Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","OpenAI","Anthropic","GitHub"],"products":["Claude","Codex","claude","codex","Gemini","agent","AGENTS","agents"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["合同审阅 / 法律研究"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["20","14","5","4.7","107","861\nm","3","16"],"quotes":["design assistant","ask at least N questions","CRITICAL: YOU MUST","after every substantive visual change","only report important issues"]}
evidence_seed: {"company_actions":["Anthropic 旗下 Claude Design 的反向工程系统提示词在 GitHub 以 MIT 许可证开源，包含 20 章提示词和 14 项技能，覆盖内容纪律、美学、无障碍（WCAG、语义 HTML、键盘导航）、交互状态、系统思维等。近日针对 Fable 5/Opus 4.7+ 系列校准，新增自主决策条款：小决定直接执行记录而不询问。项目支持 Claude Code/Claude.ai 及 Codex 两种变体。","Trystan-SA claude-design-system-prompt Public Notifications You must be signed in to change notification settings Fork 107 Star 861 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 5 Commits 5 Commits claude claude codex codex LICENSE LICENSE README.","md View all files Repository files navigation Claude Design System Prompt Reverse-engineered system prompt of Claude Design from Anthropic."],"case_details":[],"workflow_changes":["Drop the prompt into any LLM that supports system prompts (Claude, GPT, Gemini, local models) and pair with the procedural skills as needed."],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"company_action","text":"Anthropic 旗下 Claude Design 的反向工程系统提示词在 GitHub 以 MIT 许可证开源，包含 20 章提示词和 14 项技能，覆盖内容纪律、美学、无障碍（WCAG、语义 HTML、键盘导航）、交互状态、系统思维等。近日针对 Fable 5/Opus 4.7+ 系列校准，新增自主决策条款：小决定直接执行记录而不询问。项目支持 Claude Code/Claude.ai 及 Codex 两种变体。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Trystan-SA claude-design-system-prompt Public Notifications You must be signed in to change notification settings Fork 107 Star 861 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 5 Commits 5 Commits claude claude codex codex LICENSE LICENSE README.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"md View all files Repository files navigation Claude Design System Prompt Reverse-engineered system prompt of Claude Design from Anthropic.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"A system prompt and skill library that turns an LLM into an opinionated, accessibility-aware, AI-slop-resistant design collaborator.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Open source, MIT licensed.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"Drop the prompt into any LLM that supports system prompts (Claude, GPT, Gemini, local models) and pair with the procedural skills as needed.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-06T02:21:26.975Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Anthropic Claude Design 反向工程提示词开源更新

## clean_text

Trystan-SA
claude-design-system-prompt
Public
Notifications
You must be signed in to change notification settings
Fork
107
Star
861
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
5 Commits
5 Commits
claude
claude
codex
codex
LICENSE
LICENSE
README.md
README.md
View all files
Repository files navigation
Claude Design System Prompt
Reverse-engineered system prompt of Claude Design from Anthropic.
A system prompt and skill library that turns an LLM into an opinionated, accessibility-aware, AI-slop-resistant design collaborator.
Open source, MIT licensed. Drop the prompt into any LLM that supports system prompts (Claude, GPT, Gemini, local models) and pair with the procedural skills as needed.
What this is
Most "design assistant" prompts produce generic SaaS-template output — aggressive gradients, emoji decoration, rounded-corner-with-left-border cards, Inter-everywhere typography. This prompt explicitly rejects those patterns and replaces them with a complete design philosophy covering:
Content discipline (no filler — every element earns its place)
Aesthetic discipline (avoid AI tropes, commit to a palette and tone)
Visual hierarchy and rhythm (size, color, weight, position, density, spacing scales)
Accessibility (WCAG, semantic HTML, keyboard navigation, focus rings, motion preferences)
Interaction and feedback (hover, active, disabled, focus, loading, validation states)
System thinking (components and tokens over one-off pages)
Respecting the medium (real CSS Grid, oklch() , text-wrap: pretty , real interactive prototypes)
Quality over quantity (depth over breadth, polish every detail)
Plus 14 procedural skills the agent can invoke for production, extraction, and review work.
What's included
claude-design-system-prompt/
├── claude/ Claude Code / Claude.ai variant
│ ├── system-prompt.md Main system prompt — 20 chapters
│ └── skills/ 14 invokable skills
│ ├── discovery-questions.md Kickoff question protocol
│ ├── frontend-aesthetic-direction.md Commit to a look when no brand exists
│ ├── wireframe.md Low-fi exploration, 3+ variations
│ ├── make-a-deck.md Slide presentations in HTML
│ ├── make-a-prototype.md Interactive clickable prototype
│ ├── make-tweakable.md Floating tweak panel
│ ├── generate-variations.md 3+ hi-fi variations across axes
│ ├── design-system-extract.md Pull tokens from sources
│ ├── component-extract.md Inventory reusable components
│ ├── accessibility-audit.md WCAG, semantic, keyboard, motion
│ ├── ai-slop-check.md Gradient / emoji / font / house-style trope detection
│ ├── hierarchy-rhythm-review.md Size / weight / color + spacing scale
│ ├── interaction-states-pass.md Hover / active / disabled / focus / loading
│ └── polish-pass.md Umbrella final-gate review
├── codex/ OpenAI Codex variant (single-loop, no subagents)
│ ├── AGENTS.md Codex auto-discovered entry point
│ ├── system-prompt.md Same prompt, adapted for Codex
│ └── skills/ Same skills, sequential reviews instead of parallel agents
├── README.md This file
└── LICENSE MIT
How to use it
Use the system prompt directly
Paste the contents of system-prompt.md as the system prompt for any LLM that supports them. The agent will follow the design philosophy and reference the skills by name when tasks match.
Use the skills as procedures
Each skill in skills/ is a self-contained, phased procedure. The skill name is the trigger — when the user's request matches a skill description, the agent loads that skill and follows it.
Skills group into three categories:
Production — build something
discovery-questions · frontend-aesthetic-direction · wireframe · make-a-deck · make-a-prototype · make-tweakable · generate-variations
System — extract structure
design-system-extract · component-extract
Review — audit and fix
accessibility-audit · ai-slop-check · hierarchy-rhythm-review · interaction-states-pass · polish-pass
Skills can be chained. A typical greenfield flow:
discovery-questions → frontend-aesthetic-direction → wireframe → make-a-prototype → polish-pass
A brand-aware flow:
design-system-extract → generate-variations → make-tweakable → polish-pass
Adapt for your platform
The prompt assumes an HTML-output design environment (similar to Claude.ai's design tool). If your target environment is different — a Figma plugin, a code-only assistant, a chat-only design coach — you'll need to adjust the workflow chapters and tool references. The principles (chapters 5–16) translate to any medium.
Model calibration
The claude/ variant is calibrated for current Anthropic frontier models (Fable 5 and the Opus 4.7/4.8 lineage), which follow instructions more literally and need less aggressive prompting than earlier generations:
Conditions instead of quotas. No "ask at least N questions", no "CRITICAL: YOU MUST". Current models treat quotas as literal contracts and over-trigger on them; the prompt states the conditions under which to act, plus an autonomy clause for minor decisions (pick a reasonable option and note it, rather than asking).
Explicit triggers for skills and subagents. These models under-reach for optional capabilities by default, so every skill description states when to invoke it, and verifier delegation has an explicit trigger ("after every substantive visual change").
Coverage-first reviews. Review agents report everything with confidence/severity estimates and let the aggregation step filter. Current models follow "only report important issues" literally, which silently suppresses findings.
House-style guard. The current models' default aesthetic (cream background, serif display type, terracotta/amber accents) is detected by ai-slop-check (rule 9) and pre-empted by frontend-aesthetic-direction 's four-directions protocol. Sampling parameters ( temperature ) no longer exist on these models, so visual variety must come from explicit per-variation specs, not randomness.
On older models (Claude Opus/Sonnet 4.6 and earlier, or non-Anthropic models), the calmer phrasing may under-trigger — restore stronger imperative language if you see the model skipping question rounds or reviews. The codex/ variant is maintained separately and is unaffected by these notes.
Design principles, in short
The 20 chapters in system-prompt.md cover:
Chapter
Identity and role
Workflow
Asking questions first
Rooting designs in existing context
Content principles — no filler
Aesthetic principles — purposeful visuals
Visual hierarchy and rhythm
Typography system
Color system
10
Accessibility and inclusivity
11
Interaction and feedback
12
Simplicity and one clear CTA
13
System thinking
14
Respecting the medium
15
Understanding users
16
Quality over quantity
17
Output principles
18
Collaboration and delivery
19
IP and content boundaries
20
Available skills
Contributing
Issues and PRs welcome. Particularly useful contributions:
Additional review skills (e.g., copy review, motion review, dark-mode parity check)
Adapted prompts for other environments (Figma, code-only, terminal-only)
Real-world failure cases the prompt should defend against
Translations of the prompt into other languages
Please keep the same operational tone and avoid bloating the prompt — every chapter should earn its place, the same standard the prompt holds the agent to.
License
MIT — see LICENSE .
You can use, modify, and distribute this prompt and skill library for any purpose, including commercial use. No attribution required, but appreciated.
About
Reverse-engineered system prompt and skill library that turns an LLM into an opinionated, accessibility-aware, AI-slop-resistant design collaborator.
Resources
Readme
License
MIT license
Uh oh!
There was an error while loading. Please reload this page .
Activity
Stars
861
stars
Watchers
watching
Forks
107
forks
Report repository
Releases
No releases published
Packages
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .

## full_text

Trystan-SA
claude-design-system-prompt
Public
Notifications
You must be signed in to change notification settings
Fork
107
Star
861
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
5 Commits
5 Commits
claude
claude
codex
codex
LICENSE
LICENSE
README.md
README.md
View all files
Repository files navigation
Claude Design System Prompt
Reverse-engineered system prompt of Claude Design from Anthropic.
A system prompt and skill library that turns an LLM into an opinionated, accessibility-aware, AI-slop-resistant design collaborator.
Open source, MIT licensed. Drop the prompt into any LLM that supports system prompts (Claude, GPT, Gemini, local models) and pair with the procedural skills as needed.
What this is
Most "design assistant" prompts produce generic SaaS-template output — aggressive gradients, emoji decoration, rounded-corner-with-left-border cards, Inter-everywhere typography. This prompt explicitly rejects those patterns and replaces them with a complete design philosophy covering:
Content discipline (no filler — every element earns its place)
Aesthetic discipline (avoid AI tropes, commit to a palette and tone)
Visual hierarchy and rhythm (size, color, weight, position, density, spacing scales)
Accessibility (WCAG, semantic HTML, keyboard navigation, focus rings, motion preferences)
Interaction and feedback (hover, active, disabled, focus, loading, validation states)
System thinking (components and tokens over one-off pages)
Respecting the medium (real CSS Grid, oklch() , text-wrap: pretty , real interactive prototypes)
Quality over quantity (depth over breadth, polish every detail)
Plus 14 procedural skills the agent can invoke for production, extraction, and review work.
What's included
claude-design-system-prompt/
├── claude/ Claude Code / Claude.ai variant
│ ├── system-prompt.md Main system prompt — 20 chapters
│ └── skills/ 14 invokable skills
│ ├── discovery-questions.md Kickoff question protocol
│ ├── frontend-aesthetic-direction.md Commit to a look when no brand exists
│ ├── wireframe.md Low-fi exploration, 3+ variations
│ ├── make-a-deck.md Slide presentations in HTML
│ ├── make-a-prototype.md Interactive clickable prototype
│ ├── make-tweakable.md Floating tweak panel
│ ├── generate-variations.md 3+ hi-fi variations across axes
│ ├── design-system-extract.md Pull tokens from sources
│ ├── component-extract.md Inventory reusable components
│ ├── accessibility-audit.md WCAG, semantic, keyboard, motion
│ ├── ai-slop-check.md Gradient / emoji / font / house-style trope detection
│ ├── hierarchy-rhythm-review.md Size / weight / color + spacing scale
│ ├── interaction-states-pass.md Hover / active / disabled / focus / loading
│ └── polish-pass.md Umbrella final-gate review
├── codex/ OpenAI Codex variant (single-loop, no subagents)
│ ├── AGENTS.md Codex auto-discovered entry point
│ ├── system-prompt.md Same prompt, adapted for Codex
│ └── skills/ Same skills, sequential reviews instead of parallel agents
├── README.md This file
└── LICENSE MIT
How to use it
Use the system prompt directly
Paste the contents of system-prompt.md as the system prompt for any LLM that supports them. The agent will follow the design philosophy and reference the skills by name when tasks match.
Use the skills as procedures
Each skill in skills/ is a self-contained, phased procedure. The skill name is the trigger — when the user's request matches a skill description, the agent loads that skill and follows it.
Skills group into three categories:
Production — build something
discovery-questions · frontend-aesthetic-direction · wireframe · make-a-deck · make-a-prototype · make-tweakable · generate-variations
System — extract structure
design-system-extract · component-extract
Review — audit and fix
accessibility-audit · ai-slop-check · hierarchy-rhythm-review · interaction-states-pass · polish-pass
Skills can be chained. A typical greenfield flow:
discovery-questions → frontend-aesthetic-direction → wireframe → make-a-prototype → polish-pass
A brand-aware flow:
design-system-extract → generate-variations → make-tweakable → polish-pass
Adapt for your platform
The prompt assumes an HTML-output design environment (similar to Claude.ai's design tool). If your target environment is different — a Figma plugin, a code-only assistant, a chat-only design coach — you'll need to adjust the workflow chapters and tool references. The principles (chapters 5–16) translate to any medium.
Model calibration
The claude/ variant is calibrated for current Anthropic frontier models (Fable 5 and the Opus 4.7/4.8 lineage), which follow instructions more literally and need less aggressive prompting than earlier generations:
Conditions instead of quotas. No "ask at least N questions", no "CRITICAL: YOU MUST". Current models treat quotas as literal contracts and over-trigger on them; the prompt states the conditions under which to act, plus an autonomy clause for minor decisions (pick a reasonable option and note it, rather than asking).
Explicit triggers for skills and subagents. These models under-reach for optional capabilities by default, so every skill description states when to invoke it, and verifier delegation has an explicit trigger ("after every substantive visual change").
Coverage-first reviews. Review agents report everything with confidence/severity estimates and let the aggregation step filter. Current models follow "only report important issues" literally, which silently suppresses findings.
House-style guard. The current models' default aesthetic (cream background, serif display type, terracotta/amber accents) is detected by ai-slop-check (rule 9) and pre-empted by frontend-aesthetic-direction 's four-directions protocol. Sampling parameters ( temperature ) no longer exist on these models, so visual variety must come from explicit per-variation specs, not randomness.
On older models (Claude Opus/Sonnet 4.6 and earlier, or non-Anthropic models), the calmer phrasing may under-trigger — restore stronger imperative language if you see the model skipping question rounds or reviews. The codex/ variant is maintained separately and is unaffected by these notes.
Design principles, in short
The 20 chapters in system-prompt.md cover:
Chapter
Identity and role
Workflow
Asking questions first
Rooting designs in existing context
Content principles — no filler
Aesthetic principles — purposeful visuals
Visual hierarchy and rhythm
Typography system
Color system
10
Accessibility and inclusivity
11
Interaction and feedback
12
Simplicity and one clear CTA
13
System thinking
14
Respecting the medium
15
Understanding users
16
Quality over quantity
17
Output principles
18
Collaboration and delivery
19
IP and content boundaries
20
Available skills
Contributing
Issues and PRs welcome. Particularly useful contributions:
Additional review skills (e.g., copy review, motion review, dark-mode parity check)
Adapted prompts for other environments (Figma, code-only, terminal-only)
Real-world failure cases the prompt should defend against
Translations of the prompt into other languages
Please keep the same operational tone and avoid bloating the prompt — every chapter should earn its place, the same standard the prompt holds the agent to.
License
MIT — see LICENSE .
You can use, modify, and distribute this prompt and skill library for any purpose, including commercial use. No attribution required, but appreciated.
About
Reverse-engineered system prompt and skill library that turns an LLM into an opinionated, accessibility-aware, AI-slop-resistant design collaborator.
Resources
Readme
License
MIT license
Uh oh!
There was an error while loading. Please reload this page .
Activity
Stars
861
stars
Watchers
watching
Forks
107
forks
Report repository
Releases
No releases published
Packages
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .

## extraction_diagnostics

- extraction_method: main
- readability_score: 88
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":88,"text_length":8012,"paragraph_count":90,"sentence_count":42,"boilerplate_hits":3,"symbol_ratio":0,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Anthropic 旗下 Claude Design 的反向工程系统提示词在 GitHub 以 MIT 许可证开源，包含 20 章提示词和 14 项技能，覆盖内容纪律、美学、无障碍（WCAG、语义 HTML、键盘导航）、交互状态、系统思维等。近日针对 Fable 5/Opus 4.7+ 系列校准，新增自主决策条款：小决定直接执行记录而不询问。项目支持 Claude Code/Claude.ai 及 Codex 两种变体。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Trystan-SA claude-design-system-prompt Public Notifications You must be signed in to change notification settings Fork 107 Star 861 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 5 Commits 5 Commits claude claude codex codex LICENSE LICENSE README.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   md View all files Repository files navigation Claude Design System Prompt Reverse-engineered system prompt of Claude Design from Anthropic.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   A system prompt and skill library that turns an LLM into an opinionated, accessibility-aware, AI-slop-resistant design collaborator.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Open source, MIT licensed.

6. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Drop the prompt into any LLM that supports system prompts (Claude, GPT, Gemini, local models) and pair with the procedural skills as needed.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, OpenAI, Anthropic, GitHub
- products: Claude, Codex, claude, codex, Gemini, agent, AGENTS, agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 合同审阅 / 法律研究
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 20, 14, 5, 4.7, 107, 861
m, 3, 16
- quotes: design assistant / ask at least N questions / CRITICAL: YOU MUST / after every substantive visual change / only report important issues

## evidence_seed

- company_actions: Anthropic 旗下 Claude Design 的反向工程系统提示词在 GitHub 以 MIT 许可证开源，包含 20 章提示词和 14 项技能，覆盖内容纪律、美学、无障碍（WCAG、语义 HTML、键盘导航）、交互状态、系统思维等。近日针对 Fable 5/Opus 4.7+ 系列校准，新增自主决策条款：小决定直接执行记录而不询问。项目支持 Claude Code/Claude.ai 及 Codex 两种变体。 / Trystan-SA claude-design-system-prompt Public Notifications You must be signed in to change notification settings Fork 107 Star 861 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 5 Commits 5 Commits claude claude codex codex LICENSE LICENSE README. / md View all files Repository files navigation Claude Design System Prompt Reverse-engineered system prompt of Claude Design from Anthropic.
- case_details: 暂无公开信息
- workflow_changes: Drop the prompt into any LLM that supports system prompts (Claude, GPT, Gemini, local models) and pair with the procedural skills as needed.
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: false
- business_change: false
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 疑似官网首页、产品目录或导航页，只能索引留存
- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Anthropic Claude Design 反向工程提示词开源更新","discovery_summary":"Anthropic 旗下 Claude Design 的反向工程系统提示词在 GitHub 以 MIT 许可证开源，包含 20 章提示词和 14 项技能，覆盖内容纪律、美学、无障碍（WCAG、语义 HTML、键盘导航）、交互状态、系统思维等。近日针对 Fable 5/Opus 4.7+ 系列校准，新增自主决策条款：小决定直接执行记录而不询问。项目支持 Claude Code/Claude.ai 及 Codex 两种变体。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/Trystan-SA/claude-design-system-prompt","discovered_at":"2026-07-06T02:07:37.965Z","rank_on_page":77,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Anthropic 旗下 Claude Design 的反向工程系统提示词在 GitHub 以 MIT 许可证开源，包含 20 章提示词和 14 项技能，覆盖内容纪律、美学、无障碍（WCAG、语义 HTML、键盘导航）、交互状态、系统思维等。近日针对 Fable 5/Opus 4.7+ 系列校准，新增自主决策条款：小决定直接执行记录而不询问。项目支持 Claude Code/Claude.ai 及 Codex 两种变体。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
