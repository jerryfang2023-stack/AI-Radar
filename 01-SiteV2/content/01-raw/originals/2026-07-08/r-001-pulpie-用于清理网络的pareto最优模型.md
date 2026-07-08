---
schema_version: raw-evidence-v2
raw_id: R-001
title: "Pulpie：用于清理网络的Pareto最优模型"
title_zh: "Pulpie：用于清理网络的Pareto最优模型"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://usefeyn.com/blog/pulpie-pareto-optimal-models-for-cleaning-the-web"
canonical_url: "https://usefeyn.com/blog/pulpie-pareto-optimal-models-for-cleaning-the-web"
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: event
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
published_at: "2026-07-08T01:33:24.910Z"
collected_at: 2026-07-08T04:39:25.265Z
language: mixed
full_text_hash: 48cd9787d6a37ca4
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-08/r-001-pulpie-用于清理网络的pareto最优模型.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-08/r-001-pulpie-用于清理网络的pareto最优模型.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 88
extractor_diagnostics: {"readability_score":88,"text_length":15228,"paragraph_count":160,"sentence_count":155,"boilerplate_hits":3,"symbol_ratio":0.0045,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 15228
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"48cd9787d6a37ca4","missing":[]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: user_feedback_signal
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Pulpie：用于清理网络的Pareto最优模型","discovery_summary":"Pulpie是一族Pareto最优模型，用于从HTML页面提取主要内容。其最小模型pulpie-orange-small（210M参数）在WebMainBench上取得0.862的ROUGE-5 F1分数，接近600M参数的Dripper（0.864），但成本仅1/20。在NVIDIA L4 GPU上，Pulpie处理速度13.7页/秒，Dripper仅0.68页/秒。清理10亿页HTML，Pulpie成本约$7，900，Dripper需$159，000。模型采用编码器架构，单次前向传播即可标记每个HTML块为内容或模板，已在HuggingFace开源。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://usefeyn.com/blog/pulpie-pareto-optimal-models-for-cleaning-the-web","discovered_at":"2026-07-08T04:23:58.339Z","rank_on_page":53,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: f334587351f5d361
content_hash: 48cd9787d6a37ca4
semantic_hash: ef394b217c015a09
duplicate_of: ""
first_seen_at: "2026-07-08T01:33:24.910Z"
last_seen_at: 2026-07-08T04:39:25.265Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":true,"trend_candidate_context":true,"signal_card_candidate":true,"emerging_pool":true,"user_feedback_pool":true,"watchlist":true}
pool_routes: ["core_pool","emerging_pool","user_feedback_pool"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"important_market_structure","importance_score":5,"importance_reason":"market-structure commercial event; rubric=5 major/platform/industry-shaping","supporting_signals":["commercial_or_risk_context","adoption_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":4}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","GitHub","Nvidia"],"products":[],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人"],"workflows":["计费 / 预算管理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","财务 / 预算"],"numbers":["210M","0.862","5","1","600M","0.864","20","4"],"quotes":[" (default), ","AICC: Parse HTML Finer, Make Models Better — A 7.3T AI-Ready Corpus Built by a Model-Based HTML Parser.","EuroBERT: Scaling Multilingual Encoders for European Languages.","Distilling the Knowledge in a Neural Network.","Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer."]}
evidence_seed: {"company_actions":["Research · field note Pulpie: Pareto-Optimal Models for Cleaning the Web Authors Bhavnick Minhas, Shreyash Nigam Affiliation Feyn Labs Published June 25, 2026 Reading time 13 min We’re introducing Pulpie, a family of Pareto-optimal models for extracting main content from HTML pages.","Pulpie approaches SOTA extraction quality at one twentieth the cost.","Our smallest model, pulpie-orange-small , scores 0."],"case_details":[],"workflow_changes":[],"before_after_clues":["可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人"],"risks_or_constraints":[]}
missing_information: ["没有具体客户或真实企业案例"]
key_excerpts: [{"type":"number","text":"Pulpie是一族Pareto最优模型，用于从HTML页面提取主要内容。其最小模型pulpie-orange-small（210M参数）在WebMainBench上取得0.862的ROUGE-5 F1分数，接近600M参数的Dripper（0.864），但成本仅1/20。在NVIDIA L4 GPU上，Pulpie处理速度13.7页/秒，Dripper仅0.68页/秒。清理10亿页HTML，Pulpie成本约$7，900，Dripper需$159，000。模型采用编码器架构，单次前向传播即可标记每个HTML块为内容或模板，已在HuggingFace开源。","supports":["signal_card_candidate","relationship_graph_input","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Research · field note Pulpie: Pareto-Optimal Models for Cleaning the Web Authors Bhavnick Minhas, Shreyash Nigam Affiliation Feyn Labs Published June 25, 2026 Reading time 13 min We’re introducing Pulpie, a family of Pareto-optimal models for extracting main content from HTML pages.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Pulpie approaches SOTA extraction quality at one twentieth the cost.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"Our smallest model, pulpie-orange-small , scores 0.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"862 ROUGE-5 F1 on WebMainBench.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"This matches Dripper, the leading extractor, which scores 0.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-08T04:39:25.265Z
theme: early-direction-signal
keyword_group: early-direction-signal
copyright_note: local research archive only
---

# Pulpie：用于清理网络的Pareto最优模型

## clean_text

Research · field note
Pulpie: Pareto-Optimal Models for Cleaning the Web
Authors
Bhavnick Minhas, Shreyash Nigam
Affiliation
Feyn Labs
Published
June 25, 2026
Reading time
13 min
We’re introducing Pulpie, a family of Pareto-optimal models for extracting main content from HTML pages. Pulpie approaches SOTA extraction quality at one twentieth the cost.
Our smallest model, pulpie-orange-small , scores 0.862 ROUGE-5 F1 on WebMainBench. This matches Dripper, the leading extractor, which scores 0.864. Pulpie’s performance is despite it being a third the size: 210M parameters versus Dripper’s 600M.
The gains come from architecture. Pulpie is an encoder that labels every HTML block as content or boilerplate in a single forward pass. This also makes it fast.
On an NVIDIA L4 GPU, pulpie-orange-small processes 13.7 pages/sec against Dripper’s 0.68 pages/sec. At $0.39/hr for an L4 instance, cleaning 1 billion pages costs $7,900 with Pulpie and $159,000 with Dripper.
Pulpie unlocks high quality web extraction at a scale impossible before. We expect this to benefit pre-training and context management.
Our models are open source and available on Hugging Face . See Get started for instructions.
Extraction is the bottleneck
Language models consume the web twice. First in pre-training, where they learn about the world. Then at inference, when they pull in relevant context. Both times the input is mostly noise. During discovery, we found 70% of the blocks on a typical HTML page hold boilerplate like navigation, ads, sidebars, and footers. Main content is only a small fraction of the page.
However, that fraction determines model quality on both ends.
AICC ( Ma et al., 2025 ) measured the effect of cleaner extraction on pre-training. The team built two corpora from the same Common Crawl snapshot. One extracted content with heuristics. The other extracted it with a model-based parser. Everything else in the data pipeline remained equal. They then trained an identical model on each corpus.
The model trained on the model-extracted corpus scored 1.08 percentage points higher in average accuracy across 13 benchmarks. Since only extraction logic changed, we can attribute the gain entirely to having cleaner data.
Impressively, the same model also beat models trained on FineWeb and RefinedWeb, two of the most heavily filtered pre-training corpora. These datasets have earned their reputations through elaborate filtering and deduplication. Beating them by improving the extractor illustrates the high value of clean data.
Beyond setting a low baseline, poor extraction materially harms models. Heuristics break structured content. The table below shows how Trafilatura and model-based extractors compare on preserving code blocks and formulas. Low similarity scores indicate corruption. If used in training, resulting models will inherit this damage.
Content Trafilatura (heuristic) Model-based
Code blocks 0.13 0.91
Formulas 0.61 0.94
Data quality matters at inference too. Shi et al. (ICML 2023) showed that a single irrelevant passage is enough to derail a model’s answer. A model is more accurate and more efficient when its context is free of noise.
Cleaning on a budget
Cleaning the web pays off in both training and inference. The open question is how do we clean well at scale?
First, to understand the landscape, we can divide current extractors into two families based on the question: Does the method read the page, or inspect its structure?
Structure-based extractors judge an HTML block by surface signals. They apply rules over tags, DOM, and text density to separate content from boilerplate. Trafilatura, Readability, and magic-html work this way. Boilerpipe goes one step further and trains a classifier on those same signals. These extractors are easy to run but they confuse similarly built elements. A navigation table and a data table look identical to an algorithm counting cells.
Reading extractors feed the page to a transformer and label each block based on its content. Dripper is a decoder built on this idea. The decoder emits labels one token at a time. Each label forces the full model to be read from memory for a single step of work. This ties speed to memory bandwidth and makes runs expensive.
Pulpie keeps the reading approach but moves the bottleneck to compute. We do this by using an encoder architecture that labels every block in a single forward pass. This enables Pulpie to match Dripper’s quality while being smaller, faster, and cheaper.
Quality vs Cost of Web Content Extraction
ROUGE-5 F1
Cost / 1B pages
$175K
$140K
$105K
$70K
$35K
$0
0.90
0.80
0.70
0.60
0.50
20x cheaper, same quality
Pulpie Small Quality 0.862 Cost $7.9K
Pulpie Small
Dripper
magic-html Trafilatura Pulpie Small Pulpie Base Pulpie Large Dripper
Selected 0.862 Pulpie Small
Cost $7.9K per 1B pages
Depulping raw HTML
The full pipeline runs in four stages:
Simplify the HTML. Remove scripts, styles, and other formatting noise. Tag each block with a unique ID.
Chunk the blocks. Split the blocks, tokenize them, and pack them into chunks of at most 8,192 tokens, so each chunk fits the model in one pass. About 80% of pages fit in a single chunk.
Classify. Run a forward pass. Pulpie labels each block as content or boilerplate.
Return. Return the kept blocks as HTML, or convert them to Markdown.
Training
Training Pulpie needed a large set of HTML pages with block-level labels. No such public set existed, so we built one.
We sampled 16,670 English pages from Common Crawl, limiting to one per domain. We then used MinerU-HTML to split each page into blocks, and labeled each block as content or boilerplate with DeepSeek V3.2. Further filtering removed empty, corrupted, and otherwise unfit pages, leaving 15,880.
We then ran Dripper 0.6B as a second labeler across all 15,880 pages to flag inconsistent labels. Block-level agreement with DeepSeek was 93.3%. We kept the 14,959 pages where the two labelers agreed on at least 70% of blocks, trading some data for a cleaner training set.
Teaching a teacher
To create our teacher model, we fine-tuned EuroBERT-2.1B on the aforementioned 14,959 pages.
Setting Value
Learning rate 2e-5
Effective batch size 8
Loss Class-weighted cross-entropy
Hardware 4x A100
Class weights are set inversely to the 28.6% content rate to counter the imbalance.
The teacher scored 0.873 ROUGE-5 F1 on the WebMainBench English set. At 2.1B parameters it is accurate but expensive to run, so we distilled it into smaller models.
Imparting knowledge
For a better production fit, we distilled the 2.1B teacher into two smaller models:
Pulpie Orange Base, a 610M parameter encoder.
Pulpie Orange Small, a 210M parameter encoder.
Both students learn from the teacher following Hinton et al. (2015) . The teacher’s softened output distribution supplies most of the signal through a KL-divergence loss weighted 0.7, with hard-label cross-entropy making up the remaining 0.3, at temperature 2.0. Both train on the same data as the teacher.
The distilled models keep almost all of the teacher’s quality.
Model Parameters ROUGE-5 F1 vs. Teacher
Pulpie Orange Small 210M 0.862 -1.1 F1 points
Dripper 0.6B 0.864 -0.9 F1 points
Pulpie Orange Base 610M 0.863 -1.0 F1 points
Pulpie Orange Large (teacher) 2.1B 0.873 -
Despite a tenfold cut in size, the 210M model is within one F1 point. Combined with its speed and cost benefits, pulpie-orange-small features the best size-to-quality ratio in the entire family. It is the model we recommend for production use.
Results
Quality
We measure ROUGE-5 F1 on the English subset of WebMainBench (6,647 pages across all difficulty levels). Empty extractions count as zero.
Method ROUGE-5 F1 Empty pages
magic-html 0.700 384
Trafilatura 0.619 16
Pulpie Orange Small 0.862 45
Dripper 0.864 135
Pulpie Orange Base 0.863 36
Pulpie Orange Large 0.873 21
Pulpie Orange Large is the strongest single model at 0.873, ahead of Dripper by 0.9 F1 points. The 210M model ties Dripper at a third the size. Frontier LLMs score higher on this benchmark, near 0.90, which is the quality Pulpie approaches.
Dripper returns nothing on 135 pages. 130 are due to the page overflowing its 32k-token context window. Pulpie packs blocks into 8,192-token chunks, so page length never forces a failure.
Breaking results down by difficulty:
Method All Simple Mid Hard
magic-html 0.700 0.773 0.697 0.637
Trafilatura 0.619 0.721 0.619 0.526
Pulpie Orange Small 0.862 0.906 0.868 0.813
Dripper 0.864 0.913 0.865 0.817
Pulpie Orange Base 0.863 0.906 0.868 0.818
Pulpie Orange Large 0.873 0.914 0.879 0.827
Every method loses ground as pages get harder. The heuristics fall fastest, dropping 14 to 20 F1 points from simple to hard, while the encoders give up about 9 F1 points. Dripper’s performance range matches the encoders, with a gap of 10 F1 points between simple and hard pages.
Speed
Throughput by Model
20x faster than Dripper on L4 , comparing Pulpie Small on the same pages.
L4 A100
NVIDIA L4 Pages/sec
Pulpie Small 13.7 p/s Pulpie Base 3.9 p/s Pulpie Large 1.3 p/s Dripper 0.68 p/s
Selected 13.7 p/s Pulpie Small
Cost $7.9K per 1B pages
NVIDIA A100 Pages/sec
Pulpie Small 25.7 p/s Pulpie Base 7.7 p/s Pulpie Large 3.5 p/s Dripper 3.6 p/s
Selected 25.7 p/s Pulpie Small
Cost $29K per 1B pages
L4 throughput, on 500 real Common Crawl pages:
Method Throughput (pages/sec) Hardware
Pulpie Orange Small 13.7 L4
Dripper 0.68 L4
Pulpie Orange Base 3.9 L4
Pulpie Orange Large 1.3 L4
Pulpie Orange Small runs 20x faster than Dripper on the same L4.
A100 throughput, same pages, GPU inference only, batched for every model:
Method Throughput (pages/sec) Hardware
Pulpie Orange Small 25.7 A100
Dripper 3.6 A100
Pulpie Orange Base 7.7 A100
Pulpie Orange Large 3.5 A100
On the A100, Pulpie Orange Small runs 7.1x faster than Dripper. The 2.1B teacher matches Dripper on speed while beating it on quality.
Cost
Cost per 1B Pages
20x cheaper than Dripper on L4 , comparing Pulpie Small on the same pages.
L4 A100
NVIDIA L4 Cost / 1B pages
Pulpie Small $8K Pulpie Base $28K Pulpie Large $83K Dripper $159K
Selected $8K Pulpie Small
GPU-hours 20,276 per 1B pages
NVIDIA A100 Cost / 1B pages
Pulpie Small $29K Pulpie Base $98K Pulpie Large $216K Dripper $210K
Selected $29K Pulpie Small
GPU-hours 10,808 per 1B pages
L4 cost for 1 billion pages at $0.39/hr. Calculated using the throughputs measured above:
Setup Pages/sec GPU-hours / 1B Cost / 1B pages
Pulpie Small on L4 13.7 20,300 ~$7,900
Dripper on L4 0.68 408,000 ~$159,000
Pulpie Base on L4 3.9 71,200 ~$28,000
Pulpie Large on L4 1.3 214,000 ~$83,000
A100 cost for 1 billion pages at $2.72/hr. Calculated using the throughputs measured above:
Setup Pages/sec GPU-hours / 1B Cost / 1B pages
Pulpie Small on A100 25.7 10,800 ~$29,000
Dripper on A100 3.6 77,200 ~$210,000
Pulpie Base on A100 7.7 36,100 ~$98,000
Pulpie Large on A100 3.5 79,400 ~$216,000
Cheap GPUs like Encoders
The throughput gap between Pulpie and Dripper is much larger than a 3x difference in size would imply. On the A100, we measure this gap as 7.1x, and on the L4 it widens to 20x. The reason for this is architectural.
A decoder generates labels one token at a time. Each step reads the full model from GPU memory to produce a single token. Consequently, a decoder’s speed is bound by memory bandwidth. Conversely, an encoder runs one forward pass over the whole input. This dense matrix multiply is limited only by compute.
Add to the above that A100 and L4 differ more in bandwidth than in compute:
Dimension NVIDIA A100 NVIDIA L4 Ratio (A100/L4)
Memory Bandwidth 2,039 GB/s 300 GB/s ~6.8x
Tensor Core TFLOPS 312 120 ~2.6x
Dropping from A100 to L4 starves the bandwidth-bound decoder far more than the compute-bound encoder. This widens the throughput gap and lets Pulpie Orange Large pull ahead on L4 despite matching Dripper on A100.
Get started
The Pulpie models are on Hugging Face. Install the package:
pip install pulpie
Extract clean content from raw HTML:
from pulpie import Extractor
extractor = Extractor() # defaults to Pulpie Orange Small
result = extractor.extract(html)
print (result.markdown) # clean markdown
print (result.n_main, result.n_other) # blocks kept vs dropped
For maximum quality over speed, pick a larger model:
extractor = Extractor( model = "large" ) # "small" (default), "base", or "large"
For bulk processing, the pipeline overlaps CPU preprocessing with GPU inference across one or more GPUs:
from pulpie import Pipeline, PageInput
pipeline = Pipeline( model = "small" )
results = pipeline.extract_batch(
[PageInput( html = h, page_id = i) for i, h in enumerate (pages)]
All three models are built on EuroBERT ( Boizard et al., 2025 ), use the same <|sep|> block-marker architecture, and share a tokenizer:
Name Hugging Face Parameters ROUGE-5 F1 Notes
Orange Small feyninc/pulpie-orange-small-v1 210M 0.862 Recommended
Orange Base feyninc/pulpie-orange-base-v1 610M 0.863 Distilled from Large
Orange Large feyninc/pulpie-orange-large-v1 2.1B 0.873 Teacher
Pulpie Orange Small is the recommended and default model. It approaches SOTA extraction quality at one twentieth the cost and runs the fastest.
Pulpie is built by Feyn. Find us on GitHub , Hugging Face , or X .
Acknowledgements
Pulpie builds directly on the work of the MinerU-HTML and Dripper team ( Ma et al., 2025 ). Their simplify_html preprocessing, block-level annotation scheme, and the WebMainBench benchmark are foundational to this work. We also use their Dripper 0.6B model to cross-validate our training labels. We’re grateful they released their tools and data.
References
[1] Ma et al. "AICC: Parse HTML Finer, Make Models Better — A 7.3T AI-Ready Corpus Built by a Model-Based HTML Parser." arXiv:2511.16397 (2025).
[2] Boizard et al. "EuroBERT: Scaling Multilingual Encoders for European Languages." arXiv:2503.05500 (2025).
[3] Hinton et al. "Distilling the Knowledge in a Neural Network." arXiv:1503.02531 (2015).
[4] Raffel et al. "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer." JMLR 2020.
[5] Penedo et al. "The RefinedWeb Dataset for Falcon LLM: Outperforming Curated Corpora with Web Data Only." NeurIPS 2023.
[6] Penedo et al. "The FineWeb Datasets: Decanting the Web for the Finest Text Data at Scale." arXiv:2406.17557 (2024).
[7] Li et al. "DataComp-LM: In Search of the Next Generation of Training Sets for Language Models." NeurIPS 2024.
[8] Soldaini et al. "Dolma: An Open Corpus of Three Trillion Tokens for Language Model Pretraining Research." ACL 2024.
[9] Barbaresi. "Trafilatura: A Web Scraping Library and Command-Line Tool for Text Discovery and Extraction." ACL/IJCNLP 2021.
[10] Kohlschütter et al. "Boilerplate Detection using Shallow Text Features." WSDM 2010.
[11] Pomikálek. "Removing Boilerplate and Duplicate Content from Web Corpora." PhD thesis, Masaryk University , 2011.
[12] Bevendorff et al. "An Empirical Comparison of Web Content Extraction Algorithms." SIGIR 2023.
[13] Shi et al. "Large Language Models Can Be Easily Distracted by Irrelevant Context." ICML 2023.
Cite this note
@note{pulpie2026,
title = {Pulpie: Pareto-Optimal Models for Cleaning the Web},
author = {Minhas, Bhavnick and Nigam, Shreyash and Feyn Research},
year = {2026},
venue = {Feyn Field Notes}

## full_text

Research · field note
Pulpie: Pareto-Optimal Models for Cleaning the Web
Authors
Bhavnick Minhas, Shreyash Nigam
Affiliation
Feyn Labs
Published
June 25, 2026
Reading time
13 min
We’re introducing Pulpie, a family of Pareto-optimal models for extracting main content from HTML pages. Pulpie approaches SOTA extraction quality at one twentieth the cost.
Our smallest model, pulpie-orange-small , scores 0.862 ROUGE-5 F1 on WebMainBench. This matches Dripper, the leading extractor, which scores 0.864. Pulpie’s performance is despite it being a third the size: 210M parameters versus Dripper’s 600M.
The gains come from architecture. Pulpie is an encoder that labels every HTML block as content or boilerplate in a single forward pass. This also makes it fast.
On an NVIDIA L4 GPU, pulpie-orange-small processes 13.7 pages/sec against Dripper’s 0.68 pages/sec. At $0.39/hr for an L4 instance, cleaning 1 billion pages costs $7,900 with Pulpie and $159,000 with Dripper.
Pulpie unlocks high quality web extraction at a scale impossible before. We expect this to benefit pre-training and context management.
Our models are open source and available on Hugging Face . See Get started for instructions.
Extraction is the bottleneck
Language models consume the web twice. First in pre-training, where they learn about the world. Then at inference, when they pull in relevant context. Both times the input is mostly noise. During discovery, we found 70% of the blocks on a typical HTML page hold boilerplate like navigation, ads, sidebars, and footers. Main content is only a small fraction of the page.
However, that fraction determines model quality on both ends.
AICC ( Ma et al., 2025 ) measured the effect of cleaner extraction on pre-training. The team built two corpora from the same Common Crawl snapshot. One extracted content with heuristics. The other extracted it with a model-based parser. Everything else in the data pipeline remained equal. They then trained an identical model on each corpus.
The model trained on the model-extracted corpus scored 1.08 percentage points higher in average accuracy across 13 benchmarks. Since only extraction logic changed, we can attribute the gain entirely to having cleaner data.
Impressively, the same model also beat models trained on FineWeb and RefinedWeb, two of the most heavily filtered pre-training corpora. These datasets have earned their reputations through elaborate filtering and deduplication. Beating them by improving the extractor illustrates the high value of clean data.
Beyond setting a low baseline, poor extraction materially harms models. Heuristics break structured content. The table below shows how Trafilatura and model-based extractors compare on preserving code blocks and formulas. Low similarity scores indicate corruption. If used in training, resulting models will inherit this damage.
Content Trafilatura (heuristic) Model-based
Code blocks 0.13 0.91
Formulas 0.61 0.94
Data quality matters at inference too. Shi et al. (ICML 2023) showed that a single irrelevant passage is enough to derail a model’s answer. A model is more accurate and more efficient when its context is free of noise.
Cleaning on a budget
Cleaning the web pays off in both training and inference. The open question is how do we clean well at scale?
First, to understand the landscape, we can divide current extractors into two families based on the question: Does the method read the page, or inspect its structure?
Structure-based extractors judge an HTML block by surface signals. They apply rules over tags, DOM, and text density to separate content from boilerplate. Trafilatura, Readability, and magic-html work this way. Boilerpipe goes one step further and trains a classifier on those same signals. These extractors are easy to run but they confuse similarly built elements. A navigation table and a data table look identical to an algorithm counting cells.
Reading extractors feed the page to a transformer and label each block based on its content. Dripper is a decoder built on this idea. The decoder emits labels one token at a time. Each label forces the full model to be read from memory for a single step of work. This ties speed to memory bandwidth and makes runs expensive.
Pulpie keeps the reading approach but moves the bottleneck to compute. We do this by using an encoder architecture that labels every block in a single forward pass. This enables Pulpie to match Dripper’s quality while being smaller, faster, and cheaper.
Quality vs Cost of Web Content Extraction
ROUGE-5 F1
Cost / 1B pages
$175K
$140K
$105K
$70K
$35K
$0
0.90
0.80
0.70
0.60
0.50
20x cheaper, same quality
Pulpie Small Quality 0.862 Cost $7.9K
Pulpie Small
Dripper
magic-html Trafilatura Pulpie Small Pulpie Base Pulpie Large Dripper
Selected 0.862 Pulpie Small
Cost $7.9K per 1B pages
Depulping raw HTML
The full pipeline runs in four stages:
Simplify the HTML. Remove scripts, styles, and other formatting noise. Tag each block with a unique ID.
Chunk the blocks. Split the blocks, tokenize them, and pack them into chunks of at most 8,192 tokens, so each chunk fits the model in one pass. About 80% of pages fit in a single chunk.
Classify. Run a forward pass. Pulpie labels each block as content or boilerplate.
Return. Return the kept blocks as HTML, or convert them to Markdown.
Training
Training Pulpie needed a large set of HTML pages with block-level labels. No such public set existed, so we built one.
We sampled 16,670 English pages from Common Crawl, limiting to one per domain. We then used MinerU-HTML to split each page into blocks, and labeled each block as content or boilerplate with DeepSeek V3.2. Further filtering removed empty, corrupted, and otherwise unfit pages, leaving 15,880.
We then ran Dripper 0.6B as a second labeler across all 15,880 pages to flag inconsistent labels. Block-level agreement with DeepSeek was 93.3%. We kept the 14,959 pages where the two labelers agreed on at least 70% of blocks, trading some data for a cleaner training set.
Teaching a teacher
To create our teacher model, we fine-tuned EuroBERT-2.1B on the aforementioned 14,959 pages.
Setting Value
Learning rate 2e-5
Effective batch size 8
Loss Class-weighted cross-entropy
Hardware 4x A100
Class weights are set inversely to the 28.6% content rate to counter the imbalance.
The teacher scored 0.873 ROUGE-5 F1 on the WebMainBench English set. At 2.1B parameters it is accurate but expensive to run, so we distilled it into smaller models.
Imparting knowledge
For a better production fit, we distilled the 2.1B teacher into two smaller models:
Pulpie Orange Base, a 610M parameter encoder.
Pulpie Orange Small, a 210M parameter encoder.
Both students learn from the teacher following Hinton et al. (2015) . The teacher’s softened output distribution supplies most of the signal through a KL-divergence loss weighted 0.7, with hard-label cross-entropy making up the remaining 0.3, at temperature 2.0. Both train on the same data as the teacher.
The distilled models keep almost all of the teacher’s quality.
Model Parameters ROUGE-5 F1 vs. Teacher
Pulpie Orange Small 210M 0.862 -1.1 F1 points
Dripper 0.6B 0.864 -0.9 F1 points
Pulpie Orange Base 610M 0.863 -1.0 F1 points
Pulpie Orange Large (teacher) 2.1B 0.873 -
Despite a tenfold cut in size, the 210M model is within one F1 point. Combined with its speed and cost benefits, pulpie-orange-small features the best size-to-quality ratio in the entire family. It is the model we recommend for production use.
Results
Quality
We measure ROUGE-5 F1 on the English subset of WebMainBench (6,647 pages across all difficulty levels). Empty extractions count as zero.
Method ROUGE-5 F1 Empty pages
magic-html 0.700 384
Trafilatura 0.619 16
Pulpie Orange Small 0.862 45
Dripper 0.864 135
Pulpie Orange Base 0.863 36
Pulpie Orange Large 0.873 21
Pulpie Orange Large is the strongest single model at 0.873, ahead of Dripper by 0.9 F1 points. The 210M model ties Dripper at a third the size. Frontier LLMs score higher on this benchmark, near 0.90, which is the quality Pulpie approaches.
Dripper returns nothing on 135 pages. 130 are due to the page overflowing its 32k-token context window. Pulpie packs blocks into 8,192-token chunks, so page length never forces a failure.
Breaking results down by difficulty:
Method All Simple Mid Hard
magic-html 0.700 0.773 0.697 0.637
Trafilatura 0.619 0.721 0.619 0.526
Pulpie Orange Small 0.862 0.906 0.868 0.813
Dripper 0.864 0.913 0.865 0.817
Pulpie Orange Base 0.863 0.906 0.868 0.818
Pulpie Orange Large 0.873 0.914 0.879 0.827
Every method loses ground as pages get harder. The heuristics fall fastest, dropping 14 to 20 F1 points from simple to hard, while the encoders give up about 9 F1 points. Dripper’s performance range matches the encoders, with a gap of 10 F1 points between simple and hard pages.
Speed
Throughput by Model
20x faster than Dripper on L4 , comparing Pulpie Small on the same pages.
L4 A100
NVIDIA L4 Pages/sec
Pulpie Small 13.7 p/s Pulpie Base 3.9 p/s Pulpie Large 1.3 p/s Dripper 0.68 p/s
Selected 13.7 p/s Pulpie Small
Cost $7.9K per 1B pages
NVIDIA A100 Pages/sec
Pulpie Small 25.7 p/s Pulpie Base 7.7 p/s Pulpie Large 3.5 p/s Dripper 3.6 p/s
Selected 25.7 p/s Pulpie Small
Cost $29K per 1B pages
L4 throughput, on 500 real Common Crawl pages:
Method Throughput (pages/sec) Hardware
Pulpie Orange Small 13.7 L4
Dripper 0.68 L4
Pulpie Orange Base 3.9 L4
Pulpie Orange Large 1.3 L4
Pulpie Orange Small runs 20x faster than Dripper on the same L4.
A100 throughput, same pages, GPU inference only, batched for every model:
Method Throughput (pages/sec) Hardware
Pulpie Orange Small 25.7 A100
Dripper 3.6 A100
Pulpie Orange Base 7.7 A100
Pulpie Orange Large 3.5 A100
On the A100, Pulpie Orange Small runs 7.1x faster than Dripper. The 2.1B teacher matches Dripper on speed while beating it on quality.
Cost
Cost per 1B Pages
20x cheaper than Dripper on L4 , comparing Pulpie Small on the same pages.
L4 A100
NVIDIA L4 Cost / 1B pages
Pulpie Small $8K Pulpie Base $28K Pulpie Large $83K Dripper $159K
Selected $8K Pulpie Small
GPU-hours 20,276 per 1B pages
NVIDIA A100 Cost / 1B pages
Pulpie Small $29K Pulpie Base $98K Pulpie Large $216K Dripper $210K
Selected $29K Pulpie Small
GPU-hours 10,808 per 1B pages
L4 cost for 1 billion pages at $0.39/hr. Calculated using the throughputs measured above:
Setup Pages/sec GPU-hours / 1B Cost / 1B pages
Pulpie Small on L4 13.7 20,300 ~$7,900
Dripper on L4 0.68 408,000 ~$159,000
Pulpie Base on L4 3.9 71,200 ~$28,000
Pulpie Large on L4 1.3 214,000 ~$83,000
A100 cost for 1 billion pages at $2.72/hr. Calculated using the throughputs measured above:
Setup Pages/sec GPU-hours / 1B Cost / 1B pages
Pulpie Small on A100 25.7 10,800 ~$29,000
Dripper on A100 3.6 77,200 ~$210,000
Pulpie Base on A100 7.7 36,100 ~$98,000
Pulpie Large on A100 3.5 79,400 ~$216,000
Cheap GPUs like Encoders
The throughput gap between Pulpie and Dripper is much larger than a 3x difference in size would imply. On the A100, we measure this gap as 7.1x, and on the L4 it widens to 20x. The reason for this is architectural.
A decoder generates labels one token at a time. Each step reads the full model from GPU memory to produce a single token. Consequently, a decoder’s speed is bound by memory bandwidth. Conversely, an encoder runs one forward pass over the whole input. This dense matrix multiply is limited only by compute.
Add to the above that A100 and L4 differ more in bandwidth than in compute:
Dimension NVIDIA A100 NVIDIA L4 Ratio (A100/L4)
Memory Bandwidth 2,039 GB/s 300 GB/s ~6.8x
Tensor Core TFLOPS 312 120 ~2.6x
Dropping from A100 to L4 starves the bandwidth-bound decoder far more than the compute-bound encoder. This widens the throughput gap and lets Pulpie Orange Large pull ahead on L4 despite matching Dripper on A100.
Get started
The Pulpie models are on Hugging Face. Install the package:
pip install pulpie
Extract clean content from raw HTML:
from pulpie import Extractor
extractor = Extractor() # defaults to Pulpie Orange Small
result = extractor.extract(html)
print (result.markdown) # clean markdown
print (result.n_main, result.n_other) # blocks kept vs dropped
For maximum quality over speed, pick a larger model:
extractor = Extractor( model = "large" ) # "small" (default), "base", or "large"
For bulk processing, the pipeline overlaps CPU preprocessing with GPU inference across one or more GPUs:
from pulpie import Pipeline, PageInput
pipeline = Pipeline( model = "small" )
results = pipeline.extract_batch(
[PageInput( html = h, page_id = i) for i, h in enumerate (pages)]
All three models are built on EuroBERT ( Boizard et al., 2025 ), use the same <|sep|> block-marker architecture, and share a tokenizer:
Name Hugging Face Parameters ROUGE-5 F1 Notes
Orange Small feyninc/pulpie-orange-small-v1 210M 0.862 Recommended
Orange Base feyninc/pulpie-orange-base-v1 610M 0.863 Distilled from Large
Orange Large feyninc/pulpie-orange-large-v1 2.1B 0.873 Teacher
Pulpie Orange Small is the recommended and default model. It approaches SOTA extraction quality at one twentieth the cost and runs the fastest.
Pulpie is built by Feyn. Find us on GitHub , Hugging Face , or X .
Acknowledgements
Pulpie builds directly on the work of the MinerU-HTML and Dripper team ( Ma et al., 2025 ). Their simplify_html preprocessing, block-level annotation scheme, and the WebMainBench benchmark are foundational to this work. We also use their Dripper 0.6B model to cross-validate our training labels. We’re grateful they released their tools and data.
References
[1] Ma et al. "AICC: Parse HTML Finer, Make Models Better — A 7.3T AI-Ready Corpus Built by a Model-Based HTML Parser." arXiv:2511.16397 (2025).
[2] Boizard et al. "EuroBERT: Scaling Multilingual Encoders for European Languages." arXiv:2503.05500 (2025).
[3] Hinton et al. "Distilling the Knowledge in a Neural Network." arXiv:1503.02531 (2015).
[4] Raffel et al. "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer." JMLR 2020.
[5] Penedo et al. "The RefinedWeb Dataset for Falcon LLM: Outperforming Curated Corpora with Web Data Only." NeurIPS 2023.
[6] Penedo et al. "The FineWeb Datasets: Decanting the Web for the Finest Text Data at Scale." arXiv:2406.17557 (2024).
[7] Li et al. "DataComp-LM: In Search of the Next Generation of Training Sets for Language Models." NeurIPS 2024.
[8] Soldaini et al. "Dolma: An Open Corpus of Three Trillion Tokens for Language Model Pretraining Research." ACL 2024.
[9] Barbaresi. "Trafilatura: A Web Scraping Library and Command-Line Tool for Text Discovery and Extraction." ACL/IJCNLP 2021.
[10] Kohlschütter et al. "Boilerplate Detection using Shallow Text Features." WSDM 2010.
[11] Pomikálek. "Removing Boilerplate and Duplicate Content from Web Corpora." PhD thesis, Masaryk University , 2011.
[12] Bevendorff et al. "An Empirical Comparison of Web Content Extraction Algorithms." SIGIR 2023.
[13] Shi et al. "Large Language Models Can Be Easily Distracted by Irrelevant Context." ICML 2023.
Cite this note
@note{pulpie2026,
title = {Pulpie: Pareto-Optimal Models for Cleaning the Web},
author = {Minhas, Bhavnick and Nigam, Shreyash and Feyn Research},
year = {2026},
venue = {Feyn Field Notes}

## extraction_diagnostics

- extraction_method: main
- readability_score: 88
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":88,"text_length":15228,"paragraph_count":160,"sentence_count":155,"boilerplate_hits":3,"symbol_ratio":0.0045,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **number**｜supports=signal_card_candidate, relationship_graph_input, case, trend_candidate_context｜importance=high｜confidence=high
   Pulpie是一族Pareto最优模型，用于从HTML页面提取主要内容。其最小模型pulpie-orange-small（210M参数）在WebMainBench上取得0.862的ROUGE-5 F1分数，接近600M参数的Dripper（0.864），但成本仅1/20。在NVIDIA L4 GPU上，Pulpie处理速度13.7页/秒，Dripper仅0.68页/秒。清理10亿页HTML，Pulpie成本约$7，900，Dripper需$159，000。模型采用编码器架构，单次前向传播即可标记每个HTML块为内容或模板，已在HuggingFace开源。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Research · field note Pulpie: Pareto-Optimal Models for Cleaning the Web Authors Bhavnick Minhas, Shreyash Nigam Affiliation Feyn Labs Published June 25, 2026 Reading time 13 min We’re introducing Pulpie, a family of Pareto-optimal models for extracting main content from HTML pages.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Pulpie approaches SOTA extraction quality at one twentieth the cost.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   Our smallest model, pulpie-orange-small , scores 0.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   862 ROUGE-5 F1 on WebMainBench.

6. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   This matches Dripper, the leading extractor, which scores 0.

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, GitHub, Nvidia
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人
- workflows: 计费 / 预算管理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 财务 / 预算
- numbers: 210M, 0.862, 5, 1, 600M, 0.864, 20, 4
- quotes:  (default),  / AICC: Parse HTML Finer, Make Models Better — A 7.3T AI-Ready Corpus Built by a Model-Based HTML Parser. / EuroBERT: Scaling Multilingual Encoders for European Languages. / Distilling the Knowledge in a Neural Network. / Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer.

## evidence_seed

- company_actions: Research · field note Pulpie: Pareto-Optimal Models for Cleaning the Web Authors Bhavnick Minhas, Shreyash Nigam Affiliation Feyn Labs Published June 25, 2026 Reading time 13 min We’re introducing Pulpie, a family of Pareto-optimal models for extracting main content from HTML pages. / Pulpie approaches SOTA extraction quality at one twentieth the cost. / Our smallest model, pulpie-orange-small , scores 0.
- case_details: 暂无公开信息
- workflow_changes: 暂无公开信息
- before_after_clues: 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: important_market_structure
- importance_score: 5
- importance_reason: market-structure commercial event; rubric=5 major/platform/industry-shaping
- supporting_signals: commercial_or_risk_context,adoption_context
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
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: article_text
- visible_range: 抓取时页面可见正文 / 讨论文本
- evidence_level: user_feedback_signal
- discovery_source: AI HOT
- source_role: resolved_original_source
- origin_fetch_status: success
- discovery_record: {"discovery_title":"Pulpie：用于清理网络的Pareto最优模型","discovery_summary":"Pulpie是一族Pareto最优模型，用于从HTML页面提取主要内容。其最小模型pulpie-orange-small（210M参数）在WebMainBench上取得0.862的ROUGE-5 F1分数，接近600M参数的Dripper（0.864），但成本仅1/20。在NVIDIA L4 GPU上，Pulpie处理速度13.7页/秒，Dripper仅0.68页/秒。清理10亿页HTML，Pulpie成本约$7，900，Dripper需$159，000。模型采用编码器架构，单次前向传播即可标记每个HTML块为内容或模板，已在HuggingFace开源。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"https://usefeyn.com/blog/pulpie-pareto-optimal-models-for-cleaning-the-web","discovered_at":"2026-07-08T04:23:58.339Z","rank_on_page":53,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

Pulpie是一族Pareto最优模型，用于从HTML页面提取主要内容。其最小模型pulpie-orange-small（210M参数）在WebMainBench上取得0.862的ROUGE-5 F1分数，接近600M参数的Dripper（0.864），但成本仅1/20。在NVIDIA L4 GPU上，Pulpie处理速度13.7页/秒，Dripper仅0.68页/秒。清理10亿页HTML，Pulpie成本约$7，900，Dripper需$159，000。模型采用编码器架构，单次前向传播即可标记每个HTML块为内容或模板，已在HuggingFace开源。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
