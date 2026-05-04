---
title: Signal -> Opportunity 关系清理报告
date: 2026-05-04
owner: Intelligence Data Agent
status: completed
---

# Signal -> Opportunity 关系清理报告

## 背景

用户反馈：Signals 指向的机会数据存在明显错配，一个 Signal 关联多个机会，且部分 Signal 内容与机会完全不搭。

本轮按 Intelligence Data Agent 口径检查后确认：问题主要来自同步脚本中的弱标签关联。

## 问题定位

原逻辑中，`sync-data.mjs` 会用 taxonomy overlap 自动为每条 Signal 补齐最多 8 个 Opportunity：

- 匹配阈值为 `overlapScore >= 2`，过低。
- 每条 Signal 默认取前 8 个机会，导致 29 条 Signal 全部出现 8 个关联。
- Signal -> Opportunity 总关系数达到 232 条。
- `relation-check` 只检查 ID 是否存在和覆盖率，不检查语义是否贴合，所以无法发现错配。

同时发现一处评分项误匹配：

- `2026-05-02-signal-6` ARI / Meta 具身智能并购 Signal 被错误匹配到 `专业服务AI工作流平台`。
- 根因是规则匹配用“任一关键词命中”，宽词 `专业服务AI` 触发了错误机会匹配。

## 修正原则

本轮将 Signal -> Opportunity 从“泛标签弱关联”收紧为“主机会关联”：

1. 优先使用 Priority Engine 评分项直接命中的 Opportunity。
2. 如无评分项，再使用原始 Markdown 中显式写出的 `相关机会`。
3. 每条 Signal 默认只指向 1 个主 Opportunity。
4. 二级含义、风险边界和治理影响保留在 Trend / 保留观察中，不作为同级 Opportunity 链接。
5. Opportunity -> Signal 反向关系只来自评分项或显式关系，不再用弱标签补齐。

## 代码改动

- `04-Site/scripts/sync-data.mjs`
  - 新增 `matchOpportunityIdsByName()`，用于解析原始 Markdown 显式机会名。
  - `ruleMatchOpportunity()` 从“任一规则命中”改为“多条件命中”；只有单实体规则可单条件命中。
  - Signal -> Opportunity 改为只保留主机会。
  - Opportunity -> Signal 改为只保留评分项或显式关系。

## 结果

清理前：

- 29 条 Signals
- 每条 Signal 均关联 8 个 Opportunity
- Signal -> Opportunity 总关系数：232
- 存在明显语义错配

清理后：

- 29 条 Signals
- 每条 Signal 关联 1 个主 Opportunity
- Signal -> Opportunity 总关系数：29
- 多关联 Signal：0
- 空关联 Signal：0

2026-05-03 当日样本：

| Signal | 主 Opportunity |
|---|---|
| Legora 法律 AI | 专业服务AI工作流平台 |
| Aidoc 临床 AI | 临床影像AI辅助诊断平台 |
| Citi Agentic AI | 企业Agent工作平台 |
| Snowflake Intelligence / Cortex Code | 企业数据智能体控制平面 |
| Okta for AI Agents | Agent治理与权限审计服务 |
| ASAPP 多 Agent 客服 | AI企业客服执行Agent |
| Meta Business AI | 中小商家AI营销对话平台 |

## 验证

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0。
- `node 04-Site/scripts/check-tags.mjs` 通过，禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

关系检查清理后状态：

- Signal -> Opportunity：29/29 (100%)
- Opportunity -> Signal：22/27 (81%)
- Opportunity -> Priority：22/27 (81%)
- 硬错误：0
- 软提醒：10

说明：清理后 5 张早期 Opportunity 不再被弱标签强行挂接 Signal，这是更真实的数据状态，应由后续 Priority / Signal 补充或降级观察处理。

## 自动化影响

本轮修改了 `sync-data.mjs` 的关系生成规则，会影响每日统一同步后的 Signal / Opportunity 关系结果。

影响判断：

- `ai-the-point`：不受影响。
- `ai-2`：不受影响，它只生成 Markdown。
- `ai-3`：受益于更严格的同步关系规则；无需改自动化入口，但后续报告中 Opportunity -> Signal 覆盖率可能低于旧版虚高状态。

自动化复核后已做最小更新：

- `ai-the-point`：不受影响，保持不变。
- `ai-2`：已补充“每条 Signal 只写一个主 Opportunity”的内容生成规则。
- `ai-3`：已补充 Signal -> Opportunity 主机会闸门和前台数量一致性检查口径。

后续解读 `relation-check` 时，需要接受“少量早期机会无 Signal 关系”作为真实软提醒。

## 追加：前台显示层确认

用户继续反馈网站页面仍显示 `19 个机会` 等旧数量后，补充检查发现：底层数据已收口，但 `04-Site/js/app.js` 的展示层仍会把历史机会名称、Opportunity 反向关系和赛道关系一起计入 `signalOpportunityLinks()`，导致栏目页和详情页重新扩成 10/19/27 个机会。

已补充修正：

- `signalOpportunityLinks()`：当 Signal 存在规范 `relatedOpportunityIds` 时，只按该主机会 ID 返回 Opportunity。
- `relatedOpportunityNames`、Opportunity 反向关系和赛道关系只保留为无规范 ID 时的兜底，不再影响已同步 Signal 的前台计数。
- `loadState()`：浏览器本地缓存中的旧 Signal-Opportunity 关系不得覆盖最新同步数据，避免用户端继续显示旧数量。

显示层验证：

- Signals 栏目页：29 张 Signal 卡片全部显示 `1 个机会`。
- Signal 详情页：`指向机会` 显示 `1 个`。
- Signal 详情页侧栏：Opportunity 卡片数量为 1 张。
- 模拟浏览器本地缓存仍保存旧多机会关系时，页面仍显示 `1 个机会`。
- `node --check 04-Site/js/app.js` 通过。
