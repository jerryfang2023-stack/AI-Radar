---
schema_version: raw-evidence-v2
raw_id: R-010
title: "用Claude和Python构建技能驱动的金融分析智能体"
title_zh: "用Claude和Python构建技能驱动的金融分析智能体"
title_translation_status: not_required
title_translation_method: source_title
title_translation_model: not_applicable
original_url: "https://www.marktechpost.com/2026/07/27/designing-skill-driven-financial-analysis-agents-with-claude-python-mcp-connectors-and-automated-deliverables"
canonical_url: "https://marktechpost.com/2026/07/27/designing-skill-driven-financial-analysis-agents-with-claude-python-mcp-connectors-and-automated-deliverables"
source_name: "MarkTechPost（RSS）"
source_type: operators
source_level: C
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
published_at: "2026-07-27T18:08:24.000Z"
collected_at: 2026-07-28T05:39:20.571Z
language: mixed
full_text_hash: b4be25051b0fb94f
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-28/r-010-用claude和python构建技能驱动的金融分析智能体.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-28/r-010-用claude和python构建技能驱动的金融分析智能体.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-article
extraction_quality: high
extraction_method: "article"
readability_score: 91
extractor_diagnostics: {"readability_score":91,"text_length":17654,"paragraph_count":259,"sentence_count":55,"boilerplate_hits":2,"symbol_ratio":0.0306,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}
has_full_text: true
content_length: 17654
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"b4be25051b0fb94f","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"用Claude和Python构建技能驱动的金融分析智能体","discovery_summary":"本教程基于Anthropic的financial-services仓库，用纯Python复现其技能驱动架构。通过解析SKILL.md文件构建可搜索技能注册表，并创建可复用SkillAgent，将金融分析剧本注入Anthropic Messages API，支持迭代工具调用循环。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/27/designing-skill-driven-financial-analysis-agents-with-claude-python-mcp-connectors-and-automated-deliverables","discovered_at":"2026-07-28T05:29:44.813Z","rank_on_page":153,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 2c0c9b6ef47412c3
content_hash: b4be25051b0fb94f
semantic_hash: 7ecfd8381b74bb04
duplicate_of: ""
first_seen_at: "2026-07-27T18:08:24.000Z"
last_seen_at: 2026-07-28T05:39:20.571Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool","emerging_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_vertical_solution","importance_score":5,"importance_reason":"vertical industry solution; rubric=5 major/platform/industry-shaping","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["MarkTechPost（RSS）","Anthropic","Google","GitHub","Meta"],"products":["Claude","Agents","agents","agent","claude","mcp","MCP","AGENT"],"people":[],"industries":["金融 / 保险","开发者工具","企业服务"],"roles":["CIO / IT 负责人"],"workflows":["合同审阅 / 法律研究","计费 / 预算管理","权限 / 安全治理","部署 / 集成交付"],"business_actions":["发布 / 推出","合作 / 联盟","部署 / 上线","融资 / 投资"],"affected_departments":["IT / 安全","财务 / 预算","销售 / 客服"],"numbers":["0","1500","1","4","6","14","8","300"],"quotes":[")\nr = subprocess.run(cmd, shell=True, capture_output=True, text=True)\nif r.returncode != 0:\nprint(r.stderr[-1500:])\nreturn r\nsh(f",")\nimport pandas as pd\nimport yaml\nimport matplotlib.pyplot as plt\nREPO_URL = ","\nREPO_DIR = ","\nif not os.path.isdir(REPO_DIR):\nsh(f",")\nelse:\nprint("]}
evidence_seed: {"company_actions":["本教程基于Anthropic的financial-services仓库，用纯Python复现其技能驱动架构。通过解析SKILL.md文件构建可搜索技能注册表，并创建可复用SkillAgent，将金融分析剧本注入Anthropic Messages API，支持迭代工具调用循环。","We begin by installing the required libraries, cloning the repository, and programmatically mapping its agents, vertical plugins, partner integrations, managed-agent cookbooks, and financial analysis skills.","We then parse the repository’s SKILL."],"case_details":["Using this architecture, we execute a synthetic discounted cash flow valuation, generate a WACC and terminal-growth sensitivity heatmap, perform comparable-company analysis with formatted Excel output, draft a private-equity investment committee memo, and inspect a managed-agent deployment specification without sending a live deployment request."],"workflow_changes":["Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we build an advanced workflow around Anthropic’s financial-services repository and reproduce its skill-driven architecture in pure Python.","md files into a searchable registry and construct a reusable SkillAgent that injects selected financial playbooks into the Anthropic Messages API while supporting an iterative tool-use loop for Python calculations and file generation."],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"company_action","text":"本教程基于Anthropic的financial-services仓库，用纯Python复现其技能驱动架构。通过解析SKILL.md文件构建可搜索技能注册表，并创建可复用SkillAgent，将金融分析剧本注入Anthropic Messages API，支持迭代工具调用循环。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we build an advanced workflow around Anthropic’s financial-services repository and reproduce its skill-driven architecture in pure Python.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"product_update","text":"We begin by installing the required libraries, cloning the repository, and programmatically mapping its agents, vertical plugins, partner integrations, managed-agent cookbooks, and financial analysis skills.","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"high","confidence":"high"},{"type":"company_action","text":"We then parse the repository’s SKILL.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"md files into a searchable registry and construct a reusable SkillAgent that injects selected financial playbooks into the Anthropic Messages API while supporting an iterative tool-use loop for Python calculations and file generation.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"case_detail","text":"Using this architecture, we execute a synthetic discounted cash flow valuation, generate a WACC and terminal-growth sensitivity heatmap, perform comparable-company analysis with formatted Excel output, draft a private-equity investment committee memo, and inspect a managed-agent deployment specification without sending a live deployment request.","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-28T05:39:20.571Z
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# 用Claude和Python构建技能驱动的金融分析智能体

## clean_text

Editors Pick
Agentic AI
AI Agents
Staff
Tutorials
In this tutorial, we build an advanced workflow around Anthropic’s financial-services repository and reproduce its skill-driven architecture in pure Python. We begin by installing the required libraries, cloning the repository, and programmatically mapping its agents, vertical plugins, partner integrations, managed-agent cookbooks, and financial analysis skills. We then parse the repository’s SKILL.md files into a searchable registry and construct a reusable SkillAgent that injects selected financial playbooks into the Anthropic Messages API while supporting an iterative tool-use loop for Python calculations and file generation. Using this architecture, we execute a synthetic discounted cash flow valuation, generate a WACC and terminal-growth sensitivity heatmap, perform comparable-company analysis with formatted Excel output, draft a private-equity investment committee memo, and inspect a managed-agent deployment specification without sending a live deployment request.
Copy Code Copied Use a different Browser
import subprocess, sys, os, io, re, json, glob, textwrap, contextlib, pathlib
def sh(cmd):
print(f"$ {cmd}")
r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
if r.returncode != 0:
print(r.stderr[-1500:])
return r
sh(f"{sys.executable} -m pip install -q anthropic pandas openpyxl pyyaml matplotlib")
import pandas as pd
import yaml
import matplotlib.pyplot as plt
REPO_URL = "https://github.com/anthropics/financial-services.git"
REPO_DIR = "financial-services"
if not os.path.isdir(REPO_DIR):
sh(f"git clone --depth 1 {REPO_URL} {REPO_DIR}")
else:
print("Repo already cloned — skipping.")
def get_api_key():
try:
from google.colab import userdata
k = userdata.get("ANTHROPIC_API_KEY")
if k:
return k
except Exception:
pass
if os.environ.get("ANTHROPIC_API_KEY"):
return os.environ["ANTHROPIC_API_KEY"]
from getpass import getpass
return getpass("Enter your Anthropic API key: ")
os.environ["ANTHROPIC_API_KEY"] = get_api_key()
import anthropic
client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"
print("SDK ready. Model:", MODEL)
We install the required Python libraries, clone Anthropic’s financial-services repository, and prepare the Google Colab runtime for execution. We retrieve the Anthropic API key from Colab secrets, environment variables, or a secure interactive prompt. We then initialize the official Anthropic SDK and select the Claude model that powers the financial-analysis workflows.
Copy Code Copied Use a different Browser
def repo_map(root=REPO_DIR):
rows = []
for kind, pattern in [
("agent", f"{root}/plugins/agent-plugins/*"),
("vertical",f"{root}/plugins/vertical-plugins/*"),
("partner", f"{root}/plugins/partner-built/*"),
("cookbook",f"{root}/managed-agent-cookbooks/*"),
]:
for p in sorted(glob.glob(pattern)):
if not os.path.isdir(p):
continue
skills = glob.glob(f"{p}/**/SKILL.md", recursive=True)
commands = glob.glob(f"{p}/commands/*.md")
rows.append({"type": kind, "name": os.path.basename(p),
"skills": len(skills), "commands": len(commands)})
return pd.DataFrame(rows)
print("\n=== REPO MAP ===")
repo_df = repo_map()
print(repo_df.to_string(index=False))
mcp_files = glob.glob(f"{REPO_DIR}/plugins/**/.mcp.json", recursive=True)
for f in mcp_files[:1]:
print(f"\n=== MCP CONNECTORS ({f}) ===")
try:
cfg = json.load(open(f))
for name, srv in cfg.get("mcpServers", cfg).items():
print(f" {name:<14} -> {srv.get('url', srv)}")
except Exception as e:
print(" (could not parse:", e, ")")
FRONTMATTER = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)
class Skill:
def __init__(self, path):
self.path = path
raw = open(path, encoding="utf-8", errors="replace").read()
m = FRONTMATTER.match(raw)
meta = {}
if m:
try:
meta = yaml.safe_load(m.group(1)) or {}
except Exception:
meta = {}
self.name = str(meta.get("name") or pathlib.Path(path).parent.name)
self.description = str(meta.get("description", ""))[:300]
self.body = raw[m.end():] if m else raw
def __repr__(self):
return f"<Skill {self.name}>"
class SkillRegistry:
def __init__(self, root=REPO_DIR):
paths = sorted(glob.glob(f"{root}/plugins/vertical-plugins/**/SKILL.md", recursive=True))
paths += sorted(glob.glob(f"{root}/plugins/**/SKILL.md", recursive=True))
self.skills = {}
for p in paths:
s = Skill(p)
self.skills.setdefault(s.name.lower(), s)
def find(self, query):
q = query.lower()
hits = [s for k, s in self.skills.items() if q in k]
if not hits:
hits = [s for s in self.skills.values() if q in s.description.lower()]
return hits
def get(self, query):
hits = self.find(query)
if not hits:
raise KeyError(f"No skill matching '{query}'. "
f"Available: {sorted(self.skills)[:40]}")
return hits[0]
registry = SkillRegistry()
print(f"\nLoaded {len(registry.skills)} unique skills.")
print("Sample:", sorted(registry.skills)[:12], "...")
We inspect the repository structure and identify its agent plugins, vertical plugins, partner integrations, managed-agent cookbooks, and available commands. We locate MCP configuration files and display the external financial data connectors defined in the repository. We then parse each SKILL.md file, extract its YAML metadata and methodology, and register every unique skill for searchable access.
Copy Code Copied Use a different Browser
os.makedirs("outputs", exist_ok=True)
TOOLS = [
"name": "run_python",
"description": ("Execute Python code and return stdout. pandas as pd "
"and numpy as np are pre-imported. Use print() to "
"return results. State persists across calls."),
"input_schema": {
"type": "object",
"properties": {"code": {"type": "string"}},
"required": ["code"],
},
},
"name": "save_file",
"description": "Save text content to outputs/<filename>.",
"input_schema": {
"type": "object",
"properties": {"filename": {"type": "string"},
"content": {"type": "string"}},
"required": ["filename", "content"],
},
},
_PY_NS = {}
def _tool_run_python(code):
import numpy as np
_PY_NS.setdefault("pd", pd); _PY_NS.setdefault("np", np)
buf = io.StringIO()
try:
with contextlib.redirect_stdout(buf):
exec(code, _PY_NS)
out = buf.getvalue()
return out[:6000] if out else "(no stdout — use print())"
except Exception as e:
return f"ERROR: {type(e).__name__}: {e}"
def _tool_save_file(filename, content):
safe = os.path.basename(filename)
path = os.path.join("outputs", safe)
open(path, "w", encoding="utf-8").write(content)
return f"Saved {path} ({len(content)} chars)"
DISPATCH = {"run_python": lambda i: _tool_run_python(i["code"]),
"save_file": lambda i: _tool_save_file(i["filename"], i["content"])}
BASE_SYSTEM = """You are a financial analyst assistant operating with the
skill playbooks provided below (from Anthropic's financial-services repo).
Follow the skill's methodology, conventions, and output format closely.
Use the run_python tool for all numerical work — never do arithmetic in
your head. Use save_file for final deliverables. All work is a DRAFT for
human review; do not present it as investment advice."""
class SkillAgent:
"""Minimal reproduction of Cowork's skill-firing: chosen skills are
concatenated into the system prompt; the agent then runs a standard
tool-use loop against the Messages API until the model stops."""
def __init__(self, skill_queries, max_skill_chars=12000, verbose=True):
self.skills = [registry.get(q) for q in skill_queries]
blocks = []
for s in self.skills:
blocks.append(f"\n\n===== SKILL: {s.name} =====\n"
f"{s.description}\n{s.body[:max_skill_chars]}")
self.system = BASE_SYSTEM + "".join(blocks)
self.verbose = verbose
def run(self, prompt, max_turns=12):
messages = [{"role": "user", "content": prompt}]
for turn in range(max_turns):
resp = client.messages.create(
model=MODEL, max_tokens=8000,
system=self.system, tools=TOOLS, messages=messages)
messages.append({"role": "assistant", "content": resp.content})
if resp.stop_reason != "tool_use":
final = "".join(b.text for b in resp.content
if b.type == "text")
return final, messages
results = []
for block in resp.content:
if block.type == "tool_use":
if self.verbose:
print(f" [turn {turn}] tool: {block.name}")
out = DISPATCH[block.name](block.input)
results.append({"type": "tool_result",
"tool_use_id": block.id,
"content": str(out)})
messages.append({"role": "user", "content": results})
return "(hit max_turns)", messages
We define tools that allow Claude to execute Python calculations and save generated deliverables inside the Colab environment. We build a persistent Python namespace so numerical models, tables, and intermediate variables remain available across multiple agent turns. We then create the SkillAgent class, inject selected financial playbooks into its system prompt, and manage the Anthropic Messages API tool-use loop.
Copy Code Copied Use a different Browser
SAMPLE_CO = """
Target: 'Meridian Software' (synthetic). FY2025 actuals, $mm:
Revenue 850 (grew 18% y/y) | EBITDA margin 27% | D&A 4% of rev
CapEx 5% of rev | NWC change 1% of rev growth | Tax rate 24%
Net debt 320 | Diluted shares 92mm
Assumptions: revenue growth fades 18% -> 6% linearly over 5 yrs,
EBITDA margin expands 100bps total, WACC 9.5%, terminal growth 2.5%.
"""
print("\n" + "="*76 + "\nDEMO A — DCF (dcf-model skill)\n" + "="*76)
try:
dcf_agent = SkillAgent(["dcf"])
dcf_answer, _ = dcf_agent.run(
"Run a 5-year unlevered DCF per the skill playbook on this company:\n"
+ SAMPLE_CO +
"\nCompute enterprise value, equity value, and implied share price "
"with run_python. Then print a WACC (8.5%-10.5%, 50bp steps) x "
"terminal growth (1.5%-3.5%, 50bp steps) sensitivity grid of implied "
"share price as a JSON object under the marker SENS_JSON:, and give "
"a concise summary.")
print("\n--- DCF RESULT ---\n", dcf_answer[:3000])
m = re.search(r"SENS_JSON:\s*(\{.*\})", dcf_answer, re.S)
if m:
grid = json.loads(m.group(1))
sens = pd.DataFrame(grid)
sens = sens.apply(pd.to_numeric, errors="coerce")
fig, ax = plt.subplots(figsize=(7, 4))
im = ax.imshow(sens.values, cmap="RdYlGn", aspect="auto")
ax.set_xticks(range(len(sens.columns)), sens.columns)
ax.set_yticks(range(len(sens.index)), sens.index)
ax.set_xlabel("Terminal growth"); ax.set_ylabel("WACC")
ax.set_title("Implied share price sensitivity ($)")
for i in range(sens.shape[0]):
for j in range(sens.shape[1]):
v = sens.values[i, j]
if pd.notna(v):
ax.text(j, i, f"{v:,.0f}", ha="center", va="center",
fontsize=8)
fig.colorbar(im); plt.tight_layout(); plt.show()
except Exception as e:
print("Demo A skipped:", e)
We provide synthetic operating assumptions and instruct the DCF skill agent to construct a five-year unlevered cash-flow valuation. We use the Python execution tool to calculate enterprise value, equity value, implied share price, and a two-dimensional sensitivity matrix. We then extract the structured sensitivity results and visualize the relationship between WACC, terminal growth, and implied valuation through a heatmap.
Copy Code Copied Use a different Browser
PEERS = """
Synthetic peer set ($mm except per-share):
Ticker Price Shares NetDebt Rev_NTM EBITDA_NTM EPS_NTM
ALFA 64.2 210 450 2900 820 3.10
BRVO 28.7 540 -120 4100 980 1.45
CHRL 112.5 95 760 1850 610 5.60
DLTA 41.9 330 210 2600 700 2.05
"""
print("\n" + "="*76 + "\nDEMO B — COMPS (comps-analysis skill) -> Excel\n" + "="*76)
try:
comps_agent = SkillAgent(["comps"])
comps_answer, _ = comps_agent.run(
"Per the comps skill, compute EV, EV/Revenue, EV/EBITDA and P/E "
"(all NTM) for these peers with run_python:\n" + PEERS +
"\nThen print the full comps table plus min/25th/median/75th/max "
"summary stats as JSON under the marker COMPS_JSON: with keys "
"'table' (list of row dicts) and 'stats' (dict of dicts).")
print("\n--- COMPS NARRATIVE ---\n", comps_answer[:1500])
m = re.search(r"COMPS_JSON:\s*(\{.*\})", comps_answer, re.S)
if m:
payload = json.loads(m.group(1))
table = pd.DataFrame(payload["table"])
stats = pd.DataFrame(payload["stats"])
xlsx = "outputs/comps_analysis.xlsx"
with pd.ExcelWriter(xlsx, engine="openpyxl") as xl:
table.to_excel(xl, sheet_name="Comps", index=False)
stats.to_excel(xl, sheet_name="Summary Stats")
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill
wb = load_workbook(xlsx)
for ws in wb.worksheets:
for cell in ws[1]:
cell.font = Font(bold=True, color="FFFFFF")
cell.fill = PatternFill("solid", start_color="1F4E79")
for col in ws.columns:
w = max(len(str(c.value)) for c in col if c.value is not None)
ws.column_dimensions[col[0].column_letter].width = w + 3
wb.save(xlsx)
print("Wrote", xlsx)
print(table.to_string(index=False))
except Exception as e:
print("Demo B skipped:", e)
We supply a synthetic peer set and calculate enterprise value, EV-to-revenue, EV-to-EBITDA, and price-to-earnings multiples. We convert the agent’s structured JSON response into detailed comparable-company and summary-statistics DataFrames. We then export the analysis to a multi-sheet Excel workbook and apply professional header formatting and automatic column sizing.
Copy Code Copied Use a different Browser
print("\n" + "="*76 + "\nDEMO C — IC MEMO (ic-memo skill)\n" + "="*76)
try:
ic_agent = SkillAgent(["ic-memo"])
ic_answer, _ = ic_agent.run(
"Draft a first-round IC memo per the skill for a hypothetical "
"buyout of Meridian Software (see facts below). Base the valuation "
"framing on ~11x EV/EBITDA entry, 45% leverage, 5-yr hold. Use "
"run_python for any quick math (e.g., rough MOIC/IRR math) and "
"save the memo with save_file as ic_memo_meridian.md.\n" + SAMPLE_CO)
print("\n--- IC MEMO (first 1500 chars of reply) ---\n", ic_answer[:1500])
memo_path = "outputs/ic_memo_meridian.md"
if os.path.exists(memo_path):
print(f"\nMemo saved -> {memo_path} "
f"({os.path.getsize(memo_path)} bytes)")
except Exception as e:
print("Demo C skipped:", e)
print("\n" + "="*76 + "\nPART 7 — MANAGED AGENT COOKBOOK (dry run)\n" + "="*76)
yamls = sorted(glob.glob(f"{REPO_DIR}/managed-agent-cookbooks/*/agent.yaml")) \
+ sorted(glob.glob(f"{REPO_DIR}/managed-agent-cookbooks/*/*.yaml"))
if yamls:
path = yamls[0]
print("Inspecting:", path)
try:
spec = yaml.safe_load(open(path))
print(json.dumps(spec, indent=2, default=str)[:2500])
print("\nDeploy flow: resolve file refs -> upload skills -> create "
"leaf-worker subagents -> POST orchestrator to /v1/agents "
"(see scripts/orchestrate.py for the handoff_request event loop).")
except Exception as e:
print("Could not parse yaml:", e)
else:
print("No cookbook yaml found on this branch — see "
"managed-agent-cookbooks/ READMEs on GitHub.")
print("\n" + "="*76)
print("DONE. Artifacts in ./outputs/:", os.listdir("outputs"))
print("""
Where to go next:
* Swap SAMPLE_CO / PEERS for real data via the repo's MCP connectors
(Daloopa, FactSet, S&P, Morningstar, PitchBook...) — subscriptions apply.
* Load other skills: SkillAgent(["lbo"]), ["merger"], ["earnings"],
["rebalance"], ["tlh"], ["kyc"] ... — see `sorted(registry.skills)`.
* Stack skills: SkillAgent(["comps", "dcf"]) for a football-field workflow.
* For production, install as a Cowork plugin or deploy via Managed Agents
instead of this Colab loop — same skills, governed runtime.
All outputs are drafts for qualified human review — not investment advice.
""")
We apply the investment-committee memo skill to a hypothetical software buyout and calculate supporting return metrics with Python. We save the resulting memo as a Markdown deliverable and verify that the generated file exists in the output directory. We then inspect a managed-agent cookbook, display the deployment specification, and conclude by reviewing the generated artifacts and possible production extensions.
By completing this tutorial, we implement a practical Colab-based approximation of Anthropic’s financial-services skill and agent framework while preserving the repository’s methodology-driven approach to financial analysis. We combine structured skill discovery, dynamic system-prompt construction, persistent Python execution, API-based tool orchestration, and automated deliverable generation in a single reusable workflow. We also demonstrate how the same agent architecture supports multiple finance use cases, including DCF valuation, trading-comps analysis, sensitivity testing, Excel reporting, and investment committee memo preparation. From here, we extend the system by loading additional skills, combining multiple valuation playbooks, connecting to licensed financial data providers via MCP integrations, and replacing the tutorial sandbox with a governed production runtime in Claude Code, Cowork, or Managed Agents.
Check out the Full Code here . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
Sana Hassan
+ posts Bio
Sana Hassan, a consulting intern at Marktechpost and dual-degree student at IIT Madras, is passionate about applying technology and AI to address real-world challenges. With a keen interest in solving practical problems, he brings a fresh perspective to the intersection of AI and real-life solutions.
Sana Hassan
FAIRChem v2 UMA for Multidomain Atomistic Simulation across Molecules, Catalysts, Materials, Vibrations, and Molecular Dynamics
Sana Hassan
Designing High-Performance GPU Kernels with TileLang: Tensor-Core GEMM, Fused Softmax, FlashAttention, and Autotuning
Sana Hassan
Building Self-Evolving AI Agents with OpenSpace Using Skills, MCP, Lineage, and Low-Cost Reuse
Sana Hassan
How to Build an End-to-End OCR Pipeline with Baidu’s Unlimited-OCR for High-Resolution Images and Multi-Page PDF Parsing

## full_text

Editors Pick
Agentic AI
AI Agents
Staff
Tutorials
In this tutorial, we build an advanced workflow around Anthropic’s financial-services repository and reproduce its skill-driven architecture in pure Python. We begin by installing the required libraries, cloning the repository, and programmatically mapping its agents, vertical plugins, partner integrations, managed-agent cookbooks, and financial analysis skills. We then parse the repository’s SKILL.md files into a searchable registry and construct a reusable SkillAgent that injects selected financial playbooks into the Anthropic Messages API while supporting an iterative tool-use loop for Python calculations and file generation. Using this architecture, we execute a synthetic discounted cash flow valuation, generate a WACC and terminal-growth sensitivity heatmap, perform comparable-company analysis with formatted Excel output, draft a private-equity investment committee memo, and inspect a managed-agent deployment specification without sending a live deployment request.
Copy Code Copied Use a different Browser
import subprocess, sys, os, io, re, json, glob, textwrap, contextlib, pathlib
def sh(cmd):
print(f"$ {cmd}")
r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
if r.returncode != 0:
print(r.stderr[-1500:])
return r
sh(f"{sys.executable} -m pip install -q anthropic pandas openpyxl pyyaml matplotlib")
import pandas as pd
import yaml
import matplotlib.pyplot as plt
REPO_URL = "https://github.com/anthropics/financial-services.git"
REPO_DIR = "financial-services"
if not os.path.isdir(REPO_DIR):
sh(f"git clone --depth 1 {REPO_URL} {REPO_DIR}")
else:
print("Repo already cloned — skipping.")
def get_api_key():
try:
from google.colab import userdata
k = userdata.get("ANTHROPIC_API_KEY")
if k:
return k
except Exception:
pass
if os.environ.get("ANTHROPIC_API_KEY"):
return os.environ["ANTHROPIC_API_KEY"]
from getpass import getpass
return getpass("Enter your Anthropic API key: ")
os.environ["ANTHROPIC_API_KEY"] = get_api_key()
import anthropic
client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"
print("SDK ready. Model:", MODEL)
We install the required Python libraries, clone Anthropic’s financial-services repository, and prepare the Google Colab runtime for execution. We retrieve the Anthropic API key from Colab secrets, environment variables, or a secure interactive prompt. We then initialize the official Anthropic SDK and select the Claude model that powers the financial-analysis workflows.
Copy Code Copied Use a different Browser
def repo_map(root=REPO_DIR):
rows = []
for kind, pattern in [
("agent", f"{root}/plugins/agent-plugins/*"),
("vertical",f"{root}/plugins/vertical-plugins/*"),
("partner", f"{root}/plugins/partner-built/*"),
("cookbook",f"{root}/managed-agent-cookbooks/*"),
]:
for p in sorted(glob.glob(pattern)):
if not os.path.isdir(p):
continue
skills = glob.glob(f"{p}/**/SKILL.md", recursive=True)
commands = glob.glob(f"{p}/commands/*.md")
rows.append({"type": kind, "name": os.path.basename(p),
"skills": len(skills), "commands": len(commands)})
return pd.DataFrame(rows)
print("\n=== REPO MAP ===")
repo_df = repo_map()
print(repo_df.to_string(index=False))
mcp_files = glob.glob(f"{REPO_DIR}/plugins/**/.mcp.json", recursive=True)
for f in mcp_files[:1]:
print(f"\n=== MCP CONNECTORS ({f}) ===")
try:
cfg = json.load(open(f))
for name, srv in cfg.get("mcpServers", cfg).items():
print(f" {name:<14} -> {srv.get('url', srv)}")
except Exception as e:
print(" (could not parse:", e, ")")
FRONTMATTER = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)
class Skill:
def __init__(self, path):
self.path = path
raw = open(path, encoding="utf-8", errors="replace").read()
m = FRONTMATTER.match(raw)
meta = {}
if m:
try:
meta = yaml.safe_load(m.group(1)) or {}
except Exception:
meta = {}
self.name = str(meta.get("name") or pathlib.Path(path).parent.name)
self.description = str(meta.get("description", ""))[:300]
self.body = raw[m.end():] if m else raw
def __repr__(self):
return f"<Skill {self.name}>"
class SkillRegistry:
def __init__(self, root=REPO_DIR):
paths = sorted(glob.glob(f"{root}/plugins/vertical-plugins/**/SKILL.md", recursive=True))
paths += sorted(glob.glob(f"{root}/plugins/**/SKILL.md", recursive=True))
self.skills = {}
for p in paths:
s = Skill(p)
self.skills.setdefault(s.name.lower(), s)
def find(self, query):
q = query.lower()
hits = [s for k, s in self.skills.items() if q in k]
if not hits:
hits = [s for s in self.skills.values() if q in s.description.lower()]
return hits
def get(self, query):
hits = self.find(query)
if not hits:
raise KeyError(f"No skill matching '{query}'. "
f"Available: {sorted(self.skills)[:40]}")
return hits[0]
registry = SkillRegistry()
print(f"\nLoaded {len(registry.skills)} unique skills.")
print("Sample:", sorted(registry.skills)[:12], "...")
We inspect the repository structure and identify its agent plugins, vertical plugins, partner integrations, managed-agent cookbooks, and available commands. We locate MCP configuration files and display the external financial data connectors defined in the repository. We then parse each SKILL.md file, extract its YAML metadata and methodology, and register every unique skill for searchable access.
Copy Code Copied Use a different Browser
os.makedirs("outputs", exist_ok=True)
TOOLS = [
"name": "run_python",
"description": ("Execute Python code and return stdout. pandas as pd "
"and numpy as np are pre-imported. Use print() to "
"return results. State persists across calls."),
"input_schema": {
"type": "object",
"properties": {"code": {"type": "string"}},
"required": ["code"],
},
},
"name": "save_file",
"description": "Save text content to outputs/<filename>.",
"input_schema": {
"type": "object",
"properties": {"filename": {"type": "string"},
"content": {"type": "string"}},
"required": ["filename", "content"],
},
},
_PY_NS = {}
def _tool_run_python(code):
import numpy as np
_PY_NS.setdefault("pd", pd); _PY_NS.setdefault("np", np)
buf = io.StringIO()
try:
with contextlib.redirect_stdout(buf):
exec(code, _PY_NS)
out = buf.getvalue()
return out[:6000] if out else "(no stdout — use print())"
except Exception as e:
return f"ERROR: {type(e).__name__}: {e}"
def _tool_save_file(filename, content):
safe = os.path.basename(filename)
path = os.path.join("outputs", safe)
open(path, "w", encoding="utf-8").write(content)
return f"Saved {path} ({len(content)} chars)"
DISPATCH = {"run_python": lambda i: _tool_run_python(i["code"]),
"save_file": lambda i: _tool_save_file(i["filename"], i["content"])}
BASE_SYSTEM = """You are a financial analyst assistant operating with the
skill playbooks provided below (from Anthropic's financial-services repo).
Follow the skill's methodology, conventions, and output format closely.
Use the run_python tool for all numerical work — never do arithmetic in
your head. Use save_file for final deliverables. All work is a DRAFT for
human review; do not present it as investment advice."""
class SkillAgent:
"""Minimal reproduction of Cowork's skill-firing: chosen skills are
concatenated into the system prompt; the agent then runs a standard
tool-use loop against the Messages API until the model stops."""
def __init__(self, skill_queries, max_skill_chars=12000, verbose=True):
self.skills = [registry.get(q) for q in skill_queries]
blocks = []
for s in self.skills:
blocks.append(f"\n\n===== SKILL: {s.name} =====\n"
f"{s.description}\n{s.body[:max_skill_chars]}")
self.system = BASE_SYSTEM + "".join(blocks)
self.verbose = verbose
def run(self, prompt, max_turns=12):
messages = [{"role": "user", "content": prompt}]
for turn in range(max_turns):
resp = client.messages.create(
model=MODEL, max_tokens=8000,
system=self.system, tools=TOOLS, messages=messages)
messages.append({"role": "assistant", "content": resp.content})
if resp.stop_reason != "tool_use":
final = "".join(b.text for b in resp.content
if b.type == "text")
return final, messages
results = []
for block in resp.content:
if block.type == "tool_use":
if self.verbose:
print(f" [turn {turn}] tool: {block.name}")
out = DISPATCH[block.name](block.input)
results.append({"type": "tool_result",
"tool_use_id": block.id,
"content": str(out)})
messages.append({"role": "user", "content": results})
return "(hit max_turns)", messages
We define tools that allow Claude to execute Python calculations and save generated deliverables inside the Colab environment. We build a persistent Python namespace so numerical models, tables, and intermediate variables remain available across multiple agent turns. We then create the SkillAgent class, inject selected financial playbooks into its system prompt, and manage the Anthropic Messages API tool-use loop.
Copy Code Copied Use a different Browser
SAMPLE_CO = """
Target: 'Meridian Software' (synthetic). FY2025 actuals, $mm:
Revenue 850 (grew 18% y/y) | EBITDA margin 27% | D&A 4% of rev
CapEx 5% of rev | NWC change 1% of rev growth | Tax rate 24%
Net debt 320 | Diluted shares 92mm
Assumptions: revenue growth fades 18% -> 6% linearly over 5 yrs,
EBITDA margin expands 100bps total, WACC 9.5%, terminal growth 2.5%.
"""
print("\n" + "="*76 + "\nDEMO A — DCF (dcf-model skill)\n" + "="*76)
try:
dcf_agent = SkillAgent(["dcf"])
dcf_answer, _ = dcf_agent.run(
"Run a 5-year unlevered DCF per the skill playbook on this company:\n"
+ SAMPLE_CO +
"\nCompute enterprise value, equity value, and implied share price "
"with run_python. Then print a WACC (8.5%-10.5%, 50bp steps) x "
"terminal growth (1.5%-3.5%, 50bp steps) sensitivity grid of implied "
"share price as a JSON object under the marker SENS_JSON:, and give "
"a concise summary.")
print("\n--- DCF RESULT ---\n", dcf_answer[:3000])
m = re.search(r"SENS_JSON:\s*(\{.*\})", dcf_answer, re.S)
if m:
grid = json.loads(m.group(1))
sens = pd.DataFrame(grid)
sens = sens.apply(pd.to_numeric, errors="coerce")
fig, ax = plt.subplots(figsize=(7, 4))
im = ax.imshow(sens.values, cmap="RdYlGn", aspect="auto")
ax.set_xticks(range(len(sens.columns)), sens.columns)
ax.set_yticks(range(len(sens.index)), sens.index)
ax.set_xlabel("Terminal growth"); ax.set_ylabel("WACC")
ax.set_title("Implied share price sensitivity ($)")
for i in range(sens.shape[0]):
for j in range(sens.shape[1]):
v = sens.values[i, j]
if pd.notna(v):
ax.text(j, i, f"{v:,.0f}", ha="center", va="center",
fontsize=8)
fig.colorbar(im); plt.tight_layout(); plt.show()
except Exception as e:
print("Demo A skipped:", e)
We provide synthetic operating assumptions and instruct the DCF skill agent to construct a five-year unlevered cash-flow valuation. We use the Python execution tool to calculate enterprise value, equity value, implied share price, and a two-dimensional sensitivity matrix. We then extract the structured sensitivity results and visualize the relationship between WACC, terminal growth, and implied valuation through a heatmap.
Copy Code Copied Use a different Browser
PEERS = """
Synthetic peer set ($mm except per-share):
Ticker Price Shares NetDebt Rev_NTM EBITDA_NTM EPS_NTM
ALFA 64.2 210 450 2900 820 3.10
BRVO 28.7 540 -120 4100 980 1.45
CHRL 112.5 95 760 1850 610 5.60
DLTA 41.9 330 210 2600 700 2.05
"""
print("\n" + "="*76 + "\nDEMO B — COMPS (comps-analysis skill) -> Excel\n" + "="*76)
try:
comps_agent = SkillAgent(["comps"])
comps_answer, _ = comps_agent.run(
"Per the comps skill, compute EV, EV/Revenue, EV/EBITDA and P/E "
"(all NTM) for these peers with run_python:\n" + PEERS +
"\nThen print the full comps table plus min/25th/median/75th/max "
"summary stats as JSON under the marker COMPS_JSON: with keys "
"'table' (list of row dicts) and 'stats' (dict of dicts).")
print("\n--- COMPS NARRATIVE ---\n", comps_answer[:1500])
m = re.search(r"COMPS_JSON:\s*(\{.*\})", comps_answer, re.S)
if m:
payload = json.loads(m.group(1))
table = pd.DataFrame(payload["table"])
stats = pd.DataFrame(payload["stats"])
xlsx = "outputs/comps_analysis.xlsx"
with pd.ExcelWriter(xlsx, engine="openpyxl") as xl:
table.to_excel(xl, sheet_name="Comps", index=False)
stats.to_excel(xl, sheet_name="Summary Stats")
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill
wb = load_workbook(xlsx)
for ws in wb.worksheets:
for cell in ws[1]:
cell.font = Font(bold=True, color="FFFFFF")
cell.fill = PatternFill("solid", start_color="1F4E79")
for col in ws.columns:
w = max(len(str(c.value)) for c in col if c.value is not None)
ws.column_dimensions[col[0].column_letter].width = w + 3
wb.save(xlsx)
print("Wrote", xlsx)
print(table.to_string(index=False))
except Exception as e:
print("Demo B skipped:", e)
We supply a synthetic peer set and calculate enterprise value, EV-to-revenue, EV-to-EBITDA, and price-to-earnings multiples. We convert the agent’s structured JSON response into detailed comparable-company and summary-statistics DataFrames. We then export the analysis to a multi-sheet Excel workbook and apply professional header formatting and automatic column sizing.
Copy Code Copied Use a different Browser
print("\n" + "="*76 + "\nDEMO C — IC MEMO (ic-memo skill)\n" + "="*76)
try:
ic_agent = SkillAgent(["ic-memo"])
ic_answer, _ = ic_agent.run(
"Draft a first-round IC memo per the skill for a hypothetical "
"buyout of Meridian Software (see facts below). Base the valuation "
"framing on ~11x EV/EBITDA entry, 45% leverage, 5-yr hold. Use "
"run_python for any quick math (e.g., rough MOIC/IRR math) and "
"save the memo with save_file as ic_memo_meridian.md.\n" + SAMPLE_CO)
print("\n--- IC MEMO (first 1500 chars of reply) ---\n", ic_answer[:1500])
memo_path = "outputs/ic_memo_meridian.md"
if os.path.exists(memo_path):
print(f"\nMemo saved -> {memo_path} "
f"({os.path.getsize(memo_path)} bytes)")
except Exception as e:
print("Demo C skipped:", e)
print("\n" + "="*76 + "\nPART 7 — MANAGED AGENT COOKBOOK (dry run)\n" + "="*76)
yamls = sorted(glob.glob(f"{REPO_DIR}/managed-agent-cookbooks/*/agent.yaml")) \
+ sorted(glob.glob(f"{REPO_DIR}/managed-agent-cookbooks/*/*.yaml"))
if yamls:
path = yamls[0]
print("Inspecting:", path)
try:
spec = yaml.safe_load(open(path))
print(json.dumps(spec, indent=2, default=str)[:2500])
print("\nDeploy flow: resolve file refs -> upload skills -> create "
"leaf-worker subagents -> POST orchestrator to /v1/agents "
"(see scripts/orchestrate.py for the handoff_request event loop).")
except Exception as e:
print("Could not parse yaml:", e)
else:
print("No cookbook yaml found on this branch — see "
"managed-agent-cookbooks/ READMEs on GitHub.")
print("\n" + "="*76)
print("DONE. Artifacts in ./outputs/:", os.listdir("outputs"))
print("""
Where to go next:
* Swap SAMPLE_CO / PEERS for real data via the repo's MCP connectors
(Daloopa, FactSet, S&P, Morningstar, PitchBook...) — subscriptions apply.
* Load other skills: SkillAgent(["lbo"]), ["merger"], ["earnings"],
["rebalance"], ["tlh"], ["kyc"] ... — see `sorted(registry.skills)`.
* Stack skills: SkillAgent(["comps", "dcf"]) for a football-field workflow.
* For production, install as a Cowork plugin or deploy via Managed Agents
instead of this Colab loop — same skills, governed runtime.
All outputs are drafts for qualified human review — not investment advice.
""")
We apply the investment-committee memo skill to a hypothetical software buyout and calculate supporting return metrics with Python. We save the resulting memo as a Markdown deliverable and verify that the generated file exists in the output directory. We then inspect a managed-agent cookbook, display the deployment specification, and conclude by reviewing the generated artifacts and possible production extensions.
By completing this tutorial, we implement a practical Colab-based approximation of Anthropic’s financial-services skill and agent framework while preserving the repository’s methodology-driven approach to financial analysis. We combine structured skill discovery, dynamic system-prompt construction, persistent Python execution, API-based tool orchestration, and automated deliverable generation in a single reusable workflow. We also demonstrate how the same agent architecture supports multiple finance use cases, including DCF valuation, trading-comps analysis, sensitivity testing, Excel reporting, and investment committee memo preparation. From here, we extend the system by loading additional skills, combining multiple valuation playbooks, connecting to licensed financial data providers via MCP integrations, and replacing the tutorial sandbox with a governed production runtime in Claude Code, Cowork, or Managed Agents.
Check out the Full Code here . Also, feel free to follow us on Twitter and don’t forget to join our 150k+ML SubReddit and Subscribe to our Newsletter . Wait! are you on telegram? now you can join us on telegram as well.
Need to partner with us for promoting your GitHub Repo OR Hugging Face Page OR Product Release OR Webinar etc.? Connect with us
Sana Hassan
+ posts Bio
Sana Hassan, a consulting intern at Marktechpost and dual-degree student at IIT Madras, is passionate about applying technology and AI to address real-world challenges. With a keen interest in solving practical problems, he brings a fresh perspective to the intersection of AI and real-life solutions.
Sana Hassan
FAIRChem v2 UMA for Multidomain Atomistic Simulation across Molecules, Catalysts, Materials, Vibrations, and Molecular Dynamics
Sana Hassan
Designing High-Performance GPU Kernels with TileLang: Tensor-Core GEMM, Fused Softmax, FlashAttention, and Autotuning
Sana Hassan
Building Self-Evolving AI Agents with OpenSpace Using Skills, MCP, Lineage, and Low-Cost Reuse
Sana Hassan
How to Build an End-to-End OCR Pipeline with Baidu’s Unlimited-OCR for High-Resolution Images and Multi-Page PDF Parsing

## extraction_diagnostics

- extraction_method: article
- readability_score: 91
- fetch_status: fetched-readable-text-article
- extraction_quality: high
- diagnostics: {"readability_score":91,"text_length":17654,"paragraph_count":259,"sentence_count":55,"boilerplate_hits":2,"symbol_ratio":0.0306,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"article"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   本教程基于Anthropic的financial-services仓库，用纯Python复现其技能驱动架构。通过解析SKILL.md文件构建可搜索技能注册表，并创建可复用SkillAgent，将金融分析剧本注入Anthropic Messages API，支持迭代工具调用循环。

2. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we build an advanced workflow around Anthropic’s financial-services repository and reproduce its skill-driven architecture in pure Python.

3. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=high｜confidence=high
   We begin by installing the required libraries, cloning the repository, and programmatically mapping its agents, vertical plugins, partner integrations, managed-agent cookbooks, and financial analysis skills.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   We then parse the repository’s SKILL.

5. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   md files into a searchable registry and construct a reusable SkillAgent that injects selected financial playbooks into the Anthropic Messages API while supporting an iterative tool-use loop for Python calculations and file generation.

6. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   Using this architecture, we execute a synthetic discounted cash flow valuation, generate a WACC and terminal-growth sensitivity heatmap, perform comparable-company analysis with formatted Excel output, draft a private-equity investment committee memo, and inspect a managed-agent deployment specification without sending a live deployment request.

## business_elements

- companies: MarkTechPost（RSS）, Anthropic, Google, GitHub, Meta
- products: Claude, Agents, agents, agent, claude, mcp, MCP, AGENT
- people: 暂无公开信息
- industries: 金融 / 保险, 开发者工具, 企业服务
- roles: CIO / IT 负责人
- workflows: 合同审阅 / 法律研究, 计费 / 预算管理, 权限 / 安全治理, 部署 / 集成交付
- business_actions: 发布 / 推出, 合作 / 联盟, 部署 / 上线, 融资 / 投资
- affected_departments: IT / 安全, 财务 / 预算, 销售 / 客服
- numbers: 0, 1500, 1, 4, 6, 14, 8, 300
- quotes: )
r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
if r.returncode != 0:
print(r.stderr[-1500:])
return r
sh(f / )
import pandas as pd
import yaml
import matplotlib.pyplot as plt
REPO_URL =  / 
REPO_DIR =  / 
if not os.path.isdir(REPO_DIR):
sh(f / )
else:
print(

## evidence_seed

- company_actions: 本教程基于Anthropic的financial-services仓库，用纯Python复现其技能驱动架构。通过解析SKILL.md文件构建可搜索技能注册表，并创建可复用SkillAgent，将金融分析剧本注入Anthropic Messages API，支持迭代工具调用循环。 / We begin by installing the required libraries, cloning the repository, and programmatically mapping its agents, vertical plugins, partner integrations, managed-agent cookbooks, and financial analysis skills. / We then parse the repository’s SKILL.
- case_details: Using this architecture, we execute a synthetic discounted cash flow valuation, generate a WACC and terminal-growth sensitivity heatmap, perform comparable-company analysis with formatted Excel output, draft a private-equity investment committee memo, and inspect a managed-agent deployment specification without sending a live deployment request.
- workflow_changes: Editors Pick Agentic AI AI Agents Staff Tutorials In this tutorial, we build an advanced workflow around Anthropic’s financial-services repository and reproduce its skill-driven architecture in pure Python. / md files into a searchable registry and construct a reusable SkillAgent that injects selected financial playbooks into the Anthropic Messages API while supporting an iterative tool-use loop for Python calculations and file generation.
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_vertical_solution
- importance_score: 5
- importance_reason: vertical industry solution; rubric=5 major/platform/industry-shaping
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
- discovery_record: {"discovery_title":"用Claude和Python构建技能驱动的金融分析智能体","discovery_summary":"本教程基于Anthropic的financial-services仓库，用纯Python复现其技能驱动架构。通过解析SKILL.md文件构建可搜索技能注册表，并创建可复用SkillAgent，将金融分析剧本注入Anthropic Messages API，支持迭代工具调用循环。","source_name":"MarkTechPost（RSS）","origin_url":"https://www.marktechpost.com/2026/07/27/designing-skill-driven-financial-analysis-agents-with-claude-python-mcp-connectors-and-automated-deliverables","discovered_at":"2026-07-28T05:29:44.813Z","rank_on_page":153,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

本教程基于Anthropic的financial-services仓库，用纯Python复现其技能驱动架构。通过解析SKILL.md文件构建可搜索技能注册表，并创建可复用SkillAgent，将金融分析剧本注入Anthropic Messages API，支持迭代工具调用循环。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
