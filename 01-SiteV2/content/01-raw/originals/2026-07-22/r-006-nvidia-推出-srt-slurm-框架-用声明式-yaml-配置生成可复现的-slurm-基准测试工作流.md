---
schema_version: raw-evidence-v2
raw_id: R-006
title: "NVIDIA 推出 srt-slurm 框架，用声明式 YAML 配置生成可复现的 SLURM 基准测试工作流"
title_zh: "NVIDIA 推出 srt-slurm 框架，用声明式 YAML 配置生成可复现的 SLURM 基准测试工作流"
title_translation_status: not_required
title_translation_method: source_title
title_translation_model: not_applicable
original_url: "https://www.marktechpost.com/2026/07/21/validating-distributed-llm-serving-benchmarks-with-nvidia-srt-slurm-slurm-recipes-parameter-sweeps-and-pareto-analysis"
canonical_url: "https://marktechpost.com/2026/07/21/validating-distributed-llm-serving-benchmarks-with-nvidia-srt-slurm-slurm-recipes-parameter-sweeps-and-pareto-analysis"
source_name: "MarkTechPost（RSS）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: case_or_customer
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: formal_report
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-21T16:29:36.000Z"
collected_at: 2026-07-22T01:55:08.166Z
language: mixed
full_text_hash: 960a098be5e6bfa2
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-22/r-006-nvidia-推出-srt-slurm-框架-用声明式-yaml-配置生成可复现的-slurm-基准测试工作流.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-22/r-006-nvidia-推出-srt-slurm-框架-用声明式-yaml-配置生成可复现的-slurm-基准测试工作流.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":12503,"paragraph_count":153,"sentence_count":45,"boilerplate_hits":2,"symbol_ratio":0.0186,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}
has_full_text: true
content_length: 12503
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"960a098be5e6bfa2","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"NVIDIA 推出 srt-slurm 框架，用声明式 YAML 配置生成可复现的 SLURM 基准测试工作流","discovery_summary":"NVIDIA 推出 srt-slurm 框架，通过 srtctl CLI 将声明式 YAML 配置转化为可复现的 SLURM 基准测试工作流。该框架支持内置和自定义 recipe 的 dry-run 验证、参数扫描，以及面向 DeepSeek-R1 的分离式 prefill/decode 部署配置。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/21/validating-distributed-llm-serving-benchmarks-with-nvidia-srt-slurm-slurm-recipes-parameter-sweeps-and-pareto-analysis","discovered_at":"2026-07-22T01:46:55.155Z","rank_on_page":166,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: f2f1ca6c483d39c9
content_hash: 960a098be5e6bfa2
semantic_hash: 3a13f774d27187bc
duplicate_of: ""
first_seen_at: "2026-07-21T16:29:36.000Z"
last_seen_at: 2026-07-22T01:55:08.166Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_vertical_solution","importance_score":5,"importance_reason":"AI hardware scenario or service deployment; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","ai_hardware_lens","market_shaping_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["MarkTechPost（RSS）","Google","GitHub","Nvidia"],"products":["Agent"],"people":[],"industries":["医疗","开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["合同审阅 / 法律研究","部署 / 集成交付"],"business_actions":["发布 / 推出","合作 / 联盟","部署 / 上线","融资 / 投资"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["1","6000","0","78","2","200","4","100"],"quotes":["Run a shell command, stream output.","\nprint(f",")\nr = subprocess.run(cmd, shell=True, text=True, capture_output=True)\nout = (r.stdout or ",") + (r.stderr or ",")\nif not quiet:\nprint(out[-6000:])\nif check and r.returncode != 0:\nraise RuntimeError(f"]}
evidence_seed: {"company_actions":["We also generate parameter sweeps, interact with the typed Python API, validate expanded configurations, and analyze simulated benchmark results through a throughput-versus-latency Pareto frontier.","Although Colab does not provide a real SLURM environment, we use it as a practical development workspace to understand, validate, and prepare production-grade benchmark recipes before we submit them to an actual GPU cluster."],"case_details":["NVIDIA 推出 srt-slurm 框架，通过 srtctl CLI 将声明式 YAML 配置转化为可复现的 SLURM 基准测试工作流。该框架支持内置和自定义 recipe 的 dry-run 验证、参数扫描，以及面向 DeepSeek-R1 的分离式 prefill/decode 部署配置。","We set up the project in Google Colab, inspect its internal architecture, define a cluster configuration, dry-run built-in and custom recipes, and model a disaggregated prefill-and-decode deployment for DeepSeek-R1."],"workflow_changes":["Artificial Intelligence AI Infrastructure Technology Editors Pick Staff Tutorials In this tutorial, we explore NVIDIA’s srt-slurm framework and learn how we use srtctl to convert declarative YAML configurations into reproducible SLURM benchmark workflows for distributed LLM serving.","Copy Code Copied Use a different Browser import os, sys, subprocess, textwrap, json, shutil, importlib from pathlib import Path def run(cmd, check=True, quiet=False): \"\"\"Run a shell command, stream output."],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"case_detail","text":"NVIDIA 推出 srt-slurm 框架，通过 srtctl CLI 将声明式 YAML 配置转化为可复现的 SLURM 基准测试工作流。该框架支持内置和自定义 recipe 的 dry-run 验证、参数扫描，以及面向 DeepSeek-R1 的分离式 prefill/decode 部署配置。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"Artificial Intelligence AI Infrastructure Technology Editors Pick Staff Tutorials In this tutorial, we explore NVIDIA’s srt-slurm framework and learn how we use srtctl to convert declarative YAML configurations into reproducible SLURM benchmark workflows for distributed LLM serving.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"We set up the project in Google Colab, inspect its internal architecture, define a cluster configuration, dry-run built-in and custom recipes, and model a disaggregated prefill-and-decode deployment for DeepSeek-R1.","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"We also generate parameter sweeps, interact with the typed Python API, validate expanded configurations, and analyze simulated benchmark results through a throughput-versus-latency Pareto frontier.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Although Colab does not provide a real SLURM environment, we use it as a practical development workspace to understand, validate, and prepare production-grade benchmark recipes before we submit them to an actual GPU cluster.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"Copy Code Copied Use a different Browser import os, sys, subprocess, textwrap, json, shutil, importlib from pathlib import Path def run(cmd, check=True, quiet=False): \"\"\"Run a shell command, stream output.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-22T01:55:08.166Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# NVIDIA 推出 srt-slurm 框架，用声明式 YAML 配置生成可复现的 SLURM 基准测试工作流

## clean_text

Artificial Intelligence
AI Infrastructure
Technology
Editors Pick
Staff
Tutorials
In this tutorial, we explore NVIDIA’s srt-slurm framework and learn how we use srtctl to convert declarative YAML configurations into reproducible SLURM benchmark workflows for distributed LLM serving. We set up the project in Google Colab, inspect its internal architecture, define a cluster configuration, dry-run built-in and custom recipes, and model a disaggregated prefill-and-decode deployment for DeepSeek-R1. We also generate parameter sweeps, interact with the typed Python API, validate expanded configurations, and analyze simulated benchmark results through a throughput-versus-latency Pareto frontier. Although Colab does not provide a real SLURM environment, we use it as a practical development workspace to understand, validate, and prepare production-grade benchmark recipes before we submit them to an actual GPU cluster.
Copy Code Copied Use a different Browser
import os, sys, subprocess, textwrap, json, shutil, importlib
from pathlib import Path
def run(cmd, check=True, quiet=False):
"""Run a shell command, stream output."""
print(f"\n$ {cmd}")
r = subprocess.run(cmd, shell=True, text=True, capture_output=True)
out = (r.stdout or "") + (r.stderr or "")
if not quiet:
print(out[-6000:])
if check and r.returncode != 0:
raise RuntimeError(f"Command failed ({r.returncode}): {cmd}")
return out
def section(title):
print("\n" + "═"*78 + f"\n {title}\n" + "═"*78)
section("1. Install srt-slurm")
REPO = Path("/content/srt-slurm") if Path("/content").exists() else Path.cwd()/"srt-slurm"
if not REPO.exists():
run(f"git clone --depth 1 https://github.com/NVIDIA/srt-slurm.git {REPO}", quiet=True)
run(f"{sys.executable} -m pip install -q -e {REPO}", quiet=True)
sys.path.insert(0, str(REPO / "src"))
importlib.invalidate_caches()
os.chdir(REPO)
run("srtctl --help")
We prepare the Colab environment by importing the required modules and defining reusable helper functions for command execution and section formatting. We clone the NVIDIA srt-slurm repository, install it in editable mode, and expose its source directory to the active Python runtime. We then switch to the repository directory and verify that the srtctl command-line interface is installed correctly.
Copy Code Copied Use a different Browser
section("2. Repository architecture")
print(textwrap.dedent("""
src/srtctl/
cli/ submit.py (apply/dry-run/preflight/monitor), do_sweep, interactive
core/ schema.py (typed config), sweep.py, slurm.py (sbatch gen),
validation.py, health.py, topology.py, fingerprint.py
backends/ sglang.py, trtllm.py, vllm.py, mocker.py ← engine adapters
frontends/ Dynamo / router frontends
templates/ Jinja2 → sbatch + orchestrator scripts
recipes/ ready-made benchmarks per platform (gb200-fp4, h100, b200-fp8,
qwen3-32b, dsv4-pro, mocker smoke tests, ...)
analysis/ srtlog (log parsers) + Streamlit dashboard (Pareto, latency...)
docs/ sweeps.md, profiling.md, analyzing.md, config-reference.md
"""))
for d in ["recipes", "docs"]:
print(f"{d}/ →", ", ".join(sorted(p.name for p in (REPO/d).iterdir()))[:300])
section("3. Cluster configuration (srtslurm.yaml)")
(REPO/"srtslurm.yaml").write_text(textwrap.dedent("""\
cluster: "colab-demo"
default_account: "demo-account"
default_partition: "gpu"
default_time_limit: "01:00:00"
gpus_per_node: 4
use_gpus_per_node_directive: true
use_segment_sbatch_directive: true
containers:
dynamo-sglang: "/containers/dynamo-sglang.sqsh"
lmsysorg+sglang+v0.5.5.post2.sqsh: "/containers/sglang-v0.5.5.sqsh"
model_paths:
deepseek-r1: "/models/DeepSeek-R1"
"""))
print((REPO/"srtslurm.yaml").read_text())
We inspect the repository structure to understand how srtctl organizes its command-line tools, schemas, backends, templates, recipes, and analysis components. We then create a local srtslurm.yaml file containing simulated cluster defaults, container aliases, GPU settings, and model paths. We use this configuration to resolve recipe references in Colab without requiring access to an actual SLURM cluster.
Copy Code Copied Use a different Browser
section("4. Dry-run: mocker smoke test → generated sbatch script")
run("srtctl dry-run -f recipes/mocker/agg.yaml", check=False)
section("5. Custom disaggregated recipe (prefill/decode split)")
(REPO/"my-disagg.yaml").write_text(textwrap.dedent("""\
name: "colab-disagg-demo"
model:
path: "deepseek-r1"
container: "lmsysorg+sglang+v0.5.5.post2.sqsh"
precision: "fp8"
resources:
gpu_type: "gb200"
gpus_per_node: 4
prefill_nodes: 1
decode_nodes: 2
prefill_workers: 1
decode_workers: 2
backend:
prefill_environment: { PYTHONUNBUFFERED: "1" }
decode_environment: { PYTHONUNBUFFERED: "1" }
sglang_config:
prefill:
served-model-name: "deepseek-ai/DeepSeek-R1"
model-path: "/model/"
trust-remote-code: true
kv-cache-dtype: "fp8_e4m3"
tensor-parallel-size: 4
disaggregation-mode: "prefill"
decode:
served-model-name: "deepseek-ai/DeepSeek-R1"
model-path: "/model/"
trust-remote-code: true
kv-cache-dtype: "fp8_e4m3"
tensor-parallel-size: 4
disaggregation-mode: "decode"
benchmark:
type: "sa-bench"
isl: 1024
osl: 1024
concurrencies: [64, 128, 256]
req_rate: "inf"
"""))
run("srtctl dry-run -f my-disagg.yaml", check=False)
We dry-run the built-in mocker recipe to examine how srtctl validates configurations and generates SLURM submission artifacts without executing a real benchmark. We then define an advanced DeepSeek-R1 recipe that separates prefill and decode workloads across independent node and worker pools. We validate this disaggregated SGLang configuration through another dry run and inspect how the serving parameters are translated into job scripts.
Copy Code Copied Use a different Browser
section("6. Parameter sweep (grid search) — dry-run + expansion on disk")
run("srtctl dry-run -f examples/example-sweep.yaml", check=False)
sweep_dirs = sorted((REPO/"dry-runs").glob("example-sweep_sweep_*"))
if sweep_dirs:
latest = sweep_dirs[-1]
print("Per-job configs generated by the sweep expander:")
for p in sorted(latest.rglob("config.yaml")):
print(" ", p.relative_to(REPO))
section("7. Programmatic use of srtctl's Python API")
import yaml
from srtctl.core.config import load_config
from srtctl.core.sweep import generate_sweep_configs, expand_template
from srtctl.core.schema import BenchmarkType, Precision, GpuType
cfg = load_config("my-disagg.yaml")
print(f"Loaded : {cfg.name}")
print(f"Model : {cfg.model.path} ({cfg.model.precision}) on {cfg.resources.gpu_type}")
print(f"Layout : {cfg.resources.prefill_nodes}P + {cfg.resources.decode_nodes}D nodes, "
f"{cfg.resources.gpus_per_node} GPUs/node")
print(f"Bench : {cfg.benchmark.type} isl={cfg.benchmark.isl} osl={cfg.benchmark.osl} "
f"concurrencies={cfg.benchmark.concurrencies}")
print(f"Enums : benchmarks={[b.value for b in BenchmarkType]}")
print(f" precisions={[p.value for p in Precision]}, gpus={[g.value for g in GpuType]}")
raw_sweep = yaml.safe_load(Path("examples/example-sweep.yaml").read_text())
jobs = generate_sweep_configs(raw_sweep)
print(f"\nSweep expands to {len(jobs)} jobs:")
for job_cfg, params in jobs:
pf = job_cfg["backend"]["sglang_config"]["prefill"]
print(f" {params} → chunked-prefill-size={pf['chunked-prefill-size']}, "
f"max-total-tokens={pf['max-total-tokens']}")
print("\nTemplate substitution:",
expand_template({"flag": "{x}", "n": "{y}"}, {"x": 4096, "y": 2}))
We execute the example parameter sweep and inspect the individual job configurations created from its Cartesian search space. We load our custom recipe through the typed Python API and examine its model, precision, GPU topology, benchmark settings, and supported enumeration values. We also programmatically expand sweep templates and verify how each parameter combination affects the generated backend configuration.
Copy Code Copied Use a different Browser
section("8. Analysis: Pareto frontier from (simulated) benchmark results")
import numpy as np, matplotlib.pyplot as plt
rng = np.random.default_rng(0)
def simulate(variant, base_tps, base_itl):
rows = []
tps_gpu = base_tps * c / (c + 90) * rng.uniform(.97, 1.03)
itl = base_itl * (1 + c/220) * rng.uniform(.97, 1.03)
rows.append({"variant": variant, "concurrency": c,
"tok_s_gpu": tps_gpu, "itl_ms": itl})
return rows
results = simulate("chunked=4096", 260, 9.5) + simulate("chunked=8192", 300, 11.5)
print(json.dumps(results[:3], indent=2), "...")
plt.figure(figsize=(8, 5))
for variant in ("chunked=4096", "chunked=8192"):
pts = [(r["itl_ms"], r["tok_s_gpu"], r["concurrency"])
for r in results if r["variant"] == variant]
xs, ys, cs = zip(*pts)
plt.plot(xs, ys, "o-", label=variant)
for x, y, c in pts:
plt.annotate(str(c), (x, y), fontsize=7, xytext=(3, 3),
textcoords="offset points")
plt.xlabel("Inter-token latency (ms/token) → worse")
plt.ylabel("Throughput (tokens/s/GPU) → better")
plt.title("Pareto frontier: sweep variants (points labeled by concurrency)")
plt.legend(); plt.grid(alpha=.3); plt.tight_layout(); plt.show()
We simulate benchmark observations for two chunked-prefill variants across increasing concurrency levels. We calculate representative throughput per GPU and inter-token latency values to model the saturation and latency growth commonly observed in distributed serving systems. We then visualize these results in a Pareto-style plot to compare throughput and responsiveness across configurations.
Copy Code Copied Use a different Browser
section("9. Next steps on a real cluster")
print(textwrap.dedent("""\
make setup ARCH=aarch64|x86_64
srtctl preflight -f my-disagg.yaml
srtctl apply -f my-disagg.yaml
srtctl apply -f sweep.yaml
srtctl monitor
uv run streamlit run analysis/dashboard/app.py
srtctl diff runA runB
Logs land in outputs/{JOB_ID}/logs/; analysis/srtlog parses them
(NodeAnalyzer, RunLoader) for programmatic post-processing.
Reproducibility tip (srtctl also prints this in dry-run): add an
identity: block to your recipe — HF model repo + revision, container
image URI, and framework versions — so srtctl can verify the runtime
matches your declaration at job start.
"""))
print("✅ Tutorial complete.")
We outline the production workflow that we follow when transferring validated recipes from Colab to a real SLURM-based GPU cluster. We review the commands used for environment setup, preflight validation, job submission, sweep execution, monitoring, dashboard analysis, and experiment comparison. We also emphasize reproducibility by declaring model revisions, container identities, and framework versions inside each benchmark recipe.
In conclusion, we built a complete understanding of how srtctl structures, validates, expands, and prepares distributed LLM-serving benchmarks for execution on SLURM infrastructure. We moved from basic installation and repository inspection to advanced disaggregated serving configurations, Cartesian parameter sweeps, programmatic schema access, and benchmark-result analysis. We also saw how dry runs expose generated job artifacts and help us detect configuration problems before expensive cluster resources are allocated. With this workflow in place, we can confidently transfer our validated recipes to a real NVIDIA GPU cluster, run preflight checks, submit benchmark jobs, monitor execution, compare experiment fingerprints, and analyze performance trade-offs in a reproducible manner.
Check out the Full Code here . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
Sana Hassan
+ posts Bio
Sana Hassan, a consulting intern at Marktechpost and dual-degree student at IIT Madras, is passionate about applying technology and AI to address real-world challenges. With a keen interest in solving practical problems, he brings a fresh perspective to the intersection of AI and real-life solutions.
Sana Hassan
Fine-Tuning Qwen3 with LoRA Using NVIDIA NeMo AutoModel: A Complete Single-GPU Google Colab Workflow Tutorial
Sana Hassan
How to Build Plasmid Engineering Workbench with Circular Mapping, Restriction Analysis, Virtual Gels, and Primer Design
Sana Hassan
Patter SDK Guide to Building a Restaurant Booking Phone Agent with Dynamic Variables, Guardrails, Latency Dashboards, and Eval Checks
Sana Hassan
Building a Gin Config Controlled PyTorch Pipeline with Configurable MLP Variants, Cosine Scheduling, and Runtime Parameter Overrides

## full_text

Artificial Intelligence
AI Infrastructure
Technology
Editors Pick
Staff
Tutorials
In this tutorial, we explore NVIDIA’s srt-slurm framework and learn how we use srtctl to convert declarative YAML configurations into reproducible SLURM benchmark workflows for distributed LLM serving. We set up the project in Google Colab, inspect its internal architecture, define a cluster configuration, dry-run built-in and custom recipes, and model a disaggregated prefill-and-decode deployment for DeepSeek-R1. We also generate parameter sweeps, interact with the typed Python API, validate expanded configurations, and analyze simulated benchmark results through a throughput-versus-latency Pareto frontier. Although Colab does not provide a real SLURM environment, we use it as a practical development workspace to understand, validate, and prepare production-grade benchmark recipes before we submit them to an actual GPU cluster.
Copy Code Copied Use a different Browser
import os, sys, subprocess, textwrap, json, shutil, importlib
from pathlib import Path
def run(cmd, check=True, quiet=False):
"""Run a shell command, stream output."""
print(f"\n$ {cmd}")
r = subprocess.run(cmd, shell=True, text=True, capture_output=True)
out = (r.stdout or "") + (r.stderr or "")
if not quiet:
print(out[-6000:])
if check and r.returncode != 0:
raise RuntimeError(f"Command failed ({r.returncode}): {cmd}")
return out
def section(title):
print("\n" + "═"*78 + f"\n {title}\n" + "═"*78)
section("1. Install srt-slurm")
REPO = Path("/content/srt-slurm") if Path("/content").exists() else Path.cwd()/"srt-slurm"
if not REPO.exists():
run(f"git clone --depth 1 https://github.com/NVIDIA/srt-slurm.git {REPO}", quiet=True)
run(f"{sys.executable} -m pip install -q -e {REPO}", quiet=True)
sys.path.insert(0, str(REPO / "src"))
importlib.invalidate_caches()
os.chdir(REPO)
run("srtctl --help")
We prepare the Colab environment by importing the required modules and defining reusable helper functions for command execution and section formatting. We clone the NVIDIA srt-slurm repository, install it in editable mode, and expose its source directory to the active Python runtime. We then switch to the repository directory and verify that the srtctl command-line interface is installed correctly.
Copy Code Copied Use a different Browser
section("2. Repository architecture")
print(textwrap.dedent("""
src/srtctl/
cli/ submit.py (apply/dry-run/preflight/monitor), do_sweep, interactive
core/ schema.py (typed config), sweep.py, slurm.py (sbatch gen),
validation.py, health.py, topology.py, fingerprint.py
backends/ sglang.py, trtllm.py, vllm.py, mocker.py ← engine adapters
frontends/ Dynamo / router frontends
templates/ Jinja2 → sbatch + orchestrator scripts
recipes/ ready-made benchmarks per platform (gb200-fp4, h100, b200-fp8,
qwen3-32b, dsv4-pro, mocker smoke tests, ...)
analysis/ srtlog (log parsers) + Streamlit dashboard (Pareto, latency...)
docs/ sweeps.md, profiling.md, analyzing.md, config-reference.md
"""))
for d in ["recipes", "docs"]:
print(f"{d}/ →", ", ".join(sorted(p.name for p in (REPO/d).iterdir()))[:300])
section("3. Cluster configuration (srtslurm.yaml)")
(REPO/"srtslurm.yaml").write_text(textwrap.dedent("""\
cluster: "colab-demo"
default_account: "demo-account"
default_partition: "gpu"
default_time_limit: "01:00:00"
gpus_per_node: 4
use_gpus_per_node_directive: true
use_segment_sbatch_directive: true
containers:
dynamo-sglang: "/containers/dynamo-sglang.sqsh"
lmsysorg+sglang+v0.5.5.post2.sqsh: "/containers/sglang-v0.5.5.sqsh"
model_paths:
deepseek-r1: "/models/DeepSeek-R1"
"""))
print((REPO/"srtslurm.yaml").read_text())
We inspect the repository structure to understand how srtctl organizes its command-line tools, schemas, backends, templates, recipes, and analysis components. We then create a local srtslurm.yaml file containing simulated cluster defaults, container aliases, GPU settings, and model paths. We use this configuration to resolve recipe references in Colab without requiring access to an actual SLURM cluster.
Copy Code Copied Use a different Browser
section("4. Dry-run: mocker smoke test → generated sbatch script")
run("srtctl dry-run -f recipes/mocker/agg.yaml", check=False)
section("5. Custom disaggregated recipe (prefill/decode split)")
(REPO/"my-disagg.yaml").write_text(textwrap.dedent("""\
name: "colab-disagg-demo"
model:
path: "deepseek-r1"
container: "lmsysorg+sglang+v0.5.5.post2.sqsh"
precision: "fp8"
resources:
gpu_type: "gb200"
gpus_per_node: 4
prefill_nodes: 1
decode_nodes: 2
prefill_workers: 1
decode_workers: 2
backend:
prefill_environment: { PYTHONUNBUFFERED: "1" }
decode_environment: { PYTHONUNBUFFERED: "1" }
sglang_config:
prefill:
served-model-name: "deepseek-ai/DeepSeek-R1"
model-path: "/model/"
trust-remote-code: true
kv-cache-dtype: "fp8_e4m3"
tensor-parallel-size: 4
disaggregation-mode: "prefill"
decode:
served-model-name: "deepseek-ai/DeepSeek-R1"
model-path: "/model/"
trust-remote-code: true
kv-cache-dtype: "fp8_e4m3"
tensor-parallel-size: 4
disaggregation-mode: "decode"
benchmark:
type: "sa-bench"
isl: 1024
osl: 1024
concurrencies: [64, 128, 256]
req_rate: "inf"
"""))
run("srtctl dry-run -f my-disagg.yaml", check=False)
We dry-run the built-in mocker recipe to examine how srtctl validates configurations and generates SLURM submission artifacts without executing a real benchmark. We then define an advanced DeepSeek-R1 recipe that separates prefill and decode workloads across independent node and worker pools. We validate this disaggregated SGLang configuration through another dry run and inspect how the serving parameters are translated into job scripts.
Copy Code Copied Use a different Browser
section("6. Parameter sweep (grid search) — dry-run + expansion on disk")
run("srtctl dry-run -f examples/example-sweep.yaml", check=False)
sweep_dirs = sorted((REPO/"dry-runs").glob("example-sweep_sweep_*"))
if sweep_dirs:
latest = sweep_dirs[-1]
print("Per-job configs generated by the sweep expander:")
for p in sorted(latest.rglob("config.yaml")):
print(" ", p.relative_to(REPO))
section("7. Programmatic use of srtctl's Python API")
import yaml
from srtctl.core.config import load_config
from srtctl.core.sweep import generate_sweep_configs, expand_template
from srtctl.core.schema import BenchmarkType, Precision, GpuType
cfg = load_config("my-disagg.yaml")
print(f"Loaded : {cfg.name}")
print(f"Model : {cfg.model.path} ({cfg.model.precision}) on {cfg.resources.gpu_type}")
print(f"Layout : {cfg.resources.prefill_nodes}P + {cfg.resources.decode_nodes}D nodes, "
f"{cfg.resources.gpus_per_node} GPUs/node")
print(f"Bench : {cfg.benchmark.type} isl={cfg.benchmark.isl} osl={cfg.benchmark.osl} "
f"concurrencies={cfg.benchmark.concurrencies}")
print(f"Enums : benchmarks={[b.value for b in BenchmarkType]}")
print(f" precisions={[p.value for p in Precision]}, gpus={[g.value for g in GpuType]}")
raw_sweep = yaml.safe_load(Path("examples/example-sweep.yaml").read_text())
jobs = generate_sweep_configs(raw_sweep)
print(f"\nSweep expands to {len(jobs)} jobs:")
for job_cfg, params in jobs:
pf = job_cfg["backend"]["sglang_config"]["prefill"]
print(f" {params} → chunked-prefill-size={pf['chunked-prefill-size']}, "
f"max-total-tokens={pf['max-total-tokens']}")
print("\nTemplate substitution:",
expand_template({"flag": "{x}", "n": "{y}"}, {"x": 4096, "y": 2}))
We execute the example parameter sweep and inspect the individual job configurations created from its Cartesian search space. We load our custom recipe through the typed Python API and examine its model, precision, GPU topology, benchmark settings, and supported enumeration values. We also programmatically expand sweep templates and verify how each parameter combination affects the generated backend configuration.
Copy Code Copied Use a different Browser
section("8. Analysis: Pareto frontier from (simulated) benchmark results")
import numpy as np, matplotlib.pyplot as plt
rng = np.random.default_rng(0)
def simulate(variant, base_tps, base_itl):
rows = []
tps_gpu = base_tps * c / (c + 90) * rng.uniform(.97, 1.03)
itl = base_itl * (1 + c/220) * rng.uniform(.97, 1.03)
rows.append({"variant": variant, "concurrency": c,
"tok_s_gpu": tps_gpu, "itl_ms": itl})
return rows
results = simulate("chunked=4096", 260, 9.5) + simulate("chunked=8192", 300, 11.5)
print(json.dumps(results[:3], indent=2), "...")
plt.figure(figsize=(8, 5))
for variant in ("chunked=4096", "chunked=8192"):
pts = [(r["itl_ms"], r["tok_s_gpu"], r["concurrency"])
for r in results if r["variant"] == variant]
xs, ys, cs = zip(*pts)
plt.plot(xs, ys, "o-", label=variant)
for x, y, c in pts:
plt.annotate(str(c), (x, y), fontsize=7, xytext=(3, 3),
textcoords="offset points")
plt.xlabel("Inter-token latency (ms/token) → worse")
plt.ylabel("Throughput (tokens/s/GPU) → better")
plt.title("Pareto frontier: sweep variants (points labeled by concurrency)")
plt.legend(); plt.grid(alpha=.3); plt.tight_layout(); plt.show()
We simulate benchmark observations for two chunked-prefill variants across increasing concurrency levels. We calculate representative throughput per GPU and inter-token latency values to model the saturation and latency growth commonly observed in distributed serving systems. We then visualize these results in a Pareto-style plot to compare throughput and responsiveness across configurations.
Copy Code Copied Use a different Browser
section("9. Next steps on a real cluster")
print(textwrap.dedent("""\
make setup ARCH=aarch64|x86_64
srtctl preflight -f my-disagg.yaml
srtctl apply -f my-disagg.yaml
srtctl apply -f sweep.yaml
srtctl monitor
uv run streamlit run analysis/dashboard/app.py
srtctl diff runA runB
Logs land in outputs/{JOB_ID}/logs/; analysis/srtlog parses them
(NodeAnalyzer, RunLoader) for programmatic post-processing.
Reproducibility tip (srtctl also prints this in dry-run): add an
identity: block to your recipe — HF model repo + revision, container
image URI, and framework versions — so srtctl can verify the runtime
matches your declaration at job start.
"""))
print("✅ Tutorial complete.")
We outline the production workflow that we follow when transferring validated recipes from Colab to a real SLURM-based GPU cluster. We review the commands used for environment setup, preflight validation, job submission, sweep execution, monitoring, dashboard analysis, and experiment comparison. We also emphasize reproducibility by declaring model revisions, container identities, and framework versions inside each benchmark recipe.
In conclusion, we built a complete understanding of how srtctl structures, validates, expands, and prepares distributed LLM-serving benchmarks for execution on SLURM infrastructure. We moved from basic installation and repository inspection to advanced disaggregated serving configurations, Cartesian parameter sweeps, programmatic schema access, and benchmark-result analysis. We also saw how dry runs expose generated job artifacts and help us detect configuration problems before expensive cluster resources are allocated. With this workflow in place, we can confidently transfer our validated recipes to a real NVIDIA GPU cluster, run preflight checks, submit benchmark jobs, monitor execution, compare experiment fingerprints, and analyze performance trade-offs in a reproducible manner.
Check out the Full Code here . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
Sana Hassan
+ posts Bio
Sana Hassan, a consulting intern at Marktechpost and dual-degree student at IIT Madras, is passionate about applying technology and AI to address real-world challenges. With a keen interest in solving practical problems, he brings a fresh perspective to the intersection of AI and real-life solutions.
Sana Hassan
Fine-Tuning Qwen3 with LoRA Using NVIDIA NeMo AutoModel: A Complete Single-GPU Google Colab Workflow Tutorial
Sana Hassan
How to Build Plasmid Engineering Workbench with Circular Mapping, Restriction Analysis, Virtual Gels, and Primer Design
Sana Hassan
Patter SDK Guide to Building a Restaurant Booking Phone Agent with Dynamic Variables, Guardrails, Latency Dashboards, and Eval Checks
Sana Hassan
Building a Gin Config Controlled PyTorch Pipeline with Configurable MLP Variants, Cosine Scheduling, and Runtime Parameter Overrides

## extraction_diagnostics

- extraction_method: article
- readability_score: 91
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":12503,"paragraph_count":153,"sentence_count":45,"boilerplate_hits":2,"symbol_ratio":0.0186,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   NVIDIA 推出 srt-slurm 框架，通过 srtctl CLI 将声明式 YAML 配置转化为可复现的 SLURM 基准测试工作流。该框架支持内置和自定义 recipe 的 dry-run 验证、参数扫描，以及面向 DeepSeek-R1 的分离式 prefill/decode 部署配置。

2. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Artificial Intelligence AI Infrastructure Technology Editors Pick Staff Tutorials In this tutorial, we explore NVIDIA’s srt-slurm framework and learn how we use srtctl to convert declarative YAML configurations into reproducible SLURM benchmark workflows for distributed LLM serving.

3. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   We set up the project in Google Colab, inspect its internal architecture, define a cluster configuration, dry-run built-in and custom recipes, and model a disaggregated prefill-and-decode deployment for DeepSeek-R1.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   We also generate parameter sweeps, interact with the typed Python API, validate expanded configurations, and analyze simulated benchmark results through a throughput-versus-latency Pareto frontier.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Although Colab does not provide a real SLURM environment, we use it as a practical development workspace to understand, validate, and prepare production-grade benchmark recipes before we submit them to an actual GPU cluster.

6. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Copy Code Copied Use a different Browser import os, sys, subprocess, textwrap, json, shutil, importlib from pathlib import Path def run(cmd, check=True, quiet=False): """Run a shell command, stream output.

## business_elements

- companies: MarkTechPost（RSS）, Google, GitHub, Nvidia
- products: Agent
- people: 暂无公开信息
- industries: 医疗, 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 合同审阅 / 法律研究, 部署 / 集成交付
- business_actions: 发布 / 推出, 合作 / 联盟, 部署 / 上线, 融资 / 投资
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 1, 6000, 0, 78, 2, 200, 4, 100
- quotes: Run a shell command, stream output. / 
print(f / )
r = subprocess.run(cmd, shell=True, text=True, capture_output=True)
out = (r.stdout or  / ) + (r.stderr or  / )
if not quiet:
print(out[-6000:])
if check and r.returncode != 0:
raise RuntimeError(f

## evidence_seed

- company_actions: We also generate parameter sweeps, interact with the typed Python API, validate expanded configurations, and analyze simulated benchmark results through a throughput-versus-latency Pareto frontier. / Although Colab does not provide a real SLURM environment, we use it as a practical development workspace to understand, validate, and prepare production-grade benchmark recipes before we submit them to an actual GPU cluster.
- case_details: NVIDIA 推出 srt-slurm 框架，通过 srtctl CLI 将声明式 YAML 配置转化为可复现的 SLURM 基准测试工作流。该框架支持内置和自定义 recipe 的 dry-run 验证、参数扫描，以及面向 DeepSeek-R1 的分离式 prefill/decode 部署配置。 / We set up the project in Google Colab, inspect its internal architecture, define a cluster configuration, dry-run built-in and custom recipes, and model a disaggregated prefill-and-decode deployment for DeepSeek-R1.
- workflow_changes: Artificial Intelligence AI Infrastructure Technology Editors Pick Staff Tutorials In this tutorial, we explore NVIDIA’s srt-slurm framework and learn how we use srtctl to convert declarative YAML configurations into reproducible SLURM benchmark workflows for distributed LLM serving. / Copy Code Copied Use a different Browser import os, sys, subprocess, textwrap, json, shutil, importlib from pathlib import Path def run(cmd, check=True, quiet=False): """Run a shell command, stream output.
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_vertical_solution
- importance_score: 5
- importance_reason: AI hardware scenario or service deployment; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,ai_hardware_lens,market_shaping_risk_context,adoption_context
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
- discovery_record: {"discovery_title":"NVIDIA 推出 srt-slurm 框架，用声明式 YAML 配置生成可复现的 SLURM 基准测试工作流","discovery_summary":"NVIDIA 推出 srt-slurm 框架，通过 srtctl CLI 将声明式 YAML 配置转化为可复现的 SLURM 基准测试工作流。该框架支持内置和自定义 recipe 的 dry-run 验证、参数扫描，以及面向 DeepSeek-R1 的分离式 prefill/decode 部署配置。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/21/validating-distributed-llm-serving-benchmarks-with-nvidia-srt-slurm-slurm-recipes-parameter-sweeps-and-pareto-analysis","discovered_at":"2026-07-22T01:46:55.155Z","rank_on_page":166,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

NVIDIA 推出 srt-slurm 框架，通过 srtctl CLI 将声明式 YAML 配置转化为可复现的 SLURM 基准测试工作流。该框架支持内置和自定义 recipe 的 dry-run 验证、参数扫描，以及面向 DeepSeek-R1 的分离式 prefill/decode 部署配置。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
