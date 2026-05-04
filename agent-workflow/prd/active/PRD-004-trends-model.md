# PRD-004：Trends 趋势判断模型

更新时间：2026-05-02  
owner：`pm`  
协作 agent：`trend-intelligence`、`data`、`copy`、`ui-ue`、`dev`、`qa`

## 1. 背景

Trends 是观澜 AI 的第二层判断能力，用于说明某个 AI 方向是否正在形成商业势能。它不是趋势名称列表，也不是简单的上升/下降标签。

## 2. 用户任务

用户进入 Trends，是为了看清：

1. 哪些方向正在升温、分化、降温或进入风险区。
2. 趋势判断由哪些证据支撑。
3. 哪些反证会削弱当前判断。
4. 这个趋势关联哪些 Signals 和 Opportunities。

## 3. 产品目标

建立可持续更新的趋势判断模型，让 Trends 支撑 Daily Brief 和 Opportunities，而不是孤立展示。

## 4. 非目标

- 不做泛泛的行业趋势文章。
- 不只展示趋势名称。
- 不把热度等同于机会。
- 不输出确定性结论。

## 5. 趋势状态

允许状态：

- `rising`：持续升温。
- `splitting`：分化中。
- `cooling`：降温。
- `emerging`：新出现。
- `mature`：成熟化。
- `risk`：风险变重。
- `invalidating`：反证增强。

## 6. 数据字段

必填字段：

- `trend_id`
- `slug`
- `title`
- `status`
- `track`
- `summary`
- `evidence_ladder`
- `adoption_stage`
- `opportunity_temperature`
- `counter_evidence`
- `related_signal_ids`
- `related_opportunity_ids`
- `updated_at`

Priority Engine 2.0 兼容字段：

- `judgment_ids`
- `trend_confidence`
- `point_consensus_state`
- `counter_evidence_state`
- `last_calibration_date`

## 7. 页面行为

- Trends 列表按状态和赛道分组。
- Trend 卡片展示趋势状态、核心判断和代表证据。
- Trend 详情页展示证据阶梯、机会温度、反证点、相关 Signals 和 Opportunities。
- 首页只展示少量关键趋势变化。
- Daily Brief 中的趋势变化必须能回链到 Trend 详情页。

## 8. 文案原则

- 使用“正在升温、出现分化、反证增强、仍需观察”等克制表达。
- 每个趋势判断必须解释“为什么”。
- 不用“风口、爆发、确定性赛道”等泛化营销词。

## 9. 权限边界

| 用户状态 | 可见内容 |
|---|---|
| 访客 | 少量趋势摘要 |
| 试读用户 | 部分趋势卡 |
| 会员 | 完整趋势详情 |
| 管理员 | 编辑趋势、维护关联、调整状态 |

## 10. 验收标准

- 每个 Trend 都有状态、证据、反证和关联内容。
- 每个 Trend 至少关联 1 条 Signal 或 1 个 Opportunity。
- 趋势详情页有独立 URL。
- 首页和 Daily 只展示精选趋势，不堆叠全部趋势。
- 文案不使用绝对化结论。
- The Point 只能作为观点共识、分歧或边界信号影响趋势观察，不作为事实证据直接加权。
