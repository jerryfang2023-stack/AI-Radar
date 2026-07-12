---
schema_version: raw-evidence-v2
raw_id: R-039
title: "Product Categorization API Part 3: Creating an API"
title_zh: "产品分类API第3部分：创建API"
title_translation_status: translated
title_translation_method: mymemory_title_translation
original_url: "https://eugeneyan.com//writing/product-categorization-api-part-3-creating-an-api/"
canonical_url: "https://eugeneyan.com/writing/product-categorization-api-part-3-creating-an-api"
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
published_at: "2017-02-13T00:00:00.000Z"
collected_at: 2026-07-12T09:55:31.383Z
language: mixed
full_text_hash: 4c175be37117a33a
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-039-product-categorization-api-part-3-creating-an-api.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-039-product-categorization-api-part-3-creating-an-api.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 96
extractor_diagnostics: {"readability_score":96,"text_length":3996,"paragraph_count":57,"sentence_count":40,"boilerplate_hits":0,"symbol_ratio":0.019,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 3996
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"4c175be37117a33a","missing":[]}
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
url_hash: 26f39de9020f5481
content_hash: 4c175be37117a33a
semantic_hash: acd20c15e6336e31
duplicate_of: ""
first_seen_at: "2017-02-13T00:00:00.000Z"
last_seen_at: 2026-07-12T09:55:31.383Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_market_structure","importance_score":5,"importance_reason":"market-structure commercial event; rubric=5 major/platform/industry-shaping","supporting_signals":[],"novelty":2,"evidence_strength":4,"case_richness":4,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Eugene Yan's Blog","GitHub"],"products":[],"people":[],"industries":["开发者工具"],"roles":[],"workflows":["计费 / 预算管理"],"business_actions":[],"affected_departments":["IT / 安全","财务 / 预算"],"numbers":["3","1","2","0.9","20%"],"quotes":["\nClass to predict product category given a product title.\n","\ndef __init__ ( self , title ):\nself . title = title\ndef prepare ( self , excluded = '-.' ):\n"," (str) -> list(str)\nReturns the title after it has been prepared by the process from clean titles\n:return:\n>>> TitleCategorize('Crème brûlée "]}
evidence_seed: {"company_actions":["Or how to put machine learning models into production.","This post is part 3—and the last—of the series on building a product classification API.","The API is available for demo here ."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"company_action","text":"Or how to put machine learning models into production.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"funding","text":"This post is part 3—and the last—of the series on building a product classification API.","supports":["signal_card_candidate","relationship_graph_input","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The API is available for demo here .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Part 1 and 2 are available here and here .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"( Github repositiory ) Update: API discontinued to save on cloud cost.","supports":["signal_card_candidate","relationship_graph_input","business_change"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"In part 1, we focused on acquiring the data, and cleaning and formatting the categories.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-12T09:55:31.383Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# Product Categorization API Part 3: Creating an API

## clean_text

This post is part 3—and the last—of the series on building a product classification API. The API is available for demo here . Part 1 and 2 are available here and here . ( Github repositiory )
Update: API discontinued to save on cloud cost.
In part 1, we focused on acquiring the data, and cleaning and formatting the categories. Then in part 2, we cleaned and prepared the product titles (and short description) before training our model on the data. In this post, we’ll focus on writing a custom class for the API and building an app around it.
This is part of a series of posts on building a product classification API:
Data acquisition and formatting (part 1)
Data cleaning and preparation (part 2)
API development (part 3)
Image classification demo
Image search demo
The desired end result is a webpage where users can enter a product title and get the top three most appropriate categories for it, like so.
Input: Title. Output: Suggested categories.
Creating a TitleCategorize Class
In most data science work using Python, we seldom have to write our own data structures or classes. Python is rich in useful data structures like dicts, sets, lists, etc. Also, thanks to Wes McKinney, most data wrangling can be done with one main data structure/class, the pandas dataframe.
For the API, what data structure should we use?
We can continue to use the pandas dataframe and perform all our operations on it. However, we don’t need something so heavy duty (with fast indexing, joins, etc). Perhaps we should write our own class instead.
Before writing any code, lets think about how we expect the API to work:
User provides a title as input
Title is cleaned and prepared via the approach described in post 2 (title preparation for new input titles should be the same as in model training process)
Prepared title is provided as input to classification model
Classification model returns top x categories and associated probabilities
Based on the above, this is what our CategorizeTitle class should do:
Take a title string as input
Clean and prepare title string
Input prepared title string to classification model
Return results from classification model
Looks simple enough. Here’s how our class looks like:
class TitleCategorize :
"""
Class to predict product category given a product title.
"""
def __init__ ( self , title ):
self . title = title
def prepare ( self , excluded = '-.' ):
""" (str) -> list(str)
Returns the title after it has been prepared by the process from clean titles
:return:
>>> TitleCategorize('Crème brûlée " & ').prepare()
['creme', 'brulee']
>>> TitleCategorize('test hyphen-word 0.9 20% green/blue').prepare()
['test', 'hyphen-word', '0.9']
>>> TitleCategorize('grapes come in purple and green').prepare()
['grapes', 'come']
>>> TitleCategorize('what remains of a word ! if wordlen is 2').prepare()
['remains', 'word', 'wordlen']
"""
self . title = encode_string ( self . title , HTML_PARSER )
self . title = self . title . lower ()
self . title = tokenize_title_string ( self . title , excluded )
self . title = remove_words_list ( self . title , STOP_WORDS )
self . title = remove_numeric_list ( self . title )
self . title = remove_chars ( self . title , 1 )
self . title = singularize_list ( self . title )
logger . info ( 'Title after preparation: {}' . format ( self . title ))
return self
def categorize ( self ):
""" (CategorizeSingle(str)) -> dict
Categorizes prepared title and returns a dictionary of form {1: 'Cat1', 2: 'Cat2', 3: 'Cat3}
:return:
>>> TitleCategorize('This is a bookshelf with wood and a clock').prepare().categorize()
{1: 'Electronics -> Home Audio -> Stereo Components -> Speakers -> Bookshelf Speakers',
2: 'Electronics -> Computers & Accessories -> Data Storage -> USB Flash Drives',
3: 'Home & Kitchen -> Furniture -> Home Office Furniture -> Bookcases'}
"""
result_list = get_score ( self . title , model , 3 )
result_dict = dict ()
for i , category in enumerate ( result_list ):
result_dict [ i + 1 ] = category
return result_dict

## full_text

This post is part 3—and the last—of the series on building a product classification API. The API is available for demo here . Part 1 and 2 are available here and here . ( Github repositiory )
Update: API discontinued to save on cloud cost.
In part 1, we focused on acquiring the data, and cleaning and formatting the categories. Then in part 2, we cleaned and prepared the product titles (and short description) before training our model on the data. In this post, we’ll focus on writing a custom class for the API and building an app around it.
This is part of a series of posts on building a product classification API:
Data acquisition and formatting (part 1)
Data cleaning and preparation (part 2)
API development (part 3)
Image classification demo
Image search demo
The desired end result is a webpage where users can enter a product title and get the top three most appropriate categories for it, like so.
Input: Title. Output: Suggested categories.
Creating a TitleCategorize Class
In most data science work using Python, we seldom have to write our own data structures or classes. Python is rich in useful data structures like dicts, sets, lists, etc. Also, thanks to Wes McKinney, most data wrangling can be done with one main data structure/class, the pandas dataframe.
For the API, what data structure should we use?
We can continue to use the pandas dataframe and perform all our operations on it. However, we don’t need something so heavy duty (with fast indexing, joins, etc). Perhaps we should write our own class instead.
Before writing any code, lets think about how we expect the API to work:
User provides a title as input
Title is cleaned and prepared via the approach described in post 2 (title preparation for new input titles should be the same as in model training process)
Prepared title is provided as input to classification model
Classification model returns top x categories and associated probabilities
Based on the above, this is what our CategorizeTitle class should do:
Take a title string as input
Clean and prepare title string
Input prepared title string to classification model
Return results from classification model
Looks simple enough. Here’s how our class looks like:
class TitleCategorize :
"""
Class to predict product category given a product title.
"""
def __init__ ( self , title ):
self . title = title
def prepare ( self , excluded = '-.' ):
""" (str) -> list(str)
Returns the title after it has been prepared by the process from clean titles
:return:
>>> TitleCategorize('Crème brûlée " & ').prepare()
['creme', 'brulee']
>>> TitleCategorize('test hyphen-word 0.9 20% green/blue').prepare()
['test', 'hyphen-word', '0.9']
>>> TitleCategorize('grapes come in purple and green').prepare()
['grapes', 'come']
>>> TitleCategorize('what remains of a word ! if wordlen is 2').prepare()
['remains', 'word', 'wordlen']
"""
self . title = encode_string ( self . title , HTML_PARSER )
self . title = self . title . lower ()
self . title = tokenize_title_string ( self . title , excluded )
self . title = remove_words_list ( self . title , STOP_WORDS )
self . title = remove_numeric_list ( self . title )
self . title = remove_chars ( self . title , 1 )
self . title = singularize_list ( self . title )
logger . info ( 'Title after preparation: {}' . format ( self . title ))
return self
def categorize ( self ):
""" (CategorizeSingle(str)) -> dict
Categorizes prepared title and returns a dictionary of form {1: 'Cat1', 2: 'Cat2', 3: 'Cat3}
:return:
>>> TitleCategorize('This is a bookshelf with wood and a clock').prepare().categorize()
{1: 'Electronics -> Home Audio -> Stereo Components -> Speakers -> Bookshelf Speakers',
2: 'Electronics -> Computers & Accessories -> Data Storage -> USB Flash Drives',
3: 'Home & Kitchen -> Furniture -> Home Office Furniture -> Bookcases'}
"""
result_list = get_score ( self . title , model , 3 )
result_dict = dict ()
for i , category in enumerate ( result_list ):
result_dict [ i + 1 ] = category
return result_dict

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 96
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":96,"text_length":3996,"paragraph_count":57,"sentence_count":40,"boilerplate_hits":0,"symbol_ratio":0.019,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Or how to put machine learning models into production.

2. **funding**｜supports=signal_card_candidate, relationship_graph_input, trend_candidate_context｜importance=high｜confidence=high
   This post is part 3—and the last—of the series on building a product classification API.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   The API is available for demo here .

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Part 1 and 2 are available here and here .

5. **product_update**｜supports=signal_card_candidate, relationship_graph_input, business_change｜importance=medium｜confidence=high
   ( Github repositiory ) Update: API discontinued to save on cloud cost.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   In part 1, we focused on acquiring the data, and cleaning and formatting the categories.

## business_elements

- companies: Eugene Yan's Blog, GitHub
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: 暂无公开信息
- workflows: 计费 / 预算管理
- business_actions: 暂无公开信息
- affected_departments: IT / 安全, 财务 / 预算
- numbers: 3, 1, 2, 0.9, 20%
- quotes:
Class to predict product category given a product title.
 /
def __init__ ( self , title ):
self . title = title
def prepare ( self , excluded = '-.' ):
 /  (str) -> list(str)
Returns the title after it has been prepared by the process from clean titles
:return:
>>> TitleCategorize('Crème brûlée

## evidence_seed

- company_actions: Or how to put machine learning models into production. / This post is part 3—and the last—of the series on building a product classification API. / The API is available for demo here .
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_market_structure
- importance_score: 5
- importance_reason: market-structure commercial event; rubric=5 major/platform/industry-shaping
- supporting_signals:
- novelty: 2
- evidence_strength: 4
- case_richness: 4
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
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

Or how to put machine learning models into production.

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
