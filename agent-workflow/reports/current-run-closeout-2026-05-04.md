---
title: 2026-05-04 当前窗口收口报告
date: 2026-05-04
owner: Workflow / Automation Agent
status: completed
---

# 2026-05-04 当前窗口收口报告

## 本轮完成概览

本轮围绕 Signals 栏目页、Signal 详情页、Signal -> Opportunity 关系、前台文案与长期 agent 规范完成收口。

已完成：

- Signals 栏目页和详情页的“指向机会”数量已收口为主 Opportunity 口径。
- 29 条 Signal 底层数据全部各自指向 1 个主 Opportunity。
- 前台 Signals 栏目页 29 张卡片全部显示 `1 个机会`。
- Signal 详情页“指向机会”显示 `1 个`，侧栏 Opportunity 卡为 1 张。
- 已修正浏览器旧缓存可能覆盖最新关系的问题。
- 已将栏目标题位置、字号、背景、成品感要求写入 UI / UE 长期规范。
- 已将克制表达、禁止内部话术、不以说服为目标等要求写入 Copy 长期规范。
- 已复核并更新相关自动化任务。

## 关键代码与数据改动

- `04-Site/scripts/sync-data.mjs`
  - Signal -> Opportunity 从弱标签宽关联改为主机会关联。
  - Opportunity -> Signal 反向关系只来自评分项或显式关系，不再靠弱标签补齐。

- `04-Site/js/app.js`
  - `signalOpportunityLinks()` 在存在规范 `relatedOpportunityIds` 时，只按主 Opportunity ID 计数。
  - `loadState()` 不允许浏览器本地缓存中的旧 Signal-Opportunity 关系覆盖最新同步数据。

- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`
  - 已同步最新关系数据。

## 自动化影响与处理

已检查四个 automation 文件：

- `ai-the-point`：不受影响，保持不变。
- `ai-2`：受影响。已补充“每条 Signal 只写一个主 Opportunity”的内容生成规则。
- `ai-3`：受影响。已补充 Signal -> Opportunity 主机会闸门和前台数量一致性检查口径。
- `ai`：旧任务处于 `PAUSED`，不是当前三任务链路的一部分，未更新。

自动化更新结果：

- `ai-2` 继续只生成内容源，不运行网站同步。
- `ai-3` 继续统一同步网站，但会按主 Opportunity 口径检查关系与前台数量风险。

## UI / UE 规范沉淀

已更新：

- `AGENTS.md`
- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/product/DESIGN.md`

新增长期规则：

- 栏目页标题必须与其他一级栏目保持同一套位置、字号、行高和首屏节奏。
- 标题背景默认与页面背景一致，不随意加突兀色块。
- 页面不能粗糙、简陋、像模板页或像后台组件堆叠。
- 首屏必须有清楚主次，不让徽章、数字、按钮和摘要等权抢夺注意力。
- 用户反馈“粗糙、简陋、主次不明、占位过大、文案像内部话术”时，默认先修信息架构和阅读路径。

## Copy 规范沉淀

已更新：

- `AGENTS.md`
- `agent-workflow/agents/copy-agent.md`
- `agent-workflow/product/COPY.md`

新增长期规则：

- 公开前台文案写给客户，不写给内部团队。
- 不出现“本页用于”“入口”“同步”“字段”“后台”等内部产品话术。
- 文案只阐述信号、事实、来源和观察边界，不以说服别人为目标。
- Signals 前台避免“证据链、强证据、来源明确、阅读证据、机会确定、下一步验证”等表达。
- 优先使用“信源状态、单信源、多信源、来源与事实、支撑信息、查看信号”等克制表达。

## 验证结果

最新验证：

- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 10。
- `node 04-Site/scripts/check-tags.mjs` 通过，46 unique tags，禁用别名 0，未知公开标签 0。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，6 项检查全部通过。
- 页面渲染检查通过：Signals 栏目页 29 张 Signal 卡片均显示 `1 个机会`；Signal 详情页“指向机会”为 `1 个`，侧栏 Opportunity 卡为 1 张。
- 已模拟旧本地缓存，页面仍保持 `1 个机会`。

## 接手提醒

新窗口接手时优先读取：

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/progress.md`
4. `agent-workflow/reports/current-run-closeout-2026-05-04.md`
5. `agent-workflow/product/DESIGN.md`
6. `agent-workflow/product/COPY.md`

后续不要恢复：

- Signals 页面的右侧“当前选中”预览栏。
- Signal -> Opportunity 的弱标签宽关联。
- 前台“证据链 / 强证据 / 阅读证据 / 来源明确”等说服式表达。
- 栏目标题的突兀色块或不一致位置。

建议下一步：

- 对全站前台做一次 Copy Agent 语气审计，清理遗留内部话术。
- 对 Signals / Daily / Opportunities / Trends 做一次 UI / UE 截图矩阵验收，确保标题、首屏密度和详情页成品感一致。

## 编码规则补充

所有 handoff 文件和相关收口 Markdown 文件统一保存为 UTF-8。

适用范围：
- `docs/agent-handoff.md`
- `agent-workflow/progress.md`
- `agent-workflow/reports/*handoff*.md`
- `agent-workflow/reports/*closeout*.md`
- 其他用于新窗口恢复状态的交接、收口、阶段总结 Markdown 文件

Windows PowerShell 读取中文交接或收口文件时，优先显式使用 `-Encoding UTF8`。新增或更新 closeout 文件时，Workflow / Automation Agent 负责确认编码规则。
