# WSD-20260505-03-non-home-column-detail-reading-implementation 派发单

日期：2026-05-05  
状态：ready  
调度窗口：当前调度中枢窗口  
看板编号：P1-4B  
牵头 Agent：`ui-ue / copy / dev / qa`  
协作 Agent：`pm / workflow`

## 1. 任务目标

基于 `P1-4A / WSD-20260505-01-column-detail-reading-system` 已完成的规范稿，进入非首页页面的 Dev / QA 落地阶段。

本任务只优化：

- 一级栏目页：Daily Brief、Signals、The Point、Opportunities、Trends。
- 详情页：Daily Detail、Signal Detail、Opportunity Detail、Trend Detail、The Point Detail。
- 长文阅读页：Point Source 素材全文页。

目标效果：除首页外，所有栏目页、详情页和长文阅读页进入同一套高端商业情报阅读母版，标题区、正文宽度、侧栏、卡片密度、文案边界和移动端阅读体验统一，不再像不同时期拼接的页面或后台字段集合。

## 2. 本轮用户新指令

用户明确要求：

> 把首页的修正去掉，之后再做，先执行其他页面 / 栏目 / 详情的优化，进入开发阶段。

因此本任务必须：

- 暂停 `P0-11 / WSD-20260504-26-homepage-desk-visual-asset`。
- 不修改首页首屏、首页右侧主视觉或首页 Intelligence Desk。
- 不把 `P0-2B` failed / not accepted 成果作为任何视觉基础。
- 优先把 P1-4A 规范落到非首页页面。

## 3. 执行依据

必须读取并遵守：

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/reports/column-detail-reading-system-spec-2026-05-05.md`
5. `agent-workflow/execution/WSD-20260505-01-column-detail-reading-system.md`
6. `agent-workflow/reports/WSD-20260505-01-column-detail-reading-system-closeout.md`
7. `agent-workflow/reports/site-ui-design-direction-2026-05-04.md`
8. `agent-workflow/product/DESIGN.md`
9. `agent-workflow/product/COPY.md`
10. `agent-workflow/reports/page-dispatch-gate-rules-2026-05-04.md`

可按需读取：

- `agent-workflow/prd/active/PRD-001-daily-brief.md`
- `agent-workflow/prd/active/PRD-002-signals-system.md`
- `agent-workflow/prd/active/PRD-003-opportunities-engine.md`
- `agent-workflow/prd/active/PRD-004-trends-model.md`
- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/intelligence-data-model.md`

## 4. 允许改动范围

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

报告与截图：

- `agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md`
- `agent-workflow/reports/WSD-20260505-03-*.png`
- 必要时可新增阶段说明：`agent-workflow/reports/non-home-column-detail-reading-implementation-2026-05-05.md`

## 5. 禁止改动范围

严禁修改：

- `04-Site/index.html`
- 首页首屏、首页右侧 Intelligence Desk、首页 hero 或首页专属文案。
- `P0-11` 派发单与收口状态，除非调度中枢另行指令。
- 内容源 Markdown。
- `04-Site/data/` 手写数据。
- `04-Site/scripts/sync-data.mjs`
- `04-Site/scripts/check-relations.mjs`
- `04-Site/scripts/check-tags.mjs`
- `agent-workflow/tools/unified-site-sync.mjs`
- 自动化任务配置、提示词、运行时间线。
- Netlify 配置。
- Admin 后台页面。

如果执行窗口发现必须触碰上述范围，必须停止，并回到调度中枢确认。

## 6. 页面类硬闸门

本任务属于页面类 + 文案类 + 移动端验收任务。缺少以下任一项，调度中枢不得标记 `accepted`。

### 6.1 UI / UE 规范继承与差异表

执行窗口不得重新发明规范，必须以 `column-detail-reading-system-spec-2026-05-05.md` 为准，并补充 Dev 差异表：

| 页面类型 | 必须继承 | 本轮允许微调 |
|---|---|---|
| 一级栏目页 | 标题区、command bar、主列表、侧栏、移动单列规则 | 根据现有 HTML 结构微调 class 和间距，但不得改变栏目定位 |
| 详情页 | 报告正文 + 右侧摘要 / 来源 / 关联母版 | 可按内容量调整侧栏顺序，但不得重复正文 |
| 长文页 | 低噪音窄正文、来源与授权弱化、全文 / 译文区分 | 可补目录或阅读状态，但不能压过正文 |

closeout 必须逐条说明 P1-4A 三张规范表的落实情况。

### 6.2 Copy 规范落实

必须按 P1-4A Copy 表执行：

- 栏目页标题不追加解释型副标题。
- 详情页 H1 表达判断主题，不只写日期或公司名。
- Opportunity 标题不写公司名。
- CTA 只保留自然阅读动作，如 `查看信号`、`查看来源`、`进入机会库`、`继续阅读`。
- 普通前台不得出现禁用语：Admin、JSON、Markdown、同步、脚本、字段、后台、编辑、恢复、本页用于、入口、证据链、强证据、来源明确、机会确定、下一步验证、行动清单、必投、立即行动、保证收益。

### 6.3 Dev 按表实现

Dev 必须在 closeout 中列出：

- 改动了哪些页面、样式和脚本。
- P1-4A 栏目页规范表已实现 / 未实现项。
- P1-4A 详情页规范表已实现 / 未实现项。
- P1-4A 长文页规范表已实现 / 未实现项。
- Copy 规范表已实现 / 未实现项。
- 是否新增样式层；如果新增，说明原因和边界。
- 是否触碰首页；如果没有，明确写出未触碰 `04-Site/index.html`。

### 6.4 QA 桌面与移动验收

QA 必须提供：

- 栏目页桌面截图：Daily、Signals、The Point、Opportunities、Trends。
- 详情页桌面截图：Daily Detail、Signal、Opportunity、Trend、Point。
- 长文页桌面截图：Point Source。
- 移动端抽查截图：至少 2 张栏目页、2 张详情页、1 张长文页。
- 首页回归截图或说明：确认首页未被本任务修改或影响。
- 无横向溢出检查。
- 标题位置、字号、行高、模块起点验收。
- 禁用语和前台 / Admin 边界检查。

## 7. 开发优先顺序

建议执行窗口按以下顺序推进：

1. 梳理 `styles.css` 中现有栏目 / 详情 / 长文相关样式边界，避免继续堆叠无名 override。
2. 统一一级栏目页标题区、command bar、主列表和侧栏节奏。
3. 统一详情页报告母版，包括 H1、meta、主判断、正文宽度和右侧摘要 / 来源 / 关联。
4. 优先修 Daily Detail，使其像每日商业内参详情页。
5. 修 Signal / Opportunity / Trend / Point 详情页差异。
6. 修 Point Source 长文阅读页。
7. 做移动端抽查和无横向溢出。
8. 做禁用语检查和首页未触碰说明。

## 8. 必跑检查

必须运行：

- `node --check 04-Site/js/app.js`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- 浏览器桌面截图检查
- 浏览器移动端截图检查
- 关键页面无横向溢出检查
- 前台禁用语检查

默认不需要运行同步、关系检查或标签检查，因为本任务不改内容源和数据。如果执行窗口主动运行，必须说明原因。

## 9. 自动化影响

本任务只改展示层和前台文案时：

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

如执行窗口发现必须改 Markdown 字段、同步脚本或自动化提示词，必须停止并回到调度中枢确认。

## 10. 收口要求

完成后必须生成 UTF-8 收口文件：

`agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md`

closeout 至少包含：

- PM 范围确认。
- UI / UE 规范落实表。
- Copy 规范落实表。
- Dev 改动清单与逐条实现说明。
- QA 桌面 / 移动截图清单。
- 运行过的检查和结果。
- 首页未触碰说明。
- 自动化影响说明。
- 风险、未完成项和建议是否进入 `P0-5` 截图矩阵。

回到调度中枢窗口汇报：

```text
收口：agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md
```

