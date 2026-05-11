---
date: 2026-05-08
stage: legacy-heat-evidence-refinement
status: refined
source_scope: V1 Scoring
encoding: UTF-8
---

# Legacy HeatEvidence Refined Publish Package

## publish_ready

| heat_evidence_id | source_type | source_id | title | evidence_role | confidence_score | heat_direction | related_assets | boundary |
|---|---|---|---|---|---:|---|---|---|
| `HE-LEGACY-20260508-01` | signal | `LS-20260508-01` | 客服 Agent 从省坐席转向客户前台运营 | fact | 72 | up | `LEGACY-OPP-20260508-01`, `LT-20260508-01` | 仍需投诉率和转化数据 |
| `HE-LEGACY-20260508-02` | signal | `LS-20260508-02` | Agent 治理信号连续出现 | fact | 75 | up | `LEGACY-OPP-20260508-03`, `LT-20260508-02` | 预算归属不清 |
| `HE-LEGACY-20260508-03` | point | `LPT-20260508-01` | 默认执行让权限和审计成为产品问题 | calibration | 68 | mixed | `LEGACY-OPP-20260508-03` | Point 只作校准，不作事实主证据 |
| `HE-LEGACY-20260508-04` | trend | `LT-20260508-03` | 专业服务 AI 进入交付流程 | trend | 64 | up | `LEGACY-OPP-20260508-02` | 专业责任和错误率待补 |

## hold

V1 评分批次 `legacy-priority-20260429-batch` 至 `legacy-priority-20260505-batch` 暂不进入前台热力摘要。它们保留为历史 baseline，需要补 evidenceScore、source level、counter evidence 和去重状态。

## reject

没有发现必须 reject 的 legacy scoring 批次；主要问题是证据字段不足，而不是无商业价值。
