---
title: Priority Engine 2.0
type: product-model
schema_version: 1
id: priority-engine-2
date: 2026-05-04
owner: data-agent
status: active-p0-fast-track
---

# Priority Engine 2.0

## 1. 定位

Priority Engine 2.0 是观澜AI的核心判断引擎。

它不替用户做最终经营、投资或合作判断，而是把 Signals 和 The Point 转化为可追踪、可复盘、可校准的机会优先级与趋势判断。

一句话定义：

```text
Priority Engine 2.0 = 证据强度 + 趋势动量 + 观点共识/分歧 + 机会适配 + 反证校准 + 回测记忆
```

它要回答四个问题：

1. 哪些 AI 方向正在形成商业势能？
2. 哪些机会方向值得优先验证？
3. 哪些判断正在被反证削弱？
4. 哪些来源、关键词和观点真正有早发现能力？

## 2. 输入层

### 2.1 Signals

Signals 提供事实和商业事件：

- 融资
- 客户采用
- 收入验证
- 产品发布
- 监管 / 政策
- 采购 / 招标
- 并购整合
- 平台数据

Signals 回答：

```text
发生了什么？
证据是什么？
它改变了哪个商业判断？
```

### 2.2 The Point

The Point 提供一线建造者观点：

- 支持某方向。
- 质疑某方向。
- 修正市场共识。
- 暴露技术、产品、组织或商业边界。
- 提供未来 7 / 30 / 90 天可验证的观点线索。

The Point 回答：

```text
关键建造者怎么看？
观点是否形成共识或分歧？
观点是否被后续 Signal 验证？
```

### 2.3 Source Intelligence

Source Intelligence 提供来源和关键词质量：

- 来源层级：S / A / B / C / D。
- 关键词命中质量。
- 早期信号覆盖率。
- 噪音率。
- 首发或早发现能力。

### 2.4 现有判断资产

- Trends：方向是否形成势能。
- Opportunities：可验证机会方向。
- Priority Rows：历史评分记录。
- Tags：关系网络和检索资产。

## 3. 核心对象：Judgment Node

Priority Engine 2.0 不直接以公司为评分对象，而以 `Judgment Node` 为评分对象。

Judgment Node 是一个稳定的判断节点，通常由以下组合定义：

```text
赛道 + 能力 + 客户场景 + 证据阶段
```

示例：

- 企业 Agent 工作平台
- Agent 治理与权限审计
- AI 销售执行 Agent
- 企业数据智能体控制平面
- 端侧小模型部署工具链
- 垂直行业 AI 试点客户转化

建议字段：

```json
{
  "judgment_id": "jn-enterprise-agent-workbench",
  "title": "企业 Agent 工作平台",
  "track": "AI Agent",
  "capability": "workflow execution",
  "customer": "enterprise",
  "scenario": "cross-system workflow",
  "stage": "rising",
  "related_signal_ids": [],
  "related_point_ids": [],
  "related_trend_ids": [],
  "related_opportunity_ids": [],
  "latest_priority_score": 0,
  "priority_status": "verify | watch | cautious | downgrade",
  "updated_at": "YYYY-MM-DD"
}
```

## 4. 六个评分模块

### 4.1 Evidence Quality Score｜证据质量

衡量事实证据是否可靠、独立、可追溯。

建议权重：`22%`

评分因子：

| 因子 | 说明 |
|---|---|
| 来源层级 | S/A 来源高于 C 级线索 |
| 证据类型 | 客户、收入、采购、部署高于单纯融资 |
| 独立性 | 多个独立来源高于单一转载 |
| 可追溯性 | 有 URL、公告、文件、客户名或数据 |
| 新鲜度 | 近 7 / 30 天证据权重更高 |

证据类型基础分：

| 证据类型 | 基础分 |
|---|---:|
| 收入 / ARR / 复购 | 95 |
| 采购 / 招投标 / 合同 | 90 |
| 客户部署 / 设计伙伴 / 首批客户 | 85 |
| 产品发布 + 客户或开发者采用 | 75 |
| 融资 + 明确客户或技术路径 | 70 |
| 单纯融资 | 55 |
| 单纯观点 / 社媒热度 | 30 |

### 4.2 Demand Reality Score｜需求真实度

衡量这个方向是否解决明确、刚性、可付费的问题。

建议权重：`16%`

评分因子：

- 是否有明确预算方。
- 是否替代高成本流程。
- 是否影响收入、成本、合规、交付效率或风险。
- 是否有采购、试点、部署或复购。
- 是否有垂直行业场景，而不是泛泛“提升效率”。

### 4.3 Momentum Score｜趋势动量

衡量方向是否在 7 / 30 / 90 天形成连续证据。

建议权重：`16%`

计算思路：

```text
momentum_7d = 近 7 天有效证据加权和
momentum_30d = 近 30 天有效证据加权和
momentum_ratio = momentum_7d / max(momentum_30d 日均值, 1)
```

状态解释：

| 状态 | 条件 |
|---|---|
| emerging | 首次出现高质量早期证据 |
| rising | 多类证据连续增强 |
| splitting | 有强证据，也有明显反证 |
| mature | 客户、收入和竞争同时出现 |
| cooling | 新增证据减少或重复 |
| invalidating | 反证明显削弱原判断 |

### 4.4 Point Intelligence Score｜观点智能

衡量 The Point 是否支持、修正或反驳某个判断。

建议权重：`12%`

The Point 不作为事实证据直接加权，而作为共识、分歧和边界信号。

评分因子：

| 因子 | 说明 |
|---|---|
| 作者权威度 | 建造者、研究者、产品负责人高于评论者 |
| 商业相关性 | 是否影响产品、客户、收入、生态或风险 |
| 原创性 | 是否提出新判断，而不是重复共识 |
| 观点立场 | bullish / cautious / critical / explanatory |
| 后续验证 | 观点是否被后续 Signal 证实或削弱 |

观点处理：

- 多个高质量来源支持同一方向：增加共识权重。
- 高权威来源提出谨慎或反对：进入反证或分歧。
- 同一主题强烈分裂：Trend 状态优先考虑 `splitting`。

### 4.5 Opportunity Fit Score｜机会适配

衡量某个判断节点是否能落成可验证机会。

建议权重：`16%`

评分因子：

- 具体问题是否清楚。
- 目标客户是否清楚。
- 替代或优化的流程是否清楚。
- 商业模式是否成立。
- 交付难度是否可控。
- 中国市场迁移是否有可能。
- 是否有明确验证动作。

机会状态：

| 分数 | 状态 | 处理 |
|---:|---|---|
| 80-100 | priority_verify | 优先验证 |
| 65-79 | active_watch | 持续观察 |
| 50-64 | early_watch | 早期观察 |
| 35-49 | cautious | 谨慎观察 |
| 0-34 | downgrade | 降级或暂缓关注 |

### 4.6 Counter Evidence Score｜反证强度

衡量负面事实是否削弱原判断。

建议作为风险扣分或状态校准项，不简单等同负面新闻。

反证类型：

- 客户流失。
- 毛利压力。
- 推理成本压力。
- 诉讼与版权风险。
- 安全事故。
- 隐私处罚。
- 监管执法。
- 平台挤压。
- 只试点不续费。

处理规则：

- 只影响单家公司：记录为案例风险。
- 影响同一赛道多家公司：下调 Trend 或 Opportunity。
- 与高权威 The Point 谨慎观点重合：提高反证权重。

## 5. 总分模型

建议先采用可解释的规则模型，不急于黑箱化。

```text
base_score =
  EvidenceQuality * 0.22
  + DemandReality * 0.16
  + Momentum * 0.16
  + PointIntelligence * 0.12
  + OpportunityFit * 0.16
  + StrategicRelevance * 0.08
  + Novelty * 0.10

risk_adjustment =
  CounterEvidence * 0.18
  + PlatformDependencyRisk * 0.05
  + DeliveryComplexityRisk * 0.05

priority_score = clamp(base_score - risk_adjustment, 0, 100)
```

说明：

- `Novelty` 用于奖励早期新方向，但不能替代证据。
- `StrategicRelevance` 用于体现观澜AI当前重点赛道。
- `CounterEvidence` 不是一律扣分；若反证本身是重要风险信号，也可推动 Trend 进入 `risk` 或 `invalidating`。

## 6. 输出状态

### 6.1 Priority 状态

| 分数 | 状态 | 对内含义 | 对外表达 |
|---:|---|---|---|
| 80-100 | priority_verify | 高优先级判断节点 | 优先验证 |
| 65-79 | active_watch | 证据较强，继续追踪 | 持续观察 |
| 50-64 | early_watch | 早期方向，有待验证 | 早期观察 |
| 35-49 | cautious | 证据弱或风险增加 | 谨慎观察 |
| 0-34 | downgrade | 噪音、重复或反证增强 | 暂缓关注 |

### 6.2 Trend 状态映射

| Priority Engine 结果 | Trend 状态建议 |
|---|---|
| 高 Novelty + 初始证据 | emerging |
| Momentum 连续增强 | rising |
| 支持证据和反证同时增强 | splitting |
| 证据强但竞争拥挤 | mature |
| Momentum 减弱 | cooling |
| Counter Evidence 增强 | risk / invalidating |

### 6.3 Opportunity 状态映射

| Priority Engine 结果 | Opportunity 处理 |
|---|---|
| priority_verify | 正式机会，优先展示 |
| active_watch | 正式机会或重点观察 |
| early_watch | 观察机会，等待更多证据 |
| cautious | 降低展示强度，补反证 |
| downgrade | 合并、隐藏或暂缓 |

## 7. 判断语法

Priority Engine 2.0 的输出不应只是分数，而应形成稳定判断语法。

允许的判断类型：

1. `方向升温`：多类证据重复出现。
2. `方向分化`：真实场景升温，概念层降温。
3. `机会前移`：从大厂能力扩散到创业公司、开源生态或垂直场景。
4. `需求验证`：客户、采购、部署或预算开始出现。
5. `反证增强`：成本、监管、留存、交付或安全问题削弱原判断。
6. `暂缓关注`：热度高但证据不足、重复或无法形成机会。

禁止的判断类型：

- 必投。
- 稳赚。
- 确定性机会。
- 全面爆发。
- 投资建议。
- 替用户下最终经营决策。

## 8. Judgment Memory

Priority Engine 2.0 的长期护城河是回测记忆。

每个 Judgment Node 应保留判断快照：

```json
{
  "snapshot_id": "js-2026-05-04-enterprise-agent-workbench",
  "judgment_id": "jn-enterprise-agent-workbench",
  "date": "2026-05-04",
  "priority_score": 78,
  "priority_status": "active_watch",
  "main_evidence_ids": [],
  "main_point_ids": [],
  "counter_evidence_ids": [],
  "judgment_text": "企业 Agent 工作平台从工具发布进入客户部署观察期。",
  "what_would_confirm": [],
  "what_would_weaken": [],
  "review_7d": null,
  "review_30d": null,
  "review_90d": null
}
```

### 8.1 7 / 30 / 90 天回测

回测问题：

- 当初高分判断是否出现后续客户、收入、融资、采购或产品证据？
- 当初低分判断是否后来变重要？
- 哪些高分只是媒体热度？
- 哪些来源最早发现了高价值 Signal？
- 哪些 The Point 观点被事实验证？
- 哪些关键词连续制造噪音？

### 8.2 模型校准指标

- `precision_at_top_k`：Top K 机会后续被验证比例。
- `lead_time_days`：比主流媒体或融资大报道提前发现的天数。
- `false_positive_rate`：高分但后续无证据或被反证的比例。
- `source_alpha`：某来源产出高价值 Signal 的早发现能力。
- `point_validation_rate`：某人物观点后续被 Signal 验证的比例。
- `trend_conversion_rate`：Signal / Point 转化为 Trend 或 Opportunity 的比例。

## 9. 字段建议

### 9.1 Priority Row 2.0

```json
{
  "priority_row_id": "priority-2026-05-04-001",
  "judgment_id": "jn-enterprise-agent-workbench",
  "date": "2026-05-04",
  "source_signal_ids": [],
  "source_point_ids": [],
  "related_trend_ids": [],
  "related_opportunity_ids": [],
  "evidence_quality_score": 0,
  "demand_reality_score": 0,
  "momentum_score": 0,
  "point_intelligence_score": 0,
  "opportunity_fit_score": 0,
  "counter_evidence_score": 0,
  "novelty_score": 0,
  "strategic_relevance_score": 0,
  "priority_score": 0,
  "priority_status": "active_watch",
  "judgment_type": "方向升温",
  "judgment_summary": "",
  "confirming_signals": [],
  "weakening_signals": [],
  "review_status": "pending_7d_review"
}
```

### 9.2 Opportunity 2.0 补充字段

- `judgment_id`
- `priority_score_v2`
- `priority_status_v2`
- `evidence_quality_score`
- `momentum_score`
- `point_support_score`
- `counter_evidence_score`
- `last_judgment_snapshot_id`
- `review_7d_status`
- `review_30d_status`
- `review_90d_status`

### 9.3 Trend 2.0 补充字段

- `judgment_ids`
- `momentum_7d`
- `momentum_30d`
- `point_consensus_state`
- `counter_evidence_state`
- `trend_confidence`
- `last_calibration_date`

## 10. 自动化应用

### 对 `ai-2`

需要后续更新。

`ai-2` 仍生成每日 AI 商业雷达与评分 Markdown，但评分口径应从 6 个 0-5 维度升级为 Priority Engine 2.0 的可解释模块。

短期兼容方式：

- 保留 30 分表，避免马上破坏现有同步。
- 额外写入 2.0 评分拆解：证据质量、需求真实度、趋势动量、观点智能、机会适配、反证强度。
- 每条评分必须关联一个 `Judgment Node` 或明确说明是新候选。

### 对 `ai-the-point`

需要轻量增强。

The Point 不直接改变机会评分，但应输出：

- 观点立场。
- 支持 / 质疑 / 修正的 Judgment Node。
- 可验证预测或边界。
- 是否进入反证观察。

### 对 `ai-3`

短期不改同步闸门。

中期需要 Dev Agent 支持解析 Priority 2.0 字段，并在关系检查中加入：

- Priority Row -> Judgment Node。
- Judgment Node -> Signal / Point / Trend / Opportunity。
- 7 / 30 / 90 天回测状态。

## 11. 实施阶段

### P0：模型成文

- 完成 Priority Engine 2.0 规范。
- 确认判断语法、评分模块、状态和字段。
- 不改脚本、不改页面。

### P1：自动化提示词升级

- 更新 `AI机会评分与趋势判断系统V4.0.md`。
- 保持旧 30 分总表兼容。
- 新增 Priority 2.0 拆解段。

### P2：数据结构与同步

- Dev Agent 增加 Judgment Node 解析。
- 关系检查加入 Judgment Node。
- Opportunity 和 Trend 吸收 2.0 字段。

### P2.1：第一版兼容入站

2026-05-04 快速落地版采用双轨策略：

- 旧 30 分评分表继续保留，作为短期同步兼容层。
- 新评分文件如包含 `Priority Engine 2.0 判断节点` 段，同步脚本优先解析显式字段。
- 历史评分文件没有 2.0 字段时，不批量重写内容源；同步脚本从旧评分标题、赛道、Opportunity / Trend 关系派生 Judgment Node，并标记 `judgmentNodeSource: derived`。
- The Point 只记录为观点共识、分歧或边界信号，不作为事实证据直接加权。
- 网站数据输出 `judgmentNodes` 与 `priorityEngine` 摘要，关系检查覆盖 `Priority -> Judgment Node` 的基础断链。

### P3：回测与校准

- 建立 7 / 30 / 90 天回测报告。
- 输出 source alpha、point validation rate、precision@topK。
- 每月校准权重。

## 12. 当前边界

Priority Engine 2.0 是后台判断能力，不是普通前台栏目。

对外只展示：

- 证据强度。
- 趋势状态。
- 优先验证 / 持续观察 / 谨慎观察。
- 主要支撑信号。
- 主要反证和边界。

不展示：

- 完整公式。
- 黑箱算法话术。
- 投资建议。
- 公司排行榜。
- 内部字段名。
