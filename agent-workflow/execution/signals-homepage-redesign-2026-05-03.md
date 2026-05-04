---
title: Signals Homepage Redesign Execution
date: 2026-05-03
status: assigned
owner: PM Agent
agents:
  - UI / UE Agent
  - Copy Agent
  - Dev Agent
  - QA / Acceptance Agent
related_prd: agent-workflow/prd/active/PRD-007-signals-homepage-redesign.md
---

# Signals 首页改版执行任务单

## 1. 本轮目标

把 Signals 首页从“左侧列表 + 右侧详情”的工作台感，推进为面向客户的“证据雷达页”。

本轮先分配 UI / UE Agent 和 Copy Agent 的工作，形成 Dev Agent 可执行的页面方案与文案方案。

## 2. 当前判断

当前 Signals 页面已经具备基础浏览、筛选、详情和来源链接能力，但首页价值表达不足：

- 缺少日期维度，历史 Signals 堆在一起。
- 列表信息层级偏平，客户需要点开详情才知道证据强度和商业含义。
- 变化类型、证据强度、Opportunity / Trend 关联没有形成前台筛选路径。
- 页面容易被误解为新闻列表，而不是判断系统的证据入口。

## 3. UI / UE Agent 任务

### 3.1 必读文件

- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/prd/active/PRD-007-signals-homepage-redesign.md`
- `agent-workflow/reports/pm-signals-homepage-redesign-proposal-2026-05-03.md`
- `04-Site/signals.html`
- `04-Site/js/app.js`
- `04-Site/css/styles.css`

### 3.2 设计参考

本轮使用：

```text
frontend-design + Bloomberg/FT 内参式阅读 + Linear 信息密度
```

方向解释：

- Bloomberg / FT：用于日期、要闻、证据、来源的阅读层级。
- Linear：用于筛选、卡片、状态标签的清晰边界和中等信息密度。
- 观澜AI既要像商业内参，又要可筛选、可复盘、可继续追踪。

### 3.3 交付物

UI / UE Agent 需要输出：

- Signals 首页桌面端结构图。
- Signals 首页移动端结构图。
- 顶部 3 指标区组件规则。
- 日期分组组件规则。
- 变化类型筛选组件规则。
- Signal 卡片组件规则。
- 详情预览组件规则。
- 空状态、无来源、无关联 Opportunity / Trend 的降级展示规则。
- 截图验收清单。

### 3.4 页面结构要求

建议结构：

1. 一行式栏目标题。
2. 顶部 3 指标区：今日信号 / 强证据 / 已关联判断。
3. 筛选区：日期、变化类型、证据强度、赛道、关联状态。
4. 日期分组列表：今日、昨日、本周、更早，或真实日期分组。
5. Signal 卡片：标题、变化类型、证据强度、商业含义、关联机会/趋势、原始来源入口。
6. 详情预览：要闻、为什么这是 Signal、证据与来源、指向的 Opportunity、关联 Trend、机会拆解入口。

### 3.5 移动端要求

- 日期分组必须保留。
- 筛选项可横向滚动或折叠为紧凑控件。
- Signal 卡片不能因标签过多导致文字拥挤。
- 详情预览在移动端应转为下方展开，不强行双栏。
- 页面不出现横向溢出。

### 3.6 UI 禁止项

- 不做新闻瀑布流。
- 不做公司榜单。
- 不把 Score 做成普通用户主视觉排行榜。
- 不把 Tags 做成一线栏目。
- 不在普通前台展示 Admin、JSON、同步、编辑、恢复等后台痕迹。
- 不做卡片套卡片。

## 4. Copy Agent 任务

### 4.1 必读文件

- `agent-workflow/agents/copy-agent.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/prd/active/PRD-007-signals-homepage-redesign.md`
- `agent-workflow/reports/pm-signals-homepage-redesign-proposal-2026-05-03.md`

### 4.2 交付物

Copy Agent 需要输出：

- 页面标题最终建议。
- 顶部 3 指标标签。
- 筛选控件标签。
- 日期分组标签。
- Signal 卡片字段名。
- 详情预览模块名。
- 原始来源入口文案。
- 空状态文案。
- 禁用语检查结果。

### 4.3 推荐文案方向

页面标题：

> 从 AI 变化中，筛出商业信号

顶部指标：

- 今日信号
- 强证据
- 已关联判断

筛选项：

- 日期
- 变化类型
- 证据强度
- 赛道
- 关联状态

卡片字段：

- 变化类型
- 证据
- 商业含义
- 指向机会
- 关联趋势
- 原始来源

详情模块：

- 要闻
- 为什么这是 Signal
- 证据与来源
- 指向的 Opportunity
- 关联 Trend
- 机会拆解

空状态：

- 暂无符合条件的 Signal
- 当前筛选下还没有形成可展示的商业信号
- 暂无已关联机会
- 暂无已关联趋势
- 暂未识别到可跳转的原始来源

### 4.4 文案边界

必须避免：

- 新闻列表
- 热点推荐
- 必须行动
- 立即验证
- 确定机会
- 投资建议
- Markdown
- JSON
- 同步脚本
- 自动沉淀
- 后台字段

Copy Agent 要把内部字段翻译成客户利益，不把内部流程写给前台用户。

## 5. Dev Agent 后续接手条件

Dev Agent 只有在以下内容明确后进入实现：

- UI / UE Agent 已确认桌面端和移动端结构。
- Copy Agent 已确认所有可见文案。
- PM Agent 确认 P0 不新增 Markdown 必填字段。
- Intelligence Data Agent 确认现有 `eventTypes`、`sourceTier`、`relatedOpportunityIds`、`relatedTrendIds` 可支撑展示。

## 6. QA 验收要点

QA / Acceptance Agent 后续重点检查：

- 未登录用户、试读用户、会员、管理员四种状态。
- 普通前台无后台痕迹。
- 日期分组能正常展示和筛选。
- 变化类型筛选只使用标准 8 类。
- 原始来源链接可跳转，历史残留重复链接已清理。
- 移动端无横向溢出，卡片字段不拥挤。
- 用户不点详情也能理解每条 Signal 的商业含义和证据强度。

## 7. 自动化影响判断

本任务当前阶段只分配 UI 和文案工作，不修改 Markdown 结构、同步脚本、自动化运行顺序或数据字段。

结论：当前分配动作不影响 `ai-the-point`、`ai-2`、`ai-3` 三个自动化任务。

如果 Dev 实现阶段修改 `sync-data.mjs` 输出结构，必须重新做自动化影响检查。
