---
schema_version: raw-evidence-v2
raw_id: R-080
title: "olmo-eval：面向模型开发循环的评估工作台"
original_url: "https://huggingface.co/blog/allenai/olmo-eval"
canonical_url: "https://huggingface.co/blog/allenai/olmo-eval"
source_name: "Hugging Face：Blog（RSS）"
source_type: developer
source_level: B
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
published_at: "2026-06-12T15:56:10.000Z"
collected_at: 2026-06-13T05:32:37.339Z
language: mixed
full_text_hash: d7e6bab7ca32cb21
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-13/r-080-olmo-eval-面向模型开发循环的评估工作台.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-13/r-080-olmo-eval-面向模型开发循环的评估工作台.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 94
extractor_diagnostics: {"readability_score":94,"text_length":10367,"paragraph_count":76,"sentence_count":46,"boilerplate_hits":1,"symbol_ratio":0.0054,"method":"main"}
has_full_text: true
content_length: 10367
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"d7e6bab7ca32cb21","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"olmo-eval：面向模型开发循环的评估工作台","discovery_summary":"olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容器化隔离运行。采用模块化架构，模型、工具、容器环境、辅助模型均可独立替换。评测结果同时报告分数、标准误差和最小可检测效应。与 Harbor 侧重于发布不同，olmo-eval 聚焦开发阶段快速迭代，可逐问题对比检查点输出以区分真实改进与噪声。","source_name":"Hugging Face：Blog（RSS）","origin_url":"https://huggingface.co/blog/allenai/olmo-eval","discovered_at":"2026-06-13T05:25:16.566Z","rank_on_page":202,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 8f76e67ad854a6c0
content_hash: d7e6bab7ca32cb21
semantic_hash: 1bfb6239c07d7862
duplicate_of: ""
first_seen_at: "2026-06-12T15:56:10.000Z"
last_seen_at: 2026-06-13T05:32:37.339Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":2}
business_elements: {"companies":["Hugging Face","Blog（RSS）","GitHub"],"products":["agents","agent"],"people":[],"industries":["开发者工具","企业服务"],"roles":[],"workflows":["合同审阅 / 法律研究","权限 / 安全治理","部署 / 集成交付"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["12","2026","4","2","2024","2.4","3","0.0"],"quotes":["internal_freshqa","s3://evals/internal/freshqa.jsonl","question"," ],\nmetadata={ "," : doc.get( "]}
evidence_seed: {"company_actions":["Back to Articles olmo-eval: An evaluation workbench for the model development loop Enterprise Article Published June 12, 2026 Upvote 4 Tyler Murray undfined Follow allenai Kyle Wiggers Ai2Comms Follow allenai 💻 Code: https://github.","com/allenai/olmo-eval While you're building an LLM, you evaluate it over and over across many interventions.","Every adjustment to its data, architecture, or hyperparameters — and every step up in scale — sends you back through the same loop: adding or reconfiguring benchmarks, re-running them on each new model checkpoint, noting the results, and checking whether something that helped in a small experiment still holds up on the full training run."],"case_details":["olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容器化隔离运行。采用模块化架构，模型、工具、容器环境、辅助模型均可独立替换。评测结果同时报告分数、标准误差和最小可检测效应。与 Harbor 侧重于发布不同，olmo-eval 聚焦开发阶段快速迭代，可逐问题对比检查点输出以区分真实改进与噪声。"],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"case_detail","text":"olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容器化隔离运行。采用模块化架构，模型、工具、容器环境、辅助模型均可独立替换。评测结果同时报告分数、标准误差和最小可检测效应。与 Harbor 侧重于发布不同，olmo-eval 聚焦开发阶段快速迭代，可逐问题对比检查点输出以区分真实改进与噪声。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Back to Articles olmo-eval: An evaluation workbench for the model development loop Enterprise Article Published June 12, 2026 Upvote 4 Tyler Murray undfined Follow allenai Kyle Wiggers Ai2Comms Follow allenai 💻 Code: https://github.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"com/allenai/olmo-eval While you're building an LLM, you evaluate it over and over across many interventions.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Every adjustment to its data, architecture, or hyperparameters — and every step up in scale — sends you back through the same loop: adding or reconfiguring benchmarks, re-running them on each new model checkpoint, noting the results, and checking whether something that helped in a small experiment still holds up on the full training run.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Most evaluation tools aren't designed for this—they’re either built to run established benchmarks across finished models or run a model through multi-step, tool-using problems in a sandbox.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"They don’t keep up with a model that's constantly changing, nor do they reflect how a model might behave under specific real-world conditions.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: technical-iteration-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# olmo-eval：面向模型开发循环的评估工作台

## clean_text

Back to Articles
olmo-eval: An evaluation workbench for the model development loop
Enterprise Article Published
June 12, 2026
Upvote 4
Tyler Murray undfined Follow
allenai
Kyle Wiggers Ai2Comms Follow
allenai
💻 Code: https://github.com/allenai/olmo-eval
While you're building an LLM, you evaluate it over and over across many interventions. Every adjustment to its data, architecture, or hyperparameters — and every step up in scale — sends you back through the same loop: adding or reconfiguring benchmarks, re-running them on each new model checkpoint, noting the results, and checking whether something that helped in a small experiment still holds up on the full training run.
Most evaluation tools aren't designed for this—they’re either built to run established benchmarks across finished models or run a model through multi-step, tool-using problems in a sandbox. They don’t keep up with a model that's constantly changing, nor do they reflect how a model might behave under specific real-world conditions.
Our last project to address this evaluation challenge was OLMES , the Open Language Model Evaluation Standard. Introduced in 2024, it was meant to make LLM benchmark scores easier to compare across releases. The same models were being scored on the same benchmarks in different ways — aspects like prompt formatting and task formulation often varied from paper to paper — so claims about which models performed best often weren't reproducible. OLMES pinned benchmarking choices down in an open, documented standard, and it became the basis for evaluating our open models from Olmo to Tulu.
But a model's final score is only part of the evaluation process—which is why we're releasing olmo-eval , a new workbench that builds on OLMES and extends it across the rest of LLM development. Compared to OLMES, olmo-eval cuts down the work of implementing new evaluations, offers more flexibility in defining where and how they run, and makes it easier to compose individual components into larger workflows. Agentic and multi-turn evaluation is supported as a first-class use case, and stronger analysis tools help you judge whether an intervention actually improved on the baseline or the difference amounts to noise.
How olmo-eval differs from existing tools
Is a 2.4pp change in performance enough to make a call?
olmo-eval overlaps in some ways with Harbor, an open framework for evaluating AI agents inside containerized, sandboxed environments. But the two tools differ in their scope. Harbor is aimed mainly at running and publishing agent benchmarks; olmo-eval was built for the everyday work of developing a model—adding and configuring benchmarks, running them across checkpoints, and analyzing the results prompt by prompt instead of as a single overall score.
Harbor runs everything the same way—inside sealed, reproducible containers. Because containers can be resource-intensive, olmo-eval lets you choose how each benchmark runs instead. A benchmark that just needs a model to answer questions can run directly, which is faster and cheaper; a benchmark that needs a locked-down environment — say, one that runs code the model wrote — gets an isolated container setup. The lightweight path is the default, and olmo-eval only opts for the heavy setup when a benchmark actually requires it.
Harbor's process for adding a benchmark is built for evals you plan to publish and share publicly, with the extra verification steps that entails. olmo-eval is built for moving quickly while you develop, and how you add a benchmark depends on what the benchmark needs: a short definition for a basic eval, with options to let a model use tools as it works through a benchmark, or — for a benchmark that already has its own code and procedure — a thin wrapper so olmo-eval can run it as is and report the results alongside other benchmark scores in the same format.
Both Harbor and olmo-eval keep benchmarks separate from the runtime policy (how the model is run to produce its answers) so you can change one without rewriting the other, but olmo-eval is designed for greater modularity. In olmo-eval, the model being evaluated, the tools it can use, the containerized environment, and any helper models – like an LLM-as-a-judge – are all swappable components. You can reuse a tool across many harnesses, or plug a grading model into one benchmark without perturbing the others, and adjust small settings (e.g., the exact wording of the prompt) without extensive effort.
Harbor reports an overall score for each model. olmo-eval reports those scores too, each with a standard error and a minimum detectable effect (the smallest difference that can be reliably distinguished from noise). But the more useful view lines the same questions up across two model checkpoints and compares them one by one, with all else held fixed. This helps you to see whether a tiny change in an overall average might indicate a real improvement or simply noise.
If you're looking for...
olmo-eval offers
Authoring a multi-example benchmark
Task subclass with a DataSource , metrics, and scoring surface
Wrapping an existing agent-style benchmark with its own runner
ExternalEval or SandboxedExternalEval ; the benchmark keeps its loop and scoring, and results land in olmo-eval's schema
Swapping the runtime under a fixed benchmark
--harness and harness presets; the harness carries provider, tools, scaffold, sandboxes, and auxiliary providers
Parallel container execution
Sandbox instances for parallel executors with capability-based routing, Docker or Modal modes
Tool definitions reusable across tasks and harnesses
@tool decorator with optional global registry
Multi-turn execution loops
Scaffolds, e.g., openai_agents , selected per harness, not baked into the task definition
An integrated evaluation stack
olmo-eval is composed of four components that are useful on their own but designed to work together to tighten the experimental LLM development loop:
A task/suite/harness abstraction that decouples benchmark logic from runtime policy. A task is how you define a benchmark in olmo-eval—what's being evaluated. A suite groups tasks into a set you run together, and a harness controls how each task is run. This separation lets the same task run as a standard baseline or with tools and scaffolding, without changing what it measures.
A sandbox and capability-routing layer, including an asynchronous sandbox planner. This supports evaluations where a model's response depends on the actions it takes using tools, like writing and running code or browsing the web. The point is to evaluate the model's real tool use: when a benchmark calls for tools, olmo-eval runs those tools and feeds the results back to the model.
A normalized experiment schema that records every run, its configuration, and the results in the same structured format. This makes it possible to group related experiments, compare checkpoints over time, and avoid the inconsistencies that often accumulate in long-running model development workflows.
A results viewer for pairwise model comparison: lining two models or checkpoints up question by question surfaces small but real performance changes that an overall average can hide.
In most model evaluation setups, adding a benchmark is a sizeable integration project. In olmo-eval, all that’s needed is a task—tasks define the benchmark dataset, how evaluation requests are built, and how model answers are scored (all code in Python):
from olmo_eval.common.formatters import ChatFormatter
from olmo_eval.common.metrics import AccuracyMetric
from olmo_eval.common.scorers import ExactMatchScorer
from olmo_eval.common.types import Instance, SamplingParams
from olmo_eval.data import DataLoader, DataSource
from olmo_eval.evals.tasks.common import Task, register, register_variant
@register( "internal_freshqa" )
class InternalFreshQA ( Task ):
data_source = DataSource(path= "s3://evals/internal/freshqa.jsonl" , split= "test" )
formatter = ChatFormatter()
sampling_params = SamplingParams(temperature= 0.0 )
metrics = (AccuracyMetric(scorer=ExactMatchScorer),)
@property
def instances ( self ):
loader = DataLoader()
for idx, doc in enumerate (loader.load(self.config.get_data_source())):
yield Instance(
question=doc[ "question" ],
gold_answer=doc[ "answer" ],
metadata={ "id" : doc.get( "id" , f"freshqa_ {idx} " )},
Variants express changes in evaluation policy without duplicating the benchmark:
register_variant( "internal_freshqa" , "3shot" , num_fewshot= 3 , fewshot_seed= 1234 )
register_variant( "internal_freshqa" , "zero" , num_fewshot= 0 )
Suites group benchmarks into standard sets you run together:
from olmo_eval.evals.suites import Suite, register
register(Suite(
name= "base_qa_few_shot" ,
tasks=(
"sciq:mc:3shot" ,
"arc_challenge:mc:3shot" ,
"internal_freshqa:mc:3shot" ,
),
))
And because runtime policy lives in the harness rather than the task definition, the same benchmark can be easily rerun under different execution rather than relying on whether a generated point track merely looks plausible.
# Baseline
olmo-eval run -m my-instruct-checkpoint -t internal_freshqa:zero
# Same task, same scoring, search/tool runtime enabled
olmo-eval run -m my-instruct-checkpoint -t internal_freshqa:zero --harness search_agent
Reproducible evaluation made open
Use olmo-eval when evaluation is part of ongoing model development rather than a one-off run—when you need to run the same benchmarks repeatedly across checkpoints under reproducible conditions and compare interventions at both the aggregate and per-question level.
If your recurring question is “How does this checkpoint differ from the last one, and where exactly did it improve or regress?”, that’s the workflow olmo-eval is built for.
Reproducible evaluation should keep pace with how models are built—not only how they're scored once they're finished. olmo-eval carries the OLMES standard into active model development, and we're releasing it openly so the community can build on it.
More from this author
OlmoEarth v1.1: A more efficient family of Earth observation models
22
May 19, 2026
EMO: Pretraining mixture of experts for emergent modularity
38
May 8, 2026
Community
Edit Preview
Upload images, audio, and videos by dragging in the text input, pasting, or clicking here .
Tap or paste here to upload images
Comment · Sign up or log in to comment
Upvote 4

## full_text

Back to Articles
olmo-eval: An evaluation workbench for the model development loop
Enterprise Article Published
June 12, 2026
Upvote 4
Tyler Murray undfined Follow
allenai
Kyle Wiggers Ai2Comms Follow
allenai
💻 Code: https://github.com/allenai/olmo-eval
While you're building an LLM, you evaluate it over and over across many interventions. Every adjustment to its data, architecture, or hyperparameters — and every step up in scale — sends you back through the same loop: adding or reconfiguring benchmarks, re-running them on each new model checkpoint, noting the results, and checking whether something that helped in a small experiment still holds up on the full training run.
Most evaluation tools aren't designed for this—they’re either built to run established benchmarks across finished models or run a model through multi-step, tool-using problems in a sandbox. They don’t keep up with a model that's constantly changing, nor do they reflect how a model might behave under specific real-world conditions.
Our last project to address this evaluation challenge was OLMES , the Open Language Model Evaluation Standard. Introduced in 2024, it was meant to make LLM benchmark scores easier to compare across releases. The same models were being scored on the same benchmarks in different ways — aspects like prompt formatting and task formulation often varied from paper to paper — so claims about which models performed best often weren't reproducible. OLMES pinned benchmarking choices down in an open, documented standard, and it became the basis for evaluating our open models from Olmo to Tulu.
But a model's final score is only part of the evaluation process—which is why we're releasing olmo-eval , a new workbench that builds on OLMES and extends it across the rest of LLM development. Compared to OLMES, olmo-eval cuts down the work of implementing new evaluations, offers more flexibility in defining where and how they run, and makes it easier to compose individual components into larger workflows. Agentic and multi-turn evaluation is supported as a first-class use case, and stronger analysis tools help you judge whether an intervention actually improved on the baseline or the difference amounts to noise.
How olmo-eval differs from existing tools
Is a 2.4pp change in performance enough to make a call?
olmo-eval overlaps in some ways with Harbor, an open framework for evaluating AI agents inside containerized, sandboxed environments. But the two tools differ in their scope. Harbor is aimed mainly at running and publishing agent benchmarks; olmo-eval was built for the everyday work of developing a model—adding and configuring benchmarks, running them across checkpoints, and analyzing the results prompt by prompt instead of as a single overall score.
Harbor runs everything the same way—inside sealed, reproducible containers. Because containers can be resource-intensive, olmo-eval lets you choose how each benchmark runs instead. A benchmark that just needs a model to answer questions can run directly, which is faster and cheaper; a benchmark that needs a locked-down environment — say, one that runs code the model wrote — gets an isolated container setup. The lightweight path is the default, and olmo-eval only opts for the heavy setup when a benchmark actually requires it.
Harbor's process for adding a benchmark is built for evals you plan to publish and share publicly, with the extra verification steps that entails. olmo-eval is built for moving quickly while you develop, and how you add a benchmark depends on what the benchmark needs: a short definition for a basic eval, with options to let a model use tools as it works through a benchmark, or — for a benchmark that already has its own code and procedure — a thin wrapper so olmo-eval can run it as is and report the results alongside other benchmark scores in the same format.
Both Harbor and olmo-eval keep benchmarks separate from the runtime policy (how the model is run to produce its answers) so you can change one without rewriting the other, but olmo-eval is designed for greater modularity. In olmo-eval, the model being evaluated, the tools it can use, the containerized environment, and any helper models – like an LLM-as-a-judge – are all swappable components. You can reuse a tool across many harnesses, or plug a grading model into one benchmark without perturbing the others, and adjust small settings (e.g., the exact wording of the prompt) without extensive effort.
Harbor reports an overall score for each model. olmo-eval reports those scores too, each with a standard error and a minimum detectable effect (the smallest difference that can be reliably distinguished from noise). But the more useful view lines the same questions up across two model checkpoints and compares them one by one, with all else held fixed. This helps you to see whether a tiny change in an overall average might indicate a real improvement or simply noise.
If you're looking for...
olmo-eval offers
Authoring a multi-example benchmark
Task subclass with a DataSource , metrics, and scoring surface
Wrapping an existing agent-style benchmark with its own runner
ExternalEval or SandboxedExternalEval ; the benchmark keeps its loop and scoring, and results land in olmo-eval's schema
Swapping the runtime under a fixed benchmark
--harness and harness presets; the harness carries provider, tools, scaffold, sandboxes, and auxiliary providers
Parallel container execution
Sandbox instances for parallel executors with capability-based routing, Docker or Modal modes
Tool definitions reusable across tasks and harnesses
@tool decorator with optional global registry
Multi-turn execution loops
Scaffolds, e.g., openai_agents , selected per harness, not baked into the task definition
An integrated evaluation stack
olmo-eval is composed of four components that are useful on their own but designed to work together to tighten the experimental LLM development loop:
A task/suite/harness abstraction that decouples benchmark logic from runtime policy. A task is how you define a benchmark in olmo-eval—what's being evaluated. A suite groups tasks into a set you run together, and a harness controls how each task is run. This separation lets the same task run as a standard baseline or with tools and scaffolding, without changing what it measures.
A sandbox and capability-routing layer, including an asynchronous sandbox planner. This supports evaluations where a model's response depends on the actions it takes using tools, like writing and running code or browsing the web. The point is to evaluate the model's real tool use: when a benchmark calls for tools, olmo-eval runs those tools and feeds the results back to the model.
A normalized experiment schema that records every run, its configuration, and the results in the same structured format. This makes it possible to group related experiments, compare checkpoints over time, and avoid the inconsistencies that often accumulate in long-running model development workflows.
A results viewer for pairwise model comparison: lining two models or checkpoints up question by question surfaces small but real performance changes that an overall average can hide.
In most model evaluation setups, adding a benchmark is a sizeable integration project. In olmo-eval, all that’s needed is a task—tasks define the benchmark dataset, how evaluation requests are built, and how model answers are scored (all code in Python):
from olmo_eval.common.formatters import ChatFormatter
from olmo_eval.common.metrics import AccuracyMetric
from olmo_eval.common.scorers import ExactMatchScorer
from olmo_eval.common.types import Instance, SamplingParams
from olmo_eval.data import DataLoader, DataSource
from olmo_eval.evals.tasks.common import Task, register, register_variant
@register( "internal_freshqa" )
class InternalFreshQA ( Task ):
data_source = DataSource(path= "s3://evals/internal/freshqa.jsonl" , split= "test" )
formatter = ChatFormatter()
sampling_params = SamplingParams(temperature= 0.0 )
metrics = (AccuracyMetric(scorer=ExactMatchScorer),)
@property
def instances ( self ):
loader = DataLoader()
for idx, doc in enumerate (loader.load(self.config.get_data_source())):
yield Instance(
question=doc[ "question" ],
gold_answer=doc[ "answer" ],
metadata={ "id" : doc.get( "id" , f"freshqa_ {idx} " )},
Variants express changes in evaluation policy without duplicating the benchmark:
register_variant( "internal_freshqa" , "3shot" , num_fewshot= 3 , fewshot_seed= 1234 )
register_variant( "internal_freshqa" , "zero" , num_fewshot= 0 )
Suites group benchmarks into standard sets you run together:
from olmo_eval.evals.suites import Suite, register
register(Suite(
name= "base_qa_few_shot" ,
tasks=(
"sciq:mc:3shot" ,
"arc_challenge:mc:3shot" ,
"internal_freshqa:mc:3shot" ,
),
))
And because runtime policy lives in the harness rather than the task definition, the same benchmark can be easily rerun under different execution rather than relying on whether a generated point track merely looks plausible.
# Baseline
olmo-eval run -m my-instruct-checkpoint -t internal_freshqa:zero
# Same task, same scoring, search/tool runtime enabled
olmo-eval run -m my-instruct-checkpoint -t internal_freshqa:zero --harness search_agent
Reproducible evaluation made open
Use olmo-eval when evaluation is part of ongoing model development rather than a one-off run—when you need to run the same benchmarks repeatedly across checkpoints under reproducible conditions and compare interventions at both the aggregate and per-question level.
If your recurring question is “How does this checkpoint differ from the last one, and where exactly did it improve or regress?”, that’s the workflow olmo-eval is built for.
Reproducible evaluation should keep pace with how models are built—not only how they're scored once they're finished. olmo-eval carries the OLMES standard into active model development, and we're releasing it openly so the community can build on it.
More from this author
OlmoEarth v1.1: A more efficient family of Earth observation models
22
May 19, 2026
EMO: Pretraining mixture of experts for emergent modularity
38
May 8, 2026
Community
Edit Preview
Upload images, audio, and videos by dragging in the text input, pasting, or clicking here .
Tap or paste here to upload images
Comment · Sign up or log in to comment
Upvote 4

## extraction_diagnostics

- extraction_method: main
- readability_score: 94
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":94,"text_length":10367,"paragraph_count":76,"sentence_count":46,"boilerplate_hits":1,"symbol_ratio":0.0054,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容器化隔离运行。采用模块化架构，模型、工具、容器环境、辅助模型均可独立替换。评测结果同时报告分数、标准误差和最小可检测效应。与 Harbor 侧重于发布不同，olmo-eval 聚焦开发阶段快速迭代，可逐问题对比检查点输出以区分真实改进与噪声。

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Back to Articles olmo-eval: An evaluation workbench for the model development loop Enterprise Article Published June 12, 2026 Upvote 4 Tyler Murray undfined Follow allenai Kyle Wiggers Ai2Comms Follow allenai 💻 Code: https://github.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   com/allenai/olmo-eval While you're building an LLM, you evaluate it over and over across many interventions.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Every adjustment to its data, architecture, or hyperparameters — and every step up in scale — sends you back through the same loop: adding or reconfiguring benchmarks, re-running them on each new model checkpoint, noting the results, and checking whether something that helped in a small experiment still holds up on the full training run.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Most evaluation tools aren't designed for this—they’re either built to run established benchmarks across finished models or run a model through multi-step, tool-using problems in a sandbox.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   They don’t keep up with a model that's constantly changing, nor do they reflect how a model might behave under specific real-world conditions.

## business_elements

- companies: Hugging Face, Blog（RSS）, GitHub
- products: agents, agent
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: 暂无公开信息
- workflows: 合同审阅 / 法律研究, 权限 / 安全治理, 部署 / 集成交付
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 12, 2026, 4, 2, 2024, 2.4, 3, 0.0
- quotes: internal_freshqa / s3://evals/internal/freshqa.jsonl / question /  ],
metadata={  /  : doc.get( 

## evidence_seed

- company_actions: Back to Articles olmo-eval: An evaluation workbench for the model development loop Enterprise Article Published June 12, 2026 Upvote 4 Tyler Murray undfined Follow allenai Kyle Wiggers Ai2Comms Follow allenai 💻 Code: https://github. / com/allenai/olmo-eval While you're building an LLM, you evaluate it over and over across many interventions. / Every adjustment to its data, architecture, or hyperparameters — and every step up in scale — sends you back through the same loop: adding or reconfiguring benchmarks, re-running them on each new model checkpoint, noting the results, and checking whether something that helped in a small experiment still holds up on the full training run.
- case_details: olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容器化隔离运行。采用模块化架构，模型、工具、容器环境、辅助模型均可独立替换。评测结果同时报告分数、标准误差和最小可检测效应。与 Harbor 侧重于发布不同，olmo-eval 聚焦开发阶段快速迭代，可逐问题对比检查点输出以区分真实改进与噪声。
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
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
- emerging_signal_score: 2

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

- none

## volatile_and_discovery_handling

- source_volatility: medium
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"olmo-eval：面向模型开发循环的评估工作台","discovery_summary":"olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容器化隔离运行。采用模块化架构，模型、工具、容器环境、辅助模型均可独立替换。评测结果同时报告分数、标准误差和最小可检测效应。与 Harbor 侧重于发布不同，olmo-eval 聚焦开发阶段快速迭代，可逐问题对比检查点输出以区分真实改进与噪声。","source_name":"Hugging Face：Blog（RSS）","origin_url":"https://huggingface.co/blog/allenai/olmo-eval","discovered_at":"2026-06-13T05:25:16.566Z","rank_on_page":202,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

olmo-eval 是基于 OLMES 标准构建的评估工作台，专为 LLM 持续开发中的反复评测场景设计。相比 OLMES，它减少了新增评测的实现工作量，支持 agentic 和多轮评测作为一等用例，并允许根据基准需求选择轻量直接运行或容器化隔离运行。采用模块化架构，模型、工具、容器环境、辅助模型均可独立替换。评测结果同时报告分数、标准误差和最小可检测效应。与 Harbor 侧重于发布不同，olmo-eval 聚焦开发阶段快速迭代，可逐问题对比检查点输出以区分真实改进与噪声。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
