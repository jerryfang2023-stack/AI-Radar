# WSD-20260505-01-column-detail-reading-system 派发单

日期：2026-05-05  
状态：ready  
调度窗口：当前调度中枢窗口  
牵头 Agent：`pm / ui-ue / copy / dev / qa`

## 1. 任务目标

将“一级栏目页排版规范统一”和“全站详情页 / 长文阅读排版规范”合并为一个大任务，并吸收原 `P1-4 / WSD-20260504-04-daily-brief-detail-productization`。

本任务目标是建立并落地一套可验收的前台阅读母版：

- 一级栏目页母版：Daily Brief、Signals、The Point、Opportunities、Trends。
- 详情页母版：Daily Detail、Signal Detail、Opportunity Detail、Trend Detail、The Point Detail。
- 长文阅读母版：Point Source 素材全文页，以及后续可承载长文、译文、来源说明的页面。

最终效果：所有栏目页和详情 / 长文页看起来像同一个高端商业情报产品，不像不同阶段拼出来的页面、后台组件堆叠或字段卡片集合。

## 2. 非目标

- 不新增前台栏目。
- 不新增数据字段。
- 不改 Markdown 内容源命名、frontmatter 或自动化生成口径。
- 不改同步脚本、关系检查脚本、统一同步闸门。
- 不重做首页首屏主视觉；首页右侧 Intelligence Desk 仍归 `P0-11`。
- 不处理正式上线、权限、备份、回滚；这些归 `P0-4`。
- 不把 `P0-2B` failed 结果作为视觉基础。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| PM Agent | 合并原 P1-4 范围，定义栏目页 / 详情页 / 长文页的用户任务、范围、非目标和验收 |
| UI / UE Design Director | 基于 DESIGN v2 输出栏目页母版、详情页母版、长文阅读母版和页面规范表 |
| Copy Agent | 输出栏目标题、详情页 H1、侧栏、CTA、空状态、禁用语和判断边界规范 |
| Dev Agent | 按 UI/UE 与 Copy 规范落地页面结构和样式 |
| QA / Acceptance Agent | 做桌面 / 移动截图、字号 / 间距 / 溢出 / 禁用语验收 |
| Workflow / Automation Agent | 记录收口、自动化影响、后续 P0-5 截图矩阵衔接 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260505-01-column-detail-reading-system.md`
5. `agent-workflow/execution/WSD-20260504-04-daily-brief-detail-productization.md`
6. `agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md`
7. `agent-workflow/reports/site-ui-design-direction-2026-05-04.md`
8. `agent-workflow/reports/site-module-design-review-2026-05-04.md`
9. `agent-workflow/product/DESIGN.md`
10. `agent-workflow/product/COPY.md`
11. `agent-workflow/prd/active/PRD-001-daily-brief.md`
12. `agent-workflow/prd/active/PRD-002-signals-system.md`
13. `agent-workflow/prd/active/PRD-003-opportunities-engine.md`
14. `agent-workflow/prd/active/PRD-004-trends-model.md`

## 5. 允许改动范围

页面：

- `04-Site/daily.html`
- `04-Site/daily-detail.html`
- `04-Site/signals.html`
- `04-Site/signal.html`
- `04-Site/the-point.html`
- `04-Site/point-daily.html`
- `04-Site/point.html`
- `04-Site/point-source.html`
- `04-Site/opportunities.html`
- `04-Site/opportunity.html`
- `04-Site/trends.html`
- `04-Site/trend.html`

样式与前端逻辑：

- `04-Site/css/styles.css`
- `04-Site/js/app.js`

报告：

- `agent-workflow/reports/WSD-20260505-01-column-detail-reading-system-closeout.md`
- 必要截图：`agent-workflow/reports/WSD-20260505-01-*.png`

## 6. 禁止改动范围

- 不改内容源 Markdown。
- 不改 `04-Site/data/`，除非执行窗口说明必须先运行同步验证；不得手写数据。
- 不改 `04-Site/scripts/sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`。
- 不改 `agent-workflow/tools/unified-site-sync.mjs`。
- 不改自动化任务配置或提示词。
- 不改 Netlify 配置。
- 不改 Admin 页面，除非只是确保普通前台不出现 Admin 痕迹；Admin 完整 QA 归 `P0-6`。
- 不使用 P0-2A / P0-2B 成果作为成功视觉基础。

## 7. 需求梳理

### 7.1 一级栏目页排版规范统一

覆盖页面：

- `daily.html`
- `signals.html`
- `the-point.html`
- `opportunities.html`
- `trends.html`

必须统一：

- 栏目标题区位置、宽度、字号、行高、顶部留白和首屏节奏。
- 栏目页 H1 必须是一句话价值表达，不追加解释型副标题。
- 栏目标题区背景默认与页面背景一致，不加突兀色块或装饰块。
- command bar / 筛选区位置和密度。
- 主列表 / 主卡组的网格、卡片内边距、行距、标题层级。
- 侧栏使用边界：只做补充，不抢主阅读。
- 空状态、加载状态、无结果状态。

栏目差异保留：

- Daily Brief：像每日商业内参入口，不像日期列表。
- Signals：像商业信号检索台，不像后台仪表盘。
- The Point：强调共识、分歧、边界，不像观点归档。
- Opportunities：像机会库和验证序列，不像排行榜。
- Trends：像趋势阶段观察，不像趋势词卡片墙。

### 7.2 全站详情页阅读母版

覆盖页面：

- `daily-detail.html`
- `signal.html`
- `opportunity.html`
- `trend.html`
- `point.html`

必须统一：

- 详情页 H1 / eyebrow / meta / 来源 / 主判断的位置和层级。
- 主正文宽度建议 `760-860px`，右侧摘要 / 来源 / 关联建议 `320-380px`。
- 正文行高建议 `1.7-1.85`，中文长文阅读不拥挤。
- 右侧侧栏只承接摘要、来源、关联，不重复主正文。
- 引用类内容只出现一次；顶部作为主引用时，正文不重复同一段。
- 关联 Signals / Opportunities / Trends / Points 不做卡片堆叠。
- 普通前台不出现 Admin、JSON、同步、编辑、恢复、字段、后台等痕迹。

详情页差异保留：

- Daily Detail：今日主线、关键 Signals、机会观察、趋势观察，避免行动指令。
- Signal Detail：事实、来源、商业含义、机会拆解，避免写成新闻详情。
- Opportunity Detail：机会定义、适用客户、证据等级、相关 Signals / Trends，标题不写公司名。
- Trend Detail：趋势阶段、证据阶梯、反证和风险，不写成热词百科。
- Point Detail：人物 / 机构观点、原始观点转述、观澜解读和边界，不写成社媒归档。

### 7.3 长文阅读母版

覆盖页面：

- `point-source.html`
- 后续可复用到全文文档、全文译文、素材来源页。

必须统一：

- 长文正文区域比普通详情页更安静，建议主栏 `720-820px`。
- 标题、来源、授权状态、全文 / 译文切换清晰但克制。
- 正文段落行距舒适，段间距稳定。
- 长引用、列表、小标题、译文说明有明确层级。
- 来源与版权说明弱化，不压过正文。
- 移动端优先单列阅读，不出现横向溢出。

### 7.4 Daily Brief 详情页并入要求

原 `P1-4` 不再单独执行，其需求并入本任务：

- Daily Brief 详情页必须更像每日商业内参，而不是内容列表或后台信息页。
- 今日主线必须清楚。
- 主 Signal 阅读区必须比侧栏更强。
- 机会和趋势只做摘要，不抢主阅读。
- 文案避免行动指令，不替用户下最终经营、投资或合作判断。

## 7A. 页面类任务硬性要求

本任务属于页面类 + 文案类任务。缺少以下任一项，调度中枢不得标记 accepted。

### 7A.1 UI/UE 页面规范表

执行窗口必须先输出三张页面规范表：

1. 一级栏目页规范表。
2. 详情页阅读母版规范表。
3. 长文阅读母版规范表。

每张表至少包含：

- 页面类型。
- 页面目标：用户 5 秒内应理解什么。
- 设计基准：必须引用 DESIGN v2 / 商业情报桌面。
- 布局基准：容器宽度、标题位置、模块起点、网格结构。
- 字体层级：H1 / H2 / 卡片标题 / 正文 / meta / CTA。
- 间距基准：标题区、模块间距、卡片内边距、列表行距、正文段距。
- 组件克制规则。
- 前台 / Admin 边界。
- 桌面端验收点。
- 移动端验收点。
- 禁止项。

### 7A.2 Copy 文案规范表

Copy Agent 必须输出：

- 栏目页标题和模块标题规范。
- 详情页 H1 / eyebrow / meta / 来源 / CTA 规范。
- 长文页全文 / 译文 / 来源与版权说明规范。
- 禁用语检查。
- 判断边界检查。
- 标题长度与容器适配。
- QA 文案验收点。

### 7A.3 Dev 按表实现

Dev Agent 必须逐条说明：

- UI/UE 规范表中哪些条目已实现。
- Copy 文案规范表中哪些条目已实现。
- 哪些未实现及原因。
- 是否新增临时样式或偏离 DESIGN v2。
- 是否影响其他页面、Admin 模块、移动端或自动化。

### 7A.4 QA 独立验收

QA 必须至少提供：

- 一级栏目页桌面截图：Daily、Signals、The Point、Opportunities、Trends。
- 详情页桌面截图：Daily Detail、Signal、Opportunity、Trend、Point。
- 长文页桌面截图：Point Source。
- 移动端抽查截图：至少栏目页 2 张、详情页 2 张、长文页 1 张。
- 无横向溢出检查。
- 标题位置 / 字号 / 行高 / 模块起点验收。
- 禁用语和前台后台边界检查。

## 8. 必跑检查

- [ ] `node --check 04-Site/js/app.js`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] 浏览器桌面截图检查
- [ ] 浏览器移动端截图检查
- [ ] 首页以外关键页面无横向溢出检查
- [ ] 前台禁用语检查

如执行窗口运行同步或关系检查，必须说明原因。默认不需要改数据。

## 9. 自动化影响

- `ai-the-point`：默认不影响。
- `ai-2`：默认不影响。
- `ai-3`：默认不影响。

只改展示层和文案时不影响自动化。若执行窗口发现必须改 Markdown 字段、同步脚本或自动化提示词，必须停止并回到调度中枢确认。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260505-01-column-detail-reading-system.md
5. agent-workflow/execution/WSD-20260504-04-daily-brief-detail-productization.md
6. agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md
7. agent-workflow/reports/site-ui-design-direction-2026-05-04.md
8. agent-workflow/product/DESIGN.md
9. agent-workflow/product/COPY.md

你是本任务的独立执行窗口，由 PM Agent、UI / UE Design Director、Copy Agent、Dev Agent、QA / Acceptance Agent 协作。

任务目标：
把一级栏目页排版规范统一、全站详情页 / 长文阅读排版规范、原 P1-4 Daily Brief 详情页产品化合并为一个大任务并落地。

严格边界：
- 不新增栏目。
- 不改内容源 Markdown。
- 不改数据字段、同步脚本、统一同步闸门或自动化任务。
- 不重做首页首屏主视觉；首页右侧 Intelligence Desk 归 P0-11。
- 不把 P0-2B failed 结果作为基础。

必须输出并落地：
1. 一级栏目页规范表。
2. 详情页阅读母版规范表。
3. 长文阅读母版规范表。
4. Copy 文案规范表。
5. Dev 按表实现说明。
6. QA 桌面 / 移动端截图和验收。

完成后生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260505-01-column-detail-reading-system-closeout.md

完成后回到调度中枢窗口汇报：
收口：agent-workflow/reports/WSD-20260505-01-column-detail-reading-system-closeout.md
```
