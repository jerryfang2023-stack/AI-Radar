---
date: 2026-05-08
stage: history-heat-evidence-refinement
status: refined
source_scope: V1 historical signals and points
encoding: UTF-8
---

# History HeatEvidence Refined Package

## publish_ready

| heat_evidence_id | source_type | source_id | title | evidence_role | source_level | confidence_score | heat_direction | related_assets |
|---|---|---|---|---|---|---:|---|---|
| `HE-HIST-20260508-01` | signal | `LS-20260508-03` | AI 营销从内容生成转向收入系统 | fact | A | 82 | up | `LT-20260508-04`, `LEGACY-OPP-20260508-04` |
| `HE-HIST-20260508-02` | signal | `LS-20260508-04` | 专业服务 AI 进入交付工作流 | fact | A | 78 | up | `LT-20260508-06`, `LEGACY-OPP-20260508-02` |
| `HE-HIST-20260508-03` | signal | `LS-20260508-05` | Agent 工程化运行层升温 | fact | B | 72 | up | `LT-20260508-05`, `LEGACY-OPP-20260508-05` |
| `HE-HIST-20260508-04` | signal | `LS-20260508-06` | 数据语义层与身份治理支撑 Agent 执行 | fact | S | 84 | up | `LT-20260508-07`, `LEGACY-OPP-20260508-03` |
| `HE-HIST-20260508-05` | point | `LPT-20260508-05` | 可验证工作优先规模化 | calibration | B | 70 | up | `LS-20260508-05`, `LT-20260508-05` |
| `HE-HIST-20260508-06` | point | `LPT-20260508-08` | 可审计记忆与上下文资产 | calibration | S | 76 | up | `LS-20260508-06`, `LT-20260508-07` |

## hold

| candidate_id | reason |
|---|---|
| `HE-HIST-MEDICAL-AI` | 医疗 AI 证据强但监管和临床责任边界复杂，暂不进入通用热力池。 |
| `HE-HIST-EMBODIED-AI` | 具身智能与自动驾驶工程化方向重要，但当前 V2 未建立专项热力切片。 |
| `HE-HIST-ARR-SOCIAL` | 二手 ARR / 估值重建只作经营指标线索，不作为事实证据。 |

## reject

- 无来源链接或只有情绪表达的社媒短观点。
- 与已有 publish-ready HeatEvidence 完全重复且无新增证据的转载。
