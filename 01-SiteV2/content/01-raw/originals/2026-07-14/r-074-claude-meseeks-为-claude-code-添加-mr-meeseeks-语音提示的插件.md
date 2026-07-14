---
schema_version: raw-evidence-v2
raw_id: R-074
title: "claude-meseeks：为 Claude Code 添加 Mr. Meeseeks 语音提示的插件"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://github.com/thephw/claude-meseeks"
canonical_url: "https://github.com/thephw/claude-meseeks"
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
published_at: "2026-07-14T00:29:27.586Z"
collected_at: 2026-07-14T01:56:51.756Z
language: mixed
full_text_hash: 86d337eafd878030
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-14/r-074-claude-meseeks-为-claude-code-添加-mr-meeseeks-语音提示的插件.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-14/r-074-claude-meseeks-为-claude-code-添加-mr-meeseeks-语音提示的插件.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":7064,"paragraph_count":92,"sentence_count":68,"boilerplate_hits":2,"symbol_ratio":0.003,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 7064
fetch_error: ""
evidence_strength: blocked
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["index_only_or_directory_page"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"86d337eafd878030","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"claude-meseeks：为 Claude Code 添加 Mr. Meeseeks 语音提示的插件","discovery_summary":"claude-meseeks 是一款 Claude Code 插件，在 Claude 等待用户输入时播放《瑞克和莫蒂》中 Mr. Meeseeks 的语音片段。它通过 Notification 事件过滤，仅在 Claude 完成任务（播放\"完成\"音效）或需要审批（播放\"请求\"音效）时触发，自主工作等场景保持静音。用户可通过插件配置独立开关三类音效（done/asking/feedback）。音频文件嵌入在 Go 二进制文件中，macOS 无需额外依赖，Linux 需安装 ffmpeg 或 mpg123。插件还提供 `meeseeks` 命令行工具，支持手动播放指定类别或具体片段。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/thephw/claude-meseeks","discovered_at":"2026-07-14T01:48:14.365Z","rank_on_page":28,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 935a3aca4bd073e4
content_hash: 86d337eafd878030
semantic_hash: 30928a0e1477caf3
duplicate_of: ""
first_seen_at: "2026-07-14T00:29:27.586Z"
last_seen_at: 2026-07-14T01:56:51.756Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":true,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Anthropic","GitHub"],"products":["claude","Claude","CLAUDE","agent"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["123","46\nm","14","0","3","46","0.2","8"],"quotes":["音效）或需要审批（播放","I'm Mr. Meeseeks! Look at me!","All done!","Ooh yeah!","Yes siree!"]}
evidence_seed: {"company_actions":["thephw claude-meseeks Public Notifications You must be signed in to change notification settings Fork Star 46 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 14 Commits 14 Commits .","tool-versions CLAUDE.","md LICENSE LICENSE README."],"case_details":[],"workflow_changes":["github/ workflows .","github/ workflows audio audio bin bin hooks hooks scripts scripts ."],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"quote","text":"claude-meseeks 是一款 Claude Code 插件，在 Claude 等待用户输入时播放《瑞克和莫蒂》中 Mr. Meeseeks 的语音片段。它通过 Notification 事件过滤，仅在 Claude 完成任务（播放\"完成\"音效）或需要审批（播放\"请求\"音效）时触发，自主工作等场景保持静音。用户可通过插件配置独立开关三类音效（done/asking/feedback）。音频文件嵌入在 Go 二进制文件中，macOS 无需额外依赖，Linux 需安装 ffmpeg 或 mpg123。插件还提供 `meeseeks` 命令行工具，支持手动播放指定类别或具体片段。","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"thephw claude-meseeks Public Notifications You must be signed in to change notification settings Fork Star 46 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 14 Commits 14 Commits .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"workflow_change","text":"github/ workflows .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"github/ workflows audio audio bin bin hooks hooks scripts scripts .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"tool-versions CLAUDE.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"md LICENSE LICENSE README.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-14T01:56:51.756Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# claude-meseeks：为 Claude Code 添加 Mr. Meeseeks 语音提示的插件

## clean_text

thephw
claude-meseeks
Public
Notifications
You must be signed in to change notification settings
Fork
Star
46
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
14 Commits
14 Commits
.claude-plugin
.claude-plugin
.github/ workflows
.github/ workflows
audio
audio
bin
bin
hooks
hooks
scripts
scripts
.gitignore
.gitignore
.tool-versions
.tool-versions
CLAUDE.md
CLAUDE.md
LICENSE
LICENSE
README.md
README.md
claude-meseeks
claude-meseeks
detach_unix.go
detach_unix.go
detach_windows.go
detach_windows.go
go.mod
go.mod
main.go
main.go
main_test.go
main_test.go
player.go
player.go
View all files
Repository files navigation
claude-meseeks 🔵
"I'm Mr. Meeseeks! Look at me!"
A Claude Code plugin that plays a Mr. Meeseeks voice line
whenever Claude is genuinely waiting on you .
When Claude finishes and is waiting for your next prompt → a satisfied/finished clip
from audio/done/ ( "All done!" , "Ooh yeah!" , "Yes siree!" …).
When Claude needs your approval → an asking/coaching clip from audio/asking/
( "Can you help me?" , "You mind if we get back to the task?" …).
Both are driven by the Notification event, filtered by notification_type so it fires
only when you're actually needed. Autonomous work — auto-accept/bypass-permissions runs,
background-agent and subagent activity, auth refreshes — stays silent . Clips are random
within the category, and playback is detached and non-blocking, so a long line never freezes
your prompt.
Install
This repository is both the plugin and its own marketplace.
/plugin marketplace add thephw/claude-meseeks
/plugin install mr-meeseeks@claude-meseeks
Or, from a local clone:
/plugin marketplace add /path/to/claude-meseeks
/plugin install mr-meeseeks@claude-meseeks
Restart or reload Claude Code and finish a turn — you should hear Meeseeks.
Requirements
An audio player on your PATH . The tool auto-detects, in order:
afplay (macOS, built in) → ffplay → mpg123 → paplay → aplay → Windows PowerShell
Media.SoundPlayer . On macOS nothing extra is needed. On Linux, install ffmpeg
(for ffplay ) or mpg123 .
No Go toolchain is required to use the plugin — prebuilt binaries ship in bin/ . Go is
only needed to rebuild them (see below).
The meeseeks CLI
Playback is handled by a small Go program, meeseeks , with the clips embedded directly in
the binary. You can drive it by hand too:
meeseeks play # random "done" clip, detached
meeseeks play asking # random "asking" clip
meeseeks play feedback --wait # a prompt-submit clip, blocking until it finishes
meeseeks play --clip "ALL DONE" # a specific clip by name
meeseeks list all # list every embedded clip
How it works
hooks/hooks.json registers Notification and UserPromptSubmit hooks that both run
scripts/play.sh notify . That launcher execs the prebuilt bin/meeseeks-<os>-<arch> for
your platform (falling back to go build from source if there's no matching binary, or
staying silent if neither is available), passing the event's JSON through on stdin.
meeseeks notify reads that JSON and looks at hook_event_name and notification_type :
Event
Result
UserPromptSubmit (you just sent Claude a prompt)
random feedback
Notification + idle_prompt (Claude done, your turn)
random done
Notification + permission_prompt (needs approval)
random asking
anything else ( agent_completed , auth_success , …)
silence
The chosen clip is extracted from the embedded audio to a cache dir and handed to a system
player in a detached process. Every path exits 0, so the hook never blocks or errors your
session.
Each category can be silenced independently via the plugin's config options
( enableDone / enableAsking / enableFeedback ) — Claude Code prompts for these when you
enable the plugin, and passes them to the hook as CLAUDE_PLUGIN_OPTION_* env vars. They
default to on; only automatic hook playback is gated (manual meeseeks play always plays).
Why not the Stop hook? Stop fires at the end of every turn — including
auto-continuations — so it plays sounds when you aren't actually being waited on. The
event-type filter is the reliable signal for "it's your turn."
Customizing clips
Clips live under audio/ , sorted into three folders that map to behavior:
audio/done/ — played when Claude finishes and it's your turn (idle prompt).
audio/asking/ — played on permission/input prompts.
audio/feedback/ — played every time you submit a prompt to Claude.
To change what plays, move .mp3 files between the folders or drop your own in, then
rebuild the binaries so the new clips are re-embedded:
./scripts/build.sh # regenerates bin/ for all platforms
Two constraints: filenames must end in .mp3 , and — because of a go:embed restriction —
must not contain apostrophes ( ' ).
Why Meeseeks? On single-purpose sessions
The theme isn't just a joke — it's a working philosophy.
A Mr. Meeseeks is summoned to accomplish one task . It exists only until that task is
done, and then it poofs out of existence, satisfied. Give a Meeseeks a single, concrete goal
("help me finish this putt") and it's cheerful and effective. Give it a vague or unbounded
one, or keep it alive long past its purpose, and things degrade fast — "existence is
pain, Jerry!" — until you get a room full of increasingly unhinged Meeseeks.
A Claude Code session works best the same way:
Summon it for one goal. A session scoped to a single, well-defined objective —
"add this endpoint", "fix this failing test", "write this plugin" — is focused and sharp,
the same way a fresh Meeseeks is.
Let it finish, then let it go. When the goal is met, end the session. Start a new one
for the next task. A fresh session with a clean context beats a stale one every time.
Beware the long-lived session. Dragging one conversation across many unrelated goals
is how you get the Meeseeks box problem: context piles up, focus drifts, earlier tangents
pollute later work, and quality slides. Long ≠ productive.
So: treat each session like a Meeseeks. One purpose. Accomplish it. Poof. 🔵
Credits
Inspired by and audio sourced from the
Mr. Meeseeks Soundboard at jayuzumi.com.
Thanks for the clips! 🔵
Note on the audio
The voice clips are from Rick and Morty (via the
jayuzumi.com Mr. Meeseeks Soundboard ) and are
included here for personal, non-commercial fun. They are the property of their respective
rights holders. Please consider those rights before redistributing this plugin publicly or
swap in your own audio.
About
Claude Code plugin that plays a Mr. Meeseeks voice line whenever Claude is waiting for you.
Topics
audio
hooks
fun
rick-and-morty
claude
meeseeks
anthropic
claude-code
claude-code-plugin
Resources
Readme
License
View license
Uh oh!
There was an error while loading. Please reload this page .
Activity
Stars
46
stars
Watchers
watching
Forks
fork
Report repository
Releases
v0.2.0 — Embedded Go meeseeks CLI
Latest
Jul 8, 2026
Packages
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .
Languages
Go
87.5%
Shell
12.5%

## full_text

thephw
claude-meseeks
Public
Notifications
You must be signed in to change notification settings
Fork
Star
46
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
14 Commits
14 Commits
.claude-plugin
.claude-plugin
.github/ workflows
.github/ workflows
audio
audio
bin
bin
hooks
hooks
scripts
scripts
.gitignore
.gitignore
.tool-versions
.tool-versions
CLAUDE.md
CLAUDE.md
LICENSE
LICENSE
README.md
README.md
claude-meseeks
claude-meseeks
detach_unix.go
detach_unix.go
detach_windows.go
detach_windows.go
go.mod
go.mod
main.go
main.go
main_test.go
main_test.go
player.go
player.go
View all files
Repository files navigation
claude-meseeks 🔵
"I'm Mr. Meeseeks! Look at me!"
A Claude Code plugin that plays a Mr. Meeseeks voice line
whenever Claude is genuinely waiting on you .
When Claude finishes and is waiting for your next prompt → a satisfied/finished clip
from audio/done/ ( "All done!" , "Ooh yeah!" , "Yes siree!" …).
When Claude needs your approval → an asking/coaching clip from audio/asking/
( "Can you help me?" , "You mind if we get back to the task?" …).
Both are driven by the Notification event, filtered by notification_type so it fires
only when you're actually needed. Autonomous work — auto-accept/bypass-permissions runs,
background-agent and subagent activity, auth refreshes — stays silent . Clips are random
within the category, and playback is detached and non-blocking, so a long line never freezes
your prompt.
Install
This repository is both the plugin and its own marketplace.
/plugin marketplace add thephw/claude-meseeks
/plugin install mr-meeseeks@claude-meseeks
Or, from a local clone:
/plugin marketplace add /path/to/claude-meseeks
/plugin install mr-meeseeks@claude-meseeks
Restart or reload Claude Code and finish a turn — you should hear Meeseeks.
Requirements
An audio player on your PATH . The tool auto-detects, in order:
afplay (macOS, built in) → ffplay → mpg123 → paplay → aplay → Windows PowerShell
Media.SoundPlayer . On macOS nothing extra is needed. On Linux, install ffmpeg
(for ffplay ) or mpg123 .
No Go toolchain is required to use the plugin — prebuilt binaries ship in bin/ . Go is
only needed to rebuild them (see below).
The meeseeks CLI
Playback is handled by a small Go program, meeseeks , with the clips embedded directly in
the binary. You can drive it by hand too:
meeseeks play # random "done" clip, detached
meeseeks play asking # random "asking" clip
meeseeks play feedback --wait # a prompt-submit clip, blocking until it finishes
meeseeks play --clip "ALL DONE" # a specific clip by name
meeseeks list all # list every embedded clip
How it works
hooks/hooks.json registers Notification and UserPromptSubmit hooks that both run
scripts/play.sh notify . That launcher execs the prebuilt bin/meeseeks-<os>-<arch> for
your platform (falling back to go build from source if there's no matching binary, or
staying silent if neither is available), passing the event's JSON through on stdin.
meeseeks notify reads that JSON and looks at hook_event_name and notification_type :
Event
Result
UserPromptSubmit (you just sent Claude a prompt)
random feedback
Notification + idle_prompt (Claude done, your turn)
random done
Notification + permission_prompt (needs approval)
random asking
anything else ( agent_completed , auth_success , …)
silence
The chosen clip is extracted from the embedded audio to a cache dir and handed to a system
player in a detached process. Every path exits 0, so the hook never blocks or errors your
session.
Each category can be silenced independently via the plugin's config options
( enableDone / enableAsking / enableFeedback ) — Claude Code prompts for these when you
enable the plugin, and passes them to the hook as CLAUDE_PLUGIN_OPTION_* env vars. They
default to on; only automatic hook playback is gated (manual meeseeks play always plays).
Why not the Stop hook? Stop fires at the end of every turn — including
auto-continuations — so it plays sounds when you aren't actually being waited on. The
event-type filter is the reliable signal for "it's your turn."
Customizing clips
Clips live under audio/ , sorted into three folders that map to behavior:
audio/done/ — played when Claude finishes and it's your turn (idle prompt).
audio/asking/ — played on permission/input prompts.
audio/feedback/ — played every time you submit a prompt to Claude.
To change what plays, move .mp3 files between the folders or drop your own in, then
rebuild the binaries so the new clips are re-embedded:
./scripts/build.sh # regenerates bin/ for all platforms
Two constraints: filenames must end in .mp3 , and — because of a go:embed restriction —
must not contain apostrophes ( ' ).
Why Meeseeks? On single-purpose sessions
The theme isn't just a joke — it's a working philosophy.
A Mr. Meeseeks is summoned to accomplish one task . It exists only until that task is
done, and then it poofs out of existence, satisfied. Give a Meeseeks a single, concrete goal
("help me finish this putt") and it's cheerful and effective. Give it a vague or unbounded
one, or keep it alive long past its purpose, and things degrade fast — "existence is
pain, Jerry!" — until you get a room full of increasingly unhinged Meeseeks.
A Claude Code session works best the same way:
Summon it for one goal. A session scoped to a single, well-defined objective —
"add this endpoint", "fix this failing test", "write this plugin" — is focused and sharp,
the same way a fresh Meeseeks is.
Let it finish, then let it go. When the goal is met, end the session. Start a new one
for the next task. A fresh session with a clean context beats a stale one every time.
Beware the long-lived session. Dragging one conversation across many unrelated goals
is how you get the Meeseeks box problem: context piles up, focus drifts, earlier tangents
pollute later work, and quality slides. Long ≠ productive.
So: treat each session like a Meeseeks. One purpose. Accomplish it. Poof. 🔵
Credits
Inspired by and audio sourced from the
Mr. Meeseeks Soundboard at jayuzumi.com.
Thanks for the clips! 🔵
Note on the audio
The voice clips are from Rick and Morty (via the
jayuzumi.com Mr. Meeseeks Soundboard ) and are
included here for personal, non-commercial fun. They are the property of their respective
rights holders. Please consider those rights before redistributing this plugin publicly or
swap in your own audio.
About
Claude Code plugin that plays a Mr. Meeseeks voice line whenever Claude is waiting for you.
Topics
audio
hooks
fun
rick-and-morty
claude
meeseeks
anthropic
claude-code
claude-code-plugin
Resources
Readme
License
View license
Uh oh!
There was an error while loading. Please reload this page .
Activity
Stars
46
stars
Watchers
watching
Forks
fork
Report repository
Releases
v0.2.0 — Embedded Go meeseeks CLI
Latest
Jul 8, 2026
Packages
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .
Languages
Go
87.5%
Shell
12.5%

## extraction_diagnostics

- extraction_method: main
- readability_score: 91
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":7064,"paragraph_count":92,"sentence_count":68,"boilerplate_hits":2,"symbol_ratio":0.003,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=medium｜confidence=high
   claude-meseeks 是一款 Claude Code 插件，在 Claude 等待用户输入时播放《瑞克和莫蒂》中 Mr. Meeseeks 的语音片段。它通过 Notification 事件过滤，仅在 Claude 完成任务（播放"完成"音效）或需要审批（播放"请求"音效）时触发，自主工作等场景保持静音。用户可通过插件配置独立开关三类音效（done/asking/feedback）。音频文件嵌入在 Go 二进制文件中，macOS 无需额外依赖，Linux 需安装 ffmpeg 或 mpg123。插件还提供 `meeseeks` 命令行工具，支持手动播放指定类别或具体片段。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   thephw claude-meseeks Public Notifications You must be signed in to change notification settings Fork Star 46 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 14 Commits 14 Commits .

3. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   github/ workflows .

4. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   github/ workflows audio audio bin bin hooks hooks scripts scripts .

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   tool-versions CLAUDE.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   md LICENSE LICENSE README.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Anthropic, GitHub
- products: claude, Claude, CLAUDE, agent
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 123, 46
m, 14, 0, 3, 46, 0.2, 8
- quotes: 音效）或需要审批（播放 / I'm Mr. Meeseeks! Look at me! / All done! / Ooh yeah! / Yes siree!

## evidence_seed

- company_actions: thephw claude-meseeks Public Notifications You must be signed in to change notification settings Fork Star 46 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 14 Commits 14 Commits . / tool-versions CLAUDE. / md LICENSE LICENSE README.
- case_details: 暂无公开信息
- workflow_changes: github/ workflows . / github/ workflows audio audio bin bin hooks hooks scripts scripts .
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
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

- viewpoint: true
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
- discovery_record: {"discovery_title":"claude-meseeks：为 Claude Code 添加 Mr. Meeseeks 语音提示的插件","discovery_summary":"claude-meseeks 是一款 Claude Code 插件，在 Claude 等待用户输入时播放《瑞克和莫蒂》中 Mr. Meeseeks 的语音片段。它通过 Notification 事件过滤，仅在 Claude 完成任务（播放\"完成\"音效）或需要审批（播放\"请求\"音效）时触发，自主工作等场景保持静音。用户可通过插件配置独立开关三类音效（done/asking/feedback）。音频文件嵌入在 Go 二进制文件中，macOS 无需额外依赖，Linux 需安装 ffmpeg 或 mpg123。插件还提供 `meeseeks` 命令行工具，支持手动播放指定类别或具体片段。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/thephw/claude-meseeks","discovered_at":"2026-07-14T01:48:14.365Z","rank_on_page":28,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

claude-meseeks 是一款 Claude Code 插件，在 Claude 等待用户输入时播放《瑞克和莫蒂》中 Mr. Meeseeks 的语音片段。它通过 Notification 事件过滤，仅在 Claude 完成任务（播放"完成"音效）或需要审批（播放"请求"音效）时触发，自主工作等场景保持静音。用户可通过插件配置独立开关三类音效（done/asking/feedback）。音频文件嵌入在 Go 二进制文件中，macOS 无需额外依赖，Linux 需安装 ffmpeg 或 mpg123。插件还提供 `meeseeks` 命令行工具，支持手动播放指定类别或具体片段。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
