# WSD-20260504-14-the-point-home-redesign-implementation 派发单

日期：2026-05-04  
状态：dispatched  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue` / `dev`  
协作 Agent：`copy` / `qa` / `pm`

## 1. 任务目标

- 基于已完成的 Strategy / PM 规划，完成 The Point 首页的页面设计、文案、前端开发和基础验收。
- 将 The Point 首页从“观点列表 / 人物墙 / 来源聚合”升级为“从一线观点中，看见 AI 共识、分歧与边界”的判断入口。
- 本任务必须在独立执行窗口中完成，且不拆成中途回报；全部页面修改、检查和截图完成后，再回到调度中枢提交 closeout。

## 2. 输入依据

必须严格读取并执行：

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation.md`
5. `agent-workflow/reports/the-point-home-redesign-plan-2026-05-04.md`
6. `agent-workflow/product/DESIGN.md`
7. `agent-workflow/product/COPY.md`
8. `agent-workflow/product/the-point-model.md`
9. `agent-workflow/agents/ui-ue-agent.md`
10. `agent-workflow/agents/copy-agent.md`
11. `agent-workflow/agents/dev-agent.md`
12. `agent-workflow/agents/qa-agent.md`

## 3. 核心页面方向

The Point 首页 H1 固定为：

```text
从一线观点中，看见 AI 共识、分歧与边界。
```

首屏不加小字导语，不解释栏目功能。

页面必须突出：

- 一线来源：人物 / 机构 / 来源类型 / 原文出处链接。
- 原始观点：用中文转述观点核心，不把摘要冒充为原文全文。
- 观澜解读：作为第二层增值，不盖过来源本身。
- 判断状态：共识 / 分歧 / 早期信号。
- 关联资产：Signal / Trend / Opportunity 的轻入口。

## 4. 非目标

- 不改 `05-point/` 内容源。
- 不改 The Point 字段、frontmatter、数据模型或自动化规则。
- 不改 `04-Site/scripts/sync-data.mjs`。
- 不改 `agent-workflow/tools/unified-site-sync.mjs`。
- 不改 The Point 导航位置。
- 不把外部全文包装成观澜自有付费内容。
- 不做人物热榜、社媒热度榜、观点瀑布流、全文搬运页。

## 5. 允许改动范围

- `04-Site/the-point.html`
- `04-Site/js/app.js`
- `04-Site/css/styles.css`
- 必要截图：`agent-workflow/reports/*the-point-home-redesign*.png`
- 收口文件：`agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md`

如果确需微调 `04-Site/point.html`、`04-Site/point-daily.html` 或 `04-Site/point-source.html` 的入口文案，必须在 closeout 中说明原因；默认不改。

## 6. 禁止改动范围

- `05-point/`
- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `07-Opportunities/`
- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`
- `04-Site/scripts/`
- 自动化任务配置或提示词

## 7. 执行顺序

本任务在一个执行窗口中连续完成：

1. Copy Agent：先定模块标题、字段名、CTA、空状态文案。
2. UI / UE Agent：基于规划报告确定桌面端和移动端结构。
3. Dev Agent：落地 `the-point.html`、`app.js`、`styles.css` 展示层。
4. QA Agent：做桌面端 / 移动端浏览器检查、无横向溢出检查、后台痕迹检查。
5. Workflow：写 UTF-8 closeout，回到调度中枢。

不要在 Copy 或 UI 阶段提前回调度窗口；全部修改完成后再交接。

## 8. 页面结构要求

建议结构：

- 一级栏目标题区：与 Daily Brief / Signals / Opportunities / Trends 的标题位置、字号、行高和首屏节奏一致。
- 首屏主观点：展示最近或最高价值的一条 Point，包含来源、出处、观点摘要、观澜解读和关联入口。
- 判断分组：`正在形成共识` / `出现分歧` / `早期信号`。
- 今日一线观点：6-10 条少而精，突出来源、原始观点、观澜解读、stance 和出处。
- 关联判断资产：相关信号、相关趋势、相关机会。
- 素材入口：保留“查看来源 / 查看观点 / 进入今日观点”，不展示大段全文。

如果现有数据不足以稳定生成三类分组，第一版可用轻量规则：

- stance 或 topic 相近且多条出现：归入共识。
- stance 有谨慎 / skeptical / debate / risk 等倾向：归入分歧。
- 单条高质量观点或较新 topic：归入早期信号。

不得为了页面效果硬改数据模型。

## 9. 文案约束

必须避免：

- `本页用于`
- `入口`
- `同步`
- `字段`
- `后台`
- `抓取`
- `证据链`
- `强证据`
- `机会确定`
- `下一步验证`
- `立即行动`
- `确定性机会`

推荐 CTA：

- `查看观点`
- `查看来源`
- `查看相关信号`
- `查看相关趋势`
- `进入今日观点`

## 10. UI / UE 约束

必须使用：

- `frontend-design`
- Bloomberg / FT / Economist 内参式阅读逻辑
- Linear 信息密度

必须避免：

- 人物头像墙。
- 社媒信息流。
- 大面积深色科技面板。
- 卡片套卡片。
- 粗糙后台组件堆叠。
- 每个元素都像按钮。

移动端必须保持阅读顺序：

1. H1
2. 主观点
3. 判断分组
4. 今日观点
5. 关联内容

## 11. 必跑检查

- [ ] `node --check 04-Site/js/app.js`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] 浏览器桌面端 The Point 首页截图
- [ ] 浏览器移动端 The Point 首页截图
- [ ] 检查桌面端和移动端无横向溢出
- [ ] 检查普通前台无 Admin / JSON / 同步 / 编辑 / 恢复痕迹
- [ ] 抽查观点详情、每日集合、来源页链接可打开

未运行的检查必须在 closeout 中说明原因和风险。

## 12. 自动化影响

预计不影响：

- `ai-the-point`
- `ai-2`
- `ai-3`

原因：本任务只改 The Point 首页展示层和文案，不改 Markdown 命名、内容字段、同步脚本、关系检查或统一同步闸门。

如果执行过程中需要改字段、同步脚本或自动化规则，必须停止并回到调度中枢，不能自行扩大范围。

## 13. 预期输出

- The Point 首页改版已落地。
- 桌面端和移动端截图。
- 所有必跑检查结果。
- UTF-8 closeout：

```text
agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md
```

## 14. 执行窗口启动提示词

如果复制长提示词不方便，可直接让执行窗口读取：

```text
agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation-window-prompt.md
```
