---
schema_version: raw-evidence-v2
raw_id: R-056
title: "构建VideoAgent风格多智能体系统：视频编辑任务的意图解析、图规划与工具路由"
title_zh: "构建VideoAgent风格多智能体系统：视频编辑任务的意图解析、图规划与工具路由"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://www.marktechpost.com/2026/07/13/building-a-videoagent-style-multi-agent-system-intent-parsing-graph-planning-and-tool-routing-for-video-editing-tasks"
canonical_url: "https://marktechpost.com/2026/07/13/building-a-videoagent-style-multi-agent-system-intent-parsing-graph-planning-and-tool-routing-for-video-editing-tasks"
source_name: "MarkTechPost（RSS）"
source_type: web
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
published_at: "2026-07-13T18:30:30.000Z"
collected_at: 2026-07-14T01:56:51.661Z
language: mixed
full_text_hash: 86702d99829a8918
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-14/r-056-构建videoagent风格多智能体系统-视频编辑任务的意图解析-图规划与工具路由.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-14/r-056-构建videoagent风格多智能体系统-视频编辑任务的意图解析-图规划与工具路由.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 83
extractor_diagnostics: {"readability_score":83,"text_length":41252,"paragraph_count":714,"sentence_count":49,"boilerplate_hits":2,"symbol_ratio":0.0538,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}
has_full_text: true
content_length: 41252
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"86702d99829a8918","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"构建VideoAgent风格多智能体系统：视频编辑任务的意图解析、图规划与工具路由","discovery_summary":"该教程构建了一个可运行的VideoAgent工作流，专注于视频理解、检索、编辑和重制的核心智能体管线。系统包含意图解析器、智能体库、工具路由器、图规划器以及用于修复执行图中缺失依赖的文本梯度优化器，并集成了FFmpeg、基于Whisper的转录、场景检测、关键帧采样、字幕生成、跨模态索引与检索、修剪、节拍同步编辑及最终渲染等实际视频处理工具。最终形成一个完整的多智能体视频系统，能够回答视频相关问题、总结内容、生成新闻式概览，并根据自然语言指令产出编辑后的视频成品。系统支持OpenAI、DeepSeek、Anthropic和Gemini等多种LLM后端，并在无API密钥时安全回退至确定性执行。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/13/building-a-videoagent-style-multi-agent-system-intent-parsing-graph-planning-and-tool-routing-for-video-editing-tasks","discovered_at":"2026-07-14T01:48:14.383Z","rank_on_page":88,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 44351438bee5155a
content_hash: 30a07fe9289f5476
semantic_hash: 9dbbc1b19e446b9a
duplicate_of: ""
first_seen_at: "2026-07-13T18:30:30.000Z"
last_seen_at: 2026-07-14T01:56:51.661Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":false,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool","emerging_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_technical_trend","importance_score":5,"importance_reason":"technical trend or capability shift; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":5,"guanlan_relevance":4,"emerging_signal_score":4}
business_elements: {"companies":["MarkTechPost（RSS）","OpenAI","Anthropic","Google"],"products":["Gemini","Agents","agent","claude","gemini","Agent","AGENTS","agents","AGENT"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":["权限 / 安全治理","部署 / 集成交付"],"business_actions":[],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["4","1","3","5","1.5","1b","90","0.2"],"quotes":["provider","base_url","max_shots","opt_rounds","run_demos"]}
evidence_seed: {"company_actions":["We start by configuring a lightweight environment that works without API keys.","We define an intent parser, an agent library, a tool router, a graph planner, and a textual-gradient optimizer that repairs missing dependencies in the execution graph.","By the end of the tutorial, we have a complete multi-agent video system that can answer questions about a video, summarize its content, generate a news-style overview, and produce edited video artifacts from natural-language instructions."],"case_details":[],"workflow_changes":["Editors Pick Agentic AI AI Agents Tutorials In this tutorial, we build a runnable reconstruction of the VideoAgent workflow, focusing on the core agentic pipeline behind video understanding, retrieval, editing, and remaking.","We also connect these planning components to practical video-processing tools, including FFmpeg, Whisper-based transcription, scene detection, keyframe sampling, captioning, cross-modal indexing, retrieval, trimming, beat-synced editing, and final rendering."],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":["该教程构建了一个可运行的VideoAgent工作流，专注于视频理解、检索、编辑和重制的核心智能体管线。系统包含意图解析器、智能体库、工具路由器、图规划器以及用于修复执行图中缺失依赖的文本梯度优化器，并集成了FFmpeg、基于Whisper的转录、场景检测、关键帧采样、字幕生成、跨模态索引与检索、修剪、节拍同步编辑及最终渲染等实际视频处理工具。最终形成一个完整的多智能体视频系统，能够回答视频相关问题、总结内容、生成新闻式概览，并根据自然语言指令产出编辑后的视频成品。系统支持OpenAI、DeepSeek、Anthropic和Gemini等多种LLM后端，并在无API密钥时安全回退至确定性执行。"]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"supporting_context","text":"该教程构建了一个可运行的VideoAgent工作流，专注于视频理解、检索、编辑和重制的核心智能体管线。系统包含意图解析器、智能体库、工具路由器、图规划器以及用于修复执行图中缺失依赖的文本梯度优化器，并集成了FFmpeg、基于Whisper的转录、场景检测、关键帧采样、字幕生成、跨模态索引与检索、修剪、节拍同步编辑及最终渲染等实际视频处理工具。最终形成一个完整的多智能体视频系统，能够回答视频相关问题、总结内容、生成新闻式概览，并根据自然语言指令产出编辑后的视频成品。系统支持OpenAI、DeepSeek、Anthropic和Gemini等多种LLM后端，并在无API密钥时安全回退至确定性执行。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"medium","confidence":"high"},{"type":"workflow_change","text":"Editors Pick Agentic AI AI Agents Tutorials In this tutorial, we build a runnable reconstruction of the VideoAgent workflow, focusing on the core agentic pipeline behind video understanding, retrieval, editing, and remaking.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"We start by configuring a lightweight environment that works without API keys.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"We define an intent parser, an agent library, a tool router, a graph planner, and a textual-gradient optimizer that repairs missing dependencies in the execution graph.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"workflow_change","text":"We also connect these planning components to practical video-processing tools, including FFmpeg, Whisper-based transcription, scene detection, keyframe sampling, captioning, cross-modal indexing, retrieval, trimming, beat-synced editing, and final rendering.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"By the end of the tutorial, we have a complete multi-agent video system that can answer questions about a video, summarize its content, generate a news-style overview, and produce edited video artifacts from natural-language instructions.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-14T01:56:51.661Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# 构建VideoAgent风格多智能体系统：视频编辑任务的意图解析、图规划与工具路由

## clean_text

Editors Pick
Agentic AI
AI Agents
Tutorials
In this tutorial, we build a runnable reconstruction of the VideoAgent workflow, focusing on the core agentic pipeline behind video understanding, retrieval, editing, and remaking. We start by configuring a lightweight environment that works without API keys. We define an intent parser, an agent library, a tool router, a graph planner, and a textual-gradient optimizer that repairs missing dependencies in the execution graph. We also connect these planning components to practical video-processing tools, including FFmpeg, Whisper-based transcription, scene detection, keyframe sampling, captioning, cross-modal indexing, retrieval, trimming, beat-synced editing, and final rendering. By the end of the tutorial, we have a complete multi-agent video system that can answer questions about a video, summarize its content, generate a news-style overview, and produce edited video artifacts from natural-language instructions.
Configuring the VideoAgent Runtime and Multi-Provider LLM Wrapper
Copy Code Copied Use a different Browser
CONFIG = {
"provider": "",
"api_key": "",
"base_url": "",
"model": "",
"max_shots": 4,
"opt_rounds": 4,
"run_demos": ["qa", "overview", "highlight", "beatsync"],
import os, sys, subprocess, json, math, re, wave, textwrap, shutil, time
from collections import defaultdict, deque
def _sh(cmd):
return subprocess.run(cmd, capture_output=True, text=True)
def _pip(pkgs):
_sh([sys.executable, "-m", "pip", "install", "-q", *pkgs])
IN_COLAB = "google.colab" in sys.modules
if IN_COLAB or os.environ.get("VA_INSTALL", "1") == "1":
for spec in (["openai-whisper"], ["gTTS"], ["sentence-transformers"]):
try:
_pip(spec)
except Exception as e:
print(f"[install] {spec} failed ({e}); a fallback will be used.")
try:
import numpy as np
except Exception:
_pip(["numpy"]); import numpy as np
try:
from PIL import Image, ImageDraw, ImageFont
except Exception:
_pip(["pillow"]); from PIL import Image, ImageDraw, ImageFont
HAS_FFMPEG = shutil.which("ffmpeg") is not None
WORK = "/content/va_workdir" if IN_COLAB else os.path.abspath("./va_workdir")
os.makedirs(WORK, exist_ok=True)
def wp(*a): return os.path.join(WORK, *a)
import urllib.request, urllib.error
class LLM:
DEFAULT = {
"openai": "gpt-4o-mini", "deepseek": "deepseek-chat",
"anthropic": "claude-3-5-sonnet-latest", "gemini": "gemini-1.5-flash",
def __init__(self, cfg):
self.provider = (cfg.get("provider") or "").lower().strip()
self.key = (cfg.get("api_key") or
os.environ.get(f"{self.provider.upper()}_API_KEY", "") or
os.environ.get("OPENAI_API_KEY", "") if self.provider else "")
self.model = cfg.get("model") or self.DEFAULT.get(self.provider, "")
self.base = cfg.get("base_url") or {
"openai": "https://api.openai.com/v1",
"deepseek": "https://api.deepseek.com/v1",
"anthropic": "https://api.anthropic.com/v1",
"gemini": "https://generativelanguage.googleapis.com/v1beta",
}.get(self.provider, "")
def available(self):
return bool(self.provider and self.key)
def _post(self, url, payload, headers):
data = json.dumps(payload).encode()
req = urllib.request.Request(url, data=data, headers=headers, method="POST")
with urllib.request.urlopen(req, timeout=90) as r:
return json.loads(r.read().decode())
def chat(self, system, user, temperature=0.2):
"""Return assistant text, or None on any failure (caller falls back)."""
if not self.available():
return None
try:
if self.provider in ("openai", "deepseek"):
out = self._post(
f"{self.base}/chat/completions",
{"model": self.model, "temperature": temperature,
"messages": [{"role": "system", "content": system},
{"role": "user", "content": user}]},
{"Content-Type": "application/json",
"Authorization": f"Bearer {self.key}"})
return out["choices"][0]["message"]["content"]
if self.provider == "anthropic":
out = self._post(
f"{self.base}/messages",
{"model": self.model, "max_tokens": 2000,
"system": system,
"messages": [{"role": "user", "content": user}]},
{"Content-Type": "application/json", "x-api-key": self.key,
"anthropic-version": "2023-06-01"})
return "".join(b.get("text", "") for b in out["content"])
if self.provider == "gemini":
out = self._post(
f"{self.base}/models/{self.model}:generateContent?key={self.key}",
{"system_instruction": {"parts": [{"text": system}]},
"contents": [{"parts": [{"text": user}]}]},
{"Content-Type": "application/json"})
return out["candidates"][0]["content"]["parts"][0]["text"]
except Exception as e:
print(f"[LLM] call failed, using fallback: {e}")
return None
def json(self, system, user):
"""Chat + robust JSON extraction."""
txt = self.chat(system, user)
if not txt:
return None
txt = re.sub(r"^```(json)?|```$", "", txt.strip(), flags=re.M).strip()
for pat in (r"\[.*\]", r"\{.*\}"):
m = re.search(pat, txt, re.S)
if m:
try:
return json.loads(m.group(0))
except Exception:
pass
return None
llm = LLM(CONFIG)
We begin by configuring the VideoAgent runtime, the optional LLM backend, the working directory, the package installation flow, and lightweight dependency fallbacks. We create a shared helper layer for shell commands, pip installs, file paths, and environment detection so the notebook runs smoothly in Colab or locally. We also define a unified LLM wrapper that supports OpenAI, DeepSeek, Anthropic, and Gemini while safely falling back to deterministic execution when no API key is available.
Defining Intents, the Agent Library, and Graph Planning
Copy Code Copied Use a different Browser
INTENTS = [
"audio_extraction", "transcription", "rhythm_detection", "scene_detection",
"keyframe_sampling", "captioning", "cross_modal_indexing", "shot_planning",
"visual_retrieval", "trimming", "summarization", "question_answering",
"news_overview", "beat_sync_edit", "concatenation", "rendering",
USER_INPUTS = {"video_path", "instruction", "question", "query"}
AGENTS = {
"AudioExtractor": dict(desc="Extract the audio track (wav) from a video.",
inputs=["video_path"], outputs=["audio_path"], caps=["audio_extraction"]),
"Transcriber": dict(desc="Whisper ASR: audio -> time-stamped transcript.",
inputs=["audio_path"], outputs=["transcript"], caps=["transcription"]),
"RhythmDetector": dict(desc="Energy-peak beat / cut-point detector.",
inputs=["audio_path"], outputs=["rhythm_points"], caps=["rhythm_detection"]),
"SceneDetector": dict(desc="Shot-boundary detection via histogram deltas.",
inputs=["video_path"], outputs=["scenes"], caps=["scene_detection"]),
"KeyframeSampler": dict(desc="Sample one representative keyframe per scene.",
inputs=["video_path", "scenes"], outputs=["keyframes"], caps=["keyframe_sampling"]),
"Captioner": dict(desc="Zero-shot CLIP captioning of keyframes.",
inputs=["keyframes"], outputs=["captions"], caps=["captioning"]),
"CrossModalIndexer": dict(desc="Build a CLIP text-visual index over scenes.",
inputs=["keyframes", "captions", "transcript"], outputs=["index"],
caps=["cross_modal_indexing"]),
"ShotPlanner": dict(desc="Global-aware storyboard sub-query generation.",
inputs=["instruction", "captions"], outputs=["storyboards"], caps=["shot_planning"]),
"RetrievalAgent": dict(desc="Cross-modal cosine retrieval of best scenes.",
inputs=["index", "storyboards"], outputs=["retrieved"], caps=["visual_retrieval"]),
"Trimmer": dict(desc="Fine-grained ffmpeg trimming of retrieved scenes.",
inputs=["retrieved", "video_path"], outputs=["clips"], caps=["trimming"]),
"VideoEditor": dict(desc="Concatenate clips into one edited video.",
inputs=["clips"], outputs=["edited_video"], caps=["concatenation"]),
"BeatSyncEditor": dict(desc="Assemble scene cuts onto the beat grid.",
inputs=["rhythm_points", "scenes", "video_path"], outputs=["edited_video"],
caps=["beat_sync_edit"]),
"Summarizer": dict(desc="Summarize the transcript into a recap.",
inputs=["transcript"], outputs=["summary"], caps=["summarization"]),
"VideoQA": dict(desc="Answer a question grounded in the transcript.",
inputs=["transcript", "question"], outputs=["answer"], caps=["question_answering"]),
"NewsContentGenerator": dict(desc="Write a news-style overview from transcript.",
inputs=["transcript", "instruction"], outputs=["overview"], caps=["news_overview"]),
"Renderer": dict(desc="Final encode/normalize pass -> final video.",
inputs=["edited_video"], outputs=["final_video"], caps=["rendering"]),
TERMINALS = {
"question_answering": "VideoQA", "summarization": "Summarizer",
"news_overview": "NewsContentGenerator", "visual_retrieval": "RetrievalAgent",
"beat_sync_edit": "BeatSyncEditor", "rendering": "Renderer",
PRODUCER = {}
for _a, _m in AGENTS.items():
for _o in _m["outputs"]:
PRODUCER.setdefault(_o, _a)
INTENT_SYS = (
"You are VideoAgent's Intent Parser. Decompose the user instruction into "
"the minimal set of required capabilities, choosing ONLY from this list: "
+ ", ".join(INTENTS) + ". Include BOTH explicit and necessary implicit "
"intents (e.g. answering a question implies transcription+audio_extraction). "
'Respond as JSON: {"intents":[...], "query":"<subject to retrieve or empty>", '
'"question":"<the question or empty>"}.')
def analyze_intents(instruction):
"""LLM intent parse if a key is set, else a faithful deterministic parser."""
if llm.available():
out = llm.json(INTENT_SYS, f"Instruction: {instruction}")
if isinstance(out, dict) and out.get("intents"):
T = {i for i in out["intents"] if i in INTENTS}
params = {"instruction": instruction,
"query": out.get("query", "") or "",
"question": out.get("question", "") or instruction}
if T:
return T, params
s = instruction.lower(); T = set()
params = {"instruction": instruction, "question": instruction, "query": ""}
m = re.search(r"about ([^.,;!?]+)", s) or re.search(r"of ([^.,;!?]+)", s)
if m: params["query"] = m.group(1).strip()
if any(w in s for w in ["?", "what does", "who ", "when ", "why ", "how ", "question"]):
T |= {"question_answering", "transcription", "audio_extraction"}
if any(w in s for w in ["summar", "overview", "recap", "tldr", "tl;dr", "digest"]):
T |= {"summarization", "transcription", "audio_extraction"}
if "news" in s or "overview" in s: T |= {"news_overview"}
is_beat = any(w in s for w in ["beat", "rhythm", "to the music",
"music video", "tempo", "synced", "sync "])
is_highlight = any(w in s for w in ["highlight", "montage", "supercut",
"reel", "best parts", "clips about",
"compile"])
if is_beat:
T |= {"beat_sync_edit", "rhythm_detection", "scene_detection",
"audio_extraction", "rendering"}
elif is_highlight:
T |= {"visual_retrieval", "cross_modal_indexing", "scene_detection",
"keyframe_sampling", "captioning", "shot_planning", "trimming",
"concatenation", "rendering", "audio_extraction", "transcription"}
if not T:
T |= {"summarization", "transcription", "audio_extraction"}
return T, params
def route_tools(T):
return {a for a, m in AGENTS.items() if set(m["caps"]) & T}
def build_graph(selected):
"""Wire each input to a producing agent's output (by param name)."""
nodes = {a: {"node": a,
"inputs": [{"name": x} for x in AGENTS[a]["inputs"]],
"outputs": [{"name": o, "links": []} for o in AGENTS[a]["outputs"]]}
for a in selected}
avail = {}
for a in selected:
for o in AGENTS[a]["outputs"]:
avail.setdefault(o, a)
for a in selected:
for inp in AGENTS[a]["inputs"]:
if inp in avail and avail[inp] != a:
for od in nodes[avail[inp]]["outputs"]:
if od["name"] == inp:
od["links"].append({a: inp})
return nodes
def naive_plan(T):
sel = {TERMINALS[i] for i in T if i in TERMINALS} or route_tools(T)
return build_graph(sel)
def llm_plan(T, instruction):
"""Optional: let the LLM draft the agent graph (Listing 5)."""
if not llm.available():
return None
lib = "\n".join(f'- {a}: {m["desc"]} | inputs={m["inputs"]} '
f'outputs={m["outputs"]}' for a, m in AGENTS.items())
sys_p = ("You are VideoAgent's Agent-Graph Designer. Using ONLY the agents "
"below, output a JSON list of nodes: "
'[{"node":NAME,"selected_inputs":[...],"selected_outputs":[...]}]. '
"Pick the minimal agents that satisfy the required intents and make "
"sure every non-user input is produced by some other selected agent.\n"
"USER INPUTS available for free: video_path, instruction, question, query.\n"
f"AGENT LIBRARY:\n{lib}")
usr = f"Instruction: {instruction}\nRequired intents: {sorted(T)}"
out = llm.json(sys_p, usr)
if isinstance(out, list) and out:
sel = {n.get("node") for n in out if n.get("node") in AGENTS}
if sel:
return build_graph(sel)
return None
We define the full intent space, user inputs, specialized agent registry, terminal agents, and output producers that constitute the system’s core planning vocabulary. We parse each natural-language instruction into required video capabilities such as transcription, summarization, retrieval, rendering, or beat-synced editing. We then route tools and construct an initial agent graph, either through an LLM-generated plan or a deterministic terminal-only plan that the optimizer later repairs.
Textual-Gradient Graph Optimization and Execution
Copy Code Copied Use a different Browser
def edges_of(nodes):
E = []
for a, nd in nodes.items():
for od in nd["outputs"]:
for link in od["links"]:
for tgt, param in link.items():
E.append((a, tgt, od["name"], param))
return E
def topo_order(nodes):
E = edges_of(nodes); indeg = {a: 0 for a in nodes}; adj = defaultdict(list)
for u, v, _, _ in E:
adj[u].append(v); indeg[v] += 1
q = deque([a for a in nodes if indeg[a] == 0]); order = []
while q:
u = q.popleft(); order.append(u)
for v in adj[u]:
indeg[v] -= 1
if indeg[v] == 0: q.append(v)
return order if len(order) == len(nodes) else None
def n_components(nodes):
adj = defaultdict(set)
for u, v, _, _ in edges_of(nodes):
adj[u].add(v); adj[v].add(u)
seen = set(); comp = 0
for a in nodes:
if a in seen: continue
comp += 1; st = [a]
while st:
x = st.pop()
if x in seen: continue
seen.add(x); st += [y for y in adj[x] if y not in seen]
return comp
def unsatisfied_inputs(nodes):
incoming = defaultdict(set)
for _u, v, _op, ip in edges_of(nodes):
incoming[v].add(ip)
miss = []
for a in nodes:
for inp in AGENTS[a]["inputs"]:
if inp in USER_INPUTS or inp in incoming[a]:
continue
miss.append((a, inp))
return miss
def assess(nodes, T):
order = topo_order(nodes); tau = 1 if order is not None else 0
covered = set()
for a in nodes: covered |= set(AGENTS[a]["caps"])
kappa = len(T & covered) / max(1, len(T))
E = edges_of(nodes)
chi = (sum(1 for _u, v, op, _ip in E if op in AGENTS[v]["inputs"]) / len(E)
if E else 1.0)
comp = n_components(nodes); miss = unsatisfied_inputs(nodes)
n = max(1, len(nodes))
L_struct = 0.5 * (1 - tau) + 0.5 * ((comp - 1) / n) + 0.5 * len(miss) / n
L_align = (1 - kappa) + 0.5 * len(miss) / n
return dict(tau=tau, kappa=round(kappa, 3), chi=round(chi, 3), comp=comp,
missing=miss, L_struct=round(L_struct, 3),
L_align=round(L_align, 3), order=order)
def textual_gradient(nodes, T):
"""Emit NL graph edits and apply them (insert producers / cover intents)."""
selected = set(nodes); grads = []
covered = set()
for a in nodes: covered |= set(AGENTS[a]["caps"])
for i in sorted(T - covered):
if i in TERMINALS and TERMINALS[i] not in selected:
selected.add(TERMINALS[i])
grads.append(f"insert `{TERMINALS[i]}` to cover uncovered intent `{i}`")
changed = True
while changed:
changed = False
for a, inp in unsatisfied_inputs(build_graph(selected)):
if inp in PRODUCER and PRODUCER[inp] not in selected:
selected.add(PRODUCER[inp]); changed = True
grads.append(f"insert `{PRODUCER[inp]}` -> supplies `{inp}` "
f"needed by `{a}` (satisfy data-flow)")
new = build_graph(selected)
if topo_order(new) is None:
grads.append("remove back-edge(s) to restore acyclicity (τ→1)")
return new, grads
def optimize_graph(nodes, T, Tmax=4, verbose=True):
history = []
for t in range(Tmax):
Q = assess(nodes, T)
if verbose:
print(f" round {t}: τ={Q['tau']} κ={Q['kappa']} χ={Q['chi']} "
f"components={Q['comp']} unmet_inputs={len(Q['missing'])} "
f"| L_struct={Q['L_struct']} L_align={Q['L_align']}")
history.append((t, Q))
if Q["L_struct"] == 0 and Q["L_align"] == 0:
if verbose: print(f" ✓ converged at round {t} "
f"(L_struct=L_align=0)")
return nodes, history
nodes, grads = textual_gradient(nodes, T)
if verbose:
for g in grads[:8]:
print(f" ∇_G {g}")
Q = assess(nodes, T)
if verbose:
print(f" round {Tmax}: τ={Q['tau']} κ={Q['kappa']} χ={Q['chi']} "
f"(stopped at Tmax)")
history.append((Tmax, Q))
return nodes, history
def execute_graph(nodes, seed, verbose=True):
order = topo_order(nodes)
assert order is not None, "cannot execute a cyclic graph"
bb = dict(seed)
for a in order:
kwargs = {inp: bb[inp] for inp in AGENTS[a]["inputs"] if inp in bb}
if verbose:
print(f" ▶ {a}({', '.join(kwargs) or '—'})")
try:
out = AGENTS[a]["fn"](**kwargs)
except Exception as e:
out = {"__error__": f"{a} failed: {e}"}
print(f" ! {a} error: {e}")
if not isinstance(out, dict):
out = {AGENTS[a]["outputs"][0]: out}
for o in AGENTS[a]["outputs"]:
if o in out: bb[o] = out[o]
if verbose:
for o in AGENTS[a]["outputs"]:
v = bb.get(o)
prev = (v if isinstance(v, str) else json.dumps(v)[:80]
if v is not None else "∅")
print(f" → {o}: {str(prev)[:80]}")
return bb, order
We implement the graph analysis and optimization logic that checks for edges, topological order, connected components, missing inputs, intent coverage, and compatibility. We compute the structural and alignment losses using τ, κ, and χ so the system can measure whether the current graph is executable and semantically complete. We then apply textual-gradient-style repairs by inserting missing producer agents and finally execute the optimized graph via a shared blackboard of intermediate outputs.
Building the FFmpeg, Whisper, and CLIP Processing Tools
Copy Code Copied Use a different Browser
_ff = "ffmpeg"; _fp = "ffprobe"
def ff_probe(path):
r = _sh([_fp, "-v", "error", "-select_streams", "v:0", "-show_entries",
"stream=r_frame_rate,width,height,nb_frames", "-show_entries",
"format=duration", "-of", "json", path])
try:
j = json.loads(r.stdout)
st = j["streams"][0]; num, den = st["r_frame_rate"].split("/")
return dict(dur=float(j["format"]["duration"]),
fps=float(num) / float(den),
w=int(st["width"]), h=int(st["height"]))
exce

## full_text

Editors Pick
Agentic AI
AI Agents
Tutorials
In this tutorial, we build a runnable reconstruction of the VideoAgent workflow, focusing on the core agentic pipeline behind video understanding, retrieval, editing, and remaking. We start by configuring a lightweight environment that works without API keys. We define an intent parser, an agent library, a tool router, a graph planner, and a textual-gradient optimizer that repairs missing dependencies in the execution graph. We also connect these planning components to practical video-processing tools, including FFmpeg, Whisper-based transcription, scene detection, keyframe sampling, captioning, cross-modal indexing, retrieval, trimming, beat-synced editing, and final rendering. By the end of the tutorial, we have a complete multi-agent video system that can answer questions about a video, summarize its content, generate a news-style overview, and produce edited video artifacts from natural-language instructions.
Configuring the VideoAgent Runtime and Multi-Provider LLM Wrapper
Copy Code Copied Use a different Browser
CONFIG = {
"provider": "",
"api_key": "",
"base_url": "",
"model": "",
"max_shots": 4,
"opt_rounds": 4,
"run_demos": ["qa", "overview", "highlight", "beatsync"],
import os, sys, subprocess, json, math, re, wave, textwrap, shutil, time
from collections import defaultdict, deque
def _sh(cmd):
return subprocess.run(cmd, capture_output=True, text=True)
def _pip(pkgs):
_sh([sys.executable, "-m", "pip", "install", "-q", *pkgs])
IN_COLAB = "google.colab" in sys.modules
if IN_COLAB or os.environ.get("VA_INSTALL", "1") == "1":
for spec in (["openai-whisper"], ["gTTS"], ["sentence-transformers"]):
try:
_pip(spec)
except Exception as e:
print(f"[install] {spec} failed ({e}); a fallback will be used.")
try:
import numpy as np
except Exception:
_pip(["numpy"]); import numpy as np
try:
from PIL import Image, ImageDraw, ImageFont
except Exception:
_pip(["pillow"]); from PIL import Image, ImageDraw, ImageFont
HAS_FFMPEG = shutil.which("ffmpeg") is not None
WORK = "/content/va_workdir" if IN_COLAB else os.path.abspath("./va_workdir")
os.makedirs(WORK, exist_ok=True)
def wp(*a): return os.path.join(WORK, *a)
import urllib.request, urllib.error
class LLM:
DEFAULT = {
"openai": "gpt-4o-mini", "deepseek": "deepseek-chat",
"anthropic": "claude-3-5-sonnet-latest", "gemini": "gemini-1.5-flash",
def __init__(self, cfg):
self.provider = (cfg.get("provider") or "").lower().strip()
self.key = (cfg.get("api_key") or
os.environ.get(f"{self.provider.upper()}_API_KEY", "") or
os.environ.get("OPENAI_API_KEY", "") if self.provider else "")
self.model = cfg.get("model") or self.DEFAULT.get(self.provider, "")
self.base = cfg.get("base_url") or {
"openai": "https://api.openai.com/v1",
"deepseek": "https://api.deepseek.com/v1",
"anthropic": "https://api.anthropic.com/v1",
"gemini": "https://generativelanguage.googleapis.com/v1beta",
}.get(self.provider, "")
def available(self):
return bool(self.provider and self.key)
def _post(self, url, payload, headers):
data = json.dumps(payload).encode()
req = urllib.request.Request(url, data=data, headers=headers, method="POST")
with urllib.request.urlopen(req, timeout=90) as r:
return json.loads(r.read().decode())
def chat(self, system, user, temperature=0.2):
"""Return assistant text, or None on any failure (caller falls back)."""
if not self.available():
return None
try:
if self.provider in ("openai", "deepseek"):
out = self._post(
f"{self.base}/chat/completions",
{"model": self.model, "temperature": temperature,
"messages": [{"role": "system", "content": system},
{"role": "user", "content": user}]},
{"Content-Type": "application/json",
"Authorization": f"Bearer {self.key}"})
return out["choices"][0]["message"]["content"]
if self.provider == "anthropic":
out = self._post(
f"{self.base}/messages",
{"model": self.model, "max_tokens": 2000,
"system": system,
"messages": [{"role": "user", "content": user}]},
{"Content-Type": "application/json", "x-api-key": self.key,
"anthropic-version": "2023-06-01"})
return "".join(b.get("text", "") for b in out["content"])
if self.provider == "gemini":
out = self._post(
f"{self.base}/models/{self.model}:generateContent?key={self.key}",
{"system_instruction": {"parts": [{"text": system}]},
"contents": [{"parts": [{"text": user}]}]},
{"Content-Type": "application/json"})
return out["candidates"][0]["content"]["parts"][0]["text"]
except Exception as e:
print(f"[LLM] call failed, using fallback: {e}")
return None
def json(self, system, user):
"""Chat + robust JSON extraction."""
txt = self.chat(system, user)
if not txt:
return None
txt = re.sub(r"^```(json)?|```$", "", txt.strip(), flags=re.M).strip()
for pat in (r"\[.*\]", r"\{.*\}"):
m = re.search(pat, txt, re.S)
if m:
try:
return json.loads(m.group(0))
except Exception:
pass
return None
llm = LLM(CONFIG)
We begin by configuring the VideoAgent runtime, the optional LLM backend, the working directory, the package installation flow, and lightweight dependency fallbacks. We create a shared helper layer for shell commands, pip installs, file paths, and environment detection so the notebook runs smoothly in Colab or locally. We also define a unified LLM wrapper that supports OpenAI, DeepSeek, Anthropic, and Gemini while safely falling back to deterministic execution when no API key is available.
Defining Intents, the Agent Library, and Graph Planning
Copy Code Copied Use a different Browser
INTENTS = [
"audio_extraction", "transcription", "rhythm_detection", "scene_detection",
"keyframe_sampling", "captioning", "cross_modal_indexing", "shot_planning",
"visual_retrieval", "trimming", "summarization", "question_answering",
"news_overview", "beat_sync_edit", "concatenation", "rendering",
USER_INPUTS = {"video_path", "instruction", "question", "query"}
AGENTS = {
"AudioExtractor": dict(desc="Extract the audio track (wav) from a video.",
inputs=["video_path"], outputs=["audio_path"], caps=["audio_extraction"]),
"Transcriber": dict(desc="Whisper ASR: audio -> time-stamped transcript.",
inputs=["audio_path"], outputs=["transcript"], caps=["transcription"]),
"RhythmDetector": dict(desc="Energy-peak beat / cut-point detector.",
inputs=["audio_path"], outputs=["rhythm_points"], caps=["rhythm_detection"]),
"SceneDetector": dict(desc="Shot-boundary detection via histogram deltas.",
inputs=["video_path"], outputs=["scenes"], caps=["scene_detection"]),
"KeyframeSampler": dict(desc="Sample one representative keyframe per scene.",
inputs=["video_path", "scenes"], outputs=["keyframes"], caps=["keyframe_sampling"]),
"Captioner": dict(desc="Zero-shot CLIP captioning of keyframes.",
inputs=["keyframes"], outputs=["captions"], caps=["captioning"]),
"CrossModalIndexer": dict(desc="Build a CLIP text-visual index over scenes.",
inputs=["keyframes", "captions", "transcript"], outputs=["index"],
caps=["cross_modal_indexing"]),
"ShotPlanner": dict(desc="Global-aware storyboard sub-query generation.",
inputs=["instruction", "captions"], outputs=["storyboards"], caps=["shot_planning"]),
"RetrievalAgent": dict(desc="Cross-modal cosine retrieval of best scenes.",
inputs=["index", "storyboards"], outputs=["retrieved"], caps=["visual_retrieval"]),
"Trimmer": dict(desc="Fine-grained ffmpeg trimming of retrieved scenes.",
inputs=["retrieved", "video_path"], outputs=["clips"], caps=["trimming"]),
"VideoEditor": dict(desc="Concatenate clips into one edited video.",
inputs=["clips"], outputs=["edited_video"], caps=["concatenation"]),
"BeatSyncEditor": dict(desc="Assemble scene cuts onto the beat grid.",
inputs=["rhythm_points", "scenes", "video_path"], outputs=["edited_video"],
caps=["beat_sync_edit"]),
"Summarizer": dict(desc="Summarize the transcript into a recap.",
inputs=["transcript"], outputs=["summary"], caps=["summarization"]),
"VideoQA": dict(desc="Answer a question grounded in the transcript.",
inputs=["transcript", "question"], outputs=["answer"], caps=["question_answering"]),
"NewsContentGenerator": dict(desc="Write a news-style overview from transcript.",
inputs=["transcript", "instruction"], outputs=["overview"], caps=["news_overview"]),
"Renderer": dict(desc="Final encode/normalize pass -> final video.",
inputs=["edited_video"], outputs=["final_video"], caps=["rendering"]),
TERMINALS = {
"question_answering": "VideoQA", "summarization": "Summarizer",
"news_overview": "NewsContentGenerator", "visual_retrieval": "RetrievalAgent",
"beat_sync_edit": "BeatSyncEditor", "rendering": "Renderer",
PRODUCER = {}
for _a, _m in AGENTS.items():
for _o in _m["outputs"]:
PRODUCER.setdefault(_o, _a)
INTENT_SYS = (
"You are VideoAgent's Intent Parser. Decompose the user instruction into "
"the minimal set of required capabilities, choosing ONLY from this list: "
+ ", ".join(INTENTS) + ". Include BOTH explicit and necessary implicit "
"intents (e.g. answering a question implies transcription+audio_extraction). "
'Respond as JSON: {"intents":[...], "query":"<subject to retrieve or empty>", '
'"question":"<the question or empty>"}.')
def analyze_intents(instruction):
"""LLM intent parse if a key is set, else a faithful deterministic parser."""
if llm.available():
out = llm.json(INTENT_SYS, f"Instruction: {instruction}")
if isinstance(out, dict) and out.get("intents"):
T = {i for i in out["intents"] if i in INTENTS}
params = {"instruction": instruction,
"query": out.get("query", "") or "",
"question": out.get("question", "") or instruction}
if T:
return T, params
s = instruction.lower(); T = set()
params = {"instruction": instruction, "question": instruction, "query": ""}
m = re.search(r"about ([^.,;!?]+)", s) or re.search(r"of ([^.,;!?]+)", s)
if m: params["query"] = m.group(1).strip()
if any(w in s for w in ["?", "what does", "who ", "when ", "why ", "how ", "question"]):
T |= {"question_answering", "transcription", "audio_extraction"}
if any(w in s for w in ["summar", "overview", "recap", "tldr", "tl;dr", "digest"]):
T |= {"summarization", "transcription", "audio_extraction"}
if "news" in s or "overview" in s: T |= {"news_overview"}
is_beat = any(w in s for w in ["beat", "rhythm", "to the music",
"music video", "tempo", "synced", "sync "])
is_highlight = any(w in s for w in ["highlight", "montage", "supercut",
"reel", "best parts", "clips about",
"compile"])
if is_beat:
T |= {"beat_sync_edit", "rhythm_detection", "scene_detection",
"audio_extraction", "rendering"}
elif is_highlight:
T |= {"visual_retrieval", "cross_modal_indexing", "scene_detection",
"keyframe_sampling", "captioning", "shot_planning", "trimming",
"concatenation", "rendering", "audio_extraction", "transcription"}
if not T:
T |= {"summarization", "transcription", "audio_extraction"}
return T, params
def route_tools(T):
return {a for a, m in AGENTS.items() if set(m["caps"]) & T}
def build_graph(selected):
"""Wire each input to a producing agent's output (by param name)."""
nodes = {a: {"node": a,
"inputs": [{"name": x} for x in AGENTS[a]["inputs"]],
"outputs": [{"name": o, "links": []} for o in AGENTS[a]["outputs"]]}
for a in selected}
avail = {}
for a in selected:
for o in AGENTS[a]["outputs"]:
avail.setdefault(o, a)
for a in selected:
for inp in AGENTS[a]["inputs"]:
if inp in avail and avail[inp] != a:
for od in nodes[avail[inp]]["outputs"]:
if od["name"] == inp:
od["links"].append({a: inp})
return nodes
def naive_plan(T):
sel = {TERMINALS[i] for i in T if i in TERMINALS} or route_tools(T)
return build_graph(sel)
def llm_plan(T, instruction):
"""Optional: let the LLM draft the agent graph (Listing 5)."""
if not llm.available():
return None
lib = "\n".join(f'- {a}: {m["desc"]} | inputs={m["inputs"]} '
f'outputs={m["outputs"]}' for a, m in AGENTS.items())
sys_p = ("You are VideoAgent's Agent-Graph Designer. Using ONLY the agents "
"below, output a JSON list of nodes: "
'[{"node":NAME,"selected_inputs":[...],"selected_outputs":[...]}]. '
"Pick the minimal agents that satisfy the required intents and make "
"sure every non-user input is produced by some other selected agent.\n"
"USER INPUTS available for free: video_path, instruction, question, query.\n"
f"AGENT LIBRARY:\n{lib}")
usr = f"Instruction: {instruction}\nRequired intents: {sorted(T)}"
out = llm.json(sys_p, usr)
if isinstance(out, list) and out:
sel = {n.get("node") for n in out if n.get("node") in AGENTS}
if sel:
return build_graph(sel)
return None
We define the full intent space, user inputs, specialized agent registry, terminal agents, and output producers that constitute the system’s core planning vocabulary. We parse each natural-language instruction into required video capabilities such as transcription, summarization, retrieval, rendering, or beat-synced editing. We then route tools and construct an initial agent graph, either through an LLM-generated plan or a deterministic terminal-only plan that the optimizer later repairs.
Textual-Gradient Graph Optimization and Execution
Copy Code Copied Use a different Browser
def edges_of(nodes):
E = []
for a, nd in nodes.items():
for od in nd["outputs"]:
for link in od["links"]:
for tgt, param in link.items():
E.append((a, tgt, od["name"], param))
return E
def topo_order(nodes):
E = edges_of(nodes); indeg = {a: 0 for a in nodes}; adj = defaultdict(list)
for u, v, _, _ in E:
adj[u].append(v); indeg[v] += 1
q = deque([a for a in nodes if indeg[a] == 0]); order = []
while q:
u = q.popleft(); order.append(u)
for v in adj[u]:
indeg[v] -= 1
if indeg[v] == 0: q.append(v)
return order if len(order) == len(nodes) else None
def n_components(nodes):
adj = defaultdict(set)
for u, v, _, _ in edges_of(nodes):
adj[u].add(v); adj[v].add(u)
seen = set(); comp = 0
for a in nodes:
if a in seen: continue
comp += 1; st = [a]
while st:
x = st.pop()
if x in seen: continue
seen.add(x); st += [y for y in adj[x] if y not in seen]
return comp
def unsatisfied_inputs(nodes):
incoming = defaultdict(set)
for _u, v, _op, ip in edges_of(nodes):
incoming[v].add(ip)
miss = []
for a in nodes:
for inp in AGENTS[a]["inputs"]:
if inp in USER_INPUTS or inp in incoming[a]:
continue
miss.append((a, inp))
return miss
def assess(nodes, T):
order = topo_order(nodes); tau = 1 if order is not None else 0
covered = set()
for a in nodes: covered |= set(AGENTS[a]["caps"])
kappa = len(T & covered) / max(1, len(T))
E = edges_of(nodes)
chi = (sum(1 for _u, v, op, _ip in E if op in AGENTS[v]["inputs"]) / len(E)
if E else 1.0)
comp = n_components(nodes); miss = unsatisfied_inputs(nodes)
n = max(1, len(nodes))
L_struct = 0.5 * (1 - tau) + 0.5 * ((comp - 1) / n) + 0.5 * len(miss) / n
L_align = (1 - kappa) + 0.5 * len(miss) / n
return dict(tau=tau, kappa=round(kappa, 3), chi=round(chi, 3), comp=comp,
missing=miss, L_struct=round(L_struct, 3),
L_align=round(L_align, 3), order=order)
def textual_gradient(nodes, T):
"""Emit NL graph edits and apply them (insert producers / cover intents)."""
selected = set(nodes); grads = []
covered = set()
for a in nodes: covered |= set(AGENTS[a]["caps"])
for i in sorted(T - covered):
if i in TERMINALS and TERMINALS[i] not in selected:
selected.add(TERMINALS[i])
grads.append(f"insert `{TERMINALS[i]}` to cover uncovered intent `{i}`")
changed = True
while changed:
changed = False
for a, inp in unsatisfied_inputs(build_graph(selected)):
if inp in PRODUCER and PRODUCER[inp] not in selected:
selected.add(PRODUCER[inp]); changed = True
grads.append(f"insert `{PRODUCER[inp]}` -> supplies `{inp}` "
f"needed by `{a}` (satisfy data-flow)")
new = build_graph(selected)
if topo_order(new) is None:
grads.append("remove back-edge(s) to restore acyclicity (τ→1)")
return new, grads
def optimize_graph(nodes, T, Tmax=4, verbose=True):
history = []
for t in range(Tmax):
Q = assess(nodes, T)
if verbose:
print(f" round {t}: τ={Q['tau']} κ={Q['kappa']} χ={Q['chi']} "
f"components={Q['comp']} unmet_inputs={len(Q['missing'])} "
f"| L_struct={Q['L_struct']} L_align={Q['L_align']}")
history.append((t, Q))
if Q["L_struct"] == 0 and Q["L_align"] == 0:
if verbose: print(f" ✓ converged at round {t} "
f"(L_struct=L_align=0)")
return nodes, history
nodes, grads = textual_gradient(nodes, T)
if verbose:
for g in grads[:8]:
print(f" ∇_G {g}")
Q = assess(nodes, T)
if verbose:
print(f" round {Tmax}: τ={Q['tau']} κ={Q['kappa']} χ={Q['chi']} "
f"(stopped at Tmax)")
history.append((Tmax, Q))
return nodes, history
def execute_graph(nodes, seed, verbose=True):
order = topo_order(nodes)
assert order is not None, "cannot execute a cyclic graph"
bb = dict(seed)
for a in order:
kwargs = {inp: bb[inp] for inp in AGENTS[a]["inputs"] if inp in bb}
if verbose:
print(f" ▶ {a}({', '.join(kwargs) or '—'})")
try:
out = AGENTS[a]["fn"](**kwargs)
except Exception as e:
out = {"__error__": f"{a} failed: {e}"}
print(f" ! {a} error: {e}")
if not isinstance(out, dict):
out = {AGENTS[a]["outputs"][0]: out}
for o in AGENTS[a]["outputs"]:
if o in out: bb[o] = out[o]
if verbose:
for o in AGENTS[a]["outputs"]:
v = bb.get(o)
prev = (v if isinstance(v, str) else json.dumps(v)[:80]
if v is not None else "∅")
print(f" → {o}: {str(prev)[:80]}")
return bb, order
We implement the graph analysis and optimization logic that checks for edges, topological order, connected components, missing inputs, intent coverage, and compatibility. We compute the structural and alignment losses using τ, κ, and χ so the system can measure whether the current graph is executable and semantically complete. We then apply textual-gradient-style repairs by inserting missing producer agents and finally execute the optimized graph via a shared blackboard of intermediate outputs.
Building the FFmpeg, Whisper, and CLIP Processing Tools
Copy Code Copied Use a different Browser
_ff = "ffmpeg"; _fp = "ffprobe"
def ff_probe(path):
r = _sh([_fp, "-v", "error", "-select_streams", "v:0", "-show_entries",
"stream=r_frame_rate,width,height,nb_frames", "-show_entries",
"format=duration", "-of", "json", path])
try:
j = json.loads(r.stdout)
st = j["streams"][0]; num, den = st["r_frame_rate"].split("/")
return dict(dur=float(j["format"]["duration"]),
fps=float(num) / float(den),
w=int(st["width"]), h=int(st["height"]))
except Exception:
return dict(dur=0.0, fps=24.0, w=0, h=0)
def tool_audio_extractor(video_path):
out = wp("audio.wav")
_sh([_ff, "-y", "-i", video_path, "-vn", "-acodec", "pcm_s16le",
"-ar", "16000", "-ac", "1", "-loglevel", "error", out])
return {"audio_path": out if os.path.exists(out) else ""}
_whisper_model = None
def _load_whisper():
global _whisper_model
if _whisper_model is not None: return _whisper_model
try:
import whisper
_whisper_model = whisper.load_model("base")
except Exception as e:
print(f" [Transcriber] Whisper unavailable ({e}); "
f"using injected script fallback.")
_whisper_model = False
return _whisper_model
FALLBACK_SCRIPT = None
def tool_transcriber(audio_path):
m = _load_whisper()
if m and audio_path and os.path.exists(audio_path):
try:
res = m.transcribe(audio_path, fp16=False)
segs = [(float(s["start"]), float(s["end"]), s["text"].strip())
for s in res.get("segments", [])]
full = res.get("text", "").strip()
if segs:
return {"transcript": {"text": full, "segments": segs}}
except Exception as e:
print(f" [Transcriber] error {e}; falling back.")
if FALLBACK_SCRIPT:
full = " ".join(t for _s, _e, t in FALLBACK_SCRIPT)
return {"transcript": {"text": full, "segments": list(FALLBACK_SCRIPT)}}
return {"transcript": {"text": "", "segments": []}}
def _read_wav_energy(path, hop=0.05):
"""RMS energy envelope from a wav using only the stdlib `wave` module."""
try:
w = wave.open(path, "rb")
sr = w.getframerate(); n = w.getnframes()
raw = w.readframes(n); w.close()
x = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
step = max(1, int(sr * hop)); env = []
for i in range(0, len(x) - step, step):
env.append(float(np.sqrt(np.mean(x[i:i + step] ** 2))))
env = np.array(env) / (np.max(env) + 1e-9)
return env, hop
except Exception:
return np.array([]), hop
def tool_rhythm_detector(audio_path):
env, hop = _read_wav_energy(audio_path)
if len(env) < 3:
pts = [round(t, 2) for t in np.arange(0.5, 6.0, 0.8)]
return {"rhythm_points": pts}
thr = float(np.mean(env) + 0.6 * np.std(env))
beats = []
for i in range(1, len(env) - 1):
if env[i] > thr and env[i] >= env[i - 1] and env[i] > env[i + 1]:
t = i * hop
if not beats or t - beats[-1] > 0.25:
beats.append(round(t, 2))
if len(beats) < 2:
beats = [round(t, 2) for t in np.arange(0.5, len(env) * hop, 0.8)]
return {"rhythm_points": beats}
def _sample_grid(path, fps=2, size=(64, 36)):
d = wp("sf"); os.makedirs(d, exist_ok=True)
for f in os.listdir(d): os.remove(os.path.join(d, f))
_sh([_ff, "-y", "-i", path, "-vf",
f"fps={fps},scale={size[0]}:{size[1]}", "-loglevel", "error",
os.path.join(d, "s%04d.png")])
fs = sorted(os.listdir(d))
arr = [np.asarray(Image.open(os.path.join(d, f)).convert("RGB")) for f in fs]
return arr, fps
def _hist(a):
h = [np.histogram(a[:, :, c], bins=16, range=(0, 255))[0] for c in range(3)]
v = np.concatenate(h).astype(float); return v / (v.sum() + 1e-9)
def tool_scene_detector(video_path):
frames, fps = _sample_grid(video_path, fps=2)
meta = ff_probe(video_path); dur = meta["dur"] or (len(frames) / fps)
if len(frames) < 2:
return {"scenes": [{"id": 0, "start": 0.0, "end": round(dur, 2)}]}
diffs = [float(np.abs(_hist(frames[i]) - _hist(frames[i - 1])).sum())
for i in range(1, len(frames))]
thr = float(np.mean(diffs) + 1.0 * np.std(diffs))
starts = [0.0] + [(i + 1) / fps for i, d in enumerate(diffs) if d > thr]
starts = sorted(set(round(s, 2) for s in starts))
scenes = []
for k, s in enumerate(starts):
e = starts[k + 1] if k + 1 < len(starts) else round(dur, 2)
if e - s >= 0.4:
scenes.append({"id": len(scenes), "start": s, "end": round(e, 2)})
if not scenes:
scenes = [{"id": 0, "start": 0.0, "end": round(dur, 2)}]
return {"scenes": scenes}
def tool_keyframe_sampler(video_path, scenes):
d = wp("keyframes"); os.makedirs(d, exist_ok=True)
kfs = []
for sc in scenes:
mid = (sc["start"] + sc["end"]) / 2.0
out = os.path.join(d, f"kf_{sc['id']:03d}.png")
_sh([_ff, "-y", "-ss", f"{mid:.2f}", "-i", video_path, "-frames:v", "1",
"-vf", "scale=224:-1", "-loglevel", "error", out])
kfs.append({"scene_id": sc["id"], "t": round(mid, 2),
"path": out if os.path.exists(out) else ""})
return {"keyframes": kfs}
_clip = None
def _load_clip():
global _clip
if _clip is not None: return _clip
try:
from sentence_transformers import SentenceTransformer
_clip = SentenceTransformer("clip-ViT-B-32")
except Exception as e:
print(f" [CLIP] unavailable ({e}); using lexical-hash embeddings.")
_clip = False
return _clip
def _hash_embed(text, dim=256):
"""Deterministic bag-of-words hashing embedding (offline fallback)."""
v = np.zeros(dim, dtype=np.float32)
for tok in re.findall(r"[a-z0-9]+", (text or "").lower()):
v[hash(tok) % dim] += 1.0
n = np.linalg.norm(v); return v / n if n else v
def embed_texts(texts):
m = _load_clip()
if m:
try:
return np.asarray(m.encode(list(texts), normalize_embeddings=True))
except Exception:
pass
return np.stack([_hash_embed(t) for t in texts])
def embed_images(paths):
m = _load_clip()
valid = [p for p in paths if p and os.path.exists(p)]
if m and valid:
try:
imgs = [Image.open(p).convert("RGB") for p in valid]
emb = np.asarray(m.encode(imgs, normalize_embeddings=True))
out = {}; j = 0
for p in paths:
if p and os.path.exists(p): out[p] = emb[j]; j += 1
return out
except Exception:
pass
return {}
CAPTION_BANK = ["a title card with text", "a person speaking to camera",
"a bright colorful scene", "a dark moody scene",
"an outdoor landscape", "a user interface screenshot",
"an abstract graphic", "a close-up shot"]
def tool_captioner(keyframes):
m = _load_clip(); caps = []
if m:
try:
lab_emb = embed_texts(CAPTION_BANK)
paths = [k["path"] for k in keyframes]
img_emb = embed_images(paths)
for k in keyframes:
e = img_emb.get(k["path"])
if e is not None:
sims = lab_emb @ e
caps.append({"scene_id": k["scene_id"],
"caption": CAPTION_BANK[int(np.argmax(sims))]})
else:
caps.append({"scene_id": k["scene_id"],
"caption": "a video scene"})
return {"captions": caps}
except Exception:
pass
for k in keyframes:
c = "a video scene"
if k["path"] and os.path.exists(k["path"]):
a = np.asarray(Image.open(k["path"]).convert("RGB"))
b = a.mean(); r, g, bl = a[..., 0].mean(), a[..., 1].mean(), a[..., 2].mean()
hue = ("reddish" if r > g and r > bl else
"greenish" if g > r and g > bl else "bluish")
c = f"a {'bright' if b > 128 else 'dark'} {hue} scene"
caps.append({"scene_id": k["scene_id"], "caption": c})
return {"captions": caps}
def _align_transcript_to_scenes(transcript, scenes):
"""Assign each ASR segment to the scene containing its midpoint."""
txt = {sc["id"]: "" for sc in scenes}
for (s, e, t) in transcript.get("segments", []):
mid = (s + e) / 2.0
for sc in scenes:
if sc["start"] <= mid < sc["end"]:
txt[sc["id"]] = (txt[sc["id"]] + " " + t).strip(); break
return txt
def tool_cross_modal_indexer(keyframes, captions, transcript):
cap_by = {c["scene_id"]: c["caption"] for c in captions}
scenes = [{"id": k["scene_id"], "t": k["t"], "path": k["path"]} for k in keyframes]
for i, sc in enumerate(scenes):
sc["start"] = 0.0 if i == 0 else (scenes[i - 1]["t"] + sc["t"]) / 2.0
sc["end"] = (sc["t"] + scenes[i + 1]["t"]) / 2.0 if i + 1 < len(scenes) else sc["t"] + 2.0
tr = _align_transcript_to_scenes(transcript, scenes)
img_emb = embed_images([sc["path"] for sc in scenes])
text_docs = [f'{cap_by.get(sc["id"], "")}. {tr.get(sc["id"], "")}'.strip()
for sc in scenes]
txt_emb = embed_texts(text_docs)
index = []
for i, sc in enumerate(scenes):
index.append({"scene_id": sc["id"], "t": sc["t"],
"caption": cap_by.get(sc["id"], ""),
"transcript": tr.get(sc["id"], ""),
"text_emb": txt_emb[i].tolist(),
"img_emb": (img_emb[sc["path"]].tolist()
if sc["path"] in img_emb else None)})
return {"index": index}
We build the lower-level video and multimodal processing tools that extract audio, transcribe speech, detect rhythm, identify scenes, sample keyframes, and generate captions. We use FFmpeg, Whisper, CLIP-style embeddings, histogram-based scene detection, and robust fallback logic so the pipeline remains runnable even when heavier models are unavailable. We also create a cross-modal index that aligns captions, keyframes, transcript segments, and embeddings for later retrieval-based video editing.
Retrieval, Trimming, and Beat-Synced Editing Agents
Copy Code Copied Use a different Browser
def tool_shot_planner(instruction, captions):
"""Global-aware storyboard sub-queries from instruction + caption bank."""
bank = "; ".join(sorted({c["caption"] for c in captions}))
if llm.available():
sys_p = ("You are VideoAgent's Shot-Planning Agent. Given the user "
"instruction and a bank of available scene captions, write "
f"{CONFIG['max_shots']} short storyboard sub-queries (one line "
"each) describing the visual content to retrieve, in narrative "
'order. Respond as JSON list of strings.')
out = llm.json(sys_p, f"Instruction: {instruction}\nCaptions: {bank}")
if isinstance(out, list) and out:
return {"storyboards": [str(x) for x in out][:CONFIG["max_shots"]]}
m = re.search(r"about ([^.,;!?]+)", instruction.lower())
subj = m.group(1).strip() if m else "the main subject"
beats = [f"opening shot introducing {subj}",
f"a key moment about {subj}",
f"a detailed close-up related to {subj}",
f"a concluding shot about {subj}"]
return {"storyboards": beats[:CONFIG["max_shots"]]}
def _cos(a, b):
a = np.asarray(a); b = np.asarray(b)
na, nb = np.linalg.norm(a), np.linalg.norm(b)
return float(a @ b / (na * nb)) if na and nb else 0.0
def tool_retrieval_agent(index, storyboards):
"""For each storyboard, pick the best scene by max(text,visual) cosine."""
q_txt = embed_texts(storyboards)
q_img = q_txt
chosen = []; used = set()
for i, sb in enumerate(storyboards):
best, best_s = None, -1
for e in index:
s_t = _cos(q_txt[i], e["text_emb"])
s_v = _cos(q_img[i], e["img_emb"]) if e["img_emb"] is not None else -1
score = max(s_t, s_v)
if e["scene_id"] in used: score -= 0.15
if score > best_s:
best_s, best = score, e
if best is not None:
used.add(best["scene_id"])
chosen.append({"storyboard": sb, "scene_id": best["scene_id"],
"t": best["t"], "score": round(best_s, 3),
"caption": best["caption"]})
return {"retrieved": chosen}
def tool_trimmer(retrieved, video_path, clip_len=2.0):
d = wp("clips"); os.makedirs(d, exist_ok=True)
for f in os.listdir(d): os.remove(os.path.join(d, f))
meta = ff_probe(video_path); dur = meta["dur"] or 6.0
clips = []
for i, r in enumerate(retrieved):
s = max(0.0, r["t"] - clip_len / 2.0)
s = min(s, max(0.0, dur - clip_len))
out = os.path.join(d, f"clip_{i:03d}.mp4")
_sh([_ff, "-y", "-ss", f"{s:.2f}", "-i", video_path, "-t", f"{clip_len:.2f}",
"-c:v", "libx264", "-pix_fmt", "yuv420p", "-an",
"-vf", "scale=480:270:force_original_aspect_ratio=decrease,"
"pad=480:270:(ow-iw)/2:(oh-ih)/2",
"-loglevel", "error", out])
if os.path.exists(out):
clips.append(out)
return {"clips": clips}
def _concat(clips, out):
lst = wp("concat.txt")
with open(lst, "w") as f:
for c in clips:
f.write(f"file '{os.path.abspath(c)}'\n")
_sh([_ff, "-y", "-f", "concat", "-safe", "0", "-i", lst,
"-c:v", "libx264", "-pix_fmt", "yuv420p", "-loglevel", "error", out])
return os.path.exists(out)
def tool_video_editor(clips):
out = wp("edited.mp4")
if clips and _concat(clips, out):
return {"edited_video": out}
return {"edited_video": clips[0] if clips else ""}
def tool_beat_sync_editor(rhythm_points, scenes, video_path):
"""Cut the source onto the beat grid, cycling through detected scenes."""
d = wp("beat"); os.makedirs(d, exist_ok=True)
for f in os.listdir(d): os.remove(os.path.join(d, f))
beats = sorted(set([0.0] + list(rhythm_points)))
segs = [(beats[i], beats[i + 1]) for i in range(len(beats) - 1)
if beats[i + 1] - beats[i] > 0.15][:12]
clips = []
for i, (bs, be) in enumerate(segs):
sc = scenes[i % len(scenes)]
src = (sc["start"] + sc["end"]) / 2.0
dur = min(be - bs, 1.2)
out = os.path.join(d, f"b_{i:03d}.mp4")
_sh([_ff, "-y", "-ss", f"{src:.2f}", "-i", video_path, "-t", f"{dur:.2f}",
"-c:v", "libx264", "-pix_fmt", "yuv420p", "-an",
"-vf", "scale=480:270", "-loglevel", "error", out])
if os.path.exists(out): clips.append(out)
out = wp("beatsync.mp4")
if clips and _concat(clips, out):
return {"edited_video": out}
return {"edited_video": clips[0] if clips else ""}
def _fmt_ts(x):
return f"{int(x // 60):02d}:{int(x % 60):02d}"
def tool_summarizer(transcript):
text = transcript.get("text", "").strip()
if llm.available() and text:
s = llm.chat("You are VideoAgent's summariser. Summarise the transcript "
"in 3-4 sentences, plain and factual.", text)
if s: return {"summary": s.strip()}
sents = re.split(r"(?<=[.!?])\s+", text)
sents = [s for s in sents if len(s.split()) > 3]
if not sents:
return {"summary": "(no speech detected to summarise)"}
picks = [sents[0]] + sorted(sents[1:], key=lambda s: -len(s))[:2]
return {"summary": " ".join(dict.fromkeys(picks))}
def tool_video_qa(transcript, question):
segs = transcript.get("segments", []); text = transcript.get("text", "")
if llm.available() and text:
ans = llm.chat("You are VideoAgent's VideoQA agent. Answer ONLY from the "
"transcript; if unknown, say so. Be concise.",
f"Transcript:\n{text}\n\nQuestion: {question}")
if ans: return {"answer": ans.strip()}
qtok = set(re.findall(r"[a-z0-9]+", question.lower()))
scored = []
for (s, e, t) in segs:
ov = len(qtok & set(re.findall(r"[a-z0-9]+", t.lower())))
if ov: scored.append((ov, s, e, t))
scored.sort(reverse=True)
if not scored:
return {"answer": "I couldn't find that in the video's speech."}
top = scored[:2]
return {"answer": " ".join(f"[{_fmt_ts(s)}] {t}" for _o, s, _e, t in top)}
def tool_news_overview(transcript, instruction):
text = transcript.get("text", "").strip()
if llm.available() and text:
ov = llm.chat("You are VideoAgent's NewsContentGenerator. Write a short, "
"colloquial news overview (<=120 words) of the transcript, "
"matching any style hints in the instruction.",
f"Instruction: {instruction}\nTranscript: {text}")
if ov: return {"overview": ov.strip()}
base = tool_summarizer(transcript)["summary"]
return {"overview": "Here's the rundown: " + base}
def tool_renderer(edited_video):
if not edited_video or not os.path.exists(edited_video):
return {"final_video": ""}
out = wp("final.mp4")
r = _sh([_ff, "-y", "-i", edited_video, "-c:v", "libx264", "-pix_fmt",
"yuv420p", "-movflags", "+faststart", "-loglevel", "error", out])
return {"final_video": out if os.path.exists(out) else edited_video}
_IMPL = {
"AudioExtractor": tool_audio_extractor, "Transcriber": tool_transcriber,
"RhythmDetector": tool_rhythm_detector, "SceneDetector": tool_scene_detector,
"KeyframeSampler": tool_keyframe_sampler, "Captioner": tool_captioner,
"CrossModalIndexer": tool_cross_modal_indexer, "ShotPlanner": tool_shot_planner,
"RetrievalAgent": tool_retrieval_agent, "Trimmer": tool_trimmer,
"VideoEditor": tool_video_editor, "BeatSyncEditor": tool_beat_sync_editor,
"Summarizer": tool_summarizer, "VideoQA": tool_video_qa,
"NewsContentGenerator": tool_news_overview, "Renderer": tool_renderer,
for _a, _fn in _IMPL.items():
AGENTS[_a]["fn"] = _fn
class VideoAgent:
def __init__(self, video_path):
self.video = video_path
def run(self, instruction):
print("\n" + "═" * 78)
print("USER INSTRUCTION:", instruction)
print("═" * 78)
T, params = analyze_intents(instruction)
print("[1] Intent Analysis → required intents T:")
print(" ", ", ".join(sorted(T)))
if params.get("query"):
print(" extracted retrieval subject:", repr(params["query"]))
cand = route_tools(T)
print(f"[2] Tool Routing → {len(cand)} candidate agents match T:")
print(" ", ", ".join(sorted(cand)))
nodes = llm_plan(T, instruction) if llm.available() else None
origin = "LLM-drafted" if nodes else "naive (terminals only)"
if nodes is None:
nodes = naive_plan(T)
print(f"[4] Graph Construction → {origin} graph "
f"({len(nodes)} nodes): {sorted(nodes)}")
print("[5] Textual-Gradient Graph Optimization (τ, κ, χ):")
nodes, history = optimize_graph(nodes, T, Tmax=CONFIG["opt_rounds"])
order = topo_order(nodes)
print(f" Final agent chain: {' → '.join(order)}")
print("[6] Graph Execution:")
seed = {"video_path": self.video, "instruction": instruction,
"question": params.get("question", instruction),
"query": params.get("query", "")}
bb, order = execute_graph(nodes, seed)
result = {}
for key in ("answer", "overview", "summary", "final_video", "edited_video"):
if key in bb and bb[key]:
result[key] = bb[key]
print("\n── RESULT " + "─" * 68)
for k, v in result.items():
if k in ("final_video", "edited_video"):
print(f" {k}: {v} ({os.path.getsize(v)//1024} KB)"
if v and os.path.exists(v) else f" {k}: (empty)")
else:
print(f" {k}:\n{textwrap.indent(textwrap.fill(str(v), 92), ' ')}")
return result, nodes, bb
We implement the higher-level agents that turn indexed video content into storyboard queries, retrieved scenes, trimmed clips, edited videos, summaries, answers, overviews, and final rendered outputs. We combine retrieval, cosine similarity, FFmpeg trimming, clip concatenation, beat-aware montage assembly, transcript summarization, and VideoQA into one coordinated tool layer. We then bind every implementation back into the agent registry and wrap the entire workflow inside the VideoAgent class for end-to-end execution.
Generating the Demo Video and Running the Pipeline
Copy Code Copied Use a different Browser
DEMO_SCRIPT = [
("BREAKING TECH NEWS", (18, 22, 46),
"Breaking tech news: a major lab has released a new image generation model."),
("THE MODEL: GPT-4o", (128, 28, 40),
"The system, called GPT-4o, can generate and edit images directly from text prompts."),
("IMAGE GENERATION", (16, 78, 60),
"Its native image generation renders text inside pictures far more accurately than before."),
("LIVE DEMO", (58, 40, 92),
"In the live demo, the model turned a rough sketch into a polished product photo in seconds."),
("WHAT IT MEANS", (30, 30, 34),
"Analysts say this pushes multimodal AI closer to everyday creative work."),
def build_demo_video():
global FALLBACK_SCRIPT
W, H, FPS, sec = 480, 270, 24, 2.0
fdir = wp("democ_frames"); os.makedirs(fdir, exist_ok=True)
for f in os.listdir(fdir): os.remove(os.path.join(fdir, f))
idx = 0; scene_times = []
for title, col, _n in DEMO_SCRIPT:
t0 = idx / FPS
for fr in range(int(FPS * sec)):
im = Image.new("RGB", (W, H), col); d = ImageDraw.Draw(im)
x = int((fr / (FPS * sec)) * (W - 70))
d.rectangle([x, H - 42, x + 56, H - 22], fill=(235, 235, 235))
d.text((22, 26), title, fill=(255, 255, 255))
d.text((22, H - 66), f"t={idx/FPS:0.2f}s", fill=(210, 210, 210))
im.save(os.path.join(fdir, f"f{idx:05d}.png")); idx += 1
scene_times.append((t0, idx / FPS))
silent = wp("demo_silent.mp4")
_sh([_ff, "-y", "-framerate", str(FPS), "-i", os.path.join(fdir, "f%05d.png"),
"-pix_fmt", "yuv420p", "-c:v", "libx264", "-loglevel", "error", silent])
narrated = wp("demo.mp4"); have_audio = False
try:
from gtts import gTTS
adir = wp("narr"); os.makedirs(adir, exist_ok=True)
parts = []
for i, (_t, _c, n) in enumerate(DEMO_SCRIPT):
mp3 = os.path.join(adir, f"n{i}.mp3"); gTTS(n).save(mp3); parts.append(mp3)
lst = wp("narr.txt")
with open(lst, "w") as f:
for i, mp3 in enumerate(parts):
f.write(f"file '{os.path.abspath(mp3)}'\n")
joined = os.path.join(adir, "joined.mp3")
_sh([_ff, "-y", "-f", "concat", "-safe", "0", "-i", lst,
"-loglevel", "error", joined])
_sh([_ff, "-y", "-i", silent, "-i", joined, "-c:v", "copy",
"-c:a", "aac", "-shortest", "-loglevel", "error", narrated])
have_audio = os.path.exists(narrated)
except Exception as e:
print(f"[demo] gTTS narration unavailable ({e}); using silent video "
f"+ injected transcript.")
if not have_audio:
narrated = silent
FALLBACK_SCRIPT = [(scene_times[i][0], scene_times[i][1], DEMO_SCRIPT[i][2])
for i in range(len(DEMO_SCRIPT))]
else:
FALLBACK_SCRIPT = [(scene_times[i][0], scene_times[i][1], DEMO_SCRIPT[i][2])
for i in range(len(DEMO_SCRIPT))]
meta = ff_probe(narrated)
print(f"[demo] built {narrated} ({meta['dur']:.1f}s, "
f"{meta['w']}x{meta['h']}, audio={'yes' if have_audio else 'no'})")
return narrated
def preview(path, width=480):
"""Display an mp4 inline in Colab/Jupyter (no-op elsewhere)."""
try:
from IPython.display import HTML, display
import base64
with open(path, "rb") as f:
b64 = base64.b64encode(f.read()).decode()
display(HTML(f'<video width="{width}" controls '
f'src="data:video/mp4;base64,{b64}"></video>'))
except Exception as e:
print(f"[preview] {path} (inline display unavailable: {e})")
DEMO_INSTRUCTIONS = {
"qa": "What does the video say about GPT-4o image generation?",
"overview": "Give me a short, colloquial news overview of this tech video.",
"highlight": "Make a highlight montage about the image generation model.",
"beatsync": "Create a fast beat-synced montage from this footage.",
def main():
print("VideoAgent — faithful reconstruction")
print("LLM backend:",
f"{CONFIG['provider']} ({llm.model})" if llm.available()
else "NONE → deterministic agents (paste a key in CONFIG to go LLM-driven)")
if not HAS_FFMPEG:
print("!! ffmpeg not found — install it (Colab has it by default).")
return
video = build_demo_video()
agent = VideoAgent(video)
outputs = {}
for name in CONFIG["run_demos"]:
if name not in DEMO_INSTRUCTIONS:
continue
res, _nodes, _bb = agent.run(DEMO_INSTRUCTIONS[name])
outputs[name] = res
print("\n" + "═" * 78)
print("ALL DEMOS COMPLETE. Artifacts are under:", WORK)
for name, res in outputs.items():
for k, v in res.items():
if k.endswith("video") and v and os.path.exists(v):
print(f" [{name}] {k}: {v}")
print("\nTo use YOUR OWN video: VideoAgent('/content/my.mp4').run('...')")
print("To go LLM-driven: set CONFIG['provider']/['api_key'] and re-run.")
if __name__ == "__main__":
main()
We create a self-contained demo video with synthetic visuals, narration, fallback transcript timing, and predefined example instructions for QA, overview generation, highlight editing, and beat-sync editing. We provide a preview helper so produced MP4 files can be displayed directly inside Colab or Jupyter when supported. We finish with a main() function that builds the demo video, runs the selected VideoAgent demos, prints the generated artifacts, and demonstrates how to switch to our own video or an LLM-driven backend.
Conclusion
In conclusion, we successfully recreated the main ideas of VideoAgent as a compact, executable Colab tutorial that demonstrates how agentic planning can coordinate multiple video-understanding and editing tools. We moved from user instruction to intent analysis, routed the required tools, constructed and optimized an agent graph, and executed each node through a shared blackboard of intermediate outputs. It gives us a clear view of how complex video tasks can be decomposed into specialized agents while remaining practical enough to run in a lightweight notebook environment. We finished with a working system that not only explains and summarizes video content but also creates highlight and beat-synced edits, showing how structured multi-agent design can turn raw video input into useful multimodal outputs.
Check out the Full Codes here . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us

## extraction_diagnostics

- extraction_method: article
- readability_score: 83
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":83,"text_length":41252,"paragraph_count":714,"sentence_count":49,"boilerplate_hits":2,"symbol_ratio":0.0538,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=medium｜confidence=high
   该教程构建了一个可运行的VideoAgent工作流，专注于视频理解、检索、编辑和重制的核心智能体管线。系统包含意图解析器、智能体库、工具路由器、图规划器以及用于修复执行图中缺失依赖的文本梯度优化器，并集成了FFmpeg、基于Whisper的转录、场景检测、关键帧采样、字幕生成、跨模态索引与检索、修剪、节拍同步编辑及最终渲染等实际视频处理工具。最终形成一个完整的多智能体视频系统，能够回答视频相关问题、总结内容、生成新闻式概览，并根据自然语言指令产出编辑后的视频成品。系统支持OpenAI、DeepSeek、Anthropic和Gemini等多种LLM后端，并在无API密钥时安全回退至确定性执行。

2. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Editors Pick Agentic AI AI Agents Tutorials In this tutorial, we build a runnable reconstruction of the VideoAgent workflow, focusing on the core agentic pipeline behind video understanding, retrieval, editing, and remaking.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   We start by configuring a lightweight environment that works without API keys.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   We define an intent parser, an agent library, a tool router, a graph planner, and a textual-gradient optimizer that repairs missing dependencies in the execution graph.

5. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   We also connect these planning components to practical video-processing tools, including FFmpeg, Whisper-based transcription, scene detection, keyframe sampling, captioning, cross-modal indexing, retrieval, trimming, beat-synced editing, and final rendering.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   By the end of the tutorial, we have a complete multi-agent video system that can answer questions about a video, summarize its content, generate a news-style overview, and produce edited video artifacts from natural-language instructions.

## business_elements

- companies: MarkTechPost（RSS）, OpenAI, Anthropic, Google
- products: Gemini, Agents, agent, claude, gemini, Agent, AGENTS, agents, AGENT
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 权限 / 安全治理, 部署 / 集成交付
- business_actions: 暂无公开信息
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 4, 1, 3, 5, 1.5, 1b, 90, 0.2
- quotes: provider / base_url / max_shots / opt_rounds / run_demos

## evidence_seed

- company_actions: We start by configuring a lightweight environment that works without API keys. / We define an intent parser, an agent library, a tool router, a graph planner, and a textual-gradient optimizer that repairs missing dependencies in the execution graph. / By the end of the tutorial, we have a complete multi-agent video system that can answer questions about a video, summarize its content, generate a news-style overview, and produce edited video artifacts from natural-language instructions.
- case_details: 暂无公开信息
- workflow_changes: Editors Pick Agentic AI AI Agents Tutorials In this tutorial, we build a runnable reconstruction of the VideoAgent workflow, focusing on the core agentic pipeline behind video understanding, retrieval, editing, and remaking. / We also connect these planning components to practical video-processing tools, including FFmpeg, Whisper-based transcription, scene detection, keyframe sampling, captioning, cross-modal indexing, retrieval, trimming, beat-synced editing, and final rendering.
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 该教程构建了一个可运行的VideoAgent工作流，专注于视频理解、检索、编辑和重制的核心智能体管线。系统包含意图解析器、智能体库、工具路由器、图规划器以及用于修复执行图中缺失依赖的文本梯度优化器，并集成了FFmpeg、基于Whisper的转录、场景检测、关键帧采样、字幕生成、跨模态索引与检索、修剪、节拍同步编辑及最终渲染等实际视频处理工具。最终形成一个完整的多智能体视频系统，能够回答视频相关问题、总结内容、生成新闻式概览，并根据自然语言指令产出编辑后的视频成品。系统支持OpenAI、DeepSeek、Anthropic和Gemini等多种LLM后端，并在无API密钥时安全回退至确定性执行。

## guanlan_scores

- importance_type: important_technical_trend
- importance_score: 5
- importance_reason: technical trend or capability shift; rubric=5 major/platform/industry-shaping
- supporting_signals: enterprise_ai_transformation_lens,commercial_or_risk_context,adoption_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 5
- guanlan_relevance: 4
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: true
- trend_candidate_context: true
- signal_card_candidate: false
- emerging_pool: true
- user_feedback_pool: false
- watchlist: true

## pool_routes

- core_pool
- emerging_pool

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
- discovery_record: {"discovery_title":"构建VideoAgent风格多智能体系统：视频编辑任务的意图解析、图规划与工具路由","discovery_summary":"该教程构建了一个可运行的VideoAgent工作流，专注于视频理解、检索、编辑和重制的核心智能体管线。系统包含意图解析器、智能体库、工具路由器、图规划器以及用于修复执行图中缺失依赖的文本梯度优化器，并集成了FFmpeg、基于Whisper的转录、场景检测、关键帧采样、字幕生成、跨模态索引与检索、修剪、节拍同步编辑及最终渲染等实际视频处理工具。最终形成一个完整的多智能体视频系统，能够回答视频相关问题、总结内容、生成新闻式概览，并根据自然语言指令产出编辑后的视频成品。系统支持OpenAI、DeepSeek、Anthropic和Gemini等多种LLM后端，并在无API密钥时安全回退至确定性执行。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/13/building-a-videoagent-style-multi-agent-system-intent-parsing-graph-planning-and-tool-routing-for-video-editing-tasks","discovered_at":"2026-07-14T01:48:14.383Z","rank_on_page":88,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

该教程构建了一个可运行的VideoAgent工作流，专注于视频理解、检索、编辑和重制的核心智能体管线。系统包含意图解析器、智能体库、工具路由器、图规划器以及用于修复执行图中缺失依赖的文本梯度优化器，并集成了FFmpeg、基于Whisper的转录、场景检测、关键帧采样、字幕生成、跨模态索引与检索、修剪、节拍同步编辑及最终渲染等实际视频处理工具。最终形成一个完整的多智能体视频系统，能够回答视频相关问题、总结内容、生成新闻式概览，并根据自然语言指令产出编辑后的视频成品。系统支持OpenAI、DeepSeek、Anthropic和Gemini等多种LLM后端，并在无API密钥时安全回退至确定性执行。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
