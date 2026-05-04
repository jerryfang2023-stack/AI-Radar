---
title: Priority Engine 2.0 Plan
type: plan
schema_version: 1
id: plan-priority-engine-2-2026-05-04
date: 2026-05-04
owner: data-agent
status: completed
---

# Priority Engine 2.0 计划｜2026-05-04

## 1. 背景与目标

观澜AI已经形成两类原始语料：

- `Signals`：记录发生了什么，有事件、证据和商业含义。
- `The Point`：记录一线建造者怎么看，有观点、立场和边界。

现有 Priority Engine 主要承接每日评分表和 Opportunity 匹配，能回答“今天哪些机会分数更高”，但还不足以形成长期核心竞争力。

Priority Engine 2.0 的目标是：

```text
把 Signals 和 The Point 转化为可追踪、可复盘、可校准的商业判断引擎。
```

它不只是给每日 Signal 排名，而是持续判断：

- 哪些方向正在形成商业势能。
- 哪些机会值得优先验证。
- 哪些趋势正在分化或降温。
- 哪些观点被后续事实验证。
- 哪些来源和关键词真正有早发现能力。

## 2. Strategy 判断

观澜AI的核心竞争力不应是“抓新闻更快”，而应是：

```text
证据标准化 + 关系网络 + 判断模型 + 回测校准
```

这套能力将支撑：

- Daily Brief 的每日判断。
- Trends 的势能状态。
- Opportunities 的优先级。
- The Point 的观点权重。
- Source Intelligence 的来源升权和降权。

## 3. 对应 PRD

本计划关联现有 PRD：

- `PRD-002-signals-system.md`
- `PRD-003-opportunities-engine.md`
- `PRD-004-trends-model.md`

暂不新增前台栏目，不改变现有导航。Priority Engine 2.0 仍为后台判断引擎，其结果通过 Daily Brief、Trends 和 Opportunities 对用户呈现。

## 4. 输入文件

- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/product/signal-system.md`
- `agent-workflow/product/the-point-model.md`
- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/opportunity-priority-schema.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/prd/active/PRD-003-opportunities-engine.md`
- `agent-workflow/prd/active/PRD-004-trends-model.md`
- `提示词/AI机会评分与趋势判断系统V4.0.md`

## 5. 输出文件

- `agent-workflow/product/priority-engine-2.md`
- `agent-workflow/reports/priority-engine-2-2026-05-04.md`

## 6. 涉及长期 Agent

| Agent | 职责 |
|---|---|
| Intelligence Data Agent | 定义评分模型、判断节点、关系网络和回测机制 |
| PM Agent | 确认产品边界、验收标准和前后台呈现范围 |
| Workflow / Automation Agent | 后续协调 `ai-2` / `ai-3` 是否需要更新运行说明 |
| Dev Agent | 后续实现字段解析、计算脚本和质量检查 |
| QA / Acceptance Agent | 后续抽查评分解释、关系链和前台表达边界 |
| Copy Agent | 后续确保对外不用投资化、绝对化表达 |

## 7. 非目标

- 本轮不改 `04-Site/` 页面。
- 本轮不改同步脚本。
- 本轮不改历史 Signals、Scoring、Trends、Opportunities 或 The Point 内容。
- 本轮不改自动化任务配置对象。
- 本轮不把 Priority Engine 作为前台独立栏目。
- 本轮不输出投资建议、经营指令或确定性承诺。

## 8. 风险与边界

- 评分模型必须解释“为什么”，不能变成黑箱分。
- The Point 不能被当成事实证据，只能作为观点、共识、分歧或反证层。
- 早期信号可以加分，但不能因为新鲜而绕过商业证据。
- 反证信号不等于负面新闻，必须说明它削弱哪个趋势、机会或商业模式。
- 对外表达应使用“优先验证 / 持续观察 / 谨慎观察 / 暂缓关注”，不使用“做多 / 做空 / 必须投资”。

## 9. 验收标准

- 形成 Priority Engine 2.0 的正式产品与算法规范。
- 说明输入、输出、对象、字段、评分模块和状态。
- 明确 Signals 与 The Point 如何共同影响 Trend 和 Opportunity。
- 明确回测校准机制。
- 明确对 `ai-2`、`ai-the-point`、`ai-3` 的影响。
- 运行 `node agent-workflow/tools/run-quality-gates.mjs syntax`。

## 10. 是否需要人工确认

需要。

本计划会影响后续 Priority Engine、每日评分、Trend 状态和 Opportunity 优先级解释。建议先由用户确认 Priority Engine 2.0 的判断框架，再派发 Dev / Automation 实现。
