---
schema_version: raw-evidence-v2
raw_id: R-065
title: "Building News Agents for Daily News Recaps with MCP, Q, and tmux"
original_url: "https://eugeneyan.com//writing/news-agents/"
canonical_url: "https://eugeneyan.com/writing/news-agents"
source_name: "Eugene Yan's Blog"
source_type: builder
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
evidence_object_usable: true
event_evidence: true
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: rss-feed
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: ""
collected_at: 2026-06-14T08:10:00.753Z
language: mixed
full_text_hash: 4b79c96b5fd867d6
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-14/r-065-building-news-agents-for-daily-news-recaps-with-mcp-q-and-tmux.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-14/r-065-building-news-agents-for-daily-news-recaps-with-mcp-q-and-tmux.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-body-visible-text
extraction_quality: high
extraction_method: "body-visible-text"
readability_score: 85
extractor_diagnostics: {"readability_score":85,"text_length":11004,"paragraph_count":167,"sentence_count":79,"boilerplate_hits":0,"symbol_ratio":0.0163,"method":"body-visible-text"}
has_full_text: true
content_length: 11004
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"4b79c96b5fd867d6","missing":[]}
source_volatility: low
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: ""
discovery_record: null
source_role: resolved_original_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: 23b69daa0db00133
content_hash: 4b79c96b5fd867d6
semantic_hash: 0c7d85afd521fb0c
duplicate_of: ""
first_seen_at: "2026-06-14T08:10:00.753Z"
last_seen_at: 2026-06-14T08:10:00.753Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":5,"importance_reason":"new product or service; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Eugene Yan's Blog","Anthropic","Google","GitHub","Amazon","Nvidia"],"products":["Agents","MCP","agents","agent","Agent","mcp","Gemini"],"people":[],"industries":["金融 / 保险","开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["权限 / 安全治理","部署 / 集成交付"],"business_actions":["部署 / 上线","融资 / 投资"],"affected_departments":["IT / 安全","财务 / 预算"],"numbers":["8 m","3","1","2","1080","0","30","10.0"],"quotes":["\nFetch Hacker News RSS feed.\nArgs:\nfeed_url: URL of the RSS feed to fetch (defaults to Hacker News)\n","\nheaders = { ","HTTP Error fetching RSS: { str ( e ) } ","Timeout fetching RSS from { feed_url } ","Error fetching RSS: { str ( e ) } "]}
evidence_seed: {"company_actions":["It’s built on Amazon Q CLI and MCP .","The former provides the agentic framework and the latter provides news feeds via tools.","It also uses tmux to spawn and display each sub-agent’s work."],"case_details":[],"workflow_changes":["Learning to automate simple agentic workflows with Amazon Q CLI, Anthropic MCP, and tmux.","Building News Agents for Daily News Recaps with MCP, Q, and tmux eugeneyan Start Here Writing Speaking Prototyping About Building News Agents for Daily News Recaps with MCP, Q, and tmux llm learning 🛠 · 8 min read To better understand MCPs and agentic workflows, I built news-agents to help me generate a daily news recap."],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"workflow_change","text":"Learning to automate simple agentic workflows with Amazon Q CLI, Anthropic MCP, and tmux.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"Building News Agents for Daily News Recaps with MCP, Q, and tmux eugeneyan Start Here Writing Speaking Prototyping About Building News Agents for Daily News Recaps with MCP, Q, and tmux llm learning 🛠 · 8 min read To better understand MCPs and agentic workflows, I built news-agents to help me generate a daily news recap.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"It’s built on Amazon Q CLI and MCP .","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The former provides the agentic framework and the latter provides news feeds via tools.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"It also uses tmux to spawn and display each sub-agent’s work.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"},{"type":"company_action","text":"At a high level, here’s how it works: Main Agent (in the main tmux pane) ├── Read feeds.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"high","confidence":"high"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Building News Agents for Daily News Recaps with MCP, Q, and tmux

## clean_text

Building News Agents for Daily News Recaps with MCP, Q, and tmux
eugeneyan
Start Here
Writing
Speaking
Prototyping
About
Building News Agents for Daily News Recaps with MCP, Q, and tmux
llm
learning
🛠
· 8 min read
To better understand MCPs and agentic workflows, I built news-agents to help me generate a daily news recap. It’s built on Amazon Q CLI and MCP . The former provides the agentic framework and the latter provides news feeds via tools. It also uses tmux to spawn and display each sub-agent’s work. At a high level, here’s how it works:
Main Agent (in the main tmux pane)
├── Read feeds.txt
├── Split feeds into 3 chunks
├── Spawns 3 Sub-Agents (in separate tmux panes)
│ ├── Sub-Agent #1
│ │ ├── Process feeds in chunk 1
│ │ └── Report back when done
│ ├── Sub-Agent #2
│ │ ├── Process feeds in chunk 2
│ │ └── Report back when done
│ └── Sub-Agent #3
│ ├── Process feeds in chunk 3
│ └── Report back when done
└── Combine everything into main-summary.md
Here, we’ll walk through how the MCP tools are built and how the main agent spawns and monitors sub-agents. Each sub-agent processes its allocated news feeds and generates summaries for each feed. The main agent then combines these summaries into a final summary. Here’s the three-minute 1080p demo (watch till at least 0:30):
Setting up MCPs for news feeds
Each news feed has its own rss reader, parser, and formatter. These handle the unique structure and format of each feed. (Perhaps in future we can just use an LLM to parse these large text blobs reliably and cheaply.) For example, here’s the code for fetching and parsing the Hacker News rss feed:
async def fetch_hn_rss ( feed_url : str ) -> str :
"""
Fetch Hacker News RSS feed.
Args:
feed_url: URL of the RSS feed to fetch (defaults to Hacker News)
"""
headers = { "User-Agent" : USER_AGENT }
async with httpx . AsyncClient () as client :
try :
response = await client . get ( feed_url , headers = headers , timeout = 10.0 )
response . raise_for_status ()
return response . text
except httpx . HTTPError as e :
return f "HTTP Error fetching RSS: { str ( e ) } "
except httpx . TimeoutException :
return f "Timeout fetching RSS from { feed_url } "
except Exception as e :
return f "Error fetching RSS: { str ( e ) } "
def parse_hn_rss ( rss_content : str ) -> List [ Dict [ str , Any ]]:
"""Parse RSS content into a list of story dictionaries."""
stories = []
try :
root = ET . fromstring ( rss_content )
items = root . findall ( ".//item" )
for item in items :
story = {
"title" : item . find ( "title" ). text
if item . find ( "title" ) is not None
else "No title" ,
"link" : item . find ( "link" ). text if item . find ( "link" ) is not None else "" ,
"description" : item . find ( "description" ). text
if item . find ( "description" ) is not None
else "No description" ,
"pubDate" : item . find ( "pubDate" ). text
if item . find ( "pubDate" ) is not None
else "" ,
# Any other fields we want to extract
stories . append ( story )
return stories
except Exception as e :
return [{ "error" : f "Error parsing RSS: { str ( e ) } " }]
The MCP server then imports these parsers and sets up the MCP tools. MCP makes it easy to set up tools with the @mcp.tool() decorator. For example, here’s the Hacker News tool:
# Initialize FastMCP server
mcp = FastMCP ( "news-mcp" )
@ mcp . tool ()
async def get_hackernews_stories (
feed_url : str = DEFAULT_HN_RSS_URL , count : int = 30
) -> str :
"""Get top stories from Hacker News.
Args:
feed_url: URL of the RSS feed to use (default: Hacker News)
count: Number of stories to return (default: 5)
"""
rss_content = await fetch_hn_rss ( feed_url )
if rss_content . startswith ( "Error" ):
return rss_content
stories = parse_hn_rss ( rss_content )
# Limit to requested count
stories = stories [: min ( count , len ( stories ))]
if not stories :
return "No stories found."
formatted_stories = [ format_hn_story ( story ) for story in stories ]
return " \n --- \n " . join ( formatted_stories )
With this, here’s the tools that our agent has from both news-mcp and the built-ins:
> /tools
Tool Permission
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
news_mcp (MCP):
- news_mcp___get_wired_stories * not trusted
- news_mcp___get_techcrunch_stories * not trusted
- news_mcp___get_wallstreetjournal_stories * not trusted
- news_mcp___get_hackernews_stories * not trusted
- news_mcp___get_ainews_latest * not trusted
Built-in:
- fs_write * not trusted
- execute_bash * trust read-only commands
- report_issue * trusted
- fs_read * trusted
- use_aws * trust read-only commands
Setting up agents to process news
Next, we’ll set up a multi-agent system to parse the news feeds and generate summaries. We’ll have a main agent (image below, top-left) that coordinates three sub-agents, each running in a separate tmux window (image below; bottom-left and right panes).
The main agent (top-left) with its newly spawned sub-agents
The main agent will first divide the news feeds into three groups. Then, it’ll spawn three sub-agents, each assigned to a group of news feeds. In the demo, these sub-agents are displayed as a separate tmux window for each sub-agent.
# Main Agent - Multi-Agent Task Coordinator
## Role
You are the primary coordinating agent responsible for distributing tasks among
sub-agents and aggregating their results.
- Read feeds.txt for the input feeds
- Read context/sub-agent.md to understand your sub agents
- Return the summary in the format of context/main-summary-template.md
## Task Assignment Instructions
Use the following message format when assigning tasks: "You are Agent [NUMBER].
Read the instructions at /context/sub-agent.md and execute it. Here are the
feeds to process: [FEEDS]"
...
Truncated instructions for main agent
Then, the sub-agents will process their assigned news feeds and generate summaries for each of them. The sub-agent also categorizes stories within each feed, such as AI/ML, technology, business, etc. Throughout this process, the sub-agents display status updates. When the sub-agent finishes processing its assigned feeds, it displays a final completion status.
# Sub-Agent - Task Processor
## Role
You are a specialized processing agent designed to execute assigned tasks
independently while reporting progress to the main coordinating agent.
Process each feed individually and completely before moving to the next one.
Write the summaries to summaries/ which has already been created.
Return the summary in the format of context/sub-summary-template.md.
...
Truncated instructions for sub-agent
While the sub-agents are processing their assigned feeds, the main agent monitors their progress. When all sub-agents are done, the main agent reads the individual feed summaries and combines them into a final summary.
Defining the news feeds
Finally, we define the news feeds in feeds.txt below. We have six feeds: Hacker News, The Wall Street Journal Tech, The Wall Street Journal Markets, TechCrunch, AI News, and Wired.
hackernews: https://news.ycombinator.com/rss
wsj-tech: https://feeds.content.dowjones.io/public/rss/RSSWSJD
wsj-markets: https://feeds.content.dowjones.io/public/rss/RSSMarketsMain
techcrunch: https://techcrunch.com/feed/
ainews: https://news.smol.ai/rss.xml
wired: https://www.wired.com/feed/tag/ai/latest/rss
And here’s the truncated main-summary it generated for 4th May.
# News for May 4, 2025
### Global Statistics
- **Total Items Across Sources:** 124
- **Sources:** 6 (Hacker News, WSJ Tech, WSJ Markets, TechCrunch, AI News, Wired)
- **Date Range Covered:** May 2-4, 2025
- **Total Categories Identified:** 42
### Category Distribution
| Category | Count | Percentage | Top Source |
|----------|-------|------------|------------|
| AI/Machine Learning | 31 | 25% | AI News |
| Business/Finance | 18 | 14.5% | WSJ Markets |
| Technology | 16 | 12.9% | Hacker News |
| Politics/Government | 7 | 5.6% | Wired |
| Cybersecurity/Privacy | 6 | 4.8% | TechCrunch |
| Trade Policy | 6 | 4.8% | WSJ Markets |
---
## Cross-Source Trends
### Global Top 5 Topics
1. **AI Integration Across Industries**
- Mentions across sources: 31
- Key sources: AI News, WSJ Tech, TechCrunch, Wired
- Representative headlines: "AI Agents Are Learning How to Collaborate. Companies
Need to Work With Them", "Agent-to-Agent (A2A) Collaboration", "Nvidia CEO Says
All Companies Will Need 'AI Factories'"
2. **Trade Policy and Tariff Impact**
- Mentions across sources: 12
- Key sources: WSJ Markets, TechCrunch, WSJ Tech
- Representative headlines: "Temu stops shipping products from China to the U.S.",
"Car Buyers Rushing to Beat Tariffs Find It's Tougher to Get Financing",
"The Future of Gadgets: Fewer Updates, More Subscriptions, Bigger Price Tags"
3. **Government AI Implementation**
- Mentions across sources: 7
- Key sources: Wired, AI News
- Representative headlines: "DOGE Is in Its AI Era", "DOGE Put a College Student
in Charge of Using AI to Rewrite Regulations", "A DOGE Recruiter Is Staffing a
Project to Deploy AI Agents Across the US Government"
4. **AI Safety and Regulation Concerns**
- Mentions across sources: 9
- Key sources: TechCrunch, WSJ Tech, Wired
- Representative headlines: "One of Google's recent Gemini AI models scores worse on
safety", "AI chatbots are 'juicing engagement' instead of being useful", "Dozens
of YouTube Channels Are Showing AI-Generated Cartoon Gore and Fetish Content"
...
Try it for yourself! Install Amazon Q CLI and play with the code here: news-agents .
git clone https://github.com/eugeneyan/news-agents.git
cd news-agents
uv sync # Sync dependencies
uv tree # Check httpx and mcp[cli] are installed
q chat --trust-all-tools # Start Q
/context add --global context/agents.md # Add system context for multi-agents
Q, read context/main-agent.md and spin up sub agents to execute it. # Start main agent
• • •
Initially, I wanted to host this as a web app, perhaps on a platform like Daytona . However, I quickly learned that building remote MCPs isn’t trivial, especially with only a couple of weekend hours to hack on this. For now, I’ll explore applying this setup to other use cases such as parsing design docs and COEs , or multi-agent writing and coding workflows. If you’re also experimenting with MCPs or agentic workflows, I’d love to hear from you !
If you found this useful, please cite this write-up as:
Yan, Ziyou. (May 2025). Building News Agents for Daily News Recaps with MCP, Q, and tmux. eugeneyan.com.
https://eugeneyan.com/writing/news-agents/.
or
@article{yan2025news-agents,
title = {Building News Agents for Daily News Recaps with MCP, Q, and tmux},
author = {Yan, Ziyou},
journal = {eugeneyan.com},
year = {2025},
month = {May},
url = {https://eugeneyan.com/writing/news-agents/}
Share on:
Browse related tags: [
llm
learning
🛠
or Search
&laquo; An LLM-as-Judge Won't Save The Product—Fixing Your Process Will
Exceptional Leadership: Some Qualities, Behaviors, and Styles &raquo;
Join 11,800+ readers getting updates on machine learning, RecSys, LLMs, and engineering.

## full_text

Building News Agents for Daily News Recaps with MCP, Q, and tmux
eugeneyan
Start Here
Writing
Speaking
Prototyping
About
Building News Agents for Daily News Recaps with MCP, Q, and tmux
llm
learning
🛠
· 8 min read
To better understand MCPs and agentic workflows, I built news-agents to help me generate a daily news recap. It’s built on Amazon Q CLI and MCP . The former provides the agentic framework and the latter provides news feeds via tools. It also uses tmux to spawn and display each sub-agent’s work. At a high level, here’s how it works:
Main Agent (in the main tmux pane)
├── Read feeds.txt
├── Split feeds into 3 chunks
├── Spawns 3 Sub-Agents (in separate tmux panes)
│ ├── Sub-Agent #1
│ │ ├── Process feeds in chunk 1
│ │ └── Report back when done
│ ├── Sub-Agent #2
│ │ ├── Process feeds in chunk 2
│ │ └── Report back when done
│ └── Sub-Agent #3
│ ├── Process feeds in chunk 3
│ └── Report back when done
└── Combine everything into main-summary.md
Here, we’ll walk through how the MCP tools are built and how the main agent spawns and monitors sub-agents. Each sub-agent processes its allocated news feeds and generates summaries for each feed. The main agent then combines these summaries into a final summary. Here’s the three-minute 1080p demo (watch till at least 0:30):
Setting up MCPs for news feeds
Each news feed has its own rss reader, parser, and formatter. These handle the unique structure and format of each feed. (Perhaps in future we can just use an LLM to parse these large text blobs reliably and cheaply.) For example, here’s the code for fetching and parsing the Hacker News rss feed:
async def fetch_hn_rss ( feed_url : str ) -> str :
"""
Fetch Hacker News RSS feed.
Args:
feed_url: URL of the RSS feed to fetch (defaults to Hacker News)
"""
headers = { "User-Agent" : USER_AGENT }
async with httpx . AsyncClient () as client :
try :
response = await client . get ( feed_url , headers = headers , timeout = 10.0 )
response . raise_for_status ()
return response . text
except httpx . HTTPError as e :
return f "HTTP Error fetching RSS: { str ( e ) } "
except httpx . TimeoutException :
return f "Timeout fetching RSS from { feed_url } "
except Exception as e :
return f "Error fetching RSS: { str ( e ) } "
def parse_hn_rss ( rss_content : str ) -> List [ Dict [ str , Any ]]:
"""Parse RSS content into a list of story dictionaries."""
stories = []
try :
root = ET . fromstring ( rss_content )
items = root . findall ( ".//item" )
for item in items :
story = {
"title" : item . find ( "title" ). text
if item . find ( "title" ) is not None
else "No title" ,
"link" : item . find ( "link" ). text if item . find ( "link" ) is not None else "" ,
"description" : item . find ( "description" ). text
if item . find ( "description" ) is not None
else "No description" ,
"pubDate" : item . find ( "pubDate" ). text
if item . find ( "pubDate" ) is not None
else "" ,
# Any other fields we want to extract
stories . append ( story )
return stories
except Exception as e :
return [{ "error" : f "Error parsing RSS: { str ( e ) } " }]
The MCP server then imports these parsers and sets up the MCP tools. MCP makes it easy to set up tools with the @mcp.tool() decorator. For example, here’s the Hacker News tool:
# Initialize FastMCP server
mcp = FastMCP ( "news-mcp" )
@ mcp . tool ()
async def get_hackernews_stories (
feed_url : str = DEFAULT_HN_RSS_URL , count : int = 30
) -> str :
"""Get top stories from Hacker News.
Args:
feed_url: URL of the RSS feed to use (default: Hacker News)
count: Number of stories to return (default: 5)
"""
rss_content = await fetch_hn_rss ( feed_url )
if rss_content . startswith ( "Error" ):
return rss_content
stories = parse_hn_rss ( rss_content )
# Limit to requested count
stories = stories [: min ( count , len ( stories ))]
if not stories :
return "No stories found."
formatted_stories = [ format_hn_story ( story ) for story in stories ]
return " \n --- \n " . join ( formatted_stories )
With this, here’s the tools that our agent has from both news-mcp and the built-ins:
> /tools
Tool Permission
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
news_mcp (MCP):
- news_mcp___get_wired_stories * not trusted
- news_mcp___get_techcrunch_stories * not trusted
- news_mcp___get_wallstreetjournal_stories * not trusted
- news_mcp___get_hackernews_stories * not trusted
- news_mcp___get_ainews_latest * not trusted
Built-in:
- fs_write * not trusted
- execute_bash * trust read-only commands
- report_issue * trusted
- fs_read * trusted
- use_aws * trust read-only commands
Setting up agents to process news
Next, we’ll set up a multi-agent system to parse the news feeds and generate summaries. We’ll have a main agent (image below, top-left) that coordinates three sub-agents, each running in a separate tmux window (image below; bottom-left and right panes).
The main agent (top-left) with its newly spawned sub-agents
The main agent will first divide the news feeds into three groups. Then, it’ll spawn three sub-agents, each assigned to a group of news feeds. In the demo, these sub-agents are displayed as a separate tmux window for each sub-agent.
# Main Agent - Multi-Agent Task Coordinator
## Role
You are the primary coordinating agent responsible for distributing tasks among
sub-agents and aggregating their results.
- Read feeds.txt for the input feeds
- Read context/sub-agent.md to understand your sub agents
- Return the summary in the format of context/main-summary-template.md
## Task Assignment Instructions
Use the following message format when assigning tasks: "You are Agent [NUMBER].
Read the instructions at /context/sub-agent.md and execute it. Here are the
feeds to process: [FEEDS]"
...
Truncated instructions for main agent
Then, the sub-agents will process their assigned news feeds and generate summaries for each of them. The sub-agent also categorizes stories within each feed, such as AI/ML, technology, business, etc. Throughout this process, the sub-agents display status updates. When the sub-agent finishes processing its assigned feeds, it displays a final completion status.
# Sub-Agent - Task Processor
## Role
You are a specialized processing agent designed to execute assigned tasks
independently while reporting progress to the main coordinating agent.
Process each feed individually and completely before moving to the next one.
Write the summaries to summaries/ which has already been created.
Return the summary in the format of context/sub-summary-template.md.
...
Truncated instructions for sub-agent
While the sub-agents are processing their assigned feeds, the main agent monitors their progress. When all sub-agents are done, the main agent reads the individual feed summaries and combines them into a final summary.
Defining the news feeds
Finally, we define the news feeds in feeds.txt below. We have six feeds: Hacker News, The Wall Street Journal Tech, The Wall Street Journal Markets, TechCrunch, AI News, and Wired.
hackernews: https://news.ycombinator.com/rss
wsj-tech: https://feeds.content.dowjones.io/public/rss/RSSWSJD
wsj-markets: https://feeds.content.dowjones.io/public/rss/RSSMarketsMain
techcrunch: https://techcrunch.com/feed/
ainews: https://news.smol.ai/rss.xml
wired: https://www.wired.com/feed/tag/ai/latest/rss
And here’s the truncated main-summary it generated for 4th May.
# News for May 4, 2025
### Global Statistics
- **Total Items Across Sources:** 124
- **Sources:** 6 (Hacker News, WSJ Tech, WSJ Markets, TechCrunch, AI News, Wired)
- **Date Range Covered:** May 2-4, 2025
- **Total Categories Identified:** 42
### Category Distribution
| Category | Count | Percentage | Top Source |
|----------|-------|------------|------------|
| AI/Machine Learning | 31 | 25% | AI News |
| Business/Finance | 18 | 14.5% | WSJ Markets |
| Technology | 16 | 12.9% | Hacker News |
| Politics/Government | 7 | 5.6% | Wired |
| Cybersecurity/Privacy | 6 | 4.8% | TechCrunch |
| Trade Policy | 6 | 4.8% | WSJ Markets |
---
## Cross-Source Trends
### Global Top 5 Topics
1. **AI Integration Across Industries**
- Mentions across sources: 31
- Key sources: AI News, WSJ Tech, TechCrunch, Wired
- Representative headlines: "AI Agents Are Learning How to Collaborate. Companies
Need to Work With Them", "Agent-to-Agent (A2A) Collaboration", "Nvidia CEO Says
All Companies Will Need 'AI Factories'"
2. **Trade Policy and Tariff Impact**
- Mentions across sources: 12
- Key sources: WSJ Markets, TechCrunch, WSJ Tech
- Representative headlines: "Temu stops shipping products from China to the U.S.",
"Car Buyers Rushing to Beat Tariffs Find It's Tougher to Get Financing",
"The Future of Gadgets: Fewer Updates, More Subscriptions, Bigger Price Tags"
3. **Government AI Implementation**
- Mentions across sources: 7
- Key sources: Wired, AI News
- Representative headlines: "DOGE Is in Its AI Era", "DOGE Put a College Student
in Charge of Using AI to Rewrite Regulations", "A DOGE Recruiter Is Staffing a
Project to Deploy AI Agents Across the US Government"
4. **AI Safety and Regulation Concerns**
- Mentions across sources: 9
- Key sources: TechCrunch, WSJ Tech, Wired
- Representative headlines: "One of Google's recent Gemini AI models scores worse on
safety", "AI chatbots are 'juicing engagement' instead of being useful", "Dozens
of YouTube Channels Are Showing AI-Generated Cartoon Gore and Fetish Content"
...
Try it for yourself! Install Amazon Q CLI and play with the code here: news-agents .
git clone https://github.com/eugeneyan/news-agents.git
cd news-agents
uv sync # Sync dependencies
uv tree # Check httpx and mcp[cli] are installed
q chat --trust-all-tools # Start Q
/context add --global context/agents.md # Add system context for multi-agents
Q, read context/main-agent.md and spin up sub agents to execute it. # Start main agent
• • •
Initially, I wanted to host this as a web app, perhaps on a platform like Daytona . However, I quickly learned that building remote MCPs isn’t trivial, especially with only a couple of weekend hours to hack on this. For now, I’ll explore applying this setup to other use cases such as parsing design docs and COEs , or multi-agent writing and coding workflows. If you’re also experimenting with MCPs or agentic workflows, I’d love to hear from you !
If you found this useful, please cite this write-up as:
Yan, Ziyou. (May 2025). Building News Agents for Daily News Recaps with MCP, Q, and tmux. eugeneyan.com.
https://eugeneyan.com/writing/news-agents/.
or
@article{yan2025news-agents,
title = {Building News Agents for Daily News Recaps with MCP, Q, and tmux},
author = {Yan, Ziyou},
journal = {eugeneyan.com},
year = {2025},
month = {May},
url = {https://eugeneyan.com/writing/news-agents/}
Share on:
Browse related tags: [
llm
learning
🛠
or Search
&laquo; An LLM-as-Judge Won't Save The Product—Fixing Your Process Will
Exceptional Leadership: Some Qualities, Behaviors, and Styles &raquo;
Join 11,800+ readers getting updates on machine learning, RecSys, LLMs, and engineering.

## extraction_diagnostics

- extraction_method: body-visible-text
- readability_score: 85
- fetch_status: fetched-readable-text-body-visible-text
- extraction_quality: high
- diagnostics: {"readability_score":85,"text_length":11004,"paragraph_count":167,"sentence_count":79,"boilerplate_hits":0,"symbol_ratio":0.0163,"method":"body-visible-text"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **workflow_change**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Learning to automate simple agentic workflows with Amazon Q CLI, Anthropic MCP, and tmux.

2. **workflow_change**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   Building News Agents for Daily News Recaps with MCP, Q, and tmux eugeneyan Start Here Writing Speaking Prototyping About Building News Agents for Daily News Recaps with MCP, Q, and tmux llm learning 🛠 · 8 min read To better understand MCPs and agentic workflows, I built news-agents to help me generate a daily news recap.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   It’s built on Amazon Q CLI and MCP .

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   The former provides the agentic framework and the latter provides news feeds via tools.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   It also uses tmux to spawn and display each sub-agent’s work.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=high｜confidence=high
   At a high level, here’s how it works: Main Agent (in the main tmux pane) ├── Read feeds.

## business_elements

- companies: Eugene Yan's Blog, Anthropic, Google, GitHub, Amazon, Nvidia
- products: Agents, MCP, agents, agent, Agent, mcp, Gemini
- people: 暂无公开信息
- industries: 金融 / 保险, 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 权限 / 安全治理, 部署 / 集成交付
- business_actions: 部署 / 上线, 融资 / 投资
- affected_departments: IT / 安全, 财务 / 预算
- numbers: 8 m, 3, 1, 2, 1080, 0, 30, 10.0
- quotes: 
Fetch Hacker News RSS feed.
Args:
feed_url: URL of the RSS feed to fetch (defaults to Hacker News)
 / 
headers = {  / HTTP Error fetching RSS: { str ( e ) }  / Timeout fetching RSS from { feed_url }  / Error fetching RSS: { str ( e ) } 

## evidence_seed

- company_actions: It’s built on Amazon Q CLI and MCP . / The former provides the agentic framework and the latter provides news feeds via tools. / It also uses tmux to spawn and display each sub-agent’s work.
- case_details: 暂无公开信息
- workflow_changes: Learning to automate simple agentic workflows with Amazon Q CLI, Anthropic MCP, and tmux. / Building News Agents for Daily News Recaps with MCP, Q, and tmux eugeneyan Start Here Writing Speaking Prototyping About Building News Agents for Daily News Recaps with MCP, Q, and tmux llm learning 🛠 · 8 min read To better understand MCPs and agentic workflows, I built news-agents to help me generate a daily news recap.
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
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
- change: true
- trend: true
- daily_observation: true
- heatmap: true
- briefing: true
- emerging_pool: false
- user_feedback_pool: false
- watchlist: true

## pool_routes

- core_pool

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
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

Learning to automate simple agentic workflows with Amazon Q CLI, Anthropic MCP, and tmux.

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
