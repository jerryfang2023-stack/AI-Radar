---
schema_version: raw-evidence-v2
raw_id: R-027
title: "SGLang 集成 DSpark 推测解码：置信度驱动的可变长度验证"
title_zh: "SGLang 集成 DSpark 推测解码：置信度驱动的可变长度验证"
title_translation_status: not_required
title_translation_method: source_title
original_url: "https://www.lmsys.org/blog/2026-07-06-dspark-sglang"
canonical_url: "https://lmsys.org/blog/2026-07-06-dspark-sglang"
source_name: "LMSYS：Blog（Chatbot Arena 团队）"
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
published_at: "2026-07-06T17:11:47.280Z"
collected_at: 2026-07-07T02:46:59.532Z
language: mixed
full_text_hash: 8f9301d5c732c6b4
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-07/r-027-sglang-集成-dspark-推测解码-置信度驱动的可变长度验证.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-07/r-027-sglang-集成-dspark-推测解码-置信度驱动的可变长度验证.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: fetched-readable-text-main
extraction_quality: high
extraction_method: "main"
readability_score: 97
extractor_diagnostics: {"readability_score":97,"text_length":15520,"paragraph_count":213,"sentence_count":105,"boilerplate_hits":0,"symbol_ratio":0.004,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}
has_full_text: true
content_length: 15520
fetch_error: ""
evidence_strength: rich_evidence
raw_qc_decision: allow
raw_qc_downstream_use: eligible_after_qc
degradation_reasons: []
evidence_completeness: {"original_url_status":"present","full_text_status":"present","snapshot_status":"present","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"8f9301d5c732c6b4","missing":[]}
source_volatility: medium
community_name: ""
capture_scope: article_text
visible_range: "抓取时页面可见正文 / 讨论文本"
evidence_level: core_evidence_candidate
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"SGLang 集成 DSpark 推测解码：置信度驱动的可变长度验证","discovery_summary":"SGLang 团队将 DSpark 推测解码算法集成到开源推理引擎中。该算法采用半自回归块起草器一次生成一组 token，并利用置信度头与顺序温度缩放（STS）为每个请求动态分配可变验证长度，从而在高负载下裁剪无效验证成本。SGLang 支持密集模型（如 Qwen3）和稀疏模型（如 DeepSeek-V4），通过全 CUDA 图处理不规则的每请求验证长度。提供三种验证模式：`static`（全长）、`compact`（生产路径）和 `cap-accept`（接受上限测量）。还引入了零开销调度、基于离线成本表的在线调度器、融合 Triton 核等优化。在 H200 上使用 DeepSeek-V4-Flash 的测试中，DSpark 在整个并发扫描范围内比 MTP 和非推测基线实现了更优的吞吐量-延迟权衡。","source_name":"LMSYS：Blog（Chatbot Arena 团队）","origin_url":"https://www.lmsys.org/blog/2026-07-06-dspark-sglang","discovered_at":"2026-07-07T02:33:49.176Z","rank_on_page":140,"discovery_status":"discovered"}
source_role: resolved_original_source
origin_fetch_status: "success"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e039d0b6952f528a
content_hash: 8f9301d5c732c6b4
semantic_hash: 5e90e57b4116d081
duplicate_of: ""
first_seen_at: "2026-07-06T17:11:47.280Z"
last_seen_at: 2026-07-07T02:46:59.532Z
update_detected: false
raw_status: pooled
usable_for: {"viewpoint":false,"case":true,"business_change":true,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":true,"user_feedback_pool":false,"watchlist":true}
pool_routes: ["emerging_pool","watchlist"]
change_action_detected: true
evidence_eligibility: eligible
evidence_block_reason: ""
guanlan_scores: {"importance_type":"supporting_signal","importance_score":2,"importance_reason":"consumer entertainment or minor platform policy feature; AI-adjacent but not a core business signal","supporting_signals":["low_value_ai_adjacent_context"],"novelty":3,"evidence_strength":4,"case_richness":5,"trend_relevance":2,"guanlan_relevance":2,"emerging_signal_score":4}
business_elements: {"companies":["LMSYS","Blog（Chatbot Arena 团队）"],"products":[],"people":[],"industries":["开发者工具"],"roles":["CIO / IT 负责人","开发者 / 工程团队"],"workflows":["合同审阅 / 法律研究","计费 / 预算管理","部署 / 集成交付"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全","财务 / 预算","销售 / 客服"],"numbers":["3","4","200","6","2026","1","256","2"],"quotes":[]}
evidence_seed: {"company_actions":["‹ Back to Blog ‹ Back to Blog Contents The speedup over MTP and non-spec Adopting DSpark in SGLang Verify modes Ragged verify under full CUDA graphs Observability Estimating the ceiling under trimming A preliminary look at dynamic vs.","fixed scheduling Per-request differentiation on mixed traffic Performance optimizations and zero-overhead scheduling (ZOS) Profiling the cost table What's next Appendix: Reproduction DSpark in SGLang: Speculative Decoding with Confidence-Driven, Variable-Length Verification SGLang Team July 6, 2026 Speculative decoding trades extra compute for fewer decode steps, and the trade sours as load grows: at batch size B with K speculative tokens the target verifies B * K tokens every step, and past a point that costs more","DSpark attacks both ends — a semi-autoregressive block drafter (a whole block per draft forward, so acceptance stays high) and a variable per-request verify length driven by the draft model's own confidence, which stops verifying tokens the workload is unlikely to accept."],"case_details":["SGLang 团队将 DSpark 推测解码算法集成到开源推理引擎中。该算法采用半自回归块起草器一次生成一组 token，并利用置信度头与顺序温度缩放（STS）为每个请求动态分配可变验证长度，从而在高负载下裁剪无效验证成本。SGLang 支持密集模型（如 Qwen3）和稀疏模型（如 DeepSeek-V4），通过全 CUDA 图处理不规则的每请求验证长度。提供三种验证模式：`static`（全长）、`compact`（生产路径）和 `cap-accept`（接受上限测量）。还引入了零开销调度、基于离线成本表的在线调度器、融合 Triton 核等优化。在 H200 上使用 DeepSeek-V4-Flash 的测试中，DSpark 在整个并发扫描范围内比 MTP 和非推测基线实现了更优的吞吐量-延迟权衡。"],"workflow_changes":["SGLang now supports DSpark on both dense and sparse models (e."],"before_after_clues":["可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。","可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。","可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。"],"affected_roles":["CIO / IT 负责人","开发者 / 工程团队"],"risks_or_constraints":[]}
missing_information: []
key_excerpts: [{"type":"case_detail","text":"SGLang 团队将 DSpark 推测解码算法集成到开源推理引擎中。该算法采用半自回归块起草器一次生成一组 token，并利用置信度头与顺序温度缩放（STS）为每个请求动态分配可变验证长度，从而在高负载下裁剪无效验证成本。SGLang 支持密集模型（如 Qwen3）和稀疏模型（如 DeepSeek-V4），通过全 CUDA 图处理不规则的每请求验证长度。提供三种验证模式：`static`（全长）、`compact`（生产路径）和 `cap-accept`（接受上限测量）。还引入了零开销调度、基于离线成本表的在线调度器、融合 Triton 核等优化。在 H200 上使用 DeepSeek-V4-Flash 的测试中，DSpark 在整个并发扫描范围内比 MTP 和非推测基线实现了更优的吞吐量-延迟权衡。","supports":["signal_card_candidate","relationship_graph_input","case"],"importance":"high","confidence":"high"},{"type":"company_action","text":"‹ Back to Blog ‹ Back to Blog Contents The speedup over MTP and non-spec Adopting DSpark in SGLang Verify modes Ragged verify under full CUDA graphs Observability Estimating the ceiling under trimming A preliminary look at dynamic vs.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"fixed scheduling Per-request differentiation on mixed traffic Performance optimizations and zero-overhead scheduling (ZOS) Profiling the cost table What's next Appendix: Reproduction DSpark in SGLang: Speculative Decoding with Confidence-Driven, Variable-Length Verification SGLang Team July 6, 2026 Speculative decoding trades extra compute for fewer decode steps, and the trade sours as load grows: at batch size B with K speculative tokens the target verifies B * K tokens every step, and past a point that costs more","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"DSpark attacks both ends — a semi-autoregressive block drafter (a whole block per draft forward, so acceptance stays high) and a variable per-request verify length driven by the draft model's own confidence, which stops verifying tokens the workload is unlikely to accept.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"company_action","text":"The algorithm and its gains are from the DSpark paper.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"},{"type":"workflow_change","text":"SGLang now supports DSpark on both dense and sparse models (e.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"high"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-07T02:46:59.532Z
theme: developer-ecosystem-signal
keyword_group: developer-ecosystem-signal
copyright_note: local research archive only
---

# SGLang 集成 DSpark 推测解码：置信度驱动的可变长度验证

## clean_text

‹ Back to Blog ‹ Back to Blog Contents
The speedup over MTP and non-spec
Adopting DSpark in SGLang
Verify modes
Ragged verify under full CUDA graphs
Observability
Estimating the ceiling under trimming
A preliminary look at dynamic vs. fixed scheduling
Per-request differentiation on mixed traffic
Performance optimizations and zero-overhead scheduling (ZOS)
Profiling the cost table
What's next
Appendix: Reproduction
DSpark in SGLang: Speculative Decoding with Confidence-Driven, Variable-Length Verification
SGLang Team July 6, 2026
Speculative decoding trades extra compute for fewer decode steps, and the trade
sours as load grows: at batch size B with K speculative tokens the target
verifies B * K tokens every step, and past a point that costs more than it saves.
DSpark attacks both ends — a semi-autoregressive block drafter (a whole block per
draft forward, so acceptance stays high) and a variable per-request verify length
driven by the draft model's own confidence, which stops verifying tokens the workload
is unlikely to accept. The algorithm and its gains are from the DSpark paper.
SGLang now supports DSpark on both dense and sparse models (e.g. Qwen3 and
DeepSeek-V4). This post is about the integration. We reproduce the shape of the
paper's gains on an open serving engine — the per-user speedup, and the verify budget
shrinking as load rises — and describe the engineering that turns that schedule
into wall-clock time: full CUDA graphs over a ragged, per-request verify (so a
trimmed batch replays a genuinely smaller graph, not a padded one); an overlap-aware
speculative path that hides the scheduler behind the forward; a cost-table profiler
that lets the scheduler size each request's verify budget online; and observability
for the acceptance ceiling that trimming would otherwise hide. Hardware, engine, and
traffic all differ from the paper, so we reproduce the mechanism and the curve rather
than its numbers to the digit, and every "faster" below is measured against our own
controls — identical except for the speculation config.
The speedup over MTP and non-spec
Figure 1. Aggregate throughput (y) vs. per-user decode speed (x); each curve
sweeps concurrency from batch 1 to 256, one curve per arm. Higher and to the right
is better.
DSpark delivers the best throughput/latency trade-off across the whole
concurrency sweep, clearly ahead of both MTP and the non-spec floor in the Figure 1 example.
All three arms run DeepSeek-V4-Flash on H200 with DP-attention over four ranks,
identical except for the speculation config — a non-speculative floor, MTP (the
EAGLE-style baseline, the per-batch-size best of the 1-1-2 and 3-1-4 configs), and
DSpark.
Adopting DSpark in SGLang
The DSpark algorithm, adopted from the paper, lives in three draft-side pieces:
Block drafter — a dense line (e.g. Qwen3) and a sparse line (e.g. DeepSeek-V4);
one forward emits a gamma -token block, with a lightweight sequential head (Markov
or RNN) conditioning each step on the previous token, so the block is
semi-autoregressive.
Confidence head — scores each drafted token's chance of surviving verification;
the product across the block is the block's survival probability.
Sequential Temperature Scaling (STS) — calibrates those scores so survival
reflects the true acceptance rate the scheduler budgets against.
Around that, SGLang adds the serving support surface:
Confidence scheduler — converts per-block survival into a per-request verify budget each step.
Per-request ragged verify — a variable verify length per request within one batch ( static / compact / cap-accept ).
Full CUDA graph — captured over the ragged, variable-length verify.
Observability — acceptance ceiling under trimming and other metrics.
Additive SPS cost table — an offline-profiled step-time model, read online by the scheduler.
Data-parallel attention — supported alongside the other parallelism dimensions.
Zero-overhead scheduling — integrated into SGLang's overlap scheduler with almost no DSpark-specific special-casing.
Performance optimizations — fused Triton kernels and a sharded block-drafter matmul.
Verify modes
The three verify modes are the axis the rest of this post turns on. static
verifies the full drafted block every step (the baseline). compact verifies only
the per-request window the scheduler picked — the production path. cap-accept
verifies the full block but commits only up to that window: same output as
compact , while exposing what a full verify would have accepted — how we measure
the ceiling under trimming.
Ragged verify under full CUDA graphs
Per-request windows don't fit a fixed-shape CUDA graph: a batch where one request
verifies two tokens and another six has no single query length, and padding everyone
up to the full block width just pads the trim back in. So we keep the batch ragged and key the
graph on the total token count — front-pack the variable-length requests into one
compact buffer and round up to the nearest captured tier. When budgets trim, the
packed total drops to a smaller tier and DSpark replays a genuinely cheaper graph
(fewer attention and MLP rows, not a masked full-width forward); under DP attention
the ranks share one tier (the largest any rank needs) and step down together.
The packed buffer is a cu_seqlens -style varlen input, so the compact verify reuses
attention kernels the backend already has — on DeepSeek-V4 the model's own sparse-MLA
path ( flash_mla ), with no new kernel; each supported backend just rebuilds its
varlen metadata from the packed layout on graph replay.
Figure 2. Fitting a batch with per-request-variable verify lengths into a captured
CUDA graph. A fixed-shape graph pads every request to the full block width (N x W);
the ragged path front-packs the scheduled tokens and rounds only the total up to the
nearest captured tier, computing far fewer padded cells for the same accepted tokens.
Observability
Trimming censors the ceiling: compact mode only verifies a block's first few
positions — the scheduler's window — so how many tokens a full-block verify would have accepted at
that step is never observed — and without it you cannot tell a good trim from a lossy
one. A cap-accept run recovers it: it verifies the full block but commits only up to
the window, so it commits exactly what compact commits while exposing the ceiling.
We also surface per-request confidence and calibration metrics (e.g. ECE) for
post-hoc analysis.
Estimating the ceiling under trimming
A block-accept estimator, designed for production runs or other scenarios where an
extra companion run is unwanted, recovers the estimated censored ceiling directly
inside a compact run. It is implemented with the utilization of the target tokens
in the future steps with its logprobs, and computes estimation intervals for the
counterfactual tail, assuming property similarity of anchor tokens in the trimmed
versus untrimmed trajectory.
A preliminary look at dynamic vs. fixed scheduling
The confidence scheduler is a first, vanilla version, and we treat it that way — a
proof that the mechanism works end to end, not a highly tuned result.
We compare compact (the per-step
SPS-argmax budget) against no-trim — the static full-block schedule run through
the same ragged path — on two example workloads that differ in acceptance.
Figure 3. compact (dynamic trim) vs. no-trim (full block), batch 1 to
256 at DP4, on two examples that differ in acceptance. Higher and to the right is better.
The dynamic budget's win is primarily a high-batch effect. At batch size 1 the target verify does
not slow down much with more tokens, so trimming saves little and the two arms tie. As
concurrency grows and throughput starts to plateau, trimming shortens the step
and compact pulls ahead. The gap is larger, and
opens earlier, on the lower-accept example — lower acceptance leaves more tail to
trim, exactly as the cost model predicts.
Each panel is a clean compact -vs- no-trim A/B (identical setup within a panel),
but the two examples are not a strict single-variable pair: beyond acceptance they
also differ slightly in setup (prompt formatting and per-arm round count), so we
read the trend across them, not absolute cross-panel numbers.
These budgets are also only as good as the cost tables behind them. Our current SPS
(and calibration) fit is a first approximation, and it may not yet fully account for
how step cost varies with context length — so the exact operating point the
scheduler lands on is likely improvable, and we present the mechanism here rather
than a tuned number.
Per-request differentiation on mixed traffic
Homogeneous sweeps hide the real point of confidence scheduling. Two requests in
the same batch should not get the same verify window if one is far more
predictable than the other. Mixed traffic is where that matters.
Figure 4. Budget by workload (left) and per-step verify-length distribution
(right).
As an example, we mix three workloads by acceptance difficulty: gsm8k (high), arena-hard (mid),
and poetry (low). The window contracts with difficulty — 5.24, 3.78, 2.91
tokens — while utilization against the ceiling (what the block would accept
untrimmed) stays high (0.88–0.97). The scheduler is sizing each request, not applying one batch average. The
right panel shows it step by step: about 55% of gsm8k steps fill the full window of
six, while about 80% of poetry steps use three or fewer.
Performance optimizations and zero-overhead scheduling (ZOS)
Two kinds of engineering turn the schedule into wall-clock time: cutting the cost of
each step, and hiding the scheduler behind the forward. Together they reach 383.7
tok/s at accept length ~5 at batch size 1 on DeepSeek-V4-Pro, TP=8, B300.
We rewrote the clusters of tiny ops as fused Triton kernels, such as the compact scatter,
the SWA page-index, the verify-length top-k schedule, and the ragged-window packing.
The block drafter's sampling path folds into fused kernels, and its matrix multiplication is sharded.
In one example profile, things outside the target verify shrinks by 1.7 ms, against a 7.3 ms verify.
DSpark drops straight into SGLang's zero-overhead (overlap) scheduler with almost no
special-casing, adding the paper's two-step-back confidence relay. Little of this is
DSpark-specific plumbing. SGLang's spec-v2 runtime already overlaps the next step's
scheduling with the current forward on separate streams, and DSpark joins as a
first-class worker: forward outputs come back as async futures, cross-iteration
ordering rides the runtime's device-side barrier, and on-device page tables mean no
per-step host sync. The confidence relay uses the same channel, read two steps back.
The decode loop then runs with no per-step bubble — about 1.5x tighter than with the
scheduler off.
Figure 5. Decode at batch size 1, overlap scheduler off (top) vs. on (bottom). With it on, there is no bubble between run_batch iterations or between the block-draft-generate and target-verify phases inside a step.
Profiling the cost table
Figure 6. Additive cost model — raw vs. fit (a) and throughput (b) — and
predicted vs. measured step time (c).
We express the scheduler's estimate of step time T(bs, K) — K the batch's extra
verify tokens — with an additive model:
T(bs, K) = bias + alpha(bs) + theta(M), M = bs + K ,
where alpha(bs) is the request-scaling floor (draft pass plus part of attention),
unmoved by trimming; theta(M) is the target's verify-token cost, the only term
trimming recovers. The scheduler's argmax trades expected accepted tokens against real marginal cost, so trim
headroom shows up only where theta is large. Figure 6(c) validates the model's
predictions against a live server.
What's next
DSpark is in SGLang today. What's next:
Cost model and scheduling — a stronger, increasingly online/adaptive cost
model and further improvements to the dynamic scheduler.
Model coverage — more dense and sparse models.
Parallelism — broader coverage across parallelism modes and serving topologies.
Observability — productionizing metrics like the block-accept estimator and confidence
calibration across checkpoints.
Robustness — hardening the full-CUDA-graph path and broader stress / regression
testing.
Thanks to the DSpark authors and to DeepSeek for the algorithm and the models.
Appendix: Reproduction
Figures 1, 3, and 6 — the frontier server (DeepSeek-V4-Flash, H200, DP4). Launch
the DSpark arm:
SGLANG_ENABLE_METRICS_DEVICE_TIMER=1 \
python3 -m sglang.launch_server \
--model-path deepseek-ai/DeepSeek-V4-Flash-DSpark \
--speculative-algorithm DSPARK \
--tp 4 --dp-size 4 --enable-dp-attention --enable-dp-lm-head \
--moe-a2a-backend none --moe-runner-backend flashinfer_mxfp4 --disable-flashinfer-autotune \
--swa-full-tokens-ratio 0.1 --chunked-prefill-size 1024 \
--mem-fraction-static 0.8 --cuda-graph-max-bs 192 --max-running-requests 1024 \
--disable-radix-cache --trust-remote-code --host 0.0.0.0 --port 30000
where the --disable-radix-cache is to avoid bench scripts hitting the cache.
The other arms change only the speculation config: non-spec drops --speculative-*
and loads --model-path deepseek-ai/DeepSeek-V4-Flash ; MTP uses that same target
with --speculative-algorithm EAGLE --speculative-num-steps {1,3} --speculative-eagle-topk 1 --speculative-num-draft-tokens {2,4} (per-batch-size best of the two); DSpark compact or static
sets SGLANG_RAGGED_VERIFY_MODE=compact|static ;
use --speculative-dspark-sps-table-path sps_table.json when executing compact mode with SPS table;
and Figure 3's no-trim arm is
SGLANG_RAGGED_VERIFY_MODE=compact with no SPS table (the ragged path at the full
window). Drive any arm with a fixed prompt swept across batch sizes:
python3 -m sglang.benchmark.one_batch_server \
--model None --base-url http://127.0.0.1:30000 \
--batch-size 1 8 16 32 64 96 128 160 192 256 --output-len 1024 --temperature 0.7 \
--fixed-prompt-file frontier_prompt.txt --fixed-prompt-apply-chat-template --show-report
The fixed prompt is here
( frontier_prompt.txt ), 16 concatenated GSM8K questions to allow the generation be real content.
Users may test on their own data given speculative decoding has different accept lengths for different datasets.
Figure 6's cost table comes from a profiling run: launch compact with
SGLANG_DSPARK_ENABLE_SPS_RECORD=1 SGLANG_SIMULATE_ACC_LEN=1.0 , then fit the additive
model with python3 -m sglang.benchmark.dspark_sps_profiler all (sweeping a batch ×
verify-fraction grid at input-len 512).
Figure 4 — mixed traffic. The same server as Figure 1, at --mem-fraction-static 0.7
with block size six; run all three modes ( static / compact / cap-accept ) via
SGLANG_RAGGED_VERIFY_MODE , and drive a mixed gsm8k + arena-hard + poetry request set,
measured as non-streaming makespan throughput.
Figure 5 — zero-overhead (DeepSeek-V4-Pro, B300, TP8).
SGLANG_RAGGED_VERIFY_MODE=compact SGLANG_DSV4_FP4_EXPERTS=1 SGLANG_TORCH_PROFILER_DIR=./trace \
python3 -m sglang.launch_server \
--model-path deepseek-ai/DeepSeek-V4-Pro-DSpark --speculative-algorithm DSPARK \
--tp 8 --moe-runner-backend flashinfer_mxfp4 --disable-flashinfer-autotune \
--mem-fraction-static 0.82 --chunked-prefill-size 4096 --cuda-graph-max-bs 4 \
--trust-remote-code --host 127.0.0.1 --port 30000
# overlap off: append --disable-overlap-schedule
Capture a batch-1 decode trace, then read the GPU-only lane:
python3 -m sglang.benchmark.one_batch_server \
--model None --base-url http://127.0.0.1:30000 \
--batch-size 1 --input-len 256 --output-len 256 \
--profile --profile-activities GPU --profile-steps 20

## full_text

‹ Back to Blog ‹ Back to Blog Contents
The speedup over MTP and non-spec
Adopting DSpark in SGLang
Verify modes
Ragged verify under full CUDA graphs
Observability
Estimating the ceiling under trimming
A preliminary look at dynamic vs. fixed scheduling
Per-request differentiation on mixed traffic
Performance optimizations and zero-overhead scheduling (ZOS)
Profiling the cost table
What's next
Appendix: Reproduction
DSpark in SGLang: Speculative Decoding with Confidence-Driven, Variable-Length Verification
SGLang Team July 6, 2026
Speculative decoding trades extra compute for fewer decode steps, and the trade
sours as load grows: at batch size B with K speculative tokens the target
verifies B * K tokens every step, and past a point that costs more than it saves.
DSpark attacks both ends — a semi-autoregressive block drafter (a whole block per
draft forward, so acceptance stays high) and a variable per-request verify length
driven by the draft model's own confidence, which stops verifying tokens the workload
is unlikely to accept. The algorithm and its gains are from the DSpark paper.
SGLang now supports DSpark on both dense and sparse models (e.g. Qwen3 and
DeepSeek-V4). This post is about the integration. We reproduce the shape of the
paper's gains on an open serving engine — the per-user speedup, and the verify budget
shrinking as load rises — and describe the engineering that turns that schedule
into wall-clock time: full CUDA graphs over a ragged, per-request verify (so a
trimmed batch replays a genuinely smaller graph, not a padded one); an overlap-aware
speculative path that hides the scheduler behind the forward; a cost-table profiler
that lets the scheduler size each request's verify budget online; and observability
for the acceptance ceiling that trimming would otherwise hide. Hardware, engine, and
traffic all differ from the paper, so we reproduce the mechanism and the curve rather
than its numbers to the digit, and every "faster" below is measured against our own
controls — identical except for the speculation config.
The speedup over MTP and non-spec
Figure 1. Aggregate throughput (y) vs. per-user decode speed (x); each curve
sweeps concurrency from batch 1 to 256, one curve per arm. Higher and to the right
is better.
DSpark delivers the best throughput/latency trade-off across the whole
concurrency sweep, clearly ahead of both MTP and the non-spec floor in the Figure 1 example.
All three arms run DeepSeek-V4-Flash on H200 with DP-attention over four ranks,
identical except for the speculation config — a non-speculative floor, MTP (the
EAGLE-style baseline, the per-batch-size best of the 1-1-2 and 3-1-4 configs), and
DSpark.
Adopting DSpark in SGLang
The DSpark algorithm, adopted from the paper, lives in three draft-side pieces:
Block drafter — a dense line (e.g. Qwen3) and a sparse line (e.g. DeepSeek-V4);
one forward emits a gamma -token block, with a lightweight sequential head (Markov
or RNN) conditioning each step on the previous token, so the block is
semi-autoregressive.
Confidence head — scores each drafted token's chance of surviving verification;
the product across the block is the block's survival probability.
Sequential Temperature Scaling (STS) — calibrates those scores so survival
reflects the true acceptance rate the scheduler budgets against.
Around that, SGLang adds the serving support surface:
Confidence scheduler — converts per-block survival into a per-request verify budget each step.
Per-request ragged verify — a variable verify length per request within one batch ( static / compact / cap-accept ).
Full CUDA graph — captured over the ragged, variable-length verify.
Observability — acceptance ceiling under trimming and other metrics.
Additive SPS cost table — an offline-profiled step-time model, read online by the scheduler.
Data-parallel attention — supported alongside the other parallelism dimensions.
Zero-overhead scheduling — integrated into SGLang's overlap scheduler with almost no DSpark-specific special-casing.
Performance optimizations — fused Triton kernels and a sharded block-drafter matmul.
Verify modes
The three verify modes are the axis the rest of this post turns on. static
verifies the full drafted block every step (the baseline). compact verifies only
the per-request window the scheduler picked — the production path. cap-accept
verifies the full block but commits only up to that window: same output as
compact , while exposing what a full verify would have accepted — how we measure
the ceiling under trimming.
Ragged verify under full CUDA graphs
Per-request windows don't fit a fixed-shape CUDA graph: a batch where one request
verifies two tokens and another six has no single query length, and padding everyone
up to the full block width just pads the trim back in. So we keep the batch ragged and key the
graph on the total token count — front-pack the variable-length requests into one
compact buffer and round up to the nearest captured tier. When budgets trim, the
packed total drops to a smaller tier and DSpark replays a genuinely cheaper graph
(fewer attention and MLP rows, not a masked full-width forward); under DP attention
the ranks share one tier (the largest any rank needs) and step down together.
The packed buffer is a cu_seqlens -style varlen input, so the compact verify reuses
attention kernels the backend already has — on DeepSeek-V4 the model's own sparse-MLA
path ( flash_mla ), with no new kernel; each supported backend just rebuilds its
varlen metadata from the packed layout on graph replay.
Figure 2. Fitting a batch with per-request-variable verify lengths into a captured
CUDA graph. A fixed-shape graph pads every request to the full block width (N x W);
the ragged path front-packs the scheduled tokens and rounds only the total up to the
nearest captured tier, computing far fewer padded cells for the same accepted tokens.
Observability
Trimming censors the ceiling: compact mode only verifies a block's first few
positions — the scheduler's window — so how many tokens a full-block verify would have accepted at
that step is never observed — and without it you cannot tell a good trim from a lossy
one. A cap-accept run recovers it: it verifies the full block but commits only up to
the window, so it commits exactly what compact commits while exposing the ceiling.
We also surface per-request confidence and calibration metrics (e.g. ECE) for
post-hoc analysis.
Estimating the ceiling under trimming
A block-accept estimator, designed for production runs or other scenarios where an
extra companion run is unwanted, recovers the estimated censored ceiling directly
inside a compact run. It is implemented with the utilization of the target tokens
in the future steps with its logprobs, and computes estimation intervals for the
counterfactual tail, assuming property similarity of anchor tokens in the trimmed
versus untrimmed trajectory.
A preliminary look at dynamic vs. fixed scheduling
The confidence scheduler is a first, vanilla version, and we treat it that way — a
proof that the mechanism works end to end, not a highly tuned result.
We compare compact (the per-step
SPS-argmax budget) against no-trim — the static full-block schedule run through
the same ragged path — on two example workloads that differ in acceptance.
Figure 3. compact (dynamic trim) vs. no-trim (full block), batch 1 to
256 at DP4, on two examples that differ in acceptance. Higher and to the right is better.
The dynamic budget's win is primarily a high-batch effect. At batch size 1 the target verify does
not slow down much with more tokens, so trimming saves little and the two arms tie. As
concurrency grows and throughput starts to plateau, trimming shortens the step
and compact pulls ahead. The gap is larger, and
opens earlier, on the lower-accept example — lower acceptance leaves more tail to
trim, exactly as the cost model predicts.
Each panel is a clean compact -vs- no-trim A/B (identical setup within a panel),
but the two examples are not a strict single-variable pair: beyond acceptance they
also differ slightly in setup (prompt formatting and per-arm round count), so we
read the trend across them, not absolute cross-panel numbers.
These budgets are also only as good as the cost tables behind them. Our current SPS
(and calibration) fit is a first approximation, and it may not yet fully account for
how step cost varies with context length — so the exact operating point the
scheduler lands on is likely improvable, and we present the mechanism here rather
than a tuned number.
Per-request differentiation on mixed traffic
Homogeneous sweeps hide the real point of confidence scheduling. Two requests in
the same batch should not get the same verify window if one is far more
predictable than the other. Mixed traffic is where that matters.
Figure 4. Budget by workload (left) and per-step verify-length distribution
(right).
As an example, we mix three workloads by acceptance difficulty: gsm8k (high), arena-hard (mid),
and poetry (low). The window contracts with difficulty — 5.24, 3.78, 2.91
tokens — while utilization against the ceiling (what the block would accept
untrimmed) stays high (0.88–0.97). The scheduler is sizing each request, not applying one batch average. The
right panel shows it step by step: about 55% of gsm8k steps fill the full window of
six, while about 80% of poetry steps use three or fewer.
Performance optimizations and zero-overhead scheduling (ZOS)
Two kinds of engineering turn the schedule into wall-clock time: cutting the cost of
each step, and hiding the scheduler behind the forward. Together they reach 383.7
tok/s at accept length ~5 at batch size 1 on DeepSeek-V4-Pro, TP=8, B300.
We rewrote the clusters of tiny ops as fused Triton kernels, such as the compact scatter,
the SWA page-index, the verify-length top-k schedule, and the ragged-window packing.
The block drafter's sampling path folds into fused kernels, and its matrix multiplication is sharded.
In one example profile, things outside the target verify shrinks by 1.7 ms, against a 7.3 ms verify.
DSpark drops straight into SGLang's zero-overhead (overlap) scheduler with almost no
special-casing, adding the paper's two-step-back confidence relay. Little of this is
DSpark-specific plumbing. SGLang's spec-v2 runtime already overlaps the next step's
scheduling with the current forward on separate streams, and DSpark joins as a
first-class worker: forward outputs come back as async futures, cross-iteration
ordering rides the runtime's device-side barrier, and on-device page tables mean no
per-step host sync. The confidence relay uses the same channel, read two steps back.
The decode loop then runs with no per-step bubble — about 1.5x tighter than with the
scheduler off.
Figure 5. Decode at batch size 1, overlap scheduler off (top) vs. on (bottom). With it on, there is no bubble between run_batch iterations or between the block-draft-generate and target-verify phases inside a step.
Profiling the cost table
Figure 6. Additive cost model — raw vs. fit (a) and throughput (b) — and
predicted vs. measured step time (c).
We express the scheduler's estimate of step time T(bs, K) — K the batch's extra
verify tokens — with an additive model:
T(bs, K) = bias + alpha(bs) + theta(M), M = bs + K ,
where alpha(bs) is the request-scaling floor (draft pass plus part of attention),
unmoved by trimming; theta(M) is the target's verify-token cost, the only term
trimming recovers. The scheduler's argmax trades expected accepted tokens against real marginal cost, so trim
headroom shows up only where theta is large. Figure 6(c) validates the model's
predictions against a live server.
What's next
DSpark is in SGLang today. What's next:
Cost model and scheduling — a stronger, increasingly online/adaptive cost
model and further improvements to the dynamic scheduler.
Model coverage — more dense and sparse models.
Parallelism — broader coverage across parallelism modes and serving topologies.
Observability — productionizing metrics like the block-accept estimator and confidence
calibration across checkpoints.
Robustness — hardening the full-CUDA-graph path and broader stress / regression
testing.
Thanks to the DSpark authors and to DeepSeek for the algorithm and the models.
Appendix: Reproduction
Figures 1, 3, and 6 — the frontier server (DeepSeek-V4-Flash, H200, DP4). Launch
the DSpark arm:
SGLANG_ENABLE_METRICS_DEVICE_TIMER=1 \
python3 -m sglang.launch_server \
--model-path deepseek-ai/DeepSeek-V4-Flash-DSpark \
--speculative-algorithm DSPARK \
--tp 4 --dp-size 4 --enable-dp-attention --enable-dp-lm-head \
--moe-a2a-backend none --moe-runner-backend flashinfer_mxfp4 --disable-flashinfer-autotune \
--swa-full-tokens-ratio 0.1 --chunked-prefill-size 1024 \
--mem-fraction-static 0.8 --cuda-graph-max-bs 192 --max-running-requests 1024 \
--disable-radix-cache --trust-remote-code --host 0.0.0.0 --port 30000
where the --disable-radix-cache is to avoid bench scripts hitting the cache.
The other arms change only the speculation config: non-spec drops --speculative-*
and loads --model-path deepseek-ai/DeepSeek-V4-Flash ; MTP uses that same target
with --speculative-algorithm EAGLE --speculative-num-steps {1,3} --speculative-eagle-topk 1 --speculative-num-draft-tokens {2,4} (per-batch-size best of the two); DSpark compact or static
sets SGLANG_RAGGED_VERIFY_MODE=compact|static ;
use --speculative-dspark-sps-table-path sps_table.json when executing compact mode with SPS table;
and Figure 3's no-trim arm is
SGLANG_RAGGED_VERIFY_MODE=compact with no SPS table (the ragged path at the full
window). Drive any arm with a fixed prompt swept across batch sizes:
python3 -m sglang.benchmark.one_batch_server \
--model None --base-url http://127.0.0.1:30000 \
--batch-size 1 8 16 32 64 96 128 160 192 256 --output-len 1024 --temperature 0.7 \
--fixed-prompt-file frontier_prompt.txt --fixed-prompt-apply-chat-template --show-report
The fixed prompt is here
( frontier_prompt.txt ), 16 concatenated GSM8K questions to allow the generation be real content.
Users may test on their own data given speculative decoding has different accept lengths for different datasets.
Figure 6's cost table comes from a profiling run: launch compact with
SGLANG_DSPARK_ENABLE_SPS_RECORD=1 SGLANG_SIMULATE_ACC_LEN=1.0 , then fit the additive
model with python3 -m sglang.benchmark.dspark_sps_profiler all (sweeping a batch ×
verify-fraction grid at input-len 512).
Figure 4 — mixed traffic. The same server as Figure 1, at --mem-fraction-static 0.7
with block size six; run all three modes ( static / compact / cap-accept ) via
SGLANG_RAGGED_VERIFY_MODE , and drive a mixed gsm8k + arena-hard + poetry request set,
measured as non-streaming makespan throughput.
Figure 5 — zero-overhead (DeepSeek-V4-Pro, B300, TP8).
SGLANG_RAGGED_VERIFY_MODE=compact SGLANG_DSV4_FP4_EXPERTS=1 SGLANG_TORCH_PROFILER_DIR=./trace \
python3 -m sglang.launch_server \
--model-path deepseek-ai/DeepSeek-V4-Pro-DSpark --speculative-algorithm DSPARK \
--tp 8 --moe-runner-backend flashinfer_mxfp4 --disable-flashinfer-autotune \
--mem-fraction-static 0.82 --chunked-prefill-size 4096 --cuda-graph-max-bs 4 \
--trust-remote-code --host 127.0.0.1 --port 30000
# overlap off: append --disable-overlap-schedule
Capture a batch-1 decode trace, then read the GPU-only lane:
python3 -m sglang.benchmark.one_batch_server \
--model None --base-url http://127.0.0.1:30000 \
--batch-size 1 --input-len 256 --output-len 256 \
--profile --profile-activities GPU --profile-steps 20

## extraction_diagnostics

- extraction_method: main
- readability_score: 97
- fetch_status: fetched-readable-text-main
- extraction_quality: high
- diagnostics: {"readability_score":97,"text_length":15520,"paragraph_count":213,"sentence_count":105,"boilerplate_hits":0,"symbol_ratio":0.004,"replacement_count":0,"replacement_ratio":0,"control_count":0,"control_ratio":0,"binary_marker_count":0,"mojibake_marker_count":0,"binary_contaminated":false,"mojibake_contaminated":false,"method":"main"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **case_detail**｜supports=signal_card_candidate, relationship_graph_input, case｜importance=high｜confidence=high
   SGLang 团队将 DSpark 推测解码算法集成到开源推理引擎中。该算法采用半自回归块起草器一次生成一组 token，并利用置信度头与顺序温度缩放（STS）为每个请求动态分配可变验证长度，从而在高负载下裁剪无效验证成本。SGLang 支持密集模型（如 Qwen3）和稀疏模型（如 DeepSeek-V4），通过全 CUDA 图处理不规则的每请求验证长度。提供三种验证模式：`static`（全长）、`compact`（生产路径）和 `cap-accept`（接受上限测量）。还引入了零开销调度、基于离线成本表的在线调度器、融合 Triton 核等优化。在 H200 上使用 DeepSeek-V4-Flash 的测试中，DSpark 在整个并发扫描范围内比 MTP 和非推测基线实现了更优的吞吐量-延迟权衡。

2. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   ‹ Back to Blog ‹ Back to Blog Contents The speedup over MTP and non-spec Adopting DSpark in SGLang Verify modes Ragged verify under full CUDA graphs Observability Estimating the ceiling under trimming A preliminary look at dynamic vs.

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   fixed scheduling Per-request differentiation on mixed traffic Performance optimizations and zero-overhead scheduling (ZOS) Profiling the cost table What's next Appendix: Reproduction DSpark in SGLang: Speculative Decoding with Confidence-Driven, Variable-Length Verification SGLang Team July 6, 2026 Speculative decoding trades extra compute for fewer decode steps, and the trade sours as load grows: at batch size B with K speculative tokens the target verifies B * K tokens every step, and past a point that costs more

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   DSpark attacks both ends — a semi-autoregressive block drafter (a whole block per draft forward, so acceptance stays high) and a variable per-request verify length driven by the draft model's own confidence, which stops verifying tokens the workload is unlikely to accept.

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   The algorithm and its gains are from the DSpark paper.

6. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=high
   SGLang now supports DSpark on both dense and sparse models (e.

## business_elements

- companies: LMSYS, Blog（Chatbot Arena 团队）
- products: 暂无公开信息
- people: 暂无公开信息
- industries: 开发者工具
- roles: CIO / IT 负责人, 开发者 / 工程团队
- workflows: 合同审阅 / 法律研究, 计费 / 预算管理, 部署 / 集成交付
- business_actions: 发布 / 推出
- affected_departments: IT / 安全, 财务 / 预算, 销售 / 客服
- numbers: 3, 4, 200, 6, 2026, 1, 256, 2
- quotes: 暂无公开信息

## evidence_seed

- company_actions: ‹ Back to Blog ‹ Back to Blog Contents The speedup over MTP and non-spec Adopting DSpark in SGLang Verify modes Ragged verify under full CUDA graphs Observability Estimating the ceiling under trimming A preliminary look at dynamic vs. / fixed scheduling Per-request differentiation on mixed traffic Performance optimizations and zero-overhead scheduling (ZOS) Profiling the cost table What's next Appendix: Reproduction DSpark in SGLang: Speculative Decoding with Confidence-Driven, Variable-Length Verification SGLang Team July 6, 2026 Speculative decoding trades extra compute for fewer decode steps, and the trade sours as load grows: at batch size B with K speculative tokens the target verifies B * K tokens every step, and past a point that costs more / DSpark attacks both ends — a semi-autoregressive block drafter (a whole block per draft forward, so acceptance stays high) and a variable per-request verify length driven by the draft model's own confidence, which stops verifying tokens the workload is unlikely to accept.
- case_details: SGLang 团队将 DSpark 推测解码算法集成到开源推理引擎中。该算法采用半自回归块起草器一次生成一组 token，并利用置信度头与顺序温度缩放（STS）为每个请求动态分配可变验证长度，从而在高负载下裁剪无效验证成本。SGLang 支持密集模型（如 Qwen3）和稀疏模型（如 DeepSeek-V4），通过全 CUDA 图处理不规则的每请求验证长度。提供三种验证模式：`static`（全长）、`compact`（生产路径）和 `cap-accept`（接受上限测量）。还引入了零开销调度、基于离线成本表的在线调度器、融合 Triton 核等优化。在 H200 上使用 DeepSeek-V4-Flash 的测试中，DSpark 在整个并发扫描范围内比 MTP 和非推测基线实现了更优的吞吐量-延迟权衡。
- workflow_changes: SGLang now supports DSpark on both dense and sparse models (e.
- before_after_clues: 可能涉及 合同审阅 / 法律研究 的前后变化，需要二搜补足变化前流程。 / 可能涉及 计费 / 预算管理 的前后变化，需要二搜补足变化前流程。 / 可能涉及 部署 / 集成交付 的前后变化，需要二搜补足变化前流程。
- affected_roles: CIO / IT 负责人, 开发者 / 工程团队
- risks_or_constraints: 暂无公开信息

## guanlan_scores

- importance_type: supporting_signal
- importance_score: 2
- importance_reason: consumer entertainment or minor platform policy feature; AI-adjacent but not a core business signal
- supporting_signals: low_value_ai_adjacent_context
- novelty: 3
- evidence_strength: 4
- case_richness: 5
- trend_relevance: 2
- guanlan_relevance: 2
- emerging_signal_score: 4

## usable_for

- viewpoint: false
- case: true
- business_change: true
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: true
- user_feedback_pool: false
- watchlist: true

## pool_routes

- emerging_pool
- watchlist

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
- discovery_record: {"discovery_title":"SGLang 集成 DSpark 推测解码：置信度驱动的可变长度验证","discovery_summary":"SGLang 团队将 DSpark 推测解码算法集成到开源推理引擎中。该算法采用半自回归块起草器一次生成一组 token，并利用置信度头与顺序温度缩放（STS）为每个请求动态分配可变验证长度，从而在高负载下裁剪无效验证成本。SGLang 支持密集模型（如 Qwen3）和稀疏模型（如 DeepSeek-V4），通过全 CUDA 图处理不规则的每请求验证长度。提供三种验证模式：`static`（全长）、`compact`（生产路径）和 `cap-accept`（接受上限测量）。还引入了零开销调度、基于离线成本表的在线调度器、融合 Triton 核等优化。在 H200 上使用 DeepSeek-V4-Flash 的测试中，DSpark 在整个并发扫描范围内比 MTP 和非推测基线实现了更优的吞吐量-延迟权衡。","source_name":"LMSYS：Blog（Chatbot Arena 团队）","origin_url":"https://www.lmsys.org/blog/2026-07-06-dspark-sglang","discovered_at":"2026-07-07T02:33:49.176Z","rank_on_page":140,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

SGLang 团队将 DSpark 推测解码算法集成到开源推理引擎中。该算法采用半自回归块起草器一次生成一组 token，并利用置信度头与顺序温度缩放（STS）为每个请求动态分配可变验证长度，从而在高负载下裁剪无效验证成本。SGLang 支持密集模型（如 Qwen3）和稀疏模型（如 DeepSeek-V4），通过全 CUDA 图处理不规则的每请求验证长度。提供三种验证模式：`static`（全长）、`compact`（生产路径）和 `cap-accept`（接受上限测量）。还引入了零开销调度、基于离线成本表的在线调度器、融合 Triton 核等优化。在 H200 上使用 DeepSeek-V4-Flash 的测试中，DSpark 在整个并发扫描范围内比 MTP 和非推测基线实现了更优的吞吐量-延迟权衡。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
