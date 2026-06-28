---
schema_version: raw-evidence-v2
raw_id: R-039
title: "AlignEval: Building an App to Make Evals Easy, Fun, and Automated"
original_url: "https://eugeneyan.com//writing/aligneval/"
canonical_url: "https://eugeneyan.com/writing/aligneval"
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
collected_at: 2026-06-28T04:05:28.092Z
language: mixed
full_text_hash: e350378d4fcb32f8
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-28/r-039-aligneval-building-an-app-to-make-evals-easy-fun-and-automated.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-06-28/r-039-aligneval-building-an-app-to-make-evals-easy-fun-and-automated.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-content-container
extraction_quality: high
extraction_method: "content-container"
readability_score: 94
extractor_diagnostics: {"readability_score":94,"text_length":10079,"paragraph_count":60,"sentence_count":115,"boilerplate_hits":1,"symbol_ratio":0.0016,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}
has_full_text: true
content_length: 10079
fetch_error: ""
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"e350378d4fcb32f8","missing":[]}
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
url_hash: d9e3b86c1645fa9b
content_hash: e350378d4fcb32f8
semantic_hash: b8fe1951718f5e1b
duplicate_of: ""
first_seen_at: "2026-06-28T04:05:28.092Z"
last_seen_at: 2026-06-28T04:05:28.092Z
update_detected: false
raw_status: candidate
usable_for: {"viewpoint":false,"case":true,"change":true,"trend":true,"daily_observation":true,"heatmap":true,"briefing":true,"emerging_pool":false,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["core_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":4,"importance_reason":"new product or service; rubric=4 concrete important change","supporting_signals":["enterprise_ai_transformation_lens","commercial_or_risk_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":2}
business_elements: {"companies":["Eugene Yan's Blog","Cursor"],"products":["agents","claude","gpt-4","Cursor"],"people":[],"industries":["开发者工具"],"roles":["开发者 / 工程团队"],"workflows":["计费 / 预算管理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","财务 / 预算"],"numbers":["35%","2023","0","1","50","2","20","100 b"],"quotes":["AI Evals for Engineers and PMs"," It is impossible to completely determine evaluation criteria prior to human judging of LLM outputs. ","Evaluate","Optimize"]}
evidence_seed: {"company_actions":["Look at and label your data, build and evaluate your LLM-evaluator, and optimize it against your labels.","com to start building your own LLM-evaluator; sample data included.","Update : Now integrated with LangSmith and featured on VentureBeat !"],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"company_action","text":"Look at and label your data, build and evaluate your LLM-evaluator, and optimize it against your labels.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"com to start building your own LLM-evaluator; sample data included.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"Update : Now integrated with LangSmith and featured on VentureBeat !","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"🎉 Every AI-powered product needs evals.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"company_action","text":"But let’s face it—they’re a pain to build, hard to scale, and most teams get them wrong.","supports":["daily_observation","heatmap","change","case","trend"],"importance":"medium","confidence":"high"},{"type":"product_update","text":"As a result, many AI-powered experiences are bottlenecked on evals, sometimes delaying launches by weeks or even months.","supports":["daily_observation","heatmap","change"],"importance":"medium","confidence":"high"}]
theme: technical-iteration-signal
keyword_group: technical-iteration-signal
copyright_note: local research archive only
---

# AlignEval: Building an App to Make Evals Easy, Fun, and Automated

## clean_text

Go to aligneval.com to start building your own LLM-evaluator; sample data included.
Update : Now integrated with LangSmith and featured on VentureBeat ! 🎉
Every AI-powered product needs evals. But let’s face it—they’re a pain to build, hard to scale, and most teams get them wrong. As a result, many AI-powered experiences are bottlenecked on evals, sometimes delaying launches by weeks or even months.
I’ve spent the past year or so wrestling with product/task-specific evals. Testing different ways to detect hallucinations, finetune evaluators, and evaluate LLM-based evaluators. There were dead ends. There were rabbit holes. But I learned what works and what doesn’t .
And that’s why I’m excited to introduce AlignEval , an app that makes evals easy and… fun? (Okay, I’ll settle for less painful.) It also tries to automate part of the process. AlignEval makes building LLM-evaluators as straightforward as four simple steps:
Upload a CSV file with columns for input and output.
Look at the data and label samples as pass or fail.
Define eval criteria, run the LLM-evaluator, check results.
Optimize the LLM-evaluator with dev-test splits.
By the way, if you want to learn more about evals, my friends Hamel and Shreya are hosting their final cohort of “AI Evals for Engineers and PMs” in July. Here’s a 35% discount code .
Align AI to human. Calibrate human to AI. Repeat.
The key insight is that aligning AI to human preferences is only half the battle. To build effective evals, we must also calibrate human criteria to AI output .
Many teams make the mistake of crafting elaborate eval criteria without first looking at the data . It’s like theorizing about user experience and defects from the ivory tower, without doing error analysis. From Who Validates the Validators : “ It is impossible to completely determine evaluation criteria prior to human judging of LLM outputs. ”
This leads to two types of bad criteria. First, irrelevant criteria that are a waste of time, such as generic metrics (e.g., helpfulness) or very low probability defects (e.g., grammar, spelling). Second, unrealistic, unattainable criteria that the technology isn’t ready for, such as autonomous agents back in 2023. Either way, teams squander effort that would have been better invested in evaluating actual defects that occur with moderate frequency.
(I think out-of-the-box eval solutions fuel this problem, pushing generic criteria that are easy to plug and play but ignore the idiosyncrasies of your domain, product, and data.)
The way to solve this—and build useful evals—is to work backward from the data. That’s what AlignEval tries to do by putting data and metrics first, not preset criteria or LLMs.
Getting started: Upload some data
To get started, upload a CSV file containing the following columns:
id : Lets you match labeled and evaluated samples to your data
input : The context provided to the LLM to generate the output (e.g., text to classify, news to summarize, retrieved documents for answering questions)
output : What the LLM generates (e.g., classification label, summary, answer)
label : Your judgment on whether the output passes (0) or fails (1)
Instructions to upload a CSV file.
If you don’t have a CSV handy, download a sample based on the Factual Inconsistency Benchmark . It contains 50 news articles, each with two summaries. One is factually consistent while the other is not. Perfect for AlignEval’s binary labeling task.
After uploading the CSV, you’ll see the data in a flexible table view. Adjust the width of the browser to control how wide or narrow you want the table and columns to be.
How the table view looks after uploading a CSV file.
Labeling mode: Look at the data
In labeling mode, our only job is to look at the data. AlignEval simplifies the process to a comparison between input and output fields. And for each sample, we only have to make a binary decision—pass or fail.
Instructions for labeling mode.
Why binary labels? It leads to more accurate data, takes less time, and keeps cognitive load low. DoorDash adopted a similar approach . Similarly, Llama2 focused on collecting binary human preferences. The Llama2 authors also shared at a meetup that collecting binary preferences was much faster than writing samples for supervised finetuning.
What’s important is that we look at the data with an open mind, and not write criteria based on our priors. We should also resist the urge to prematurely define criteria. We need to first immerse ourselves in the data. This reduces the risk of hunting for nonexistent defects or chasing unrealistic expectations. By understanding what the LLM actually generates, we can define more meaningful, better-calibrated criteria.
Look at your data remix, courtesy of Jason Liu. Sign up for his next RAG course here .
After labeling 20 rows, we unlock evaluation mode. (While evaluation mode is available after 20 labels, I think it’s too little to understand the data well enough to define criteria, and too small a sample for evaluation. I suggest aiming for 50-100 before writing criteria and running evals. The more familiar you are with your data, the better your evals will be.)
Evaluation mode: Write criteria, evaluate the evaluator
After unlocking evaluation mode, we can now write our task-specific evaluation criteria. Keep it simple: Evaluate on a single dimension and return either 0 (pass) or 1 (fail).
Instructions for evaluation mode.
Here’s the prompt I use for factual inconsistency classification. We start with only two sentences that define what a pass or fail looks like. We can refine it after running the LLM-evaluator and examining the explanations and predictions.
Writing the prompt and selecting models and fields.
Next, we choose our model (gpt-4o-mini or claude-3-haiku) and input fields (both input and output, or output only). For most tasks, (e.g., classification, summarization, Q&A), we want to compare the output to the input. Nonetheless, for some tasks, like evaluating style guide adherence or tone of voice, we only need the output. Focusing solely on the output reduces token cost and latency while potentially improving performance.
It’s also crucial to evaluate our LLM-evaluators against the labeled data. Hit “Evaluate” and we’ll see metrics in the top right corner: sample size, recall, precision, F1, Cohen’s $\kappa$, and counts for true and false positives/negatives.
Metrics to evaluate the LLM-evaluator.
If our sample size is low (e.g., 20), the metrics can fluctuate a lot, even when we rerun the same LLM-evaluator. This is due to LLM stochasticity. We can improve stability by labeling more data. Aim for at least 50 labeled samples which also unlocks optimization mode.
Optimization mode: Semi-automated improvements 🤞
Optimization mode is where the magic (hopefully) happens. Click “Optimize” and let AlignEval do its thing to improve your LLM-evaluator. While it’s still in early beta, it’s achieved decent improvements for several use cases. (And no, it’s not dspy.)
Instructions for optimization mode.
Under the hood, optimization splits the labeled data into dev and test sets. (Since we’re not training a model, we call it a development split instead of a training split.) It then runs $n$ trials on the dev set to improve F1, using the same LLM and fields from evaluation mode. After $n$ trials, the improved LLM-evaluator is evaled on the unseen test set. In the table below, F1 starts at 0.571, increases to 0.722 at trial 5 on dev, then gets F1=0.727 on test.
Metrics from optimization trials on all, dev, and test splits.
Sometimes, the dev and test metrics diverge significantly. With the small sample size (25 per split, 50 in total), this likely stems from the dev split being unrepresentative of the full data distribution, including the test split. Thus, the LLM-evaluator may overfit on the dev set and fail to generalize to the test set.
To improve generalization across the dev and test splits, we can label more data, ensuring that it’s diverse and representative. To be diverse is to be balanced in both 0 and 1 labels, and the variety of inputs and outputs. To be representative is to be similar to real-world examples. We can also run multiple LLM-evaluators in parallel and ensemble their scores. PoLL showed that an ensemble of three smaller LLM-evaluators outperformed gpt-4.
For a visual walkthrough, here’s a demo where I look at and label 50 rows of data lol.
Behind the scenes: How AlignEval was built
As a frontend development newbie (this is my first TypeScript app), I relied on the wisdom of the crowd, polling Twitter and LinkedIn for advice. I also built the same app five times to get a feel for several frameworks. Specifically, I tried FastHTML, Next.js, SvelteKit, and FastAPI + HTML (my go-to for prototyping).
From early prototypes, Next.js seemed to be a good fit. Intuitive, scalable, and the perfect excuse to learn TypeScript. And thanks to Cursor, my beginner questions were answered easily: What’s the difference between const and let ? What is a prop ? It also made it easier to build UX components and fix bugs 2-3x faster, keeping velocity and motivation high.
For the backend, Python + FastAPI was the obvious choice. Python’s ecosystem of data analysis and machine learning made it easier to experiment with optimization mode.
When it came to LLMs, I went with the smallest models from the biggest labs: gpt-4o-mini and claude-3-haiku (soon to be claude-3.5-haiku). They’re cheap, fast, and good enough for binary classification LLM-evaluators. It’s the perfect combo for a free app. And with each release, these small models just keep getting more and more capable.
For gpt-4o-mini, I used the structured output functionality that’s still in beta. It allows users to define the desired output schema using Zod (JavaScript) or Pydantic (Python). Here’s an example in Javascript and its equivalent in Python:
import { z } from " zod " ;
const EvaluationResponse = z . object ({
explanation : z . string (),
prediction : z . string (). refine (( val ) => val === ' 0 ' || val === ' 1 ' )
});

## full_text

Go to aligneval.com to start building your own LLM-evaluator; sample data included.
Update : Now integrated with LangSmith and featured on VentureBeat ! 🎉
Every AI-powered product needs evals. But let’s face it—they’re a pain to build, hard to scale, and most teams get them wrong. As a result, many AI-powered experiences are bottlenecked on evals, sometimes delaying launches by weeks or even months.
I’ve spent the past year or so wrestling with product/task-specific evals. Testing different ways to detect hallucinations, finetune evaluators, and evaluate LLM-based evaluators. There were dead ends. There were rabbit holes. But I learned what works and what doesn’t .
And that’s why I’m excited to introduce AlignEval , an app that makes evals easy and… fun? (Okay, I’ll settle for less painful.) It also tries to automate part of the process. AlignEval makes building LLM-evaluators as straightforward as four simple steps:
Upload a CSV file with columns for input and output.
Look at the data and label samples as pass or fail.
Define eval criteria, run the LLM-evaluator, check results.
Optimize the LLM-evaluator with dev-test splits.
By the way, if you want to learn more about evals, my friends Hamel and Shreya are hosting their final cohort of “AI Evals for Engineers and PMs” in July. Here’s a 35% discount code .
Align AI to human. Calibrate human to AI. Repeat.
The key insight is that aligning AI to human preferences is only half the battle. To build effective evals, we must also calibrate human criteria to AI output .
Many teams make the mistake of crafting elaborate eval criteria without first looking at the data . It’s like theorizing about user experience and defects from the ivory tower, without doing error analysis. From Who Validates the Validators : “ It is impossible to completely determine evaluation criteria prior to human judging of LLM outputs. ”
This leads to two types of bad criteria. First, irrelevant criteria that are a waste of time, such as generic metrics (e.g., helpfulness) or very low probability defects (e.g., grammar, spelling). Second, unrealistic, unattainable criteria that the technology isn’t ready for, such as autonomous agents back in 2023. Either way, teams squander effort that would have been better invested in evaluating actual defects that occur with moderate frequency.
(I think out-of-the-box eval solutions fuel this problem, pushing generic criteria that are easy to plug and play but ignore the idiosyncrasies of your domain, product, and data.)
The way to solve this—and build useful evals—is to work backward from the data. That’s what AlignEval tries to do by putting data and metrics first, not preset criteria or LLMs.
Getting started: Upload some data
To get started, upload a CSV file containing the following columns:
id : Lets you match labeled and evaluated samples to your data
input : The context provided to the LLM to generate the output (e.g., text to classify, news to summarize, retrieved documents for answering questions)
output : What the LLM generates (e.g., classification label, summary, answer)
label : Your judgment on whether the output passes (0) or fails (1)
Instructions to upload a CSV file.
If you don’t have a CSV handy, download a sample based on the Factual Inconsistency Benchmark . It contains 50 news articles, each with two summaries. One is factually consistent while the other is not. Perfect for AlignEval’s binary labeling task.
After uploading the CSV, you’ll see the data in a flexible table view. Adjust the width of the browser to control how wide or narrow you want the table and columns to be.
How the table view looks after uploading a CSV file.
Labeling mode: Look at the data
In labeling mode, our only job is to look at the data. AlignEval simplifies the process to a comparison between input and output fields. And for each sample, we only have to make a binary decision—pass or fail.
Instructions for labeling mode.
Why binary labels? It leads to more accurate data, takes less time, and keeps cognitive load low. DoorDash adopted a similar approach . Similarly, Llama2 focused on collecting binary human preferences. The Llama2 authors also shared at a meetup that collecting binary preferences was much faster than writing samples for supervised finetuning.
What’s important is that we look at the data with an open mind, and not write criteria based on our priors. We should also resist the urge to prematurely define criteria. We need to first immerse ourselves in the data. This reduces the risk of hunting for nonexistent defects or chasing unrealistic expectations. By understanding what the LLM actually generates, we can define more meaningful, better-calibrated criteria.
Look at your data remix, courtesy of Jason Liu. Sign up for his next RAG course here .
After labeling 20 rows, we unlock evaluation mode. (While evaluation mode is available after 20 labels, I think it’s too little to understand the data well enough to define criteria, and too small a sample for evaluation. I suggest aiming for 50-100 before writing criteria and running evals. The more familiar you are with your data, the better your evals will be.)
Evaluation mode: Write criteria, evaluate the evaluator
After unlocking evaluation mode, we can now write our task-specific evaluation criteria. Keep it simple: Evaluate on a single dimension and return either 0 (pass) or 1 (fail).
Instructions for evaluation mode.
Here’s the prompt I use for factual inconsistency classification. We start with only two sentences that define what a pass or fail looks like. We can refine it after running the LLM-evaluator and examining the explanations and predictions.
Writing the prompt and selecting models and fields.
Next, we choose our model (gpt-4o-mini or claude-3-haiku) and input fields (both input and output, or output only). For most tasks, (e.g., classification, summarization, Q&A), we want to compare the output to the input. Nonetheless, for some tasks, like evaluating style guide adherence or tone of voice, we only need the output. Focusing solely on the output reduces token cost and latency while potentially improving performance.
It’s also crucial to evaluate our LLM-evaluators against the labeled data. Hit “Evaluate” and we’ll see metrics in the top right corner: sample size, recall, precision, F1, Cohen’s $\kappa$, and counts for true and false positives/negatives.
Metrics to evaluate the LLM-evaluator.
If our sample size is low (e.g., 20), the metrics can fluctuate a lot, even when we rerun the same LLM-evaluator. This is due to LLM stochasticity. We can improve stability by labeling more data. Aim for at least 50 labeled samples which also unlocks optimization mode.
Optimization mode: Semi-automated improvements 🤞
Optimization mode is where the magic (hopefully) happens. Click “Optimize” and let AlignEval do its thing to improve your LLM-evaluator. While it’s still in early beta, it’s achieved decent improvements for several use cases. (And no, it’s not dspy.)
Instructions for optimization mode.
Under the hood, optimization splits the labeled data into dev and test sets. (Since we’re not training a model, we call it a development split instead of a training split.) It then runs $n$ trials on the dev set to improve F1, using the same LLM and fields from evaluation mode. After $n$ trials, the improved LLM-evaluator is evaled on the unseen test set. In the table below, F1 starts at 0.571, increases to 0.722 at trial 5 on dev, then gets F1=0.727 on test.
Metrics from optimization trials on all, dev, and test splits.
Sometimes, the dev and test metrics diverge significantly. With the small sample size (25 per split, 50 in total), this likely stems from the dev split being unrepresentative of the full data distribution, including the test split. Thus, the LLM-evaluator may overfit on the dev set and fail to generalize to the test set.
To improve generalization across the dev and test splits, we can label more data, ensuring that it’s diverse and representative. To be diverse is to be balanced in both 0 and 1 labels, and the variety of inputs and outputs. To be representative is to be similar to real-world examples. We can also run multiple LLM-evaluators in parallel and ensemble their scores. PoLL showed that an ensemble of three smaller LLM-evaluators outperformed gpt-4.
For a visual walkthrough, here’s a demo where I look at and label 50 rows of data lol.
Behind the scenes: How AlignEval was built
As a frontend development newbie (this is my first TypeScript app), I relied on the wisdom of the crowd, polling Twitter and LinkedIn for advice. I also built the same app five times to get a feel for several frameworks. Specifically, I tried FastHTML, Next.js, SvelteKit, and FastAPI + HTML (my go-to for prototyping).
From early prototypes, Next.js seemed to be a good fit. Intuitive, scalable, and the perfect excuse to learn TypeScript. And thanks to Cursor, my beginner questions were answered easily: What’s the difference between const and let ? What is a prop ? It also made it easier to build UX components and fix bugs 2-3x faster, keeping velocity and motivation high.
For the backend, Python + FastAPI was the obvious choice. Python’s ecosystem of data analysis and machine learning made it easier to experiment with optimization mode.
When it came to LLMs, I went with the smallest models from the biggest labs: gpt-4o-mini and claude-3-haiku (soon to be claude-3.5-haiku). They’re cheap, fast, and good enough for binary classification LLM-evaluators. It’s the perfect combo for a free app. And with each release, these small models just keep getting more and more capable.
For gpt-4o-mini, I used the structured output functionality that’s still in beta. It allows users to define the desired output schema using Zod (JavaScript) or Pydantic (Python). Here’s an example in Javascript and its equivalent in Python:
import { z } from " zod " ;
const EvaluationResponse = z . object ({
explanation : z . string (),
prediction : z . string (). refine (( val ) => val === ' 0 ' || val === ' 1 ' )
});

## extraction_diagnostics

- extraction_method: content-container
- readability_score: 94
- fetch_status: fetched-readable-text-content-container
- extraction_quality: high
- diagnostics: {"readability_score":94,"text_length":10079,"paragraph_count":60,"sentence_count":115,"boilerplate_hits":1,"symbol_ratio":0.0016,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"content-container"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   Look at and label your data, build and evaluate your LLM-evaluator, and optimize it against your labels.

2. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   com to start building your own LLM-evaluator; sample data included.

3. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   Update : Now integrated with LangSmith and featured on VentureBeat !

4. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   🎉 Every AI-powered product needs evals.

5. **company_action**｜supports=daily_observation, heatmap, change, case, trend｜importance=medium｜confidence=high
   But let’s face it—they’re a pain to build, hard to scale, and most teams get them wrong.

6. **product_update**｜supports=daily_observation, heatmap, change｜importance=medium｜confidence=high
   As a result, many AI-powered experiences are bottlenecked on evals, sometimes delaying launches by weeks or even months.

## business_elements

- companies: Eugene Yan's Blog, Cursor
- products: agents, claude, gpt-4, Cursor
- people: 暂无公开信息
- industries: 开发者工具
- roles: 开发者 / 工程团队
- workflows: 计费 / 预算管理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 财务 / 预算
- numbers: 35%, 2023, 0, 1, 50, 2, 20, 100 b
- quotes: AI Evals for Engineers and PMs /  It is impossible to completely determine evaluation criteria prior to human judging of LLM outputs.  / Evaluate / Optimize

## evidence_seed

- company_actions: Look at and label your data, build and evaluate your LLM-evaluator, and optimize it against your labels. / com to start building your own LLM-evaluator; sample data included. / Update : Now integrated with LangSmith and featured on VentureBeat !
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 4
- importance_reason: new product or service; rubric=4 concrete important change
- supporting_signals: enterprise_ai_transformation_lens,commercial_or_risk_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 2

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

Look at and label your data, build and evaluate your LLM-evaluator, and optimize it against your labels.

## 采集备注

该条目由 rss-feed 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT daily 和 paused-opinion-source 的权重来自精选入口，不来自来源等级。HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
