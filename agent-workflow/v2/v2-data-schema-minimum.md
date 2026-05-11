---
title: V2 最小数据 Schema 与关系要求
date: 2026-05-07
task_id: WSD-20260507-14-v2-product-to-design-data-copy-autopilot
board_id: V2-8AUTO
status: accepted
owner: Intelligence Data Agent
encoding: UTF-8
---

# V2 最小数据 Schema 与关系要求

## 0. 原则

V2 数据模型先保证可追溯、可关联、可检查，再进入生产 validator。前台不展示 Raw / Pool / Structured / HeatEvidence 等内部字段名；这些字段只服务生产线、质量检查和 Admin。

核心要求：

- 所有核心实体必须有稳定 `id`、`slug`、`title`、`status`。
- 所有前台判断必须可追溯到来源或证据。
- Point 只做观点校准，不作为事实主证据。
- Trend 不做独立前台频道，只做趋势背景和热力输入。

## 1. Point Calibration

用于替代独立 The Point 频道的嵌入式观点校准。

最小字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `point_id` | 是 | 稳定 ID |
| `slug` | 是 | 可引用 slug |
| `speaker` | 是 | 人物、机构或来源主体 |
| `speaker_role` | 否 | 身份说明 |
| `source_url` | 是 | 原始来源 |
| `source_level` | 是 | S/A/B/C |
| `stance` | 是 | support / question / counter / boundary / neutral |
| `calibrates` | 是 | 支持、质疑或修正什么判断 |
| `related_signal_ids` | 否 | 相关 Signal |
| `related_opportunity_ids` | 否 | 相关机会解码 |
| `related_trend_ids` | 否 | 相关趋势背景 |
| `risk_or_boundary` | 否 | 风险或边界 |
| `published_at` | 是 | 发表时间 |
| `quality_status` | 是 | candidate / usable / rejected |

生产 validator 必须检查：`point_id`、`source_url`、`stance`、`calibrates`。

## 2. Trend Context

用于机会解码和商业内参，不生成独立普通栏目。

最小字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `trend_id` | 是 | 稳定 ID |
| `slug` | 是 | 可引用 slug |
| `title` | 是 | 趋势背景标题 |
| `status` | 是 | warming / stable / cooling / mixed / disputed |
| `period` | 是 | 周期 |
| `evidence_summary` | 是 | 证据积累摘要 |
| `related_signal_ids` | 是 | 相关信号 |
| `related_point_ids` | 否 | 观点校准 |
| `related_opportunity_ids` | 否 | 机会解码 |
| `counter_evidence` | 否 | 反证 |
| `evidence_gaps` | 否 | 证据缺口 |
| `brief_ready` | 是 | 是否可进入商业内参 |

生产 validator 必须检查：趋势不得只有标题；必须至少关联 1 条高质量 Signal 或明确标记为候选。

## 3. Opportunity Report

用于 `机会解码`。

最小字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `opportunity_id` | 是 | 稳定 ID |
| `slug` | 是 | URL slug |
| `title` | 是 | 不得使用公司名作为标题 |
| `one_line_judgment` | 是 | 一句话机会判断 |
| `evidence_status` | 是 | observation / supported / disputed / archived |
| `problem` | 是 | 解决什么具体问题 |
| `first_affected_users` | 是 | 谁最先感受到问题 |
| `workflow_change` | 是 | 改变了哪段流程 |
| `value_source` | 是 | 价值从哪里来 |
| `trigger_signal` | 是 | 触发信号 |
| `boundary` | 是 | 成立边界 |
| `related_signal_ids` | 是 | 相关 Signal |
| `trend_context_ids` | 否 | 趋势背景 |
| `point_calibration_ids` | 否 | 观点校准 |
| `counter_evidence` | 是 | 反证或限制 |
| `source_ids` | 是 | 来源 ID 或 URL |
| `published_at` | 是 | 发布时间 |

生产 validator 必须检查：标题公司名风险、6 维是否齐全、至少 3 个 S/A/B 来源或明确标记 observation。

## 4. HeatEvidence

统一证据对象，服务商业热力图与内参。

最小字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `heat_evidence_id` | 是 | 稳定 ID |
| `source_type` | 是 | signal / point / opportunity / trend |
| `source_id` | 是 | 原始实体 ID |
| `title` | 是 | 证据标题 |
| `summary` | 是 | 证据摘要 |
| `industry_tags` | 是 | 至少 1 个 |
| `job_tags` | 否 | 岗位标签 |
| `workflow_tags` | 否 | 流程标签 |
| `impact_modes` | 是 | 替代 / 增强 / 压缩 / 重组等 |
| `business_value_tags` | 是 | 收入、成本、效率、交付、风险等 |
| `evidence_role` | 是 | fact / calibration / opportunity / trend / counter_evidence / boundary |
| `confidence_score` | 是 | 0-100 |
| `heat_direction` | 是 | up / stable / down / mixed |
| `period` | 是 | 周或月 |
| `counter_evidence` | 否 | 反证 |
| `evidence_gaps` | 否 | 缺口 |

进入热力池最低条件：至少 1 个行业标签，且岗位或流程至少命中一类，并能说明影响方式或商业价值。

## 5. HeatCard / HeatmapTriple

最小字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `heat_card_id` | 是 | 稳定 ID |
| `card_type` | 是 | industry / job / workflow / triple |
| `period` | 是 | 周或月 |
| `industry` | 视类型 | 行业 |
| `job` | 视类型 | 岗位 |
| `workflow` | 视类型 | 流程 |
| `ai_heat_score` | 是 | 0-10 |
| `stage` | 是 | observation / starting / accelerating / mature / disputed / cooling |
| `heat_change` | 是 | 与上一期变化 |
| `judgment` | 是 | 克制判断 |
| `evidence_ids` | 是 | HeatEvidence IDs |
| `counter_evidence_summary` | 否 | 反证摘要 |

Triple 是商业内参 P0 的主表达，不做公开排行榜。

## 6. AIBriefIssue

用于 `商业内参`。

最小字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `issue_id` | 是 | 稳定 ID |
| `slug` | 是 | URL slug |
| `issue_type` | 是 | weekly / monthly |
| `period` | 是 | 周期 |
| `title` | 是 | 标题 |
| `executive_summary` | 是 | 3-5 条核心判断 |
| `top_triples` | 是 | 高热三元组 |
| `rising_heat_points` | 否 | 升温 |
| `cooling_heat_points` | 否 | 降温 |
| `controversial_heat_points` | 否 | 争议 |
| `evidence_summary` | 是 | Signals / Points / Opportunities / Trends |
| `counter_evidence_summary` | 是 | 反证摘要 |
| `evidence_gaps` | 否 | 证据缺口 |
| `member_visibility` | 是 | public_sample / login_preview / member_full |
| `published_at` | 是 | 发布时间 |

## 7. 必须进入生产 validator 的字段

第一批 validator：

- `id` / `slug` 唯一性。
- Opportunity Report 标题不使用公司名。
- Signal / Opportunity 的 6 维齐全。
- Front Signal 至少 3 个 S/A/B 来源。
- Point 不得作为事实主证据。
- HeatEvidence 必须反向关联 sourceId。
- AIBriefIssue 的 evidence summary 不得断链。

可先文档化、后续进入 validator：

- 热力权重公式。
- 行业 / 岗位 / 流程 seed dictionary 完整治理。
- 月度跨期比较。
- 会员权限状态与真实支付状态。

## 8. 生产线交接

本文件只定义最小 schema，不修改生产脚本。V2-13 生产线切换时必须决定：

- 实际内容目录。
- JSON 输出结构。
- 备份与回滚。
- 同步失败是否恢复上一版有效数据。
- `01-SiteV2/site/` 的数据读取方式。
