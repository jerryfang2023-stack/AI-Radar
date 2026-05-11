---
title: 2026-05-11 V2 Daily Content Rerun Log
date: 2026-05-11
task_id: v2-content-site-daily-update
status: completed-with-fallback
owner: workflow / automation (codex)
encoding: UTF-8
---

# 2026-05-11 Updated Daily Monitoring Rerun Log

- generated_at: 2026-05-11T09:30:00+08:00
- previous_source_router_raw_count: 0
- final_raw_count: 100
- final_pool_count: 22
- final_structured_count: 8
- front_signal_count: 3
- point_calibration_count: 4
- deep_dive: not-generated (insufficient evidence)
- source_distribution: aihot=35; keyword-search=40; follow-builders=25 (GDELT 部分 429/失败)
- raw_count_by_channel: keyword-search=40; aihot=35; follow-builders=25
- raw_count_by_source_type: community=42; developer=19; industry=18; official=15; web=4; media=1; research=1
- failed_sources: GDELT AI agent enterprise: fetch failed; GDELT agentic AI governance: fetch failed; GDELT AI startup funding: 429 Too Many Requests; GDELT AI coding agent: 429 Too Many Requests
- fallback_used: GDELT 降级（429/失败）；其余三路（AI HOT / keyword-search / follow-builders）正常产出；Front 信号仍只计入解析后的 S/A/B 原始来源，不用聚合/搜索页作为事实证据
- evidence_gaps: AI HOT / follow-builders / keyword-search 仍需逐条回看原始 URL 并重新判级；Front/Deep Dive 所需“客户、定价、部署与运行时止损”证据仍存在缺口
- front_signal_sab_source_count: FS-20260511-01 >=3; FS-20260511-02 >=3; FS-20260511-03 >=3

## Source Distribution

- source-router lanes: keyword-search=40; aihot=35; follow-builders=25
- source levels (resolved): S=15; A=2; B=41; C=42
- source types: community=42; developer=19; industry=18; official=15; web=4; media=1; research=1

## Failed Sources

- GDELT：部分查询 `fetch failed` / `429 Too Many Requests`（见 `agent-workflow/reports/2026-05-11-v2-daily-source-router-log.md`）。

## Fallback Used

- Raw：使用 source-router 正常产出 100 条候选；不把 AI HOT / follow-builders / search 通道本身当事实证据。
- Structured / Front：只挑选能明确给出 S/A/B 原始来源的主题入库，不为数量降低证据门槛。
- GDELT：按 429/失败降级，不以单一新闻源硬补数量。

## Evidence Gaps

- 控制平面/治理方向：缺“运行时拦截/回滚/回放”的可复核案例与跨平台互操作证据。
- CX/语音平台化：缺公开定价锚点、交付经济性与 KPI 改善数据。
- MCP 安全：缺真实事故复盘与量化风险数据；发布稿不等同于有效防护。

## Front Signal SAB Source Count

- FS-20260511-01：>= 3（S/S/S + 1 个 B 对照）
- FS-20260511-02：>= 3（S + B + B）
- FS-20260511-03：>= 3（S + S + S + 1 个 B 对照）


<!-- touched: 2026-05-11T09:41:13.7057259+08:00 -->

