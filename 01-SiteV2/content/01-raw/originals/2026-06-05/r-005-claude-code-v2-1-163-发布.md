---
schema_version: raw-evidence-v2
raw_id: R-005
title: "Claude Code v2.1.163 发布"
original_url: "https://github.com/anthropics/claude-code/releases/tag/v2.1.163"
canonical_url: "https://github.com/anthropics/claude-code/releases/tag/v2.1.163"
source_name: "Claude Code：GitHub Releases（RSS）"
source_type: developer
source_level: S
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: changelog_or_release
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
published_at: "2026-06-04T21:52:51.000Z"
collected_at: 2026-06-05T00:46:23.034Z
language: mixed
full_text_hash: 36d54b68971022ea
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-05/r-005-claude-code-v2-1-163-发布.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-05/r-005-claude-code-v2-1-163-发布.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 86
extractor_diagnostics: {"readability_score":86,"text_length":3408,"paragraph_count":28,"sentence_count":9,"boilerplate_hits":1,"symbol_ratio":0.0029,"method":"main"}
has_full_text: true
content_length: 3408
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"36d54b68971022ea","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Claude Code v2.1.163 发布","discovery_summary":"新增 `requiredMinimumVersion` 和 `requiredMaximumVersion` 托管设置，版本超范围时拒绝启动并引导用户使用经批准版本。新增 `/plugin list` 命令及 `--enabled`/`--disabled` 筛选；`/btw` 添加 \"c to copy\" 快捷键，复制原始 markdown 答案到剪贴板。Hooks 方面，Stop 和 SubagentStop 可返回 `additionalContext` 给 Claude 反馈并保持对话。Skills 新增 `\\$` 转义语法，支持在命令中数字前使用字面 `$`。stdio MCP 服务器在 `--resume` 时接收与 hooks/Bash 相同的 `CLAUDE_CODE_SESSION_ID`。修复了 `claude -p` 永久挂起、`$TMPDIR` 被覆盖、Windows 上 session-env 目录 EEXIST 错误、后台 agent 会话在更新后自动升级等多处问题。","source_name":"Claude Code：GitHub Releases（RSS）","origin_url":"https://github.com/anthropics/claude-code/releases/tag/v2.1.163","discovered_at":"2026-06-05T00:38:28.537Z","rank_on_page":63,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 0517ef1efd7e9292
content_hash: 36d54b68971022ea
semantic_hash: 3949602c39ebfd86
duplicate_of: ""
first_seen_at: "2026-06-04T21:52:51.000Z"
last_seen_at: 2026-06-05T00:46:23.034Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Claude Code","GitHub Releases（RSS）","Anthropic"],"products":["Claude","MCP","claude","agent","agents","mcp"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["2.1","163","21.2","130","04","21","52","1"],"quotes":["c to copy","c to copy","ANTHROPIC_API_KEY required","EEXIST: file already exists","Bash(...)"]}
evidence_seed: {"company_actions":["anthropics claude-code Public Notifications You must be signed in to change notification settings Fork 21.","163 Latest Latest Compare Choose a tag to compare Sorry, something went wrong.","Filter Loading Sorry, something went wrong."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"新增 `requiredMinimumVersion` 和 `requiredMaximumVersion` 托管设置，版本超范围时拒绝启动并引导用户使用经批准版本。新增 `/plugin list` 命令及 `--enabled`/`--disabled` 筛选；`/btw` 添加 \"c to copy\" 快捷键，复制原始 markdown 答案到剪贴板。Hooks 方面，Stop 和 SubagentStop 可返回 `additionalContext` 给 Claude 反馈并保持对话。Skills 新增 `\\$` 转义语法，支持在命令中数字前使用字面 `$`。stdio MCP 服务器在 `--resume` 时接收与 hooks/Bash 相同的 `CLAUDE_CODE_SESSION_ID`。修复了 `claude -p` 永久挂起、`$TMPDIR` 被覆盖、Windows 上 session-env 目录 EEXIST 错误、后台 agent 会话在更新后自动升级等多处问题。","supports":["daily_observation","heatmap","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"anthropics claude-code Public Notifications You must be signed in to change notification settings Fork 21.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"163 Latest Latest Compare Choose a tag to compare Sorry, something went wrong.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Filter Loading Sorry, something went wrong.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"There was an error while loading.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Please reload this page .","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: technical-iteration-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Claude Code v2.1.163 发布

## clean_text

anthropics
claude-code
Public
Notifications
You must be signed in to change notification settings
Fork
21.2k
Star
130k
v2.1.163
Latest
Latest
Compare
Choose a tag to compare
Sorry, something went wrong.
Filter
Loading
Sorry, something went wrong.
Uh oh!
There was an error while loading. Please reload this page .
No results found
View all tags
ashwin-ant
released this
04 Jun 21:52
v2.1.163
d1e1742
What's changed
Added requiredMinimumVersion and requiredMaximumVersion managed settings — Claude Code refuses to start if its version is outside the allowed range and directs the user to an approved version
Added /plugin list command to list installed plugins, with --enabled / --disabled filters
Added a "c to copy" shortcut to /btw that copies the raw markdown answer to the clipboard, preserving formatting when pasted elsewhere
Hooks: Stop and SubagentStop hooks can now return hookSpecificOutput.additionalContext to give Claude feedback and keep the turn going without being labeled a hook error
Skills: added \$ escape syntax to include a literal $ before a digit in command bodies
stdio MCP servers now receive the same CLAUDE_CODE_SESSION_ID as hooks/Bash on --resume
Fixed claude -p hanging forever after its final result when a backgrounded command never exits — background shells are now stopped ~5s after the result once stdin closes
Fixed claude -p failing with "ANTHROPIC_API_KEY required" on Bedrock/Vertex/Foundry when CI=true and no Anthropic API key is set
Fixed bash commands failing under bazel and EDR-protected Go workflows: $TMPDIR was overridden to /tmp/claude-{uid} for all commands instead of only sandboxed ones (regression in 2.1.154)
Fixed Bash commands failing on Windows with "EEXIST: file already exists" on the session-env directory when it has the read-only attribute or is inside OneDrive
Fixed org-managed permission rules not applying for the entire session when the managed settings fetch completed during startup on a fresh config directory
Fixed background sessions in claude agents losing their running background tasks when reattached after a Claude Code update
Fixed terminal misalignment and a multi-second hang when exiting the agent view by pressing Esc
Fixed clicking Stop on a background-task chip in the desktop app not clearing the chip when the underlying process was already gone
Fixed keyboard input becoming permanently unresponsive after a paste operation whose end marker is dropped by the terminal
Fixed hook if: "Bash(...)" conditions firing on every Bash command containing $() or $VAR ; the pattern now matches against commands inside subshells and backticks too
Fixed deny rules on home-directory paths (e.g. Read(~/Desktop/**) ) not blocking Bash commands that reference the path via $HOME
Fixed a stray "(no content)" line left in the transcript after closing panel dialogs like /mcp and /plugins
Background agent sessions now update to a new Claude Code version in the background, so opening a session after an update no longer waits on a cold restart
Clearer descriptions for built-in commands and skills in the / menu
The subscription-switch suggestion now shows in the startup announcement slot instead of a toast
claude agents dispatching from the state-grouped view now starts the session in the directory the agent view was opened from
Assets
12
Loading
Uh oh!
There was an error while loading. Please reload this page .
6 people reacted

## full_text

anthropics
claude-code
Public
Notifications
You must be signed in to change notification settings
Fork
21.2k
Star
130k
v2.1.163
Latest
Latest
Compare
Choose a tag to compare
Sorry, something went wrong.
Filter
Loading
Sorry, something went wrong.
Uh oh!
There was an error while loading. Please reload this page .
No results found
View all tags
ashwin-ant
released this
04 Jun 21:52
v2.1.163
d1e1742
What's changed
Added requiredMinimumVersion and requiredMaximumVersion managed settings — Claude Code refuses to start if its version is outside the allowed range and directs the user to an approved version
Added /plugin list command to list installed plugins, with --enabled / --disabled filters
Added a "c to copy" shortcut to /btw that copies the raw markdown answer to the clipboard, preserving formatting when pasted elsewhere
Hooks: Stop and SubagentStop hooks can now return hookSpecificOutput.additionalContext to give Claude feedback and keep the turn going without being labeled a hook error
Skills: added \$ escape syntax to include a literal $ before a digit in command bodies
stdio MCP servers now receive the same CLAUDE_CODE_SESSION_ID as hooks/Bash on --resume
Fixed claude -p hanging forever after its final result when a backgrounded command never exits — background shells are now stopped ~5s after the result once stdin closes
Fixed claude -p failing with "ANTHROPIC_API_KEY required" on Bedrock/Vertex/Foundry when CI=true and no Anthropic API key is set
Fixed bash commands failing under bazel and EDR-protected Go workflows: $TMPDIR was overridden to /tmp/claude-{uid} for all commands instead of only sandboxed ones (regression in 2.1.154)
Fixed Bash commands failing on Windows with "EEXIST: file already exists" on the session-env directory when it has the read-only attribute or is inside OneDrive
Fixed org-managed permission rules not applying for the entire session when the managed settings fetch completed during startup on a fresh config directory
Fixed background sessions in claude agents losing their running background tasks when reattached after a Claude Code update
Fixed terminal misalignment and a multi-second hang when exiting the agent view by pressing Esc
Fixed clicking Stop on a background-task chip in the desktop app not clearing the chip when the underlying process was already gone
Fixed keyboard input becoming permanently unresponsive after a paste operation whose end marker is dropped by the terminal
Fixed hook if: "Bash(...)" conditions firing on every Bash command containing $() or $VAR ; the pattern now matches against commands inside subshells and backticks too
Fixed deny rules on home-directory paths (e.g. Read(~/Desktop/**) ) not blocking Bash commands that reference the path via $HOME
Fixed a stray "(no content)" line left in the transcript after closing panel dialogs like /mcp and /plugins
Background agent sessions now update to a new Claude Code version in the background, so opening a session after an update no longer waits on a cold restart
Clearer descriptions for built-in commands and skills in the / menu
The subscription-switch suggestion now shows in the startup announcement slot instead of a toast
claude agents dispatching from the state-grouped view now starts the session in the directory the agent view was opened from
Assets
12
Loading
Uh oh!
There was an error while loading. Please reload this page .
6 people reacted

## extraction_diagnostics

- extraction_method: main
- readability_score: 86
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":86,"text_length":3408,"paragraph_count":28,"sentence_count":9,"boilerplate_hits":1,"symbol_ratio":0.0029,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=daily_observation, heatmap, case, trend｜importance=high｜confidence=high
   新增 `requiredMinimumVersion` 和 `requiredMaximumVersion` 托管设置，版本超范围时拒绝启动并引导用户使用经批准版本。新增 `/plugin list` 命令及 `--enabled`/`--disabled` 筛选；`/btw` 添加 "c to copy" 快捷键，复制原始 markdown 答案到剪贴板。Hooks 方面，Stop 和 SubagentStop 可返回 `additionalContext` 给 Claude 反馈并保持对话。Skills 新增 `\$` 转义语法，支持在命令中数字前使用字面 `$`。stdio MCP 服务器在 `--resume` 时接收与 hooks/Bash 相同的 `CLAUDE_CODE_SESSION_ID`。修复了 `claude -p` 永久挂起、`$TMPDIR` 被覆盖、Windows 上 session-env 目录 EEXIST 错误、后台 agent 会话在更新后自动升级等多处问题。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   anthropics claude-code Public Notifications You must be signed in to change notification settings Fork 21.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   163 Latest Latest Compare Choose a tag to compare Sorry, something went wrong.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Filter Loading Sorry, something went wrong.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   There was an error while loading.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Please reload this page .

## business_elements

- companies: Claude Code, GitHub Releases（RSS）, Anthropic
- products: Claude, MCP, claude, agent, agents, mcp
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 2.1, 163, 21.2, 130, 04, 21, 52, 1
- quotes: c to copy / c to copy / ANTHROPIC_API_KEY required / EEXIST: file already exists / Bash(...)

## evidence_seed

- company_actions: anthropics claude-code Public Notifications You must be signed in to change notification settings Fork 21. / 163 Latest Latest Compare Choose a tag to compare Sorry, something went wrong. / Filter Loading Sorry, something went wrong.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
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
- user_feedback_pool: false
- watchlist: true

## pool_routes

- core_pool

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Claude Code v2.1.163 发布","discovery_summary":"新增 `requiredMinimumVersion` 和 `requiredMaximumVersion` 托管设置，版本超范围时拒绝启动并引导用户使用经批准版本。新增 `/plugin list` 命令及 `--enabled`/`--disabled` 筛选；`/btw` 添加 \"c to copy\" 快捷键，复制原始 markdown 答案到剪贴板。Hooks 方面，Stop 和 SubagentStop 可返回 `additionalContext` 给 Claude 反馈并保持对话。Skills 新增 `\\$` 转义语法，支持在命令中数字前使用字面 `$`。stdio MCP 服务器在 `--resume` 时接收与 hooks/Bash 相同的 `CLAUDE_CODE_SESSION_ID`。修复了 `claude -p` 永久挂起、`$TMPDIR` 被覆盖、Windows 上 session-env 目录 EEXIST 错误、后台 agent 会话在更新后自动升级等多处问题。","source_name":"Claude Code：GitHub Releases（RSS）","origin_url":"https://github.com/anthropics/claude-code/releases/tag/v2.1.163","discovered_at":"2026-06-05T00:38:28.537Z","rank_on_page":63,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

新增 `requiredMinimumVersion` 和 `requiredMaximumVersion` 托管设置，版本超范围时拒绝启动并引导用户使用经批准版本。新增 `/plugin list` 命令及 `--enabled`/`--disabled` 筛选；`/btw` 添加 "c to copy" 快捷键，复制原始 markdown 答案到剪贴板。Hooks 方面，Stop 和 SubagentStop 可返回 `additionalContext` 给 Claude 反馈并保持对话。Skills 新增 `\$` 转义语法，支持在命令中数字前使用字面 `$`。stdio MCP 服务器在 `--resume` 时接收与 hooks/Bash 相同的 `CLAUDE_CODE_SESSION_ID`。修复了 `claude -p` 永久挂起、`$TMPDIR` 被覆盖、Windows 上 session-env 目录 EEXIST 错误、后台 agent 会话在更新后自动升级等多处问题。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 follow-builders 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
