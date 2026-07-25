---
schema_version: raw-evidence-v2
raw_id: R-085
title: "Claude-thermos：保持 Claude 会话缓存热度，避免重新编码费用"
title_zh: "Claude-thermos：保持 Claude 会话缓存热度，避免重新编码费用"
title_translation_status: not_required
title_translation_method: source_title
title_translation_model: not_applicable
original_url: "https://github.com/izeigerman/claude-thermos"
canonical_url: "https://github.com/izeigerman/claude-thermos"
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
published_at: "2026-07-24T09:47:29.601Z"
collected_at: 2026-07-25T02:25:58.029Z
language: mixed
full_text_hash: e09392bc7e99745a
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-25/r-085-claude-thermos-保持-claude-会话缓存热度-避免重新编码费用.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-25/r-085-claude-thermos-保持-claude-会话缓存热度-避免重新编码费用.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":7341,"paragraph_count":72,"sentence_count":44,"boilerplate_hits":2,"symbol_ratio":0.0069,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 7341
fetch_error: ""
evidence_strength: blocked
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["index_only_or_directory_page"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"e09392bc7e99745a","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Claude-thermos：保持 Claude 会话缓存热度，避免重新编码费用","discovery_summary":"Claude-thermos 通过本地反向代理监控 Claude Code 会话，在主智能体因等待子智能体而空闲超过 5 分钟时，自动发送预热请求刷新提示缓存。实测约 185 次本地会话中，缓存过期导致的重新编码占账单约 22%。工具以 uvx 运行，支持自定义空闲阈值和预热间隔。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/izeigerman/claude-thermos","discovered_at":"2026-07-25T02:16:33.204Z","rank_on_page":277,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: daa338753d6df9fd
content_hash: e09392bc7e99745a
semantic_hash: d3a6b439a7572123
duplicate_of: ""
first_seen_at: "2026-07-24T09:47:29.601Z"
last_seen_at: 2026-07-25T02:25:58.029Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Anthropic","GitHub"],"products":["Claude","claude","agent","agents"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":["计费 / 预算管理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","财务 / 预算"],"numbers":["5","185 次","22%","131\nm","43","5 m","20%","3.11"],"quotes":[" fix the bug ","still active"," fix the bug "]}
evidence_seed: {"company_actions":["izeigerman claude-thermos Public Notifications You must be signed in to change notification settings Fork Star 131 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 43 Commits 43 Commits .","gitignore LICENSE LICENSE Makefile Makefile README.","lock View all files Repository files navigation claude-thermos Stop paying to rebuild your Claude Code cache."],"case_details":[],"workflow_changes":["github/ workflows .","github/ workflows src/ claude_thermos src/ claude_thermos tests tests ."],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"Claude-thermos 通过本地反向代理监控 Claude Code 会话，在主智能体因等待子智能体而空闲超过 5 分钟时，自动发送预热请求刷新提示缓存。实测约 185 次本地会话中，缓存过期导致的重新编码占账单约 22%。工具以 uvx 运行，支持自定义空闲阈值和预热间隔。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"izeigerman claude-thermos Public Notifications You must be signed in to change notification settings Fork Star 131 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 43 Commits 43 Commits .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"workflow_change","text":"github/ workflows .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"github/ workflows src/ claude_thermos src/ claude_thermos tests tests .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"gitignore LICENSE LICENSE Makefile Makefile README.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"lock View all files Repository files navigation claude-thermos Stop paying to rebuild your Claude Code cache.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-25T02:25:58.029Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Claude-thermos：保持 Claude 会话缓存热度，避免重新编码费用

## clean_text

izeigerman
claude-thermos
Public
Notifications
You must be signed in to change notification settings
Fork
Star
131
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
43 Commits
43 Commits
.github/ workflows
.github/ workflows
src/ claude_thermos
src/ claude_thermos
tests
tests
.gitignore
.gitignore
LICENSE
LICENSE
Makefile
Makefile
README.md
README.md
pyproject.toml
pyproject.toml
uv.lock
uv.lock
View all files
Repository files navigation
claude-thermos
Stop paying to rebuild your Claude Code cache. When your main agent waits on a subagent for more than 5 minutes, its prompt cache silently expires, and the next turn re-encodes your entire conversation at the write rate instead of reading it back cheap. On long sessions with many subagents that's roughly 20% of your bill. claude-thermos keeps the cache warm so you never pay that tax.
Use
Run Claude Code exactly as you normally would, but through claude-thermos with uvx :
uvx claude-thermos # instead of: claude
uvx claude-thermos -p " fix the bug " # any claude args pass straight through
Requires Python 3.11+ and the claude CLI on your PATH .
That's it. Warming runs automatically in the background. To disable it for a run without changing the command, set CLAUDE_THERMOS_DISABLE=1 .
Tuning (all optional):
Flag
Default
Meaning
--idle
270
Seconds the main agent must be idle before warming kicks in
--interval
270
Seconds between warming cycles
--max-cycles
Max warms per idle episode ( auto for unlimited)
--subagent-window
540
Seconds a subagent counts as "still active"
Daemon mode (shared proxy for the IDE and multiple terminals)
The default command warms only the claude process it launches. Clients that
launch claude themselves — the VSCode/Claude Code extension , which spawns
its own bundled binary — never go through it, and neither do other terminals.
claude-thermos serve runs the warming proxy as a standalone daemon on a
fixed loopback port. Point any client at it and they all share one warmer:
claude-thermos serve --port 8787 # run the daemon (Ctrl-C / SIGTERM to stop)
# then, for any client:
export ANTHROPIC_BASE_URL=http://127.0.0.1:8787
claude -p " fix the bug " # terminal — warmed by the daemon
For the VSCode extension, make sure its process inherits that environment
variable (on macOS, launchctl setenv ANTHROPIC_BASE_URL http://127.0.0.1:8787
before launching the app; or export it in the shell you start the editor from).
The extension honors ANTHROPIC_BASE_URL , so its traffic then flows through the
daemon and its main agent stays warm while subagents run.
The daemon observes traffic exactly like the launcher and already tracks many
sessions at once, so a single daemon serves every client on the machine. It
evicts sessions idle longer than --session-ttl (default 3600s ) so it can run
indefinitely.
Tuning: serve accepts the same --idle/--interval/--max-cycles/--subagent-window
flags as the default command, plus:
Flag
Default
Meaning
--port
8787
Loopback port the daemon listens on
--upstream
https://api.anthropic.com
Real API the proxy reverse-proxies to
--session-ttl
3600
Seconds a session may sit idle before eviction
Caveat: --upstream must be the real API, never the daemon's own loopback
address — otherwise the proxy would forward to itself. serve rejects a
loopback upstream, so if you export ANTHROPIC_BASE_URL globally, still start
the daemon with an explicit --upstream https://api.anthropic.com .
Why your cache keeps expiring
Claude Code's prompt cache uses a 5-minute TTL . Every turn, your whole conversation history is served from cache at 0.1x the input price instead of being re-sent at full price, as long as the cache stays alive.
The cache expires if more than 5 minutes pass between requests on the same prefix. The dominant trigger for that gap is not you thinking. It's the main agent blocked on a subagent that runs longer than 5 minutes . A subagent has a different system prompt and tool set, so its requests have a different cache prefix and never refresh the main agent's. While the subagent works, the main agent's cached history ages untouched; past 5 minutes it's gone. When the subagent returns, the main agent resumes with a byte-identical, append-only history, and finds its cache missing, forcing a full re-encode at the 1.25x write rate.
By then the history is large, so the re-encode is expensive: individual collapses re-write 200K to 500K tokens. Measured across roughly 185 local sessions, these rebuilds accounted for about 22% of the total bill , money spent re-encoding content that was already cached moments earlier.
How it works
claude-thermos launches Claude Code behind a small local reverse proxy (it points ANTHROPIC_BASE_URL at a loopback port; all traffic still goes to the real Anthropic API).
Observe. The proxy watches /v1/messages traffic and groups it into sessions and lineages , a lineage being one cache prefix, keyed by model + tool set + system text. The first tool-bearing lineage is the main agent; the rest are subagents.
Detect the danger window. When the main lineage goes idle and a subagent is actively running, the main prefix is at risk of expiring.
Warm. On an interval under the 5-minute TTL, it replays the main agent's last real request as a warm request : identical cacheable prefix, but max_tokens: 1 and no streaming. The single token is thrown away; the point is the prefill, which reads and refreshes the full cached prefix. Warm requests go directly to the API, never through the proxy, so they can't disturb real traffic.
Result. When the subagent finishes, the main agent's cache is still warm. It pays a cheap read instead of a full rewrite.
Each warm costs a cache read (0.1x); each rewrite it prevents would have cost a write (1.25x) on a much larger prefix, so the trade is heavily in your favor.
Event logs & savings
Every session writes to:
~/.claude-thermos/logs/<session_id>/
├── events.jsonl # append-only structured event stream
└── summary.json # rollup totals, written when the session ends
events.jsonl records each request/response's token usage plus every warming decision ( warm_fired , warm_result , cap_reached , resume_detected , and so on). summary.json is the rollup you'll usually read:
Field
Meaning
warms_fired
Warm requests sent
cache_read_total
Tokens read back by those warms
episodes
Idle-with-subagent episodes that ended in a successful resume (a rewrite actually avoided)
rewrite_avoided_tokens
Tokens that would have been re-written, summed across episodes
warm_cost
What warming cost you: 0.1 × cache_read_total
rewrite_avoided_cost
What it saved: 1.25 × rewrite_avoided_tokens
net_savings
rewrite_avoided_cost − warm_cost
All three cost figures are in base-input-token units (token counts already weighted by their cache multiplier). To turn net_savings into dollars, multiply it by your model's price per input token :
dollars saved ≈ net_savings × (input token price)
For example, at an input price of $3 / 1M tokens, a net_savings of 1_200_000 is about 1_200_000 × $3 / 1_000_000 = $3.60 saved that session.
About
Keeps your Claude session warm for you
Topics
ai-agents claude-code
Resources
Readme
MIT license
Activity
Stars
131 stars
Watchers
1 watching
Forks
5 forks
Report repository
Releases
Contributors
Languages

## full_text

izeigerman
claude-thermos
Public
Notifications
You must be signed in to change notification settings
Fork
Star
131
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
43 Commits
43 Commits
.github/ workflows
.github/ workflows
src/ claude_thermos
src/ claude_thermos
tests
tests
.gitignore
.gitignore
LICENSE
LICENSE
Makefile
Makefile
README.md
README.md
pyproject.toml
pyproject.toml
uv.lock
uv.lock
View all files
Repository files navigation
claude-thermos
Stop paying to rebuild your Claude Code cache. When your main agent waits on a subagent for more than 5 minutes, its prompt cache silently expires, and the next turn re-encodes your entire conversation at the write rate instead of reading it back cheap. On long sessions with many subagents that's roughly 20% of your bill. claude-thermos keeps the cache warm so you never pay that tax.
Use
Run Claude Code exactly as you normally would, but through claude-thermos with uvx :
uvx claude-thermos # instead of: claude
uvx claude-thermos -p " fix the bug " # any claude args pass straight through
Requires Python 3.11+ and the claude CLI on your PATH .
That's it. Warming runs automatically in the background. To disable it for a run without changing the command, set CLAUDE_THERMOS_DISABLE=1 .
Tuning (all optional):
Flag
Default
Meaning
--idle
270
Seconds the main agent must be idle before warming kicks in
--interval
270
Seconds between warming cycles
--max-cycles
Max warms per idle episode ( auto for unlimited)
--subagent-window
540
Seconds a subagent counts as "still active"
Daemon mode (shared proxy for the IDE and multiple terminals)
The default command warms only the claude process it launches. Clients that
launch claude themselves — the VSCode/Claude Code extension , which spawns
its own bundled binary — never go through it, and neither do other terminals.
claude-thermos serve runs the warming proxy as a standalone daemon on a
fixed loopback port. Point any client at it and they all share one warmer:
claude-thermos serve --port 8787 # run the daemon (Ctrl-C / SIGTERM to stop)
# then, for any client:
export ANTHROPIC_BASE_URL=http://127.0.0.1:8787
claude -p " fix the bug " # terminal — warmed by the daemon
For the VSCode extension, make sure its process inherits that environment
variable (on macOS, launchctl setenv ANTHROPIC_BASE_URL http://127.0.0.1:8787
before launching the app; or export it in the shell you start the editor from).
The extension honors ANTHROPIC_BASE_URL , so its traffic then flows through the
daemon and its main agent stays warm while subagents run.
The daemon observes traffic exactly like the launcher and already tracks many
sessions at once, so a single daemon serves every client on the machine. It
evicts sessions idle longer than --session-ttl (default 3600s ) so it can run
indefinitely.
Tuning: serve accepts the same --idle/--interval/--max-cycles/--subagent-window
flags as the default command, plus:
Flag
Default
Meaning
--port
8787
Loopback port the daemon listens on
--upstream
https://api.anthropic.com
Real API the proxy reverse-proxies to
--session-ttl
3600
Seconds a session may sit idle before eviction
Caveat: --upstream must be the real API, never the daemon's own loopback
address — otherwise the proxy would forward to itself. serve rejects a
loopback upstream, so if you export ANTHROPIC_BASE_URL globally, still start
the daemon with an explicit --upstream https://api.anthropic.com .
Why your cache keeps expiring
Claude Code's prompt cache uses a 5-minute TTL . Every turn, your whole conversation history is served from cache at 0.1x the input price instead of being re-sent at full price, as long as the cache stays alive.
The cache expires if more than 5 minutes pass between requests on the same prefix. The dominant trigger for that gap is not you thinking. It's the main agent blocked on a subagent that runs longer than 5 minutes . A subagent has a different system prompt and tool set, so its requests have a different cache prefix and never refresh the main agent's. While the subagent works, the main agent's cached history ages untouched; past 5 minutes it's gone. When the subagent returns, the main agent resumes with a byte-identical, append-only history, and finds its cache missing, forcing a full re-encode at the 1.25x write rate.
By then the history is large, so the re-encode is expensive: individual collapses re-write 200K to 500K tokens. Measured across roughly 185 local sessions, these rebuilds accounted for about 22% of the total bill , money spent re-encoding content that was already cached moments earlier.
How it works
claude-thermos launches Claude Code behind a small local reverse proxy (it points ANTHROPIC_BASE_URL at a loopback port; all traffic still goes to the real Anthropic API).
Observe. The proxy watches /v1/messages traffic and groups it into sessions and lineages , a lineage being one cache prefix, keyed by model + tool set + system text. The first tool-bearing lineage is the main agent; the rest are subagents.
Detect the danger window. When the main lineage goes idle and a subagent is actively running, the main prefix is at risk of expiring.
Warm. On an interval under the 5-minute TTL, it replays the main agent's last real request as a warm request : identical cacheable prefix, but max_tokens: 1 and no streaming. The single token is thrown away; the point is the prefill, which reads and refreshes the full cached prefix. Warm requests go directly to the API, never through the proxy, so they can't disturb real traffic.
Result. When the subagent finishes, the main agent's cache is still warm. It pays a cheap read instead of a full rewrite.
Each warm costs a cache read (0.1x); each rewrite it prevents would have cost a write (1.25x) on a much larger prefix, so the trade is heavily in your favor.
Event logs & savings
Every session writes to:
~/.claude-thermos/logs/<session_id>/
├── events.jsonl # append-only structured event stream
└── summary.json # rollup totals, written when the session ends
events.jsonl records each request/response's token usage plus every warming decision ( warm_fired , warm_result , cap_reached , resume_detected , and so on). summary.json is the rollup you'll usually read:
Field
Meaning
warms_fired
Warm requests sent
cache_read_total
Tokens read back by those warms
episodes
Idle-with-subagent episodes that ended in a successful resume (a rewrite actually avoided)
rewrite_avoided_tokens
Tokens that would have been re-written, summed across episodes
warm_cost
What warming cost you: 0.1 × cache_read_total
rewrite_avoided_cost
What it saved: 1.25 × rewrite_avoided_tokens
net_savings
rewrite_avoided_cost − warm_cost
All three cost figures are in base-input-token units (token counts already weighted by their cache multiplier). To turn net_savings into dollars, multiply it by your model's price per input token :
dollars saved ≈ net_savings × (input token price)
For example, at an input price of $3 / 1M tokens, a net_savings of 1_200_000 is about 1_200_000 × $3 / 1_000_000 = $3.60 saved that session.
About
Keeps your Claude session warm for you
Topics
ai-agents claude-code
Resources
Readme
MIT license
Activity
Stars
131 stars
Watchers
1 watching
Forks
5 forks
Report repository
Releases
Contributors
Languages

## extraction_diagnostics

- extraction_method: main
- readability_score: 91
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":7341,"paragraph_count":72,"sentence_count":44,"boilerplate_hits":2,"symbol_ratio":0.0069,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   Claude-thermos 通过本地反向代理监控 Claude Code 会话，在主智能体因等待子智能体而空闲超过 5 分钟时，自动发送预热请求刷新提示缓存。实测约 185 次本地会话中，缓存过期导致的重新编码占账单约 22%。工具以 uvx 运行，支持自定义空闲阈值和预热间隔。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   izeigerman claude-thermos Public Notifications You must be signed in to change notification settings Fork Star 131 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 43 Commits 43 Commits .

3. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   github/ workflows .

4. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   github/ workflows src/ claude_thermos src/ claude_thermos tests tests .

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   gitignore LICENSE LICENSE Makefile Makefile README.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   lock View all files Repository files navigation claude-thermos Stop paying to rebuild your Claude Code cache.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Anthropic, GitHub
- products: Claude, claude, agent, agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 计费 / 预算管理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 财务 / 预算
- numbers: 5, 185 次, 22%, 131
m, 43, 5 m, 20%, 3.11
- quotes:  fix the bug  / still active /  fix the bug 

## evidence_seed

- company_actions: izeigerman claude-thermos Public Notifications You must be signed in to change notification settings Fork Star 131 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 43 Commits 43 Commits . / gitignore LICENSE LICENSE Makefile Makefile README. / lock View all files Repository files navigation claude-thermos Stop paying to rebuild your Claude Code cache.
- case_details: 暂无公开信息
- workflow_changes: github/ workflows . / github/ workflows src/ claude_thermos src/ claude_thermos tests tests .
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context,adoption_context
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
- discovery_record: {"discovery_title":"Claude-thermos：保持 Claude 会话缓存热度，避免重新编码费用","discovery_summary":"Claude-thermos 通过本地反向代理监控 Claude Code 会话，在主智能体因等待子智能体而空闲超过 5 分钟时，自动发送预热请求刷新提示缓存。实测约 185 次本地会话中，缓存过期导致的重新编码占账单约 22%。工具以 uvx 运行，支持自定义空闲阈值和预热间隔。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/izeigerman/claude-thermos","discovered_at":"2026-07-25T02:16:33.204Z","rank_on_page":277,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Claude-thermos 通过本地反向代理监控 Claude Code 会话，在主智能体因等待子智能体而空闲超过 5 分钟时，自动发送预热请求刷新提示缓存。实测约 185 次本地会话中，缓存过期导致的重新编码占账单约 22%。工具以 uvx 运行，支持自定义空闲阈值和预热间隔。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
