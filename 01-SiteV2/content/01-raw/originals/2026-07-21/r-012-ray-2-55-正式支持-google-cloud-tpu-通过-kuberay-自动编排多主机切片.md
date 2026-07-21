---
schema_version: raw-evidence-v2
raw_id: R-012
title: "Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片"
title_zh: "Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片"
title_translation_status: not_required
title_translation_method: source_title
title_translation_model: not_applicable
original_url: "https://developers.googleblog.com/run-ray-on-tpu-part-1-the-foundations"
canonical_url: "https://developers.googleblog.com/run-ray-on-tpu-part-1-the-foundations"
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
published_at: "2026-07-20T00:00:00.000Z"
collected_at: 2026-07-21T01:25:35.733Z
language: mixed
full_text_hash: f047ea551bc9aa94
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-21/r-012-ray-2-55-正式支持-google-cloud-tpu-通过-kuberay-自动编排多主机切片.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-21/r-012-ray-2-55-正式支持-google-cloud-tpu-通过-kuberay-自动编排多主机切片.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":7896,"paragraph_count":55,"sentence_count":55,"boilerplate_hits":0,"symbol_ratio":0.0044,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 7896
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"f047ea551bc9aa94","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片","discovery_summary":"Ray 2.55 首次为 Google Cloud TPU 提供一等支持，开发者可通过 Ray 任务与 Actor API 在 TPU 上运行分布式 Python 负载。","source_name":"Google Developers Blog（RSS）","origin_url":"https://developers.googleblog.com/run-ray-on-tpu-part-1-the-foundations","discovered_at":"2026-07-21T01:16:25.598Z","rank_on_page":110,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 273ff3b8dde8e5af
content_hash: f047ea551bc9aa94
semantic_hash: 5f5ec7acb3ed53e8
duplicate_of: ""
first_seen_at: "2026-07-20T00:00:00.000Z"
last_seen_at: 2026-07-21T01:25:35.733Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":true,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool","emerging_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_case","importance_score":5,"importance_reason":"real customer or adoption case; rubric=5 major/platform/industry-shaping","supporting_signals":["ai_hardware_lens","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Google Developers Blog（RSS）","Google"],"products":["Gemini","Agent","agents"],"people":[],"industries":["开发者工具","企业服务"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["2.55","1","20","2026","2","4x","4","16"],"quotes":["experimental","Run Ray on TPU","Ray on TPU","keep my workers on one intact slice",", accelerator_version="]}
evidence_seed: {"company_actions":["Ray 2.55 首次为 Google Cloud TPU 提供一等支持，开发者可通过 Ray 任务与 Actor API 在 TPU 上运行分布式 Python 负载。","55, Google Cloud TPUs are a first-class accelerator in Ray .","In this \"Run Ray on TPU\" series, you will learn how a TPU slice is just another accelerator Ray schedules onto (Part 1), then walk through each library (Part 2)."],"case_details":["The task-and-actor model, a JaxTrainer, the same Ray Serve deployment just pointed at TPUs orchestrated by Google Kubernetes Engine (GKE)."],"workflow_changes":["Run Ray on TPU, Part 1: The foundations JULY 20, 2026 Ivan Nardini AI Developer Relations Share Facebook Twitter LinkedIn Mail TL;DR : If you already scale Python with Ray on GPUs, your code can now run on TPU (Tensor Processing Unit, Google's AI accelerator chip) with fully supported official APIs you already know."],"before_after_clues":["可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"company_action","text":"Ray 2.55 首次为 Google Cloud TPU 提供一等支持，开发者可通过 Ray 任务与 Actor API 在 TPU 上运行分布式 Python 负载。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"Run Ray on TPU, Part 1: The foundations JULY 20, 2026 Ivan Nardini AI Developer Relations Share Facebook Twitter LinkedIn Mail TL;DR : If you already scale Python with Ray on GPUs, your code can now run on TPU (Tensor Processing Unit, Google's AI accelerator chip) with fully supported official APIs you already know.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"The task-and-actor model, a JaxTrainer, the same Ray Serve deployment just pointed at TPUs orchestrated by Google Kubernetes Engine (GKE).","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"55, Google Cloud TPUs are a first-class accelerator in Ray .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"quote","text":"This means that TPUs are now in Ray's release pipelines with official pre-built images and support across the core libraries, instead of the old \"experimental\" path where you built your own containers and leaned on community help.","supports":["signal_card_candidate","relationship_graph_input","viewpoint"],"importance":"high","confidence":"high"},{"type":"funding","text":"In this \"Run Ray on TPU\" series, you will learn how a TPU slice is just another accelerator Ray schedules onto (Part 1), then walk through each library (Part 2).","supports":["signal_card_candidate","relationship_graph_input","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-21T01:25:35.733Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片

## clean_text

Run Ray on TPU, Part 1: The foundations
JULY 20, 2026
Ivan Nardini
AI Developer Relations
Share
Facebook
Twitter
LinkedIn
Mail
TL;DR : If you already scale Python with Ray on GPUs, your code can now run on TPU (Tensor Processing Unit, Google's AI accelerator chip) with fully supported official APIs you already know. The task-and-actor model, a JaxTrainer, the same Ray Serve deployment just pointed at TPUs orchestrated by Google Kubernetes Engine (GKE).
As of Ray 2.55, Google Cloud TPUs are a first-class accelerator in Ray . This means that TPUs are now in Ray's release pipelines with official pre-built images and support across the core libraries, instead of the old "experimental" path where you built your own containers and leaned on community help. In this "Run Ray on TPU" series, you will learn how a TPU slice is just another accelerator Ray schedules onto (Part 1), then walk through each library (Part 2).
Ray and TPU: A quick introduction
Ray is a distributed-computing framework: you write Python, and Ray runs it across a cluster as tasks (stateless functions) and actors (stateful workers). To Ray, a TPU is just another schedulable resource, the way a GPU is. You ask for it, Ray places your work on it.
But there is one thing to keep in mind, and then we move on.
TPU chips are wired together into a fixed group called a slice : several host machines (VMs) whose chips share a dedicated high-speed link called the ICI (Inter-Chip Interconnect). A multi-host model has to land on one whole slice , or its workers can't reach each other and the job just hangs.
If you think in GPUs, picture a slice as a single multi-GPU box where the fast interconnect (NVLink) only exists inside the box. Split your workers across two boxes with no cable between them and the collective operations, the all-reduce steps that synchronize gradients, never finish. Training just hangs. A TPU slice behaves the same way: the ICI is that cable, and it only reaches the chips of one slice.
That's the whole reason "Ray on TPU" needs anything special. Something has to guarantee all your workers land on one intact slice. On GPUs you barely think about it; on TPUs it's crucial, and Ray and GKE (Google Kubernetes Engine, Google's managed Kubernetes) handle it for you.
One more word you'll see everywhere is topology : it's the shape of a slice, written like 4x4 for a 16-chip slice. You ask for a topology, not a chip count.
Once you understand slicing and topology with TPU, the existing Ray stack and your development process remains unchanged and it runs on TPU slices that GKE provisions. The diagram below is the whole system in one picture: on the left, the code you write (the Ray libraries you already use); in the middle, the Ray Core layer that reserves whole slices; on the right, the GKE managed layer that provisions the hardware and labels it so Ray can find slice boundaries.
GKE provisions a slice and labels its hosts, Ray Core reads those labels to reserve the whole slice at once, and your library call sits on top, declaring a topology and nothing more. No hand-written placement code anywhere. The rest of this part walks the bottom two layers, GKE then Ray Core while Part 2 covers the Ray AI libraries.
How GKE orchestrates Ray on TPU
You run Ray on TPU through GKE using the Ray Operator add-on .
# Autopilot (fully managed nodes)
gcloud container clusters create-auto CLUSTER \
--enable-ray-operator --location=LOCATION
# or Standard (you manage node pools)
gcloud container clusters create CLUSTER \
--addons=RayOperator --location=LOCATION
Shell
Copied
That single flag installs two things that matter for TPU. The first, KubeRay , is the Kubernetes operator that turns RayCluster, RayService, and RayJob YAML into running Ray clusters; it's the same KubeRay you'd use with GPUs. The second is the TPU-specific part: the Ray TPU webhook , which stamps every TPU host with labels like ray.io/tpu-slice-name so Ray can tell which machines are wired into the same slice. That label is the thread the whole system pulls on.
From there, you ask for TPUs in a manifest the same way you'd ask for any node, with a nodeSelector for the generation and topology and the chip count as a resource. A multi-host slice adds one field, numOfHosts.
# inside a RayCluster workerGroupSpec
nodeSelector:
cloud.google.com/gke-tpu-accelerator: tpu-v6e-slice # the TPU generation
cloud.google.com/gke-tpu-topology: "4x4" # the slice shape
# ... and request chips via the google.com/tpu resource limit
numOfHosts: 4 # multi-host: how many host VMs make up this slice
Shell
Copied
GKE provisions the slice, the webhook labels it, Ray reads the labels. You write Python. Once the add-on is up, you'll see the KubeRay operator pod running, and applying that manifest brings up a head pod plus one worker pod per host in the slice. The cluster step of the get-started example provisions all of this with Terraform.
What actually keeps your workers together is a Ray Core primitive sitting just above this layer, the slice placement group , and that's where the rest of the guide starts.
Ray Core on TPU
Ray Core is the base layer, the task-and-actor engine and scheduler everything else sits on. Its TPU support lives in the public ray.util.tpu API, and there's really one function to know: slice_placement_group() . It takes that "keep my workers on one intact slice" guarantee from earlier and turns it into a single call, reserving a whole slice atomically (all hosts or none) by matching on the webhook labels.
from ray.util.tpu import slice_placement_group
from ray.util.scheduling_strategies import PlacementGroupSchedulingStrategy
# Reserve one whole v6e 4x4 slice (16 chips across 4 hosts), atomically
spg = slice_placement_group(topology="4x4", accelerator_version="v6e")
ray.get(spg.placement_group.ready(), timeout=600)
@ray.remote(resources={"TPU": 4})
def worker(rank, world): ...
tasks = [
worker.options(
scheduling_strategy=PlacementGroupSchedulingStrategy(
placement_group=spg.placement_group)
).remote(rank=i, world=spg.num_hosts)
for i in range(spg.num_hosts)
Python
Copied
It is important to highlight that you rarely call slice_placement_group yourself. The Ray AI libraries (Data, Train, Serve) call it for you, so in practice you declare a topology and they handle the slice. You'd only reach for slice_placement_group() directly when you're writing a custom distributed workload that isn't Train, Serve, or Data. One caveat worth knowing: the API is public but marked alpha ( @PublicAPI(stability="alpha") ), so it's usable today but the surface can still shift between releases.
That's the foundation. Next are the libraries.
You now have the whole mental model: a slice has to stay intact, GKE provisions and labels it, and Ray Core reserves it as a unit so you never hand-write placement code. Everything you actually build sits on top of that and reuses it.
In Part 2, we will explore how you can use Ray AI libraries on TPU for serving LLMs with vLLM, feeding slices with Ray Data and training with JaxTrainer.
Additional resources
Runnable sample: Ray on TPU get-started in kubernetes-engine-samples , cluster, serve, data, and train on a single v6e slice.
Ray Operator add-on on GKE
Use TPUs with KubeRay
For now, thanks for reading! And if you have any additional questions or feedback, feel free to reach out on socials ( LinkedIn , X ).
Happy building!
posted in:
AI
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
AI
Cloud
How-To Guides
Best Practices
Why we built ADK 2.0
JULY 1, 2026
AI
Best Practices
Industry Trends
Building scalable AI agents with modular prompt transpilation
JULY 16, 2026
AI
Cloud
How-To Guides
Announcements
Driving the Agent Quality Flywheel from Your Coding Agent
JUNE 30, 2026

## full_text

Run Ray on TPU, Part 1: The foundations
JULY 20, 2026
Ivan Nardini
AI Developer Relations
Share
Facebook
Twitter
LinkedIn
Mail
TL;DR : If you already scale Python with Ray on GPUs, your code can now run on TPU (Tensor Processing Unit, Google's AI accelerator chip) with fully supported official APIs you already know. The task-and-actor model, a JaxTrainer, the same Ray Serve deployment just pointed at TPUs orchestrated by Google Kubernetes Engine (GKE).
As of Ray 2.55, Google Cloud TPUs are a first-class accelerator in Ray . This means that TPUs are now in Ray's release pipelines with official pre-built images and support across the core libraries, instead of the old "experimental" path where you built your own containers and leaned on community help. In this "Run Ray on TPU" series, you will learn how a TPU slice is just another accelerator Ray schedules onto (Part 1), then walk through each library (Part 2).
Ray and TPU: A quick introduction
Ray is a distributed-computing framework: you write Python, and Ray runs it across a cluster as tasks (stateless functions) and actors (stateful workers). To Ray, a TPU is just another schedulable resource, the way a GPU is. You ask for it, Ray places your work on it.
But there is one thing to keep in mind, and then we move on.
TPU chips are wired together into a fixed group called a slice : several host machines (VMs) whose chips share a dedicated high-speed link called the ICI (Inter-Chip Interconnect). A multi-host model has to land on one whole slice , or its workers can't reach each other and the job just hangs.
If you think in GPUs, picture a slice as a single multi-GPU box where the fast interconnect (NVLink) only exists inside the box. Split your workers across two boxes with no cable between them and the collective operations, the all-reduce steps that synchronize gradients, never finish. Training just hangs. A TPU slice behaves the same way: the ICI is that cable, and it only reaches the chips of one slice.
That's the whole reason "Ray on TPU" needs anything special. Something has to guarantee all your workers land on one intact slice. On GPUs you barely think about it; on TPUs it's crucial, and Ray and GKE (Google Kubernetes Engine, Google's managed Kubernetes) handle it for you.
One more word you'll see everywhere is topology : it's the shape of a slice, written like 4x4 for a 16-chip slice. You ask for a topology, not a chip count.
Once you understand slicing and topology with TPU, the existing Ray stack and your development process remains unchanged and it runs on TPU slices that GKE provisions. The diagram below is the whole system in one picture: on the left, the code you write (the Ray libraries you already use); in the middle, the Ray Core layer that reserves whole slices; on the right, the GKE managed layer that provisions the hardware and labels it so Ray can find slice boundaries.
GKE provisions a slice and labels its hosts, Ray Core reads those labels to reserve the whole slice at once, and your library call sits on top, declaring a topology and nothing more. No hand-written placement code anywhere. The rest of this part walks the bottom two layers, GKE then Ray Core while Part 2 covers the Ray AI libraries.
How GKE orchestrates Ray on TPU
You run Ray on TPU through GKE using the Ray Operator add-on .
# Autopilot (fully managed nodes)
gcloud container clusters create-auto CLUSTER \
--enable-ray-operator --location=LOCATION
# or Standard (you manage node pools)
gcloud container clusters create CLUSTER \
--addons=RayOperator --location=LOCATION
Shell
Copied
That single flag installs two things that matter for TPU. The first, KubeRay , is the Kubernetes operator that turns RayCluster, RayService, and RayJob YAML into running Ray clusters; it's the same KubeRay you'd use with GPUs. The second is the TPU-specific part: the Ray TPU webhook , which stamps every TPU host with labels like ray.io/tpu-slice-name so Ray can tell which machines are wired into the same slice. That label is the thread the whole system pulls on.
From there, you ask for TPUs in a manifest the same way you'd ask for any node, with a nodeSelector for the generation and topology and the chip count as a resource. A multi-host slice adds one field, numOfHosts.
# inside a RayCluster workerGroupSpec
nodeSelector:
cloud.google.com/gke-tpu-accelerator: tpu-v6e-slice # the TPU generation
cloud.google.com/gke-tpu-topology: "4x4" # the slice shape
# ... and request chips via the google.com/tpu resource limit
numOfHosts: 4 # multi-host: how many host VMs make up this slice
Shell
Copied
GKE provisions the slice, the webhook labels it, Ray reads the labels. You write Python. Once the add-on is up, you'll see the KubeRay operator pod running, and applying that manifest brings up a head pod plus one worker pod per host in the slice. The cluster step of the get-started example provisions all of this with Terraform.
What actually keeps your workers together is a Ray Core primitive sitting just above this layer, the slice placement group , and that's where the rest of the guide starts.
Ray Core on TPU
Ray Core is the base layer, the task-and-actor engine and scheduler everything else sits on. Its TPU support lives in the public ray.util.tpu API, and there's really one function to know: slice_placement_group() . It takes that "keep my workers on one intact slice" guarantee from earlier and turns it into a single call, reserving a whole slice atomically (all hosts or none) by matching on the webhook labels.
from ray.util.tpu import slice_placement_group
from ray.util.scheduling_strategies import PlacementGroupSchedulingStrategy
# Reserve one whole v6e 4x4 slice (16 chips across 4 hosts), atomically
spg = slice_placement_group(topology="4x4", accelerator_version="v6e")
ray.get(spg.placement_group.ready(), timeout=600)
@ray.remote(resources={"TPU": 4})
def worker(rank, world): ...
tasks = [
worker.options(
scheduling_strategy=PlacementGroupSchedulingStrategy(
placement_group=spg.placement_group)
).remote(rank=i, world=spg.num_hosts)
for i in range(spg.num_hosts)
Python
Copied
It is important to highlight that you rarely call slice_placement_group yourself. The Ray AI libraries (Data, Train, Serve) call it for you, so in practice you declare a topology and they handle the slice. You'd only reach for slice_placement_group() directly when you're writing a custom distributed workload that isn't Train, Serve, or Data. One caveat worth knowing: the API is public but marked alpha ( @PublicAPI(stability="alpha") ), so it's usable today but the surface can still shift between releases.
That's the foundation. Next are the libraries.
You now have the whole mental model: a slice has to stay intact, GKE provisions and labels it, and Ray Core reserves it as a unit so you never hand-write placement code. Everything you actually build sits on top of that and reuses it.
In Part 2, we will explore how you can use Ray AI libraries on TPU for serving LLMs with vLLM, feeding slices with Ray Data and training with JaxTrainer.
Additional resources
Runnable sample: Ray on TPU get-started in kubernetes-engine-samples , cluster, serve, data, and train on a single v6e slice.
Ray Operator add-on on GKE
Use TPUs with KubeRay
For now, thanks for reading! And if you have any additional questions or feedback, feel free to reach out on socials ( LinkedIn , X ).
Happy building!
posted in:
AI
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
AI
Cloud
How-To Guides
Best Practices
Why we built ADK 2.0
JULY 1, 2026
AI
Best Practices
Industry Trends
Building scalable AI agents with modular prompt transpilation
JULY 16, 2026
AI
Cloud
How-To Guides
Announcements
Driving the Agent Quality Flywheel from Your Coding Agent
JUNE 30, 2026

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 97
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":7896,"paragraph_count":55,"sentence_count":55,"boilerplate_hits":0,"symbol_ratio":0.0044,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Ray 2.55 首次为 Google Cloud TPU 提供一等支持，开发者可通过 Ray 任务与 Actor API 在 TPU 上运行分布式 Python 负载。

2. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Run Ray on TPU, Part 1: The foundations JULY 20, 2026 Ivan Nardini AI Developer Relations Share Facebook Twitter LinkedIn Mail TL;DR : If you already scale Python with Ray on GPUs, your code can now run on TPU (Tensor Processing Unit, Google's AI accelerator chip) with fully supported official APIs you already know.

3. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   The task-and-actor model, a JaxTrainer, the same Ray Serve deployment just pointed at TPUs orchestrated by Google Kubernetes Engine (GKE).

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   55, Google Cloud TPUs are a first-class accelerator in Ray .

5. **quote**｜supports=signal_card_candidate, relationship_graph_input, viewpoint｜importance=high｜confidence=high
   This means that TPUs are now in Ray's release pipelines with official pre-built images and support across the core libraries, instead of the old "experimental" path where you built your own containers and leaned on community help.

6. **funding**｜supports=signal_card_candidate, relationship_graph_input, trend_candidate_context｜importance=high｜confidence=high
   In this "Run Ray on TPU" series, you will learn how a TPU slice is just another accelerator Ray schedules onto (Part 1), then walk through each library (Part 2).

## business_elements

- companies: Google Developers Blog（RSS）, Google
- products: Gemini, Agent, agents
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 2.55, 1, 20, 2026, 2, 4x, 4, 16
- quotes: experimental / Run Ray on TPU / Ray on TPU / keep my workers on one intact slice / , accelerator_version=

## evidence_seed

- company_actions: Ray 2.55 首次为 Google Cloud TPU 提供一等支持，开发者可通过 Ray 任务与 Actor API 在 TPU 上运行分布式 Python 负载。 / 55, Google Cloud TPUs are a first-class accelerator in Ray . / In this "Run Ray on TPU" series, you will learn how a TPU slice is just another accelerator Ray schedules onto (Part 1), then walk through each library (Part 2).
- case_details: The task-and-actor model, a JaxTrainer, the same Ray Serve deployment just pointed at TPUs orchestrated by Google Kubernetes Engine (GKE).
- workflow_changes: Run Ray on TPU, Part 1: The foundations JULY 20, 2026 Ivan Nardini AI Developer Relations Share Facebook Twitter LinkedIn Mail TL;DR : If you already scale Python with Ray on GPUs, your code can now run on TPU (Tensor Processing Unit, Google's AI accelerator chip) with fully supported official APIs you already know.
- before_after_clues: 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_case
- importance_score: 5
- importance_reason: real customer or adoption case; rubric=5 major/platform/industry-shaping
- supporting_signals: ai_hardware_lens,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: true
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: true
- emerging_pool: true
- user_feedback_pool: false
- watchlist: true

## pool_routes

- core_pool
- emerging_pool

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
- discovery_record: {"discovery_title":"Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片","discovery_summary":"Ray 2.55 首次为 Google Cloud TPU 提供一等支持，开发者可通过 Ray 任务与 Actor API 在 TPU 上运行分布式 Python 负载。","source_name":"Google Developers Blog（RSS）","origin_url":"https://developers.googleblog.com/run-ray-on-tpu-part-1-the-foundations","discovered_at":"2026-07-21T01:16:25.598Z","rank_on_page":110,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Ray 2.55 首次为 Google Cloud TPU 提供一等支持，开发者可通过 Ray 任务与 Actor API 在 TPU 上运行分布式 Python 负载。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
