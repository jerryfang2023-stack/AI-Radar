---
schema_version: raw-evidence-v2
raw_id: R-016
title: "Show HN: AHD – an open-source linter and eval framework for AI-generated UI"
original_url: "https://ahd.adastra.computer/"
canonical_url: "https://ahd.adastra.computer"
source_name: "Hacker News"
source_type: community
source_level: C
acquisition_source_level: ""
acquisition_channel: hn
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-05-05T18:32:45Z"
collected_at: 2026-05-18T07:52:02.240Z
language: mixed
full_text_hash: 468135fdf6c242b9
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-18/r-016-show-hn-ahd-an-open-source-linter-and-eval-framework-for-ai-generated-.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-18/r-016-show-hn-ahd-an-open-source-linter-and-eval-framework-for-ai-generated-.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-clean-text
extraction_quality: high
has_full_text: true
content_length: 7284
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
url_hash: bed3377a25029347
content_hash: 468135fdf6c242b9
semantic_hash: 47673840253af03c
duplicate_of: ""
first_seen_at: "2026-05-05T18:32:45Z"
last_seen_at: 2026-05-18T07:52:02.240Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":false,"daily_observation":true,"heatmap":true,"briefing":false,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["emerging_pool","user_feedback_pool","watchlist"]
guanlan_scores: {"commercial_value":3,"novelty":3,"evidence_strength":3,"case_richness":5,"trend_relevance":3,"guanlan_relevance":4,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News","OpenAI","Mistral"],"products":["gemini","Gemini","Claude","gpt-5","Codex","ChatGPT","GPT-5"],"people":[],"industries":["开发者工具"],"roles":[],"workflows":["合同审阅 / 法律研究"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["2","0","24","2026","30","47.6","120B","48%"],"quotes":[]}
evidence_seed: {"company_actions":["2 points / 0 comments / query=open source AI evals","AHD · Artificial Human Design AHD Artificial Human Design AHD · Artificial Human Design Make it specific.","A guardrail and evaluation layer for AI-generated design."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例","缺少一手来源或可靠转述来源"]
key_excerpts: [{"type":"company_action","text":"2 points / 0 comments / query=open source AI evals","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"AHD · Artificial Human Design AHD Artificial Human Design AHD · Artificial Human Design Make it specific.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"A guardrail and evaluation layer for AI-generated design.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"A named taxonomy of thirty-nine slop tells, a token-driven brief compiler, a deterministic linter, and a reproducible raw-vs-compiled eval loop.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Across web UI and image generation.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"npm install --save-dev @adastracomputing/ahd Or try it without installing: npx @adastracomputing/ahd lint page.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Show HN: AHD – an open-source linter and eval framework for AI-generated UI

## clean_text

AHD · Artificial Human Design AHD Artificial Human Design
AHD · Artificial Human Design
Make it specific.
A guardrail and evaluation layer for AI-generated design. A named
taxonomy of thirty-nine slop tells, a
token-driven brief compiler, a deterministic linter, and a
reproducible raw-vs-compiled eval loop.
Across web UI and image generation.
npm install --save-dev @adastracomputing/ahd Or try it without installing:
npx @adastracomputing/ahd lint page.html Full setup ,
npm ,
source .
Measured · 24 April 2026 · cross-token triangulation
Same brief, different style token ( post-digital-green ),
eleven models, n=30 per cell , six hundred sixty samples.
The first triangulation surfaced a real limit in the rule
design: editorially-opinionated rules fired on output that was
correct for a token they were not written for. AHD shipped
token-aware linting in response. Re-linting the same samples
under the corrected ruleset moves
six of eleven cells positive ,
with gpt-oss leading at 47.6 percent reduction. Click any row
for the post-fix per-cell reading.
gpt-oss 120B 48%↓
Best reduction in the run after token-aware lint. 1.40 raw
mean tells dropped to 0.73 compiled, 30 of 30 scored. The
cell led the pre-fix reading too (+19.8% pre-fix, +47.6%
post-fix): the post-digital-green-correct output that the
old ruleset under-credited now scores fully. Served by
Cloudflare Workers AI.
Gemma 4 26B 50%↓
Flipped sign under token-aware lint: pre-fix −10.5%,
post-fix +50.0%. 0.87 raw mean tells dropped to 0.43
compiled, 30 of 30 scored. Three of the four sign-flippers
(gemma, kimi, gemini) cluster at the OSS frontier;
silencing the editorially-opinionated rules unblocked
their compiled output.
Kimi K2.6 30%↓
Flipped sign: pre-fix −14.4%, post-fix +30.5%. 1.97 raw
mean tells to 1.37 compiled, 30 of 30 scored after the
chat-template fix (Kimi defaults thinking-mode on, which
exhausted the token budget). Serving fix lives in the
serving-tells catalog .
Gemini 3.1 Pro Preview 26%↓
Flipped sign: pre-fix −9.9%, post-fix +26.3%. 1.20 raw
mean tells to 0.88 compiled, 26 of 30 scored (the same
intermittent four-of-thirty no-output behaviour observed
on the 22 April run). Served via Gemini CLI.
Mistral Small 3.1 22%↓
Stays positive in both readings: pre-fix +34.7%, post-fix
+21.7%. 1.53 raw mean tells to 1.20 compiled, 30 of 30
scored. The token-aware re-lint trims the headline
margin but leaves the verdict unchanged: compilation
helps this cell.
Claude Opus 4.7 regressed 68%↑
Pre-fix −172.9%, post-fix −67.6%: sixty percent of the
regression closed by token-aware lint, but the cell still
scores worse compiled than raw. 1.13 raw mean tells rose
to 1.90 compiled. The remaining gap is rules outside the
suppression list firing on Claude's compiled output;
either the model or the compiled prompt has more work to
do here. Served via Claude Code CLI.
gpt-5.5 regressed 9%↑
Released by OpenAI during the run window and tested
inline. Pre-fix −135.5%, post-fix −9.1%: a near-closed
regression. 0.37 raw mean tells to 0.40 compiled, 30 of
30 scored, the cleanest raw frontier baseline measured to
date. The new model produces tighter HTML by default
(~8 KB per sample versus gpt-5.4's 11 KB raw). Served via
Codex CLI on ChatGPT.
gpt-5.4 regressed 36%↑
Pre-fix −78.6%, post-fix −36.4%: half the regression
closed. 0.37 raw mean tells to 0.50 compiled, 30 of 30
scored. Same pattern as Claude: rules outside the
suppression list still firing. Served via Codex CLI.
Eight cells shown. Three cells with very low absolute baselines
(Llama 3.3, Llama 4 Scout, Qwen3 30B) show numerically large
percentage moves on tiny absolute changes; full eleven-cell
breakdown plus the pre-fix-versus-post-fix table lives at
eval · 24 April 2026 .
Measured · 22 April 2026 · single-token n=30
Same brief, raw versus AHD-compiled, ten models, n=30 per cell,
six hundred samples.
Eight of ten cells reduce tells.
Median reduction 59 percent across the positive cells. Click any
row for the per-model reading.
gpt-oss 120B 78%↓
Best reduction in the run. 3.50 raw mean tells dropped to 0.77
compiled, 30 of 30 samples scored in both conditions. The
compiled prompt moves this OSS model decisively off its median
without inducing new tells. Served by Cloudflare Workers AI.
Mistral Small 3.1 62%↓
3.47 raw mean tells dropped to 1.30 compiled, 30 of 30 scored
in both conditions. Matches the n=5 signal at tight confidence.
The bento-and-gradient raw output collapses toward the Swiss
editorial token under the compiled system prompt.
Kimi K2.6 62%↓
2.67 raw mean tells dropped to 1.00 compiled, 30 of 30 scored.
The cell required a chat-template fix first: Kimi K2.6 on
Cloudflare defaults thinking-mode on, and a 9 KB system prompt
exhausted the token budget before any visible output. After
patching the runner to pass thinking: false , the
cell ran clean. This is a serving-layer defect documented in
the serving-tells catalog ,
separate from the design-slop taxonomy.
Gemini 3.1 Pro Preview 62%↓
2.97 raw mean tells dropped to 1.13 compiled, 30 of 30 scored.
Served via Gemini CLI, which is the path most humans actually
use for this model today, so the CLI measurement is more
ecologically valid than the raw HTTP API would be.
Claude Opus 4.7 59%↓
1.80 raw mean tells dropped to 0.73 compiled, 30 of 30 scored.
Served via Claude Code CLI. The n=30 number is tighter but
lower than the n=5 reading reported 100 percent reduction at
±35-point uncertainty; 59 percent is the real figure. Same
behaviour, measured to a resolution we can now trust.
Llama 3.3 70B regressed 117%↑
0.28 raw mean tells rose to 0.60 compiled. This reproduces the
same-direction regression measured at n=5 on both Cloudflare
and Hugging Face serving paths in the 21 April cross-provider
run. Llama 3.3's raw output is typographically thin; the
compiled brief elicits a richer page with more decision surface,
which trips more rules. Framework response: on an editorial
brief, do not route to this model.
Full report with attempted-vs-scored counts, per-tell frequency
table, serving paths and the run manifest:
eval · 22 April 2026 .
Different-token follow-up:
eval · 24 April 2026 .
Every run: /evals .
How to read these numbers: the run's own reading guide ,
or the general methodology .
Four pieces
Named taxonomy
Thirty-nine concrete slop tells across web, graphic and
typographic surfaces. Enforced by 35 HTML/CSS rules, 3 SVG
rules, and 14 vision-critic rules on rendered pixels.
Read the taxonomy .
Style tokens
Ten curated design directions spanning Swiss-Editorial, Manual
SF, Neubrutalist-Gumroad, Post-Digital, Monochrome-Editorial,
Memphis-Clash, Heisei-Retro, Bauhaus-Revival, Editorial-
Illustration and Ad-Creative-Collision. Each declares its own
forbidden list, required quirks and reference lineage.
Brief compiler
ahd compile takes a structured intent and emits a
token-anchored system prompt for any LLM. Draft mode for
exploration, final mode for single-shot output.
See how .
Empirical eval
Raw-vs-compiled
controlled comparison across Claude Opus 4.7, GPT-5, Gemini 3
Pro, Llama 3.3 70B, Llama 4 Scout, Mistral Small 3.1, Qwen 2.5
Coder, DeepSeek R1, and image generators FLUX.1 schnell, SDXL
Lightning and DreamShaper. Attempted, extracted, scored counts
published. Negative results first-class.

## full_text

AHD · Artificial Human Design AHD Artificial Human Design
AHD · Artificial Human Design
Make it specific.
A guardrail and evaluation layer for AI-generated design. A named
taxonomy of thirty-nine slop tells, a
token-driven brief compiler, a deterministic linter, and a
reproducible raw-vs-compiled eval loop.
Across web UI and image generation.
npm install --save-dev @adastracomputing/ahd Or try it without installing:
npx @adastracomputing/ahd lint page.html Full setup ,
npm ,
source .
Measured · 24 April 2026 · cross-token triangulation
Same brief, different style token ( post-digital-green ),
eleven models, n=30 per cell , six hundred sixty samples.
The first triangulation surfaced a real limit in the rule
design: editorially-opinionated rules fired on output that was
correct for a token they were not written for. AHD shipped
token-aware linting in response. Re-linting the same samples
under the corrected ruleset moves
six of eleven cells positive ,
with gpt-oss leading at 47.6 percent reduction. Click any row
for the post-fix per-cell reading.
gpt-oss 120B 48%↓
Best reduction in the run after token-aware lint. 1.40 raw
mean tells dropped to 0.73 compiled, 30 of 30 scored. The
cell led the pre-fix reading too (+19.8% pre-fix, +47.6%
post-fix): the post-digital-green-correct output that the
old ruleset under-credited now scores fully. Served by
Cloudflare Workers AI.
Gemma 4 26B 50%↓
Flipped sign under token-aware lint: pre-fix −10.5%,
post-fix +50.0%. 0.87 raw mean tells dropped to 0.43
compiled, 30 of 30 scored. Three of the four sign-flippers
(gemma, kimi, gemini) cluster at the OSS frontier;
silencing the editorially-opinionated rules unblocked
their compiled output.
Kimi K2.6 30%↓
Flipped sign: pre-fix −14.4%, post-fix +30.5%. 1.97 raw
mean tells to 1.37 compiled, 30 of 30 scored after the
chat-template fix (Kimi defaults thinking-mode on, which
exhausted the token budget). Serving fix lives in the
serving-tells catalog .
Gemini 3.1 Pro Preview 26%↓
Flipped sign: pre-fix −9.9%, post-fix +26.3%. 1.20 raw
mean tells to 0.88 compiled, 26 of 30 scored (the same
intermittent four-of-thirty no-output behaviour observed
on the 22 April run). Served via Gemini CLI.
Mistral Small 3.1 22%↓
Stays positive in both readings: pre-fix +34.7%, post-fix
+21.7%. 1.53 raw mean tells to 1.20 compiled, 30 of 30
scored. The token-aware re-lint trims the headline
margin but leaves the verdict unchanged: compilation
helps this cell.
Claude Opus 4.7 regressed 68%↑
Pre-fix −172.9%, post-fix −67.6%: sixty percent of the
regression closed by token-aware lint, but the cell still
scores worse compiled than raw. 1.13 raw mean tells rose
to 1.90 compiled. The remaining gap is rules outside the
suppression list firing on Claude's compiled output;
either the model or the compiled prompt has more work to
do here. Served via Claude Code CLI.
gpt-5.5 regressed 9%↑
Released by OpenAI during the run window and tested
inline. Pre-fix −135.5%, post-fix −9.1%: a near-closed
regression. 0.37 raw mean tells to 0.40 compiled, 30 of
30 scored, the cleanest raw frontier baseline measured to
date. The new model produces tighter HTML by default
(~8 KB per sample versus gpt-5.4's 11 KB raw). Served via
Codex CLI on ChatGPT.
gpt-5.4 regressed 36%↑
Pre-fix −78.6%, post-fix −36.4%: half the regression
closed. 0.37 raw mean tells to 0.50 compiled, 30 of 30
scored. Same pattern as Claude: rules outside the
suppression list still firing. Served via Codex CLI.
Eight cells shown. Three cells with very low absolute baselines
(Llama 3.3, Llama 4 Scout, Qwen3 30B) show numerically large
percentage moves on tiny absolute changes; full eleven-cell
breakdown plus the pre-fix-versus-post-fix table lives at
eval · 24 April 2026 .
Measured · 22 April 2026 · single-token n=30
Same brief, raw versus AHD-compiled, ten models, n=30 per cell,
six hundred samples.
Eight of ten cells reduce tells.
Median reduction 59 percent across the positive cells. Click any
row for the per-model reading.
gpt-oss 120B 78%↓
Best reduction in the run. 3.50 raw mean tells dropped to 0.77
compiled, 30 of 30 samples scored in both conditions. The
compiled prompt moves this OSS model decisively off its median
without inducing new tells. Served by Cloudflare Workers AI.
Mistral Small 3.1 62%↓
3.47 raw mean tells dropped to 1.30 compiled, 30 of 30 scored
in both conditions. Matches the n=5 signal at tight confidence.
The bento-and-gradient raw output collapses toward the Swiss
editorial token under the compiled system prompt.
Kimi K2.6 62%↓
2.67 raw mean tells dropped to 1.00 compiled, 30 of 30 scored.
The cell required a chat-template fix first: Kimi K2.6 on
Cloudflare defaults thinking-mode on, and a 9 KB system prompt
exhausted the token budget before any visible output. After
patching the runner to pass thinking: false , the
cell ran clean. This is a serving-layer defect documented in
the serving-tells catalog ,
separate from the design-slop taxonomy.
Gemini 3.1 Pro Preview 62%↓
2.97 raw mean tells dropped to 1.13 compiled, 30 of 30 scored.
Served via Gemini CLI, which is the path most humans actually
use for this model today, so the CLI measurement is more
ecologically valid than the raw HTTP API would be.
Claude Opus 4.7 59%↓
1.80 raw mean tells dropped to 0.73 compiled, 30 of 30 scored.
Served via Claude Code CLI. The n=30 number is tighter but
lower than the n=5 reading reported 100 percent reduction at
±35-point uncertainty; 59 percent is the real figure. Same
behaviour, measured to a resolution we can now trust.
Llama 3.3 70B regressed 117%↑
0.28 raw mean tells rose to 0.60 compiled. This reproduces the
same-direction regression measured at n=5 on both Cloudflare
and Hugging Face serving paths in the 21 April cross-provider
run. Llama 3.3's raw output is typographically thin; the
compiled brief elicits a richer page with more decision surface,
which trips more rules. Framework response: on an editorial
brief, do not route to this model.
Full report with attempted-vs-scored counts, per-tell frequency
table, serving paths and the run manifest:
eval · 22 April 2026 .
Different-token follow-up:
eval · 24 April 2026 .
Every run: /evals .
How to read these numbers: the run's own reading guide ,
or the general methodology .
Four pieces
Named taxonomy
Thirty-nine concrete slop tells across web, graphic and
typographic surfaces. Enforced by 35 HTML/CSS rules, 3 SVG
rules, and 14 vision-critic rules on rendered pixels.
Read the taxonomy .
Style tokens
Ten curated design directions spanning Swiss-Editorial, Manual
SF, Neubrutalist-Gumroad, Post-Digital, Monochrome-Editorial,
Memphis-Clash, Heisei-Retro, Bauhaus-Revival, Editorial-
Illustration and Ad-Creative-Collision. Each declares its own
forbidden list, required quirks and reference lineage.
Brief compiler
ahd compile takes a structured intent and emits a
token-anchored system prompt for any LLM. Draft mode for
exploration, final mode for single-shot output.
See how .
Empirical eval
Raw-vs-compiled
controlled comparison across Claude Opus 4.7, GPT-5, Gemini 3
Pro, Llama 3.3 70B, Llama 4 Scout, Mistral Small 3.1, Qwen 2.5
Coder, DeepSeek R1, and image generators FLUX.1 schnell, SDXL
Lightning and DreamShaper. Attempted, extracted, scored counts
published. Negative results first-class.

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   2 points / 0 comments / query=open source AI evals

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   AHD · Artificial Human Design AHD Artificial Human Design AHD · Artificial Human Design Make it specific.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   A guardrail and evaluation layer for AI-generated design.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   A named taxonomy of thirty-nine slop tells, a token-driven brief compiler, a deterministic linter, and a reproducible raw-vs-compiled eval loop.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   Across web UI and image generation.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   npm install --save-dev @adastracomputing/ahd Or try it without installing: npx @adastracomputing/ahd lint page.

## business_elements

- companies: Hacker News, OpenAI, Mistral
- products: gemini, Gemini, Claude, gpt-5, Codex, ChatGPT, GPT-5
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 合同审阅 / 法律研究
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 2, 0, 24, 2026, 30, 47.6, 120B, 48%
- quotes: 暂无公开信息

## evidence_seed

- company_actions: 2 points / 0 comments / query=open source AI evals / AHD · Artificial Human Design AHD Artificial Human Design AHD · Artificial Human Design Make it specific. / A guardrail and evaluation layer for AI-generated design.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- commercial_value: 3
- novelty: 3
- evidence_strength: 3
- case_richness: 5
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

- emerging_pool
- user_feedback_pool
- watchlist

## missing_information

- 没有具体客户或真实企业案例
- 缺少一手来源或可靠转述来源

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

2 points / 0 comments / query=open source AI evals

## 采集备注

该条目由 hn 发现，事实来源等级初判为 C。S/A/B/C/D 只判断事实可靠度，不判断商业价值；M 只表示 acquisition_source_level，即 AI HOT / 搜索聚合等采集通道。M 级通道必须回源；HN / Reddit / X 等 C 级社区材料可用于讨论升温、用户反馈和早期观察，但进入事实主证据前必须寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。创始人 / 高管 / 项目方原帖可作为 S 级一手来源，但高波动平台必须保存快照和抓取时间。
