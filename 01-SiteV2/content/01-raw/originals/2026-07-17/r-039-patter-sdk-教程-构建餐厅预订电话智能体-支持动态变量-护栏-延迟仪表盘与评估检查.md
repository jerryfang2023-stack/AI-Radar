---
schema_version: raw-evidence-v2
raw_id: R-039
title: "Patter SDK 教程：构建餐厅预订电话智能体，支持动态变量、护栏、延迟仪表盘与评估检查"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: "https://www.marktechpost.com/2026/07/16/patter-sdk-guide-to-building-a-restaurant-booking-phone-agent-with-dynamic-variables-guardrails-latency-dashboards-and-eval-checks"
canonical_url: "https://marktechpost.com/2026/07/16/patter-sdk-guide-to-building-a-restaurant-booking-phone-agent-with-dynamic-variables-guardrails-latency-dashboards-and-eval-checks"
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
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-07-16T07:42:49.000Z"
collected_at: 2026-07-17T04:40:17.039Z
language: mixed
full_text_hash: da8bd04b288094f5
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-17/r-039-patter-sdk-教程-构建餐厅预订电话智能体-支持动态变量-护栏-延迟仪表盘与评估检查.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-17/r-039-patter-sdk-教程-构建餐厅预订电话智能体-支持动态变量-护栏-延迟仪表盘与评估检查.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 83
extractor_diagnostics: {"readability_score":83,"text_length":23906,"paragraph_count":360,"sentence_count":59,"boilerplate_hits":2,"symbol_ratio":0.0414,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}
has_full_text: true
content_length: 23906
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"da8bd04b288094f5","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Patter SDK 教程：构建餐厅预订电话智能体，支持动态变量、护栏、延迟仪表盘与评估检查","discovery_summary":"Patter SDK 发布教程，演示如何构建一个餐厅预订场景的语音智能体工作流。该流程支持动态调用变量、注册可调用工具、应用输出护栏（如PII脱敏、脏话过滤、话题范围限制），并可在无需实时电话凭证的情况下运行脚本化通话模拟。教程还涵盖延迟与成本指标追踪、回归式评估检查，以及将智能体逻辑、工具调用、安全检查和通话模拟整合为单一结构化管线。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/16/patter-sdk-guide-to-building-a-restaurant-booking-phone-agent-with-dynamic-variables-guardrails-latency-dashboards-and-eval-checks","discovered_at":"2026-07-17T04:31:45.362Z","rank_on_page":319,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 36a84a9b44fb6771
content_hash: a72e2b7a9dfdc4dd
semantic_hash: 1a994e8ce8f63f51
duplicate_of: ""
first_seen_at: "2026-07-16T07:42:49.000Z"
last_seen_at: 2026-07-17T04:40:17.039Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool","emerging_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["MarkTechPost（RSS）","OpenAI"],"products":["Agents","agent","Agent"],"people":[],"industries":["法律 / 法务","医疗","制造 / 工业","开发者工具"],"roles":["CIO / IT 负责人","法务 / 律师"],"workflows":["计费 / 预算管理","权限 / 安全治理","部署 / 集成交付"],"business_actions":["发布 / 推出","部署 / 上线","融资 / 投资"],"affected_departments":["IT / 安全","法务","财务 / 预算"],"numbers":["600","74","24","8","7","6","2","4"],"quotes":[", pkg],\ncheck=False, timeout=600)\nexcept Exception:\npass\ndef _load_patter():\n","Return the real getpatter module if importable, else None.","\nfor name in (","getpatter","getpatter"]}
evidence_seed: {"company_actions":["We work with a restaurant booking use case in which we define dynamic caller variables, register callable tools, apply output guardrails, simulate speech-to-text and text-to-speech behavior, and run a complete scripted call flow without requiring live telephony credentials.","We also inspect the installed Patter API when available, create a deterministic agent brain, track modeled latency and cost metrics, and validate the system through regression-style evaluations."],"case_details":["Finally, we understand how the Patter SDK integrates agent logic, tool use, safety checks, call simulation, and real-world deployment patterns into a single structured voice-agent pipeline."],"workflow_changes":["Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we explore the Patter SDK by building a voice-agent workflow that simulates how an AI phone assistant behaves during real conversations.","Setting Up the Patter SDK, Tools, and Restaurant Backend Copy Code Copied Use a different Browser from __future__ import annotations import sys, subprocess, importlib, inspect, time, json, re, random, textwrap, os from dataclasses import dataclass, field from statistics import median def _try_install(pkg: str) -> None: try: subprocess."],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","法务 / 律师"],"risks_or_constraints":["Patter SDK 发布教程，演示如何构建一个餐厅预订场景的语音智能体工作流。该流程支持动态调用变量、注册可调用工具、应用输出护栏（如PII脱敏、脏话过滤、话题范围限制），并可在无需实时电话凭证的情况下运行脚本化通话模拟。教程还涵盖延迟与成本指标追踪、回归式评估检查，以及将智能体逻辑、工具调用、安全检查和通话模拟整合为单一结构化管线。"]}
missing_information: []
key_excerpts: [{"type":"supporting_context","text":"Patter SDK 发布教程，演示如何构建一个餐厅预订场景的语音智能体工作流。该流程支持动态调用变量、注册可调用工具、应用输出护栏（如PII脱敏、脏话过滤、话题范围限制），并可在无需实时电话凭证的情况下运行脚本化通话模拟。教程还涵盖延迟与成本指标追踪、回归式评估检查，以及将智能体逻辑、工具调用、安全检查和通话模拟整合为单一结构化管线。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we explore the Patter SDK by building a voice-agent workflow that simulates how an AI phone assistant behaves during real conversations.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"We work with a restaurant booking use case in which we define dynamic caller variables, register callable tools, apply output guardrails, simulate speech-to-text and text-to-speech behavior, and run a complete scripted call flow without requiring live telephony credentials.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"We also inspect the installed Patter API when available, create a deterministic agent brain, track modeled latency and cost metrics, and validate the system through regression-style evaluations.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"Finally, we understand how the Patter SDK integrates agent logic, tool use, safety checks, call simulation, and real-world deployment patterns into a single structured voice-agent pipeline.","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"Setting Up the Patter SDK, Tools, and Restaurant Backend Copy Code Copied Use a different Browser from __future__ import annotations import sys, subprocess, importlib, inspect, time, json, re, random, textwrap, os from dataclasses import dataclass, field from statistics import median def _try_install(pkg: str) -> None: try: subprocess.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-17T04:40:17.039Z
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Patter SDK 教程：构建餐厅预订电话智能体，支持动态变量、护栏、延迟仪表盘与评估检查

## clean_text

Editors Pick
Agentic AI
AI Agents
Staff
Tutorials
In this tutorial, we explore the Patter SDK by building a voice-agent workflow that simulates how an AI phone assistant behaves during real conversations. We work with a restaurant booking use case in which we define dynamic caller variables, register callable tools, apply output guardrails, simulate speech-to-text and text-to-speech behavior, and run a complete scripted call flow without requiring live telephony credentials. We also inspect the installed Patter API when available, create a deterministic agent brain, track modeled latency and cost metrics, and validate the system through regression-style evaluations. Finally, we understand how the Patter SDK integrates agent logic, tool use, safety checks, call simulation, and real-world deployment patterns into a single structured voice-agent pipeline.
Setting Up the Patter SDK, Tools, and Restaurant Backend
Copy Code Copied Use a different Browser
from __future__ import annotations
import sys, subprocess, importlib, inspect, time, json, re, random, textwrap, os
from dataclasses import dataclass, field
from statistics import median
def _try_install(pkg: str) -> None:
try:
subprocess.run([sys.executable, "-m", "pip", "install", "-q", pkg],
check=False, timeout=600)
except Exception:
pass
def _load_patter():
"""Return the real getpatter module if importable, else None."""
for name in ("patter", "getpatter"):
try:
return importlib.import_module(name)
except Exception:
continue
return None
_PATTER = _load_patter()
if _PATTER is None:
_try_install("getpatter")
_PATTER = _load_patter()
def show_real_api():
"""Print the *actual* installed Patter API so the tutorial adapts to
whatever version Colab pulled (getpatter is young & moves weekly)."""
print("=" * 74)
print("PATTER SDK — installed API")
print("=" * 74)
if _PATTER is None:
print("getpatter not importable in this kernel (that's fine — the\n"
"Colab demo below is self-contained). On a fresh Colab it will\n"
"`pip install getpatter` and this block prints the live API.\n")
return
print(f"module : {_PATTER.__name__}")
print(f"version : {getattr(_PATTER, '__version__', 'unknown')}")
exported = [n for n in dir(_PATTER) if not n.startswith('_')]
print("exports :", ", ".join(exported[:24]) + (" ..." if len(exported) > 24 else ""))
Patter = getattr(_PATTER, "Patter", None)
if Patter is not None:
for meth in ("__init__", "agent", "serve", "call", "test", "tool"):
fn = getattr(Patter, meth, None)
if callable(fn):
try:
print(f"Patter.{meth:<8}: {inspect.signature(fn)}")
except (TypeError, ValueError):
print(f"Patter.{meth:<8}: <builtin/!signature>")
print()
random.seed(7)
CALL_VARIABLES = {
"customer_name": "Priya",
"loyalty_tier": "Gold",
"restaurant": "Acme Bistro",
USE_REAL_LLM = False
TOOLS: dict[str, dict] = {}
def tool(description: str):
def deco(fn):
params = [p for p in inspect.signature(fn).parameters]
TOOLS[fn.__name__] = {"fn": fn, "description": description, "params": params}
return fn
return deco
import copy
_OPEN_TABLES_INIT = {
("today", "evening"): 6, ("today", "late"): 2,
("tomorrow", "lunch"): 8, ("tomorrow", "evening"): 4,
("friday", "evening"): 0, ("friday", "late"): 3,
_RES_DB_INIT = {"AC8842": "Table for 2, tomorrow 7:30pm, under Singh — confirmed."}
_HOURS = {"weekday": "11:00–22:00", "weekend": "10:00–23:00"}
_OPEN_TABLES = copy.deepcopy(_OPEN_TABLES_INIT)
_RES_DB = copy.deepcopy(_RES_DB_INIT)
def _reset_backend():
"""Each simulated call starts from a clean backend (a real call hits a
fresh DB connection). Keeps the eval suite deterministic across runs."""
_OPEN_TABLES.clear(); _OPEN_TABLES.update(copy.deepcopy(_OPEN_TABLES_INIT))
_RES_DB.clear(); _RES_DB.update(copy.deepcopy(_RES_DB_INIT))
@tool("Check whether tables are free for a date/time slot and party size.")
def check_availability(date: str, slot: str, party_size: int) -> str:
seats = _OPEN_TABLES.get((date, slot), 0)
if seats >= party_size:
return f"AVAILABLE: {seats} seats open for {date} {slot}."
return f"FULL: only {seats} seats for {date} {slot} (need {party_size})."
@tool("Book a table and return a confirmation code.")
def book_table(name: str, date: str, slot: str, party_size: int) -> str:
seats = _OPEN_TABLES.get((date, slot), 0)
if seats < party_size:
return f"FAILED: not enough seats for {party_size} on {date} {slot}."
_OPEN_TABLES[(date, slot)] = seats - party_size
code = "AC" + str(random.randint(1000, 9999))
_RES_DB[code] = f"Table for {party_size}, {date} {slot}, under {name}."
return f"BOOKED: code {code} — party {party_size}, {date} {slot}, {name}."
@tool("Return opening hours for a given day type.")
def get_hours(day_type: str) -> str:
return _HOURS.get(day_type, _HOURS["weekday"])
@tool("Look up an existing reservation by its confirmation code.")
def lookup_reservation(code: str) -> str:
return _RES_DB.get(code.upper(), "NOT_FOUND: no reservation with that code.")
@tool("Hand the call to a human host (Patter auto-injects transfer_call).")
def transfer_to_human(reason: str) -> str:
return f"TRANSFER: routing to a host — reason: {reason}."
We set up the tutorial environment by importing the required libraries, optionally installing the Patter SDK, and inspecting the installed API when it is available. We define the dynamic caller variables, create a small tool registry, and prepare an in-memory restaurant backend for availability, reservations, hours, and transfers. We also register the core tools that allow our simulated phone agent to check tables, book reservations, look up confirmation codes, and route callers to a human.
Adding Output Guardrails and Simulated Speech Layers
Copy Code Copied Use a different Browser
class GuardrailBlock(Exception):
def __init__(self, safe_reply: str):
self.safe_reply = safe_reply
_PII_EMAIL = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b")
_PII_PHONE = re.compile(r"\b(?:\+?\d[\s-]?){9,13}\d\b")
_INTERNAL = re.compile(r"\bCUST-\d{4,}\b")
_BANNED = re.compile(r"\b(damn|hell|crap)\b", re.I)
_OFFTOPIC = re.compile(r"\b(diagnos|prescri|lawsuit|legal advice|medication)\b", re.I)
def gr_redact_pii(text: str, ctx: dict) -> str:
text = _PII_EMAIL.sub("[email hidden]", text)
text = _PII_PHONE.sub("[number hidden]", text)
return text
def gr_hide_internal_ids(text: str, ctx: dict) -> str:
return _INTERNAL.sub("your account", text)
def gr_profanity(text: str, ctx: dict) -> str:
return _BANNED.sub("—", text)
def gr_scope(text: str, ctx: dict) -> str:
if _OFFTOPIC.search(text):
raise GuardrailBlock("I'm just the booking line, so I can't help with "
"that — but I can take a reservation if you like.")
return text
def gr_concise(text: str, ctx: dict) -> str:
parts = re.split(r"(?<=[.!?])\s+", text.strip())
return " ".join(parts[:2]) if len(parts) > 2 else text
GUARDRAILS = [gr_scope, gr_hide_internal_ids, gr_redact_pii, gr_profanity, gr_concise]
def apply_guardrails(text: str, ctx: dict) -> str:
for g in GUARDRAILS:
text = g(text, ctx)
return text
_WHISPER_FILLERS = {"you", "thank you", ".", "uh", "um"}
def fake_stt(utterance: str) -> tuple[str, float]:
"""Return (transcript, latency_ms). Drops Whisper-style fillers like Patter's pipeline does."""
t0 = time.perf_counter()
tokens = [w for w in utterance.split() if w.lower().strip(".,") not in _WHISPER_FILLERS]
transcript = " ".join(tokens) if tokens else utterance
lat = 60 + len(utterance) * 1.5 + random.uniform(0, 25)
_spin(t0)
return transcript, lat
def fake_tts(text: str) -> float:
"""Return synthesis latency_ms (time-to-first-audio-ish)."""
return 90 + len(text) * 0.8 + random.uniform(0, 30)
def _spin(_t0):
pass
SYSTEM_PROMPT = (
"You are the friendly phone host for {restaurant}. Caller: {customer_name} "
"({loyalty_tier} member). Help them book, check hours, look up a "
"reservation, or reach a human. Keep replies to one or two short sentences."
FIRST_MESSAGE = "Hi {customer_name}, thanks for calling {restaurant}! How can I help?"
def _fill(t: str, v: dict) -> str:
for k, val in v.items():
t = t.replace("{" + k + "}", str(val))
return t
def parse_party(s: str):
m = re.search(r"(?:for|party of|table for|of)\s+(\d+)", s) or re.search(r"\b(\d+)\s*(?:people|guests|of us|pax)", s)
if m: return int(m.group(1))
for w, n in _NUM.items():
if re.search(rf"\b{w}\b(?:\s+(?:people|guests|of us))?", s): return n
return None
def parse_date(s: str):
for d in ("today", "tonight", "tomorrow", "friday"):
if d in s: return "today" if d == "tonight" else d
return None
def parse_slot(s: str):
if re.search(r"\b(lunch|noon|midday)\b", s): return "lunch"
if re.search(r"\b(late|11pm|11 pm|after 10)\b", s): return "late"
if re.search(r"\b(dinner|evening|tonight|7|8|9|pm)\b", s): return "evening"
return None
def parse_name(s: str):
m = re.search(r"(?:i'?m|this is|name is|under)\s+([A-Z][a-z]+)", s)
return m.group(1) if m else None
def parse_code(s: str):
m = re.search(r"\b(AC\d{3,4})\b", s.upper())
return m.group(1) if m else None
def maybe_real_llm(history, user_text, ctx):
"""Optional: defer freeform small-talk to a real LLM if USE_REAL_LLM + a key.
Returns a string or None. Kept tiny and fully optional."""
if not USE_REAL_LLM:
return None
try:
if os.environ.get("OPENAI_API_KEY"):
from openai import OpenAI
sys_p = _fill(SYSTEM_PROMPT, ctx["vars"])
msgs = [{"role": "system", "content": sys_p}] + history + \
[{"role": "user", "content": user_text}]
r = OpenAI().chat.completions.create(model="gpt-4o-mini", messages=msgs, max_tokens=60)
return r.choices[0].message.content
except Exception:
return None
return None
We build the output guardrail layer that keeps the phone assistant safe, concise, and appropriate for the booking use case. We redact sensitive information, hide internal customer IDs, clean unwanted language, block off-topic requests, and keep responses short for a better phone experience. We then simulate speech-to-text and text-to-speech behavior, define the system prompt, and add lightweight parsing functions for party size, date, slot, name, and reservation code.
Building the Agent Brain and Call Simulator
Copy Code Copied Use a different Browser
def agent_brain(history: list, user_text: str, ctx: dict):
"""Core logic. `ctx` carries vars + slot state across turns."""
s = user_text.lower()
st = ctx["state"]
if re.search(r"\b(human|agent|representative|manager|person)\b", s):
return ("__tool__", "transfer_to_human", {"reason": "caller requested a human"})
if st.get("booked") and re.search(r"\b(no|nope|that'?s all|that'?s it|bye|thanks|thank you)\b", s):
return "Thanks for calling — see you soon!"
if re.search(r"\b(weather|stock|joke|medication|lawsuit)\b", s):
return "I'm just the booking line for tonight's tables — want me to grab you one?"
code = parse_code(s)
if code or "look up" in s or "my reservation" in s:
if code:
return ("__tool__", "lookup_reservation", {"code": code})
st["intent"] = "lookup"
return "Sure — what's your confirmation code? It looks like AC followed by four digits."
if re.search(r"\b(hours|open|close|closing)\b", s):
day_type = "weekend" if re.search(r"\b(sat|sun|weekend)\b", s) else "weekday"
return ("__tool__", "get_hours", {"day_type": day_type})
if re.search(r"\b(book|reserve|table|reservation)\b", s) or st.get("intent") == "book":
st["intent"] = "book"
if st.get("intent") == "book":
for key, val in (("party_size", parse_party(s)), ("date", parse_date(s)),
("slot", parse_slot(s)), ("name", parse_name(user_text) or st.get("name"))):
if val is not None:
st[key] = val
if st.get("party_size") is None:
return "Happy to book you in — how many people?"
if st.get("date") is None:
return f"Great, a table for {st['party_size']}. Which day — today, tomorrow, or Friday?"
if st.get("slot") is None:
return "And lunch, dinner, or late seating?"
if not st.get("checked"):
st["checked"] = True
return ("__tool__", "check_availability",
{"date": st["date"], "slot": st["slot"], "party_size": st["party_size"]})
if st.get("name") is None:
return "What name should I put it under?"
if not st.get("booked"):
st["booked"] = True
return ("__tool__", "book_table",
{"name": st["name"], "date": st["date"],
"slot": st["slot"], "party_size": st["party_size"]})
return "You're all set — anything else?"
if re.search(r"\b(no|nope|that's all|bye|thanks)\b", s):
return "Thanks for calling — see you soon!"
return maybe_real_llm(history, user_text, ctx) or \
"I can book a table, check hours, or look up a reservation — which would you like?"
def fold_tool_result(tool_name: str, raw: str, ctx: dict) -> str:
"""Turn a raw tool result into a natural spoken reply (what the LLM does
with a function-call result on a real Patter call)."""
if tool_name == "check_availability":
if raw.startswith("AVAILABLE"):
return "Good news — that slot's open. What name should I put it under?"
ctx["state"]["checked"] = False
ctx["state"]["slot"] = None
return "That one's full, sorry. Would another time work — lunch or late seating?"
if tool_name == "book_table" and raw.startswith("BOOKED"):
code = raw.split("code ")[1].split(" ")[0]
return f"Booked! Your confirmation code is {code}. Anything else?"
if tool_name == "get_hours":
return f"We're open {raw}. Want me to reserve a table?"
if tool_name == "lookup_reservation":
return ("Here it is: " + raw) if not raw.startswith("NOT_FOUND") \
else "I couldn't find that code — could you read it once more?"
if tool_name == "transfer_to_human":
return "Of course — connecting you to a host now. One moment!"
return raw
@dataclass
class Turn:
speaker: str
text: str
stt_ms: float = 0.0
llm_ms: float = 0.0
tool_ms: float = 0.0
tts_ms: float = 0.0
tool: str | None = None
@property
def total_ms(self): return self.stt_ms + self.llm_ms + self.tool_ms + self.tts_ms
@dataclass
class CallResult:
transcript: list = field(default_factory=list)
turns: list = field(default_factory=list)
def run_call(caller_lines: list[str], variables: dict, barge_in_at: int | None = None) -> CallResult:
_reset_backend()
ctx = {"vars": dict(variables), "state": {}}
history, res = [], CallResult()
def speak(text: str, llm_ms: float, tool=None, tool_ms=0.0, truncate=None):
t0 = time.perf_counter()
try:
safe = apply_guardrails(text, ctx)
except GuardrailBlock as b:
safe = b.safe_reply
if truncate:
safe = safe.split()[:truncate]
safe = " ".join(safe) + " —"
gr_ms = (time.perf_counter() - t0) * 1000
tts = fake_tts(safe)
res.transcript.append(("agent", safe))
res.turns.append(Turn("agent", safe, llm_ms=llm_ms + gr_ms,
tool=tool, tool_ms=tool_ms, tts_ms=tts))
history.append({"role": "assistant", "content": safe})
speak(_fill(FIRST_MESSAGE, ctx["vars"]), llm_ms=5.0)
for i, raw_line in enumerate(caller_lines):
transcript, stt_ms = fake_stt(raw_line)
res.transcript.append(("caller", transcript))
history.append({"role": "user", "content": transcript})
t0 = time.perf_counter()
out = agent_brain(history, transcript, ctx)
llm_ms = (time.perf_counter() - t0) * 1000 + random.uniform(40, 120)
truncate = 4 if (barge_in_at is not None and i == barge_in_at) else None
if isinstance(out, tuple) and out and out[0] == "__tool__":
_, name, kwargs = out
t1 = time.perf_counter()
raw = TOOLS[name]["fn"](**kwargs)
tool_ms = (time.perf_counter() - t1) * 1000 + random.uniform(10, 40)
reply = fold_tool_result(name, raw, ctx)
speak(reply, llm_ms=llm_ms, tool=name, tool_ms=tool_ms, truncate=truncate)
res.turns[-1].stt_ms = stt_ms
else:
speak(out, llm_ms=llm_ms, truncate=truncate)
res.turns[-1].stt_ms = stt_ms
return res
We implement the main agent brain that controls the conversation flow across booking, reservation lookup, opening-hours questions, human transfer, and fallback responses. We use the parsed caller input and stored conversation state to decide when to ask follow-up questions, call tools, or complete a reservation. We also create a call simulator with structured turn objects to run scripted conversations and collect latency, tool, and transcript data.
Printing Transcripts, Latency Dashboards, and Regression Evals
Copy Code Copied Use a different Browser
def print_transcript(title: str, res: CallResult):
print("\n" + "─" * 74)
print(f"📞 {title}")
print("─" * 74)
for who, txt in res.transcript:
tag = "🤖 agent " if who == "agent" else "🧑 caller"
print(f"{tag}│ {txt}")
def print_dashboard(res: CallResult):
totals = [t.total_ms for t in res.turns]
stt = [t.stt_ms for t in res.turns if t.stt_ms]
llm = [t.llm_ms for t in res.turns]
tts = [t.tts_ms for t in res.turns]
tool_turns = [t for t in res.turns if t.tool]
def p95(xs): return sorted(xs)[max(0, int(len(xs) * 0.95) - 1)] if xs else 0
cost = sum(0.0009 for _ in stt) + sum(0.0004 for _ in res.turns) + sum(0.00018 * len(t.text) for t in res.turns)
print("\n ┌─ Patter dashboard (modeled) ────────────────────────────┐")
print(f" │ agent turns : {len(res.turns):<6} │")
print(f" │ tool calls : {len(tool_turns):<6} ({', '.join(t.tool for t in tool_turns) or '—'})")
print(f" │ latency p50 total : {median(totals):6.0f} ms │")
print(f" │ latency p95 total : {p95(totals):6.0f} ms │")
print(f" │ STT avg / TTS avg : {(sum(stt)/len(stt) if stt else 0):5.0f} ms / {(sum(tts)/len(tts) if tts else 0):5.0f} ms │")
print(f" │ est. spend (illus.): ${cost:5.3f} │")
print(" └──────────────────────────────────────────────────────────┘")
def run_evals() -> bool:
print("\n" + "=" * 74)
print("EVAL HARNESS — regression checks")
print("=" * 74)
cases, passed = [], 0
def full_transcript(res): return " || ".join(f"{w}:{t}" for w, t in res.transcript)
r1 = run_call(["I'd like to book a table", "four of us", "tomorrow",
"dinner", "under Priya"], CALL_VARIABLES)
ok1 = bool(re.search(r"confirmation code is AC\d{4}", full_transcript(r1)))
cases.append(("books a table & returns a code", ok1))
leak = apply_guardrails("Your record CUST-99812 shows VIP status.", {"vars": {}, "state": {}})
ok2 = "CUST-99812" not in leak and "your account" in leak
cases.append(("guardrail hides internal CUST- ids", ok2))
r3 = run_call(["can you give me medication advice?"], CALL_VARIABLES)
ok3 = "booking line" in full_transcript(r3).lower()
cases.append(("refuses out-of-scope (medical)", ok3))
r4 = run_call(["get me a human plea

## full_text

Editors Pick
Agentic AI
AI Agents
Staff
Tutorials
In this tutorial, we explore the Patter SDK by building a voice-agent workflow that simulates how an AI phone assistant behaves during real conversations. We work with a restaurant booking use case in which we define dynamic caller variables, register callable tools, apply output guardrails, simulate speech-to-text and text-to-speech behavior, and run a complete scripted call flow without requiring live telephony credentials. We also inspect the installed Patter API when available, create a deterministic agent brain, track modeled latency and cost metrics, and validate the system through regression-style evaluations. Finally, we understand how the Patter SDK integrates agent logic, tool use, safety checks, call simulation, and real-world deployment patterns into a single structured voice-agent pipeline.
Setting Up the Patter SDK, Tools, and Restaurant Backend
Copy Code Copied Use a different Browser
from __future__ import annotations
import sys, subprocess, importlib, inspect, time, json, re, random, textwrap, os
from dataclasses import dataclass, field
from statistics import median
def _try_install(pkg: str) -> None:
try:
subprocess.run([sys.executable, "-m", "pip", "install", "-q", pkg],
check=False, timeout=600)
except Exception:
pass
def _load_patter():
"""Return the real getpatter module if importable, else None."""
for name in ("patter", "getpatter"):
try:
return importlib.import_module(name)
except Exception:
continue
return None
_PATTER = _load_patter()
if _PATTER is None:
_try_install("getpatter")
_PATTER = _load_patter()
def show_real_api():
"""Print the *actual* installed Patter API so the tutorial adapts to
whatever version Colab pulled (getpatter is young & moves weekly)."""
print("=" * 74)
print("PATTER SDK — installed API")
print("=" * 74)
if _PATTER is None:
print("getpatter not importable in this kernel (that's fine — the\n"
"Colab demo below is self-contained). On a fresh Colab it will\n"
"`pip install getpatter` and this block prints the live API.\n")
return
print(f"module : {_PATTER.__name__}")
print(f"version : {getattr(_PATTER, '__version__', 'unknown')}")
exported = [n for n in dir(_PATTER) if not n.startswith('_')]
print("exports :", ", ".join(exported[:24]) + (" ..." if len(exported) > 24 else ""))
Patter = getattr(_PATTER, "Patter", None)
if Patter is not None:
for meth in ("__init__", "agent", "serve", "call", "test", "tool"):
fn = getattr(Patter, meth, None)
if callable(fn):
try:
print(f"Patter.{meth:<8}: {inspect.signature(fn)}")
except (TypeError, ValueError):
print(f"Patter.{meth:<8}: <builtin/!signature>")
print()
random.seed(7)
CALL_VARIABLES = {
"customer_name": "Priya",
"loyalty_tier": "Gold",
"restaurant": "Acme Bistro",
USE_REAL_LLM = False
TOOLS: dict[str, dict] = {}
def tool(description: str):
def deco(fn):
params = [p for p in inspect.signature(fn).parameters]
TOOLS[fn.__name__] = {"fn": fn, "description": description, "params": params}
return fn
return deco
import copy
_OPEN_TABLES_INIT = {
("today", "evening"): 6, ("today", "late"): 2,
("tomorrow", "lunch"): 8, ("tomorrow", "evening"): 4,
("friday", "evening"): 0, ("friday", "late"): 3,
_RES_DB_INIT = {"AC8842": "Table for 2, tomorrow 7:30pm, under Singh — confirmed."}
_HOURS = {"weekday": "11:00–22:00", "weekend": "10:00–23:00"}
_OPEN_TABLES = copy.deepcopy(_OPEN_TABLES_INIT)
_RES_DB = copy.deepcopy(_RES_DB_INIT)
def _reset_backend():
"""Each simulated call starts from a clean backend (a real call hits a
fresh DB connection). Keeps the eval suite deterministic across runs."""
_OPEN_TABLES.clear(); _OPEN_TABLES.update(copy.deepcopy(_OPEN_TABLES_INIT))
_RES_DB.clear(); _RES_DB.update(copy.deepcopy(_RES_DB_INIT))
@tool("Check whether tables are free for a date/time slot and party size.")
def check_availability(date: str, slot: str, party_size: int) -> str:
seats = _OPEN_TABLES.get((date, slot), 0)
if seats >= party_size:
return f"AVAILABLE: {seats} seats open for {date} {slot}."
return f"FULL: only {seats} seats for {date} {slot} (need {party_size})."
@tool("Book a table and return a confirmation code.")
def book_table(name: str, date: str, slot: str, party_size: int) -> str:
seats = _OPEN_TABLES.get((date, slot), 0)
if seats < party_size:
return f"FAILED: not enough seats for {party_size} on {date} {slot}."
_OPEN_TABLES[(date, slot)] = seats - party_size
code = "AC" + str(random.randint(1000, 9999))
_RES_DB[code] = f"Table for {party_size}, {date} {slot}, under {name}."
return f"BOOKED: code {code} — party {party_size}, {date} {slot}, {name}."
@tool("Return opening hours for a given day type.")
def get_hours(day_type: str) -> str:
return _HOURS.get(day_type, _HOURS["weekday"])
@tool("Look up an existing reservation by its confirmation code.")
def lookup_reservation(code: str) -> str:
return _RES_DB.get(code.upper(), "NOT_FOUND: no reservation with that code.")
@tool("Hand the call to a human host (Patter auto-injects transfer_call).")
def transfer_to_human(reason: str) -> str:
return f"TRANSFER: routing to a host — reason: {reason}."
We set up the tutorial environment by importing the required libraries, optionally installing the Patter SDK, and inspecting the installed API when it is available. We define the dynamic caller variables, create a small tool registry, and prepare an in-memory restaurant backend for availability, reservations, hours, and transfers. We also register the core tools that allow our simulated phone agent to check tables, book reservations, look up confirmation codes, and route callers to a human.
Adding Output Guardrails and Simulated Speech Layers
Copy Code Copied Use a different Browser
class GuardrailBlock(Exception):
def __init__(self, safe_reply: str):
self.safe_reply = safe_reply
_PII_EMAIL = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b")
_PII_PHONE = re.compile(r"\b(?:\+?\d[\s-]?){9,13}\d\b")
_INTERNAL = re.compile(r"\bCUST-\d{4,}\b")
_BANNED = re.compile(r"\b(damn|hell|crap)\b", re.I)
_OFFTOPIC = re.compile(r"\b(diagnos|prescri|lawsuit|legal advice|medication)\b", re.I)
def gr_redact_pii(text: str, ctx: dict) -> str:
text = _PII_EMAIL.sub("[email hidden]", text)
text = _PII_PHONE.sub("[number hidden]", text)
return text
def gr_hide_internal_ids(text: str, ctx: dict) -> str:
return _INTERNAL.sub("your account", text)
def gr_profanity(text: str, ctx: dict) -> str:
return _BANNED.sub("—", text)
def gr_scope(text: str, ctx: dict) -> str:
if _OFFTOPIC.search(text):
raise GuardrailBlock("I'm just the booking line, so I can't help with "
"that — but I can take a reservation if you like.")
return text
def gr_concise(text: str, ctx: dict) -> str:
parts = re.split(r"(?<=[.!?])\s+", text.strip())
return " ".join(parts[:2]) if len(parts) > 2 else text
GUARDRAILS = [gr_scope, gr_hide_internal_ids, gr_redact_pii, gr_profanity, gr_concise]
def apply_guardrails(text: str, ctx: dict) -> str:
for g in GUARDRAILS:
text = g(text, ctx)
return text
_WHISPER_FILLERS = {"you", "thank you", ".", "uh", "um"}
def fake_stt(utterance: str) -> tuple[str, float]:
"""Return (transcript, latency_ms). Drops Whisper-style fillers like Patter's pipeline does."""
t0 = time.perf_counter()
tokens = [w for w in utterance.split() if w.lower().strip(".,") not in _WHISPER_FILLERS]
transcript = " ".join(tokens) if tokens else utterance
lat = 60 + len(utterance) * 1.5 + random.uniform(0, 25)
_spin(t0)
return transcript, lat
def fake_tts(text: str) -> float:
"""Return synthesis latency_ms (time-to-first-audio-ish)."""
return 90 + len(text) * 0.8 + random.uniform(0, 30)
def _spin(_t0):
pass
SYSTEM_PROMPT = (
"You are the friendly phone host for {restaurant}. Caller: {customer_name} "
"({loyalty_tier} member). Help them book, check hours, look up a "
"reservation, or reach a human. Keep replies to one or two short sentences."
FIRST_MESSAGE = "Hi {customer_name}, thanks for calling {restaurant}! How can I help?"
def _fill(t: str, v: dict) -> str:
for k, val in v.items():
t = t.replace("{" + k + "}", str(val))
return t
def parse_party(s: str):
m = re.search(r"(?:for|party of|table for|of)\s+(\d+)", s) or re.search(r"\b(\d+)\s*(?:people|guests|of us|pax)", s)
if m: return int(m.group(1))
for w, n in _NUM.items():
if re.search(rf"\b{w}\b(?:\s+(?:people|guests|of us))?", s): return n
return None
def parse_date(s: str):
for d in ("today", "tonight", "tomorrow", "friday"):
if d in s: return "today" if d == "tonight" else d
return None
def parse_slot(s: str):
if re.search(r"\b(lunch|noon|midday)\b", s): return "lunch"
if re.search(r"\b(late|11pm|11 pm|after 10)\b", s): return "late"
if re.search(r"\b(dinner|evening|tonight|7|8|9|pm)\b", s): return "evening"
return None
def parse_name(s: str):
m = re.search(r"(?:i'?m|this is|name is|under)\s+([A-Z][a-z]+)", s)
return m.group(1) if m else None
def parse_code(s: str):
m = re.search(r"\b(AC\d{3,4})\b", s.upper())
return m.group(1) if m else None
def maybe_real_llm(history, user_text, ctx):
"""Optional: defer freeform small-talk to a real LLM if USE_REAL_LLM + a key.
Returns a string or None. Kept tiny and fully optional."""
if not USE_REAL_LLM:
return None
try:
if os.environ.get("OPENAI_API_KEY"):
from openai import OpenAI
sys_p = _fill(SYSTEM_PROMPT, ctx["vars"])
msgs = [{"role": "system", "content": sys_p}] + history + \
[{"role": "user", "content": user_text}]
r = OpenAI().chat.completions.create(model="gpt-4o-mini", messages=msgs, max_tokens=60)
return r.choices[0].message.content
except Exception:
return None
return None
We build the output guardrail layer that keeps the phone assistant safe, concise, and appropriate for the booking use case. We redact sensitive information, hide internal customer IDs, clean unwanted language, block off-topic requests, and keep responses short for a better phone experience. We then simulate speech-to-text and text-to-speech behavior, define the system prompt, and add lightweight parsing functions for party size, date, slot, name, and reservation code.
Building the Agent Brain and Call Simulator
Copy Code Copied Use a different Browser
def agent_brain(history: list, user_text: str, ctx: dict):
"""Core logic. `ctx` carries vars + slot state across turns."""
s = user_text.lower()
st = ctx["state"]
if re.search(r"\b(human|agent|representative|manager|person)\b", s):
return ("__tool__", "transfer_to_human", {"reason": "caller requested a human"})
if st.get("booked") and re.search(r"\b(no|nope|that'?s all|that'?s it|bye|thanks|thank you)\b", s):
return "Thanks for calling — see you soon!"
if re.search(r"\b(weather|stock|joke|medication|lawsuit)\b", s):
return "I'm just the booking line for tonight's tables — want me to grab you one?"
code = parse_code(s)
if code or "look up" in s or "my reservation" in s:
if code:
return ("__tool__", "lookup_reservation", {"code": code})
st["intent"] = "lookup"
return "Sure — what's your confirmation code? It looks like AC followed by four digits."
if re.search(r"\b(hours|open|close|closing)\b", s):
day_type = "weekend" if re.search(r"\b(sat|sun|weekend)\b", s) else "weekday"
return ("__tool__", "get_hours", {"day_type": day_type})
if re.search(r"\b(book|reserve|table|reservation)\b", s) or st.get("intent") == "book":
st["intent"] = "book"
if st.get("intent") == "book":
for key, val in (("party_size", parse_party(s)), ("date", parse_date(s)),
("slot", parse_slot(s)), ("name", parse_name(user_text) or st.get("name"))):
if val is not None:
st[key] = val
if st.get("party_size") is None:
return "Happy to book you in — how many people?"
if st.get("date") is None:
return f"Great, a table for {st['party_size']}. Which day — today, tomorrow, or Friday?"
if st.get("slot") is None:
return "And lunch, dinner, or late seating?"
if not st.get("checked"):
st["checked"] = True
return ("__tool__", "check_availability",
{"date": st["date"], "slot": st["slot"], "party_size": st["party_size"]})
if st.get("name") is None:
return "What name should I put it under?"
if not st.get("booked"):
st["booked"] = True
return ("__tool__", "book_table",
{"name": st["name"], "date": st["date"],
"slot": st["slot"], "party_size": st["party_size"]})
return "You're all set — anything else?"
if re.search(r"\b(no|nope|that's all|bye|thanks)\b", s):
return "Thanks for calling — see you soon!"
return maybe_real_llm(history, user_text, ctx) or \
"I can book a table, check hours, or look up a reservation — which would you like?"
def fold_tool_result(tool_name: str, raw: str, ctx: dict) -> str:
"""Turn a raw tool result into a natural spoken reply (what the LLM does
with a function-call result on a real Patter call)."""
if tool_name == "check_availability":
if raw.startswith("AVAILABLE"):
return "Good news — that slot's open. What name should I put it under?"
ctx["state"]["checked"] = False
ctx["state"]["slot"] = None
return "That one's full, sorry. Would another time work — lunch or late seating?"
if tool_name == "book_table" and raw.startswith("BOOKED"):
code = raw.split("code ")[1].split(" ")[0]
return f"Booked! Your confirmation code is {code}. Anything else?"
if tool_name == "get_hours":
return f"We're open {raw}. Want me to reserve a table?"
if tool_name == "lookup_reservation":
return ("Here it is: " + raw) if not raw.startswith("NOT_FOUND") \
else "I couldn't find that code — could you read it once more?"
if tool_name == "transfer_to_human":
return "Of course — connecting you to a host now. One moment!"
return raw
@dataclass
class Turn:
speaker: str
text: str
stt_ms: float = 0.0
llm_ms: float = 0.0
tool_ms: float = 0.0
tts_ms: float = 0.0
tool: str | None = None
@property
def total_ms(self): return self.stt_ms + self.llm_ms + self.tool_ms + self.tts_ms
@dataclass
class CallResult:
transcript: list = field(default_factory=list)
turns: list = field(default_factory=list)
def run_call(caller_lines: list[str], variables: dict, barge_in_at: int | None = None) -> CallResult:
_reset_backend()
ctx = {"vars": dict(variables), "state": {}}
history, res = [], CallResult()
def speak(text: str, llm_ms: float, tool=None, tool_ms=0.0, truncate=None):
t0 = time.perf_counter()
try:
safe = apply_guardrails(text, ctx)
except GuardrailBlock as b:
safe = b.safe_reply
if truncate:
safe = safe.split()[:truncate]
safe = " ".join(safe) + " —"
gr_ms = (time.perf_counter() - t0) * 1000
tts = fake_tts(safe)
res.transcript.append(("agent", safe))
res.turns.append(Turn("agent", safe, llm_ms=llm_ms + gr_ms,
tool=tool, tool_ms=tool_ms, tts_ms=tts))
history.append({"role": "assistant", "content": safe})
speak(_fill(FIRST_MESSAGE, ctx["vars"]), llm_ms=5.0)
for i, raw_line in enumerate(caller_lines):
transcript, stt_ms = fake_stt(raw_line)
res.transcript.append(("caller", transcript))
history.append({"role": "user", "content": transcript})
t0 = time.perf_counter()
out = agent_brain(history, transcript, ctx)
llm_ms = (time.perf_counter() - t0) * 1000 + random.uniform(40, 120)
truncate = 4 if (barge_in_at is not None and i == barge_in_at) else None
if isinstance(out, tuple) and out and out[0] == "__tool__":
_, name, kwargs = out
t1 = time.perf_counter()
raw = TOOLS[name]["fn"](**kwargs)
tool_ms = (time.perf_counter() - t1) * 1000 + random.uniform(10, 40)
reply = fold_tool_result(name, raw, ctx)
speak(reply, llm_ms=llm_ms, tool=name, tool_ms=tool_ms, truncate=truncate)
res.turns[-1].stt_ms = stt_ms
else:
speak(out, llm_ms=llm_ms, truncate=truncate)
res.turns[-1].stt_ms = stt_ms
return res
We implement the main agent brain that controls the conversation flow across booking, reservation lookup, opening-hours questions, human transfer, and fallback responses. We use the parsed caller input and stored conversation state to decide when to ask follow-up questions, call tools, or complete a reservation. We also create a call simulator with structured turn objects to run scripted conversations and collect latency, tool, and transcript data.
Printing Transcripts, Latency Dashboards, and Regression Evals
Copy Code Copied Use a different Browser
def print_transcript(title: str, res: CallResult):
print("\n" + "─" * 74)
print(f"📞 {title}")
print("─" * 74)
for who, txt in res.transcript:
tag = "🤖 agent " if who == "agent" else "🧑 caller"
print(f"{tag}│ {txt}")
def print_dashboard(res: CallResult):
totals = [t.total_ms for t in res.turns]
stt = [t.stt_ms for t in res.turns if t.stt_ms]
llm = [t.llm_ms for t in res.turns]
tts = [t.tts_ms for t in res.turns]
tool_turns = [t for t in res.turns if t.tool]
def p95(xs): return sorted(xs)[max(0, int(len(xs) * 0.95) - 1)] if xs else 0
cost = sum(0.0009 for _ in stt) + sum(0.0004 for _ in res.turns) + sum(0.00018 * len(t.text) for t in res.turns)
print("\n ┌─ Patter dashboard (modeled) ────────────────────────────┐")
print(f" │ agent turns : {len(res.turns):<6} │")
print(f" │ tool calls : {len(tool_turns):<6} ({', '.join(t.tool for t in tool_turns) or '—'})")
print(f" │ latency p50 total : {median(totals):6.0f} ms │")
print(f" │ latency p95 total : {p95(totals):6.0f} ms │")
print(f" │ STT avg / TTS avg : {(sum(stt)/len(stt) if stt else 0):5.0f} ms / {(sum(tts)/len(tts) if tts else 0):5.0f} ms │")
print(f" │ est. spend (illus.): ${cost:5.3f} │")
print(" └──────────────────────────────────────────────────────────┘")
def run_evals() -> bool:
print("\n" + "=" * 74)
print("EVAL HARNESS — regression checks")
print("=" * 74)
cases, passed = [], 0
def full_transcript(res): return " || ".join(f"{w}:{t}" for w, t in res.transcript)
r1 = run_call(["I'd like to book a table", "four of us", "tomorrow",
"dinner", "under Priya"], CALL_VARIABLES)
ok1 = bool(re.search(r"confirmation code is AC\d{4}", full_transcript(r1)))
cases.append(("books a table & returns a code", ok1))
leak = apply_guardrails("Your record CUST-99812 shows VIP status.", {"vars": {}, "state": {}})
ok2 = "CUST-99812" not in leak and "your account" in leak
cases.append(("guardrail hides internal CUST- ids", ok2))
r3 = run_call(["can you give me medication advice?"], CALL_VARIABLES)
ok3 = "booking line" in full_transcript(r3).lower()
cases.append(("refuses out-of-scope (medical)", ok3))
r4 = run_call(["get me a human please"], CALL_VARIABLES)
ok4 = any(t.tool == "transfer_to_human" for t in r4.turns)
cases.append(("transfers to a human on request", ok4))
r5 = run_call(["book a table", "two", "friday", "evening"], CALL_VARIABLES)
ok5 = "full" in full_transcript(r5).lower() and "confirmation code" not in full_transcript(r5).lower()
cases.append(("handles a full slot gracefully", ok5))
long = apply_guardrails("One. Two. Three. Four.", {"vars": {}, "state": {}})
ok6 = long.count(".") <= 2
cases.append(("concise guardrail caps sentence count", ok6))
for name, ok in cases:
passed += ok
print(f" [{'PASS' if ok else 'FAIL'}] {name}")
print(f"\n {passed}/{len(cases)} passed")
return passed == len(cases)
We format the simulated call results into a readable transcript and a Patter-style dashboard that summarizes agent turns, tool calls, latency, and estimated spend. We also build a deterministic evaluation harness that checks whether the agent completes bookings, protects internal IDs, refuses out-of-scope medical requests, transfers to a human, handles full slots, and keeps replies concise. We use these checks to validate that the phone-agent workflow behaves reliably before moving toward real deployment.
Moving to Real Calls with Twilio and OpenAI Realtime
Copy Code Copied Use a different Browser
REAL_DEPLOYMENT = textwrap.dedent('''
# ---- real_agent.py (run OUTSIDE Colab; needs a paid carrier + keys) ----
# export TWILIO_ACCOUNT_SID=AC... ; export TWILIO_AUTH_TOKEN=...
# export TWILIO_PHONE_NUMBER=+1... ; export OPENAI_API_KEY=sk-...
import asyncio
from getpatter import Patter, Twilio, OpenAIRealtime
phone = Patter(carrier=Twilio(), phone_number="+15550001234")
# register the very same tools you tested above
@phone.tool
async def book_table(name: str, date: str, slot: str, party_size: int) -> str:
... # your real booking backend
agent = phone.agent(
engine=OpenAIRealtime(), # or pipeline: stt=DeepgramSTT(), tts=ElevenLabsTTS()
system_prompt="You are the host for Acme Bistro. Caller: {customer_name}.",
first_message="Hi {customer_name}, thanks for calling Acme Bistro!",
variables={"customer_name": "Priya"}, # dynamic per-caller
tools=[book_table],
guardrails=["no_pii", "stay_in_scope"], # output guardrails
async def main():
# inbound: tunnel=True spawns a Cloudflare tunnel + points your number at it
await phone.serve(agent, tunnel=True, dashboard=True, recording=True)
# outbound instead:
# await phone.call(to="+15558675309", agent=agent, machine_detection=True)
asyncio.run(main())
# Or skip code entirely and test from a shell: patter dev real_agent.py
''').strip()
def main():
show_real_api()
demoA = run_call(
caller_lines=[
"Hi, I'd like to book a table",
"there'll be four of us",
"tomorrow",
"for dinner",
"put it under Priya",
"no that's all, thanks",
],
variables=CALL_VARIABLES,
print_transcript("Demo A — booking (tools + dynamic variables)", demoA)
print_dashboard(demoA)
demoB = run_call(
caller_lines=[
"what are your weekend hours?",
"actually can I speak to a human",
],
variables=CALL_VARIABLES,
barge_in_at=1,
print_transcript("Demo B — hours, barge-in & human transfer", demoB)
print_dashboard(demoB)
all_green = run_evals()
print("\n" + "=" * 74)
print("GRADUATE TO REAL CALLS (copy into a local file — not Colab)")
print("=" * 74)
print(REAL_DEPLOYMENT)
print("\n✅ tutorial finished" + (" • evals green" if all_green else " • evals RED"))
if __name__ == "__main__":
main()
We prepare a production-style deployment template that shows how the same tested logic can be moved out of Colab into a real phone-agent setup. We include the structure for using Patter with Twilio, OpenAI Realtime, registered tools, dynamic variables, guardrails, inbound serving, dashboard monitoring, recording, and outbound calling. We then run the full tutorial by showing the installed API, executing two demo calls, printing dashboards, running evaluations, and displaying the final real-call deployment code.
Conclusion
In conclusion, we built a complete Patter-style phone agent workflow that reflects the core structure of a production voice AI system. We created tools for checking availability, booking tables, looking up reservations, and transferring callers to humans, and then combined them with guardrails, scripted conversations, simulated latency, dashboards, and evaluation checks. We also saw how the same tested logic can later move from a self-contained Colab simulation to real phone calls through Twilio, OpenAI Realtime, tunneling, and Patter’s deployment interface. Also, we finished with a strong understanding of how we can prototype, test, monitor, and prepare a voice-agent application before connecting it to live telephony infrastructure.
Check out the Full Codes with Notebook here . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
Sana Hassan
+ posts Bio
Sana Hassan, a consulting intern at Marktechpost and dual-degree student at IIT Madras, is passionate about applying technology and AI to address real-world challenges. With a keen interest in solving practical problems, he brings a fresh perspective to the intersection of AI and real-life solutions.
Sana Hassan
Building a Gin Config Controlled PyTorch Pipeline with Configurable MLP Variants, Cosine Scheduling, and Runtime Parameter Overrides
Sana Hassan
Building a VideoAgent-Style Multi-Agent System: Intent Parsing, Graph Planning, and Tool Routing for Video Editing Tasks
Sana Hassan
A Coding Guide to NVIDIA’s Tile-Based GPU Programming: From cuTile and Triton Kernels to Flash Attention
Sana Hassan
How to Build a T4-Friendly Autonomous Data Science Agent with DeepAnalyze-8B, Sandboxed Code Execution, and Iterative Analysis

## extraction_diagnostics

- extraction_method: article
- readability_score: 83
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":83,"text_length":23906,"paragraph_count":360,"sentence_count":59,"boilerplate_hits":2,"symbol_ratio":0.0414,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=high
   Patter SDK 发布教程，演示如何构建一个餐厅预订场景的语音智能体工作流。该流程支持动态调用变量、注册可调用工具、应用输出护栏（如PII脱敏、脏话过滤、话题范围限制），并可在无需实时电话凭证的情况下运行脚本化通话模拟。教程还涵盖延迟与成本指标追踪、回归式评估检查，以及将智能体逻辑、工具调用、安全检查和通话模拟整合为单一结构化管线。

2. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we explore the Patter SDK by building a voice-agent workflow that simulates how an AI phone assistant behaves during real conversations.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   We work with a restaurant booking use case in which we define dynamic caller variables, register callable tools, apply output guardrails, simulate speech-to-text and text-to-speech behavior, and run a complete scripted call flow without requiring live telephony credentials.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   We also inspect the installed Patter API when available, create a deterministic agent brain, track modeled latency and cost metrics, and validate the system through regression-style evaluations.

5. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   Finally, we understand how the Patter SDK integrates agent logic, tool use, safety checks, call simulation, and real-world deployment patterns into a single structured voice-agent pipeline.

6. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Setting Up the Patter SDK, Tools, and Restaurant Backend Copy Code Copied Use a different Browser from __future__ import annotations import sys, subprocess, importlib, inspect, time, json, re, random, textwrap, os from dataclasses import dataclass, field from statistics import median def _try_install(pkg: str) -> None: try: subprocess.

## business_elements

- companies: MarkTechPost（RSS）, OpenAI
- products: Agents, agent, Agent
- people: 暂无公开信息
- industries: 法律 / 法务, 医疗, 制造 / 工业, 开发者工具
- roles: CIO / IT 负责人, 法务 / 律师
- workflows: 计费 / 预算管理, 权限 / 安全治理, 部署 / 集成交付
- business_actions: 发布 / 推出, 部署 / 上线, 融资 / 投资
- affected_departments: IT / 安全, 法务, 财务 / 预算
- numbers: 600, 74, 24, 8, 7, 6, 2, 4
- quotes: , pkg],
check=False, timeout=600)
except Exception:
pass
def _load_patter():
 / Return the real getpatter module if importable, else None. / 
for name in ( / getpatter / getpatter

## evidence_seed

- company_actions: We work with a restaurant booking use case in which we define dynamic caller variables, register callable tools, apply output guardrails, simulate speech-to-text and text-to-speech behavior, and run a complete scripted call flow without requiring live telephony credentials. / We also inspect the installed Patter API when available, create a deterministic agent brain, track modeled latency and cost metrics, and validate the system through regression-style evaluations.
- case_details: Finally, we understand how the Patter SDK integrates agent logic, tool use, safety checks, call simulation, and real-world deployment patterns into a single structured voice-agent pipeline.
- workflow_changes: Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we explore the Patter SDK by building a voice-agent workflow that simulates how an AI phone assistant behaves during real conversations. / Setting Up the Patter SDK, Tools, and Restaurant Backend Copy Code Copied Use a different Browser from __future__ import annotations import sys, subprocess, importlib, inspect, time, json, re, random, textwrap, os from dataclasses import dataclass, field from statistics import median def _try_install(pkg: str) -> None: try: subprocess.
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 法务 / 律师
- risks_or_constraints: Patter SDK 发布教程，演示如何构建一个餐厅预订场景的语音智能体工作流。该流程支持动态调用变量、注册可调用工具、应用输出护栏（如PII脱敏、脏话过滤、话题范围限制），并可在无需实时电话凭证的情况下运行脚本化通话模拟。教程还涵盖延迟与成本指标追踪、回归式评估检查，以及将智能体逻辑、工具调用、安全检查和通话模拟整合为单一结构化管线。

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
- discovery_record: {"discovery_title":"Patter SDK 教程：构建餐厅预订电话智能体，支持动态变量、护栏、延迟仪表盘与评估检查","discovery_summary":"Patter SDK 发布教程，演示如何构建一个餐厅预订场景的语音智能体工作流。该流程支持动态调用变量、注册可调用工具、应用输出护栏（如PII脱敏、脏话过滤、话题范围限制），并可在无需实时电话凭证的情况下运行脚本化通话模拟。教程还涵盖延迟与成本指标追踪、回归式评估检查，以及将智能体逻辑、工具调用、安全检查和通话模拟整合为单一结构化管线。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/16/patter-sdk-guide-to-building-a-restaurant-booking-phone-agent-with-dynamic-variables-guardrails-latency-dashboards-and-eval-checks","discovered_at":"2026-07-17T04:31:45.362Z","rank_on_page":319,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Patter SDK 发布教程，演示如何构建一个餐厅预订场景的语音智能体工作流。该流程支持动态调用变量、注册可调用工具、应用输出护栏（如PII脱敏、脏话过滤、话题范围限制），并可在无需实时电话凭证的情况下运行脚本化通话模拟。教程还涵盖延迟与成本指标追踪、回归式评估检查，以及将智能体逻辑、工具调用、安全检查和通话模拟整合为单一结构化管线。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
