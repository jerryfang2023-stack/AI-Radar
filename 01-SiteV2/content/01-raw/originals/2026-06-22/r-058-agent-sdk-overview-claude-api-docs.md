---
schema_version: raw-evidence-v2
raw_id: R-058
title: "Agent SDK overview - Claude API Docs"
original_url: "https://docs.anthropic.com/en/api/agent-sdk"
canonical_url: "https://docs.anthropic.com/en/api/agent-sdk"
source_name: "keyword search / Tavily"
source_type: official
source_level: S
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: changelog_or_release
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: keyword-search
research_status: not_research
search_intent: "find_original_source"
search_path: "official_original"
search_path_label: "官方原始路径"
author: ""
published_at: ""
collected_at: 2026-06-22T03:52:55.830Z
language: mixed
full_text_hash: cd8c7c82379ec2df
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-22/r-058-agent-sdk-overview-claude-api-docs.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-22/r-058-agent-sdk-overview-claude-api-docs.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 88
extractor_diagnostics: {"readability_score":88,"text_length":13005,"paragraph_count":165,"sentence_count":49,"boilerplate_hits":3,"symbol_ratio":0.0122,"method":"main"}
has_full_text: true
content_length: 13005
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"cd8c7c82379ec2df","missing":[]}
source_volatility: low
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: ""
discovery_record: null
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: fef8e1962d52943f
content_hash: cd8c7c82379ec2df
semantic_hash: 2bb065ad4c729ff0
duplicate_of: ""
first_seen_at: "2026-06-22T03:52:55.830Z"
last_seen_at: 2026-06-22T03:52:55.830Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":true,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["emerging_pool","watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":5}
business_elements: {"companies":["keyword search","Tavily","Anthropic","Google","Microsoft","GitHub","Amazon","AWS"],"products":["Agent","Claude","agents","agent","claude","MCP","mcp","CLAUDE","Agents"],"people":[],"industries":["开发者工具","企业服务"],"roles":["CIO / IT 负责人","开发者 / 工程团队","销售 / 客服"],"workflows":["合同审阅 / 法律研究","权限 / 安全治理"],"business_actions":["发布 / 推出","合作 / 联盟"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["0.409","3.10","3","1"],"quotes":["Find and fix the bug in auth.py","What files are in this directory?"," ]),\n):\nif hasattr (message, ","Find all TODO comments and create a summary"," ]),\n):\nif hasattr (message, "]}
evidence_seed: {"company_actions":["Title: Agent SDK overview - Claude API Docs # Agent SDK overview. The Claude Code SDK has been renamed to the Claude Agent SDK. Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript. from claude_agent_sdk import query, ClaudeAgentOptions. print(message) # Claude reads the file, finds the bug, edits it. The Agent SDK includes built-in tool","Build AI agents that autonomously read files, run commands, search the web, edit code, and more.","The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队","销售 / 客服"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"company_action","text":"Title: Agent SDK overview - Claude API Docs # Agent SDK overview. The Claude Code SDK has been renamed to the Claude Agent SDK. Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript. from claude_agent_sdk import query, ClaudeAgentOptions. print(message) # Claude reads the file, finds the bug, edits it. The Agent SDK includes built-in tool","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Build AI agents that autonomously read files, run commands, search the web, edit code, and more.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Python TypeScript import asyncio from claude_agent_sdk import query, ClaudeAgentOptions async def main (): async for message in query( prompt = \"Find and fix the bug in auth.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"quote","text":"py\" , options = ClaudeAgentOptions( allowed_tools = [ \"Read\" , \"Edit\" , \"Bash\" ]), ): print (message) # Claude reads the file, finds the bug, edits it asyncio.","supports":["daily_observation","heatmap","viewpoint"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"run(main()) The Agent SDK includes built-in tools for reading files, running commands, and editing code, so your agent can start working immediately without you implementing tool execution.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"}]
theme: targeted-pool-gap-refill
keyword_group: targeted-pool-gap-refill
copyright_note: local research archive only
---

# Agent SDK overview - Claude API Docs

## clean_text

Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript.
Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "Find and fix the bug in auth.py" ,
options = ClaudeAgentOptions( allowed_tools = [ "Read" , "Edit" , "Bash" ]),
):
print (message) # Claude reads the file, finds the bug, edits it
asyncio.run(main())
The Agent SDK includes built-in tools for reading files, running commands, and editing code, so your agent can start working immediately without you implementing tool execution. Dive into the quickstart or explore real agents built with the SDK:
Quickstart
Build a bug-fixing agent in minutes
Example agents
Email assistant, research agent, and more
Get started
Install the SDK
TypeScript
Python
npm install @anthropic-ai/claude-agent-sdk
pip install claude-agent-sdk
The Python package requires Python 3.10 or later. If pip reports No matching distribution found for claude-agent-sdk , your interpreter is older than 3.10. Run python3 --version on macOS or Linux, or py --version on Windows, to check.
The TypeScript SDK bundles a native Claude Code binary for your platform as an optional dependency, so you don’t need to install Claude Code separately.
Set your API key
Get an API key from the Console , then set it as an environment variable:
export ANTHROPIC_API_KEY = your-api-key
The SDK also supports authentication via third-party API providers:
Amazon Bedrock : set CLAUDE_CODE_USE_BEDROCK=1 environment variable and configure AWS credentials
Claude Platform on AWS : set CLAUDE_CODE_USE_ANTHROPIC_AWS=1 and ANTHROPIC_AWS_WORKSPACE_ID , then configure AWS credentials
Google Vertex AI : set CLAUDE_CODE_USE_VERTEX=1 environment variable and configure Google Cloud credentials
Microsoft Azure : set CLAUDE_CODE_USE_FOUNDRY=1 environment variable and configure Azure credentials
See the setup guides for Bedrock , Claude Platform on AWS , Vertex AI , or Azure AI Foundry for details.
Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. Please use the API key authentication methods described in this document instead.
Run your first agent
This example creates an agent that lists files in your current directory using built-in tools. Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "What files are in this directory?" ,
options = ClaudeAgentOptions( allowed_tools = [ "Bash" , "Glob" ]),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Ready to build? Follow the Quickstart to create an agent that finds and fixes bugs in minutes.
Capabilities
Everything that makes Claude Code powerful is available in the SDK:
Built-in tools
Hooks
Subagents
MCP
Permissions
Sessions
Your agent can read files, run commands, and search codebases out of the box. Key tools include: Tool What it does
Read Read any file in the working directory
Write Create new files
Edit Make precise edits to existing files
Bash Run terminal commands, scripts, git operations
Monitor Watch a background script and react to each output line as an event
Glob Find files by pattern ( **/*.ts , src/**/*.py )
Grep Search file contents with regex
WebSearch Search the web for current information
WebFetch Fetch and parse web page content
AskUserQuestion Ask the user clarifying questions with multiple choice options
This example creates an agent that searches your codebase for TODO comments: Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "Find all TODO comments and create a summary" ,
options = ClaudeAgentOptions( allowed_tools = [ "Read" , "Glob" , "Grep" ]),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Run custom code at key points in the agent lifecycle. SDK hooks use callback functions to validate, log, block, or transform agent behavior. Available hooks: PreToolUse , PostToolUse , Stop , SessionStart , SessionEnd , UserPromptSubmit , and more. This example logs all file changes to an audit file: Python
TypeScript
import asyncio
from datetime import datetime
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher
async def log_file_change ( input_data , tool_use_id , context ):
file_path = input_data.get( "tool_input" , {}).get( "file_path" , "unknown" )
with open ( "./audit.log" , "a" ) as f:
f.write( f " { datetime.now() } : modified { file_path } \n " )
return {}
async def main ():
async for message in query(
prompt = "Refactor utils.py to improve readability" ,
options = ClaudeAgentOptions(
permission_mode = "acceptEdits" ,
hooks = {
"PostToolUse" : [
HookMatcher( matcher = "Edit|Write" , hooks = [log_file_change])
},
),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Learn more about hooks →
Spawn specialized agents to handle focused subtasks. Your main agent delegates work, and subagents report back with results. Define custom agents with specialized instructions. Subagents are invoked via the Agent tool, so include Agent in allowedTools to auto-approve those invocations: Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition
async def main ():
async for message in query(
prompt = "Use the code-reviewer agent to review this codebase" ,
options = ClaudeAgentOptions(
allowed_tools = [ "Read" , "Glob" , "Grep" , "Agent" ],
agents = {
"code-reviewer" : AgentDefinition(
description = "Expert code reviewer for quality and security reviews." ,
prompt = "Analyze code quality and suggest improvements." ,
tools = [ "Read" , "Glob" , "Grep" ],
},
),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Messages from within a subagent’s context include a parent_tool_use_id field, letting you track which messages belong to which subagent execution. Learn more about subagents →
Connect to external systems via the Model Context Protocol: databases, browsers, APIs, and hundreds more . This example connects the Playwright MCP server to give your agent browser automation capabilities: Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "Open example.com and describe what you see" ,
options = ClaudeAgentOptions(
mcp_servers = {
"playwright" : { "command" : "npx" , "args" : [ "@playwright/mcp@latest" ]}
),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Learn more about MCP →
Control exactly which tools your agent can use. Allow safe operations, block dangerous ones, or require approval for sensitive actions.
For interactive approval prompts and the AskUserQuestion tool, see Handle approvals and user input .
This example creates a read-only agent that can analyze but not modify code. allowed_tools pre-approves Read , Glob , and Grep . Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "Review this code for best practices" ,
options = ClaudeAgentOptions(
allowed_tools = [ "Read" , "Glob" , "Grep" ],
),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Learn more about permissions →
Maintain context across multiple exchanges. Claude remembers files read, analysis done, and conversation history. Resume sessions later, or fork them to explore different approaches. This example captures the session ID from the first query, then resumes to continue with full context: Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, SystemMessage, ResultMessage
async def main ():
session_id = None
# First query: capture the session ID
async for message in query(
prompt = "Read the authentication module" ,
options = ClaudeAgentOptions( allowed_tools = [ "Read" , "Glob" ]),
):
if isinstance (message, SystemMessage) and message.subtype == "init" :
session_id = message.data[ "session_id" ]
# Resume with full context from the first query
async for message in query(
prompt = "Now find all places that call it" , # "it" = auth module
options = ClaudeAgentOptions( resume = session_id),
):
if isinstance (message, ResultMessage):
print (message.result)
asyncio.run(main())
Learn more about sessions →
Claude Code features
The SDK also supports Claude Code’s filesystem-based configuration. With default options the SDK loads these from .claude/ in your working directory and ~/.claude/ . To restrict which sources load, set setting_sources (Python) or settingSources (TypeScript) in your options.
Feature Description Location
Skills Specialized capabilities Claude uses automatically or you invoke with /name .claude/skills/*/SKILL.md
Commands Custom commands in the legacy format. Use skills for new custom commands .claude/commands/*.md
Memory Project context and instructions CLAUDE.md or .claude/CLAUDE.md
Plugins Extend with skills, agents, hooks, and MCP servers Programmatic via plugins option
Compare the Agent SDK to other Claude tools
The Claude Platform offers multiple ways to build with Claude. Here’s how the Agent SDK fits in:
Agent SDK vs Client SDK
Agent SDK vs Claude Code CLI
Agent SDK vs Managed Agents
The Anthropic Client SDK gives you direct API access: you send prompts and implement tool execution yourself. The Agent SDK gives you Claude with built-in tool execution. With the Client SDK, you implement a tool loop. With the Agent SDK, Claude handles it: Python
TypeScript
# Client SDK: You implement the tool loop
response = client.messages.create( ... )
while response.stop_reason == "tool_use" :
result = your_tool_executor(response.tool_use)
response = client.messages.create( tool_result = result, ** params)
# Agent SDK: Claude handles tools autonomously
async for message in query( prompt = "Fix the bug in auth.py" ):
print (message)
Same capabilities, different interface: Use case Best choice
Interactive development CLI
CI/CD pipelines SDK
Custom applications SDK
One-off tasks CLI
Production automation SDK
Many teams use both: CLI for daily development, SDK for production. Workflows translate directly between them.
Managed Agents is a hosted REST API: Anthropic runs the agent and the sandbox, and your application sends events and streams back results. The Agent SDK is a library that runs the agent loop inside your own process. Agent SDK Managed Agents
Runs in Your process, your infrastructure Anthropic-managed infrastructure
Interface Python or TypeScript library REST API
Agent works on Files on your infrastructure A managed sandbox per session
Session state JSONL on your filesystem Anthropic-hosted event log
Custom tools In-process Python or TypeScript functions Claude triggers the tool; you execute and return results
Best for Local prototyping, agents that work directly on your filesystem and services Production agents without operating sandbox or session infrastructure, long-running and asynchronous sessions
A common path is to prototype with the Agent SDK locally, then move to Managed Agents for production.
Changelog
View the full changelog for SDK updates, bug fixes, and new features:
TypeScript SDK : view CHANGELOG.md
Python SDK : view CHANGELOG.md
Reporting bugs
If you encounter bugs or issues with the Agent SDK:
TypeScript SDK : report issues on GitHub
Python SDK : report issues on GitHub
Branding guidelines
For partners integrating the Claude Agent SDK, use of Claude branding is optional. When referencing Claude in your product:
Allowed:
“Claude Agent” (preferred for dropdown menus)
“Claude” (when within a menu already labeled “Agents”)
” Powered by Claude” (if you have an existing agent name)
Not permitted:
“Claude Code” or “Claude Code Agent”
Claude Code-branded ASCII art or visual elements that mimic Claude Code
Your product should maintain its own branding and not appear to be Claude Code or any Anthropic product. For questions about branding compliance, contact the Anthropic sales team .
License and terms
Use of the Claude Agent SDK is governed by Anthropic’s Commercial Terms of Service , including when you use it to power products and services that you make available to your own customers and end users, except to the extent a specific component or dependency is covered by a different license as indicated in that component’s LICENSE file.
Next steps
Quickstart
Build an agent that finds and fixes bugs in minutes
Example agents
Email assistant, research agent, and more
TypeScript SDK
Full TypeScript API reference and examples
Python SDK
Full Python API reference and examples
Was this page helpful?
Yes No
Quickstart
⌘ I

## full_text

Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript.
Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "Find and fix the bug in auth.py" ,
options = ClaudeAgentOptions( allowed_tools = [ "Read" , "Edit" , "Bash" ]),
):
print (message) # Claude reads the file, finds the bug, edits it
asyncio.run(main())
The Agent SDK includes built-in tools for reading files, running commands, and editing code, so your agent can start working immediately without you implementing tool execution. Dive into the quickstart or explore real agents built with the SDK:
Quickstart
Build a bug-fixing agent in minutes
Example agents
Email assistant, research agent, and more
Get started
Install the SDK
TypeScript
Python
npm install @anthropic-ai/claude-agent-sdk
pip install claude-agent-sdk
The Python package requires Python 3.10 or later. If pip reports No matching distribution found for claude-agent-sdk , your interpreter is older than 3.10. Run python3 --version on macOS or Linux, or py --version on Windows, to check.
The TypeScript SDK bundles a native Claude Code binary for your platform as an optional dependency, so you don’t need to install Claude Code separately.
Set your API key
Get an API key from the Console , then set it as an environment variable:
export ANTHROPIC_API_KEY = your-api-key
The SDK also supports authentication via third-party API providers:
Amazon Bedrock : set CLAUDE_CODE_USE_BEDROCK=1 environment variable and configure AWS credentials
Claude Platform on AWS : set CLAUDE_CODE_USE_ANTHROPIC_AWS=1 and ANTHROPIC_AWS_WORKSPACE_ID , then configure AWS credentials
Google Vertex AI : set CLAUDE_CODE_USE_VERTEX=1 environment variable and configure Google Cloud credentials
Microsoft Azure : set CLAUDE_CODE_USE_FOUNDRY=1 environment variable and configure Azure credentials
See the setup guides for Bedrock , Claude Platform on AWS , Vertex AI , or Azure AI Foundry for details.
Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. Please use the API key authentication methods described in this document instead.
Run your first agent
This example creates an agent that lists files in your current directory using built-in tools. Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "What files are in this directory?" ,
options = ClaudeAgentOptions( allowed_tools = [ "Bash" , "Glob" ]),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Ready to build? Follow the Quickstart to create an agent that finds and fixes bugs in minutes.
Capabilities
Everything that makes Claude Code powerful is available in the SDK:
Built-in tools
Hooks
Subagents
MCP
Permissions
Sessions
Your agent can read files, run commands, and search codebases out of the box. Key tools include: Tool What it does
Read Read any file in the working directory
Write Create new files
Edit Make precise edits to existing files
Bash Run terminal commands, scripts, git operations
Monitor Watch a background script and react to each output line as an event
Glob Find files by pattern ( **/*.ts , src/**/*.py )
Grep Search file contents with regex
WebSearch Search the web for current information
WebFetch Fetch and parse web page content
AskUserQuestion Ask the user clarifying questions with multiple choice options
This example creates an agent that searches your codebase for TODO comments: Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "Find all TODO comments and create a summary" ,
options = ClaudeAgentOptions( allowed_tools = [ "Read" , "Glob" , "Grep" ]),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Run custom code at key points in the agent lifecycle. SDK hooks use callback functions to validate, log, block, or transform agent behavior. Available hooks: PreToolUse , PostToolUse , Stop , SessionStart , SessionEnd , UserPromptSubmit , and more. This example logs all file changes to an audit file: Python
TypeScript
import asyncio
from datetime import datetime
from claude_agent_sdk import query, ClaudeAgentOptions, HookMatcher
async def log_file_change ( input_data , tool_use_id , context ):
file_path = input_data.get( "tool_input" , {}).get( "file_path" , "unknown" )
with open ( "./audit.log" , "a" ) as f:
f.write( f " { datetime.now() } : modified { file_path } \n " )
return {}
async def main ():
async for message in query(
prompt = "Refactor utils.py to improve readability" ,
options = ClaudeAgentOptions(
permission_mode = "acceptEdits" ,
hooks = {
"PostToolUse" : [
HookMatcher( matcher = "Edit|Write" , hooks = [log_file_change])
},
),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Learn more about hooks →
Spawn specialized agents to handle focused subtasks. Your main agent delegates work, and subagents report back with results. Define custom agents with specialized instructions. Subagents are invoked via the Agent tool, so include Agent in allowedTools to auto-approve those invocations: Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition
async def main ():
async for message in query(
prompt = "Use the code-reviewer agent to review this codebase" ,
options = ClaudeAgentOptions(
allowed_tools = [ "Read" , "Glob" , "Grep" , "Agent" ],
agents = {
"code-reviewer" : AgentDefinition(
description = "Expert code reviewer for quality and security reviews." ,
prompt = "Analyze code quality and suggest improvements." ,
tools = [ "Read" , "Glob" , "Grep" ],
},
),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Messages from within a subagent’s context include a parent_tool_use_id field, letting you track which messages belong to which subagent execution. Learn more about subagents →
Connect to external systems via the Model Context Protocol: databases, browsers, APIs, and hundreds more . This example connects the Playwright MCP server to give your agent browser automation capabilities: Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "Open example.com and describe what you see" ,
options = ClaudeAgentOptions(
mcp_servers = {
"playwright" : { "command" : "npx" , "args" : [ "@playwright/mcp@latest" ]}
),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Learn more about MCP →
Control exactly which tools your agent can use. Allow safe operations, block dangerous ones, or require approval for sensitive actions.
For interactive approval prompts and the AskUserQuestion tool, see Handle approvals and user input .
This example creates a read-only agent that can analyze but not modify code. allowed_tools pre-approves Read , Glob , and Grep . Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions
async def main ():
async for message in query(
prompt = "Review this code for best practices" ,
options = ClaudeAgentOptions(
allowed_tools = [ "Read" , "Glob" , "Grep" ],
),
):
if hasattr (message, "result" ):
print (message.result)
asyncio.run(main())
Learn more about permissions →
Maintain context across multiple exchanges. Claude remembers files read, analysis done, and conversation history. Resume sessions later, or fork them to explore different approaches. This example captures the session ID from the first query, then resumes to continue with full context: Python
TypeScript
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, SystemMessage, ResultMessage
async def main ():
session_id = None
# First query: capture the session ID
async for message in query(
prompt = "Read the authentication module" ,
options = ClaudeAgentOptions( allowed_tools = [ "Read" , "Glob" ]),
):
if isinstance (message, SystemMessage) and message.subtype == "init" :
session_id = message.data[ "session_id" ]
# Resume with full context from the first query
async for message in query(
prompt = "Now find all places that call it" , # "it" = auth module
options = ClaudeAgentOptions( resume = session_id),
):
if isinstance (message, ResultMessage):
print (message.result)
asyncio.run(main())
Learn more about sessions →
Claude Code features
The SDK also supports Claude Code’s filesystem-based configuration. With default options the SDK loads these from .claude/ in your working directory and ~/.claude/ . To restrict which sources load, set setting_sources (Python) or settingSources (TypeScript) in your options.
Feature Description Location
Skills Specialized capabilities Claude uses automatically or you invoke with /name .claude/skills/*/SKILL.md
Commands Custom commands in the legacy format. Use skills for new custom commands .claude/commands/*.md
Memory Project context and instructions CLAUDE.md or .claude/CLAUDE.md
Plugins Extend with skills, agents, hooks, and MCP servers Programmatic via plugins option
Compare the Agent SDK to other Claude tools
The Claude Platform offers multiple ways to build with Claude. Here’s how the Agent SDK fits in:
Agent SDK vs Client SDK
Agent SDK vs Claude Code CLI
Agent SDK vs Managed Agents
The Anthropic Client SDK gives you direct API access: you send prompts and implement tool execution yourself. The Agent SDK gives you Claude with built-in tool execution. With the Client SDK, you implement a tool loop. With the Agent SDK, Claude handles it: Python
TypeScript
# Client SDK: You implement the tool loop
response = client.messages.create( ... )
while response.stop_reason == "tool_use" :
result = your_tool_executor(response.tool_use)
response = client.messages.create( tool_result = result, ** params)
# Agent SDK: Claude handles tools autonomously
async for message in query( prompt = "Fix the bug in auth.py" ):
print (message)
Same capabilities, different interface: Use case Best choice
Interactive development CLI
CI/CD pipelines SDK
Custom applications SDK
One-off tasks CLI
Production automation SDK
Many teams use both: CLI for daily development, SDK for production. Workflows translate directly between them.
Managed Agents is a hosted REST API: Anthropic runs the agent and the sandbox, and your application sends events and streams back results. The Agent SDK is a library that runs the agent loop inside your own process. Agent SDK Managed Agents
Runs in Your process, your infrastructure Anthropic-managed infrastructure
Interface Python or TypeScript library REST API
Agent works on Files on your infrastructure A managed sandbox per session
Session state JSONL on your filesystem Anthropic-hosted event log
Custom tools In-process Python or TypeScript functions Claude triggers the tool; you execute and return results
Best for Local prototyping, agents that work directly on your filesystem and services Production agents without operating sandbox or session infrastructure, long-running and asynchronous sessions
A common path is to prototype with the Agent SDK locally, then move to Managed Agents for production.
Changelog
View the full changelog for SDK updates, bug fixes, and new features:
TypeScript SDK : view CHANGELOG.md
Python SDK : view CHANGELOG.md
Reporting bugs
If you encounter bugs or issues with the Agent SDK:
TypeScript SDK : report issues on GitHub
Python SDK : report issues on GitHub
Branding guidelines
For partners integrating the Claude Agent SDK, use of Claude branding is optional. When referencing Claude in your product:
Allowed:
“Claude Agent” (preferred for dropdown menus)
“Claude” (when within a menu already labeled “Agents”)
” Powered by Claude” (if you have an existing agent name)
Not permitted:
“Claude Code” or “Claude Code Agent”
Claude Code-branded ASCII art or visual elements that mimic Claude Code
Your product should maintain its own branding and not appear to be Claude Code or any Anthropic product. For questions about branding compliance, contact the Anthropic sales team .
License and terms
Use of the Claude Agent SDK is governed by Anthropic’s Commercial Terms of Service , including when you use it to power products and services that you make available to your own customers and end users, except to the extent a specific component or dependency is covered by a different license as indicated in that component’s LICENSE file.
Next steps
Quickstart
Build an agent that finds and fixes bugs in minutes
Example agents
Email assistant, research agent, and more
TypeScript SDK
Full TypeScript API reference and examples
Python SDK
Full Python API reference and examples
Was this page helpful?
Yes No
Quickstart
⌘ I

## extraction_diagnostics

- extraction_method: main
- readability_score: 88
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":88,"text_length":13005,"paragraph_count":165,"sentence_count":49,"boilerplate_hits":3,"symbol_ratio":0.0122,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Title: Agent SDK overview - Claude API Docs # Agent SDK overview. The Claude Code SDK has been renamed to the Claude Agent SDK. Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript. from claude_agent_sdk import query, ClaudeAgentOptions. print(message) # Claude reads the file, finds the bug, edits it. The Agent SDK includes built-in tool

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Build AI agents that autonomously read files, run commands, search the web, edit code, and more.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Python TypeScript import asyncio from claude_agent_sdk import query, ClaudeAgentOptions async def main (): async for message in query( prompt = "Find and fix the bug in auth.

5. **quote**｜supports=daily_observation, heatmap, viewpoint｜importance=medium｜confidence=high
   py" , options = ClaudeAgentOptions( allowed_tools = [ "Read" , "Edit" , "Bash" ]), ): print (message) # Claude reads the file, finds the bug, edits it asyncio.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   run(main()) The Agent SDK includes built-in tools for reading files, running commands, and editing code, so your agent can start working immediately without you implementing tool execution.

## business_elements

- companies: keyword search, Tavily, Anthropic, Google, Microsoft, GitHub, Amazon, AWS
- products: Agent, Claude, agents, agent, claude, MCP, mcp, CLAUDE, Agents
- people: 暂无公开信息
- industries: 开发者工具, 企业服务
- roles: CIO / IT 负责人, 开发者 / 工程团队, 销售 / 客服
- workflows: 合同审阅 / 法律研究, 权限 / 安全治理
- business_actions: 发布 / 推出, 合作 / 联盟
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 0.409, 3.10, 3, 1
- quotes: Find and fix the bug in auth.py / What files are in this directory? /  ]),
):
if hasattr (message,  / Find all TODO comments and create a summary /  ]),
):
if hasattr (message, 

## evidence_seed

- company_actions: Title: Agent SDK overview - Claude API Docs # Agent SDK overview. The Claude Code SDK has been renamed to the Claude Agent SDK. Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript. from claude_agent_sdk import query, ClaudeAgentOptions. print(message) # Claude reads the file, finds the bug, edits it. The Agent SDK includes built-in tool / Build AI agents that autonomously read files, run commands, search the web, edit code, and more. / The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队, 销售 / 客服
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
- watchlist

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: low
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: core_evidence_candidate
- discovery_source: none
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: none

## 原始摘要 / 采集文本

Title: Agent SDK overview - Claude API Docs # Agent SDK overview. The Claude Code SDK has been renamed to the Claude Agent SDK. Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript. from claude_agent_sdk import query, ClaudeAgentOptions. print(message) # Claude reads the file, finds the bug, edits it. The Agent SDK includes built-in tools for reading files, running commands, and editing code, so your agent can start working immediately without you implementing tool execution. Dive into the quickstart or explore real agents built with the SDK:. Build a bug-fixing agent in minutes. The SDK also supports authentication via third-party API providers:. Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. This example creates an agent that lists files in your current directory using built-in tools. from claude_agent_sdk import query, ClaudeAgentOptions. **Ready to build?** Follow the Quickstart to create an agent that finds and fixes bugs in minutes. Everything that makes Claude Code powerful is available in the SDK:. ### Claude Code features. The SDK also supports Claude Code's filesystem-based configuration. | Plugins | Extend with custom commands, agents, and MCP servers | Programmatic via `plugins` option |. ## Compare the Agent SDK to other Claude tools. Here's how the Agent SDK fits in:. View the full changelog for SDK updates, bug fixes, and new features:. If you encounter bugs or issues with the Agent SDK:. For partners integrating the Claude Agent SDK, use of Claude branding is optional. Your product should maintain its own branding and not appear to be Claude Code or any Anthropic product. Use of the Claude Agent SDK is governed by Anthropic's Commercial Terms of Service, including when you use it to power products and services that you make available to your own customers and end users, except to the extent a specific component or dependency is covered by a different license as indicated in that component's LICENSE file. Build an agent that finds and fixes bugs in minutes. / score=0.409 / query=AI coding agent API SDK launch enterprise product update / intent=find_original_source / path=official_original

## 采集备注

该条目由 keyword-search 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
