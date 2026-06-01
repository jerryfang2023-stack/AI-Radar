---
schema_version: raw-evidence-v2
raw_id: R-005
title: "如何使用 NVIDIA Alpamayo 在闭环中后训练自动驾驶模型"
original_url: "https://developer.nvidia.com/blog/how-to-post-train-autonomous-vehicle-models-in-closed-loop-with-nvidia-alpamayo"
canonical_url: "https://developer.nvidia.com/blog/how-to-post-train-autonomous-vehicle-models-in-closed-loop-with-nvidia-alpamayo"
source_name: "NVIDIA Technical Blog（开发者技术博客 · RSS）"
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
published_at: "2026-06-01T04:49:15.000Z"
collected_at: 2026-06-01T06:37:20.695Z
language: mixed
full_text_hash: 84b48b7f99275213
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-01/r-005-如何使用-nvidia-alpamayo-在闭环中后训练自动驾驶模型.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-01/r-005-如何使用-nvidia-alpamayo-在闭环中后训练自动驾驶模型.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":11297,"paragraph_count":77,"sentence_count":75,"boilerplate_hits":2,"symbol_ratio":0.0043,"method":"main"}
has_full_text: true
content_length: 11297
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"84b48b7f99275213","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"如何使用 NVIDIA Alpamayo 在闭环中后训练自动驾驶模型","discovery_summary":"开发自动驾驶策略需要弥合训练与部署之间的鸿沟。现有的视觉-语言-动作模型虽然能推理更复杂的驾驶场景并产生更丰富的中间推理，但主要在开放循环中训练，即模型输出与真实行为直接比较，而不考虑其对环境产生的实际影响。NVIDIA Alpamayo 提供了一种在闭环环境中进行后训练的方法。","source_name":"NVIDIA Technical Blog（开发者技术博客 · RSS）","origin_url":"https://developer.nvidia.com/blog/how-to-post-train-autonomous-vehicle-models-in-closed-loop-with-nvidia-alpamayo","discovered_at":"2026-06-01T06:34:00.333Z","rank_on_page":30,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 18c1cc5e668dbe0e
content_hash: 84b48b7f99275213
semantic_hash: f509ae2ff417cb14
duplicate_of: ""
first_seen_at: "2026-06-01T04:49:15.000Z"
last_seen_at: 2026-06-01T06:37:20.695Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool","emerging_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["NVIDIA Technical Blog（开发者技术博客 · RSS）","GitHub","Nvidia"],"products":["agents"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["31","2026\nB","0","1","2","9","12","2.26"],"quotes":["/root/.cache/huggingface/alpasim_models/alpamayo1_CLRL/step_NNNNNN"]}
evidence_seed: {"company_actions":["Vision-language-action (VLA) models that can reason over more complex driving scenes and produce richer intermediate reasoning are predominantly trained in open-loop, where model outputs are directly compared to ground-truth behaviors without considering their effect on the environment.","A systematic means to address this challenge is provided by NVIDIA Alpamayo , an open portfolio of AI models, simulation frameworks, and physical AI datasets for AV development.","Alpamayo includes the AlpaSim AV simulation platform and the AlpaGym closed-loop training framework (coming soon)."],"case_details":["开发自动驾驶策略需要弥合训练与部署之间的鸿沟。现有的视觉-语言-动作模型虽然能推理更复杂的驾驶场景并产生更丰富的中间推理，但主要在开放循环中训练，即模型输出与真实行为直接比较，而不考虑其对环境产生的实际影响。NVIDIA Alpamayo 提供了一种在闭环环境中进行后训练的方法。","Robotics How to Post-Train Autonomous Vehicle Models in Closed-Loop with NVIDIA Alpamayo May 31, 2026 By Boris Ivanovic and Marco Pavone Like Discuss (0) Developing autonomous vehicle (AV) policies requires bridging an important gap between training and deployment.","In deployment, however, a driving policy runs in closed-loop, where every braking, steering, and navigation decision affects the environment, and small errors can compound over time."],"workflow_changes":[],"before_after_clues":["可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"case_detail","text":"开发自动驾驶策略需要弥合训练与部署之间的鸿沟。现有的视觉-语言-动作模型虽然能推理更复杂的驾驶场景并产生更丰富的中间推理，但主要在开放循环中训练，即模型输出与真实行为直接比较，而不考虑其对环境产生的实际影响。NVIDIA Alpamayo 提供了一种在闭环环境中进行后训练的方法。","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"Robotics How to Post-Train Autonomous Vehicle Models in Closed-Loop with NVIDIA Alpamayo May 31, 2026 By Boris Ivanovic and Marco Pavone Like Discuss (0) Developing autonomous vehicle (AV) policies requires bridging an important gap between training and deployment.","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Vision-language-action (VLA) models that can reason over more complex driving scenes and produce richer intermediate reasoning are predominantly trained in open-loop, where model outputs are directly compared to ground-truth behaviors without considering their effect on the environment.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"In deployment, however, a driving policy runs in closed-loop, where every braking, steering, and navigation decision affects the environment, and small errors can compound over time.","supports":["daily_observation","heatmap","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"A systematic means to address this challenge is provided by NVIDIA Alpamayo , an open portfolio of AI models, simulation frameworks, and physical AI datasets for AV development.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Alpamayo includes the AlpaSim AV simulation platform and the AlpaGym closed-loop training framework (coming soon).","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# 如何使用 NVIDIA Alpamayo 在闭环中后训练自动驾驶模型

## clean_text

Robotics
How to Post-Train Autonomous Vehicle Models in Closed-Loop with NVIDIA Alpamayo
May 31, 2026
By Boris Ivanovic and Marco Pavone
Like
Discuss (0)
Developing autonomous vehicle (AV) policies requires bridging an important gap between training and deployment. Vision-language-action (VLA) models that can reason over more complex driving scenes and produce richer intermediate reasoning are predominantly trained in open-loop, where model outputs are directly compared to ground-truth behaviors without considering their effect on the environment.
In deployment, however, a driving policy runs in closed-loop, where every braking, steering, and navigation decision affects the environment, and small errors can compound over time.
A systematic means to address this challenge is provided by NVIDIA Alpamayo , an open portfolio of AI models, simulation frameworks, and physical AI datasets for AV development. Alpamayo includes the AlpaSim AV simulation platform and the AlpaGym closed-loop training framework (coming soon).
This post explains how to train AV models in closed-loop with NVIDIA Alpamayo. Specifically, it walks through how to:
Install and configure AlpaGym
Define closed-loop rewards
Launch closed-loop training
Export the post-trained checkpoint for downstream use
Closed-loop post-training with AlpaGym extends AV training workflows by turning AlpaSim rollouts into training experience. Rather than treating simulation only as a final evaluation stage, AlpaGym connects simulator feedback directly to the policy training loop.
Figure 1. End-to-end workflow for post-training a driving model such as Alpamayo using AlpaGym
How to use AlpaGym for closed-loop reinforcement learning
Reinforcement learning (RL) can be used to improve a policy that was initially trained in open-loop. Instead of optimizing only against logged expert trajectories, the model can now learn from the consequences of its own actions in simulation.
This shift is critical for AV development, where small prediction or planning errors can compound over time. In closed-loop training, each braking, steering, and navigation decision affects the next state of the environment, revealing failure modes that static datasets or open-loop evaluation may miss.
However, enabling closed-loop RL comes with its own challenges. Model inference, running simulation, training models, syncing weight updates, communicating across instances and moving data—all in parallel—is complex. This requires orchestration and efficient utilization of compute resources in a robust yet flexible manner.
Figure 2. AlpaGym enables large-scale closed-loop training , where driving models learn from the consequences of their own actions across a wide variety of simulated scenarios–greatly reducing the difference between training and deployment
To address these challenges, AlpaGym connects policy training to AlpaSim closed-loop rollouts and provides an open source, high-throughput framework for closed-loop RL. The system combines AlpaSim simulator microservices , NVIDIA Physical AI Open Datasets , and distributed NVIDIA Cosmos-RL training framework into a scalable post-training pipeline.
Built to scale seamlessly from a single GPU to multi-node GPU clusters, AlpaGym supports efficient large-scale training through an asynchronous and stable distributed RL pipeline, without requiring changes to user code. It integrates AlpaSim and Cosmos RL as its runtime and orchestration layer, GRPO as a default algorithm, and includes reference reward functions tested with Alpamayo models and the Physical AI AV NuRec dataset .
To get started with AlpaGym post-training, follow the steps outlined below.
Step 1: Install and configure AlpaGym
To install AlpaGym from the Alpamayo checkout, install the native CUDA dependencies and Redis on the host, then sync the UV workspace:
sudo apt-get update
sudo apt-get install -y libcudnn9-dev-cuda-12 \
libnccl-dev=2.26.2-1+cuda12.8 libnccl2=2.26.2-1+cuda12.8 \
redis-server git-lfs
git lfs install
git lfs pull
huggingface-cli login
# Or export HF_TOKEN=...
uv sync --all-packages
sudo apt-get update
sudo apt-get install -y libcudnn9-dev-cuda-12 \
libnccl-dev=2.26.2-1+cuda12.8 libnccl2=2.26.2-1+cuda12.8 \
redis-server
uv sync --all-packages
The Python environment is managed by uv , but cuDNN, NCCL, and the redis-server binary are host dependencies used by the CUDA model stack and Cosmos-RL. Alternatively, a suitable Dockerfile is also provided. Hugging Face authentication is required to download the scene artifacts.
An AlpaGym run is a Hydra configuration. It specifies the policy checkpoint, the AlpaSim scene set, rollout parallelism, reward function, and Cosmos-RL training parameters. In this workflow, the starting checkpoint is an Alpamayo model.
Figure 3. In AlpaGym closed-loop post-training, the host process starts AlpaSim, rollout workers expose policy drivers, AlpaSim executes simulator sessions, and AlpaGym returns rollout artifacts and rewards to the trainer
Step 2: Define the closed-loop reward
The reward should match the behavior you want to improve in closed-loop. For trajectory-quality post-training, common reward terms include progress, lane keeping, collision avoidance, offroad rate, comfort, and distance to a reference trajectory.
A practical first reward is intentionally simple: combine progress with penalties for safety-critical failures. In AlpaGym, this can be expressed as a small sum of terms, using AlpaSim metrics where possible:
# reward/progress_safety.yaml
terms:
- kind: metric
metric_name: progress
scale: 1.0
- kind: metric
metric_name: collision_any
scale: -10.0
- kind: metric
metric_name: offroad
scale: -5.0
Once the pipeline is stable, add more targeted terms for the failure modes observed in AlpaSim videos and metrics.
Step 3: Launch closed-loop post-training
Start AlpaGym training from your model checkpoint. Alpamayo serves as an example model here.
uv run -m alpagym_host.cli \
policy=alpamayo \
policy.model.kind=alpamayo_r1 \
policy.model.path=/path/to/checkpoint \
reward=progress_safety
This will bring up AlpaGym with AlpaSim on a single GPU. Stay tuned for detailed instructions on how to use your own AV model.
During training, AlpaGym requests scene rollouts from AlpaSim, collects per-episode artifacts, computes rewards, and updates the policy. Useful training signals include mean reward, reward variance, failure rates, policy loss, rollout throughput, and the gap between generated rollouts and the latest policy weights.
In this recipe, these rollout artifacts and training signals are the primary outputs of the post-training run. They help you confirm that closed-loop learning is running correctly and select checkpoints for downstream evaluation on your own held-out AlpaSim scenario suites.
Step 4: Export the post-trained checkpoint
After training, place the AlpaGym-produced checkpoint and config files into a folder that can be accessed by the AlpaSim driver (your Hugging Face model cache, for example). Then create a new driver config with that folder path (called alpamayo1_CLRL here). See the following code for what to edit to specify custom paths in a driver yaml config. This makes the AlpaGym post-trained policy runnable inside AlpaSim for closed-loop rollouts.
...
model:
model_type: alpamayo1
checkpoint_path: "/root/.cache/huggingface/alpasim_models/alpamayo1_CLRL/step_NNNNNN"
device: "cuda"
...
Next, run the exported model on a representative scenario to verify that the policy, driver, and simulation loop are connected correctly. At this stage, you can inspect how the policy behaves when its own actions affect the next state of the environment.
uv run alpasim_wizard deploy=local topology=1gpu
driver=alpamayo1_CLRL wizard.log_dir=$PWD/tutorial_alpamayo_CLRL
scenes.scene_ids=[clipgt-9ea70552-6dcb-4ee8-a368-9a906a333f6e]
A closed-loop rollout provides useful qualitative signals: whether the model produces stable trajectories and remains within the drivable area, how it reacts to nearby traffic agents, and which failure modes should be targeted during post-training.
Video 1. AlpaSim closed-loop rollout of an AV model, including the rendered camera view, predicted trajectory, and rollout-level diagnostics
With this checkpoint, teams can inspect rollout videos, per-episode metrics, reward traces, and failure cases collected during training. These artifacts are useful for debugging reward design, checking rollout stability, and selecting checkpoints for later held-out evaluation in AlpaSim.
Get started post-training AV models
Closed-loop post-training provides a practical path for iterating on end-to-end driving policies. In this case, AlpaGym uses closed-loop rollouts to post-train AV policies in simulation, enabling them to learn from the consequences of their actions.
You can use these tools together with the other components of the NVIDIA Alpamayo Open Platform to develop reasoning models that can be run, inspected, and post-trained in a closed-loop simulation workflow. Extend this same recipe more broadly with your own rewards, scenarios, and evaluation suites.
Ready to get started? Check out the NVlabs/alpamayo-recipes GitHub repo to adapt the recipe in this post for your own use cases.
To evaluate your model on a public leaderboard, see the two open AV challenges NVIDIA launched at CVPR 2026:
AlpaSim Closed-Loop E2E Driving Challenge
Physical AI AV Reasoning Challenge
To learn more, see Expanding the Alpamayo Open Platform for Developing Reasoning AVs Across Models, Data, and Simulation .
Join NVIDIA founder and CEO Jensen Huang for the NVIDIA GTC Taipei 2026 Keynote and dive deeper with related sessions .
Discuss (0)
Like
Tags
Developer Tools & Techniques | Robotics | Simulation / Modeling / Design | Automotive / Transportation | Cosmos | Intermediate Technical | Tutorial | autonomous vehicles | Computex 2026 | Open Source | Physical AI | Reinforcement Learning | Training AI Models
About the Authors
About Boris Ivanovic
Boris Ivanovic is a senior research scientist and manager in the NVIDIA Autonomous Vehicle Research Group. His research interests include AV foundation models, simulation, and AI safety. Prior to joining NVIDIA, he received his Ph.D. in Aeronautics and Astronautics in 2021 and an M.S. in Computer Science in 2018, both from Stanford University. His work has been recognized with a number of awards, including a Best Paper Award Finalist at CVPR 2025 as well as a Computex 2026 Best Choice Award.
View all posts by Boris Ivanovic
About Marco Pavone
Dr. Marco Pavone is senior director of Autonomous Vehicle Research at NVIDIA and an associate professor of Aeronautics and Astronautics at Stanford University, where he directs the Autonomous Systems Laboratory. He earned his Ph.D. in Aeronautics and Astronautics from Massachusetts Institute of Technology in 2010. His research focuses on physical AI—the development of AI systems grounded in physics, perception, and control that can operate robustly in the real world. His work spans a range of applications, including autonomous vehicles, aerospace systems, and general-purpose robotics. He has received numerous honors, including the Presidential Early Career Award for Scientists and Engineers from the White House.
View all posts by Marco Pavone
Comments

## full_text

Robotics
How to Post-Train Autonomous Vehicle Models in Closed-Loop with NVIDIA Alpamayo
May 31, 2026
By Boris Ivanovic and Marco Pavone
Like
Discuss (0)
Developing autonomous vehicle (AV) policies requires bridging an important gap between training and deployment. Vision-language-action (VLA) models that can reason over more complex driving scenes and produce richer intermediate reasoning are predominantly trained in open-loop, where model outputs are directly compared to ground-truth behaviors without considering their effect on the environment.
In deployment, however, a driving policy runs in closed-loop, where every braking, steering, and navigation decision affects the environment, and small errors can compound over time.
A systematic means to address this challenge is provided by NVIDIA Alpamayo , an open portfolio of AI models, simulation frameworks, and physical AI datasets for AV development. Alpamayo includes the AlpaSim AV simulation platform and the AlpaGym closed-loop training framework (coming soon).
This post explains how to train AV models in closed-loop with NVIDIA Alpamayo. Specifically, it walks through how to:
Install and configure AlpaGym
Define closed-loop rewards
Launch closed-loop training
Export the post-trained checkpoint for downstream use
Closed-loop post-training with AlpaGym extends AV training workflows by turning AlpaSim rollouts into training experience. Rather than treating simulation only as a final evaluation stage, AlpaGym connects simulator feedback directly to the policy training loop.
Figure 1. End-to-end workflow for post-training a driving model such as Alpamayo using AlpaGym
How to use AlpaGym for closed-loop reinforcement learning
Reinforcement learning (RL) can be used to improve a policy that was initially trained in open-loop. Instead of optimizing only against logged expert trajectories, the model can now learn from the consequences of its own actions in simulation.
This shift is critical for AV development, where small prediction or planning errors can compound over time. In closed-loop training, each braking, steering, and navigation decision affects the next state of the environment, revealing failure modes that static datasets or open-loop evaluation may miss.
However, enabling closed-loop RL comes with its own challenges. Model inference, running simulation, training models, syncing weight updates, communicating across instances and moving data—all in parallel—is complex. This requires orchestration and efficient utilization of compute resources in a robust yet flexible manner.
Figure 2. AlpaGym enables large-scale closed-loop training , where driving models learn from the consequences of their own actions across a wide variety of simulated scenarios–greatly reducing the difference between training and deployment
To address these challenges, AlpaGym connects policy training to AlpaSim closed-loop rollouts and provides an open source, high-throughput framework for closed-loop RL. The system combines AlpaSim simulator microservices , NVIDIA Physical AI Open Datasets , and distributed NVIDIA Cosmos-RL training framework into a scalable post-training pipeline.
Built to scale seamlessly from a single GPU to multi-node GPU clusters, AlpaGym supports efficient large-scale training through an asynchronous and stable distributed RL pipeline, without requiring changes to user code. It integrates AlpaSim and Cosmos RL as its runtime and orchestration layer, GRPO as a default algorithm, and includes reference reward functions tested with Alpamayo models and the Physical AI AV NuRec dataset .
To get started with AlpaGym post-training, follow the steps outlined below.
Step 1: Install and configure AlpaGym
To install AlpaGym from the Alpamayo checkout, install the native CUDA dependencies and Redis on the host, then sync the UV workspace:
sudo apt-get update
sudo apt-get install -y libcudnn9-dev-cuda-12 \
libnccl-dev=2.26.2-1+cuda12.8 libnccl2=2.26.2-1+cuda12.8 \
redis-server git-lfs
git lfs install
git lfs pull
huggingface-cli login
# Or export HF_TOKEN=...
uv sync --all-packages
sudo apt-get update
sudo apt-get install -y libcudnn9-dev-cuda-12 \
libnccl-dev=2.26.2-1+cuda12.8 libnccl2=2.26.2-1+cuda12.8 \
redis-server
uv sync --all-packages
The Python environment is managed by uv , but cuDNN, NCCL, and the redis-server binary are host dependencies used by the CUDA model stack and Cosmos-RL. Alternatively, a suitable Dockerfile is also provided. Hugging Face authentication is required to download the scene artifacts.
An AlpaGym run is a Hydra configuration. It specifies the policy checkpoint, the AlpaSim scene set, rollout parallelism, reward function, and Cosmos-RL training parameters. In this workflow, the starting checkpoint is an Alpamayo model.
Figure 3. In AlpaGym closed-loop post-training, the host process starts AlpaSim, rollout workers expose policy drivers, AlpaSim executes simulator sessions, and AlpaGym returns rollout artifacts and rewards to the trainer
Step 2: Define the closed-loop reward
The reward should match the behavior you want to improve in closed-loop. For trajectory-quality post-training, common reward terms include progress, lane keeping, collision avoidance, offroad rate, comfort, and distance to a reference trajectory.
A practical first reward is intentionally simple: combine progress with penalties for safety-critical failures. In AlpaGym, this can be expressed as a small sum of terms, using AlpaSim metrics where possible:
# reward/progress_safety.yaml
terms:
- kind: metric
metric_name: progress
scale: 1.0
- kind: metric
metric_name: collision_any
scale: -10.0
- kind: metric
metric_name: offroad
scale: -5.0
Once the pipeline is stable, add more targeted terms for the failure modes observed in AlpaSim videos and metrics.
Step 3: Launch closed-loop post-training
Start AlpaGym training from your model checkpoint. Alpamayo serves as an example model here.
uv run -m alpagym_host.cli \
policy=alpamayo \
policy.model.kind=alpamayo_r1 \
policy.model.path=/path/to/checkpoint \
reward=progress_safety
This will bring up AlpaGym with AlpaSim on a single GPU. Stay tuned for detailed instructions on how to use your own AV model.
During training, AlpaGym requests scene rollouts from AlpaSim, collects per-episode artifacts, computes rewards, and updates the policy. Useful training signals include mean reward, reward variance, failure rates, policy loss, rollout throughput, and the gap between generated rollouts and the latest policy weights.
In this recipe, these rollout artifacts and training signals are the primary outputs of the post-training run. They help you confirm that closed-loop learning is running correctly and select checkpoints for downstream evaluation on your own held-out AlpaSim scenario suites.
Step 4: Export the post-trained checkpoint
After training, place the AlpaGym-produced checkpoint and config files into a folder that can be accessed by the AlpaSim driver (your Hugging Face model cache, for example). Then create a new driver config with that folder path (called alpamayo1_CLRL here). See the following code for what to edit to specify custom paths in a driver yaml config. This makes the AlpaGym post-trained policy runnable inside AlpaSim for closed-loop rollouts.
...
model:
model_type: alpamayo1
checkpoint_path: "/root/.cache/huggingface/alpasim_models/alpamayo1_CLRL/step_NNNNNN"
device: "cuda"
...
Next, run the exported model on a representative scenario to verify that the policy, driver, and simulation loop are connected correctly. At this stage, you can inspect how the policy behaves when its own actions affect the next state of the environment.
uv run alpasim_wizard deploy=local topology=1gpu
driver=alpamayo1_CLRL wizard.log_dir=$PWD/tutorial_alpamayo_CLRL
scenes.scene_ids=[clipgt-9ea70552-6dcb-4ee8-a368-9a906a333f6e]
A closed-loop rollout provides useful qualitative signals: whether the model produces stable trajectories and remains within the drivable area, how it reacts to nearby traffic agents, and which failure modes should be targeted during post-training.
Video 1. AlpaSim closed-loop rollout of an AV model, including the rendered camera view, predicted trajectory, and rollout-level diagnostics
With this checkpoint, teams can inspect rollout videos, per-episode metrics, reward traces, and failure cases collected during training. These artifacts are useful for debugging reward design, checking rollout stability, and selecting checkpoints for later held-out evaluation in AlpaSim.
Get started post-training AV models
Closed-loop post-training provides a practical path for iterating on end-to-end driving policies. In this case, AlpaGym uses closed-loop rollouts to post-train AV policies in simulation, enabling them to learn from the consequences of their actions.
You can use these tools together with the other components of the NVIDIA Alpamayo Open Platform to develop reasoning models that can be run, inspected, and post-trained in a closed-loop simulation workflow. Extend this same recipe more broadly with your own rewards, scenarios, and evaluation suites.
Ready to get started? Check out the NVlabs/alpamayo-recipes GitHub repo to adapt the recipe in this post for your own use cases.
To evaluate your model on a public leaderboard, see the two open AV challenges NVIDIA launched at CVPR 2026:
AlpaSim Closed-Loop E2E Driving Challenge
Physical AI AV Reasoning Challenge
To learn more, see Expanding the Alpamayo Open Platform for Developing Reasoning AVs Across Models, Data, and Simulation .
Join NVIDIA founder and CEO Jensen Huang for the NVIDIA GTC Taipei 2026 Keynote and dive deeper with related sessions .
Discuss (0)
Like
Tags
Developer Tools & Techniques | Robotics | Simulation / Modeling / Design | Automotive / Transportation | Cosmos | Intermediate Technical | Tutorial | autonomous vehicles | Computex 2026 | Open Source | Physical AI | Reinforcement Learning | Training AI Models
About the Authors
About Boris Ivanovic
Boris Ivanovic is a senior research scientist and manager in the NVIDIA Autonomous Vehicle Research Group. His research interests include AV foundation models, simulation, and AI safety. Prior to joining NVIDIA, he received his Ph.D. in Aeronautics and Astronautics in 2021 and an M.S. in Computer Science in 2018, both from Stanford University. His work has been recognized with a number of awards, including a Best Paper Award Finalist at CVPR 2025 as well as a Computex 2026 Best Choice Award.
View all posts by Boris Ivanovic
About Marco Pavone
Dr. Marco Pavone is senior director of Autonomous Vehicle Research at NVIDIA and an associate professor of Aeronautics and Astronautics at Stanford University, where he directs the Autonomous Systems Laboratory. He earned his Ph.D. in Aeronautics and Astronautics from Massachusetts Institute of Technology in 2010. His research focuses on physical AI—the development of AI systems grounded in physics, perception, and control that can operate robustly in the real world. His work spans a range of applications, including autonomous vehicles, aerospace systems, and general-purpose robotics. He has received numerous honors, including the Presidential Early Career Award for Scientists and Engineers from the White House.
View all posts by Marco Pavone
Comments

## extraction_diagnostics

- extraction_method: main
- readability_score: 91
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":11297,"paragraph_count":77,"sentence_count":75,"boilerplate_hits":2,"symbol_ratio":0.0043,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   开发自动驾驶策略需要弥合训练与部署之间的鸿沟。现有的视觉-语言-动作模型虽然能推理更复杂的驾驶场景并产生更丰富的中间推理，但主要在开放循环中训练，即模型输出与真实行为直接比较，而不考虑其对环境产生的实际影响。NVIDIA Alpamayo 提供了一种在闭环环境中进行后训练的方法。

2. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   Robotics How to Post-Train Autonomous Vehicle Models in Closed-Loop with NVIDIA Alpamayo May 31, 2026 By Boris Ivanovic and Marco Pavone Like Discuss (0) Developing autonomous vehicle (AV) policies requires bridging an important gap between training and deployment.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Vision-language-action (VLA) models that can reason over more complex driving scenes and produce richer intermediate reasoning are predominantly trained in open-loop, where model outputs are directly compared to ground-truth behaviors without considering their effect on the environment.

4. **case_detail**｜supports=daily_observation, heatmap, case｜importance=high｜confidence=high
   In deployment, however, a driving policy runs in closed-loop, where every braking, steering, and navigation decision affects the environment, and small errors can compound over time.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   A systematic means to address this challenge is provided by NVIDIA Alpamayo , an open portfolio of AI models, simulation frameworks, and physical AI datasets for AV development.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Alpamayo includes the AlpaSim AV simulation platform and the AlpaGym closed-loop training framework (coming soon).

## business_elements

- companies: NVIDIA Technical Blog（开发者技术博客 · RSS）, GitHub, Nvidia
- products: agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 31, 2026
B, 0, 1, 2, 9, 12, 2.26
- quotes: /root/.cache/huggingface/alpasim_models/alpamayo1_CLRL/step_NNNNNN

## evidence_seed

- company_actions: Vision-language-action (VLA) models that can reason over more complex driving scenes and produce richer intermediate reasoning are predominantly trained in open-loop, where model outputs are directly compared to ground-truth behaviors without considering their effect on the environment. / A systematic means to address this challenge is provided by NVIDIA Alpamayo , an open portfolio of AI models, simulation frameworks, and physical AI datasets for AV development. / Alpamayo includes the AlpaSim AV simulation platform and the AlpaGym closed-loop training framework (coming soon).
- case_details: 开发自动驾驶策略需要弥合训练与部署之间的鸿沟。现有的视觉-语言-动作模型虽然能推理更复杂的驾驶场景并产生更丰富的中间推理，但主要在开放循环中训练，即模型输出与真实行为直接比较，而不考虑其对环境产生的实际影响。NVIDIA Alpamayo 提供了一种在闭环环境中进行后训练的方法。 / Robotics How to Post-Train Autonomous Vehicle Models in Closed-Loop with NVIDIA Alpamayo May 31, 2026 By Boris Ivanovic and Marco Pavone Like Discuss (0) Developing autonomous vehicle (AV) policies requires bridging an important gap between training and deployment. / In deployment, however, a driving policy runs in closed-loop, where every braking, steering, and navigation decision affects the environment, and small errors can compound over time.
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
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
- discovery_record: {"discovery_title":"如何使用 NVIDIA Alpamayo 在闭环中后训练自动驾驶模型","discovery_summary":"开发自动驾驶策略需要弥合训练与部署之间的鸿沟。现有的视觉-语言-动作模型虽然能推理更复杂的驾驶场景并产生更丰富的中间推理，但主要在开放循环中训练，即模型输出与真实行为直接比较，而不考虑其对环境产生的实际影响。NVIDIA Alpamayo 提供了一种在闭环环境中进行后训练的方法。","source_name":"NVIDIA Technical Blog（开发者技术博客 · RSS）","origin_url":"https://developer.nvidia.com/blog/how-to-post-train-autonomous-vehicle-models-in-closed-loop-with-nvidia-alpamayo","discovered_at":"2026-06-01T06:34:00.333Z","rank_on_page":30,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

开发自动驾驶策略需要弥合训练与部署之间的鸿沟。现有的视觉-语言-动作模型虽然能推理更复杂的驾驶场景并产生更丰富的中间推理，但主要在开放循环中训练，即模型输出与真实行为直接比较，而不考虑其对环境产生的实际影响。NVIDIA Alpamayo 提供了一种在闭环环境中进行后训练的方法。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 follow-builders 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
