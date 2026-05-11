# WSD-20260511-07-v2-key-signals-pages-revision 派发单

日期：2026-05-11  
状态：ready  
派发模式：formal_task / desktop_first / revision_from_quality_review  
看板编号：V2-KEY-SIGNALS-REVISION  
牵头 Agent：Dev Agent + UI / UE Agent + Copy Agent  
协作 Agent：PM Agent / Intelligence Data Agent / QA Agent / Workflow Agent  
来源质检：`WSD-20260511-06-v2-key-signals-pages-quality-review`  

## 1. 任务目标

根据独立质检报告 `agent-workflow/reports/WSD-20260511-06-v2-key-signals-pages-quality-review-closeout.md`，返修观澜AI V2 商业信号 / 关键信号页面体系。

本任务目标不是大改产品结构，而是把当前页面从“方向可用但仍像观点聚合 / 字段系统”推进到真正符合观澜AI定位：

```text
面向商业决策者的 AI 机会判断系统
信号不是新闻摘要，而是客户、流程、预算和风险边界正在变化的早期迹象
```

## 2. 启动读取

先读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. `agent-workflow/execution/WSD-20260511-07-v2-key-signals-pages-revision.md`
4. `agent-workflow/reports/WSD-20260511-06-v2-key-signals-pages-quality-review-closeout.md`

补读：

1. `agent-workflow/product/DESIGN.md`
2. `agent-workflow/product/COPY.md`
3. `agent-workflow/product/signal-system.md`
4. `docs/brand/wavesight-ai-vi/USAGE.md`
5. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
6. `docs/brand/wavesight-ai-vi/brand-tokens.css`

禁止继承：

- `V2-SITE-QUALITY-AUTO` 的失败成果。
- `local-site-quality-pass` 结论。
- 普通 KOL 聚合页、新闻列表、卡片墙或后台字段页做法。

## 3. 修改范围

允许修改：

1. `01-SiteV2/site/signals.html`
2. `01-SiteV2/site/signal-detail.html`
3. `01-SiteV2/site/structured-signal.html`
4. `01-SiteV2/site/builders.html`
5. `01-SiteV2/site/builder-detail.html`
6. `01-SiteV2/site/assets/styles.css`
7. `01-SiteV2/site/assets/app.js`
8. `agent-workflow/reports/WSD-20260511-07-v2-key-signals-pages-revision-closeout.md`
9. `agent-workflow/inbox/closeout-queue.jsonl`

禁止修改：

1. `docs/brand/wavesight-ai-vi/`
2. `01-SiteV2/content/`
3. `01-SiteV2/knowledge/`
4. `agent-workflow/tools/`
5. 自动化任务
6. Netlify / GitHub 配置
7. `09-ai-news-radar/`
8. `10-Archive/`

如执行中发现必须修改内容 schema、自动化或真实数据入库逻辑，停止并回调度窗口。

## 4. 必须修复的问题

### A. Builders 体系可信度

必须修复：

- `builders.html` 不能像 KOL / source 聚合页。
- `builder-detail.html` 首屏 H1 不得直接是 `x.com`。
- 不得用 `x.com`、`sierra.ai`、`prnewswire.com` 等域名作为人物身份主标题。
- 无法识别人物时，使用：

```text
公开观点来源：x.com 线索组
```

并说明：

```text
身份待补，不作为个人背书。
```

Builders 观点必须表达为：

```text
观点只用来校准判断，不能替代一手事实来源。
```

### B. 英文 / 内部字段式标签

减少或改写以下标签：

- `SOURCE LEDGER`
- `FACT LEDGER`
- `VIEW STREAM`
- `RELATED LINKS`
- `SIGNAL STATUS`
- `UPGRADE WATCH`
- `Commercial Variables`
- `Risk Boundary`

原则：

- 只保留少量必要英文报告编号。
- 页面主体模块改成中文商业内参表达。
- 不要把公开前台写成内部生产系统。

### C. Structured Signal 来源事实

`structured-signal.html` 的“来源与关键事实”不能三条重复模板句。必须写出来源差异，例如：

- 融资规模
- 客户采用
- 产品定位
- 外部反证
- 监管 / 平台限制
- 交付成本

把“是否升级为深度信号？”改为：

```text
还差哪些证据
```

### D. 信号系统关系

必须让用户看懂：

- Structured Signal 何时升级为 Front Signal。
- Front Signal 何时进入 Opportunity。
- Business Brief 何时引用多条信号形成周期判断。
- Builders 观点只校准，不直接提高事实权重。

建议加入关系说明：

```text
关键信号不是结论。多条信号持续指向同一客户、流程或预算变化时，才会进入机会解码；当这些变化形成周期性组合判断，才会进入商业内参。
```

### E. 裸 URL 和资料库感

`builder-detail.html` 的相关内容区不得露出裸 URL 摘要。应改成来源摘要和判断关系。

### F. 页面节奏

减少后半页卡片墙感：

- Builders 页首屏下方先放“这组观点校准了什么”，再放观点卡。
- Builder Detail 时间线默认减少到 3 条重点观点，其余弱化或折叠。
- Signals 底部关系入口压缩为“信号 -> 机会 -> 内参”的关系条，不堆卡片。

## 5. 建议文案替换

优先采用质检报告中的替换建议，包括但不限于：

### `signals.html` 副标题

```text
只保留那些已经碰到客户、流程、预算或风险边界的 AI 变化。
```

### `signals.html` 证据模块

```text
这条信号站得住吗
先看它来自哪里，再看还缺哪类客户和付费证据。
```

### `signal-detail.html` 事实模块

```text
这些事实决定它是普通发布，还是值得进入后续观察的商业信号。
```

### `structured-signal.html`

```text
还差哪些证据
它已经指向真实流程变化，但客户续约、交付成本和平台挤压还没有被充分验证。
```

### `builders.html`

```text
观点只用来校准判断。真正决定权重的，仍是客户采用、产品落地和一手材料。
```

### `builder-detail.html`

```text
公开观点来源：x.com 线索组
这些内容只说明观点如何变化。是否提高判断权重，还要看公司公告、客户采用、财务数据和监管材料。
```

## 6. 验收要求

必须完成：

1. 桌面端检查 5 个页面：
   - `signals.html`
   - `signal-detail.html`
   - `structured-signal.html`
   - `builders.html`
   - `builder-detail.html`
2. 生成桌面截图或浏览器检查证据。
3. 检查无横向溢出。
4. 检查公开前台无 Admin、JSON、同步、字段、后台、编辑、恢复等后台痕迹。
5. 检查 Builders 页不再像普通 KOL 聚合页。
6. 检查 `builder-detail.html` 不再以裸域名作为身份主标题。
7. 检查 Structured Signal 来源事实不再是重复模板句。
8. 运行：

```powershell
node --check 01-SiteV2/site/assets/app.js
node agent-workflow/tools/run-quality-gates.mjs syntax
```

完成后，本任务不得自称最终 accepted；必须写 `ready_for_independent_review`，由调度窗口再次派发独立质检。

## 7. 收口文件

保存 UTF-8 closeout：

```text
agent-workflow/reports/WSD-20260511-07-v2-key-signals-pages-revision-closeout.md
```

closeout 必须包含：

1. 修改文件列表。
2. 对照 `WSD-20260511-06` 质检问题的逐项修复说明。
3. 每个页面的修改摘要。
4. 文案替换清单。
5. 桌面截图 / 浏览器检查证据。
6. 质量检查结果。
7. 未解决问题和风险。
8. 是否准备进入再次独立质检。

并向 `agent-workflow/inbox/closeout-queue.jsonl` 追加登记。

## 8. 独立窗口短提示词

```text
你是观澜AI V2 商业信号 / 关键信号页面返修执行窗口。

任务 ID：WSD-20260511-07-v2-key-signals-pages-revision
派发单：agent-workflow/execution/WSD-20260511-07-v2-key-signals-pages-revision.md

请先读取：
1. AGENTS.md
2. agent-workflow/governance/current-context.md
3. agent-workflow/execution/WSD-20260511-07-v2-key-signals-pages-revision.md
4. agent-workflow/reports/WSD-20260511-06-v2-key-signals-pages-quality-review-closeout.md

按质检报告返修这 5 个页面：
- 01-SiteV2/site/signals.html
- 01-SiteV2/site/signal-detail.html
- 01-SiteV2/site/structured-signal.html
- 01-SiteV2/site/builders.html
- 01-SiteV2/site/builder-detail.html

核心修复：
- Builders 不再像 KOL 聚合页。
- builder-detail 不用 x.com 等裸域名当身份标题。
- 减少英文和内部字段式标签。
- Structured Signal 来源事实写出真实差异，不再重复模板句。
- 讲清 Signal / Front Signal / Structured Signal / Builders / Opportunity / Business Brief 的关系。
- 减少卡片墙感和资料库感。

不得修改 VI、内容生产线、自动化、Netlify/GitHub 配置、09-ai-news-radar 或 10-Archive。

完成后运行 app.js 语法检查和 syntax gate，写 closeout：
agent-workflow/reports/WSD-20260511-07-v2-key-signals-pages-revision-closeout.md

并登记 closeout queue。完成后只标记 ready_for_independent_review，不得自称最终 accepted。
```
