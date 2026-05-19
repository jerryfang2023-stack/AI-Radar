---
schema_version: raw-evidence-v2
raw_id: R-016
title: "Show HN: Torrix, self hosted, LLM Observability,(no Postgres, no Redis)"
original_url: "https://github.com/torrix-ai/install"
canonical_url: "https://github.com/torrix-ai/install"
source_name: "Hacker News"
source_type: developer
source_level: B
acquisition_source_level: ""
acquisition_channel: hn
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-05-13T12:14:26Z"
collected_at: 2026-05-19T05:27:29.861Z
language: mixed
full_text_hash: 506f1e1530d299ad
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-19/r-016-show-hn-torrix-self-hosted-llm-observability-no-postgres-no-redis.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-19/r-016-show-hn-torrix-self-hosted-llm-observability-no-postgres-no-redis.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-clean-text
extraction_quality: high
has_full_text: true
content_length: 43421
fetch_error: ""
source_volatility: high
community_name: "Hacker News"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: ""
discovery_record: null
source_role: primary_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 582546e49cbb6774
content_hash: 4a3308ace411b18a
semantic_hash: a67488d37a0b07bd
duplicate_of: ""
first_seen_at: "2026-05-13T12:14:26Z"
last_seen_at: 2026-05-19T05:27:29.861Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":false,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["core_pool","emerging_pool","user_feedback_pool"]
guanlan_scores: {"commercial_value":4,"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":3,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News","OpenAI","Anthropic","Google","Microsoft","GitHub","Cursor","Perplexity","Mistral"],"products":["Gemini","claude","Copilot","agent","gemini","ChatGPT","Claude","MCP","mcp","Cursor"],"people":[],"industries":["医疗","开发者工具"],"roles":[],"workflows":["计费 / 预算管理","部署 / 集成交付"],"business_actions":["部署 / 上线"],"affected_departments":["IT / 安全","财务 / 预算","销售 / 客服"],"numbers":["73","4","17","71","8088","2.0","0","1"],"quotes":[" : true , "," Torrix "," }\nCheck runs are being logged (requires your API key from Settings):\nMac / Linux:\ncurl http://localhost:8088/api/runs -H ","\nWindows (PowerShell):\nInvoke-WebRequest http: // localhost: 8088 / api / runs - Headers @ { Authorization = "," Authorization: Bearer <your-torrix-api-key> "]}
evidence_seed: {"company_actions":["73 points / 4 comments / query=model routing AI infrastructure","GitHub - torrix-ai/install · GitHub Skip to content Navigation Menu Toggle navigation Sign in Appearance settings Search or jump to.","Search code, repositories, users, issues, pull requests."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"company_action","text":"73 points / 4 comments / query=model routing AI infrastructure","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"GitHub - torrix-ai/install · GitHub Skip to content Navigation Menu Toggle navigation Sign in Appearance settings Search or jump to.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Search code, repositories, users, issues, pull requests.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"--> Search Clear Search syntax tips Provide feedback --> We read every piece of feedback, and take your input very seriously.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Include my email address so I can be contacted Cancel Submit feedback Saved searches Use saved searches to filter your results more quickly --> Name Query To see all available qualifiers, see our documentation .","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Cancel Create saved search Sign in Sign up Appearance settings Resetting focus You signed in with another tab or window.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"}]
theme: technical-iteration-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# Show HN: Torrix, self hosted, LLM Observability,(no Postgres, no Redis)

## clean_text

GitHub - torrix-ai/install · GitHub
Skip to content
Navigation Menu
Toggle navigation
Sign in
Appearance settings
Search or jump to...
Search code, repositories, users, issues, pull requests...
-->
Search
Clear
Search syntax tips
Provide feedback
-->
We read every piece of feedback, and take your input very seriously.
Include my email address so I can be contacted
Cancel
Submit feedback
Saved searches
Use saved searches to filter your results more quickly
-->
Name
Query
To see all available qualifiers, see our documentation .
Cancel
Create saved search
Sign in
Sign up
Appearance settings
Resetting focus
You signed in with another tab or window. Reload to refresh your session.
You signed out in another tab or window. Reload to refresh your session.
You switched accounts on another tab or window. Reload to refresh your session.
Dismiss alert
{{ message }}
torrix-ai
install
Public
Notifications
You must be signed in to change notification settings
Fork
Star
17
torrix-ai/install
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
71 Commits
71 Commits
demos
demos
docs
docs
README.md
README.md
docker-compose.community.yml
docker-compose.community.yml
View all files
Repository files navigation
Torrix: AI Observability
Track every LLM request: tokens, cost, latency, full prompt traces, reasoning token capture, and PII masking. Works with OpenAI, Anthropic, Google Gemini, Groq, Mistral, Azure OpenAI, DeepSeek, Perplexity, Fireworks, Together AI, Cohere, HuggingFace, Replicate, Ollama, and any HTTP endpoint. Self-hosted, no data leaves your machine.
Try the live demo at demo.torrix.ai . No signup needed. Data is read-only and pre-loaded with sample runs.
Getting Started
The only requirement is Docker Desktop .
Mac
Open Terminal and run:
curl -o docker-compose.yml https://raw.githubusercontent.com/torrix-ai/install/main/docker-compose.community.yml
docker compose up
This downloads the community edition config and saves it as docker-compose.yml so Docker picks it up automatically.
Windows
Open PowerShell and run:
curl.exe - o docker - compose.yml https: // raw.githubusercontent.com / torrix - ai / install / main / docker - compose.community.yml
docker compose up
This downloads the community edition config and saves it as docker-compose.yml so Docker picks it up automatically.
Or download the file manually:
Go to github.com/torrix-ai/install
Click docker-compose.community.yml then click Raw
Save the file as docker-compose.yml
Open a terminal in that folder and run docker compose up
After startup
Open http://localhost:8088
Create your account
Copy your API key from Settings
Start sending LLM calls through the proxy or SDK
Verify your setup
Check the server is running (no API key needed):
curl http://localhost:8088/health
Expected response:
{ "ok" : true , "name" : " Torrix " , "version" : " 2.0.0 " }
Check runs are being logged (requires your API key from Settings):
Mac / Linux:
curl http://localhost:8088/api/runs -H " Authorization: Bearer <your-torrix-api-key> "
Windows (PowerShell):
Invoke-WebRequest http: // localhost: 8088 / api / runs - Headers @ { Authorization = " Bearer <your-torrix-api-key> " } | Select-Object - ExpandProperty Content
Returns a list of all logged runs. An empty array [] means the server is working but no runs have been sent yet.
Send a test run
Send a real request through the Torrix proxy to confirm runs appear in the dashboard. Even if the OpenAI key is invalid, Torrix will still log the attempt.
Mac / Linux:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-name: test-run " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} '
Windows (PowerShell):
Invoke-WebRequest - Method Post http: // localhost: 8088 / proxy `
- Headers @ {
" Authorization " = " Bearer <your-torrix-api-key> " ;
" x-target-url " = " https://api.openai.com/v1/chat/completions " ;
" x-upstream-authorization " = " Bearer <your-openai-key> " ;
" x-torrix-name " = " test-run "
} `
- ContentType " application/json " `
- Body ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} ' | Select-Object - ExpandProperty Content
Then open http://localhost:8088 . The run should appear in your dashboard.
Sending data to Torrix
Option 1: Python SDK
pip install torrix
OpenAI:
import torrix
from openai import OpenAI
torrix . init ( api_key = "<your-torrix-api-key>" , base_url = "http://localhost:8088" )
client = torrix . wrap ( OpenAI ( api_key = "<your-openai-key>" ))
response = client . chat . completions . create (
model = "gpt-4o-mini" ,
messages = [{ "role" : "user" , "content" : "Hello!" }],
torrix_name = "my-run" ,
print ( response . choices [ 0 ]. message . content )
Anthropic:
from anthropic import Anthropic
client = torrix . wrap ( Anthropic ( api_key = "<your-anthropic-key>" ))
response = client . messages . create (
model = "claude-3-5-sonnet-20241022" ,
max_tokens = 1024 ,
messages = [{ "role" : "user" , "content" : "Hello!" }],
torrix_name = "my-run" ,
print ( response . content [ 0 ]. text )
Streaming:
stream = client . chat . completions . create (
model = "gpt-4o-mini" ,
messages = [{ "role" : "user" , "content" : "Hello!" }],
stream = True ,
for chunk in stream :
print ( chunk . choices [ 0 ]. delta . content or "" , end = "" , flush = True )
Option 2: Node.js SDK
npm install torrix openai
# or: npm install torrix @anthropic-ai/sdk
OpenAI:
import * as torrix from 'torrix'
import OpenAI from 'openai'
torrix . init ( '<your-torrix-api-key>' , 'http://localhost:8088' )
const client = torrix . wrap ( new OpenAI ( { apiKey : '<your-openai-key>' } ) )
const response = await client . chat . completions . create ( {
model : 'gpt-4o-mini' ,
messages : [ { role : 'user' , content : 'Hello!' } ] ,
torrix_name : 'my-run' ,
} )
console . log ( response . choices [ 0 ] . message . content )
Anthropic:
import Anthropic from '@anthropic-ai/sdk'
const client = torrix . wrap ( new Anthropic ( { apiKey : '<your-anthropic-key>' } ) )
const response = await client . messages . create ( {
model : 'claude-3-5-sonnet-20241022' ,
max_tokens : 1024 ,
messages : [ { role : 'user' , content : 'Hello!' } ] ,
torrix_name : 'my-run' ,
} )
console . log ( response . content [ 0 ] . text )
Option 3: Go SDK
go get torrix.ai/sdk/go
package main
import (
"context"
"os"
torrix "torrix.ai/sdk/go"
openai "github.com/sashabaranov/go-openai"
func ptr [ T any ]( v T ) * T { return & v }
func main () {
torrix . Init ( os . Getenv ( "TORRIX_API_KEY" ),
torrix . WithBaseURL ( "http://localhost:8088" ),
client := openai . NewClient ( os . Getenv ( "OPENAI_API_KEY" ))
userMsg := "What is the capital of France?"
var resp openai. ChatCompletionResponse
latency , err := torrix . Measure ( func () error {
var e error
resp , e = client . CreateChatCompletion ( context . Background (), openai. ChatCompletionRequest {
Model : openai . GPT4oMini ,
Messages : []openai. ChatCompletionMessage {{ Role : openai . ChatMessageRoleUser , Content : userMsg }},
})
return e
})
if err != nil {
panic ( err )
reply := resp . Choices [ 0 ]. Message . Content
torrix . Ingest (torrix. IngestPayload {
Model : & resp . Model ,
InputTokens : ptr ( int ( resp . Usage . PromptTokens )),
OutputTokens : ptr ( int ( resp . Usage . CompletionTokens )),
LatencyMs : ptr ( latency . Milliseconds ()),
Status : ptr ( 200 ),
Prompt : & userMsg ,
Response : & reply ,
})
See docs/go-sdk.md for the full reference.
Option 4: C# / .NET SDK
dotnet add package Torrix
using TorrixAI ;
Torrix . Init ( "<your-torrix-api-key>" , new TorrixOptions
BaseUrl = "http://localhost:8088"
} ) ;
var chatClient = new ChatClient ( "gpt-4o-mini" , "<your-openai-key>" ) ;
var userMessage = "What is the capital of France?" ;
var ( response , latencyMs ) = await Torrix . MeasureAsync ( async ( ) =>
await chatClient . CompleteChatAsync ( userMessage ) ) ;
Torrix . Ingest ( new IngestPayload
Model = "gpt-4o-mini" ,
Provider = "openai" ,
LatencyMs = latencyMs ,
InputTokens = response . Value . Usage . InputTokenCount ,
OutputTokens = response . Value . Usage . OutputTokenCount ,
Prompt = userMessage ,
Response = response . Value . Content [ 0 ] . Text ,
} ) ;
Targets .NET 6 and above. Zero external dependencies. Works with OpenAI, Azure OpenAI, and SAP AI Core.
See docs/csharp-sdk.md for Azure OpenAI, SAP AI Core examples, and the full API reference.
Option 5: Java SDK
Maven:
< dependency >
< groupId >ai.torrix</ groupId >
< artifactId >torrix</ artifactId >
< version >0.2.0</ version >
</ dependency >
Gradle: implementation 'ai.torrix:torrix:0.2.0'
import ai . torrix .*;
Torrix . init ( System . getenv ( "TORRIX_API_KEY" ),
"http://localhost:8088" );
long start = System . currentTimeMillis ();
// ... your LLM call ...
long latencyMs = System . currentTimeMillis () - start ;
Torrix . ingest ( IngestPayload . builder ()
. model ( "gpt-4o-mini" )
. provider ( "openai" )
. latencyMs ( latencyMs )
. inputTokens ( usage . getPromptTokens ())
. outputTokens ( usage . getCompletionTokens ())
. build ());
Java 11+. Zero external dependencies. Works with Spring AI, LangChain4j, OpenAI Java SDK, and any Java HTTP client.
See docs/java-sdk.md for the full reference.
Option 6: LangChain callback
Use TorrixCallbackHandler to trace every LLM call made through a LangChain LLM or ChatModel.
pip install torrix langchain-core
import torrix
from torrix . wrappers . langchain_callback import TorrixCallbackHandler
from langchain_openai import ChatOpenAI
torrix . init ( api_key = "<your-torrix-api-key>" , base_url = "http://localhost:8088" )
handler = TorrixCallbackHandler ()
llm = ChatOpenAI ( model = "gpt-4o-mini" , callbacks = [ handler ])
response = llm . invoke ( "What is the capital of France?" )
Every invocation is logged to Torrix with model, token counts, latency, prompt, and response. Works with any LangChain LLM or ChatModel.
Option 7: HTTP Proxy (any language or tool)
Route any HTTP request through Torrix. Works with Google Gemini, Azure OpenAI, Groq, Mistral, DeepSeek, Perplexity, Fireworks, Together AI, Cohere, HuggingFace, Replicate, SAP AI Core, GitHub Copilot, n8n, Make, curl, and any OpenAI-compatible API.
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-name: my-run " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} '
Header
Description
Authorization
Your Torrix API key (from Settings)
x-target-url
The real LLM endpoint to forward to
x-upstream-authorization
Your LLM provider API key (omit if using ?key= in URL)
x-torrix-name
Optional label for this run
x-torrix-provider
Optional provider hint: openai , anthropic , google
x-torrix-trace
Optional trace ID to group multiple calls into one agent run
x-torrix-session
Optional session ID to group a multi-turn conversation
x-torrix-user-id
Optional end-user identifier. Appears in Analytics under By User.
Google Gemini (uses ?key= instead of Bearer token):
import requests
response = requests . post (
"http://localhost:8088/proxy" ,
headers = {
"Authorization" : "Bearer <your-torrix-api-key>" ,
"x-target-url" : "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=<your-gemini-key>" ,
"x-torrix-provider" : "google" ,
"x-torrix-name" : "gemini-test" ,
},
json = { "contents" : [{ "parts" : [{ "text" : "Hello!" }]}]},
Azure OpenAI:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://<your-resource>.openai.azure.com/openai/deployments/<your-deployment>/chat/completions?api-version=2024-02-01 " \
-H " x-upstream-authorization: Bearer <your-azure-key> " \
-H " x-torrix-name: azure-test " \
-H " Content-Type: application/json " \
-d ' {"messages":[{"role":"user","content":"Hello"}]} '
Groq:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.groq.com/openai/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-groq-key> " \
-H " x-torrix-name: groq-test " \
-H " Content-Type: application/json " \
-d ' {"model":"llama3-8b-8192","messages":[{"role":"user","content":"Hello"}]} '
Mistral:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.mistral.ai/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-mistral-key> " \
-H " x-torrix-name: mistral-test " \
-H " Content-Type: application/json " \
-d ' {"model":"mistral-small-latest","messages":[{"role":"user","content":"Hello"}]} '
DeepSeek:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.deepseek.com/chat/completions " \
-H " x-upstream-authorization: Bearer <your-deepseek-key> " \
-H " x-torrix-name: deepseek-test " \
-H " Content-Type: application/json " \
-d ' {"model":"deepseek-chat","messages":[{"role":"user","content":"Hello!"}]} '
Ollama (local models):
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: http://host.docker.internal:11434/v1/chat/completions " \
-H " x-torrix-name: ollama-test " \
-H " Content-Type: application/json " \
-d ' {"model":"llama3.2","messages":[{"role":"user","content":"Hello!"}]} '
No API key needed for Ollama. Omit x-upstream-authorization . Use host.docker.internal instead of localhost when running Torrix in Docker on Mac or Windows. On Linux, use your machine's actual IP address (e.g. 172.17.0.1 ) instead.
Per-user cost tracking
Attribute runs to your end-users by passing a user identifier on each request.
Via the proxy header:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-user-id: alice " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} '
Via the Python SDK ingest:
torrix . ingest ( model = "gpt-4o-mini" , ..., user_id = "alice" )
The Analytics page shows a By User table with per-user request counts, token totals, and cost breakdown.
n8n workflow: Use the HTTP Request node pointed at http://host.docker.internal:8088/proxy with these headers:
Header
Value
Authorization
Bearer <your-torrix-api-key>
x-target-url
https://api.openai.com/v1/chat/completions
x-upstream-authorization
Bearer <your-openai-key>
Content-Type
application/json
n8n Community Node
Install the official Torrix node directly in n8n for a native drag-and-drop experience:
In n8n, go to Settings → Community Nodes
Click Install and enter @torrix-ai/n8n-nodes-torrix
Restart n8n when prompted
The Torrix Proxy node will appear in your node palette
Or import the ready-to-use workflow template:
Download torrix-workflow-template.json
In n8n, go to Workflows → Import from file
Follow the setup notes inside the workflow
Option 8: Browser Extension
The Torrix Chrome extension captures conversations from AI chat platforms without any code changes or API key rerouting.
Supported platforms: ChatGPT, Claude, Gemini, Perplexity, Grok, Microsoft Copilot, Mistral
Option 9: OpenTelemetry (zero-SDK)
Point any OpenTelemetry GenAI instrumentation library at Torrix. No Torrix SDK needed.
Set your OTLP exporter endpoint to http://localhost:8088/v1/traces and pass your Torrix API key via Authorization: Bearer trxk_... .
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:8088
export OTEL_EXPORTER_OTLP_HEADERS= " Authorization=Bearer trxk_your_key_here "
Works with opentelemetry-instrumentation-openai (Python), Spring AI OTel (Java), @arizeai/openinference-instrumentation-openai (Node.js), and any library that emits gen_ai.* span attributes.
See docs/otel.md for full setup examples.
Option 10: MCP Tool Proxy
Route any HTTP MCP client through Torrix to log every tools/call invocation with the tool name, arguments, result, latency, and status. Handshake messages ( initialize , tools/list , ping ) are forwarded silently without logging.
curl -X POST http://localhost:8088/mcp-proxy \
-H " Authorization: Bearer trxk_your_key_here " \
-H " x-target-mcp-url: https://your-mcp-server.com/mcp " \
-H " Content-Type: application/json " \
-d ' {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search","arguments":{"query":"hello"}}} '
Pass x-torrix-trace to link tool calls to a parent LLM run in the trace view.
See docs/mcp-proxy.md for Claude Desktop, Cursor, and Python agent setup examples.
Setup:
Install the Torrix extension from the Chrome Web Store (coming soon)
Open the extension popup and click the settings icon
Enter your Torrix server URL (default: http://localhost:8088 ) and API key
Use any supported AI platform normally. Every conversation is captured automatically.
All captured data goes directly to your Torrix instance. Nothing is sent to Torrix or to any third party.
Agent trace grouping
Add x-torrix-trace to every call in an agent run to group them into a single chain timeline. Generate one UUID per agent invocation and reuse it across all steps:
TRACE_ID= $( python3 -c " import uuid; print(uuid.uuid4()) " )
# Step 1
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-trace: $TRACE_ID " \
-H " x-torrix-name: classify " \
-H " Content-Type: applicati

## full_text

GitHub - torrix-ai/install · GitHub
Skip to content
Navigation Menu
Toggle navigation
Sign in
Appearance settings
Search or jump to...
Search code, repositories, users, issues, pull requests...
-->
Search
Clear
Search syntax tips
Provide feedback
-->
We read every piece of feedback, and take your input very seriously.
Include my email address so I can be contacted
Cancel
Submit feedback
Saved searches
Use saved searches to filter your results more quickly
-->
Name
Query
To see all available qualifiers, see our documentation .
Cancel
Create saved search
Sign in
Sign up
Appearance settings
Resetting focus
You signed in with another tab or window. Reload to refresh your session.
You signed out in another tab or window. Reload to refresh your session.
You switched accounts on another tab or window. Reload to refresh your session.
Dismiss alert
{{ message }}
torrix-ai
install
Public
Notifications
You must be signed in to change notification settings
Fork
Star
17
torrix-ai/install
main
Branches Tags
Go to file
Code Open more actions menu
Folders and files
Name Name Last commit message
Last commit date
Latest commit
History
71 Commits
71 Commits
demos
demos
docs
docs
README.md
README.md
docker-compose.community.yml
docker-compose.community.yml
View all files
Repository files navigation
Torrix: AI Observability
Track every LLM request: tokens, cost, latency, full prompt traces, reasoning token capture, and PII masking. Works with OpenAI, Anthropic, Google Gemini, Groq, Mistral, Azure OpenAI, DeepSeek, Perplexity, Fireworks, Together AI, Cohere, HuggingFace, Replicate, Ollama, and any HTTP endpoint. Self-hosted, no data leaves your machine.
Try the live demo at demo.torrix.ai . No signup needed. Data is read-only and pre-loaded with sample runs.
Getting Started
The only requirement is Docker Desktop .
Mac
Open Terminal and run:
curl -o docker-compose.yml https://raw.githubusercontent.com/torrix-ai/install/main/docker-compose.community.yml
docker compose up
This downloads the community edition config and saves it as docker-compose.yml so Docker picks it up automatically.
Windows
Open PowerShell and run:
curl.exe - o docker - compose.yml https: // raw.githubusercontent.com / torrix - ai / install / main / docker - compose.community.yml
docker compose up
This downloads the community edition config and saves it as docker-compose.yml so Docker picks it up automatically.
Or download the file manually:
Go to github.com/torrix-ai/install
Click docker-compose.community.yml then click Raw
Save the file as docker-compose.yml
Open a terminal in that folder and run docker compose up
After startup
Open http://localhost:8088
Create your account
Copy your API key from Settings
Start sending LLM calls through the proxy or SDK
Verify your setup
Check the server is running (no API key needed):
curl http://localhost:8088/health
Expected response:
{ "ok" : true , "name" : " Torrix " , "version" : " 2.0.0 " }
Check runs are being logged (requires your API key from Settings):
Mac / Linux:
curl http://localhost:8088/api/runs -H " Authorization: Bearer <your-torrix-api-key> "
Windows (PowerShell):
Invoke-WebRequest http: // localhost: 8088 / api / runs - Headers @ { Authorization = " Bearer <your-torrix-api-key> " } | Select-Object - ExpandProperty Content
Returns a list of all logged runs. An empty array [] means the server is working but no runs have been sent yet.
Send a test run
Send a real request through the Torrix proxy to confirm runs appear in the dashboard. Even if the OpenAI key is invalid, Torrix will still log the attempt.
Mac / Linux:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-name: test-run " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} '
Windows (PowerShell):
Invoke-WebRequest - Method Post http: // localhost: 8088 / proxy `
- Headers @ {
" Authorization " = " Bearer <your-torrix-api-key> " ;
" x-target-url " = " https://api.openai.com/v1/chat/completions " ;
" x-upstream-authorization " = " Bearer <your-openai-key> " ;
" x-torrix-name " = " test-run "
} `
- ContentType " application/json " `
- Body ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} ' | Select-Object - ExpandProperty Content
Then open http://localhost:8088 . The run should appear in your dashboard.
Sending data to Torrix
Option 1: Python SDK
pip install torrix
OpenAI:
import torrix
from openai import OpenAI
torrix . init ( api_key = "<your-torrix-api-key>" , base_url = "http://localhost:8088" )
client = torrix . wrap ( OpenAI ( api_key = "<your-openai-key>" ))
response = client . chat . completions . create (
model = "gpt-4o-mini" ,
messages = [{ "role" : "user" , "content" : "Hello!" }],
torrix_name = "my-run" ,
print ( response . choices [ 0 ]. message . content )
Anthropic:
from anthropic import Anthropic
client = torrix . wrap ( Anthropic ( api_key = "<your-anthropic-key>" ))
response = client . messages . create (
model = "claude-3-5-sonnet-20241022" ,
max_tokens = 1024 ,
messages = [{ "role" : "user" , "content" : "Hello!" }],
torrix_name = "my-run" ,
print ( response . content [ 0 ]. text )
Streaming:
stream = client . chat . completions . create (
model = "gpt-4o-mini" ,
messages = [{ "role" : "user" , "content" : "Hello!" }],
stream = True ,
for chunk in stream :
print ( chunk . choices [ 0 ]. delta . content or "" , end = "" , flush = True )
Option 2: Node.js SDK
npm install torrix openai
# or: npm install torrix @anthropic-ai/sdk
OpenAI:
import * as torrix from 'torrix'
import OpenAI from 'openai'
torrix . init ( '<your-torrix-api-key>' , 'http://localhost:8088' )
const client = torrix . wrap ( new OpenAI ( { apiKey : '<your-openai-key>' } ) )
const response = await client . chat . completions . create ( {
model : 'gpt-4o-mini' ,
messages : [ { role : 'user' , content : 'Hello!' } ] ,
torrix_name : 'my-run' ,
} )
console . log ( response . choices [ 0 ] . message . content )
Anthropic:
import Anthropic from '@anthropic-ai/sdk'
const client = torrix . wrap ( new Anthropic ( { apiKey : '<your-anthropic-key>' } ) )
const response = await client . messages . create ( {
model : 'claude-3-5-sonnet-20241022' ,
max_tokens : 1024 ,
messages : [ { role : 'user' , content : 'Hello!' } ] ,
torrix_name : 'my-run' ,
} )
console . log ( response . content [ 0 ] . text )
Option 3: Go SDK
go get torrix.ai/sdk/go
package main
import (
"context"
"os"
torrix "torrix.ai/sdk/go"
openai "github.com/sashabaranov/go-openai"
func ptr [ T any ]( v T ) * T { return & v }
func main () {
torrix . Init ( os . Getenv ( "TORRIX_API_KEY" ),
torrix . WithBaseURL ( "http://localhost:8088" ),
client := openai . NewClient ( os . Getenv ( "OPENAI_API_KEY" ))
userMsg := "What is the capital of France?"
var resp openai. ChatCompletionResponse
latency , err := torrix . Measure ( func () error {
var e error
resp , e = client . CreateChatCompletion ( context . Background (), openai. ChatCompletionRequest {
Model : openai . GPT4oMini ,
Messages : []openai. ChatCompletionMessage {{ Role : openai . ChatMessageRoleUser , Content : userMsg }},
})
return e
})
if err != nil {
panic ( err )
reply := resp . Choices [ 0 ]. Message . Content
torrix . Ingest (torrix. IngestPayload {
Model : & resp . Model ,
InputTokens : ptr ( int ( resp . Usage . PromptTokens )),
OutputTokens : ptr ( int ( resp . Usage . CompletionTokens )),
LatencyMs : ptr ( latency . Milliseconds ()),
Status : ptr ( 200 ),
Prompt : & userMsg ,
Response : & reply ,
})
See docs/go-sdk.md for the full reference.
Option 4: C# / .NET SDK
dotnet add package Torrix
using TorrixAI ;
Torrix . Init ( "<your-torrix-api-key>" , new TorrixOptions
BaseUrl = "http://localhost:8088"
} ) ;
var chatClient = new ChatClient ( "gpt-4o-mini" , "<your-openai-key>" ) ;
var userMessage = "What is the capital of France?" ;
var ( response , latencyMs ) = await Torrix . MeasureAsync ( async ( ) =>
await chatClient . CompleteChatAsync ( userMessage ) ) ;
Torrix . Ingest ( new IngestPayload
Model = "gpt-4o-mini" ,
Provider = "openai" ,
LatencyMs = latencyMs ,
InputTokens = response . Value . Usage . InputTokenCount ,
OutputTokens = response . Value . Usage . OutputTokenCount ,
Prompt = userMessage ,
Response = response . Value . Content [ 0 ] . Text ,
} ) ;
Targets .NET 6 and above. Zero external dependencies. Works with OpenAI, Azure OpenAI, and SAP AI Core.
See docs/csharp-sdk.md for Azure OpenAI, SAP AI Core examples, and the full API reference.
Option 5: Java SDK
Maven:
< dependency >
< groupId >ai.torrix</ groupId >
< artifactId >torrix</ artifactId >
< version >0.2.0</ version >
</ dependency >
Gradle: implementation 'ai.torrix:torrix:0.2.0'
import ai . torrix .*;
Torrix . init ( System . getenv ( "TORRIX_API_KEY" ),
"http://localhost:8088" );
long start = System . currentTimeMillis ();
// ... your LLM call ...
long latencyMs = System . currentTimeMillis () - start ;
Torrix . ingest ( IngestPayload . builder ()
. model ( "gpt-4o-mini" )
. provider ( "openai" )
. latencyMs ( latencyMs )
. inputTokens ( usage . getPromptTokens ())
. outputTokens ( usage . getCompletionTokens ())
. build ());
Java 11+. Zero external dependencies. Works with Spring AI, LangChain4j, OpenAI Java SDK, and any Java HTTP client.
See docs/java-sdk.md for the full reference.
Option 6: LangChain callback
Use TorrixCallbackHandler to trace every LLM call made through a LangChain LLM or ChatModel.
pip install torrix langchain-core
import torrix
from torrix . wrappers . langchain_callback import TorrixCallbackHandler
from langchain_openai import ChatOpenAI
torrix . init ( api_key = "<your-torrix-api-key>" , base_url = "http://localhost:8088" )
handler = TorrixCallbackHandler ()
llm = ChatOpenAI ( model = "gpt-4o-mini" , callbacks = [ handler ])
response = llm . invoke ( "What is the capital of France?" )
Every invocation is logged to Torrix with model, token counts, latency, prompt, and response. Works with any LangChain LLM or ChatModel.
Option 7: HTTP Proxy (any language or tool)
Route any HTTP request through Torrix. Works with Google Gemini, Azure OpenAI, Groq, Mistral, DeepSeek, Perplexity, Fireworks, Together AI, Cohere, HuggingFace, Replicate, SAP AI Core, GitHub Copilot, n8n, Make, curl, and any OpenAI-compatible API.
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-name: my-run " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} '
Header
Description
Authorization
Your Torrix API key (from Settings)
x-target-url
The real LLM endpoint to forward to
x-upstream-authorization
Your LLM provider API key (omit if using ?key= in URL)
x-torrix-name
Optional label for this run
x-torrix-provider
Optional provider hint: openai , anthropic , google
x-torrix-trace
Optional trace ID to group multiple calls into one agent run
x-torrix-session
Optional session ID to group a multi-turn conversation
x-torrix-user-id
Optional end-user identifier. Appears in Analytics under By User.
Google Gemini (uses ?key= instead of Bearer token):
import requests
response = requests . post (
"http://localhost:8088/proxy" ,
headers = {
"Authorization" : "Bearer <your-torrix-api-key>" ,
"x-target-url" : "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=<your-gemini-key>" ,
"x-torrix-provider" : "google" ,
"x-torrix-name" : "gemini-test" ,
},
json = { "contents" : [{ "parts" : [{ "text" : "Hello!" }]}]},
Azure OpenAI:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://<your-resource>.openai.azure.com/openai/deployments/<your-deployment>/chat/completions?api-version=2024-02-01 " \
-H " x-upstream-authorization: Bearer <your-azure-key> " \
-H " x-torrix-name: azure-test " \
-H " Content-Type: application/json " \
-d ' {"messages":[{"role":"user","content":"Hello"}]} '
Groq:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.groq.com/openai/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-groq-key> " \
-H " x-torrix-name: groq-test " \
-H " Content-Type: application/json " \
-d ' {"model":"llama3-8b-8192","messages":[{"role":"user","content":"Hello"}]} '
Mistral:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.mistral.ai/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-mistral-key> " \
-H " x-torrix-name: mistral-test " \
-H " Content-Type: application/json " \
-d ' {"model":"mistral-small-latest","messages":[{"role":"user","content":"Hello"}]} '
DeepSeek:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.deepseek.com/chat/completions " \
-H " x-upstream-authorization: Bearer <your-deepseek-key> " \
-H " x-torrix-name: deepseek-test " \
-H " Content-Type: application/json " \
-d ' {"model":"deepseek-chat","messages":[{"role":"user","content":"Hello!"}]} '
Ollama (local models):
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: http://host.docker.internal:11434/v1/chat/completions " \
-H " x-torrix-name: ollama-test " \
-H " Content-Type: application/json " \
-d ' {"model":"llama3.2","messages":[{"role":"user","content":"Hello!"}]} '
No API key needed for Ollama. Omit x-upstream-authorization . Use host.docker.internal instead of localhost when running Torrix in Docker on Mac or Windows. On Linux, use your machine's actual IP address (e.g. 172.17.0.1 ) instead.
Per-user cost tracking
Attribute runs to your end-users by passing a user identifier on each request.
Via the proxy header:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-user-id: alice " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} '
Via the Python SDK ingest:
torrix . ingest ( model = "gpt-4o-mini" , ..., user_id = "alice" )
The Analytics page shows a By User table with per-user request counts, token totals, and cost breakdown.
n8n workflow: Use the HTTP Request node pointed at http://host.docker.internal:8088/proxy with these headers:
Header
Value
Authorization
Bearer <your-torrix-api-key>
x-target-url
https://api.openai.com/v1/chat/completions
x-upstream-authorization
Bearer <your-openai-key>
Content-Type
application/json
n8n Community Node
Install the official Torrix node directly in n8n for a native drag-and-drop experience:
In n8n, go to Settings → Community Nodes
Click Install and enter @torrix-ai/n8n-nodes-torrix
Restart n8n when prompted
The Torrix Proxy node will appear in your node palette
Or import the ready-to-use workflow template:
Download torrix-workflow-template.json
In n8n, go to Workflows → Import from file
Follow the setup notes inside the workflow
Option 8: Browser Extension
The Torrix Chrome extension captures conversations from AI chat platforms without any code changes or API key rerouting.
Supported platforms: ChatGPT, Claude, Gemini, Perplexity, Grok, Microsoft Copilot, Mistral
Option 9: OpenTelemetry (zero-SDK)
Point any OpenTelemetry GenAI instrumentation library at Torrix. No Torrix SDK needed.
Set your OTLP exporter endpoint to http://localhost:8088/v1/traces and pass your Torrix API key via Authorization: Bearer trxk_... .
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:8088
export OTEL_EXPORTER_OTLP_HEADERS= " Authorization=Bearer trxk_your_key_here "
Works with opentelemetry-instrumentation-openai (Python), Spring AI OTel (Java), @arizeai/openinference-instrumentation-openai (Node.js), and any library that emits gen_ai.* span attributes.
See docs/otel.md for full setup examples.
Option 10: MCP Tool Proxy
Route any HTTP MCP client through Torrix to log every tools/call invocation with the tool name, arguments, result, latency, and status. Handshake messages ( initialize , tools/list , ping ) are forwarded silently without logging.
curl -X POST http://localhost:8088/mcp-proxy \
-H " Authorization: Bearer trxk_your_key_here " \
-H " x-target-mcp-url: https://your-mcp-server.com/mcp " \
-H " Content-Type: application/json " \
-d ' {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search","arguments":{"query":"hello"}}} '
Pass x-torrix-trace to link tool calls to a parent LLM run in the trace view.
See docs/mcp-proxy.md for Claude Desktop, Cursor, and Python agent setup examples.
Setup:
Install the Torrix extension from the Chrome Web Store (coming soon)
Open the extension popup and click the settings icon
Enter your Torrix server URL (default: http://localhost:8088 ) and API key
Use any supported AI platform normally. Every conversation is captured automatically.
All captured data goes directly to your Torrix instance. Nothing is sent to Torrix or to any third party.
Agent trace grouping
Add x-torrix-trace to every call in an agent run to group them into a single chain timeline. Generate one UUID per agent invocation and reuse it across all steps:
TRACE_ID= $( python3 -c " import uuid; print(uuid.uuid4()) " )
# Step 1
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-trace: $TRACE_ID " \
-H " x-torrix-name: classify " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Classify this ticket..."}]} '
# Step 2 - same TRACE_ID links it to step 1
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-trace: $TRACE_ID " \
-H " x-torrix-name: respond " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o","messages":[{"role":"user","content":"Now write a reply..."}]} '
Both runs appear in the Runs list with a trace badge. Click it to open the chain timeline showing each step with its model, tokens, cost, and latency.
Conversation session grouping
Add x-torrix-session to every call in a multi-turn conversation to group them together. Generate one session ID per conversation and reuse it across all turns:
SESSION_ID= $( python3 -c " import uuid; print(uuid.uuid4()) " )
# Turn 1
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-session: $SESSION_ID " \
-H " x-torrix-name: user-message-1 " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} '
# Turn 2 - same SESSION_ID links it to turn 1
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-session: $SESSION_ID " \
-H " x-torrix-name: user-message-2 " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Follow-up question"}]} '
Runs appear with a session badge showing the turn count. Click it to see the full conversation with combined cost and tokens.
Real-time cost tracking
Every API call is logged with token counts, model, cost, and latency. See exactly what you're spending as it happens.
Regression testing (Evals)
Mark any run as a golden baseline. Replay it against the LLM with one click and compare outputs side-by-side. Catch regressions when switching models or changing prompts.
Use the checkbox on each row on the Evals page to select individual golden runs or all at once, then click Export JSONL to download an OpenAI-compatible fine-tuning file.
Model cost comparison
On any run detail page, see what the same request would have cost across 300+ models, live priced and sorted cheapest to most expensive.
Budget controls
Set a soft alert threshold and a hard cap from Settings.
Alert threshold: Torrix fires a webhook when your daily spend crosses it. Fires once per day. Slack webhook URLs ( https://hooks.slack.com/ ) are automatically formatted as native Slack Block Kit messages.
Hard cap: When set, the proxy returns 429 Too Many Requests as soon as the daily spend exceeds the cap. No further LLM calls are made until midnight. Prevents runaway agent loops from generating unexpected overnight costs.
Cost anomaly detection: Torrix compares each run's cost against the p95 baseline for that model over the last 30 days. If a run exceeds the spike multiplier (default 3x) it is badged as a spike in the runs list and optionally fires a webhook with event: cost_anomaly . Requires at least 10 prior runs for the model. Configure in Settings > Alerts.
# This request will be blocked with 429 if your hard cap is set and daily spend exceeded
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
# ...
Request sampling
Add x-torrix-sample to log only a fraction of requests while forwarding all of them to the LLM:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-sample: 0.1 " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} '
The value is a float between 0 and 1. 0.1 logs roughly 10% of requests. 1 logs all (the default when the header is omitted). 0 logs nothing. Errors are always logged regardless of sample rate. Useful for high-volume production deployments where you want cost and latency trends without storing every individual run.
Global default sample rate
Set a default rate for all requests at the instance level from Settings. When set, every request that does not include an x-torrix-sample header is sampled at the configured rate. Per-request headers always override the global setting.
Structured JSON export
Export your full run history from the Runs page. Two formats are available:
CSV : comma-separated with all fields, compatible with spreadsheets and most analytics tools
JSON : full-fidelity export including model, provider, input and output tokens, cost, latency, prompt body, response text, finish reason, trace ID, session ID, and project
The export button is in the Runs page toolbar. Both formats respect any active filters and project scope, so you can export exactly the subset of data you need.
Multi-project namespaces
Organize runs into named projects to separate workloads and filter observability data by scope.
Tag a request with a project name at send time:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-project: my-chatbot " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]} '
The header accepts either the project name or its UUID. If no project with that name exists yet, create one from the project selector in the sidebar.
Switch the active project from any page (Home, Analytics, Runs, Evals) to scope all displayed data to that project. Selecting "All projects" restores the aggregate view across all projects.
Multimodal trace support
Image content sent through the proxy is automatically captured in run traces. URL images appear as inline thumbnails in the run detail panel. Base64 images show as compact size badges with the MIME type and approximate byte size.
Send image content using the standard provider format:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " Content-Type: application/json " \
-d ' {
"model": "gpt-4o-mini",
"messages": [{
"role": "user",
"content": [
{"type": "text", "text": "Describe this image."},
{"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
}]
} '
No extra headers or configuration are needed. Torrix detects multimodal content blocks in OpenAI, Anthropic, and Gemini request formats and renders them in the run detail panel automatically.
Tool call tracing
Every tool call made by an agent is automatically captured as a separate event in the run trace. Works with OpenAI function calling, Anthropic tool use, and Gemini function calling. Open any run detail page and the Event Timeline shows each tool that fired, with its name and arguments.
No extra headers or configuration needed. Torrix extracts tool calls from the upstream response automatically.
Outbound webhooks
Torrix fires HTTP webhooks on two events:
Budget threshold crossed : fires when your daily spend reaches the alert threshold (once per day)
LLM request error : fires when an upstream request returns HTTP 4xx or 5xx
Configure the webhook URL in Settings. Slack webhook URLs ( https://hooks.slack.com/ ) are automatically formatted as native Slack Block Kit messages. All other URLs receive a JSON payload.
See docs/webhooks.md for payload shapes and PagerDuty setup.
Weekly cost digest (Pro)
Enable a weekly cost summary webhook that fires every 7 days with:
Total spend for the period
Total runs and error count
Top 5 models by cost
Week-over-week comparison (cost and run count change %)
The digest reuses your existing webhook URL from Budget Controls. Slack webhook URLs receive a native Block Kit message. Toggle it on in Settings with a single checkbox. See docs/webhooks.md for the full payload format.
Model routing rules (Pro)
Auto-rewrite the model field in proxy requests before they reach the upstream provider. Create rules in Settings like "swap gpt-4o to gpt-4o-mini " to optimize cost without changing any application code.
Rules can also match on prompt content instead of model name. Set condition type to Prompt contains keyword or Prompt matches regex in Settings. For example, a rule that matches translate in the prompt and routes to gpt-4o-mini will only apply when the user message contains that word.
When a rule matches:
The request is forwarded with the rewritten model name
The response includes an x-torrix-routed-from header showing the original model
The run detail page displays a "Routed from" badge for audit
Fallback model: Each routing rule accepts an optional fallback model. If the primary model returns a 404 (model not found), 429 (rate limited), or any 5xx server error, the proxy automatically retries the request with the fallback model before returning to the caller. Runs that triggered the fallback are marked with an amber badge in the Runs table. No application code changes are needed.
# gpt-4o → sent to nonexistent-model → 404 → retried as gpt-3.5-turbo automatically
curl http://localhost:8088/proxy \
-H " Authorization: Bearer <torrix-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <openai-key> " \
-H " Content-Type: application/json " \
-d ' {"model":"nonexistent-model","messages":[{"role":"user","content":"hello"}]} '
Rules are managed via the Settings page (Pro only) or the REST API:
GET /api/routing-rules
POST /api/routing-rules
DELETE /api/routing-rules/:id
OpenTelemetry receiver
Torrix accepts OTLP/HTTP (JSON) traces at POST /v1/traces . Any application already instrumented with the OpenTelemetry SDK can send LLM spans to Torrix with no additional code changes.
curl -X POST http://localhost:8088/v1/traces \
-H " x-torrix-api-key: <your-torrix-api-key> " \
-H " Content-Type: application/json " \
-d ' {
"resourceSpans": [{
"scopeSpans": [{
"spans": [{
"name": "chat",
"startTimeUnixNano": "1714220000000000000",
"endTimeUnixNano": "1714220001500000000",
"attributes": [
{"key": "gen_ai.system", "value": {"stringValue": "openai"}},
{"key": "gen_ai.request.model", "value": {"stringValue": "gpt-4o-mini"}},
{"key": "gen_ai.usage.input_tokens", "value": {"intValue": 512}},
{"key": "gen_ai.usage.output_tokens", "value": {"intValue": 128}}
}]
}]
}]
} '
See docs/otel.md for the full attribute mapping table and a Python SDK example.
Cost forecasting
The home dashboard shows a projected month-end spend figure beneath the budget status bar. Torrix calculates your average daily cost from the current month's runs and extrapolates it to the end of the month. The forecast is color-coded: green when on track, amber when approaching your budget, and red when the projection exceeds it. No extra configuration is needed beyond setting a budget in Settings.
Per-project and per-key budget limits
In addition to the global daily cap, you can set a daily spending limit scoped to an individual project or API key. Go to Settings > Budget and Sampling and use the Per-project and Per-key Limits card to add a cap. Select a project or API key from the dropdown, enter the daily limit in USD, then click Add.
When a proxy request arrives with x-torrix-project: <name> and that project has already reached its daily cap, Torrix returns a 429 before making the upstream call:
{ "error" : " Project budget cap exceeded " , "detail" : " Daily cap of $0.50 reached for this project. " }
Per-key limits work the same way using the API key that authenticates the request. The global hard cap and per-scope limits are checked independently, so whichever limit is reached first takes effect.
Streaming instrumentation
Streaming responses (requests sent with "stream": true or Accept: text/event-stream ) are fully instrumented with no added latency. Torrix accumulates SSE chunks while piping them to your client in real time. When the stream closes, each run is backfilled with:
Model name, input and output token counts, and cost
Full response text saved as a RESPONSE event in the timeline
Chain-of-thought reasoning saved as a THINKING event (Kimi K2, DeepSeek R1, Qwen3, and similar thinking models that emit delta.reasoning chunks)
Tool calls saved as TOOL CALL events, identical to non-streaming tool call tracing
Supported formats: OpenAI-compatible (OpenAI, Groq, Mistral, NVIDIA, Together, Ollama) and Anthropic. NVIDIA-hosted models that send usage in a dedicated final chunk (e.g. Kimi K2.5, DeepSeek R1) are fully supported.
Thinking & reasoning capture
Captures chain-of-thought reasoning from OpenAI o1/o3/o4, DeepSeek R1, Claude extended thinking, Gemini 2.5, Ollama Qwen3, and Kimi K2. Reasoning steps appear in the Event Timeline alongside the final response. Works for both standard and streaming requests. Reasoning tokens are tracked separately where the model reports them.
Run scoring and LLM judge
Rate any run good or bad manually with a thumbs up or down, or let an AI judge evaluate it automatically.
Manual scoring: Click the thumbs up or thumbs down button on any run detail page. Add an optional note to record why.
Auto-score with AI judge: Click Auto-score with AI on the run detail page. The judge evaluates:
Prompt quality: clarity, specificity, and whether it follows LLM best practices
Response correctness, helpfulness, and appropriate detail level
Token and latency efficiency: whether usage is proportionate to the task complexity
Reasoning depth (for runs with chain-of-thought): whether the thinking effort matches the task
Select a provider (OpenAI-compatible or Anthropic), paste your API key, optionally set a custom model or base URL, and click Auto-score . Configure your judge provider and API key once in Settings > AI Judge and Torrix stores it securely for all evaluations. In the run detail panel, use Use Judge LLM to score with the saved key, or switch to Manual to enter credentials inline for a one-off evaluation.
Batch scoring: On the Runs page, use the Batch auto-score panel to score multiple runs at once with one click. Saves your judge settings across sessions.
Online Evals (Pro): Enable per project in Settings > Online Evals to automatically score every incoming production run as it arrives. The AI judge runs in the background after each new run is logged. Judge eval costs are tracked separately under Analytics and do not affect your production LLM spend figures.
Filtering and export: Use the Score filter on the Runs page to show only good, bad, or unscored runs. Export to CSV to build a labelled dataset for offline eval pipelines. The CSV includes score and score_note columns.
Shareable run links
Share any run trace with a teammate or in a bug report without requiring a Torrix account.
Open any run in the run detail panel.
Click Share in the panel header.
The public URL is copied to your clipboard.
Anyone with the link can view the model, provider, cost, latency, token counts, prompt, and response. The link can be revoked at any time: click Revoke in the panel header to unshare the run.
Dataset evals
Create named test suites with inputs and expected outputs. Go to Evals > Datasets , add rows (input, optional expected output, optional row name), and click Run to batch-test against any model.
Each row is auto-scored: exact match is checked first (case-insensitive, punctuation-trimmed), then an LLM judge is used as a fallback. Pass rates are tracked per dataset across all runs.
See docs/datasets.md for a full walkthrough.
Community: 3 datasets, 10 rows each. Pro: unlimited.
Custom run tags
Attach arbitrary key-value metadata to any LLM call. Tags appear as color chips in the Runs table and are filterable.
Via the proxy header:
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-api-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <your-openai-key> " \
-H " x-torrix-tags: env=prod,team=backend,feature=summarizer " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Summarize this article..."}]} '
Via the Python SDK:
import torrix
import openai
torrix . init ( api_key = "trxk_..." , base_url = "http://localhost:8088" )
client = torrix . wrap ( openai . OpenAI ( api_key = "sk-..." ))
response = client . chat . completions . create (
model = "gpt-4o-mini" ,
messages = [{ "role" : "user" , "content" : "Hello" }],
extra_headers = { "x-torrix-tags" : "env=prod,team=backend" }
Tags use a comma-separated key=value format. Any key or value is accepted. Use the tag filter on the Runs page to narrow runs by any tag key or value.
Prompt management and versioning
Create named prompts with a system prompt and user template, publish versions, and test directly in the Playground.
Creating a prompt:
Go to Prompts in the sidebar.
Click New Prompt .
Enter a name, an optional description, and optionally a system prompt and user template.
Click Create . If you entered prompt content, version 1 is created and set as active automatically.
Adding versions:
Click Add version on any prompt to save a new revision with updated content. Each version is numbered sequentially. Mark any version as active to make it the production version.
Testing in the Playground:
Use the Load from Prompt Library dropdown in the Playground to fill the system and user fields from the active version of any prompt. After editing, click Save as prompt to save your changes as a new version.
Compare models:
Switch to Compare mode in the Playground to run the same prompt against two different provider and model combinations in parallel. Both responses stream independently. When both finish, a summary line shows which model was faster and which was cheaper.
API:
# List all prompts
GET /api/prompts
# Create a prompt
POST /api/prompts
{ " name " : " Support reply " , " description " : " Customer support tone " }
# Add a version
POST /api/prompts/:id/versions
{ " system_prompt " : " You are a support agent. " , " user_prompt_template " : " Reply to: {{message}} " }
# Set a version active
PUT /api/prompts/:id/versions/:vid/activate
# Get the active version
GET /api/prompts/:id/active
SQL query interface
Run any SELECT statement directly against your Torrix database from the browser. Click Query in the sidebar to open the query editor.
A schema reference panel lists all available tables and columns. Press Ctrl+Enter (or Cmd+Enter on Mac) to run a query. Results render as a table with row count and execution time, and can be exported as CSV.
Only SELECT statements are allowed. DROP , DELETE , UPDATE , INSERT , ALTER , and CREATE are blocked. Results are capped at 500 rows.
See docs/sql-query.md for example queries and the full table reference.
Agent trace tree If parent-child span relationships are captured, the page renders a collapsible nested tree instead of a flat Gantt timeline.
Via OTLP (automatic): Spans sent to POST /v1/traces are linked automatically using the standard parentSpanId field. No extra configuration needed.
Via the proxy: Pass the parent run ID in a header:
# First call becomes the parent
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <openai-key> " \
-H " x-torrix-trace: my-trace-id " \
-H " x-torrix-name: Orchestrator " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Plan the task"}]} '
# Second call is a child of the first (use the run ID from the dashboard or x-run-id response header)
curl -X POST http://localhost:8088/proxy \
-H " Authorization: Bearer <your-torrix-key> " \
-H " x-target-url: https://api.openai.com/v1/chat/completions " \
-H " x-upstream-authorization: Bearer <openai-key> " \
-H " x-torrix-trace: my-trace-id " \
-H " x-torrix-parent-run-id: <parent-run-id> " \
-H " x-torrix-name: Tool: summarize " \
-H " Content-Type: application/json " \
-d ' {"model":"gpt-4o-mini","messages":[{"role":"user","content":"Summarize this"}]} '
Open /ui/traces/my-trace-id to see the tree. Use the Tree / Flat toggle to switch views. Traces with no parent data fall back to the flat timeline automatically.
MCP server
Torrix includes a built-in MCP server so any MCP-compatible AI assistant can query your observability data directly.
Available tools
Tool
What it returns
get_dashboard
Aggregated stats: total cost, tokens, run count, error count, latency percentiles, top models
list_runs
Recent runs with optional filters for model, provider, and HTTP status
get_run
Full detail for one run including the prompt and response text
get_trace
All steps in an agent trace with per-step cost and latency
get_session
All turns in a conversation session with a combined cost total
compare_runs
Side-by-side comparison of two runs: model, cost, latency, prompt, both responses
Setup for Claude Desktop, Cursor, or Windsurf
Add this to your MCP configuration file:
"mcpServers" : {
"torrix" : {
"command" : " npx " ,
"args" : [ " -y " , " mcp-remote " , " http://localhost:8088/mcp " ],
"env" : {
"MCP_HEADER_AUTHORIZATION" : " Bearer YOUR_TORRIX_API_KEY "
Replace YOUR_TORRIX_API_KEY with a key from Settings. Restart your AI client after saving.
MCP server observability
Every MCP tool call is logged as a run in Torrix. Open the Runs table and filter by source mcp to see which tools your AI assistant called, how long each took, and whether it succeeded. The run detail panel shows the full tool arguments in the Event Timeline.
Editions
Community is free forever. Pro is live at founding-member pricing. Enterprise is coming soon.
Feature
Community
Pro
Enterprise
Users
Up to 10
Unlimited
Data retention
7 days
30 days
90 days
Runs shown
10,000 most recent
Unlimited
Unlimited
Budget alerts
Evals & regression testing
Dataset evals
3 datasets, 10 rows
Unlimited
Unlimited
Model cost comparison
Scheduled cost reports
No
Model routing rules
No
Prompt version control
Prompt playground
10 runs free
Unlimited
Unlimited
SSO (SAML / Okta)
No
No
Coming soon
PII detection & masking
Audit log export
No
No
Coming soon
Helm chart (Kubernetes)
No
No
Coming soon
Support
Community
Priority
Dedicated
Get Pro at torrix.ai
Updating Torrix
To pull the latest version:
docker compose pull
docker compose up -d
Stopping Torrix
docker compose down
Your data is preserved in the ./data/ folder and will be available when you start again.
Configuration
Environment variable
Default
Description
DB_PATH
/data/torrix.sqlite
Path to SQLite database inside the container
TORRIX_TELEMETRY
true
Set to false to opt out of anonymous usage stats
To set environment variables, add an environment block to your docker-compose.yml :
services :
torrix :
image : torrixai/torrix:latest
ports :
- " 8088:8088 "
volumes :
- ./data:/data
environment :
- TORRIX_TELEMETRY=false
restart : unless-stopped
Grafana / Prometheus
Torrix exposes a /metrics endpoint in Prometheus text format. Scrape it to build Grafana dashboards with your existing monitoring stack.
Scrape the endpoint:
curl http://localhost:8088/metrics -H " Authorization: Bearer <your-torrix-api-key> "
Example output:
torrix_requests_total 142
torrix_cost_usd_total 0.023400
torrix_tokens_total 58300
torrix_errors_total 2
torrix_latency_p50_ms 312
torrix_latency_p95_ms 891
torrix_latency_p99_ms 1423
torrix_requests_by_model{model="gpt-4o-mini"} 98
torrix_requests_by_model{model="claude-3-5-sonnet-20241022"} 44
Prometheus prometheus.yml scrape config:
scrape_configs :
- job_name : torrix
scrape_interval : 30s
static_configs :
- targets : ['host.docker.internal:8088']
metrics_path : /metrics
authorization :
credentials : <your-torrix-api-key>
Add this to your Prometheus config and create a Grafana dashboard using the torrix_* metrics.
Data Privacy
All data stays on your machine. The SQLite database is stored in ./data/ on your host. Torrix never sends your prompts, responses, or API keys anywhere.
Anonymous telemetry is enabled by default. It sends only your instance ID, OS, and Node version to help improve Torrix. To opt out, set TORRIX_TELEMETRY=false in your docker-compose.yml as shown above.
Support
For questions or feedback: contact@torrix.ai
About
No description, website, or topics provided.
Resources
Readme
Uh oh!
There was an error while loading. Please reload this page .
Activity
Custom properties
Stars
17
stars
Watchers
watching
Forks
forks
Report repository
Releases
No releases published
Packages
Uh oh!
There was an error while loading. Please reload this page .
Contributors
Uh oh!
There was an error while loading. Please reload this page .
You can’t perform that action at this time.

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   73 points / 4 comments / query=model routing AI infrastructure

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   GitHub - torrix-ai/install · GitHub Skip to content Navigation Menu Toggle navigation Sign in Appearance settings Search or jump to.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Search code, repositories, users, issues, pull requests.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   --> Search Clear Search syntax tips Provide feedback --> We read every piece of feedback, and take your input very seriously.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Include my email address so I can be contacted Cancel Submit feedback Saved searches Use saved searches to filter your results more quickly --> Name Query To see all available qualifiers, see our documentation .

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Cancel Create saved search Sign in Sign up Appearance settings Resetting focus You signed in with another tab or window.

## business_elements

- companies: Hacker News, OpenAI, Anthropic, Google, Microsoft, GitHub, Cursor, Perplexity, Mistral
- products: Gemini, claude, Copilot, agent, gemini, ChatGPT, Claude, MCP, mcp, Cursor
- people: 暂无公开信息
- industries: 医疗, 开发者工具
- roles: 暂无公开信息
- workflows: 计费 / 预算管理, 部署 / 集成交付
- business_actions: 部署 / 上线
- affected_departments: IT / 安全, 财务 / 预算, 销售 / 客服
- numbers: 73, 4, 17, 71, 8088, 2.0, 0, 1
- quotes:  : true ,  /  Torrix  /  }
Check runs are being logged (requires your API key from Settings):
Mac / Linux:
curl http://localhost:8088/api/runs -H  / 
Windows (PowerShell):
Invoke-WebRequest http: // localhost: 8088 / api / runs - Headers @ { Authorization =  /  Authorization: Bearer <your-torrix-api-key> 

## evidence_seed

- company_actions: 73 points / 4 comments / query=model routing AI infrastructure / GitHub - torrix-ai/install · GitHub Skip to content Navigation Menu Toggle navigation Sign in Appearance settings Search or jump to. / Search code, repositories, users, issues, pull requests.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- commercial_value: 4
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 3
- guanlan_relevance: 5
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: false
- daily_observation: true
- heatmap: true
- briefing: true
- emerging_pool: true
- user_feedback_pool: true
- watchlist: true

## pool_routes

- core_pool
- emerging_pool
- user_feedback_pool

## missing_information

- 没有具体客户或真实企业案例

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: none
- source_role: primary_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

73 points / 4 comments / query=model routing AI infrastructure

## 采集备注

该条目由 hn 发现，事实来源等级初判为 B。S/A/B/C/D 只判断事实可靠度，不判断商业价值；M 只表示 acquisition_source_level，即 AI HOT / 搜索聚合等采集通道。M 级通道必须回源；HN / Reddit / X 等 C 级社区材料可用于讨论升温、用户反馈和早期观察，但进入事实主证据前必须寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。创始人 / 高管 / 项目方原帖可作为 S 级一手来源，但高波动平台必须保存快照和抓取时间。
