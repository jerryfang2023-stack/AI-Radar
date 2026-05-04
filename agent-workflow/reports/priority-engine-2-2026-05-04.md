---
title: Priority Engine 2.0 Formation Report
type: intelligence-data-report
schema_version: 1
id: priority-engine-2-2026-05-04
date: 2026-05-04
owner: data-agent
status: accepted
---

# Priority Engine 2.0 形成报告｜2026-05-04

## 1. 本轮结论

已形成 Priority Engine 2.0 的第一版产品与算法规范。

核心判断：

```text
观澜AI的竞争力不是信息抓取，而是证据网络、判断模型和回测校准。
```

Priority Engine 2.0 将 Signals 和 The Point 组织成 `Judgment Node`，再通过 6 个模块形成机会优先级、趋势状态和反证校准。

## 2. 新增文件

- `agent-workflow/execution/PLAN-priority-engine-2-2026-05-04.md`
- `agent-workflow/product/priority-engine-2.md`
- `agent-workflow/reports/priority-engine-2-2026-05-04.md`

## 3. 模型核心

Priority Engine 2.0 的评分模块为：

| 模块 | 作用 |
|---|---|
| Evidence Quality Score | 判断事实证据是否可靠、独立、可追溯 |
| Demand Reality Score | 判断需求是否真实、刚性、可付费 |
| Momentum Score | 判断方向在 7 / 30 / 90 天是否形成动量 |
| Point Intelligence Score | 判断 The Point 是否形成共识、分歧或边界 |
| Opportunity Fit Score | 判断是否能落成可验证机会 |
| Counter Evidence Score | 判断反证是否削弱趋势、机会或商业模式 |

新增核心对象：

```text
Judgment Node = 赛道 + 能力 + 客户场景 + 证据阶段
```

示例：

- 企业 Agent 工作平台
- Agent 治理与权限审计
- AI 销售执行 Agent
- 端侧小模型部署工具链
- 垂直行业 AI 试点客户转化

## 4. 输出状态

Priority Engine 2.0 不使用投资化表达，对外使用以下状态：

| 分数 | 状态 | 对外表达 |
|---:|---|---|
| 80-100 | priority_verify | 优先验证 |
| 65-79 | active_watch | 持续观察 |
| 50-64 | early_watch | 早期观察 |
| 35-49 | cautious | 谨慎观察 |
| 0-34 | downgrade | 暂缓关注 |

## 5. 判断语法

模型输出应稳定落入 6 类判断：

- 方向升温
- 方向分化
- 机会前移
- 需求验证
- 反证增强
- 暂缓关注

这能让 Trends 不再只是趋势名称，让 Opportunities 不再只是公司案例，让 The Point 不再只是观点列表。

## 6. 护城河机制

Priority Engine 2.0 的长期护城河是 `Judgment Memory`。

每个判断节点都应保存当日快照，并在 7 / 30 / 90 天后回测：

- 当初高分判断是否被客户、收入、融资、采购或产品证据验证？
- 当初低分判断是否后来变重要？
- 哪些来源有早发现能力？
- 哪些 The Point 观点被后续事实验证？
- 哪些关键词持续制造噪音？

建议长期指标：

- `precision_at_top_k`
- `lead_time_days`
- `false_positive_rate`
- `source_alpha`
- `point_validation_rate`
- `trend_conversion_rate`

## 7. 自动化影响

### `ai-2`

有影响。

后续应更新每日机会评分提示词。短期建议保留旧 30 分表兼容，同时新增 Priority 2.0 拆解段。

### `ai-the-point`

轻量影响。

后续 The Point 应输出观点立场、支持 / 质疑的 Judgment Node，以及可验证边界。

### `ai-3`

短期不影响。

本轮未改同步脚本、关系检查或入站闸门。中期若实现 Judgment Node，需要 Dev Agent 扩展解析和关系检查。

## 8. 风险

- 若直接替换现有评分表，可能破坏同步兼容；建议先双轨输出。
- 若 The Point 观点权重过高，可能把观点误当事实；规范中已明确 The Point 只作为观点层。
- 若分数对外展示过细，可能让用户误读为确定性结论；对外只展示状态和证据边界。

## 9. 下一步建议

1. 用户确认 `priority-engine-2.md` 的模型方向。
2. PM Agent 将 Priority Engine 2.0 纳入 PRD-003 / PRD-004 后续迭代。
3. Workflow Agent 派发 `AI机会评分与趋势判断系统V4.0.md` 升级任务。
4. Dev Agent 后续实现 Judgment Node 解析和回测字段。
5. QA Agent 建立评分解释抽查和反证校准验收。

## 10. 调度中枢验收

2026-05-04 调度中枢已验收通过，状态更新为 `accepted`。

- 本轮产物完整：Plan、Product Model、Formation Report 均已存在且可 UTF-8 正常读取。
- 本轮只完成 Priority Engine 2.0 第一版模型形成，不改网站、不改同步脚本、不改历史内容源、不改自动化配置对象。
- Priority Engine 2.0 继续保持后台判断能力，不新增前台栏目。
- 后续需先由 PM Agent 确认产品边界，再单独派发 ai-2 提示词升级、Dev Judgment Node 解析、QA 评分解释与非投资化验收。
