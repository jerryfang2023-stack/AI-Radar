---
legacy_batch_id: legacy-scoring-20260507
asset_type: priority-heat-evidence-candidates
source_scope: V1 Scoring
converted_at: 2026-05-07
status: legacy-candidates
production_readiness: needs_review
encoding: UTF-8
---

# V1 Scoring -> V2 Priority / HeatEvidence Candidates

## 转换规则

V1 `AI机会评分` 不恢复为前台 Scoring。它转为后台 Priority / HeatEvidence 候选，用于解释哪些机会方向曾被连续评分、为什么升温或降温。

| v2_id | source_path | source_date | conversion_reason | V2 role | relations | evidence_gaps |
|---|---|---|---|---|---|---|
| `legacy-priority-20260429-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/2026-04-29-AI机会评分.md` | 2026-04-29 | 早期机会评分，可作为热力 baseline | Priority / HeatEvidence candidate | related_trend_ids: `legacy-trend-context-main` | 缺 V2 evidenceScore / confidenceScore |
| `legacy-priority-20260430-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/2026-04-30-AI机会评分.md` | 2026-04-30 | 与 Vanta / Agent 治理等信号相关 | Priority / HeatEvidence candidate | related_opportunity_ids: `legacy-opportunity-agent-governance` | 缺反证权重 |
| `legacy-priority-20260501-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/2026-05-01-AI机会评分.md` | 2026-05-01 | 可支持连续趋势判断 | Priority / HeatEvidence candidate | related_trend_ids: `legacy-trend-context-main` | 缺来源等级 |
| `legacy-priority-20260502-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/2026-05-02-AI机会评分.md` | 2026-05-02 | 包含治理、合规、并购阻力等边界型评分 | Counter HeatEvidence candidate | related_opportunity_ids: Agent governance / compliance | 缺 V2 boundary role |
| `legacy-priority-20260503-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/2026-05-03-AI机会评分.md` | 2026-05-03 | 可与 The Point 校准层连接 | Calibration candidate | related_point_ids: legacy point 2026-05-03 | 缺 Point 角色区分 |
| `legacy-priority-20260504-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/2026-05-04-AI机会评分.md` | 2026-05-04 | 可映射到商业热力度历史分数 | Priority baseline | related_trend_ids: legacy trend context | 缺 heat direction |
| `legacy-priority-20260505-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/2026-05-05-AI机会评分.md` | 2026-05-05 | 可与 V2 monitoring 2026-05-05 对齐 | Priority baseline | related_signal_ids: 2026-05-05 monitoring | 缺去重状态 |
| `legacy-priority-20260506-batch` | `10-Archive/v1.0/source-dirs/02-Scoring/2026-05-06-AI机会评分.md` | 2026-05-06 | 已明确 Agent 治理、AI 基础设施托管、语音客服等方向分数 | HeatEvidence candidate | related_signal_ids: `S-2026-05-06-001..003`; related_opportunity_ids: Agent治理与权限审计服务, AI基础设施托管服务, AI语音客服首轮分流助手 | 需要补 V2 heatContribution 和 sourceWeight |

## V2 六维候选重写

- 解决什么具体问题：把 V1 分数转换为可追溯的热力证据，而不是前台榜单。
- 谁最先感受到：Data Agent、PM、会员内参编辑和 Admin 审核者。
- 改变了哪段流程：从“看分数”改为“解释证据强度、商业强度、争议与边界”。
- 价值从哪里来：历史连续分数可帮助判断趋势是否真的持续升温。
- 触发信号是什么：V1 每日机会评分与对应 Signals。
- 成立边界是什么：缺少 S/A/B 来源等级、反证权重和 HeatEvidence 字段时，只能作为候选。
