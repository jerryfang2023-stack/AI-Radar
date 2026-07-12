---
schema_version: raw-evidence-v2
raw_id: R-034
title: "Adding a Checkbox &amp; Download Button to a FastAPI-HTML app"
title_zh: "向FastAPI-HTML应用程序添加复选框和下载按钮"
title_translation_status: translated
title_translation_method: mymemory_title_translation
original_url: "https://eugeneyan.com//writing/fastapi-html-checkbox-download/"
canonical_url: "https://eugeneyan.com/writing/fastapi-html-checkbox-download"
source_name: "Eugene Yan's Blog"
source_type: builder
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: research_or_report
evidence_object_usable: false
event_evidence: false
index_only_evidence: false
acquisition_source_level: "M"
acquisition_channel: rss-feed
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: "2020-08-05T00:00:00.000Z"
collected_at: 2026-07-12T09:55:29.166Z
language: mixed
full_text_hash: fef2d91698818d31
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-034-adding-a-checkbox-amp-download-button-to-a-fastapi-html-app.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-12/r-034-adding-a-checkbox-amp-download-button-to-a-fastapi-html-app.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-body-visible-text
extraction_quality: high
extraction_method: "body-visible-text"
readability_score: 85
extractor_diagnostics: {"readability_score":85,"text_length":4698,"paragraph_count":62,"sentence_count":30,"boilerplate_hits":0,"symbol_ratio":0.0394,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}
has_full_text: true
content_length: 4698
fetch_error: ""
evidence_strength: source_backed_event
raw_qc_decision: allow_with_degradation
raw_qc_downstream_use: index_watchlist_or_feedback_only
degradation_reasons: ["insufficient_usable_evidence_object"]
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"fef2d91698818d31","missing":[]}
source_volatility: low
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: supporting_evidence
discovery_source: ""
discovery_record: null
source_role: resolved_original_source
origin_fetch_status: ""
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: cd09e10bc002596c
content_hash: fef2d91698818d31
semantic_hash: 5a8facb45b75e4e7
duplicate_of: ""
first_seen_at: "2020-08-05T00:00:00.000Z"
last_seen_at: 2026-07-12T09:55:29.166Z
update_detected: false
raw_status: indexed
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: false
evidence_eligibility: blocked
evidence_block_reason: "not_event_case_or_trend_evidence"
guanlan_scores: {"importance_type":"none","importance_score":1,"importance_reason":"no core WaveSight importance signal","supporting_signals":[],"novelty":2,"evidence_strength":4,"case_richness":5,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":3}
business_elements: {"companies":["Eugene Yan's Blog","GitHub","Meta"],"products":[],"people":[],"industries":[],"roles":["开发者 / 工程团队"],"workflows":[],"business_actions":[],"affected_departments":["IT / 安全"],"numbers":["3 m","2","8","1234","4","7","2020","11"],"quotes":[" >\n<head>\n<meta charset= "," >\n<title> Sample Form </title>\n</head>\n<body>\n<form method= "," >\n<input type= "," value= "," />\n<input type= "]}
evidence_seed: {"company_actions":["Updating our FastAPI app to let users select options and download results.","Adding a Checkbox & Download Button to a FastAPI-HTML app eugeneyan Start Here Writing Speaking Prototyping About Adding a Checkbox & Download Button to a FastAPI-HTML app engineering python til · 3 min read In a previous post , I shared about how to build a simple HTML app using FastAPI .","Here, we’ll extend that app by adding functionality for checkboxes and a download button."],"case_details":[],"workflow_changes":[],"before_after_clues":[],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势","没有具体客户或真实企业案例","没有变化前后流程线索"]
key_excerpts: [{"type":"company_action","text":"Updating our FastAPI app to let users select options and download results.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Adding a Checkbox & Download Button to a FastAPI-HTML app eugeneyan Start Here Writing Speaking Prototyping About Adding a Checkbox & Download Button to a FastAPI-HTML app engineering python til · 3 min read In a previous post , I shared about how to build a simple HTML app using FastAPI .","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Here, we’ll extend that app by adding functionality for checkboxes and a download button.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Try it out with the GitHub repo here: fastapi-html Let’s allow users to alter results To demonstrate this, we’ll create a checkbox to multiply the input number by two, before spelling it out.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Here’s the HTML for it, where we include a new input of type checkbox and its label.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"Note the name ( multiply_by_2 ) and value ( True ) params—we’ll use it later in the post request.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"medium","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-12T09:55:29.166Z
theme: uncategorized
keyword_group: uncategorized
copyright_note: local research archive only
---

# Adding a Checkbox &amp; Download Button to a FastAPI-HTML app

## clean_text

Adding a Checkbox & Download Button to a FastAPI-HTML app
eugeneyan
Start Here
Writing
Speaking
Prototyping
About
Adding a Checkbox & Download Button to a FastAPI-HTML app
engineering
python
til
· 3 min read
In a previous post , I shared about how to build a simple HTML app using FastAPI . Here, we’ll extend that app by adding functionality for checkboxes and a download button.
Try it out with the GitHub repo here: fastapi-html
Let’s allow users to alter results
To demonstrate this, we’ll create a checkbox to multiply the input number by two, before spelling it out.
Here’s the HTML for it, where we include a new input of type checkbox and its label. Note the name ( multiply_by_2 ) and value ( True ) params—we’ll use it later in the post request.
<!DOCTYPE html>
<html lang= "en" >
<head>
<meta charset= "UTF-8" >
<title> Sample Form </title>
</head>
<body>
<form method= "post" >
<input type= "number" name= "num" value= "" />
<input type= "checkbox" id= "multiply_by_2" name= "multiply_by_2" value= "True" >
<label for= "multiply_by_2" > Multiply by 2 </label>
<input type= "submit" >
</form>
<p> Result: </p>
</body>
</html>
We’ll update our post request to take an additional param multiply_by_2 (from name ). By default, the value is False ; but if we check the checkbox, we get the value of True (from value ). This boolean is passed into spell_number which handles the logic.
@ app . post ( '/checkbox' )
def form_post ( request : Request , num : int = Form (...), multiply_by_2 : bool = Form ( False )):
result = spell_number ( num , multiply_by_2 )
return templates . TemplateResponse ( 'checkbox.html' , context = { 'request' : request , 'result' : result , 'num' : num })
Here are the results with and without checking the option.
Results with and without the "Multiply by 2" option
Let’s allow users to download results
After users view the results, they might want to download it. (In this scenario, it’s a really simple result. Nonetheless, a real app could provide results such as a csv of fraudulent purchases, a pdf report, or an ipython notebook.)
To achieve this, we’ll add a download button. Notice that we now have two inputs of type submit . As usual, we’ll use the name and value params.
<!DOCTYPE html>
<html lang= "en" >
<head>
<meta charset= "UTF-8" >
<title> Sample Form </title>
</head>
<body>
<form method= "post" >
<input type= "number" name= "num" value= "" />
<input type= "checkbox" id= "multiply_by_2" name= "multiply_by_2" value= "True" >
<label for= "multiply_by_2" > Multiply by 2 </label>
<input type= "submit" name= "action" value= "convert" >
<input type= "submit" name= "action" value= "download" >
</form>
<p> Result: </p>
</body>
</html>
We’ll update the post request with some basic logic to either return the result via HTML, or to download the file. Note that for FileResponse to work, we’ll need to install the aiofiles package.
@ app . post ( '/download' )
def form_post ( request : Request , num : int = Form (...),
multiply_by_2 : bool = Form ( False ), action : str = Form (...)):
if action == 'convert' :
result = spell_number ( num , multiply_by_2 )
return templates . TemplateResponse ( 'download.html' , context = { 'request' : request , 'result' : result , 'num' : num })
elif action == 'download' :
# Requires aiofiles
result = spell_number ( num , multiply_by_2 )
filepath = save_to_text ( result , num )
return FileResponse ( filepath , media_type = 'application/octet-stream' , filename = '{}.txt' . format ( num ))
Here’s how the downloaded file looks like. It is named after the input query 1234.txt . The results will be the input query spelt out (possibly multiply by two).
The downloaded file (1234.txt) and the result (with "Multiply by 2")
Try it out with the GitHub repo here: fastapi-html
Next, we update our FastAPI app to let users:
• Select options via a checkbox
• Download results via a download button https://t.co/jFUmiMaud4
&mdash; Eugene Yan (@eugeneyan) August 7, 2020
If you found this useful, please cite this write-up as:
Yan, Ziyou. (Aug 2020). Adding a Checkbox & Download Button to a FastAPI-HTML app. eugeneyan.com.
https://eugeneyan.com/writing/fastapi-html-checkbox-download/.
or
@article{yan2020fastapi2,
title = {Adding a Checkbox & Download Button to a FastAPI-HTML app},
author = {Yan, Ziyou},
journal = {eugeneyan.com},
year = {2020},
month = {Aug},
url = {https://eugeneyan.com/writing/fastapi-html-checkbox-download/}
Share on:
Browse related tags: [
engineering
python
til
or Search
&laquo; What I Did Not Learn About Writing In School
Unpopular Opinion: Data Scientists Should be More End-to-End &raquo;
Join 11,800+ readers getting updates on machine learning, RecSys, LLMs, and engineering.

## full_text

Adding a Checkbox & Download Button to a FastAPI-HTML app
eugeneyan
Start Here
Writing
Speaking
Prototyping
About
Adding a Checkbox & Download Button to a FastAPI-HTML app
engineering
python
til
· 3 min read
In a previous post , I shared about how to build a simple HTML app using FastAPI . Here, we’ll extend that app by adding functionality for checkboxes and a download button.
Try it out with the GitHub repo here: fastapi-html
Let’s allow users to alter results
To demonstrate this, we’ll create a checkbox to multiply the input number by two, before spelling it out.
Here’s the HTML for it, where we include a new input of type checkbox and its label. Note the name ( multiply_by_2 ) and value ( True ) params—we’ll use it later in the post request.
<!DOCTYPE html>
<html lang= "en" >
<head>
<meta charset= "UTF-8" >
<title> Sample Form </title>
</head>
<body>
<form method= "post" >
<input type= "number" name= "num" value= "" />
<input type= "checkbox" id= "multiply_by_2" name= "multiply_by_2" value= "True" >
<label for= "multiply_by_2" > Multiply by 2 </label>
<input type= "submit" >
</form>
<p> Result: </p>
</body>
</html>
We’ll update our post request to take an additional param multiply_by_2 (from name ). By default, the value is False ; but if we check the checkbox, we get the value of True (from value ). This boolean is passed into spell_number which handles the logic.
@ app . post ( '/checkbox' )
def form_post ( request : Request , num : int = Form (...), multiply_by_2 : bool = Form ( False )):
result = spell_number ( num , multiply_by_2 )
return templates . TemplateResponse ( 'checkbox.html' , context = { 'request' : request , 'result' : result , 'num' : num })
Here are the results with and without checking the option.
Results with and without the "Multiply by 2" option
Let’s allow users to download results
After users view the results, they might want to download it. (In this scenario, it’s a really simple result. Nonetheless, a real app could provide results such as a csv of fraudulent purchases, a pdf report, or an ipython notebook.)
To achieve this, we’ll add a download button. Notice that we now have two inputs of type submit . As usual, we’ll use the name and value params.
<!DOCTYPE html>
<html lang= "en" >
<head>
<meta charset= "UTF-8" >
<title> Sample Form </title>
</head>
<body>
<form method= "post" >
<input type= "number" name= "num" value= "" />
<input type= "checkbox" id= "multiply_by_2" name= "multiply_by_2" value= "True" >
<label for= "multiply_by_2" > Multiply by 2 </label>
<input type= "submit" name= "action" value= "convert" >
<input type= "submit" name= "action" value= "download" >
</form>
<p> Result: </p>
</body>
</html>
We’ll update the post request with some basic logic to either return the result via HTML, or to download the file. Note that for FileResponse to work, we’ll need to install the aiofiles package.
@ app . post ( '/download' )
def form_post ( request : Request , num : int = Form (...),
multiply_by_2 : bool = Form ( False ), action : str = Form (...)):
if action == 'convert' :
result = spell_number ( num , multiply_by_2 )
return templates . TemplateResponse ( 'download.html' , context = { 'request' : request , 'result' : result , 'num' : num })
elif action == 'download' :
# Requires aiofiles
result = spell_number ( num , multiply_by_2 )
filepath = save_to_text ( result , num )
return FileResponse ( filepath , media_type = 'application/octet-stream' , filename = '{}.txt' . format ( num ))
Here’s how the downloaded file looks like. It is named after the input query 1234.txt . The results will be the input query spelt out (possibly multiply by two).
The downloaded file (1234.txt) and the result (with "Multiply by 2")
Try it out with the GitHub repo here: fastapi-html
Next, we update our FastAPI app to let users:
• Select options via a checkbox
• Download results via a download button https://t.co/jFUmiMaud4
&mdash; Eugene Yan (@eugeneyan) August 7, 2020
If you found this useful, please cite this write-up as:
Yan, Ziyou. (Aug 2020). Adding a Checkbox & Download Button to a FastAPI-HTML app. eugeneyan.com.
https://eugeneyan.com/writing/fastapi-html-checkbox-download/.
or
@article{yan2020fastapi2,
title = {Adding a Checkbox & Download Button to a FastAPI-HTML app},
author = {Yan, Ziyou},
journal = {eugeneyan.com},
year = {2020},
month = {Aug},
url = {https://eugeneyan.com/writing/fastapi-html-checkbox-download/}
Share on:
Browse related tags: [
engineering
python
til
or Search
&laquo; What I Did Not Learn About Writing In School
Unpopular Opinion: Data Scientists Should be More End-to-End &raquo;
Join 11,800+ readers getting updates on machine learning, RecSys, LLMs, and engineering.

## extraction_diagnostics

- extraction_method: body-visible-text
- readability_score: 85
- fetch_status: fetched-readable-text-body-visible-text
- extraction_quality: high
- diagnostics: {"readability_score":85,"text_length":4698,"paragraph_count":62,"sentence_count":30,"boilerplate_hits":0,"symbol_ratio":0.0394,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"body-visible-text"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Updating our FastAPI app to let users select options and download results.

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Adding a Checkbox & Download Button to a FastAPI-HTML app eugeneyan Start Here Writing Speaking Prototyping About Adding a Checkbox & Download Button to a FastAPI-HTML app engineering python til · 3 min read In a previous post , I shared about how to build a simple HTML app using FastAPI .

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Here, we’ll extend that app by adding functionality for checkboxes and a download button.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Try it out with the GitHub repo here: fastapi-html Let’s allow users to alter results To demonstrate this, we’ll create a checkbox to multiply the input number by two, before spelling it out.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Here’s the HTML for it, where we include a new input of type checkbox and its label.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=medium｜confidence=high
   Note the name ( multiply_by_2 ) and value ( True ) params—we’ll use it later in the post request.

## business_elements

- companies: Eugene Yan's Blog, GitHub, Meta
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 开发者 / 工程团队
- workflows: 暂无公开信息
- business_actions: 暂无公开信息
- affected_departments: IT / 安全
- numbers: 3 m, 2, 8, 1234, 4, 7, 2020, 11
- quotes:  >
<head>
<meta charset=  /  >
<title> Sample Form </title>
</head>
<body>
<form method=  /  >
<input type=  /  value=  /  />
<input type=

## evidence_seed

- company_actions: Updating our FastAPI app to let users select options and download results. / Adding a Checkbox & Download Button to a FastAPI-HTML app eugeneyan Start Here Writing Speaking Prototyping About Adding a Checkbox & Download Button to a FastAPI-HTML app engineering python til · 3 min read In a previous post , I shared about how to build a simple HTML app using FastAPI . / Here, we’ll extend that app by adding functionality for checkboxes and a download button.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 暂无公开信息
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: none
- importance_score: 1
- importance_reason: no core WaveSight importance signal
- supporting_signals:
- novelty: 2
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 2
- guanlan_relevance: 2
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: false
- business_change: false
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势
- 没有具体客户或真实企业案例
- 没有变化前后流程线索

## volatile_and_discovery_handling

- source_volatility: low
- community_name: not_applicable
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: supporting_evidence
- discovery_source: none
- source_role: resolved_original_source
- origin_fetch_status: not_applicable
- discovery_record: none

## 原始摘要 / 采集文本

Updating our FastAPI app to let users select options and download results.

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
