---
schema_version: raw-evidence-v2
raw_id: R-100
title: "如何构建QwenPaw智能体工作区：自定义技能、模型提供商、控制台访问与流式API测试"
original_url: "https://www.marktechpost.com/2026/06/13/how-to-build-a-qwenpaw-agent-workspace-with-custom-skills-model-providers-console-access-and-streaming-api-testing"
canonical_url: "https://marktechpost.com/2026/06/13/how-to-build-a-qwenpaw-agent-workspace-with-custom-skills-model-providers-console-access-and-streaming-api-testing"
source_name: "MarkTechPost（RSS）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: false
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-06-13T17:27:22.000Z"
collected_at: 2026-06-14T04:27:51.554Z
language: mixed
full_text_hash: d2734d0773c299ff
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-14/r-100-如何构建qwenpaw智能体工作区-自定义技能-模型提供商-控制台访问与流式api测试.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-14/r-100-如何构建qwenpaw智能体工作区-自定义技能-模型提供商-控制台访问与流式api测试.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":60000,"paragraph_count":637,"sentence_count":77,"boilerplate_hits":2,"symbol_ratio":0.0137,"method":"article"}
has_full_text: true
content_length: 60000
fetch_error: ""
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["index_only_or_directory_page","discovery_or_feedback_source_boundary"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"d2734d0773c299ff","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"如何构建QwenPaw智能体工作区：自定义技能、模型提供商、控制台访问与流式API测试","discovery_summary":"该教程演示如何构建并测试QwenPaw智能体工作区。步骤包括：安装与初始化QwenPaw、配置工作目录、设置身份认证、通过Colab secrets连接可选模型提供商、创建包含自定义技能与本地知识文件的结构化工作区，以及启动控制台访问与流式API测试。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/06/13/how-to-build-a-qwenpaw-agent-workspace-with-custom-skills-model-providers-console-access-and-streaming-api-testing","discovered_at":"2026-06-14T04:21:16.523Z","rank_on_page":85,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 3dbe44d3f809660f
content_hash: 66141af6e7741f85
semantic_hash: 979908aac105b539
duplicate_of: ""
first_seen_at: "2026-06-13T17:27:22.000Z"
last_seen_at: 2026-06-14T04:27:51.554Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":true,"case":false,"change":false,"trend":false,"daily_observation":false,"heatmap":false,"briefing":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["MarkTechPost（RSS）","OpenAI","Google","GitHub","Meta"],"products":["Agents","agent","gemini","Gemini","agents","Agent"],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出","融资 / 投资"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["8088","18","8","0","4000","127.0","0.1","0.5"],"quotes":["QWENPAW_COLAB_PORT","))\nROOT = pathlib.Path(",")\nWORKING_DIR = ROOT / ","\nSECRET_DIR = ROOT / ","\nLOG_DIR = ROOT / "]}
evidence_seed: {"company_actions":["该教程演示如何构建并测试QwenPaw智能体工作区。步骤包括：安装与初始化QwenPaw、配置工作目录、设置身份认证、通过Colab secrets连接可选模型提供商、创建包含自定义技能与本地知识文件的结构化工作区，以及启动控制台访问与流式API测试。","We install and initialize QwenPaw, configure its working directory, set up authentication, connect optional model providers via Colab secrets, and create a structured workspace with custom skills and local knowledge files.","We also launch the QwenPaw Console via a Colab-accessible URL, expose it through an optional Cloudflare tunnel, and test the streaming chat API programmatically, enabling us to use QwenPaw both as an interactive assistant and as an API-driven agent framework."],"case_details":[],"workflow_changes":["Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we implement a QwenPaw workflow that provides a practical environment for building and testing an agent-powered assistant.","Copy Code Copied Use a different Browser import os import sys import json import time import uuid import shlex import signal import shutil import socket import secrets import pathlib import subprocess from datetime import datetime RESET_QWENPAW = False PORT = int(os."],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例"]
key_excerpts: [{"type":"company_action","text":"该教程演示如何构建并测试QwenPaw智能体工作区。步骤包括：安装与初始化QwenPaw、配置工作目录、设置身份认证、通过Colab secrets连接可选模型提供商、创建包含自定义技能与本地知识文件的结构化工作区，以及启动控制台访问与流式API测试。","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"workflow_change","text":"Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we implement a QwenPaw workflow that provides a practical environment for building and testing an agent-powered assistant.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"We install and initialize QwenPaw, configure its working directory, set up authentication, connect optional model providers via Colab secrets, and create a structured workspace with custom skills and local knowledge files.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"We also launch the QwenPaw Console via a Colab-accessible URL, expose it through an optional Cloudflare tunnel, and test the streaming chat API programmatically, enabling us to use QwenPaw both as an interactive assistant and as an API-driven agent framework.","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"workflow_change","text":"Copy Code Copied Use a different Browser import os import sys import json import time import uuid import shlex import signal import shutil import socket import secrets import pathlib import subprocess from datetime import datetime RESET_QWENPAW = False PORT = int(os.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"quote","text":"get(\"QWENPAW_COLAB_PORT\", \"8088\")) ROOT = pathlib.","supports":["daily_observation","heatmap","viewpoint"],"importance":"medium","confidence":"high"}]
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# 如何构建QwenPaw智能体工作区：自定义技能、模型提供商、控制台访问与流式API测试

## clean_text

Editors Pick
Agentic AI
AI Agents
Staff
Tutorials
In this tutorial, we implement a QwenPaw workflow that provides a practical environment for building and testing an agent-powered assistant. We install and initialize QwenPaw, configure its working directory, set up authentication, connect optional model providers via Colab secrets, and create a structured workspace with custom skills and local knowledge files. We also launch the QwenPaw Console via a Colab-accessible URL, expose it through an optional Cloudflare tunnel, and test the streaming chat API programmatically, enabling us to use QwenPaw both as an interactive assistant and as an API-driven agent framework.
Copy Code Copied Use a different Browser
import os
import sys
import json
import time
import uuid
import shlex
import signal
import shutil
import socket
import secrets
import pathlib
import subprocess
from datetime import datetime
RESET_QWENPAW = False
PORT = int(os.environ.get("QWENPAW_COLAB_PORT", "8088"))
ROOT = pathlib.Path("/content/qwenpaw_colab")
WORKING_DIR = ROOT / "working"
SECRET_DIR = ROOT / "secrets"
LOG_DIR = ROOT / "logs"
WORKSPACE_DIR = WORKING_DIR / "workspaces" / "default"
PID_FILE = ROOT / "qwenpaw_app.pid"
APP_LOG = LOG_DIR / "qwenpaw_app.log"
if RESET_QWENPAW and ROOT.exists():
shutil.rmtree(ROOT)
for p in [ROOT, WORKING_DIR, SECRET_DIR, LOG_DIR, WORKSPACE_DIR]:
p.mkdir(parents=True, exist_ok=True)
os.environ["QWENPAW_WORKING_DIR"] = str(WORKING_DIR)
os.environ["QWENPAW_SECRET_DIR"] = str(SECRET_DIR)
os.environ["QWENPAW_AUTH_ENABLED"] = "true"
os.environ["QWENPAW_AUTH_USERNAME"] = os.environ.get("QWENPAW_AUTH_USERNAME", "admin")
os.environ["QWENPAW_LOG_LEVEL"] = os.environ.get("QWENPAW_LOG_LEVEL", "info")
os.environ["QWENPAW_SKILL_SCAN_MODE"] = os.environ.get("QWENPAW_SKILL_SCAN_MODE", "warn")
os.environ["QWENPAW_TOOL_GUARD_ENABLED"] = os.environ.get("QWENPAW_TOOL_GUARD_ENABLED", "true")
password_file = SECRET_DIR / ".colab_ui_password"
if not password_file.exists():
password_file.write_text("qpw-" + secrets.token_urlsafe(18), encoding="utf-8")
os.environ["QWENPAW_AUTH_PASSWORD"] = password_file.read_text(encoding="utf-8").strip()
def run(cmd, check=False, env=None, cwd=None, stream=False):
if isinstance(cmd, str):
display_cmd = cmd
shell = True
else:
display_cmd = " ".join(shlex.quote(str(x)) for x in cmd)
shell = False
print(f"\n$ {display_cmd}")
if stream:
proc = subprocess.Popen(cmd, shell=shell, env=env, cwd=cwd, text=True)
rc = proc.wait()
if check and rc != 0:
raise RuntimeError(f"Command failed with exit code {rc}: {display_cmd}")
return rc, ""
out = subprocess.run(
cmd,
shell=shell,
env=env,
cwd=cwd,
text=True,
stdout=subprocess.PIPE,
stderr=subprocess.STDOUT,
print(out.stdout[-4000:])
if check and out.returncode != 0:
raise RuntimeError(f"Command failed with exit code {out.returncode}: {display_cmd}")
return out.returncode, out.stdout
def port_open(host="127.0.0.1", port=8088, timeout=0.5):
try:
with socket.create_connection((host, port), timeout=timeout):
return True
except OSError:
return False
def wait_for_port(port, seconds=90):
start = time.time()
while time.time() - start < seconds:
if port_open("127.0.0.1", port):
return True
time.sleep(1)
return False
def stop_previous_app():
if PID_FILE.exists():
try:
pid = int(PID_FILE.read_text().strip())
os.kill(pid, signal.SIGTERM)
time.sleep(2)
try:
os.kill(pid, 0)
os.kill(pid, signal.SIGKILL)
except OSError:
pass
except Exception:
pass
PID_FILE.unlink(missing_ok=True)
def qwenpaw_cmd(*args):
exe = shutil.which("qwenpaw")
if exe:
return [exe, *args]
return [sys.executable, "-m", "qwenpaw", *args]
def colab_secret_or_env(name):
value = os.environ.get(name, "")
try:
from google.colab import userdata
secret_value = userdata.get(name)
if secret_value:
value = secret_value
except Exception:
pass
return value or ""
print("Python:", sys.version)
assert sys.version_info >= (3, 10), "QwenPaw needs Python 3.10+."
pip_spec = os.environ.get("QWENPAW_PIP_SPEC", "qwenpaw")
run([sys.executable, "-m", "pip", "install", "-q", "-U", "pip", "setuptools", "wheel"], check=False)
run([sys.executable, "-m", "pip", "install", "-q", "-U", pip_spec, "requests"], check=True)
try:
import requests
except Exception:
run([sys.executable, "-m", "pip", "install", "-q", "-U", "requests"], check=True)
import requests
We start by importing all required Python modules and setting up the main directories for the QwenPaw Colab workspace. We configure environment variables for authentication, logging, working paths, and secure access to the QwenPaw Console. We also define helper functions to run shell commands, check ports, stop old app processes, and read API keys from Colab secrets or environment variables.
Copy Code Copied Use a different Browser
if not (WORKING_DIR / "config.json").exists():
run(qwenpaw_cmd("init", "--defaults"), check=False)
else:
print("QwenPaw working directory already initialized:", WORKING_DIR)
provider_candidates = [
"env": "OPENAI_API_KEY",
"provider_id": "openai",
"name": "OpenAI",
"base_url": "https://api.openai.com/v1",
"model": os.environ.get("QWENPAW_MODEL", "gpt-4o-mini"),
"chat_model": "OpenAIChatModel",
"prefix": "sk-",
},
"env": "OPENROUTER_API_KEY",
"provider_id": "openrouter",
"name": "OpenRouter",
"base_url": "https://openrouter.ai/api/v1",
"model": os.environ.get("QWENPAW_MODEL", "openai/gpt-4o-mini"),
"chat_model": "OpenAIChatModel",
"prefix": "sk-or-",
},
"env": "DASHSCOPE_API_KEY",
"provider_id": "dashscope",
"name": "DashScope",
"base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
"model": os.environ.get("QWENPAW_MODEL", "qwen-plus"),
"chat_model": "OpenAIChatModel",
"prefix": "sk-",
},
"env": "DEEPSEEK_API_KEY",
"provider_id": "deepseek",
"name": "DeepSeek",
"base_url": "https://api.deepseek.com",
"model": os.environ.get("QWENPAW_MODEL", "deepseek-chat"),
"chat_model": "OpenAIChatModel",
"prefix": "sk-",
},
"env": "GEMINI_API_KEY",
"provider_id": "gemini",
"name": "Google Gemini",
"base_url": "https://generativelanguage.googleapis.com",
"model": os.environ.get("QWENPAW_MODEL", "gemini-2.5-flash"),
"chat_model": "GeminiChatModel",
"prefix": "",
},
"env": "GOOGLE_API_KEY",
"provider_id": "gemini",
"name": "Google Gemini",
"base_url": "https://generativelanguage.googleapis.com",
"model": os.environ.get("QWENPAW_MODEL", "gemini-2.5-flash"),
"chat_model": "GeminiChatModel",
"prefix": "",
},
selected = None
for candidate in provider_candidates:
api_key = colab_secret_or_env(candidate["env"])
if api_key:
selected = {**candidate, "api_key": api_key}
break
def read_json(path, default):
try:
if path.exists():
return json.loads(path.read_text(encoding="utf-8"))
except Exception:
pass
return default
def write_json(path, data):
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
config_path = WORKING_DIR / "config.json"
config = read_json(config_path, {})
config.setdefault("agents", {})
config["agents"].setdefault("active_agent", "default")
config["agents"].setdefault("agent_order", ["default"])
config["agents"].setdefault("profiles", {})
config["agents"]["profiles"].setdefault("default", {})
config["agents"]["profiles"]["default"].update(
"id": "default",
"name": "Colab Research Assistant",
"description": "A QwenPaw agent configured for Google Colab tutorials, local files, custom skills, and API testing.",
"workspace_dir": str(WORKSPACE_DIR),
"enabled": True,
config["last_api"] = {"host": "127.0.0.1", "port": PORT}
config["show_tool_details"] = True
config["user_timezone"] = "Asia/Kolkata"
write_json(config_path, config)
We initialize the QwenPaw working directory and prepare the base configuration file for the default agent. We define multiple model-provider options, such as OpenAI, OpenRouter, DashScope, DeepSeek, and Gemini, so the setup can adapt to whichever API key we provide. We then update the QwenPaw configuration with the default agent profile, workspace path, API settings, and timezone.
Copy Code Copied Use a different Browser
agent_dir = WORKING_DIR / "agents" / "default"
agent_dir.mkdir(parents=True, exist_ok=True)
agent_path = agent_dir / "agent.json"
agent = read_json(agent_path, {})
agent.update(
"id": "default",
"name": "Colab Research Assistant",
"description": "Advanced QwenPaw tutorial agent for Colab: file-aware, skill-aware, API-testable, and guarded.",
"language": "en",
"workspace_dir": str(WORKSPACE_DIR),
"enabled": True,
"channels": {
"console": {
"enabled": True
},
"running": {
"max_iters": 30,
"llm_retry_enabled": True,
"stream_output": True
},
"security": {
"tool_guard": True,
"file_guard": True,
"skill_scanner": True,
"skill_scan_mode": "warn"
},
"tool_filter": {
"enabled": False,
"allow": [],
"deny": []
},
"memory": {
"enabled": True
if selected:
provider_dir = SECRET_DIR / "providers" / "builtin"
provider_dir.mkdir(parents=True, exist_ok=True)
provider_payload = {
"id": selected["provider_id"],
"name": selected["name"],
"base_url": selected["base_url"],
"api_key": selected["api_key"],
"chat_model": selected["chat_model"],
"models": [],
"extra_models": [
"id": selected["model"],
"name": selected["model"],
"supports_image": None,
"supports_video": None,
"supports_multimodal": None,
"is_free": False,
"max_tokens": int(os.environ.get("QWENPAW_MAX_TOKENS", "2048")),
"max_input_length": int(os.environ.get("QWENPAW_MAX_INPUT_LENGTH", "131072")),
"generate_kwargs": {
"temperature": float(os.environ.get("QWENPAW_TEMPERATURE", "0.2")),
"max_tokens": int(os.environ.get("QWENPAW_MAX_TOKENS", "2048")),
},
],
"api_key_prefix": selected["prefix"],
"is_local": False,
"freeze_url": True,
"require_api_key": True,
"is_custom": False,
"support_model_discovery": False,
"support_connection_check": False,
"generate_kwargs": {
"temperature": float(os.environ.get("QWENPAW_TEMPERATURE", "0.2")),
"max_tokens": int(os.environ.get("QWENPAW_MAX_TOKENS", "2048")),
},
"custom_headers": {},
"auth_mode": "api_key",
"meta": {},
write_json(provider_dir / f"{selected['provider_id']}.json", provider_payload)
write_json(
SECRET_DIR / "providers" / "active_model.json",
{"provider_id": selected["provider_id"], "model": selected["model"]},
agent["active_model"] = {"provider_id": selected["provider_id"], "model": selected["model"]}
print(f"Configured model provider: {selected['name']} / {selected['model']}")
else:
print(
"No model key found. The web app will still launch, but chat requires a configured model.\n"
"Add one Colab secret or environment variable such as OPENAI_API_KEY, OPENROUTER_API_KEY, "
"DASHSCOPE_API_KEY, DEEPSEEK_API_KEY, GEMINI_API_KEY, or GOOGLE_API_KEY, then rerun."
write_json(agent_path, agent)
We create the default QwenPaw agent configuration with console access, memory support, streaming output, and guarded tool execution. We automatically configure the selected model provider when a supported API key is available in Colab secrets or environment variables. We save the active model and agent settings so QwenPaw can use the configured provider during chat and API-based interactions.
Copy Code Copied Use a different Browser
skill_dir = WORKSPACE_DIR / "skills" / "research_brief"
skill_dir.mkdir(parents=True, exist_ok=True)
(skill_dir / "SKILL.md").write_text(
"""---
name: research_brief
description: Create rigorous research briefs from user questions, local notes, uploaded files, and available tools.
---
# Research Brief Skill
Use this skill when the user asks for research, product analysis, market mapping, technical due diligence, paper analysis, repo analysis, or a decision memo.
## Procedure
1. Restate the user's objective in one sentence.
2. Identify the most important entities, assumptions, and constraints.
3. Search available local workspace files first.
4. Use tools only when they are relevant and allowed.
5. Separate verified facts from inference.
6. Produce a compact brief with:
- answer
- evidence
- risks or caveats
- recommended next step
## Output Style
Prefer clear sections, short paragraphs, and explicit uncertainty.
Do not invent citations, file contents, commands, or results.
""",
encoding="utf-8",
demo_dir = WORKSPACE_DIR / "demo_knowledge"
demo_dir.mkdir(parents=True, exist_ok=True)
(demo_dir / "qwenpaw_colab_notes.md").write_text(
f"""# QwenPaw Colab Demo Notes
Created: {datetime.now().isoformat(timespec="seconds")}
This workspace is prepared by a Google Colab tutorial.
The tutorial demonstrates:
- QwenPaw installation and initialization
- provider auto-configuration from Colab secrets or environment variables
- authenticated Console launch
- custom workspace skill creation
- local workspace knowledge files
- streaming REST API calls
- optional public tunnel exposure
Recommended first prompt in the Console:
"Read my workspace notes and explain what this QwenPaw Colab setup can do. Then use the research_brief skill style to propose three advanced experiments."
""",
encoding="utf-8",
(WORKSPACE_DIR / "README_COLAB_TUTORIAL.md").write_text(
"""# QwenPaw Advanced Colab Workspace
This workspace is intentionally small but structured like a real assistant workspace.
Suggested experiments:
1. Ask QwenPaw to inspect the demo_knowledge folder.
2. Ask it to use the research_brief skill style.
3. Use the REST API client in this notebook for automated tests.
4. Add more SKILL.md folders under workspace/skills.
5. Add more notes, CSVs, markdown files, or task briefs under workspace folders.
""",
encoding="utf-8",
print("\nWorkspace prepared:")
print("Working dir:", WORKING_DIR)
print("Secret dir :", SECRET_DIR)
print("Workspace :", WORKSPACE_DIR)
print("Skill file :", skill_dir / "SKILL.md")
run(qwenpaw_cmd("daemon", "version"), check=False)
run(qwenpaw_cmd("models", "list"), check=False)
run(qwenpaw_cmd("skills", "list", "--agent-id", "default"), check=False)
We create a custom research_brief skill inside the QwenPaw workspace to guide the agent toward structured research outputs. We add demo knowledge files that explain the Colab setup and provide the agent with a local workspace context to inspect. We then print the prepared workspace paths and run QwenPaw commands to verify the daemon, available models, and registered skills.
Copy Code Copied Use a different Browser
stop_previous_app()
APP_LOG.parent.mkdir(parents=True, exist_ok=True)
log_fh = APP_LOG.open("w", encoding="utf-8")
app_proc = subprocess.Popen(
qwenpaw_cmd("app", "--host", "0.0.0.0", "--port", str(PORT), "--log-level", os.environ["QWENPAW_LOG_LEVEL"]),
stdout=log_fh,
stderr=subprocess.STDOUT,
env=os.environ.copy(),
PID_FILE.write_text(str(app_proc.pid), encoding="utf-8")
if not wait_for_port(PORT, seconds=120):
print("\nQwenPaw did not open the port. Last log lines:")
try:
print(APP_LOG.read_text(encoding="utf-8")[-6000:])
except Exception as e:
print("Could not read log:", e)
raise RuntimeError("QwenPaw app failed to start.")
print(f"\nQwenPaw app is running on http://127.0.0.1:{PORT}")
print("Username:", os.environ["QWENPAW_AUTH_USERNAME"])
print("Password:", os.environ["QWENPAW_AUTH_PASSWORD"])
print("App log:", APP_LOG)
try:
from google.colab import output
proxy_url = output.eval_js(f"google.colab.kernel.proxyPort({PORT})")
print("\nColab proxied Console URL:")
print(proxy_url)
try:
output.serve_kernel_port_as_window(PORT)
except Exception:
pass
except Exception as e:
print("\nNot running inside Google Colab proxy environment:", e)
def start_cloudflared_tunnel(port):
system_bin = pathlib.Path("/usr/local/bin/cloudflared")
local_bin = ROOT / "cloudflared"
cloudflared = system_bin if system_bin.exists() else local_bin
if not cloudflared.exists():
url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
target = str(system_bin)
rc, _ = run(f"wget -q {shlex.quote(url)} -O {shlex.quote(target)} && chmod +x {shlex.quote(target)}", check=False)
if rc != 0 or not system_bin.exists():
target = str(local_bin)
rc, _ = run(f"wget -q {shlex.quote(url)} -O {shlex.quote(target)} && chmod +x {shlex.quote(target)}", check=False)
cloudflared = pathlib.Path(target)
if not cloudflared.exists():
print("cloudflared tunnel unavailable. Use the Colab proxy URL above.")
return None, None
tunnel_log = LOG_DIR / "cloudflared.log"
fh = tunnel_log.open("w", encoding="utf-8")
proc = subprocess.Popen(
[str(cloudflared), "tunnel", "--url", f"http://127.0.0.1:{port}", "--no-autoupdate"],
stdout=fh,
stderr=subprocess.STDOUT,
text=True,
public_url = None
start = time.time()
while time.time() - start < 45:
time.sleep(1)
try:
text = tunnel_log.read_text(encoding="utf-8", errors="ignore")
except Exception:
text = ""
for token in text.replace("|", " ").split():
if token.startswith("https://") and "trycloudflare.com" in token:
public_url = token.strip()
break
if public_url:
break
if public_url:
print("\nTemporary public tunnel URL:")
print(public_url)
print("Use the same username/password printed above.")
else:
print("\nCloudflare tunnel started but no URL was detected yet.")
print("Tunnel log:", tunnel_log)
return proc, public_url
ENABLE_CLOUDFLARE_TUNNEL = os.environ.get("ENABLE_QWENPAW_TUNNEL", "1") == "1"
cloudflared_proc, public_url = (None, None)
if ENABLE_CLOUDFLARE_TUNNEL:
cloudflared_proc, public_url = start_cloudflared_tunnel(PORT)
We stop any previous QwenPaw app process and launch a fresh QwenPaw Console server on the configured Colab port. We wait until the server becomes available, then print the login credentials, the local URL, the log path, and the Colab proxy URL. We also optionally start a Cloudflare tunnel so the QwenPaw Console can be accessed through a temporary public link.
Copy Code Copied Use a different Browser
def qwenpaw_chat(message, session_id=None, user_id="colab-user", agent_id="default", timeout=180):
session_id = session_id or f"colab-{uuid.uuid4().hex[:10]}"
url = f"http://127.0.0.1:{PORT}/api/console/chat"
headers = {
"Content-Type": "application/json",
"X-Agent-Id": agent_id,
payload = {
"message": message,
"session_id": session_id,
"user_id": user_id,
print("\nAPI request:")
print(json.dumps({**payload, "mess

## full_text

Editors Pick
Agentic AI
AI Agents
Staff
Tutorials
In this tutorial, we implement a QwenPaw workflow that provides a practical environment for building and testing an agent-powered assistant. We install and initialize QwenPaw, configure its working directory, set up authentication, connect optional model providers via Colab secrets, and create a structured workspace with custom skills and local knowledge files. We also launch the QwenPaw Console via a Colab-accessible URL, expose it through an optional Cloudflare tunnel, and test the streaming chat API programmatically, enabling us to use QwenPaw both as an interactive assistant and as an API-driven agent framework.
Copy Code Copied Use a different Browser
import os
import sys
import json
import time
import uuid
import shlex
import signal
import shutil
import socket
import secrets
import pathlib
import subprocess
from datetime import datetime
RESET_QWENPAW = False
PORT = int(os.environ.get("QWENPAW_COLAB_PORT", "8088"))
ROOT = pathlib.Path("/content/qwenpaw_colab")
WORKING_DIR = ROOT / "working"
SECRET_DIR = ROOT / "secrets"
LOG_DIR = ROOT / "logs"
WORKSPACE_DIR = WORKING_DIR / "workspaces" / "default"
PID_FILE = ROOT / "qwenpaw_app.pid"
APP_LOG = LOG_DIR / "qwenpaw_app.log"
if RESET_QWENPAW and ROOT.exists():
shutil.rmtree(ROOT)
for p in [ROOT, WORKING_DIR, SECRET_DIR, LOG_DIR, WORKSPACE_DIR]:
p.mkdir(parents=True, exist_ok=True)
os.environ["QWENPAW_WORKING_DIR"] = str(WORKING_DIR)
os.environ["QWENPAW_SECRET_DIR"] = str(SECRET_DIR)
os.environ["QWENPAW_AUTH_ENABLED"] = "true"
os.environ["QWENPAW_AUTH_USERNAME"] = os.environ.get("QWENPAW_AUTH_USERNAME", "admin")
os.environ["QWENPAW_LOG_LEVEL"] = os.environ.get("QWENPAW_LOG_LEVEL", "info")
os.environ["QWENPAW_SKILL_SCAN_MODE"] = os.environ.get("QWENPAW_SKILL_SCAN_MODE", "warn")
os.environ["QWENPAW_TOOL_GUARD_ENABLED"] = os.environ.get("QWENPAW_TOOL_GUARD_ENABLED", "true")
password_file = SECRET_DIR / ".colab_ui_password"
if not password_file.exists():
password_file.write_text("qpw-" + secrets.token_urlsafe(18), encoding="utf-8")
os.environ["QWENPAW_AUTH_PASSWORD"] = password_file.read_text(encoding="utf-8").strip()
def run(cmd, check=False, env=None, cwd=None, stream=False):
if isinstance(cmd, str):
display_cmd = cmd
shell = True
else:
display_cmd = " ".join(shlex.quote(str(x)) for x in cmd)
shell = False
print(f"\n$ {display_cmd}")
if stream:
proc = subprocess.Popen(cmd, shell=shell, env=env, cwd=cwd, text=True)
rc = proc.wait()
if check and rc != 0:
raise RuntimeError(f"Command failed with exit code {rc}: {display_cmd}")
return rc, ""
out = subprocess.run(
cmd,
shell=shell,
env=env,
cwd=cwd,
text=True,
stdout=subprocess.PIPE,
stderr=subprocess.STDOUT,
print(out.stdout[-4000:])
if check and out.returncode != 0:
raise RuntimeError(f"Command failed with exit code {out.returncode}: {display_cmd}")
return out.returncode, out.stdout
def port_open(host="127.0.0.1", port=8088, timeout=0.5):
try:
with socket.create_connection((host, port), timeout=timeout):
return True
except OSError:
return False
def wait_for_port(port, seconds=90):
start = time.time()
while time.time() - start < seconds:
if port_open("127.0.0.1", port):
return True
time.sleep(1)
return False
def stop_previous_app():
if PID_FILE.exists():
try:
pid = int(PID_FILE.read_text().strip())
os.kill(pid, signal.SIGTERM)
time.sleep(2)
try:
os.kill(pid, 0)
os.kill(pid, signal.SIGKILL)
except OSError:
pass
except Exception:
pass
PID_FILE.unlink(missing_ok=True)
def qwenpaw_cmd(*args):
exe = shutil.which("qwenpaw")
if exe:
return [exe, *args]
return [sys.executable, "-m", "qwenpaw", *args]
def colab_secret_or_env(name):
value = os.environ.get(name, "")
try:
from google.colab import userdata
secret_value = userdata.get(name)
if secret_value:
value = secret_value
except Exception:
pass
return value or ""
print("Python:", sys.version)
assert sys.version_info >= (3, 10), "QwenPaw needs Python 3.10+."
pip_spec = os.environ.get("QWENPAW_PIP_SPEC", "qwenpaw")
run([sys.executable, "-m", "pip", "install", "-q", "-U", "pip", "setuptools", "wheel"], check=False)
run([sys.executable, "-m", "pip", "install", "-q", "-U", pip_spec, "requests"], check=True)
try:
import requests
except Exception:
run([sys.executable, "-m", "pip", "install", "-q", "-U", "requests"], check=True)
import requests
We start by importing all required Python modules and setting up the main directories for the QwenPaw Colab workspace. We configure environment variables for authentication, logging, working paths, and secure access to the QwenPaw Console. We also define helper functions to run shell commands, check ports, stop old app processes, and read API keys from Colab secrets or environment variables.
Copy Code Copied Use a different Browser
if not (WORKING_DIR / "config.json").exists():
run(qwenpaw_cmd("init", "--defaults"), check=False)
else:
print("QwenPaw working directory already initialized:", WORKING_DIR)
provider_candidates = [
"env": "OPENAI_API_KEY",
"provider_id": "openai",
"name": "OpenAI",
"base_url": "https://api.openai.com/v1",
"model": os.environ.get("QWENPAW_MODEL", "gpt-4o-mini"),
"chat_model": "OpenAIChatModel",
"prefix": "sk-",
},
"env": "OPENROUTER_API_KEY",
"provider_id": "openrouter",
"name": "OpenRouter",
"base_url": "https://openrouter.ai/api/v1",
"model": os.environ.get("QWENPAW_MODEL", "openai/gpt-4o-mini"),
"chat_model": "OpenAIChatModel",
"prefix": "sk-or-",
},
"env": "DASHSCOPE_API_KEY",
"provider_id": "dashscope",
"name": "DashScope",
"base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
"model": os.environ.get("QWENPAW_MODEL", "qwen-plus"),
"chat_model": "OpenAIChatModel",
"prefix": "sk-",
},
"env": "DEEPSEEK_API_KEY",
"provider_id": "deepseek",
"name": "DeepSeek",
"base_url": "https://api.deepseek.com",
"model": os.environ.get("QWENPAW_MODEL", "deepseek-chat"),
"chat_model": "OpenAIChatModel",
"prefix": "sk-",
},
"env": "GEMINI_API_KEY",
"provider_id": "gemini",
"name": "Google Gemini",
"base_url": "https://generativelanguage.googleapis.com",
"model": os.environ.get("QWENPAW_MODEL", "gemini-2.5-flash"),
"chat_model": "GeminiChatModel",
"prefix": "",
},
"env": "GOOGLE_API_KEY",
"provider_id": "gemini",
"name": "Google Gemini",
"base_url": "https://generativelanguage.googleapis.com",
"model": os.environ.get("QWENPAW_MODEL", "gemini-2.5-flash"),
"chat_model": "GeminiChatModel",
"prefix": "",
},
selected = None
for candidate in provider_candidates:
api_key = colab_secret_or_env(candidate["env"])
if api_key:
selected = {**candidate, "api_key": api_key}
break
def read_json(path, default):
try:
if path.exists():
return json.loads(path.read_text(encoding="utf-8"))
except Exception:
pass
return default
def write_json(path, data):
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
config_path = WORKING_DIR / "config.json"
config = read_json(config_path, {})
config.setdefault("agents", {})
config["agents"].setdefault("active_agent", "default")
config["agents"].setdefault("agent_order", ["default"])
config["agents"].setdefault("profiles", {})
config["agents"]["profiles"].setdefault("default", {})
config["agents"]["profiles"]["default"].update(
"id": "default",
"name": "Colab Research Assistant",
"description": "A QwenPaw agent configured for Google Colab tutorials, local files, custom skills, and API testing.",
"workspace_dir": str(WORKSPACE_DIR),
"enabled": True,
config["last_api"] = {"host": "127.0.0.1", "port": PORT}
config["show_tool_details"] = True
config["user_timezone"] = "Asia/Kolkata"
write_json(config_path, config)
We initialize the QwenPaw working directory and prepare the base configuration file for the default agent. We define multiple model-provider options, such as OpenAI, OpenRouter, DashScope, DeepSeek, and Gemini, so the setup can adapt to whichever API key we provide. We then update the QwenPaw configuration with the default agent profile, workspace path, API settings, and timezone.
Copy Code Copied Use a different Browser
agent_dir = WORKING_DIR / "agents" / "default"
agent_dir.mkdir(parents=True, exist_ok=True)
agent_path = agent_dir / "agent.json"
agent = read_json(agent_path, {})
agent.update(
"id": "default",
"name": "Colab Research Assistant",
"description": "Advanced QwenPaw tutorial agent for Colab: file-aware, skill-aware, API-testable, and guarded.",
"language": "en",
"workspace_dir": str(WORKSPACE_DIR),
"enabled": True,
"channels": {
"console": {
"enabled": True
},
"running": {
"max_iters": 30,
"llm_retry_enabled": True,
"stream_output": True
},
"security": {
"tool_guard": True,
"file_guard": True,
"skill_scanner": True,
"skill_scan_mode": "warn"
},
"tool_filter": {
"enabled": False,
"allow": [],
"deny": []
},
"memory": {
"enabled": True
if selected:
provider_dir = SECRET_DIR / "providers" / "builtin"
provider_dir.mkdir(parents=True, exist_ok=True)
provider_payload = {
"id": selected["provider_id"],
"name": selected["name"],
"base_url": selected["base_url"],
"api_key": selected["api_key"],
"chat_model": selected["chat_model"],
"models": [],
"extra_models": [
"id": selected["model"],
"name": selected["model"],
"supports_image": None,
"supports_video": None,
"supports_multimodal": None,
"is_free": False,
"max_tokens": int(os.environ.get("QWENPAW_MAX_TOKENS", "2048")),
"max_input_length": int(os.environ.get("QWENPAW_MAX_INPUT_LENGTH", "131072")),
"generate_kwargs": {
"temperature": float(os.environ.get("QWENPAW_TEMPERATURE", "0.2")),
"max_tokens": int(os.environ.get("QWENPAW_MAX_TOKENS", "2048")),
},
],
"api_key_prefix": selected["prefix"],
"is_local": False,
"freeze_url": True,
"require_api_key": True,
"is_custom": False,
"support_model_discovery": False,
"support_connection_check": False,
"generate_kwargs": {
"temperature": float(os.environ.get("QWENPAW_TEMPERATURE", "0.2")),
"max_tokens": int(os.environ.get("QWENPAW_MAX_TOKENS", "2048")),
},
"custom_headers": {},
"auth_mode": "api_key",
"meta": {},
write_json(provider_dir / f"{selected['provider_id']}.json", provider_payload)
write_json(
SECRET_DIR / "providers" / "active_model.json",
{"provider_id": selected["provider_id"], "model": selected["model"]},
agent["active_model"] = {"provider_id": selected["provider_id"], "model": selected["model"]}
print(f"Configured model provider: {selected['name']} / {selected['model']}")
else:
print(
"No model key found. The web app will still launch, but chat requires a configured model.\n"
"Add one Colab secret or environment variable such as OPENAI_API_KEY, OPENROUTER_API_KEY, "
"DASHSCOPE_API_KEY, DEEPSEEK_API_KEY, GEMINI_API_KEY, or GOOGLE_API_KEY, then rerun."
write_json(agent_path, agent)
We create the default QwenPaw agent configuration with console access, memory support, streaming output, and guarded tool execution. We automatically configure the selected model provider when a supported API key is available in Colab secrets or environment variables. We save the active model and agent settings so QwenPaw can use the configured provider during chat and API-based interactions.
Copy Code Copied Use a different Browser
skill_dir = WORKSPACE_DIR / "skills" / "research_brief"
skill_dir.mkdir(parents=True, exist_ok=True)
(skill_dir / "SKILL.md").write_text(
"""---
name: research_brief
description: Create rigorous research briefs from user questions, local notes, uploaded files, and available tools.
---
# Research Brief Skill
Use this skill when the user asks for research, product analysis, market mapping, technical due diligence, paper analysis, repo analysis, or a decision memo.
## Procedure
1. Restate the user's objective in one sentence.
2. Identify the most important entities, assumptions, and constraints.
3. Search available local workspace files first.
4. Use tools only when they are relevant and allowed.
5. Separate verified facts from inference.
6. Produce a compact brief with:
- answer
- evidence
- risks or caveats
- recommended next step
## Output Style
Prefer clear sections, short paragraphs, and explicit uncertainty.
Do not invent citations, file contents, commands, or results.
""",
encoding="utf-8",
demo_dir = WORKSPACE_DIR / "demo_knowledge"
demo_dir.mkdir(parents=True, exist_ok=True)
(demo_dir / "qwenpaw_colab_notes.md").write_text(
f"""# QwenPaw Colab Demo Notes
Created: {datetime.now().isoformat(timespec="seconds")}
This workspace is prepared by a Google Colab tutorial.
The tutorial demonstrates:
- QwenPaw installation and initialization
- provider auto-configuration from Colab secrets or environment variables
- authenticated Console launch
- custom workspace skill creation
- local workspace knowledge files
- streaming REST API calls
- optional public tunnel exposure
Recommended first prompt in the Console:
"Read my workspace notes and explain what this QwenPaw Colab setup can do. Then use the research_brief skill style to propose three advanced experiments."
""",
encoding="utf-8",
(WORKSPACE_DIR / "README_COLAB_TUTORIAL.md").write_text(
"""# QwenPaw Advanced Colab Workspace
This workspace is intentionally small but structured like a real assistant workspace.
Suggested experiments:
1. Ask QwenPaw to inspect the demo_knowledge folder.
2. Ask it to use the research_brief skill style.
3. Use the REST API client in this notebook for automated tests.
4. Add more SKILL.md folders under workspace/skills.
5. Add more notes, CSVs, markdown files, or task briefs under workspace folders.
""",
encoding="utf-8",
print("\nWorkspace prepared:")
print("Working dir:", WORKING_DIR)
print("Secret dir :", SECRET_DIR)
print("Workspace :", WORKSPACE_DIR)
print("Skill file :", skill_dir / "SKILL.md")
run(qwenpaw_cmd("daemon", "version"), check=False)
run(qwenpaw_cmd("models", "list"), check=False)
run(qwenpaw_cmd("skills", "list", "--agent-id", "default"), check=False)
We create a custom research_brief skill inside the QwenPaw workspace to guide the agent toward structured research outputs. We add demo knowledge files that explain the Colab setup and provide the agent with a local workspace context to inspect. We then print the prepared workspace paths and run QwenPaw commands to verify the daemon, available models, and registered skills.
Copy Code Copied Use a different Browser
stop_previous_app()
APP_LOG.parent.mkdir(parents=True, exist_ok=True)
log_fh = APP_LOG.open("w", encoding="utf-8")
app_proc = subprocess.Popen(
qwenpaw_cmd("app", "--host", "0.0.0.0", "--port", str(PORT), "--log-level", os.environ["QWENPAW_LOG_LEVEL"]),
stdout=log_fh,
stderr=subprocess.STDOUT,
env=os.environ.copy(),
PID_FILE.write_text(str(app_proc.pid), encoding="utf-8")
if not wait_for_port(PORT, seconds=120):
print("\nQwenPaw did not open the port. Last log lines:")
try:
print(APP_LOG.read_text(encoding="utf-8")[-6000:])
except Exception as e:
print("Could not read log:", e)
raise RuntimeError("QwenPaw app failed to start.")
print(f"\nQwenPaw app is running on http://127.0.0.1:{PORT}")
print("Username:", os.environ["QWENPAW_AUTH_USERNAME"])
print("Password:", os.environ["QWENPAW_AUTH_PASSWORD"])
print("App log:", APP_LOG)
try:
from google.colab import output
proxy_url = output.eval_js(f"google.colab.kernel.proxyPort({PORT})")
print("\nColab proxied Console URL:")
print(proxy_url)
try:
output.serve_kernel_port_as_window(PORT)
except Exception:
pass
except Exception as e:
print("\nNot running inside Google Colab proxy environment:", e)
def start_cloudflared_tunnel(port):
system_bin = pathlib.Path("/usr/local/bin/cloudflared")
local_bin = ROOT / "cloudflared"
cloudflared = system_bin if system_bin.exists() else local_bin
if not cloudflared.exists():
url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
target = str(system_bin)
rc, _ = run(f"wget -q {shlex.quote(url)} -O {shlex.quote(target)} && chmod +x {shlex.quote(target)}", check=False)
if rc != 0 or not system_bin.exists():
target = str(local_bin)
rc, _ = run(f"wget -q {shlex.quote(url)} -O {shlex.quote(target)} && chmod +x {shlex.quote(target)}", check=False)
cloudflared = pathlib.Path(target)
if not cloudflared.exists():
print("cloudflared tunnel unavailable. Use the Colab proxy URL above.")
return None, None
tunnel_log = LOG_DIR / "cloudflared.log"
fh = tunnel_log.open("w", encoding="utf-8")
proc = subprocess.Popen(
[str(cloudflared), "tunnel", "--url", f"http://127.0.0.1:{port}", "--no-autoupdate"],
stdout=fh,
stderr=subprocess.STDOUT,
text=True,
public_url = None
start = time.time()
while time.time() - start < 45:
time.sleep(1)
try:
text = tunnel_log.read_text(encoding="utf-8", errors="ignore")
except Exception:
text = ""
for token in text.replace("|", " ").split():
if token.startswith("https://") and "trycloudflare.com" in token:
public_url = token.strip()
break
if public_url:
break
if public_url:
print("\nTemporary public tunnel URL:")
print(public_url)
print("Use the same username/password printed above.")
else:
print("\nCloudflare tunnel started but no URL was detected yet.")
print("Tunnel log:", tunnel_log)
return proc, public_url
ENABLE_CLOUDFLARE_TUNNEL = os.environ.get("ENABLE_QWENPAW_TUNNEL", "1") == "1"
cloudflared_proc, public_url = (None, None)
if ENABLE_CLOUDFLARE_TUNNEL:
cloudflared_proc, public_url = start_cloudflared_tunnel(PORT)
We stop any previous QwenPaw app process and launch a fresh QwenPaw Console server on the configured Colab port. We wait until the server becomes available, then print the login credentials, the local URL, the log path, and the Colab proxy URL. We also optionally start a Cloudflare tunnel so the QwenPaw Console can be accessed through a temporary public link.
Copy Code Copied Use a different Browser
def qwenpaw_chat(message, session_id=None, user_id="colab-user", agent_id="default", timeout=180):
session_id = session_id or f"colab-{uuid.uuid4().hex[:10]}"
url = f"http://127.0.0.1:{PORT}/api/console/chat"
headers = {
"Content-Type": "application/json",
"X-Agent-Id": agent_id,
payload = {
"message": message,
"session_id": session_id,
"user_id": user_id,
print("\nAPI request:")
print(json.dumps({**payload, "message": message[:300]}, indent=2))
with requests.post(url, headers=headers, json=payload, stream=True, timeout=timeout) as response:
print("HTTP status:", response.status_code)
if response.status_code >= 400:
print(response.text[:4000])
response.raise_for_status()
last_text = ""
final_text = ""
raw_events_seen = 0
for raw in response.iter_lines(decode_unicode=True):
if not raw:
continue
if raw.startswith("data:"):
raw_events_seen += 1
data = raw[len("data:"):].strip()
if data == "[DONE]":
break
try:
event = json.loads(data)
except Exception:
continue
candidate_texts = []
def walk(x):
if isinstance(x, dict):
for key, value in x.items():
if key in {"text", "content", "message", "delta"} and isinstance(value, str):
candidate_texts.append(value)
else:
walk(value)
elif isinstance(x, list):
for item in x:
walk(item)
walk(event)
if candidate_texts:
text = candidate_texts[-1]
if text and len(text) >= len(final_text):
final_text = text
if text.startswith(last_text):
print(text[len(last_text):], end="", flush=True)
else:
print("\n" + text, end="", flush=True)
last_text = text
print("\n\nStreaming events seen:", raw_events_seen)
return {"session_id": session_id, "text": final_text}
if selected:
try:
result = qwenpaw_chat(
"Read the local workspace notes if available. Then explain this Colab QwenPaw setup in five bullets and suggest two advanced experiments.",
session_id="qwenpaw-colab-demo",
print("\nFinal session_id:", result["session_id"])
except Exception as e:
print("\nAPI demo failed. The Console may still work; inspect the app log below.")
print("Error:", repr(e))
try:
print(APP_LOG.read_text(encoding="utf-8")[-8000:])
except Exception:
pass
else:
print(
"\nSkipping API chat demo because no model provider key was found.\n"
"Open the Console URL above, or add a Colab secret such as OPENAI_API_KEY / OPENROUTER_API_KEY / DASHSCOPE_API_KEY / DEEPSEEK_API_KEY / GEMINI_API_KEY and rerun."
print("\nSummary")
print("Console username:", os.environ["QWENPAW_AUTH_USERNAME"])
print("Console password:", os.environ["QWENPAW_AUTH_PASSWORD"])
print("Local URL:", f"http://127.0.0.1:{PORT}")
if public_url:
print("Public tunnel:", public_url)
print("Workspace:", WORKSPACE_DIR)
print("Logs:", APP_LOG)
print("\nTo stop the server manually, run:")
print(f"import os, signal; os.kill({app_proc.pid}, signal.SIGTERM)")
We define a streaming API client that sends messages to QwenPaw through the /api/console/chat endpoint. We test the configured agent by asking it to read the local workspace notes and summarize the Colab setup, including advanced experimental ideas. We finish by printing the final access details, workspace path, log location, tunnel URL if available, and a command to stop the running server.
In conclusion, we have a complete Colab-ready QwenPaw setup that goes beyond basic installation and demonstrates how we can configure, extend, launch, and test an agent workspace in a reproducible way. We created a secure, authenticated assistant environment, added a custom research skill, prepared local workspace knowledge, and verified the system through both the web Console and REST API calls. It provides us a strong foundation for experimenting with QwenPaw as a local-first agent platform for research workflows, file-aware assistants, custom skills, and advanced automation-style agent applications.
Check out the Full Codes with Notebook here . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
Sana Hassan
+ posts Bio
Sana Hassan, a consulting intern at Marktechpost and dual-degree student at IIT Madras, is passionate about applying technology and AI to address real-world challenges. With a keen interest in solving practical problems, he brings a fresh perspective to the intersection of AI and real-life solutions.
Sana Hassan
A Coding Implementation on Spatial Graph Neural Networks for Urban Function Inference Using city2graph, OSMnx, and PyTorch Geometric
Sana Hassan
A Coding Implementation on MONAI for End-to-End 3D Spleen Segmentation Using UNet on Medical CT Volumes
Sana Hassan
A Coding Implementation on Microsoft SkillOpt for Instrumented Prompt Optimization, Skill Evolution Analysis, and Baseline Comparison
Sana Hassan
Building a Code Dataset Pipeline from NVIDIA Nemotron-Pretraining-Code-v3 Metadata with Streaming, Pandas, and tiktoken
Sana Hassan
NVIDIA cuTile Python Tutorial: Building Tiled GPU Kernels for Vector Addition, Matrix Addition, and Matrix Multiplication in Colab
Sana Hassan
ClawHub Security Signals: A Coding Guide to End-to-End Security Signal Analysis and Verdict Classification on the AI Skills Dataset
Sana Hassan
Building Reflective Prompt Optimization with GEPA: Multi-Component Prompts, Structured Feedback, and Held-Out Validation
Sana Hassan
NVIDIA garak Tutorial: Build a Complete Defensive LLM Red-Teaming Workflow with Custom Probes and Detectors
Sana Hassan
A Hands-On Coding Tutorial on Qualcomm AI Hub Models for Classification, Object Detection, and Hardware-Aware Deployment
Sana Hassan
Microsoft Fara Tutorial: Run a Browser-Use Agent in Google Colab with a Mock OpenAI-Compatible Endpoint
Sana Hassan
Building a Semantic Search Engine and Open-Status Classifier over the ResearchMath-14k Dataset
Sana Hassan
How to Build a Document Intelligence Backend with iii Using Workers, Functions, and Cron Triggers
Sana Hassan
How to Fine-Tune LFM2 Using QLoRA and DPO: A Complete Step-by-Step Coding Tutorial on Google Colab
Sana Hassan
How to Speed Up Transformer Training Using NVIDIA Apex (FusedAdam, FusedLayerNorm) and Native torch.amp
Sana Hassan
An Implementation of the Microsoft Agent Governance Toolkit for Safe AI Agent Tool Use with Policies, Approvals, Audit Logs, and Risk Controls
Sana Hassan
A Coding Implementation on Loguru for Designing Robust, Structured, Concurrent, and Production-Ready Python Logging Pipelines
Sana Hassan
Build Skill-Augmented AI Agents with SkillNet for Search, Evaluation, Graph Analysis, and Task Planning
Sana Hassan
How to Use AgentTrove: Streaming 1.7M Agentic Traces and Building a Clean ShareGPT SFT Dataset in Python
Sana Hassan
How to Design an End-to-End Ansible Automation Lab with Playbooks, Inventories, Roles, Vault, Dynamic Inventory, and Custom Modules
Sana Hassan
A Coding Guide to Implement a pgvector-Powered Semantic, Hybrid, Sparse, and Quantized Vector Search System
Sana Hassan
Design a High-Precision Retrieve-and-Rerank Pipeline with ZeroEntropy Zerank-2 Reranker
Sana Hassan
Design a Complete Multimodal RLVR Pipeline with Open-MM-RL, Vision-Language Prompting, Reward Scoring, and GRPO Export
Sana Hassan
Step by Step Guide to Build and Compare FedAvg and FedProx Federated Learning on Non-IID CIFAR-10 with NVIDIA FLARE
Sana Hassan
Build a Complete Langfuse Observability and Evaluation Pipeline for Tracing, Prompt Management, Scoring, and Experiments
Sana Hassan
Build a SuperClaude Framework Workflow with Commands, Agents, Modes, and Session Memory
Sana Hassan
Build Recurrent-Depth Transformers with OpenMythos for MLA, GQA, Sparse MoE, and Loop-Scaled Reasoning
Sana Hassan
How to Build Knowledge Graph Generation Pipelines From Text With kg-gen, NetworkX Analytics, and Interactive Visualizations
Sana Hassan
How to Build an Advanced Agentic AI System with Planning, Tool Calling, Memory, and Self-Critique Using OpenAI API
Sana Hassan
A Coding Implementation to Compress and Benchmark Instruction-Tuned LLMs with FP8, GPTQ, and SmoothQuant Quantization using llmcompressor
Sana Hassan
A Coding Guide Implementing SHAP Explainability Workflows with Explainer Comparisons, Maskers, Interactions, Drift, and Black-Box Models
Sana Hassan
How to Build Repository-Level Code Intelligence with Repowise Using Graph Analysis, Dead-Code Detection, Decisions, and AI Context
Sana Hassan
How to Build an MCP Style Routed AI Agent System with Dynamic Tool Exposure Planning, Execution, and Context Injection
Sana Hassan
How to Build a Django-Unfold Admin Dashboard with Custom Models, Filters, Actions, and KPIs
Sana Hassan
A Coding Implementation to Master GPU Computing with CuPy, Custom CUDA Kernels, Streams, Sparse Matrices, and Profiling
Sana Hassan
How to Build a Dynamic Zero-Trust Network Simulation with Graph-Based Micro-Segmentation, Adaptive Policy Engine, and Insider Threat Detection
Sana Hassan
Build a Hybrid-Memory Autonomous Agent with Modular Architecture and Tool Dispatch Using OpenAI
Sana Hassan
A Coding Implementation to Portfolio Optimization with skfolio for Building Testing, Tuning, and Comparing Modern Investment Strategies
Sana Hassan
How to Build Technical Analysis and Backtesting Workflow with pandas-ta-classic, Strategy Signals, and Performance Metrics
Sana Hassan
A Coding Implementation to Build Agent-Native Memory Infrastructure with Memori for Persistent Multi-User and Multi-Session LLM Applications
Sana Hassan
How to Build a Cost-Aware LLM Routing System with NadirClaw Using Local Prompt Classification and Gemini Model Switching
Sana Hassan
A Coding Implementation to Recover Hidden Malware IOCs with FLARE-FLOSS Beyond Classic Strings Analysis
Sana Hassan
How to Build a Single-Cell RNA-seq Analysis Pipeline with Scanpy for PBMC Clustering, Annotation, and Trajectory Discovery
Sana Hassan
Build a CloakBrowser Automation Workflow with Stealth Chromium, Persistent Profiles, and Browser Signal Inspection
Sana Hassan
How to Build a Fully Interactive Multi-Page NiceGUI Application with Real-Time Dashboard, CRUD Operations, File Upload, and Async Chat
Sana Hassan
Build a Modular Skill-Based Agent System for LLMs with Dynamic Tool Routing in Python
Sana Hassan
A Coding Guide to Survey Bias Correction Using Facebook Research Balance with IPW CBPS Ranking and Post Stratification Methods
Sana Hassan
How to Build an End-to-End Production Grade Machine Learning Pipeline with ZenML, Including Custom Materializers, Metadata Tracking, and Hyperparameter Optimization
Sana Hassan
A Coding Implementation to Explore and Analyze the TaskTrove Dataset with Streaming Parsing Visualization and Verifier Detection
Sana Hassan
A Coding Implementation of End-to-End Brain Decoding from MEG Signals Using NeuralSet and Deep Learning for Predicting Linguistic Features
Sana Hassan
A Coding Guide on LLM Post Training with TRL from Supervised Fine Tuning to DPO and GRPO Reasoning
Sana Hassan
A Coding Deep Dive into Agentic UI, Generative UI, State Synchronization, and Interrupt-Driven Approval Flows
Sana Hassan
A Coding Implementation on Pyright Type Checking Covering Generics, Protocols, Strict Mode, Type Narrowing, and Modern Python Typing
Sana Hassan
A Coding Implementation on Document Parsing Benchmarking with LlamaIndex ParseBench Using Python, Hugging Face, and Evaluation Metrics
Sana Hassan
How to Build Traceable and Evaluated LLM Workflows Using Promptflow, Prompty, and OpenAI
Sana Hassan
How to Build a Lightweight Vision-Language-Action-Inspired Embodied Agent with Latent World Modeling and Model Predictive Control
Sana Hassan
How to Build a Fully Searchable AI Knowledge Base with OpenKB, OpenRouter, and Llama
Sana Hassan
How to Build Smarter Multilingual Text Wrapping with BudouX Through Parsing, HTML Rendering, Model Introspection, and Toy Training
Sana Hassan
A Coding Tutorial on Datashader on Rendering Massive Datasets with High-Performance Python Visual Analytics
Sana Hassan
A Coding Implementation on kvcached for Elastic KV Cache Memory, Bursty LLM Serving, and Multi-Model GPU Sharing
Sana Hassan
A Coding Implementation on Microsoft’s OpenMementos with Trace Structure Analysis, Context Compression, and Fine-Tuning Data Preparation
Sana Hassan
A Detailed Implementation on Equinox with JAX Native Modules, Filtered Transforms, Stateful Layers, and End-to-End Training Workflows
Sana Hassan
A Coding Implementation to Build a Conditional Bayesian Hyperparameter Optimization Pipeline with Hyperopt, TPE, and Early Stopping
Sana Hassan
A Coding Implementation on Qwen 3.6-35B-A3B Covering Multimodal Inference, Thinking Control, Tool Calling, MoE Routing, RAG, and Session Persistence
Sana Hassan
A Coding Implementation on Microsoft’s Phi-4-Mini for Quantized Inference Reasoning Tool Use RAG and LoRA Fine-Tuning
Sana Hassan
A Coding Implementation to Build an AI-Powered File Type Detection and Security Analysis Pipeline with Magika and OpenAI
Sana Hassan
A Coding Implementation of Quantum State Evolution, Decoherence, and Entanglement Dynamics using QuTiP
Sana Hassan
Google AI Introduced Guardrailed-AMIE (g-AMIE): A Multi-Agent Approach to Accountability in Conversational Medical AI
Sana Hassan
Prefix-RFT: A Unified Machine Learning Framework to blend Supervised Fine-Tuning (SFT) and Reinforcement Fine-Tuning (RFT)
Sana Hassan
Huawei CloudMatrix: A Peer-to-Peer AI Datacenter Architecture for Scalable and Efficient LLM Serving
Sana Hassan
ZenFlow: A New DeepSpeed Extension Designed as a Stall-Free Offloading Engine for Large Language Model (LLM) Training
Sana Hassan
A Coding Implementation to Build a Complete Self-Hosted LLM Workflow with Ollama, REST API, and Gradio Chat Interface
Sana Hassan
Memp: A Task-Agnostic Framework that Elevates Procedural Memory to a Core Optimization Target in LLM-based Agent
Sana Hassan
A Coding Guide to Build and Validate End-to-End Partitioned Data Pipelines in Dagster with Machine Learning Integration
Sana Hassan
Efficient AI Agents Don’t Have to Be Expensive: Here’s Proof
Sana Hassan
Genie Envisioner: A Unified Video-Generative Platform for Scalable, Instruction-Driven Robotic Manipulation
Sana Hassan
Building an Advanced Portfolio Analysis and Market Intelligence Tool with OpenBB
Sana Hassan
Graph-R1: An Agentic GraphRAG Framework for Structured, Multi-Turn Reasoning with Reinforcement Learning
Sana Hassan
MIT Researchers Develop Methods to Control Transformer Sensitivity with Provable Lipschitz Bounds and Muon
Sana Hassan
TransEvalnia: A Prompting-Based System for Fine-Grained, Human-Aligned Translation Evaluation Using LLMs
Sana Hassan
Why Context Matters: Transforming AI Model Evaluation with Contextualized Queries
Sana Hassan
URBAN-SIM: Advancing Autonomous Micromobility with Scalable Urban Simulation
Sana Hassan
GPT-4o Understands Text, But Does It See Clearly? A Benchmarking Study of MFMs on Vision Tasks
Sana Hassan
A Code Implementation to Efficiently Leverage LangChain to Automate PubMed Literature Searches, Parsing, and Trend Visualization
Sana Hassan
Can LLM Reward Models Be Trusted? Master-RM Exposes and Fixes Their Weaknesses
Sana Hassan
EG-CFG: Enhancing Code Generation with Real-Time Execution Feedback
Sana Hassan
Mirage: Multimodal Reasoning in VLMs Without Rendering Images
Sana Hassan
NeuralOS: A Generative Framework for Simulating Interactive Operating System Interfaces
Sana Hassan
Efficient and Adaptable Speech Enhancement via Pre-trained Generative Audioencoders and Vocoders
Sana Hassan
SDBench and MAI-DxO: Advancing Realistic, Cost-Aware Clinical Reasoning with AI
Sana Hassan
From Perception to Action: The Role of World Models in Embodied AI Systems
Sana Hassan
Mistral AI Releases Devstral 2507 for Code-Centric Language Modeling
Sana Hassan
Perplexity Introduces Comet—An AI-First Alternative to Traditional Browsers
Sana Hassan
Microsoft Open-Sources GitHub Copilot Chat Extension for VS Code—Now Free for All Developers
Sana Hassan
How Radial Attention Cuts Costs in Video Diffusion by 4.4× Without Sacrificing Quality
Sana Hassan
SynPref-40M and Skywork-Reward-V2: Scalable Human-AI Alignment for State-of-the-Art Reward Models
Sana Hassan
A Coding Guide to Build Modular and Self-Correcting QA Systems with DSPy
Sana Hassan
AbstRaL: Teaching LLMs Abstract Reasoning via Reinforcement to Boost Robustness on GSM Benchmarks
Sana Hassan
Kyutai Releases 2B Parameter Streaming Text-to-Speech TTS with 220ms Latency and 2.5M Hours of Training
Sana Hassan
A Tutorial on Using OpenAI Codex with GitHub Repositories for Seamless AI-Powered Development
Sana Hassan
Thought Anchors: A Machine Learning Framework for Identifying and Measuring Key Reasoning Steps in Large Language Models with Precision
Sana Hassan
Building a BioCypher-Powered AI Agent for Biomedical Knowledge Graph Generation and Querying
Sana Hassan
LongWriter-Zero: A Reinforcement Learning Framework for Ultra-Long Text Generation Without Synthetic Data
Sana Hassan
MDM-Prime: A generalized Masked Diffusion Models (MDMs) Framework that Enables Partially Unmasked Tokens during Sampling
Sana Hassan
UC San Diego Researchers Introduced Dex1B: A Billion-Scale Dataset for Dexterous Hand Manipulation in Robotics
Sana Hassan
DeepRare: The First AI-Powered Agentic Diagnostic System Transforming Clinical Decision-Making in Rare Disease Management
Sana Hassan
GURU: A Reinforcement Learning Framework that Bridges LLM Reasoning Across Six Domains
Sana Hassan
MIT and NUS Researchers Introduce MEM1: A Memory-Efficient Framework for Long-Horizon Language Agents
Sana Hassan
ETH and Stanford Researchers Introduce MIRIAD: A 5.8M Pair Dataset to Improve LLM Accuracy in Medical AI
Sana Hassan
ByteDance Researchers Introduce Seed-Coder: A Model-Centric Code LLM Trained on 6 Trillion Tokens
Sana Hassan
A Coding Implementation for Creating, Annotating, and Visualizing Complex Biological Knowledge Graphs Using PyBEL
Sana Hassan
ByteDance Researchers Introduce ProtoReasoning: Enhancing LLM Generalization via Logic-Based Prototypes
Sana Hassan
Build a Groundedness Verification Tool Using Upstage API and LangChain
Sana Hassan
A Coding Guide to Build a Production-Ready Asynchronous Python SDK with Rate Limiting, In-Memory Caching, and Authentication
Sana Hassan
EmbodiedGen: A Scalable 3D World Generator for Realistic Embodied AI Simulations
Sana Hassan
Texas A&M Researchers Introduce a Two-Phase Machine Learning Method Named ‘ShockCast’ for High-Speed Flow Simulation with Neural Temporal Re-Meshing
Sana Hassan
Mistral AI Releases Mistral Small 3.2: Enhanced Instruction Following, Reduced Repetition, and Stronger Function Calling for AI Integration
Sana Hassan
PoE-World + Planner Outperforms Reinforcement Learning RL Baselines in Montezuma’s Revenge with Minimal Demonstration Data
Sana Hassan
ReVisual-R1: An Open-Source 7B Multimodal Large Language Model (MLLMs) that Achieves Long, Accurate and Thoughtful Reasoning
Sana Hassan
Why Small Language Models (SLMs) Are Poised to Redefine Agentic AI: Efficiency, Cost, and Practical Deployment
Sana Hassan
AREAL: Accelerating Large Reasoning Model Training with Fully Asynchronous Reinforcement Learning
Sana Hassan
Building High-Performance Financial Analytics Pipelines with Polars: Lazy Evaluation, Advanced Expressions, and SQL Integration
Sana Hassan
OThink-R1: A Dual-Mode Reasoning Framework to Cut Redundant Computation in LLMs
Sana Hassan
Building AI-Powered Applications Using the Plan → Files → Code Workflow in TinyDev
Sana Hassan
MemOS: A Memory-Centric Operating System for Evolving and Adaptive Large Language Models
Sana Hassan
Google AI Unveils a Hybrid AI-Physics Model for Accurate Regional Climate Risk Forecasts with Better Uncertainty Assessment
Sana Hassan
Run Multiple AI Coding Agents in Parallel with Container-Use from Dagger
Sana Hassan
How Do LLMs Really Reason? A Framework to Separate Logic from Knowledge
Sana Hassan
From Text to Action: How Tool-Augmented AI Agents Are Redefining Language Models with Reasoning, Memory, and Autonomy
Sana Hassan
Meet BioReason: The World’s First Reasoning Model in Biology that Enables AI to Reason about Genomics like a Biology Expert
Sana Hassan
Darwin Gödel Machine: A Self-Improving AI Agent That Evolves Code Using Foundation Models and Real-World Benchmarks
Sana Hassan
Salesforce AI Introduces CRMArena-Pro: The First Multi-Turn and Enterprise-Grade Benchmark for LLM Agents
Sana Hassan
LifelongAgentBench: A Benchmark for Evaluating Continuous Learning in LLM-Based Agents
Sana Hassan
Mistral AI Introduces Codestral Embed: A High-Performance Code Embedding Model for Scalable Retrieval and Semantic Understanding
Sana Hassan
Off-Policy Reinforcement Learning RL with KL Divergence Yields Superior Reasoning in Large Language Models
Sana Hassan
This AI Paper from Microsoft Introduces WINA: A Training-Free Sparse Activation Framework for Efficient Large Language Model Inference
Sana Hassan
Apple and Duke Researchers Present a Reinforcement Learning Approach That Enables LLMs to Provide Intermediate Answers, Enhancing Speed and Accuracy
Sana Hassan
National University of Singapore Researchers Introduce Dimple: A Discrete Diffusion Multimodal Language Model for Efficient and Controllable Text Generation
Sana Hassan
LLMs Can Now Reason Beyond Language: Researchers Introduce Soft Thinking to Replace Discrete Tokens with Continuous Concept Embeddings
Sana Hassan
Researchers at UT Austin Introduce Panda: A Foundation Model for Nonlinear Dynamics Pretrained on 20,000 Chaotic ODE Discovered via Evolutionary Search
Sana Hassan
Microsoft Releases NLWeb: An Open Project that Allows Developers to Easily Turn Any Website into an AI-Powered App with Natural Language Interfaces
Sana Hassan
Optimizing Assembly Code with LLMs: Reinforcement Learning Outperforms Traditional Compilers
Sana Hassan
Evaluating Enterprise-Grade AI Assistants: A Benchmark for Complex, Voice-Driven Workflows
Sana Hassan
Beyond Aha Moments: Structuring Reasoning in Large Language Models
Sana Hassan
RXTX: A Machine Learning-Guided Algorithm for Efficient Structured Matrix Multiplication
Sana Hassan
From Protocol to Production: How Model Context Protocol (MCP) Gateways Enable Secure, Scalable, and Seamless AI Integrations Across Enterprises
Sana Hassan
Researchers from Renmin University and Huawei Propose MemEngine: A Unified Modular AI Library for Customizing Memory in LLM-Based Agents
Sana Hassan
Meta Introduces KernelLLM: An 8B LLM that Translates PyTorch Modules into Efficient Triton GPU Kernels
Sana Hassan
Omni-R1: Advancing Audio Question Answering with Text-Driven Reinforcement Learning and Auto-Generated Data
Sana Hassan
Reinforcement Learning Makes LLMs Search-Savvy: Ant Group Researchers Introduce SEM to Optimize Tool Usage and Reasoning Efficiency
Sana Hassan
SWE-Bench Performance Reaches 50.8% Without Tool Use: A Case for Monolithic State-in-Context Agents
Sana Hassan
This AI paper from DeepSeek-AI Explores How DeepSeek-V3 Delivers High-Performance Language Modeling by Minimizing Hardware Overhead and Maximizing Computational Efficiency
Sana Hassan
Meet LangGraph Multi-Agent Swarm: A Python Library for Creating Swarm-Style Multi-Agent Systems Using LangGraph
Sana Hassan
ByteDance Introduces Seed1.5-VL: A Vision-Language Foundation Model Designed to Advance General-Purpose Multimodal Understanding and Reasoning
Sana Hassan
Researchers from Tsinghua and ModelBest Release Ultra-FineWeb: A Trillion-Token Dataset Enhancing LLM Accuracy Across Benchmarks
Sana Hassan
Coding Agents See 75% Surge: SimilarWeb’s AI Usage Report Highlights the Sectors Winning and Losing in 2025’s Generative AI Boom
Sana Hassan
Rethinking Toxic Data in LLM Pretraining: A Co-Design Approach for Improved Steerability and Detoxification
Sana Hassan
A Step-by-Step Guide on Building, Customizing, and Publishing an AI-Focused Blogging Website with Lovable.dev and Seamless GitHub Integration
Sana Hassan
NVIDIA AI Introduces Audio-SDS: A Unified Diffusion-Based Framework for Prompt-Guided Audio Synthesis and Source Separation without Specialized Datasets
Sana Hassan
Tencent Released PrimitiveAnything: A New AI Framework That Reconstructs 3D Shapes Using Auto-Regressive Primitive Generation
Sana Hassan
Microsoft Researchers Introduce ARTIST: A Reinforcement Learning Framework That Equips LLMs with Agentic Reasoning and Dynamic Tool Use
Sana Hassan
A Deep Technical Dive into Next-Generation Interoperability Protocols: Model Context Protocol (MCP), Agent Communication Protocol (ACP), Agent-to-Agent Protocol (A2A), and Agent Network Protocol (ANP)
Sana Hassan
Ming-Lite-Uni: An Open-Source AI Framework Designed to Unify Text and Vision through an Autoregressive Multimodal Structure
Sana Hassan
Multimodal LLMs Without Compromise: Researchers from UCLA, UW–Madison, and Adobe Introduce X-Fusion to Add Vision to Frozen Language Models Without Losing Language Capabilities
Sana Hassan
NVIDIA Open-Sources Open Code Reasoning Models (32B, 14B, 7B)
Sana Hassan
Is Automated Hallucination Detection in LLMs Feasible? A Theoretical and Empirical Investigation
Sana Hassan
Google Releases 76-Page Whitepaper on AI Agents: A Deep Technical Dive into Agentic RAG, Evaluation Frameworks, and Real-World Architectures
Sana Hassan
How AI Agents Store, Forget, and Retrieve? A Fresh Look at Memory Operations for the Next-Gen LLMs
Sana Hassan
8 Comprehensive Open-Source and Hosted Solutions to Seamlessly Convert Any API into AI-Ready MCP Servers
Sana Hassan
How the Model Context Protocol (MCP) Standardizes, Simplifies, and Future-Proofs AI Agent Tool Calling Across Models for Scalable, Secure, Interoperable Workflows Traditional Approaches to AI–Tool Integration
Sana Hassan
Multimodal Queries Require Multimodal RAG: Researchers from KAIST and DeepAuto.ai Propose UniversalRAG—A New Framework That Dynamically Routes Across Modalities and Granularities for Accurate and Efficient Retrieval-Augmented Generation
Sana Hassan
Google Researchers Advance Diagnostic AI: AMIE Now Matches or Outperforms Primary Care Physicians Using Multimodal Reasoning with Gemini 2.0 Flash
Sana Hassan
LLMs Can Learn Complex Math from Just One Example: Researchers from University of Washington, Microsoft, and USC Unlock the Power of 1-Shot Reinforcement Learning with Verifiable Reward
Sana Hassan
Building the Internet of Agents: A Technical Dive into AI Agent Protocols and Their Role in Scalable Intelligence Systems
Sana Hassan
Meta AI Introduces First Version of Its Llama 4-Powered AI App: A Standalone AI Assistant to Rival ChatGPT
Sana Hassan
Exploring the Sparse Frontier: How Researchers from Edinburgh, Cohere, and Meta Are Rethinking Attention Mechanisms for Long-Context LLMs
Sana Hassan
Can Coding Agents Improve Themselves? Researchers from University of Bristol and iGent AI Propose SICA (Self-Improving Coding Agent) that Iteratively Enhances Its Own Code and Performance
Sana Hassan
UniME: A Two-Stage Framework for Enhancing Multimodal Representation Learning with MLLMs
Sana Hassan
ViSMaP: Unsupervised Summarization of Hour-Long Videos Using Meta-Prompting and Short-Form Datasets
Sana Hassan
Tiny Models, Big Reasoning Gains: USC Researchers Introduce Tina for Cost-Effective Reinforcement Learning with LoRA
Sana Hassan
Microsoft Releases a Comprehensive Guide to Failure Modes in Agentic AI Systems
Sana Hassan
This AI Paper from China Proposes a Novel Training-Free Approach DEER that Allows Large Reasoning Language Models to Achieve Dynamic Early Exit in Reasoning
Sana Hassan
AgentA/B: A Scalable AI System Using LLM Agents that Simulate Real User Behavior to Transform Traditional A/B Testing on Live Web Platforms
Sana Hassan
Skywork AI Advances Multimodal Reasoning: Introducing Skywork R1V2 with Hybrid Reinforcement Learning
Sana Hassan
Microsoft Research Introduces MMInference to Accelerate Pre-filling for Long-Context Vision-Language Models
Sana Hassan
Meet Rowboat: An Open-Source IDE for Building Complex Multi-Agent Systems
Sana Hassan
A New Citibank Report/Guide Shares How Agentic AI Will Reshape Finance with Autonomous Analysis and Intelligent Automation
Sana Hassan
Sequential-NIAH: A Benchmark for Evaluating LLMs in Extracting Sequential Information from Long Texts
Sana Hassan
LLMs Can Now Learn without Labels: Researchers from Tsinghua University and Shanghai AI Lab Introduce Test-Time Reinforcement Learning (TTRL) to Enable Self-Evolving Language Models Using Unlabeled Data
Sana Hassan
Meet VoltAgent: A TypeScript AI Framework for Building and Orchestrating Scalable AI Agents
Sana Hassan
Decoupled Diffusion Transformers: Accelerating High-Fidelity Image Generation via Semantic-Detail Separation and Encoder Sharing
Sana Hassan
A Code Implementation of a Real‑Time In‑Memory Sensor Alert Pipeline in Google Colab with FastStream, RabbitMQ, TestRabbitBroker, Pydantic
Sana Hassan
LLMs Still Struggle to Cite Medical Sources Reliably: Stanford Researchers Introduce SourceCheckup to Audit Factual Support in AI-Generated Responses
Sana Hassan
Stanford Researchers Propose FramePack: A Compression-based AI Framework to Tackle Drifting and Forgetting in Long-Sequence Video Generation Using Efficient Context Management and Sampling
Sana Hassan
LLMs Can Be Misled by Surprising Data: Google DeepMind Introduces New Techniques to Predict and Reduce Unintended Knowledge Contamination
Sana Hassan
LLMs Can Now Learn to Try Again: Researchers from Menlo Introduce ReZero, a Reinforcement Learning Framework That Rewards Query Retrying to Improve Search-Based Reasoning in RAG Systems
Sana Hassan
Model Context Protocol (MCP) vs Function Calling: A Deep Dive into AI Integration Architectures
Sana Hassan
Google Unveils Gemini 2.5 Flash in Preview through the Gemini API via Google AI Studio and Vertex AI.
Sana Hassan
Do Reasoning Models Really Need Transformers?: Researchers from TogetherAI, Cornell, Geneva, and Princeton Introduce M1—A Hybrid Mamba-Based AI that Matches SOTA Performance at 3x Inference Speed
Sana Hassan
Do We Still Need Complex Vision-Language Pipelines? Researchers from ByteDance and WHU Introduce Pixel-SAIL—A Single Transformer Model for Pixel-Level Understanding That Outperforms 7B MLLMs
Sana Hassan
Biophysical Brain Models Get a 2000× Speed Boost: Researchers from NUS, UPenn, and UPF Introduce DELSSOME to Replace Numerical Integration with Deep Learning Without Sacrificing Accuracy
Sana Hassan
SyncSDE: A Probabilistic Framework for Task-Adaptive Diffusion Synchronization in Collaborative Generation
Sana Hassan
Transformers Can Now Predict Spreadsheet Cells without Fine-Tuning: Researchers Introduce TabPFN Trained on 100 Million Synthetic Datasets
Sana Hassan
A Coding Guide to Build a Finance Analytics Tool for Extracting Yahoo Finance Data, Computing Financial Analysis, and Creating Custom PDF Reports
Sana Hassan
Traditional RAG Frameworks Fall Short: Megagon Labs Introduces ‘Insight-RAG’, a Novel AI Method Enhancing Retrieval-Augmented Generation through Intermediate Insight Extraction
Sana Hassan
Google AI Introduce the Articulate Medical Intelligence Explorer (AMIE): A Large Language Model Optimized for Diagnostic Reasoning, and Evaluate its Ability to Generate a Differential Diagnosis
Sana Hassan
Moonsight AI Released Kimi-VL: A Compact and Powerful Vision-Language Model Series Redefining Multimodal Reasoning, Long-Context Understanding, and High-Resolution Visual Processing
Sana Hassan
Balancing Accuracy and Efficiency in Language Models: A Two-Phase RL Post-Training Approach for Concise Reasoning
Sana Hassan
RoR-Bench: Revealing Recitation Over Reasoning in Large Language Models Through Subtle Context Shifts
Sana Hassan
T* and LV-Haystack: A Spatially-Guided Temporal Search Framework for Efficient Long-Form Video Understanding
Sana Hassan
Unveiling Attention Sinks: The Functional Role of First-Token Focus in Stabilizing Large Language Models
Sana Hassan
RARE (Retrieval-Augmented Reasoning Modeling): A Scalable AI Framework for Domain-Specific Reasoning in Lightweight Language Models
Sana Hassan
Scalable and Principled Reward Modeling for LLMs: Enhancing Generalist Reward Models RMs with SPCT and Inference-Time Optimization
Sana Hassan
Reducto AI Released RolmOCR: A SoTA OCR Model Built on Qwen 2.5 VL, Fully Open-Source and Apache 2.0 Licensed for Advanced Document Understanding
Sana Hassan
Scalable Reinforcement Learning with Verifiable Rewards: Generative Reward Modeling for Unstructured, Multi-Domain Tasks
Sana Hassan
Meet GenSpark Super Agent: The All-in-One AI Agent that Autonomously Think, Plan, Act, and Use Tools to Handle All Your Everyday Tasks
Sana Hassan
UB-Mesh: A Cost-Efficient, Scalable Network Architecture for Large-Scale LLM Training
Sana Hassan
Advancing Vision-Language Reward Models: Challenges, Benchmarks, and the Role of Process-Supervised Learning
Sana Hassan
Enhancing Strategic Decision-Making in Gomoku Using Large Language Models and Reinforcement Learning
Sana Hassan
Mitigating Hallucinations in Large Vision-Language Models: A Latent Space Steering Approach
Sana Hassan
A Comprehensive Guide to LLM Routing: Tools and Frameworks
Sana Hassan
Understanding AI Agent Memory: Building Blocks for Intelligent Systems
Sana Hassan
Advancing Medical Reasoning with Reinforcement Learning from Verifiable Rewards (RLVR): Insights from MED-RLVR
Sana Hassan
Efficient Inference-Time Scaling for Flow Models: Enhancing Sampling Diversity and Compute Allocation
Sana Hassan
UCLA Researchers Released OpenVLThinker-7B: A Reinforcement Learning Driven Model for Enhancing Complex Visual Reasoning and Step-by-Step Problem Solving in Multimodal Systems
Sana Hassan
Vision-R1: Redefining Reinforcement Learning for Large Vision-Language Models
Sana Hassan
Understanding and Mitigating Failure Modes in LLM-Based Multi-Agent Systems
Sana Hassan
RWKV-7: Advancing Recurrent Neural Networks for Efficient Sequence Modeling
Sana Hassan
Lyra: A Computationally Efficient Subquadratic Architecture for Biological Sequence Modeling
Sana Hassan
Fin-R1: A Specialized Large Language Model for Financial Reasoning and Decision-Making
Sana Hassan
Microsoft AI Releases RD-Agent: An AI-Driven Tool for Performing R&D with LLM-based Agents
Sana Hassan
KBLAM: Efficient Knowledge Base Augmentation for Large Language Models Without Retrieval Overhead
Sana Hassan
MemQ: Enhancing Knowledge Graph Question Answering with Memory-Augmented Query Reconstruction
Sana Hassan
VisualWebInstruct: A Large-Scale Multimodal Reasoning Dataset for Enhancing Vision-Language Models
Sana Hassan
Groundlight Research Team Released an Open-Source AI Framework that Makes It Easy to Build Visual Reasoning Agents (with GRPO)
Sana Hassan
Dynamic Tanh DyT: A Simplified Alternative to Normalization in Transformers
Sana Hassan
Optimizing Test-Time Compute for LLMs: A Meta-Reinforcement Learning Approach with Cumulative Regret Minimization
Sana Hassan
MMR1-Math-v0-7B Model and MMR1-Math-RL-Data-v0 Dataset Released: New State of the Art Benchmark in Efficient Multimodal Mathematical Reasoning with Minimal Data
Sana Hassan
Google AI Introduces Gemini Embedding: A Novel Embedding Model Initialized from the Powerful Gemini Large Language Model
Sana Hassan
Enhancing LLM Reasoning with Multi-Attempt Reinforcement Learning
Sana Hassan
What if You Could Control How Long a Reasoning Model “Thinks”? CMU Researchers Introduce L1-1.5B: Reinforcement Learning Optimizes AI Thought Process
Sana Hassan
Google AI Introduces Differentiable Logic Cellular Automata (DiffLogic CA): A Differentiable Logic Approach to Neural Cellular Automata
Sana Hassan
Evaluating Brain Alignment in Large Language Models: Insights into Linguistic Competence and Neural Representations
Sana Hassan
Salesforce AI Proposes ViUniT (Visual Unit Testing): An AI Framework to Improve the Reliability of Visual Programs by Automatically Generating Unit Tests by Leveraging LLMs and Diffusion Models
Sana Hassan
Microsoft AI Introduces Belief State Transformer (BST): Enhancing Goal-Conditioned Sequence Modeling with Bidirectional Context
Sana Hassan
Meta AI Introduces Brain2Qwerty: Advancing Non-Invasive Sentence Decoding with MEG and Deep Learning
Sana Hassan
Researchers at Stanford Introduces LLM-Lasso: A Novel Machine Learning Framework that Leverages Large Language Models (LLMs) to Guide Feature Selection in Lasso ℓ1 Regression
Sana Hassan
Few-Shot Preference Optimization (FSPO): A Novel Machine Learning Framework Designed to Model Diverse Sub-Populations in Preference Datasets to Elicit Personalization in Language Models for Open-Ended Question Answering
Sana Hassan
Agentic AI vs. AI Agents: A Technical Deep Dive
Sana Hassan
HippoRAG 2: Advancing Long-Term Memory and Contextual Retrieval in Large Language Models
Sana Hassan
Self-Rewarding Reasoning in LLMs: Enhancing Autonomous Error Detection and Correction for Mathematical Reasoning
Sana Hassan
Stanford Researchers Uncover Prompt Caching Risks in AI APIs: Revealing Security Flaws and Data Vulnerabilities
Sana Hassan
Beyond a Single LLM: Advancing AI Through Multi-Model Collaboration
Sana Hassan
LongPO: Enhancing Long-Context Alignment in LLMs Through Self-Optimized Short-to-Long Preference Learning
Sana Hassan
Enhancing Instruction Tuning in LLMs: A Diversity-Aware Data Selection Strategy Using Sparse Autoencoders
Sana Hassan
Optimizing LLM Reasoning: Balancing Internal Knowledge and Tool Use with SMART
Sana Hassan
Meta AI Introduces MLGym: A New AI Framework and Benchmark for Advancing AI Research Agents
Sana Hassan
Meta AI Releases the Video Joint Embedding Predictive Architecture (V-JEPA) Model: A Crucial Step in Advancing Machine Intelligence
Sana Hassan
Meet Baichuan-M1: A New Series of Large Language Models Trained on 20T Tokens with a Dedicated Focus on Enhancing Medical Capabilities
Sana Hassan
xAI Releases Grok 3 Beta: A Super Advanced AI Model Blending Strong Reasoning with Extensive Pretraining Knowledge
Sana Hassan
Learning Intuitive Physics: Advancing AI Through Predictive Representation Models
Sana Hassan
Microsoft AI Releases OmniParser V2: An AI Tool that Turns Any LLM into a Computer Use Agent
Sana Hassan
Enhancing Diffusion Models: The Role of Sparsity and Regularization in Efficient Generative AI
Sana Hassan
Rethinking AI Safety: Balancing Existential Risks and Practical Challenges
Sana Hassan
Nous Research Released DeepHermes 3 Preview: A Llama-3-8B Based Model Combining Deep Reasoning, Advanced Function Calling, and Seamless Conversational Intelligence
Sana Hassan
Layer Parallelism: Enhancing LLM Inference Efficiency Through Parallel Execution of Transformer Layers
Sana Hassan
Can 1B LLM Surpass 405B LLM? Optimizing Computation for Small LLMs to Outperform Larger Models
Sana Hassan
Meet OpenThinker-32B: A State-of-the-Art Open-Data Reasoning Model
Sana Hassan
Stanford Researchers Introduce SIRIUS: A Self-Improving Reasoning-Driven Optimization Framework for Multi-Agent Systems
Sana Hassan
Frame-Dependent Agency: Implications for Reinforcement Learning and Intelligence
Sana Hassan
Advancing Scalable Text-to-Speech Synthesis: Llasa’s Transformer-Based Framework for Improved Speech Quality and Emotional Expressiveness
Sana Hassan
Google DeepMind Introduces AlphaGeometry2: A Significant Upgrade to AlphaGeometry Surpassing the Average Gold Medalist in Solving Olympiad Geometry
Sana Hassan
BARE: A Synthetic Data Generation AI Method that Combines the Diversity of Base Models with the Quality of Instruct-Tuned Models
Sana Hassan
ChunkKV: Optimizing KV Cache Compression for Efficient Long-Context Inference in LLMs
Sana Hassan
Singapore University of Technology and Design (SUTD) Explores Advancements and Challenges in Multimodal Reasoning for AI Models Through Puzzle-Based Evaluations and Algorithmic Problem-Solving Analysis
Sana Hassan
Optimizing Large Model Inference with Ladder Residual: Enhancing Tensor Parallelism through Communication-Computing Overlap
Sana Hassan
Microsoft AI Researchers Introduce Advanced Low-Bit Quantization Techniques to Enable Efficient LLM Deployment on Edge Devices without High Computational Costs
Sana Hassan
Google DeepMind Achieves State-of-the-Art Data-Efficient Reinforcement Learning RL with Improved Transformer World Models
Sana Hassan
Deep Agent Released R1-V: Reinforcing Super Generalization in Vision-Language Models with Cost-Effective Reinforcement Learning to Outperform Larger Models
Sana Hassan
ARM: Enhancing Open-Domain Question Answering with Structured Retrieval and Efficient Data Alignment
Sana Hassan
Google AI Introduces Parfait: A Privacy-First AI System for Secure Data Aggregation and Analytics
Sana Hassan
Exploration Challenges in LLMs: Balancing Uncertainty and Empowerment in Open-Ended Tasks
Sana Hassan
Creating an AI-Powered Tutor Using Vector Database and Groq for Retrieval-Augmented Generation (RAG): Step by Step Guide
Sana Hassan
Mistral AI Releases the Mistral-Small-24B-Instruct-2501: A Latency-Optimized 24B-Parameter Model Released Under the Apache 2.0 License
Sana Hassan
Agentic AI: The Foundations Based on Perception Layer, Knowledge Representation and Memory Systems
Sana Hassan
Open Thoughts: An Open Source Initiative Advancing AI Reasoning with High-Quality Datasets and Models Like OpenThoughts-114k and OpenThinker-7B
Sana Hassan
YuE: An Open-Source Music Generation AI Model Family Capable of Creating Full-Length Songs with Coherent Vocals, Instrumental Harmony, and Multi-Genre Creativity
Sana Hassan
TensorLLM: Enhancing Reasoning and Efficiency in Large Language Models through Multi-Head Attention Compression and Tensorisation
Sana Hassan
A Comprehensive Guide to Concepts in Fine-Tuning of Large Language Models (LLMs)
Sana Hassan
Microsoft AI Introduces CoRAG (Chain-of-Retrieval Augmented Generation): An AI Framework for Iterative Retrieval and Reasoning in Knowledge-Intensive Tasks
Sana Hassan
Leveraging Hallucinations in Large Language Models to Enhance Drug Discovery
Sana Hassan
Advancing Single-Cell Genomics with Self-Supervised Learning: Techniques, Applications, and Insights
Sana Hassan
Autonomy-of-Experts (AoE): A Router-Free Paradigm for Efficient and Adaptive Mixture-of-Experts Models
Sana Hassan
DeepSeek-R1 vs. OpenAI’s o1: A New Step in Open Source and Proprietary Models
Sana Hassan
Meta AI Releases the First Stable Version of Llama Stack: A Unified Platform Transforming Generative AI Development with Backward Compatibility, Safety, and Seamless Multi-Environment Deployme

## extraction_diagnostics

- extraction_method: article
- readability_score: 91
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":60000,"paragraph_count":637,"sentence_count":77,"boilerplate_hits":2,"symbol_ratio":0.0137,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   该教程演示如何构建并测试QwenPaw智能体工作区。步骤包括：安装与初始化QwenPaw、配置工作目录、设置身份认证、通过Colab secrets连接可选模型提供商、创建包含自定义技能与本地知识文件的结构化工作区，以及启动控制台访问与流式API测试。

2. **workflow_change**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we implement a QwenPaw workflow that provides a practical environment for building and testing an agent-powered assistant.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   We install and initialize QwenPaw, configure its working directory, set up authentication, connect optional model providers via Colab secrets, and create a structured workspace with custom skills and local knowledge files.

4. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   We also launch the QwenPaw Console via a Colab-accessible URL, expose it through an optional Cloudflare tunnel, and test the streaming chat API programmatically, enabling us to use QwenPaw both as an interactive assistant and as an API-driven agent framework.

5. **workflow_change**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Copy Code Copied Use a different Browser import os import sys import json import time import uuid import shlex import signal import shutil import socket import secrets import pathlib import subprocess from datetime import datetime RESET_QWENPAW = False PORT = int(os.

6. **quote**｜supports=daily_observation, heatmap, viewpoint｜importance=medium｜confidence=high
   get("QWENPAW_COLAB_PORT", "8088")) ROOT = pathlib.

## business_elements

- companies: MarkTechPost（RSS）, OpenAI, Google, GitHub, Meta
- products: Agents, agent, gemini, Gemini, agents, Agent
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出, 融资 / 投资
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 8088, 18, 8, 0, 4000, 127.0, 0.1, 0.5
- quotes: QWENPAW_COLAB_PORT / ))
ROOT = pathlib.Path( / )
WORKING_DIR = ROOT /  / 
SECRET_DIR = ROOT /  / 
LOG_DIR = ROOT / 

## evidence_seed

- company_actions: 该教程演示如何构建并测试QwenPaw智能体工作区。步骤包括：安装与初始化QwenPaw、配置工作目录、设置身份认证、通过Colab secrets连接可选模型提供商、创建包含自定义技能与本地知识文件的结构化工作区，以及启动控制台访问与流式API测试。 / We install and initialize QwenPaw, configure its working directory, set up authentication, connect optional model providers via Colab secrets, and create a structured workspace with custom skills and local knowledge files. / We also launch the QwenPaw Console via a Colab-accessible URL, expose it through an optional Cloudflare tunnel, and test the streaming chat API programmatically, enabling us to use QwenPaw both as an interactive assistant and as an API-driven agent framework.
- case_details: 暂无公开信息
- workflow_changes: Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we implement a QwenPaw workflow that provides a practical environment for building and testing an agent-powered assistant. / Copy Code Copied Use a different Browser import os import sys import json import time import uuid import shlex import signal import shutil import socket import secrets import pathlib import subprocess from datetime import datetime RESET_QWENPAW = False PORT = int(os.
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
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
- emerging_signal_score: 4

## usable_for

- viewpoint: true
- case: false
- change: false
- trend: false
- daily_observation: false
- heatmap: false
- briefing: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 疑似官网首页、产品目录或导航页，只能索引留存
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
- discovery_record: {"discovery_title":"如何构建QwenPaw智能体工作区：自定义技能、模型提供商、控制台访问与流式API测试","discovery_summary":"该教程演示如何构建并测试QwenPaw智能体工作区。步骤包括：安装与初始化QwenPaw、配置工作目录、设置身份认证、通过Colab secrets连接可选模型提供商、创建包含自定义技能与本地知识文件的结构化工作区，以及启动控制台访问与流式API测试。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/06/13/how-to-build-a-qwenpaw-agent-workspace-with-custom-skills-model-providers-console-access-and-streaming-api-testing","discovered_at":"2026-06-14T04:21:16.523Z","rank_on_page":85,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

该教程演示如何构建并测试QwenPaw智能体工作区。步骤包括：安装与初始化QwenPaw、配置工作目录、设置身份认证、通过Colab secrets连接可选模型提供商、创建包含自定义技能与本地知识文件的结构化工作区，以及启动控制台访问与流式API测试。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
