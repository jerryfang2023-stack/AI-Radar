# PRD-003：Opportunities 机会库与 Priority Engine

更新时间：2026-05-02  
owner：`pm`  
协作 agent：`opportunity-engine`、`data`、`copy`、`ui-ue`、`dev`、`qa`

## 1. 背景

Opportunities 是观澜 AI 的长期资产。新的产品方向是：Scoring 不再作为普通前台栏目，而是后台 Priority Engine；评分、优先级、证据等级和趋势状态进入每张 Opportunity Card。

## 2. 用户任务

用户进入机会库，是为了判断：

1. 这个机会方向是什么。
2. 适合哪些客户和场景。
3. 为什么现在值得观察或验证。
4. 代表证据是什么。
5. 趋势状态如何。
6. 还有哪些风险和反证。

## 3. 产品目标

把机会卡升级为“机会定义 + 优先级 + 证据等级 + 趋势状态 + 代表案例 + 风险边界”的判断卡，而不是公司项目列表。

## 4. 非目标

- 不把机会卡做成公司档案。
- 不展示单纯公司排行榜。
- 不把评分页面作为普通用户一线栏目。
- 不做投资建议或交易撮合流程。
- 不输出确定性行动指令。

## 5. 功能说明

机会卡必须展示：

- 机会定义。
- 目标客户。
- 应用场景。
- 商业模式。
- Priority Engine 最新评分。
- 证据等级。
- 趋势状态。
- 相关 Signals。
- 相关 Trends。
- 代表案例公司。
- 风险与反证。

## 6. 数据字段

必填字段：

- `opportunity_id`
- `slug`
- `title`
- `track`
- `scenario`
- `customer`
- `business_model`
- `priority_score_current`
- `priority_verdict`
- `evidence_level`
- `trend_status`
- `related_signal_ids`
- `related_trend_ids`
- `representative_companies`
- `risks`
- `status`

避免字段：

- `company_as_title`
- `investment_advice`
- `guaranteed_return`

## 7. 页面行为

- Opportunities 列表支持按优先级、趋势状态、证据等级筛选。
- Opportunity 详情页使用独立 slug。
- 首页只展示少量代表性机会，不展示完整机会库。
- Scoring 旧入口需要迁移、隐藏或降级为内部能力说明。
- 管理员可在 Admin 中合并、编辑、下架机会卡。

## 8. 文案原则

- 机会标题不出现公司名。
- 公司名只作为代表案例或证据来源。
- 判断使用“优先观察、值得验证、持续观察、暂缓关注”等克制表达。
- 避免“必投、稳赚、确定性机会”等投资建议式表达。

## 9. 权限边界

| 用户状态 | 可见内容 |
|---|---|
| 访客 | 样例机会摘要 |
| 试读用户 | 部分机会卡 |
| 会员 | 完整机会库与详情 |
| 管理员 | 编辑、合并、下架、维护关联 |

## 10. 验收标准

- 普通前台不再保留独立 Scoring 或 Priorities 一级栏目。
- 每张正式机会卡包含优先级、证据等级、趋势状态和风险边界。
- 每张高优先级机会至少能追溯到 1 条 Signal 或 Trend。
- 机会标题不含公司名后缀。
- 管理员保存后刷新不丢失。
- 评分对象显示为机会方向或赛道，不显示为公司榜单。

