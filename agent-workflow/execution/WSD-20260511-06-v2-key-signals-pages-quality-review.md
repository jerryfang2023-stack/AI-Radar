# WSD-20260511-06-v2-key-signals-pages-quality-review 派发单

日期：2026-05-11  
状态：ready  
派发模式：formal_task / independent_review  
看板编号：V2-KEY-SIGNALS-QA  
牵头 Agent：QA / Acceptance Agent  
协作 Agent：UI / UE Agent / Copy Agent / PM Agent / Intelligence Data Agent / Workflow Agent  
Skill：`agent-workflow/governance/page-copy-quality-review-skill.md`

## 1. 执行窗口身份

你是独立质检窗口，不是页面开发窗口，不是文案开发窗口，也不是调度中枢。

本任务只做评审、打分、指出问题和输出修改指令。不得直接修改页面代码、内容文件、VI 文件、站点数据或自动化脚本。

## 2. 任务目标

对观澜AI V2 的“关键信号 / 商业信号”页面体系做一次完整页面与文案质检，判断这些页面是否真正符合观澜AI定位：

```text
面向商业决策者的 AI 机会判断系统
从 AI 热点中筛出商业信号，从信号形成判断，从判断发现机会
```

这次质检不是检查页面能不能打开，也不是只看是否美观，而是重点判断：

1. 是不是观澜AI，而不是普通 AI 新闻站、AI 工具导航、卡片墙或资讯列表。
2. 有没有商业判断，而不是只展示新闻摘要。
3. 文案像不像真人写的，是否有 AI 模板味、机械分点、空泛正确。
4. 页面能不能让企业经营者、资源型合伙人或行业操盘手产生信任。
5. 信号、Front Signal、Structured Signal、Builders 观点之间的关系是否清楚。

## 3. 启动读取

先读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. `agent-workflow/execution/WSD-20260511-06-v2-key-signals-pages-quality-review.md`
4. `agent-workflow/governance/page-copy-quality-review-skill.md`

补读：

1. `agent-workflow/product/DESIGN.md`
2. `agent-workflow/product/COPY.md`
3. `agent-workflow/product/signal-system.md`
4. `docs/brand/wavesight-ai-vi/USAGE.md`
5. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
6. `docs/brand/wavesight-ai-vi/brand-tokens.css`

开发 / 阶段性收口参考：

1. `agent-workflow/reports/WSD-20260510-key-signals-compression-closeout.md`
2. `agent-workflow/reports/WSD-20260511-front-signal-report-closeout.md`
3. `agent-workflow/reports/WSD-20260511-structured-signal-card-closeout.md`
4. `agent-workflow/reports/WSD-20260511-builder-perspective-system-closeout.md`

如上述任一 closeout 不存在，记录为材料缺口，但仍可对现有页面做质检；不得伪造不存在的验收证据。

## 4. 质检对象

检查页面：

1. `01-SiteV2/site/signals.html`：关键信号栏目页。
2. `01-SiteV2/site/signal-detail.html`：Front Signal / 重点信号详情页。
3. `01-SiteV2/site/structured-signal.html`：常规结构化信号详情页。
4. `01-SiteV2/site/builders.html`：Builders 观点入口页。
5. `01-SiteV2/site/builder-detail.html`：Builder 观点详情页。

页面类型：

- 一级栏目页
- 信号详情页
- 判断资产详情页
- Builders 观点页

本次检查范围：

- 定位一致性
- 信息架构
- 商业判断
- 文案自然度
- 视觉体验
- 页面节奏
- 可信度
- 转化路径
- 信号系统关系表达
- 公开前台边界
- 桌面端优先体验

不检查范围：

- 移动端专项设计
- Netlify 部署
- GitHub 发布
- 每日自动化任务本体
- 内容 schema 改造
- 真实数据抓取质量
- `09-ai-news-radar/`

## 5. 必查问题

本次必须回答：

1. `signals.html` 第一屏是否能让用户马上理解“为什么这些是商业信号”。
2. 是否把新闻、信号、判断、机会之间的关系讲清楚。
3. Front Signal 详情页是否有足够强的“发生了什么 / 为什么重要 / 影响谁 / 机会在哪里 / 风险边界”。
4. Structured Signal 是否只是结构化卡片，还是有清楚的商业解释。
5. Builders 页面是否像“观点校准与早期信号输入”，而不是普通 KOL 聚合页。
6. Builder 详情页是否体现观点来源、边界和可迁移判断。
7. 页面是否存在 AI 味、模板句式、空泛概括、营销感或内部流程语言。
8. 页面是否出现 Admin、JSON、同步、字段、后台、编辑、恢复等普通前台不应出现的痕迹。
9. 页面模块是否过多、重复、卡片墙化、主次不清。
10. 信号和机会、内参、趋势背景之间的下一步路径是否克制、清楚。

## 6. 七维评分

按 7 个维度打分，每项 10 分，总分 70 分：

1. 定位一致性
2. 信息架构
3. 商业判断
4. 文案自然度
5. 视觉体验
6. 页面节奏
7. 可信度

转化路径不计入总分，但必须单独输出建议。

硬闸门：

- `accepted`：总分不少于 58 / 70，且定位一致性、商业判断、文案自然度、可信度均不低于 8，其他维度不低于 7。
- `needs-revision`：总分 49-57，或任一非核心维度为 6，必须退回修改。
- `failed`：总分低于 49，或定位一致性 / 商业判断 / 文案自然度 / 可信度任一项低于 7，必须重做关键模块。
- `needs-input`：缺少必要页面、核心规范或无法访问页面，无法独立质检。

## 7. 输出要求

质检报告保存为 UTF-8 Markdown：

```text
agent-workflow/reports/WSD-20260511-06-v2-key-signals-pages-quality-review-closeout.md
```

报告必须包含：

### 1. 总体判断

一句话说明商业信号页面体系是否符合观澜AI定位，以及最大问题。

### 2. 页面级结论

| 页面 | 结论 | 最大问题 | 是否建议进入修改 |
|---|---|---|---|
| `signals.html` |  |  |  |
| `signal-detail.html` |  |  |  |
| `structured-signal.html` |  |  |  |
| `builders.html` |  |  |  |
| `builder-detail.html` |  |  |  |

### 3. 七维评分

| 维度 | 得分 | 理由 |
|---|---:|---|
| 定位一致性 |  |  |
| 信息架构 |  |  |
| 商业判断 |  |  |
| 文案自然度 |  |  |
| 视觉体验 |  |  |
| 页面节奏 |  |  |
| 可信度 |  |  |
| 总分 |  |  |
| 结论 |  |  |

### 4. 主要问题

列出 3-7 个最影响页面质量的问题，按优先级排序。

### 5. 模块级优化建议

按页面模块逐项指出：保留、合并、弱化、删除、重写或强化。

### 6. 文案改写建议

必须指出具体原文或页面位置，并给出替换版本。不能只写“文案需要更高级”。

### 7. 视觉与节奏建议

指出视觉重复、卡片墙、主次不清、留白不足、标题层级不统一、内参感不足等问题，并给出改法。

### 8. 信号系统关系建议

说明 Signal、Front Signal、Structured Signal、Builders、Opportunity、Business Brief 之间的关系表达是否清楚，以及如何优化。

### 9. 转化路径建议

指出用户从信号页下一步应该去哪里：机会解码、商业内参、Builder 来源、趋势背景或账户页。要求克制，不得过早销售。

### 10. Codex 执行指令

整理一段可直接交给 Codex 执行的修改提示词。

## 8. 收口登记

完成后向 `agent-workflow/inbox/closeout-queue.jsonl` 追加登记：

```json
{"task_id":"WSD-20260511-06-v2-key-signals-pages-quality-review","board_id":"V2-KEY-SIGNALS-QA","closeout_path":"agent-workflow/reports/WSD-20260511-06-v2-key-signals-pages-quality-review-closeout.md","status":"ready_for_review","created_at":"<YYYY-MM-DDTHH:mm:ss+08:00>","owner":"qa","conclusion":"<accepted|needs-revision|failed|needs-input>"}
```

## 9. 禁止事项

- 不得修改 `01-SiteV2/site/`、`01-SiteV2/content/`、`01-SiteV2/knowledge/`、`docs/brand/wavesight-ai-vi/`、`09-ai-news-radar/` 或 `10-Archive/`。
- 不得把页面可打开、语法通过、截图存在等同于观澜AI页面质量通过。
- 不得泛泛输出“提升高级感”，必须给出具体模块问题、文案替换版本和可执行修改指令。
- 不得继承 `V2-SITE-QUALITY-AUTO` 的失败成果或 `local-site-quality-pass` 结论。

## 10. 独立窗口短提示词

```text
你是观澜AI V2 商业信号 / 关键信号页面体系独立质检窗口。

任务 ID：WSD-20260511-06-v2-key-signals-pages-quality-review
派发单：agent-workflow/execution/WSD-20260511-06-v2-key-signals-pages-quality-review.md

请先读取：
1. AGENTS.md
2. agent-workflow/governance/current-context.md
3. agent-workflow/execution/WSD-20260511-06-v2-key-signals-pages-quality-review.md
4. agent-workflow/governance/page-copy-quality-review-skill.md

只做独立质检，不修改代码。

重点质检页面：
- 01-SiteV2/site/signals.html
- 01-SiteV2/site/signal-detail.html
- 01-SiteV2/site/structured-signal.html
- 01-SiteV2/site/builders.html
- 01-SiteV2/site/builder-detail.html

核心判断：
- 这些页面是不是观澜AI，而不是普通 AI 新闻站、卡片墙或 KOL 聚合页？
- 有没有商业判断，而不是只展示新闻摘要？
- 文案像不像真人写的，是否有 AI 味和模板感？
- 页面能不能让企业经营者、资源型合伙人或行业操盘手产生信任？
- Signal / Front Signal / Structured Signal / Builders / Opportunity / Business Brief 的关系是否清楚？

输出七维评分、页面级问题、模块级优化建议、文案替换版本和 Codex 执行指令。

保存 closeout：
agent-workflow/reports/WSD-20260511-06-v2-key-signals-pages-quality-review-closeout.md

并登记 closeout queue。
```
