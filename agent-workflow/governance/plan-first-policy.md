# Plan-first Policy

更新时间：2026-05-03  
owner：`pm` / `strategy`  
状态：长期生效

## 1. 定位

观澜AI采用 Plan-first 工作方式：重大任务先计划，再执行。

本规则用于防止多个长期 agent 在需求未定义、边界未确认、验收不清楚时直接进入实现，导致返工、职责重叠或破坏前台/后台边界。

## 2. 必须先计划的任务

以下任务必须先由 Strategy Agent 或 PM Agent 输出计划文件，再进入 Data、UI/UE、Copy、Dev 或 QA：

1. 新增、删除、合并或调整前台栏目。
2. 改动首页、Daily Brief、Signals、The Point、Opportunities、Trends 的核心结构。
3. 改动账号、会员、权限、Admin 或支付路径。
4. 改动 Signal、Trend、Opportunity、The Point、Tags 的数据模型。
5. 改动每日自动化、统一同步、质量检查或降级策略。
6. 云端部署、备份、回滚、真实用户权限或真实支付。
7. 新增长期 agent、合并长期 agent 或改变 agent 职责。
8. 改动对外商业化表达、样例报告、newsletter 或企业版服务。

## 3. 可直接执行的任务

以下任务可以由对应 agent 直接执行，但仍需写回结果：

- 修正文档错别字或明显格式问题。
- 更新已确认规则下的字段补齐。
- 运行已有同步和检查脚本。
- 修复 QA 已定位的小范围页面问题。
- 在不改变产品边界的前提下补充报告或日志。

## 4. 计划文件要求

计划文件优先写入：

```text
agent-workflow/execution/
```

命名建议：

```text
task-<feature-id>-<short-name>.md
```

计划必须包含：

- 背景与目标。
- 对应 Strategy 判断。
- 对应 PRD 或是否需要新 PRD。
- 输入文件。
- 输出文件。
- 涉及长期 agent。
- 非目标。
- 风险与边界。
- 验收标准。
- 是否需要人工确认。

## 5. 推荐执行顺序

默认顺序：

```text
Strategy -> PM -> Intelligence Data -> UI/UE + Copy -> Dev -> QA -> Workflow
```

阶段并行规则：

- Strategy 与 PM 通常串行，先定边界再拆任务。
- Intelligence Data、UI/UE、Copy 可在 PM 计划明确后并行输出规范。
- Dev 在关键输入稳定后整合实现。
- QA 不参与实现，只做独立验收。
- Workflow 在结尾更新状态、报告和交接。

## 6. 人工确认规则

以下情况需要用户确认：

- 改动产品定位或前台导航。
- 新增商业化路径或付费承诺。
- 删除、隐藏或合并重要栏目。
- 引入真实支付、真实登录、真实云端写入。
- 使用临时 agent 替代长期文档分配。
- 对外公开 Method、样例报告或企业版承诺。

## 7. 验收标准

- 重大任务执行前有计划文件。
- 计划文件能说明“为什么做 / 为什么不做”。
- 每个参与 agent 都有输入、输出和验收。
- 非目标写清楚，避免范围膨胀。
- 完成后更新 `feature_list.json`、`progress.md` 或 `reports/`。

## 8. 与其他治理文件关系

- 本文件决定“是否先计划”。
- `quality-gates.md` 决定“完成前必须通过什么检查”。
- `agent-memory.md` 提供长期规则和纠偏经验。
- `long-term-agent-dispatch-policy.md` 决定“不能随意创建临时 agent”。
