---
schema_version: raw-evidence-v2
raw_id: R-068
title: "Porting the Moebius 0.2B image inpainting model to run in the browser with Claude Code"
original_url: "https://simonwillison.net/2026/Jun/22/porting-moebius/#atom-everything"
canonical_url: "https://simonwillison.net/2026/Jun/22/porting-moebius"
source_name: "Simon Willison's Blog"
source_type: builder
source_level: S
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: rss-feed
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-22T23:43:51.000Z"
collected_at: 2026-06-28T04:05:28.288Z
language: mixed
full_text_hash: 59897befa3a7fd74
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-28/r-068-porting-the-moebius-0-2b-image-inpainting-model-to-run-in-the-browser-.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-28/r-068-porting-the-moebius-0-2b-image-inpainting-model-to-run-in-the-browser-.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 88
extractor_diagnostics: {"readability_score":88,"text_length":3309,"paragraph_count":28,"sentence_count":16,"boilerplate_hits":0,"symbol_ratio":0.0012,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 3309
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"59897befa3a7fd74","missing":[]}
source_volatility: low
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: ""
discovery_record: null
source_role: resolved_original_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 562cd43a3e0cd725
content_hash: 59897befa3a7fd74
semantic_hash: 6f7431dac32da2ae
duplicate_of: ""
first_seen_at: "2026-06-22T23:43:51.000Z"
last_seen_at: 2026-06-28T04:05:28.288Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":true,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["emerging_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":[],"novelty":2,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":5}
business_elements: {"companies":["Simon Willison's Blog","Microsoft","GitHub","Nvidia"],"products":["Claude","agent","Codex","agents"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":[],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["0.2B","48630171","10B","9310b","76","368","5","22"],"quotes":["https://news.ycombinator.com/item?id=48630171","https://hustvl.github.io/Moebius/","Run inpaint","muse on X"]}
evidence_seed: {"company_actions":["Porting the Moebius 0.","2B image inpainting model to run in the browser with Claude Code 22nd June 2026 This morning on Hacker News I saw Moebius: 0.","2B Lightweight Image Inpainting Framework with 10B-Level Performance , describing a small but effective inpainting model—a model where you can mark regions of an image to remove and the model imagines what should fill the space."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"quote","text":"&lt;p&gt;This morning &lt;a href=\"https://news.ycombinator.com/item?id=48630171\"&gt;on Hacker News&lt;/a&gt; I saw &lt;a href=\"https://hustvl.github.io/Moebius/\"&gt;Moebius: 0.2B Lightweight Image Inpainting Framework with 10B-Level Performance&lt;/a&gt;, describing a small but effective inpainting model - a model where you can mark regions of an image to remove and the model imagines what should fill the space. The released model &lt;a href=\"https://github.com/hustvl/Moebius/blob/9310b76e368f5f","supports":["daily_observation","heatmap","viewpoint"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Porting the Moebius 0.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"2B image inpainting model to run in the browser with Claude Code 22nd June 2026 This morning on Hacker News I saw Moebius: 0.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"2B Lightweight Image Inpainting Framework with 10B-Level Performance , describing a small but effective inpainting model—a model where you can mark regions of an image to remove and the model imagines what should fill the space.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"The released model required PyTorch and NVIDIA CUDA , but since it described itself as 0.","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"2B I decided to try and get it running using WebGPU in a browser.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"}]
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# Porting the Moebius 0.2B image inpainting model to run in the browser with Claude Code

## clean_text

Porting the Moebius 0.2B image inpainting model to run in the browser with Claude Code
22nd June 2026
This morning on Hacker News I saw Moebius: 0.2B Lightweight Image Inpainting Framework with 10B-Level Performance , describing a small but effective inpainting model—a model where you can mark regions of an image to remove and the model imagines what should fill the space. The released model required PyTorch and NVIDIA CUDA , but since it described itself as 0.2B I decided to try and get it running using WebGPU in a browser. TL;DR: I got it working, and you can try the demo at simonw.github.io/moebius-web/ . Read on for the details.
The finished tool
Here’s a video demo of the finished tool:
You can open any image in it (non-square images get letterboxed), highlight areas to remove, click the “Run inpaint” button and wait for the model to do its magic.
A parallel agent side-project
My main project for today was landing a major feature in Datasette: a UI for creating and altering tables, as a follow-up to the insert and edit rows feature I released last week.
I was working on that in Codex Desktop (here’s the PR ) and often found myself spending 5-10 minutes spinning my fingers waiting for it to complete a mid-sized refactor or add the finishing touches to a change to the UI.
(An amusing thing about coding agents is that the harder a problem is the more time you have to get distracted while you wait for them to finish crunching!)
So I decided to spin up Claude Code in a terminal window and see how far I could get at porting Moebius to the web.
Some agentic research to kick off the project
My first step was to ask regular Claude about the feasibility of this project. In Claude.ai , which has the ability to clone repos from GitHub:
Clone https://github.com/hustvl/Moebius/ and tell me if they published the code and weights to run this model anywhere
(I hadn’t spotted the link to the weights yet, that’s tucked away in the “News” section.)
Then:
For Moebius what are the options for running it right now - Python and NVIDIA CUDA only or other options too?
And:
Muse on the feasibility of porting it to Transformers.js or similar and running it in a browser
I like telling models to “muse on X”, it’s the shortest way I’ve found of expressing that I want them to contemplate a problem for me without providing them with a concrete goal.
Here’s that chat transcript . I copied out the last answer and saved it as research.md for Claude Code to read later.
Claude suggested using ONNX Runtime Web on the WebGPU backend —the layer below the Transformers.js library I had suggested.
That was enough to convince me it was worth setting Claude Code loose and seeing how far it could get.
I usually start projects like this by gathering as much information as the coding agent might need as possible. Since I didn’t expect this project to actually work I did everything in my /tmp folder:
cd /tmp
mkdir Moebius
cd Moebius
# Grab the Moebius python code
git clone https://github.com/hustvl/Moebius
# And the model weights (Claude figured this out):
GIT_LFS_SKIP_SMUDGE=0 git clone \
https://huggingface.co/hustvl/Moebius Moebius-weights
# Finally a couple of libraries we might use:
git clone https://github.com/huggingface/transformers.js
git clone https://github.com/microsoft/onnxruntime

## full_text

Porting the Moebius 0.2B image inpainting model to run in the browser with Claude Code
22nd June 2026
This morning on Hacker News I saw Moebius: 0.2B Lightweight Image Inpainting Framework with 10B-Level Performance , describing a small but effective inpainting model—a model where you can mark regions of an image to remove and the model imagines what should fill the space. The released model required PyTorch and NVIDIA CUDA , but since it described itself as 0.2B I decided to try and get it running using WebGPU in a browser. TL;DR: I got it working, and you can try the demo at simonw.github.io/moebius-web/ . Read on for the details.
The finished tool
Here’s a video demo of the finished tool:
You can open any image in it (non-square images get letterboxed), highlight areas to remove, click the “Run inpaint” button and wait for the model to do its magic.
A parallel agent side-project
My main project for today was landing a major feature in Datasette: a UI for creating and altering tables, as a follow-up to the insert and edit rows feature I released last week.
I was working on that in Codex Desktop (here’s the PR ) and often found myself spending 5-10 minutes spinning my fingers waiting for it to complete a mid-sized refactor or add the finishing touches to a change to the UI.
(An amusing thing about coding agents is that the harder a problem is the more time you have to get distracted while you wait for them to finish crunching!)
So I decided to spin up Claude Code in a terminal window and see how far I could get at porting Moebius to the web.
Some agentic research to kick off the project
My first step was to ask regular Claude about the feasibility of this project. In Claude.ai , which has the ability to clone repos from GitHub:
Clone https://github.com/hustvl/Moebius/ and tell me if they published the code and weights to run this model anywhere
(I hadn’t spotted the link to the weights yet, that’s tucked away in the “News” section.)
Then:
For Moebius what are the options for running it right now - Python and NVIDIA CUDA only or other options too?
And:
Muse on the feasibility of porting it to Transformers.js or similar and running it in a browser
I like telling models to “muse on X”, it’s the shortest way I’ve found of expressing that I want them to contemplate a problem for me without providing them with a concrete goal.
Here’s that chat transcript . I copied out the last answer and saved it as research.md for Claude Code to read later.
Claude suggested using ONNX Runtime Web on the WebGPU backend —the layer below the Transformers.js library I had suggested.
That was enough to convince me it was worth setting Claude Code loose and seeing how far it could get.
I usually start projects like this by gathering as much information as the coding agent might need as possible. Since I didn’t expect this project to actually work I did everything in my /tmp folder:
cd /tmp
mkdir Moebius
cd Moebius
# Grab the Moebius python code
git clone https://github.com/hustvl/Moebius
# And the model weights (Claude figured this out):
GIT_LFS_SKIP_SMUDGE=0 git clone \
https://huggingface.co/hustvl/Moebius Moebius-weights
# Finally a couple of libraries we might use:
git clone https://github.com/huggingface/transformers.js
git clone https://github.com/microsoft/onnxruntime

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 88
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":88,"text_length":3309,"paragraph_count":28,"sentence_count":16,"boilerplate_hits":0,"symbol_ratio":0.0012,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **quote**｜supports=daily_observation, heatmap, viewpoint｜importance=medium｜confidence=high
   &lt;p&gt;This morning &lt;a href="https://news.ycombinator.com/item?id=48630171"&gt;on Hacker News&lt;/a&gt; I saw &lt;a href="https://hustvl.github.io/Moebius/"&gt;Moebius: 0.2B Lightweight Image Inpainting Framework with 10B-Level Performance&lt;/a&gt;, describing a small but effective inpainting model - a model where you can mark regions of an image to remove and the model imagines what should fill the space. The released model &lt;a href="https://github.com/hustvl/Moebius/blob/9310b76e368f5f

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Porting the Moebius 0.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   2B image inpainting model to run in the browser with Claude Code 22nd June 2026 This morning on Hacker News I saw Moebius: 0.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   2B Lightweight Image Inpainting Framework with 10B-Level Performance , describing a small but effective inpainting model—a model where you can mark regions of an image to remove and the model imagines what should fill the space.

5. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   The released model required PyTorch and NVIDIA CUDA , but since it described itself as 0.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   2B I decided to try and get it running using WebGPU in a browser.

## business_elements

- companies: Simon Willison's Blog, Microsoft, GitHub, Nvidia
- products: Claude, agent, Codex, agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 暂无公开信息
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 0.2B, 48630171, 10B, 9310b, 76, 368, 5, 22
- quotes: https://news.ycombinator.com/item?id=48630171 / https://hustvl.github.io/Moebius/ / Run inpaint / muse on X

## evidence_seed

- company_actions: Porting the Moebius 0. / 2B image inpainting model to run in the browser with Claude Code 22nd June 2026 This morning on Hacker News I saw Moebius: 0. / 2B Lightweight Image Inpainting Framework with 10B-Level Performance , describing a small but effective inpainting model—a model where you can mark regions of an image to remove and the model imagines what should fill the space.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 5
- importance_reason: new product or service; rubric=5 major/platform/industry-shaping
- supporting_signals: 
- novelty: 2
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 5

## usable_for

- viewpoint: true
- case: true
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: true
- emerging_pool: true
- user_feedback_pool: false
- watchlist: true

## pool_routes

- emerging_pool

## missing_information

- 没有具体客户或真实企业案例
- 没有变化前后流程线索

## volatile_and_discovery_handling

- source_volatility: low
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: none
- source_role: resolved_original_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

&lt;p&gt;This morning &lt;a href="https://news.ycombinator.com/item?id=48630171"&gt;on Hacker News&lt;/a&gt; I saw &lt;a href="https://hustvl.github.io/Moebius/"&gt;Moebius: 0.2B Lightweight Image Inpainting Framework with 10B-Level Performance&lt;/a&gt;, describing a small but effective inpainting model - a model where you can mark regions of an image to remove and the model imagines what should fill the space. The released model &lt;a href="https://github.com/hustvl/Moebius/blob/9310b76e368f5f

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
