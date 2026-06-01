---
schema_version: raw-evidence-v2
raw_id: R-014
title: "Show HN: Prefab – A generative UI framework for Python"
original_url: "https://prefab.prefect.io/docs/welcome"
canonical_url: "https://prefab.prefect.io/docs/welcome"
source_name: "Hacker News"
source_type: community
source_level: C
acquisition_source_level: ""
acquisition_channel: hn
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2026-04-08T23:37:49Z"
collected_at: 2026-05-18T07:52:02.233Z
language: mixed
full_text_hash: 68469b0a5be275aa
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-18/r-014-show-hn-prefab-a-generative-ui-framework-for-python.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-05-18/r-014-show-hn-prefab-a-generative-ui-framework-for-python.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-clean-text
extraction_quality: high
has_full_text: true
content_length: 14755
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
url_hash: 4d62e189ff1e1928
content_hash: 68469b0a5be275aa
semantic_hash: 734353a875ab879e
duplicate_of: ""
first_seen_at: "2026-04-08T23:37:49Z"
last_seen_at: 2026-05-18T07:52:02.233Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":false,"daily_observation":true,"heatmap":true,"briefing":false,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["emerging_pool","user_feedback_pool","watchlist"]
guanlan_scores: {"commercial_value":3,"novelty":3,"evidence_strength":3,"case_richness":4,"trend_relevance":3,"guanlan_relevance":4,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News"],"products":["MCP","agent","agents"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["合同审阅 / 法律研究"],"business_actions":["部署 / 上线"],"affected_departments":["IT / 安全","销售 / 客服"],"numbers":["5","0","100","24%","78%","20","3","70"],"quotes":[" ctx_tick "," destructive "," success "," default "," Prefab Showcase "]}
evidence_seed: {"company_actions":["5 points / 0 comments / query=MCP agent protocol developer adoption","Welcome to Prefab 🎨 - Prefab Skip to main content Prefab home page Prefab Search.","Navigation Get Started Welcome to Prefab 🎨 Search the docs."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例","缺少一手来源或可靠转述来源"]
key_excerpts: [{"type":"company_action","text":"5 points / 0 comments / query=MCP agent protocol developer adoption","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Welcome to Prefab 🎨 - Prefab Skip to main content Prefab home page Prefab Search.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Navigation Get Started Welcome to Prefab 🎨 Search the docs.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"⌘ K Prefab UI Docs Get Started Welcome Installation Quickstart Concepts Core Concepts Components State Expressions Actions Apps PrefabApp Themes CSS Helpers Custom Handlers Running Prefab Playground Local Preview Static Export API Server FastMCP Examples Interactivity Data & Visualization Apps Reference Layout Components Inputs Charts Actions Special Variables Get Started Welcome to Prefab 🎨 Copy page The generative UI framework that even humans can use.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"Copy page Documentation Index Fetch the complete documentation index at: https://prefab.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"},{"type":"company_action","text":"txt Use this file to discover all available pages before exploring further.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"medium"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# Show HN: Prefab – A generative UI framework for Python

## clean_text

Welcome to Prefab 🎨 - Prefab
Skip to main content
Prefab home page Prefab
Search...
Navigation
Get Started
Welcome to Prefab 🎨
Search the docs...
⌘ K
Prefab UI Docs
Get Started
Welcome
Installation
Quickstart
Concepts
Core Concepts
Components
State
Expressions
Actions
Apps
PrefabApp
Themes
CSS Helpers
Custom Handlers
Running Prefab
Playground
Local Preview
Static Export
API Server
FastMCP
Examples
Interactivity
Data & Visualization
Apps
Reference
Layout
Components
Inputs
Charts
Actions
Special Variables
Get Started
Welcome to Prefab 🎨
Copy page
The generative UI framework that even humans can use.
Copy page
Documentation Index
Fetch the complete documentation index at: https://prefab.prefect.io/docs/llms.txt
Use this file to discover all available pages before exploring further.
Prefab is a UI framework for building rich, interactive interfaces in Python. Create MCP Apps , data dashboards, interactive tools, and more with 100+ prebuilt components. A bundled React renderer turns everything into a self-contained application.
Composing frontends in Python is blasphemous surprisingly natural. Prefab’s DSL uses context managers for nesting components, making it both token-efficient and streaming-compatible. As a result, you (or your agent) can declare UIs in advance or generate them on the fly. A reactive state system handles client-side interactivity with no JavaScript required, and MCP and REST backends are (optionally!) supported out of the box.
View the Python code for the components above
Python
Protocol
""" The Hitchhiker's Guide dashboard from the Prefab welcome page.
Run with:
prefab serve examples/hitchhikers-guide/dashboard.py
prefab export examples/hitchhikers-guide/dashboard.py
"""
from prefab_ui import PrefabApp
from prefab_ui . actions import SetInterval , SetState , ShowToast
from prefab_ui . components import (
Alert ,
AlertDescription ,
AlertTitle ,
Badge ,
Button ,
Card ,
CardContent ,
CardDescription ,
CardFooter ,
CardHeader ,
CardTitle ,
Carousel ,
Checkbox ,
Column ,
Combobox ,
ComboboxOption ,
DataTable ,
DataTableColumn ,
DatePicker ,
Dialog ,
Grid ,
GridItem ,
HoverCard ,
Loader ,
Metric ,
Muted ,
P ,
Progress ,
Radio ,
RadioGroup ,
Ring ,
Row ,
Separator ,
Slider ,
Switch ,
Text ,
Tooltip ,
from prefab_ui . components . charts import (
BarChart ,
ChartSeries ,
RadarChart ,
Sparkline ,
from prefab_ui . components . control_flow import Else , If
from prefab_ui . rx import Rx
ctx_tick = Rx ( " ctx_tick " )
# Context window: climbs from 24% to ~78%, then resets
ctx_pct = ( ctx_tick % 20 ) * 3 + 20
ctx_variant = ( ctx_pct > 70 ). then (
" destructive " , ( ctx_pct <= 33 ). then ( " success " , " default " )
with PrefabApp (
title = " Prefab Showcase " ,
state ={ " ctx_tick " : 0 , " improbability " : 42 },
on_mount = SetInterval (
400 ,
on_tick = SetState ( " ctx_tick " , ctx_tick + 1 ),
),
) as app :
with Grid ( columns ={ " default " : 1 , " md " : 2 , " lg " : 4 }, gap = 4 ):
# ── Col 1 ─────────────────────────────────────────────────────────
with Column ( gap = 4 ):
with Card ():
with CardHeader ():
CardTitle ( " Register Towel " )
CardDescription ( " The most important item in the galaxy " )
with CardContent ():
with Column ( gap = 3 ):
with Combobox (
placeholder = " Type... " ,
search_placeholder = " Search types... " ,
):
ComboboxOption ( " Bath " , value = " bath " )
ComboboxOption ( " Beach " , value = " beach " )
ComboboxOption ( " Interstellar " , value = " interstellar " )
ComboboxOption ( " Microfiber " , value = " micro " )
DatePicker ( placeholder = " Registration date " )
with CardFooter ():
with Row ( gap = 2 ):
with Dialog (
title = " Towel Registered! " ,
description = " Your towel has been added to the galactic registry. " ,
):
Button ( " Register " )
Text ( " Don't forget to bring it. " )
Button ( " Cancel " , variant = " outline " )
with If ( " {{ !pressed }} " ):
Button (
" This is probably the best button to press. " ,
variant = " success " ,
on_click = SetState ( " pressed " , True ),
with Else ():
Button (
" Please do not press this button again. " ,
variant = " destructive " ,
on_click = SetState ( " pressed " , False ),
with Card ():
with CardHeader ():
CardTitle ( " Ship Status " )
with CardContent ():
with Column ( gap = 3 ):
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Text ( " heart-of-gold " )
with HoverCard ( open_delay = 0 , close_delay = 200 ):
Badge ( " In Orbit " , variant = " default " )
with Column ( gap = 2 ):
Text ( " heart-of-gold " )
Muted ( " Deployed 2h ago " )
Progress (
value = 100 ,
max = 100 ,
variant = " success " ,
Progress (
value = 100 ,
max = 100 ,
indicator_class = " bg-yellow-400 " ,
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Text ( " vogon-poetry " )
with Tooltip ( " 64% — ETA 12 min " , delay = 0 ):
with Badge ( variant = " secondary " ):
Loader ( size = " sm " )
Text ( " Deploying " )
Progress ( value = 64 , max = 100 )
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Text ( " deep-thought " )
with Tooltip (
" Computing... 7.5 million years remaining " ,
delay = 0 ,
):
with Badge ( variant = " outline " ):
Loader ( size = " sm " , variant = " ios " )
Text ( " Soon... " )
Progress ( value = 12 , max = 100 )
with Card ():
with CardHeader ():
CardTitle ( " Planet Ratings " )
with CardContent ():
RadarChart (
data =[
{ " axis " : " Views " , " earth " : 30 , " mag " : 95 },
{ " axis " : " Fjords " , " earth " : 65 , " mag " : 100 },
{ " axis " : " Pubs " , " earth " : 90 , " mag " : 10 },
{ " axis " : " Mice " , " earth " : 40 , " mag " : 85 },
{ " axis " : " Tea " , " earth " : 95 , " mag " : 15 },
{ " axis " : " Safety " , " earth " : 45 , " mag " : 70 },
],
series =[
ChartSeries ( dataKey = " earth " , label = " Earth " ),
ChartSeries ( dataKey = " mag " , label = " Magrathea " ),
],
axis_key = " axis " ,
height = 200 ,
show_legend = True ,
show_tooltip = True ,
# ── Col 2 ─────────────────────────────────────────────────────────
with Column ( gap = 4 ):
with Card ():
with CardHeader ():
CardTitle ( " Survival Odds " )
with CardContent ( css_class = " w-fit mx-auto " ):
Ring (
value = 42 ,
label = " 42% " ,
variant = " info " ,
size = " lg " ,
thickness = 12 ,
indicator_class = " group-hover:drop-shadow-[0_0_24px_rgba(59,130,246,0.9)] " ,
with Card ():
with CardHeader ():
with Row ( gap = 2 , align = " center " ):
CardTitle ( " Improbability Drive " )
Loader (
variant = " pulse " ,
size = " sm " ,
css_class = " text-blue-500 " ,
with CardContent ():
with Column ( gap = 2 ):
Slider (
min = 0 ,
max = 100 ,
value = 42 ,
name = " improbability " ,
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Muted ( " Probable " )
Muted ( " Infinite " )
with Carousel ( auto_advance = 3000 , show_controls = False , direction = " up " ):
with Alert ( variant = " success " , icon = " circle-check " ):
AlertTitle ( " Don't Panic " )
AlertDescription ( " Normality achieved. " )
with Alert ( variant = " destructive " , icon = " triangle-alert " ):
AlertTitle ( " Display Department " )
AlertDescription ( " Beware of the leopard. " )
with Card ():
with CardHeader ():
CardTitle ( " Prefect Horizon Config " )
with CardContent ():
with Column ( gap = 3 ):
Switch (
label = " Auto-scale agents " ,
value = True ,
name = " autoscale " ,
Separator ()
Switch (
label = " Code Mode " ,
value = True ,
name = " code_mode " ,
Separator ()
Switch (
label = " Tool call caching " ,
value = False ,
name = " cache " ,
with CardFooter ():
Button (
" Save Preferences " ,
on_click = ShowToast ( " Preferences saved! " ),
with Card ():
with CardHeader ():
CardTitle ( " Travel Class " )
with CardContent ():
with RadioGroup ( name = " travel_class " ):
Radio ( option = " economy " , label = " Economy " )
Radio ( option = " business " , label = " Business Class " )
Radio (
option = " improbability " ,
label = " Infinite Improbability " ,
value = True ,
# ── Cols 3–4: summary row, chart, then 2-col grid below ─────────
with GridItem ( css_class = " md:col-span-2 " ):
with Column ( gap = 4 ):
with Grid ( columns = 2 , gap = 4 , css_class = " h-32 " ):
with Card ():
with CardHeader ():
CardTitle ( " Context Window " )
with CardContent ():
with Column (
gap = 6 ,
justify = " center " ,
css_class = " h-full " ,
):
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Text ( f " { ctx_pct } % used" )
Muted ( f " { ctx_pct * 2 } k / 200k tokens" )
with Tooltip (
" Auto-compact buffer: 12% " ,
delay = 0 ,
):
Progress (
value = ctx_pct ,
max = 100 ,
variant = ctx_variant ,
with Card ( css_class = " pb-0 gap-0 " ):
with CardContent ():
Metric (
label = " Fjords designed " ,
value = " 1,847 " ,
delta = " +3 coastlines " ,
Sparkline (
data =[
820 ,
950 ,
1100 ,
980 ,
1250 ,
1400 ,
1350 ,
1500 ,
1680 ,
1847 ,
],
variant = " success " ,
fill = True ,
css_class = " h-16 " ,
with Card ():
with CardHeader ():
CardTitle ( " Towel Incidents " )
with CardContent ():
BarChart (
data =[
{ " month " : " Jan " , " lost " : 8 , " found " : 5 },
{ " month " : " Feb " , " lost " : 24 , " found " : 15 },
{ " month " : " Mar " , " lost " : 12 , " found " : 28 },
{ " month " : " Apr " , " lost " : 35 , " found " : 19 },
{ " month " : " May " , " lost " : 18 , " found " : 38 },
{ " month " : " Jun " , " lost " : 42 , " found " : 30 },
],
series =[
ChartSeries ( dataKey = " lost " , label = " Lost " ),
ChartSeries ( dataKey = " found " , label = " Found " ),
],
x_axis = " month " ,
height = 200 ,
bar_radius = 4 ,
show_legend = True ,
show_tooltip = True ,
show_grid = True ,
with Grid ( columns = 2 , gap = 4 ):
with Column ( gap = 4 ):
with Card ():
with CardContent ():
with Column ( gap = 2 ):
Checkbox ( label = " Towel packed " , value = True )
Checkbox ( label = " Guide charged " , value = True )
Checkbox (
label = " Babel fish inserted " ,
value = False ,
with Card ():
with CardHeader ():
CardTitle ( " Marvin's Mood " )
with CardContent ():
with Column ( gap = 3 ):
P ( " How's life? " )
with Column ( gap = 2 ):
Button (
" Meh " ,
on_click = ShowToast (
" Noted. Enthusiasm levels nominal. "
),
Button (
" Depressed " ,
variant = " info " ,
on_click = ShowToast (
" I think you ought to "
" know I'm feeling very "
" depressed. "
),
Button (
" Don't talk to me about life " ,
variant = " warning " ,
on_click = ShowToast (
" Brain the size of a "
" planet and they ask me "
" to pick up a piece of "
" paper. "
),
with Column ( gap = 4 ):
with Card ():
with CardContent ():
with Row ( gap = 2 , align = " center " ):
Loader ( variant = " dots " , size = " sm " )
Muted ( " Marvin is thinking... " )
with Card ():
with CardContent ():
DataTable (
columns =[
DataTableColumn (
key = " crew " ,
header = " Crew " ,
sortable = True ,
),
DataTableColumn (
key = " species " ,
header = " Species " ,
sortable = True ,
),
DataTableColumn (
key = " towel " ,
header = " Towel? " ,
sortable = True ,
),
DataTableColumn (
key = " status " ,
header = " Status " ,
sortable = True ,
),
],
rows =[
" crew " : " Arthur Dent " ,
" species " : " Human " ,
" towel " : " Yes " ,
" status " : " Confused " ,
},
" crew " : " Ford Prefect " ,
" species " : " Betelgeusian " ,
" towel " : " Always " ,
" status " : " Drinking " ,
},
" crew " : " Zaphod " ,
" species " : " Betelgeusian " ,
" towel " : " Lost it " ,
" status " : " Presidential " ,
},
" crew " : " Trillian " ,
" species " : " Human " ,
" towel " : " Yes " ,
" status " : " Navigating " ,
},
" crew " : " Marvin " ,
" species " : " Android " ,
" towel " : " No point " ,
" status " : " Depressed " ,
},
" crew " : " Slartibartfast " ,
" species " : " Magrathean " ,
" towel " : " Somewhere " ,
" status " : " Designing " ,
},
],
search = True ,
paginated = False ,
See all 461 lines
Hello, world!
The “hello world” of Prefab is an interactive card. It looks like something you might see in any frontend framework… except, of course, that it’s written entirely in Python. Context managers define the component hierarchy, and the reactive Rx class is used to bind the form input to client-side state. The heading and badge update in real time as you type because they reference the reactive variable.
Every example in the Prefab docs is rendered with Prefab itself. You’ll see an interactive preview, along with the Python code that produced it, the corresponding Prefab protocol JSON, and a link to edit it live in the Playground .
Try entering your name here:
Why Prefab
Python developers building tools, APIs, and servers regularly need to ship interactive interfaces alongside their logic: dashboards, data tables, forms, charts. Building these interfaces has traditionally meant working in an entirely different language and ecosystem, or settling for static templates and limited tooling.
Prefab takes a different approach, using a Python DSL to naturally compose a library of production-ready components into interactive applications. The north star is composition, not construction: assembling existing components into interfaces, not authoring new ones in Python. The component tree compiles to a JSON protocol and is rendered by a bundled React frontend built on shadcn/ui. This means the interface definition stays in Python, right next to the data it presents. The output is declarative and serializable, which means UIs are safe for agents to generate, simple to validate, and portable across any transport.
Prefab is designed from the ground up for MCP Apps , bringing interactive frontend capabilities to the Python MCP ecosystem for the first time. Prefab ships as a native part of FastMCP , supporting everything from hand-authored declarative interfaces to fully agent-generated UIs in a single framework.
Prefab’s protocol-first approach was inspired by FastUI , which pioneered declarative component protocols rendered by a separate frontend. Prefab brings that idea to the MCP ecosystem, with a renderer that ships as a self-contained static bundle and a DSL designed for both developers and agents.
Installation
pip install prefab-ui
Prefab requires Python 3.10+.
Don’t panic. Prefab is under very active development. Pin your version to avoid breaking changes.
What’s in the Box
Quickstart
Install, create an app, see it render. Two minutes, no prerequisites.
Components
100+ components: layout, typography, forms, data display, and interactive elements. Nest them with Python context managers.
Actions
Declarative interactivity — state updates, server calls, navigation, and toast notifications. Chain them with lifecycle callbacks.
Expressions
Reactive state as Python expressions — arithmetic, comparisons, conditionals, and formatting pipes, no JavaScript required.
Prefab is made with 💙 by Prefect .
Installation
Next
⌘ I
Assistant
Responses are generated using AI and may contain mistakes.

## full_text

Welcome to Prefab 🎨 - Prefab
Skip to main content
Prefab home page Prefab
Search...
Navigation
Get Started
Welcome to Prefab 🎨
Search the docs...
⌘ K
Prefab UI Docs
Get Started
Welcome
Installation
Quickstart
Concepts
Core Concepts
Components
State
Expressions
Actions
Apps
PrefabApp
Themes
CSS Helpers
Custom Handlers
Running Prefab
Playground
Local Preview
Static Export
API Server
FastMCP
Examples
Interactivity
Data & Visualization
Apps
Reference
Layout
Components
Inputs
Charts
Actions
Special Variables
Get Started
Welcome to Prefab 🎨
Copy page
The generative UI framework that even humans can use.
Copy page
Documentation Index
Fetch the complete documentation index at: https://prefab.prefect.io/docs/llms.txt
Use this file to discover all available pages before exploring further.
Prefab is a UI framework for building rich, interactive interfaces in Python. Create MCP Apps , data dashboards, interactive tools, and more with 100+ prebuilt components. A bundled React renderer turns everything into a self-contained application.
Composing frontends in Python is blasphemous surprisingly natural. Prefab’s DSL uses context managers for nesting components, making it both token-efficient and streaming-compatible. As a result, you (or your agent) can declare UIs in advance or generate them on the fly. A reactive state system handles client-side interactivity with no JavaScript required, and MCP and REST backends are (optionally!) supported out of the box.
View the Python code for the components above
Python
Protocol
""" The Hitchhiker's Guide dashboard from the Prefab welcome page.
Run with:
prefab serve examples/hitchhikers-guide/dashboard.py
prefab export examples/hitchhikers-guide/dashboard.py
"""
from prefab_ui import PrefabApp
from prefab_ui . actions import SetInterval , SetState , ShowToast
from prefab_ui . components import (
Alert ,
AlertDescription ,
AlertTitle ,
Badge ,
Button ,
Card ,
CardContent ,
CardDescription ,
CardFooter ,
CardHeader ,
CardTitle ,
Carousel ,
Checkbox ,
Column ,
Combobox ,
ComboboxOption ,
DataTable ,
DataTableColumn ,
DatePicker ,
Dialog ,
Grid ,
GridItem ,
HoverCard ,
Loader ,
Metric ,
Muted ,
P ,
Progress ,
Radio ,
RadioGroup ,
Ring ,
Row ,
Separator ,
Slider ,
Switch ,
Text ,
Tooltip ,
from prefab_ui . components . charts import (
BarChart ,
ChartSeries ,
RadarChart ,
Sparkline ,
from prefab_ui . components . control_flow import Else , If
from prefab_ui . rx import Rx
ctx_tick = Rx ( " ctx_tick " )
# Context window: climbs from 24% to ~78%, then resets
ctx_pct = ( ctx_tick % 20 ) * 3 + 20
ctx_variant = ( ctx_pct > 70 ). then (
" destructive " , ( ctx_pct <= 33 ). then ( " success " , " default " )
with PrefabApp (
title = " Prefab Showcase " ,
state ={ " ctx_tick " : 0 , " improbability " : 42 },
on_mount = SetInterval (
400 ,
on_tick = SetState ( " ctx_tick " , ctx_tick + 1 ),
),
) as app :
with Grid ( columns ={ " default " : 1 , " md " : 2 , " lg " : 4 }, gap = 4 ):
# ── Col 1 ─────────────────────────────────────────────────────────
with Column ( gap = 4 ):
with Card ():
with CardHeader ():
CardTitle ( " Register Towel " )
CardDescription ( " The most important item in the galaxy " )
with CardContent ():
with Column ( gap = 3 ):
with Combobox (
placeholder = " Type... " ,
search_placeholder = " Search types... " ,
):
ComboboxOption ( " Bath " , value = " bath " )
ComboboxOption ( " Beach " , value = " beach " )
ComboboxOption ( " Interstellar " , value = " interstellar " )
ComboboxOption ( " Microfiber " , value = " micro " )
DatePicker ( placeholder = " Registration date " )
with CardFooter ():
with Row ( gap = 2 ):
with Dialog (
title = " Towel Registered! " ,
description = " Your towel has been added to the galactic registry. " ,
):
Button ( " Register " )
Text ( " Don't forget to bring it. " )
Button ( " Cancel " , variant = " outline " )
with If ( " {{ !pressed }} " ):
Button (
" This is probably the best button to press. " ,
variant = " success " ,
on_click = SetState ( " pressed " , True ),
with Else ():
Button (
" Please do not press this button again. " ,
variant = " destructive " ,
on_click = SetState ( " pressed " , False ),
with Card ():
with CardHeader ():
CardTitle ( " Ship Status " )
with CardContent ():
with Column ( gap = 3 ):
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Text ( " heart-of-gold " )
with HoverCard ( open_delay = 0 , close_delay = 200 ):
Badge ( " In Orbit " , variant = " default " )
with Column ( gap = 2 ):
Text ( " heart-of-gold " )
Muted ( " Deployed 2h ago " )
Progress (
value = 100 ,
max = 100 ,
variant = " success " ,
Progress (
value = 100 ,
max = 100 ,
indicator_class = " bg-yellow-400 " ,
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Text ( " vogon-poetry " )
with Tooltip ( " 64% — ETA 12 min " , delay = 0 ):
with Badge ( variant = " secondary " ):
Loader ( size = " sm " )
Text ( " Deploying " )
Progress ( value = 64 , max = 100 )
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Text ( " deep-thought " )
with Tooltip (
" Computing... 7.5 million years remaining " ,
delay = 0 ,
):
with Badge ( variant = " outline " ):
Loader ( size = " sm " , variant = " ios " )
Text ( " Soon... " )
Progress ( value = 12 , max = 100 )
with Card ():
with CardHeader ():
CardTitle ( " Planet Ratings " )
with CardContent ():
RadarChart (
data =[
{ " axis " : " Views " , " earth " : 30 , " mag " : 95 },
{ " axis " : " Fjords " , " earth " : 65 , " mag " : 100 },
{ " axis " : " Pubs " , " earth " : 90 , " mag " : 10 },
{ " axis " : " Mice " , " earth " : 40 , " mag " : 85 },
{ " axis " : " Tea " , " earth " : 95 , " mag " : 15 },
{ " axis " : " Safety " , " earth " : 45 , " mag " : 70 },
],
series =[
ChartSeries ( dataKey = " earth " , label = " Earth " ),
ChartSeries ( dataKey = " mag " , label = " Magrathea " ),
],
axis_key = " axis " ,
height = 200 ,
show_legend = True ,
show_tooltip = True ,
# ── Col 2 ─────────────────────────────────────────────────────────
with Column ( gap = 4 ):
with Card ():
with CardHeader ():
CardTitle ( " Survival Odds " )
with CardContent ( css_class = " w-fit mx-auto " ):
Ring (
value = 42 ,
label = " 42% " ,
variant = " info " ,
size = " lg " ,
thickness = 12 ,
indicator_class = " group-hover:drop-shadow-[0_0_24px_rgba(59,130,246,0.9)] " ,
with Card ():
with CardHeader ():
with Row ( gap = 2 , align = " center " ):
CardTitle ( " Improbability Drive " )
Loader (
variant = " pulse " ,
size = " sm " ,
css_class = " text-blue-500 " ,
with CardContent ():
with Column ( gap = 2 ):
Slider (
min = 0 ,
max = 100 ,
value = 42 ,
name = " improbability " ,
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Muted ( " Probable " )
Muted ( " Infinite " )
with Carousel ( auto_advance = 3000 , show_controls = False , direction = " up " ):
with Alert ( variant = " success " , icon = " circle-check " ):
AlertTitle ( " Don't Panic " )
AlertDescription ( " Normality achieved. " )
with Alert ( variant = " destructive " , icon = " triangle-alert " ):
AlertTitle ( " Display Department " )
AlertDescription ( " Beware of the leopard. " )
with Card ():
with CardHeader ():
CardTitle ( " Prefect Horizon Config " )
with CardContent ():
with Column ( gap = 3 ):
Switch (
label = " Auto-scale agents " ,
value = True ,
name = " autoscale " ,
Separator ()
Switch (
label = " Code Mode " ,
value = True ,
name = " code_mode " ,
Separator ()
Switch (
label = " Tool call caching " ,
value = False ,
name = " cache " ,
with CardFooter ():
Button (
" Save Preferences " ,
on_click = ShowToast ( " Preferences saved! " ),
with Card ():
with CardHeader ():
CardTitle ( " Travel Class " )
with CardContent ():
with RadioGroup ( name = " travel_class " ):
Radio ( option = " economy " , label = " Economy " )
Radio ( option = " business " , label = " Business Class " )
Radio (
option = " improbability " ,
label = " Infinite Improbability " ,
value = True ,
# ── Cols 3–4: summary row, chart, then 2-col grid below ─────────
with GridItem ( css_class = " md:col-span-2 " ):
with Column ( gap = 4 ):
with Grid ( columns = 2 , gap = 4 , css_class = " h-32 " ):
with Card ():
with CardHeader ():
CardTitle ( " Context Window " )
with CardContent ():
with Column (
gap = 6 ,
justify = " center " ,
css_class = " h-full " ,
):
with Row (
align = " center " ,
css_class = " justify-between " ,
):
Text ( f " { ctx_pct } % used" )
Muted ( f " { ctx_pct * 2 } k / 200k tokens" )
with Tooltip (
" Auto-compact buffer: 12% " ,
delay = 0 ,
):
Progress (
value = ctx_pct ,
max = 100 ,
variant = ctx_variant ,
with Card ( css_class = " pb-0 gap-0 " ):
with CardContent ():
Metric (
label = " Fjords designed " ,
value = " 1,847 " ,
delta = " +3 coastlines " ,
Sparkline (
data =[
820 ,
950 ,
1100 ,
980 ,
1250 ,
1400 ,
1350 ,
1500 ,
1680 ,
1847 ,
],
variant = " success " ,
fill = True ,
css_class = " h-16 " ,
with Card ():
with CardHeader ():
CardTitle ( " Towel Incidents " )
with CardContent ():
BarChart (
data =[
{ " month " : " Jan " , " lost " : 8 , " found " : 5 },
{ " month " : " Feb " , " lost " : 24 , " found " : 15 },
{ " month " : " Mar " , " lost " : 12 , " found " : 28 },
{ " month " : " Apr " , " lost " : 35 , " found " : 19 },
{ " month " : " May " , " lost " : 18 , " found " : 38 },
{ " month " : " Jun " , " lost " : 42 , " found " : 30 },
],
series =[
ChartSeries ( dataKey = " lost " , label = " Lost " ),
ChartSeries ( dataKey = " found " , label = " Found " ),
],
x_axis = " month " ,
height = 200 ,
bar_radius = 4 ,
show_legend = True ,
show_tooltip = True ,
show_grid = True ,
with Grid ( columns = 2 , gap = 4 ):
with Column ( gap = 4 ):
with Card ():
with CardContent ():
with Column ( gap = 2 ):
Checkbox ( label = " Towel packed " , value = True )
Checkbox ( label = " Guide charged " , value = True )
Checkbox (
label = " Babel fish inserted " ,
value = False ,
with Card ():
with CardHeader ():
CardTitle ( " Marvin's Mood " )
with CardContent ():
with Column ( gap = 3 ):
P ( " How's life? " )
with Column ( gap = 2 ):
Button (
" Meh " ,
on_click = ShowToast (
" Noted. Enthusiasm levels nominal. "
),
Button (
" Depressed " ,
variant = " info " ,
on_click = ShowToast (
" I think you ought to "
" know I'm feeling very "
" depressed. "
),
Button (
" Don't talk to me about life " ,
variant = " warning " ,
on_click = ShowToast (
" Brain the size of a "
" planet and they ask me "
" to pick up a piece of "
" paper. "
),
with Column ( gap = 4 ):
with Card ():
with CardContent ():
with Row ( gap = 2 , align = " center " ):
Loader ( variant = " dots " , size = " sm " )
Muted ( " Marvin is thinking... " )
with Card ():
with CardContent ():
DataTable (
columns =[
DataTableColumn (
key = " crew " ,
header = " Crew " ,
sortable = True ,
),
DataTableColumn (
key = " species " ,
header = " Species " ,
sortable = True ,
),
DataTableColumn (
key = " towel " ,
header = " Towel? " ,
sortable = True ,
),
DataTableColumn (
key = " status " ,
header = " Status " ,
sortable = True ,
),
],
rows =[
" crew " : " Arthur Dent " ,
" species " : " Human " ,
" towel " : " Yes " ,
" status " : " Confused " ,
},
" crew " : " Ford Prefect " ,
" species " : " Betelgeusian " ,
" towel " : " Always " ,
" status " : " Drinking " ,
},
" crew " : " Zaphod " ,
" species " : " Betelgeusian " ,
" towel " : " Lost it " ,
" status " : " Presidential " ,
},
" crew " : " Trillian " ,
" species " : " Human " ,
" towel " : " Yes " ,
" status " : " Navigating " ,
},
" crew " : " Marvin " ,
" species " : " Android " ,
" towel " : " No point " ,
" status " : " Depressed " ,
},
" crew " : " Slartibartfast " ,
" species " : " Magrathean " ,
" towel " : " Somewhere " ,
" status " : " Designing " ,
},
],
search = True ,
paginated = False ,
See all 461 lines
Hello, world!
The “hello world” of Prefab is an interactive card. It looks like something you might see in any frontend framework… except, of course, that it’s written entirely in Python. Context managers define the component hierarchy, and the reactive Rx class is used to bind the form input to client-side state. The heading and badge update in real time as you type because they reference the reactive variable.
Every example in the Prefab docs is rendered with Prefab itself. You’ll see an interactive preview, along with the Python code that produced it, the corresponding Prefab protocol JSON, and a link to edit it live in the Playground .
Try entering your name here:
Why Prefab
Python developers building tools, APIs, and servers regularly need to ship interactive interfaces alongside their logic: dashboards, data tables, forms, charts. Building these interfaces has traditionally meant working in an entirely different language and ecosystem, or settling for static templates and limited tooling.
Prefab takes a different approach, using a Python DSL to naturally compose a library of production-ready components into interactive applications. The north star is composition, not construction: assembling existing components into interfaces, not authoring new ones in Python. The component tree compiles to a JSON protocol and is rendered by a bundled React frontend built on shadcn/ui. This means the interface definition stays in Python, right next to the data it presents. The output is declarative and serializable, which means UIs are safe for agents to generate, simple to validate, and portable across any transport.
Prefab is designed from the ground up for MCP Apps , bringing interactive frontend capabilities to the Python MCP ecosystem for the first time. Prefab ships as a native part of FastMCP , supporting everything from hand-authored declarative interfaces to fully agent-generated UIs in a single framework.
Prefab’s protocol-first approach was inspired by FastUI , which pioneered declarative component protocols rendered by a separate frontend. Prefab brings that idea to the MCP ecosystem, with a renderer that ships as a self-contained static bundle and a DSL designed for both developers and agents.
Installation
pip install prefab-ui
Prefab requires Python 3.10+.
Don’t panic. Prefab is under very active development. Pin your version to avoid breaking changes.
What’s in the Box
Quickstart
Install, create an app, see it render. Two minutes, no prerequisites.
Components
100+ components: layout, typography, forms, data display, and interactive elements. Nest them with Python context managers.
Actions
Declarative interactivity — state updates, server calls, navigation, and toast notifications. Chain them with lifecycle callbacks.
Expressions
Reactive state as Python expressions — arithmetic, comparisons, conditionals, and formatting pipes, no JavaScript required.
Prefab is made with 💙 by Prefect .
Installation
Next
⌘ I
Assistant
Responses are generated using AI and may contain mistakes.

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   5 points / 0 comments / query=MCP agent protocol developer adoption

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   Welcome to Prefab 🎨 - Prefab Skip to main content Prefab home page Prefab Search.

3. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   Navigation Get Started Welcome to Prefab 🎨 Search the docs.

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   ⌘ K Prefab UI Docs Get Started Welcome Installation Quickstart Concepts Core Concepts Components State Expressions Actions Apps PrefabApp Themes CSS Helpers Custom Handlers Running Prefab Playground Local Preview Static Export API Server FastMCP Examples Interactivity Data & Visualization Apps Reference Layout Components Inputs Charts Actions Special Variables Get Started Welcome to Prefab 🎨 Copy page The generative UI framework that even humans can use.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   Copy page Documentation Index Fetch the complete documentation index at: https://prefab.

6. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=medium
   txt Use this file to discover all available pages before exploring further.

## business_elements

- companies: Hacker News
- products: MCP, agent, agents
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 合同审阅 / 法律研究
- business_actions: 部署 / 上线
- affected_departments: IT / 安全, 销售 / 客服
- numbers: 5, 0, 100, 24%, 78%, 20, 3, 70
- quotes:  ctx_tick  /  destructive  /  success  /  default  /  Prefab Showcase

## evidence_seed

- company_actions: 5 points / 0 comments / query=MCP agent protocol developer adoption / Welcome to Prefab 🎨 - Prefab Skip to main content Prefab home page Prefab Search. / Navigation Get Started Welcome to Prefab 🎨 Search the docs.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- commercial_value: 3
- novelty: 3
- evidence_strength: 3
- case_richness: 4
- trend_relevance: 3
- guanlan_relevance: 4
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- change: true
- trend: false
- daily_observation: true
- heatmap: true
- briefing: false
- emerging_pool: true
- user_feedback_pool: true
- watchlist: true

## pool_routes

- emerging_pool
- user_feedback_pool
- watchlist

## missing_information

- 没有具体客户或真实企业案例
- 缺少一手来源或可靠转述来源

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

5 points / 0 comments / query=MCP agent protocol developer adoption

## 采集备注

该条目由 hn 发现，事实来源等级初判为 C。S/A/B/C/D 只判断事实可靠度，不判断商业价值；M 只表示 acquisition_source_level，即 AI HOT / 搜索聚合等采集通道。M 级通道必须回源；HN / Reddit / X 等 C 级社区材料可用于讨论升温、用户反馈和早期观察，但进入事实主证据前必须寻找官方公告、产品页、客户案例、论文、A 级媒体或其他 S/A/B 来源补证。创始人 / 高管 / 项目方原帖可作为 S 级一手来源，但高波动平台必须保存快照和抓取时间。
