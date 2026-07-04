---
schema_version: raw-evidence-v2
raw_id: R-061
title: "pxpipe：通过图像化压缩输入token降低Claude Code成本"
title_zh: "pxpipe：通过图像化压缩输入token降低Claude Code成本"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://github.com/teamchong/pxpipe"
canonical_url: "https://github.com/teamchong/pxpipe"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: developer
source_level: B
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
published_at: "2026-07-03T19:19:45.726Z"
collected_at: 2026-07-04T04:50:50.466Z
language: mixed
full_text_hash: 847298a0c2646e80
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-061-pxpipe-通过图像化压缩输入token降低claude-code成本.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-04/r-061-pxpipe-通过图像化压缩输入token降低claude-code成本.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":10672,"paragraph_count":149,"sentence_count":80,"boilerplate_hits":2,"symbol_ratio":0.0047,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 10672
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"847298a0c2646e80","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"pxpipe：通过图像化压缩输入token降低Claude Code成本","discovery_summary":"pxpipe是一个本地代理，将系统提示、工具文档和历史记录等密集文本渲染为PNG图像，利用图像token成本取决于像素尺寸的特性压缩输入token。在Fable 5模型上，约25k文本token压缩为约2.7k图像token，端到端账单降低59-70%。SWE-bench Lite 10个实例全部通过，成本从$54降至$27；SWE-bench Pro 19对测试中18对判定一致，单次请求成本降低约60%。该方法有损（精确ID等需保持文本），默认仅处理`claude-fable-5`请求，可通过`PXPIPE_MODELS`变量控制。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/teamchong/pxpipe","discovered_at":"2026-07-04T03:11:32.649Z","rank_on_page":70,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 1320ae46b426dee5
content_hash: 847298a0c2646e80
semantic_hash: 205e74f20bcea986
duplicate_of: ""
first_seen_at: "2026-07-03T19:19:45.726Z"
last_seen_at: 2026-07-04T04:50:50.466Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["emerging_pool","user_feedback_pool","watchlist"]
change_action_detected: false
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Anthropic","GitHub"],"products":["Claude","claude","agent","gpt-5"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":["计费 / 预算管理"],"business_actions":["发布 / 推出","定价 / 计费变化"],"affected_departments":["IT / 安全","财务 / 预算"],"numbers":["5","25","2.7","59","70%","10","$54","$27"],"quotes":["claude-fable-5"]}
evidence_seed: {"company_actions":["teamchong pxpipe Public Notifications You must be signed in to change notification settings Fork 25 Star 472 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 298 Commits 298 Commits .","md LICENSE LICENSE README.","yaml pnpm-workspace."],"case_details":[],"workflow_changes":["github/ workflows .","github/ workflows assets assets bench bench bin bin demo demo docs docs eval eval scripts scripts src src tests tests ."],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: ["没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"pxpipe是一个本地代理，将系统提示、工具文档和历史记录等密集文本渲染为PNG图像，利用图像token成本取决于像素尺寸的特性压缩输入token。在Fable 5模型上，约25k文本token压缩为约2.7k图像token，端到端账单降低59-70%。SWE-bench Lite 10个实例全部通过，成本从$54降至$27；SWE-bench Pro 19对测试中18对判定一致，单次请求成本降低约60%。该方法有损（精确ID等需保持文本），默认仅处理`claude-fable-5`请求，可通过`PXPIPE_MODELS`变量控制。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"teamchong pxpipe Public Notifications You must be signed in to change notification settings Fork 25 Star 472 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 298 Commits 298 Commits .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"workflow_change","text":"github/ workflows .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"github/ workflows assets assets bench bench bin bin demo demo docs docs eval eval scripts scripts src src tests tests .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"md LICENSE LICENSE README.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"yaml pnpm-workspace.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-04T04:50:50.466Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# pxpipe：通过图像化压缩输入token降低Claude Code成本

## clean_text

teamchong
pxpipe
Public
Notifications
You must be signed in to change notification settings
Fork
25
Star
472
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
298 Commits
298 Commits
.github/ workflows
.github/ workflows
assets
assets
bench
bench
bin
bin
demo
demo
docs
docs
eval
eval
scripts
scripts
src
src
tests
tests
.gitignore
.gitignore
.npmrc
.npmrc
CHANGELOG.md
CHANGELOG.md
FINDINGS.md
FINDINGS.md
LICENSE
LICENSE
README.md
README.md
package.json
package.json
pnpm-lock.yaml
pnpm-lock.yaml
pnpm-workspace.yaml
pnpm-workspace.yaml
tsconfig.json
tsconfig.json
vitest.config.ts
vitest.config.ts
wrangler.toml
wrangler.toml
View all files
Repository files navigation
pxpipe
Cut Claude Code's input tokens by rendering bulky context as images — the same system prompt, tool docs, and history, in a fraction of the tokens.
An image's token cost is fixed by its pixel dimensions, not by how much text
is inside it. Dense content (code, JSON, tool output) packs ~3.1 chars per
image-token vs ~1 char per text-token on real Claude Code traffic. pxpipe is
a local proxy that exploits the gap: it rewrites the bulky parts of each
request into compact PNGs before it leaves your machine. At current Fable
list prices that lands as a ~59–70% lower end-to-end bill — but prices
move and workloads differ, so the durable number is the token cut itself,
measured per-request against a free count_tokens counterfactual in
~/.pxpipe/events.jsonl .
This is what the model sees instead of text:
~48k chars of system prompt + tool docs: ≈25k tokens as text, ≈2.7k image
tokens as this page. Real pipeline output; the model reads renders like this
at 100/100 (see benchmarks).
Demo
Fable 5 (the default, 100/100 reader) — plain left, pxpipe right:
Fable-AB-Demo.mp4
pxpipe counts an exact token 10/10 across 39 imaged filler files
(matches grep line-for-line), gets the multi-step ledger arithmetic right,
and ends the session at $6.06 with context to spare (73.5k/1M) vs
$42.21 at 96% full. One caveat visible in the clip: the pxpipe arm
needed a nudge to match the requested one-line output format.
Opus 4.8 (disabled by default) — same layout:
Opus-AB-Demo.mp4
Text needles read fine on both arms; the imaged phrase-count doesn't read on
Opus — and pxpipe says so instead of fabricating a number . That misread
rate is why Opus is opt-in.
Try it (30 seconds)
npx pxpipe-proxy # proxy on 127.0.0.1:47821
ANTHROPIC_BASE_URL=http://127.0.0.1:47821 claude # point Claude Code at it
Dashboard at http://127.0.0.1:47821/ : tokens saved, every text→image
conversion side by side, kill switch, live model chips. Responses stream
normally — pxpipe compresses the request only, never the model's output.
Recent turns stay text; the system prompt, tool docs, and older bulk history
are imaged.
The honest part
It is lossy. Exact 12-char hex strings in dense imaged content:
13/15 on Fable 5, 0/15 on Opus — and misses are silent
confabulations , not errors. Byte-exact values (IDs, hashes, secrets)
must stay text; recent turns do. A dedicated verbatim-risk guard is not
built yet.
Escape hatch: subagents on non-allowlisted models pass through as
text — route byte-exact work there
( CLAUDE_CODE_SUBAGENT_MODEL=claude-sonnet-4-6 , or model: sonnet in
agent frontmatter).
Real work: SWE-bench Lite pilot 10/10 both arms at −65% request
size; SWE-bench Pro 14/19 ON vs 15/19 OFF at −60%, verdicts agree
18/19, and the single split re-resolved 3/3 on replication — run-to-run
variance, not compression. Small n; receipts in eval/ .
Workload-dependent. Wins on token-dense content (~1 char/token),
loses money on sparse prose (~3.5 chars/token); a profitability gate
(calibrated on N=391 production rows) images only where the math wins.
Model scope: default PXPIPE_MODELS=claude-fable-5,gpt-5.6 . Opus
4.7/4.8 misread ~7% of renders and GPT 5.5 degrades on imaged context, so
both are opt-in via PXPIPE_MODELS or the dashboard chips.
PXPIPE_MODELS=off disables imaging. Everything else passes through
byte-identical. On the GPT path, tool definitions stay native JSON and no
Anthropic cache_control markers are used.
Benchmarks (reproducible)
Measured with novel random-number problems the model cannot have memorized:
test
text
pxpipe (image)
tokens
novel arithmetic, claude-fable-5
100
100%
100%
−38%
novel arithmetic, claude-opus-4-8
100
100%
93%
−38%
gist recall A/B (decisions, values, paths, names, negations; with distractors; 15k-45k char sessions), Fable 5
98/arm
98/98
98/98
state tracking (value mutated 3x, final/first/count), Fable 5
18/arm
18/18
18/18
confabulation on never-stated facts (lower is better), Fable 5
16/arm
0/16
0/16
verbatim 12-char hex recall, dense render, Opus
15
15/15
0/15
verbatim 12-char hex recall, dense render, Fable 5
15
13/15
SWE-bench run totals, receipts, and caveats:
eval/swe-bench/ ·
eval/swe-bench-pro/ ·
eval/needle-haystack/ ·
eval/gist-recall/ · analysis in
FINDINGS.md . (GSM8K scored 96% imaged, but it's in training
data — memorized answers survive misreads — so we lead with the novel-number
evals.)
How it works
tool_result string ──► wrap at 1928px-wide columns ──► pack ~92,000 chars/page ──► PNG[]
The proxy intercepts /v1/messages , rewrites eligible bulk into image
blocks, splices them back cache-friendly (static prefix preserved, prompt
caching keeps working), and forwards. A 1928×1928 image costs ≈4,761 vision
tokens and holds ≈92,000 chars, so text wins only above ~19 chars/token —
Claude Code traffic runs ~1.91 (N=391). A per-request estimator decides;
sparse prose stays text. Events log to ~/.pxpipe/events.jsonl .
Library use (no proxy)
import { renderTextToPngs , transformAnthropicMessages } from "pxpipe" ;
const imgs = await renderTextToPngs ( toolResultText ) ; // RenderedImage[]
const { body , applied , info } = await transformAnthropicMessages ( {
body : requestBytes ,
model : "claude-fable-5" ,
} ) ;
options.keepSharp(block) pins blocks as text; options.emitRecoverable
returns the originals of imaged blocks. Pure-JS runtime (Node and
edge/Workers); @napi-rs/canvas is build-time only. Full API:
src/core/index.ts .
Development
pnpm install && pnpm test
pnpm run build # regenerates dist/
FAQ
Is the headline end-to-end, or only on the requests you touched?
End-to-end, the whole bill. Most compression tools report savings only on
the input slice they touched, which flatters the number. The end-to-end
denominator is every production request: the small ones pxpipe correctly
left untouched, all cache writes and reads, and all output tokens (which the
proxy never compresses). On a 13,709-request snapshot that was 59% ($100 →
~$41); a later 8,904-compressed-request trace measured ~70%. Compressed-only
runs higher (~72–74%) and is quoted separately, never as the headline. The
exact figure is workload-dependent — reproduce it on your own log.
How is the math measured?
Both sides of the same request, at the same moment. For every /v1/messages
POST the proxy fires a free count_tokens probe on the original uncompressed
body (the counterfactual) in parallel with the real forward, and reads
Anthropic's actually-billed usage block off the response. Both land in the
same row of ~/.pxpipe/events.jsonl , so there is no turn-count or
run-to-run confound. Dollar conversion uses Fable 5 list ratios: input ×1.0,
cache write ×1.25, cache read ×0.1, output ×5. Cache pricing is applied
identically to both sides, so the caching discount cancels and cannot be
double-counted as "savings". Re-derive it yourself from the events log: the
formula and field names are documented in src/core/baseline.ts .
What does it actually compress?
Three kinds of input blocks, each behind a profitability gate:
large tool_result bodies (file reads, command output, logs) above
~6k chars of token-dense content
older collapsed history: turns behind the live tail get re-rendered as
image pages, recent turns always stay text
the static system prompt + tool docs slab
Everything else passes through byte-identical: your messages, recent turns,
the model's output (it is the response, the proxy never touches it), sparse
prose, and anything too small to win. Models outside the allowlist pass
through entirely — the default scope is Fable 5 and GPT 5.6 only. Opus 4.8
and GPT 5.5 read imaged content measurably worse (FINDINGS.md 2026-06-16),
so they are deliberately opt-in via the dashboard or PXPIPE_MODELS , never
silently imaged.
Has it ever failed for real, outside the benchmarks?
Yes, once in weeks of daily use: the model recalled a person's name from
imaged chat history and got it confidently wrong. No error, just a
plausible wrong name. That is the documented failure mode: exact strings
in imaged content are not byte-safe. Coding sessions tolerate this because
the agent re-reads files before editing; pure chat recall has no such check.
This failure mode is measured, not anecdotal:
the legibility audit quantifies
exact-string recall off rendered pages (blind reads top out at 63% on dense
identifiers, with every miss predicted by a glyph-confusability matrix) and
documents the shipped mitigations — page geometry clamped to the API's
resample cap so billed pixels actually reach the vision encoder, and exact
identifiers (SHAs, numbers) riding alongside as text.
Why does the README read like an AI wrote it?
Because one did. Most of this repo's commits — the code and the docs — were
authored by Opus/Fable agent sessions running behind pxpipe itself, reading
their own collapsed history as image pages while they worked.
Limitations
Lossy (above); verbatim recall from images is unreliable.
PNG encoding adds latency to large requests before they leave.
ASCII/Latin-1 well tested; CJK works but conservatively.
Roadmap
Hypotheses, not claims — they ship as numbers with an n or they get cut:
sharper glyph rendering ( eval/glyph-matrix/ , paused mid-run), whether
imaged bulk stretches effective context (~2x the real content in the same
1M window), and whether a smaller active context improves long-task
accuracy.
License
MIT.
About
cut Fable 5 token usage by rendering text context as images
Resources
Readme
License
MIT license
Uh oh!
There was an error while loading. Please reload this page .
Activity
Stars
472
stars
Watchers
watching
Forks
25
forks
Report repository
Releases
v0.7.1
Latest
Jul 3, 2026
+ 1 release
Packages
Uh oh!
There was an error while loading. Please reload this page .
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .
Languages
TypeScript
96.1%
JavaScript
1.8%
Shell
1.1%
Python
1.0%

## full_text

teamchong
pxpipe
Public
Notifications
You must be signed in to change notification settings
Fork
25
Star
472
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
298 Commits
298 Commits
.github/ workflows
.github/ workflows
assets
assets
bench
bench
bin
bin
demo
demo
docs
docs
eval
eval
scripts
scripts
src
src
tests
tests
.gitignore
.gitignore
.npmrc
.npmrc
CHANGELOG.md
CHANGELOG.md
FINDINGS.md
FINDINGS.md
LICENSE
LICENSE
README.md
README.md
package.json
package.json
pnpm-lock.yaml
pnpm-lock.yaml
pnpm-workspace.yaml
pnpm-workspace.yaml
tsconfig.json
tsconfig.json
vitest.config.ts
vitest.config.ts
wrangler.toml
wrangler.toml
View all files
Repository files navigation
pxpipe
Cut Claude Code's input tokens by rendering bulky context as images — the same system prompt, tool docs, and history, in a fraction of the tokens.
An image's token cost is fixed by its pixel dimensions, not by how much text
is inside it. Dense content (code, JSON, tool output) packs ~3.1 chars per
image-token vs ~1 char per text-token on real Claude Code traffic. pxpipe is
a local proxy that exploits the gap: it rewrites the bulky parts of each
request into compact PNGs before it leaves your machine. At current Fable
list prices that lands as a ~59–70% lower end-to-end bill — but prices
move and workloads differ, so the durable number is the token cut itself,
measured per-request against a free count_tokens counterfactual in
~/.pxpipe/events.jsonl .
This is what the model sees instead of text:
~48k chars of system prompt + tool docs: ≈25k tokens as text, ≈2.7k image
tokens as this page. Real pipeline output; the model reads renders like this
at 100/100 (see benchmarks).
Demo
Fable 5 (the default, 100/100 reader) — plain left, pxpipe right:
Fable-AB-Demo.mp4
pxpipe counts an exact token 10/10 across 39 imaged filler files
(matches grep line-for-line), gets the multi-step ledger arithmetic right,
and ends the session at $6.06 with context to spare (73.5k/1M) vs
$42.21 at 96% full. One caveat visible in the clip: the pxpipe arm
needed a nudge to match the requested one-line output format.
Opus 4.8 (disabled by default) — same layout:
Opus-AB-Demo.mp4
Text needles read fine on both arms; the imaged phrase-count doesn't read on
Opus — and pxpipe says so instead of fabricating a number . That misread
rate is why Opus is opt-in.
Try it (30 seconds)
npx pxpipe-proxy # proxy on 127.0.0.1:47821
ANTHROPIC_BASE_URL=http://127.0.0.1:47821 claude # point Claude Code at it
Dashboard at http://127.0.0.1:47821/ : tokens saved, every text→image
conversion side by side, kill switch, live model chips. Responses stream
normally — pxpipe compresses the request only, never the model's output.
Recent turns stay text; the system prompt, tool docs, and older bulk history
are imaged.
The honest part
It is lossy. Exact 12-char hex strings in dense imaged content:
13/15 on Fable 5, 0/15 on Opus — and misses are silent
confabulations , not errors. Byte-exact values (IDs, hashes, secrets)
must stay text; recent turns do. A dedicated verbatim-risk guard is not
built yet.
Escape hatch: subagents on non-allowlisted models pass through as
text — route byte-exact work there
( CLAUDE_CODE_SUBAGENT_MODEL=claude-sonnet-4-6 , or model: sonnet in
agent frontmatter).
Real work: SWE-bench Lite pilot 10/10 both arms at −65% request
size; SWE-bench Pro 14/19 ON vs 15/19 OFF at −60%, verdicts agree
18/19, and the single split re-resolved 3/3 on replication — run-to-run
variance, not compression. Small n; receipts in eval/ .
Workload-dependent. Wins on token-dense content (~1 char/token),
loses money on sparse prose (~3.5 chars/token); a profitability gate
(calibrated on N=391 production rows) images only where the math wins.
Model scope: default PXPIPE_MODELS=claude-fable-5,gpt-5.6 . Opus
4.7/4.8 misread ~7% of renders and GPT 5.5 degrades on imaged context, so
both are opt-in via PXPIPE_MODELS or the dashboard chips.
PXPIPE_MODELS=off disables imaging. Everything else passes through
byte-identical. On the GPT path, tool definitions stay native JSON and no
Anthropic cache_control markers are used.
Benchmarks (reproducible)
Measured with novel random-number problems the model cannot have memorized:
test
text
pxpipe (image)
tokens
novel arithmetic, claude-fable-5
100
100%
100%
−38%
novel arithmetic, claude-opus-4-8
100
100%
93%
−38%
gist recall A/B (decisions, values, paths, names, negations; with distractors; 15k-45k char sessions), Fable 5
98/arm
98/98
98/98
state tracking (value mutated 3x, final/first/count), Fable 5
18/arm
18/18
18/18
confabulation on never-stated facts (lower is better), Fable 5
16/arm
0/16
0/16
verbatim 12-char hex recall, dense render, Opus
15
15/15
0/15
verbatim 12-char hex recall, dense render, Fable 5
15
13/15
SWE-bench run totals, receipts, and caveats:
eval/swe-bench/ ·
eval/swe-bench-pro/ ·
eval/needle-haystack/ ·
eval/gist-recall/ · analysis in
FINDINGS.md . (GSM8K scored 96% imaged, but it's in training
data — memorized answers survive misreads — so we lead with the novel-number
evals.)
How it works
tool_result string ──► wrap at 1928px-wide columns ──► pack ~92,000 chars/page ──► PNG[]
The proxy intercepts /v1/messages , rewrites eligible bulk into image
blocks, splices them back cache-friendly (static prefix preserved, prompt
caching keeps working), and forwards. A 1928×1928 image costs ≈4,761 vision
tokens and holds ≈92,000 chars, so text wins only above ~19 chars/token —
Claude Code traffic runs ~1.91 (N=391). A per-request estimator decides;
sparse prose stays text. Events log to ~/.pxpipe/events.jsonl .
Library use (no proxy)
import { renderTextToPngs , transformAnthropicMessages } from "pxpipe" ;
const imgs = await renderTextToPngs ( toolResultText ) ; // RenderedImage[]
const { body , applied , info } = await transformAnthropicMessages ( {
body : requestBytes ,
model : "claude-fable-5" ,
} ) ;
options.keepSharp(block) pins blocks as text; options.emitRecoverable
returns the originals of imaged blocks. Pure-JS runtime (Node and
edge/Workers); @napi-rs/canvas is build-time only. Full API:
src/core/index.ts .
Development
pnpm install && pnpm test
pnpm run build # regenerates dist/
FAQ
Is the headline end-to-end, or only on the requests you touched?
End-to-end, the whole bill. Most compression tools report savings only on
the input slice they touched, which flatters the number. The end-to-end
denominator is every production request: the small ones pxpipe correctly
left untouched, all cache writes and reads, and all output tokens (which the
proxy never compresses). On a 13,709-request snapshot that was 59% ($100 →
~$41); a later 8,904-compressed-request trace measured ~70%. Compressed-only
runs higher (~72–74%) and is quoted separately, never as the headline. The
exact figure is workload-dependent — reproduce it on your own log.
How is the math measured?
Both sides of the same request, at the same moment. For every /v1/messages
POST the proxy fires a free count_tokens probe on the original uncompressed
body (the counterfactual) in parallel with the real forward, and reads
Anthropic's actually-billed usage block off the response. Both land in the
same row of ~/.pxpipe/events.jsonl , so there is no turn-count or
run-to-run confound. Dollar conversion uses Fable 5 list ratios: input ×1.0,
cache write ×1.25, cache read ×0.1, output ×5. Cache pricing is applied
identically to both sides, so the caching discount cancels and cannot be
double-counted as "savings". Re-derive it yourself from the events log: the
formula and field names are documented in src/core/baseline.ts .
What does it actually compress?
Three kinds of input blocks, each behind a profitability gate:
large tool_result bodies (file reads, command output, logs) above
~6k chars of token-dense content
older collapsed history: turns behind the live tail get re-rendered as
image pages, recent turns always stay text
the static system prompt + tool docs slab
Everything else passes through byte-identical: your messages, recent turns,
the model's output (it is the response, the proxy never touches it), sparse
prose, and anything too small to win. Models outside the allowlist pass
through entirely — the default scope is Fable 5 and GPT 5.6 only. Opus 4.8
and GPT 5.5 read imaged content measurably worse (FINDINGS.md 2026-06-16),
so they are deliberately opt-in via the dashboard or PXPIPE_MODELS , never
silently imaged.
Has it ever failed for real, outside the benchmarks?
Yes, once in weeks of daily use: the model recalled a person's name from
imaged chat history and got it confidently wrong. No error, just a
plausible wrong name. That is the documented failure mode: exact strings
in imaged content are not byte-safe. Coding sessions tolerate this because
the agent re-reads files before editing; pure chat recall has no such check.
This failure mode is measured, not anecdotal:
the legibility audit quantifies
exact-string recall off rendered pages (blind reads top out at 63% on dense
identifiers, with every miss predicted by a glyph-confusability matrix) and
documents the shipped mitigations — page geometry clamped to the API's
resample cap so billed pixels actually reach the vision encoder, and exact
identifiers (SHAs, numbers) riding alongside as text.
Why does the README read like an AI wrote it?
Because one did. Most of this repo's commits — the code and the docs — were
authored by Opus/Fable agent sessions running behind pxpipe itself, reading
their own collapsed history as image pages while they worked.
Limitations
Lossy (above); verbatim recall from images is unreliable.
PNG encoding adds latency to large requests before they leave.
ASCII/Latin-1 well tested; CJK works but conservatively.
Roadmap
Hypotheses, not claims — they ship as numbers with an n or they get cut:
sharper glyph rendering ( eval/glyph-matrix/ , paused mid-run), whether
imaged bulk stretches effective context (~2x the real content in the same
1M window), and whether a smaller active context improves long-task
accuracy.
License
MIT.
About
cut Fable 5 token usage by rendering text context as images
Resources
Readme
License
MIT license
Uh oh!
There was an error while loading. Please reload this page .
Activity
Stars
472
stars
Watchers
watching
Forks
25
forks
Report repository
Releases
v0.7.1
Latest
Jul 3, 2026
+ 1 release
Packages
Uh oh!
There was an error while loading. Please reload this page .
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .
Languages
TypeScript
96.1%
JavaScript
1.8%
Shell
1.1%
Python
1.0%

## extraction_diagnostics

- extraction_method: main
- readability_score: 91
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":10672,"paragraph_count":149,"sentence_count":80,"boilerplate_hits":2,"symbol_ratio":0.0047,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   pxpipe是一个本地代理，将系统提示、工具文档和历史记录等密集文本渲染为PNG图像，利用图像token成本取决于像素尺寸的特性压缩输入token。在Fable 5模型上，约25k文本token压缩为约2.7k图像token，端到端账单降低59-70%。SWE-bench Lite 10个实例全部通过，成本从$54降至$27；SWE-bench Pro 19对测试中18对判定一致，单次请求成本降低约60%。该方法有损（精确ID等需保持文本），默认仅处理`claude-fable-5`请求，可通过`PXPIPE_MODELS`变量控制。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   teamchong pxpipe Public Notifications You must be signed in to change notification settings Fork 25 Star 472 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 298 Commits 298 Commits .

3. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   github/ workflows .

4. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   github/ workflows assets assets bench bench bin bin demo demo docs docs eval eval scripts scripts src src tests tests .

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   md LICENSE LICENSE README.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   yaml pnpm-workspace.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Anthropic, GitHub
- products: Claude, claude, agent, gpt-5
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 计费 / 预算管理
- business_actions: 发布 / 推出, 定价 / 计费变化
- affected_departments: IT / 安全, 财务 / 预算
- numbers: 5, 25, 2.7, 59, 70%, 10, $54, $27
- quotes: claude-fable-5

## evidence_seed

- company_actions: teamchong pxpipe Public Notifications You must be signed in to change notification settings Fork 25 Star 472 main Branches Tags Go to file Code Open more actions menu Folders and files Name Name Last commit message Last commit date Latest commit History 298 Commits 298 Commits . / md LICENSE LICENSE README. / yaml pnpm-workspace.
- case_details: 暂无公开信息
- workflow_changes: github/ workflows . / github/ workflows assets assets bench bench bin bin demo demo docs docs eval eval scripts scripts src src tests tests .
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,commercial_or_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
- emerging_pool: true
- user_feedback_pool: true
- watchlist: true

## pool_routes

- emerging_pool
- user_feedback_pool
- watchlist

## missing_information

- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势
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
- discovery_record: {"discovery_title":"pxpipe：通过图像化压缩输入token降低Claude Code成本","discovery_summary":"pxpipe是一个本地代理，将系统提示、工具文档和历史记录等密集文本渲染为PNG图像，利用图像token成本取决于像素尺寸的特性压缩输入token。在Fable 5模型上，约25k文本token压缩为约2.7k图像token，端到端账单降低59-70%。SWE-bench Lite 10个实例全部通过，成本从$54降至$27；SWE-bench Pro 19对测试中18对判定一致，单次请求成本降低约60%。该方法有损（精确ID等需保持文本），默认仅处理`claude-fable-5`请求，可通过`PXPIPE_MODELS`变量控制。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://github.com/teamchong/pxpipe","discovered_at":"2026-07-04T03:11:32.649Z","rank_on_page":70,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

pxpipe是一个本地代理，将系统提示、工具文档和历史记录等密集文本渲染为PNG图像，利用图像token成本取决于像素尺寸的特性压缩输入token。在Fable 5模型上，约25k文本token压缩为约2.7k图像token，端到端账单降低59-70%。SWE-bench Lite 10个实例全部通过，成本从$54降至$27；SWE-bench Pro 19对测试中18对判定一致，单次请求成本降低约60%。该方法有损（精确ID等需保持文本），默认仅处理`claude-fable-5`请求，可通过`PXPIPE_MODELS`变量控制。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
