---
title: PRD-007 Signals Homepage Redesign
date: 2026-05-03
status: active
owner: PM Agent
related:
  - agent-workflow/prd/active/PRD-002-signals-system.md
  - agent-workflow/reports/pm-signals-homepage-redesign-proposal-2026-05-03.md
  - agent-workflow/product/DESIGN.md
  - agent-workflow/product/COPY.md
---

# PRD-007 Signals 首页改版

## 1. 产品目标

Signals 首页从“信号列表”升级为“证据雷达页”。

目标用户进入页面后，应先看到某一时间段内 AI 商业变化的总体结构，再按日期、变化类型、证据强度和关联状态筛出值得继续阅读的 Signal，最后进入详情查看原始来源、机会拆解、相关 Opportunity 和 Trend。

Signals 不是新闻栏目，不是公司动态库，也不是工具目录。它是观澜AI判断系统里的证据入口。

## 2. 客户利益点

- 降噪：只呈现已经进入商业信号层的变化，不堆全量新闻。
- 提速：不点详情也能判断哪些 Signal 更值得看。
- 复盘：按日期回看某一天出现了哪些关键变化，并能回到对应 Daily Brief。
- 溯源：每条 Signal 保留原始来源入口，方便客户复核证据。
- 连接：从单条变化继续进入 Opportunity / Trend，形成判断链路。

## 3. P0 范围

P0 只做前台价值表达和筛选体验，不做复杂图谱。

必须包含：

- 顶部 3 个摘要指标。
- 日期分组视图，默认按日期倒序展示。
- 日期 / 时间范围筛选。
- 变化类型筛选，使用标准 `eventTypes`。
- Signal 卡片化列表。
- 卡片展示变化类型、证据强度、商业含义、关联 Opportunity / Trend、原始来源入口。
- 详情预览保留“要闻 / 为什么这是 Signal / 证据与来源 / 指向的 Opportunity / 关联 Trend / 机会拆解入口”。

不包含：

- 标签网络图。
- Signal 合并工作台。
- 后台编辑器重做。
- Score 排行榜主视觉。
- Admin、JSON、同步、编辑等后台痕迹。

## 4. 信息结构

### 4.1 页面标题

沿用一行式栏目标题，不添加解释型小字。

推荐标题：

> 从 AI 变化中，筛出商业信号

### 4.2 顶部摘要区

展示 3 个指标：

- 今日信号：当天 Signal 数。
- 强证据：S/A 或高证据 Signal 数。
- 已关联判断：已关联 Opportunity 或 Trend 的 Signal 数。

指标用于建立“雷达感”，不作为投资、经营或合作建议。

### 4.3 筛选区

P0 筛选项：

- 日期：今日 / 昨日 / 本周 / 更早 / 自定义区间。
- 变化类型：融资、客户采用、收入验证、产品发布、监管/政策、采购/招标、并购整合、平台数据。
- 证据强度：S / A / B / 其他。
- 赛道。
- 关联状态：已关联机会、已关联趋势。

### 4.4 日期分组

默认按日期倒序分组。

每个日期组展示：

- 日期。
- 当日 Signal 数。
- 当日主要变化类型。
- 当日最高证据等级。
- 当日关联 Opportunity / Trend 数量。

点击日期时，后续可回链到对应 Daily Brief。P0 可先预留入口，不强制新建 Daily Brief 反向链接能力。

### 4.5 Signal 卡片

每张卡片必须回答：

- 发生了什么事件？
- 这是什么变化类型？
- 证据强度如何？
- 为什么这不是普通新闻？
- 指向什么 Opportunity / Trend？
- 原始来源在哪里？

卡片字段建议：

- 标题：事件 + 商业含义。
- 变化类型。
- 证据强度。
- 商业含义。
- 关联 Opportunity / Trend。
- 原始来源入口。

## 5. 数据依赖

P0 优先使用现有数据字段，不新增 Markdown 必填字段。

依赖字段：

- `date`
- `title`
- `summary`
- `eventTypes`
- `sourceTier`
- `signalScore`
- `relatedOpportunityIds`
- `relatedTrendIds`
- `sourceUrl` 或正文解析出的原始来源链接
- `taxonomy.tags`

若 Dev Agent 发现当前网站数据缺少某个展示字段，应先用已有字段降级展示，并回报给 Intelligence Data Agent 评估是否需要新增字段。

## 6. Agent 分工

### PM Agent

- 维护本 PRD 和执行任务单。
- 控制 P0 / P1 边界。
- 决定哪些诉求进入本轮，哪些留到后续。

### UI / UE Agent

- 负责证据雷达页的信息结构、组件层级、桌面端和移动端布局。
- 必须使用 `frontend-design + Bloomberg/FT 内参式阅读 + Linear 信息密度` 作为本轮设计参考。
- 输出页面结构、组件规则、移动端行为和截图验收清单。

### Copy Agent

- 负责页面标题、指标标签、筛选标签、卡片字段、空状态和来源入口文案。
- 文案必须克制、有判断、有证据边界。
- 禁止把内部流程语写给普通用户。

### Dev Agent

- 在 UI / Copy 交付后实现 `signals.html`、`04-Site/js/app.js` 和必要 CSS。
- 不改变普通前台与 Admin 的边界。

### QA / Acceptance Agent

- 检查未登录、试读、会员、管理员四种状态。
- 检查桌面端和移动端无溢出、无后台痕迹、无空来源链接。

## 7. 验收标准

- 用户不点详情，也能判断哪些 Signal 更值得继续阅读。
- 用户能按日期复盘某一天的关键 Signals。
- 用户能按变化类型、赛道、证据强度和关联状态筛选。
- 每条卡片都能说明事件、证据、商业含义、关联机会或趋势。
- “要闻”里的原始来源链接独立展示，不混入正文重复堆叠。
- 页面不被误解为新闻站、工具站、公司动态库或后台工作台。
- 普通前台不出现 Admin、JSON、同步、编辑、恢复等后台痕迹。

## 8. 自动化影响

本 PRD 的 P0 改版默认只影响前台展示，不改变 Markdown 命名、字段结构、同步脚本入口或自动化运行顺序。

如果后续实现中需要新增必填字段、修改 `sync-data.mjs` 输出结构，必须先由 PM Agent 标记“可能影响自动化任务”，再交给 Workflow / Automation Agent 更新 `ai-the-point`、`ai-2`、`ai-3` 的任务说明或验证规则。
