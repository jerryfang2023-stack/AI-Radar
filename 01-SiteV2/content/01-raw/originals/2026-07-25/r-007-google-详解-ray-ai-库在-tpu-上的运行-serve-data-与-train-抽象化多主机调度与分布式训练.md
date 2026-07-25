---
schema_version: raw-evidence-v2
raw_id: R-007
title: "Google 详解 Ray AI 库在 TPU 上的运行：Serve、Data 与 Train 抽象化多主机调度与分布式训练"
title_zh: "Google 详解 Ray AI 库在 TPU 上的运行：Serve、Data 与 Train 抽象化多主机调度与分布式训练"
title_translation_status: not_required
title_translation_method: source_title
title_translation_model: not_applicable
original_url: "https://developers.googleblog.com/run-ray-on-tpu-part-2-ray-ai-libraries"
canonical_url: "https://developers.googleblog.com/run-ray-on-tpu-part-2-ray-ai-libraries"
source_name: "Google Developers Blog（RSS）"
source_type: official
source_level: S
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: case_or_customer
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
published_at: "2026-07-24T00:00:00.000Z"
collected_at: 2026-07-25T02:25:19.830Z
language: mixed
full_text_hash: fead783573f04246
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-25/r-007-google-详解-ray-ai-库在-tpu-上的运行-serve-data-与-train-抽象化多主机调度与分布式训练.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-25/r-007-google-详解-ray-ai-库在-tpu-上的运行-serve-data-与-train-抽象化多主机调度与分布式训练.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":9245,"paragraph_count":54,"sentence_count":61,"boilerplate_hits":0,"symbol_ratio":0.0055,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 9245
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"fead783573f04246","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Google 详解 Ray AI 库在 TPU 上的运行：Serve、Data 与 Train 抽象化多主机调度与分布式训练","discovery_summary":"Google 在第二篇技术文章中展示了 Ray Serve、Ray Data 和 JaxTrainer 如何抽象化 TPU 切片上的 AI 工作负载复杂性。Ray Serve 通过简单拓扑配置实现多主机模型的 gang-scheduling，Ray Data 以原生 JAX 批次直接供给加速器以消除数据加载瓶颈，JaxTrainer 则自动处理跨切片协调、检查点与容错，简化分布式训练。","source_name":"Google Developers Blog（RSS）","origin_url":"https://developers.googleblog.com/run-ray-on-tpu-part-2-ray-ai-libraries","discovered_at":"2026-07-25T02:16:33.189Z","rank_on_page":177,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e9525735ffcc941f
content_hash: fead783573f04246
semantic_hash: c7254f6bfce12c61
duplicate_of: ""
first_seen_at: "2026-07-24T00:00:00.000Z"
last_seen_at: 2026-07-25T02:25:19.830Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Google Developers Blog（RSS）","Google","Mistral"],"products":["Gemini","Agent"],"people":[],"industries":["开发者工具","企业服务"],"roles":["开发者 / 工程团队"],"workflows":["计费 / 预算管理","部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线","融资 / 投资"],"affected_departments":["IT / 安全","财务 / 预算","销售 / 客服"],"numbers":["2","24","2026","1","4x","4","16","6"],"quotes":["gs://my-bucket/train/",", # the slice shape, NOT a chip count\naccelerator_type="]}
evidence_seed: {"company_actions":["Google 在第二篇技术文章中展示了 Ray Serve、Ray Data 和 JaxTrainer 如何抽象化 TPU 切片上的 AI 工作负载复杂性。Ray Serve 通过简单拓扑配置实现多主机模型的 gang-scheduling，Ray Data 以原生 JAX 批次直接供给加速器以消除数据加载瓶颈，JaxTrainer 则自动处理跨切片协调、检查点与容错，简化分布式训练。","Run Ray on TPU, Part 2: Ray AI libraries JULY 24, 2026 Ivan Nardini AI Developer Relations Spencer Peterson Software Engineer Share Facebook Twitter LinkedIn Mail TL;DR : Part 2 of 2.","Part 1 covered the one hardware idea you need and the two layers underneath (GKE and Ray Core)."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"company_action","text":"Google 在第二篇技术文章中展示了 Ray Serve、Ray Data 和 JaxTrainer 如何抽象化 TPU 切片上的 AI 工作负载复杂性。Ray Serve 通过简单拓扑配置实现多主机模型的 gang-scheduling，Ray Data 以原生 JAX 批次直接供给加速器以消除数据加载瓶颈，JaxTrainer 则自动处理跨切片协调、检查点与容错，简化分布式训练。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Run Ray on TPU, Part 2: Ray AI libraries JULY 24, 2026 Ivan Nardini AI Developer Relations Spencer Peterson Software Engineer Share Facebook Twitter LinkedIn Mail TL;DR : Part 2 of 2.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Part 1 covered the one hardware idea you need and the two layers underneath (GKE and Ray Core).","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"This part shows the libraries you actually build with, Ray Serve, Ray Data, and Ray Train.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Recap Quick recap if you're landing here first.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Running Ray on TPU comes down to one caveat: TPU chips are wired into fixed groups called slices (host VMs sharing a high-speed link called the ICI), and a multi-host model has to land on one whole slice or its workers can't reach each other and the job hangs.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-25T02:25:19.830Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Google 详解 Ray AI 库在 TPU 上的运行：Serve、Data 与 Train 抽象化多主机调度与分布式训练

## clean_text

Run Ray on TPU, Part 2: Ray AI libraries
JULY 24, 2026
Ivan Nardini
AI Developer Relations
Spencer Peterson
Software Engineer
Share
Facebook
Twitter
LinkedIn
Mail
TL;DR : Part 2 of 2. Part 1 covered the one hardware idea you need and the two layers underneath (GKE and Ray Core). This part shows the libraries you actually build with, Ray Serve, Ray Data, and Ray Train.
Recap
Quick recap if you're landing here first. Running Ray on TPU comes down to one caveat: TPU chips are wired into fixed groups called slices (host VMs sharing a high-speed link called the ICI), and a multi-host model has to land on one whole slice or its workers can't reach each other and the job hangs.
Google Kubernetes Engine (GKE) with the Ray Operator add-on provisions slices and labels their hosts, and a Ray Core primitive, slice_placement_group() , reserves a whole slice at once. You declare a topology (the slice shape, like 4x4 for 16 chips, for example) and the libraries below handle the placement for you.
With Core handling placement underneath, the libraries all follow the same pattern: declare a topology, let Core reserve the slice. What changes per library is only what you declare it on. We'll go in the order most teams adopt them, serving first.
Ray Serve on TPU
Serving is where most teams start from. A model that needs several GPUs to fit can run on a single TPU host, and TPUs are often a more available and cost-effective option for inference. Ray Serve gives you the usual autoscaling, load-balancing, and multi-model composition, and on TPU it serves LLMs through vLLM , a high-throughput engine.
Sorry, your browser doesn't support playback for this video
The hard case is when a model is too big for one host (say one sharded tensor-parallel across 16 chips). That's where Serve clears it with a single extra field, topology.
accelerator_type: TPU-V6E
accelerator_config:
kind: tpu
topology: "4x4"
Plain text
Copied
That one field is worth understanding, because getting it wrong is the classic multi-host TPU failure. With topology set, Serve's TPU backend skips its usual upfront placement group and defers to the replica, which creates a slice placement group at startup. That deferral is what keeps a tensor-parallel model's workers on one shared ICI mesh. Leave it off and Serve falls back to per-chip bundles; on a multi-host model those bundles can scatter across two slices, and because there's no ICI between slices, the workers never finish their first collective. You don't get a crash, you get a deployment that sits in DEPLOYING forever while you burn TPU-hours hunting for a bug that's really one missing line of YAML. So remember, topology field makes the difference.
In practice you deploy a RayService (recommended over a raw RayCluster for production) on a published vLLM TPU image, wait for it to reach Running, and curl the endpoint. The official GKE tutorials cover Llama 3 8B and Mistral 7B on v5e, Llama 3.1 70B on v6e, and Stable Diffusion. The serve step of the get-started example walks the full deployment end to end.
Ray Data on TPU: feeding the accelerators with iter_jax_batches
A fast accelerator is only as useful as the data you can keep flowing into it, and TPUs are fast enough that a naive loader becomes the bottleneck. That's the problem iter_jax_batches() solves. It hands you batches that are already JAX arrays and already device-sharded, so a training input pipeline or a large batch-inference job pulls straight from a Ray Data pipeline with no host-side NumPy-to-JAX copy stalling the step.
ds = ray.data.read_parquet("gs://my-bucket/train/")
for batch in ds.iter_jax_batches(batch_size=1024):
# batch arrives as device-sharded JAX arrays, ready for the training step
loss = train_step(batch)
Python
Copied
iter_jax_batches API does the device sharding for you, and it handles the ragged final batch (the one that isn't a clean multiple of your batch size) with an explicit choice of drop, pad, or raise, instead of a shape error three hours into a run.
You can use it as the input side of a JaxTrainer job, and it's just as useful on its own for offline batch inference over a big dataset on a TPU slice. It landed recently in Ray, and the data step of the get-started example uses it for dataset prep and batch inference.
Ray Train on TPU: distributed training with JaxTrainer
Training used to be the confusing part of Ray on TPU, because of topology and having to account for the slice shape in your code. JaxTrainer addresses that. It brings Ray Train's training loop (checkpointing, fault tolerance, multi-slice scale-out) to JAX, Google's array and autodiff library and the native framework for TPU. You hand it a training function and a slice shape and Ray launches one worker per host, wires them into a single mesh, and runs your function on each.
from ray.train import ScalingConfig
from ray.train.v2.jax import JaxTrainer
def train_loop_per_worker(config):
import jax # import jax INSIDE the worker fn (TPU requirement)
# ... your JAX/Flax training step runs here, once per host ...
trainer = JaxTrainer(
train_loop_per_worker=train_loop_per_worker,
scaling_config=ScalingConfig(
use_tpu=True,
topology="4x4", # the slice shape, NOT a chip count
accelerator_type="TPU-V6E",
),
trainer.fit()
Python
Copied
Two things in this snippet you want to keep in mind to save debugging time. The import jax lives inside train_loop_per_worker , not at the top of the file, because each worker initializes JAX in its own TPU context; import it at module scope and you'll fight cryptic device-init errors before the first step. And topology="4x4" is the entire placement declaration, the line that used to be a block of hand-written coordination code. Set next to a GPU JaxTrainer or TorchTrainer, the only real difference is use_tpu=True and a topology instead of a GPU count.
The rest it just runs. This is because Ray Train owns the loop, you get checkpointing and fault-tolerant restarts, which is what makes long TPU runs on preemptible capacity actually finish, and topology scales to multi-slice (Ray wires the cross-slice coordination) when one slice isn't enough. The train step of the get-started example is a complete JaxTrainer DPO run.
Two final extras: TPU Docker images and dashboard metrics
As part of the first-class accelerator support, Ray now publishes official rayproject/ray:*-tpu images with the JAX/TPU stack ( jax[tpu] , flax, optax, orbax-checkpoint) and profiling tooling already installed, so you don't have to assemble a working TPU environment by hand. You can just base your image on the tagged -tpu one.
And for monitoring, the Ray Dashboard, Ray's built-in web UI for cluster and job state, now shows TPU utilization and memory next to CPU and GPU on the Cluster tab, with ray.util.tpu.init_jax_profiler() exposing a per-worker JAX profiler the dashboard can attach to.
In Summary
In this developer guide on Ray on TPU, we covered the whole journey from how Ray runs on TPU to running AI workloads.
Part 1 showed that running Ray on TPU comes down to one caveat, keeping a multi-host model on a single intact slice, and that GKE (through the Ray Operator add-on) and Ray Core (through slice_placement_group()) handle that for you.
This part put the AI libraries on top: Ray Serve gang-schedules a multi-host model onto one slice with a single accelerator_config.topology field, Ray Data feeds the slice JAX-native batches through iter_jax_batches() , and JaxTrainer runs a distributed training loop from one ScalingConfig. The same Ray you already use on GPUs, now on TPU.
What's next
And more is coming. The Ray team on Google Cloud is widening TPU support from here : deeper Ray Data and Ray LLM TPU integration, SkyRL on multi-host TPU for reinforcement learning and post-training, and dynamic super/sub-slice support are all on the roadmap.
For your own next step, my recommendation is: clone the get-started example , stand up the cluster, then run serve, data, or train. Or just enable --enable-ray-operator on a cluster and run one Ray task on a small slice to see it work. You don't have to become a TPU expert to use one, just give it a try.
For now, thanks for reading! And if you have any additional questions or feedback, feel free to reach out on socials ( LinkedIn , X ).
Happy building!
Additional resources
Runnable sample: Ray on TPU get-started in kubernetes-engine-samples , the serve, data, and train steps from this post as working code (Qwen3-4B on a v6e slice).
Serve an LLM using TPUs on GKE with KubeRay
Ray Data API
Get started with distributed training using JAX
View TPU metrics on the Ray Dashboard
rayproject/ray on Docker Hub
New here? Part 1 explains slices, GKE, and Ray Core, the foundation everything above builds on.
posted in:
AI
Case Studies
How-To Guides
Announcements
Previous
Next
Related Posts
AI
Cloud
Announcements
Solutions
Expanding Choice in Gemini Enterprise Agent Platform: Introducing Grounding with Parallel Web Search
JULY 16, 2026
Mobile
Web
Case Studies
Community
Bridging the Domain Gap: AI Race Coach built with Antigravity and Gemini
JULY 8, 2026
AI
How-To Guides
Announcements
Run Ray on TPU, Part 1: The foundations
JULY 20, 2026
Web
AI
Case Studies
Learn
Measuring What Matters with Jules
JUNE 22, 2026

## full_text

Run Ray on TPU, Part 2: Ray AI libraries
JULY 24, 2026
Ivan Nardini
AI Developer Relations
Spencer Peterson
Software Engineer
Share
Facebook
Twitter
LinkedIn
Mail
TL;DR : Part 2 of 2. Part 1 covered the one hardware idea you need and the two layers underneath (GKE and Ray Core). This part shows the libraries you actually build with, Ray Serve, Ray Data, and Ray Train.
Recap
Quick recap if you're landing here first. Running Ray on TPU comes down to one caveat: TPU chips are wired into fixed groups called slices (host VMs sharing a high-speed link called the ICI), and a multi-host model has to land on one whole slice or its workers can't reach each other and the job hangs.
Google Kubernetes Engine (GKE) with the Ray Operator add-on provisions slices and labels their hosts, and a Ray Core primitive, slice_placement_group() , reserves a whole slice at once. You declare a topology (the slice shape, like 4x4 for 16 chips, for example) and the libraries below handle the placement for you.
With Core handling placement underneath, the libraries all follow the same pattern: declare a topology, let Core reserve the slice. What changes per library is only what you declare it on. We'll go in the order most teams adopt them, serving first.
Ray Serve on TPU
Serving is where most teams start from. A model that needs several GPUs to fit can run on a single TPU host, and TPUs are often a more available and cost-effective option for inference. Ray Serve gives you the usual autoscaling, load-balancing, and multi-model composition, and on TPU it serves LLMs through vLLM , a high-throughput engine.
Sorry, your browser doesn't support playback for this video
The hard case is when a model is too big for one host (say one sharded tensor-parallel across 16 chips). That's where Serve clears it with a single extra field, topology.
accelerator_type: TPU-V6E
accelerator_config:
kind: tpu
topology: "4x4"
Plain text
Copied
That one field is worth understanding, because getting it wrong is the classic multi-host TPU failure. With topology set, Serve's TPU backend skips its usual upfront placement group and defers to the replica, which creates a slice placement group at startup. That deferral is what keeps a tensor-parallel model's workers on one shared ICI mesh. Leave it off and Serve falls back to per-chip bundles; on a multi-host model those bundles can scatter across two slices, and because there's no ICI between slices, the workers never finish their first collective. You don't get a crash, you get a deployment that sits in DEPLOYING forever while you burn TPU-hours hunting for a bug that's really one missing line of YAML. So remember, topology field makes the difference.
In practice you deploy a RayService (recommended over a raw RayCluster for production) on a published vLLM TPU image, wait for it to reach Running, and curl the endpoint. The official GKE tutorials cover Llama 3 8B and Mistral 7B on v5e, Llama 3.1 70B on v6e, and Stable Diffusion. The serve step of the get-started example walks the full deployment end to end.
Ray Data on TPU: feeding the accelerators with iter_jax_batches
A fast accelerator is only as useful as the data you can keep flowing into it, and TPUs are fast enough that a naive loader becomes the bottleneck. That's the problem iter_jax_batches() solves. It hands you batches that are already JAX arrays and already device-sharded, so a training input pipeline or a large batch-inference job pulls straight from a Ray Data pipeline with no host-side NumPy-to-JAX copy stalling the step.
ds = ray.data.read_parquet("gs://my-bucket/train/")
for batch in ds.iter_jax_batches(batch_size=1024):
# batch arrives as device-sharded JAX arrays, ready for the training step
loss = train_step(batch)
Python
Copied
iter_jax_batches API does the device sharding for you, and it handles the ragged final batch (the one that isn't a clean multiple of your batch size) with an explicit choice of drop, pad, or raise, instead of a shape error three hours into a run.
You can use it as the input side of a JaxTrainer job, and it's just as useful on its own for offline batch inference over a big dataset on a TPU slice. It landed recently in Ray, and the data step of the get-started example uses it for dataset prep and batch inference.
Ray Train on TPU: distributed training with JaxTrainer
Training used to be the confusing part of Ray on TPU, because of topology and having to account for the slice shape in your code. JaxTrainer addresses that. It brings Ray Train's training loop (checkpointing, fault tolerance, multi-slice scale-out) to JAX, Google's array and autodiff library and the native framework for TPU. You hand it a training function and a slice shape and Ray launches one worker per host, wires them into a single mesh, and runs your function on each.
from ray.train import ScalingConfig
from ray.train.v2.jax import JaxTrainer
def train_loop_per_worker(config):
import jax # import jax INSIDE the worker fn (TPU requirement)
# ... your JAX/Flax training step runs here, once per host ...
trainer = JaxTrainer(
train_loop_per_worker=train_loop_per_worker,
scaling_config=ScalingConfig(
use_tpu=True,
topology="4x4", # the slice shape, NOT a chip count
accelerator_type="TPU-V6E",
),
trainer.fit()
Python
Copied
Two things in this snippet you want to keep in mind to save debugging time. The import jax lives inside train_loop_per_worker , not at the top of the file, because each worker initializes JAX in its own TPU context; import it at module scope and you'll fight cryptic device-init errors before the first step. And topology="4x4" is the entire placement declaration, the line that used to be a block of hand-written coordination code. Set next to a GPU JaxTrainer or TorchTrainer, the only real difference is use_tpu=True and a topology instead of a GPU count.
The rest it just runs. This is because Ray Train owns the loop, you get checkpointing and fault-tolerant restarts, which is what makes long TPU runs on preemptible capacity actually finish, and topology scales to multi-slice (Ray wires the cross-slice coordination) when one slice isn't enough. The train step of the get-started example is a complete JaxTrainer DPO run.
Two final extras: TPU Docker images and dashboard metrics
As part of the first-class accelerator support, Ray now publishes official rayproject/ray:*-tpu images with the JAX/TPU stack ( jax[tpu] , flax, optax, orbax-checkpoint) and profiling tooling already installed, so you don't have to assemble a working TPU environment by hand. You can just base your image on the tagged -tpu one.
And for monitoring, the Ray Dashboard, Ray's built-in web UI for cluster and job state, now shows TPU utilization and memory next to CPU and GPU on the Cluster tab, with ray.util.tpu.init_jax_profiler() exposing a per-worker JAX profiler the dashboard can attach to.
In Summary
In this developer guide on Ray on TPU, we covered the whole journey from how Ray runs on TPU to running AI workloads.
Part 1 showed that running Ray on TPU comes down to one caveat, keeping a multi-host model on a single intact slice, and that GKE (through the Ray Operator add-on) and Ray Core (through slice_placement_group()) handle that for you.
This part put the AI libraries on top: Ray Serve gang-schedules a multi-host model onto one slice with a single accelerator_config.topology field, Ray Data feeds the slice JAX-native batches through iter_jax_batches() , and JaxTrainer runs a distributed training loop from one ScalingConfig. The same Ray you already use on GPUs, now on TPU.
What's next
And more is coming. The Ray team on Google Cloud is widening TPU support from here : deeper Ray Data and Ray LLM TPU integration, SkyRL on multi-host TPU for reinforcement learning and post-training, and dynamic super/sub-slice support are all on the roadmap.
For your own next step, my recommendation is: clone the get-started example , stand up the cluster, then run serve, data, or train. Or just enable --enable-ray-operator on a cluster and run one Ray task on a small slice to see it work. You don't have to become a TPU expert to use one, just give it a try.
For now, thanks for reading! And if you have any additional questions or feedback, feel free to reach out on socials ( LinkedIn , X ).
Happy building!
Additional resources
Runnable sample: Ray on TPU get-started in kubernetes-engine-samples , the serve, data, and train steps from this post as working code (Qwen3-4B on a v6e slice).
Serve an LLM using TPUs on GKE with KubeRay
Ray Data API
Get started with distributed training using JAX
View TPU metrics on the Ray Dashboard
rayproject/ray on Docker Hub
New here? Part 1 explains slices, GKE, and Ray Core, the foundation everything above builds on.
posted in:
AI
Case Studies
How-To Guides
Announcements
Previous
Next
Related Posts
AI
Cloud
Announcements
Solutions
Expanding Choice in Gemini Enterprise Agent Platform: Introducing Grounding with Parallel Web Search
JULY 16, 2026
Mobile
Web
Case Studies
Community
Bridging the Domain Gap: AI Race Coach built with Antigravity and Gemini
JULY 8, 2026
AI
How-To Guides
Announcements
Run Ray on TPU, Part 1: The foundations
JULY 20, 2026
Web
AI
Case Studies
Learn
Measuring What Matters with Jules
JUNE 22, 2026

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 97
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":9245,"paragraph_count":54,"sentence_count":61,"boilerplate_hits":0,"symbol_ratio":0.0055,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Google 在第二篇技术文章中展示了 Ray Serve、Ray Data 和 JaxTrainer 如何抽象化 TPU 切片上的 AI 工作负载复杂性。Ray Serve 通过简单拓扑配置实现多主机模型的 gang-scheduling，Ray Data 以原生 JAX 批次直接供给加速器以消除数据加载瓶颈，JaxTrainer 则自动处理跨切片协调、检查点与容错，简化分布式训练。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Run Ray on TPU, Part 2: Ray AI libraries JULY 24, 2026 Ivan Nardini AI Developer Relations Spencer Peterson Software Engineer Share Facebook Twitter LinkedIn Mail TL;DR : Part 2 of 2.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Part 1 covered the one hardware idea you need and the two layers underneath (GKE and Ray Core).

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   This part shows the libraries you actually build with, Ray Serve, Ray Data, and Ray Train.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Recap Quick recap if you're landing here first.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Running Ray on TPU comes down to one caveat: TPU chips are wired into fixed groups called slices (host VMs sharing a high-speed link called the ICI), and a multi-host model has to land on one whole slice or its workers can't reach each other and the job hangs.

## business_elements

- companies: Google Developers Blog（RSS）, Google, Mistral
- products: Gemini, Agent
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: 开发者 / 工程团队
- workflows: 计费 / 预算管理, 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线, 融资 / 投资
- affected_departments: IT / 安全, 财务 / 预算, 销售 / 客服
- numbers: 2, 24, 2026, 1, 4x, 4, 16, 6
- quotes: gs://my-bucket/train/ / , # the slice shape, NOT a chip count
accelerator_type=

## evidence_seed

- company_actions: Google 在第二篇技术文章中展示了 Ray Serve、Ray Data 和 JaxTrainer 如何抽象化 TPU 切片上的 AI 工作负载复杂性。Ray Serve 通过简单拓扑配置实现多主机模型的 gang-scheduling，Ray Data 以原生 JAX 批次直接供给加速器以消除数据加载瓶颈，JaxTrainer 则自动处理跨切片协调、检查点与容错，简化分布式训练。 / Run Ray on TPU, Part 2: Ray AI libraries JULY 24, 2026 Ivan Nardini AI Developer Relations Spencer Peterson Software Engineer Share Facebook Twitter LinkedIn Mail TL;DR : Part 2 of 2. / Part 1 covered the one hardware idea you need and the two layers underneath (GKE and Ray Core).
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
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
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
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
- discovery_record: {"discovery_title":"Google 详解 Ray AI 库在 TPU 上的运行：Serve、Data 与 Train 抽象化多主机调度与分布式训练","discovery_summary":"Google 在第二篇技术文章中展示了 Ray Serve、Ray Data 和 JaxTrainer 如何抽象化 TPU 切片上的 AI 工作负载复杂性。Ray Serve 通过简单拓扑配置实现多主机模型的 gang-scheduling，Ray Data 以原生 JAX 批次直接供给加速器以消除数据加载瓶颈，JaxTrainer 则自动处理跨切片协调、检查点与容错，简化分布式训练。","source_name":"Google Developers Blog（RSS）","origin_url":"https://developers.googleblog.com/run-ray-on-tpu-part-2-ray-ai-libraries","discovered_at":"2026-07-25T02:16:33.189Z","rank_on_page":177,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Google 在第二篇技术文章中展示了 Ray Serve、Ray Data 和 JaxTrainer 如何抽象化 TPU 切片上的 AI 工作负载复杂性。Ray Serve 通过简单拓扑配置实现多主机模型的 gang-scheduling，Ray Data 以原生 JAX 批次直接供给加速器以消除数据加载瓶颈，JaxTrainer 则自动处理跨切片协调、检查点与容错，简化分布式训练。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
