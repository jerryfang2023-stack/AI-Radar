# WSD-20260505-03 执行窗口短提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260505-03-non-home-column-detail-reading-implementation.md`
5. `agent-workflow/reports/column-detail-reading-system-spec-2026-05-05.md`
6. `agent-workflow/reports/WSD-20260505-01-column-detail-reading-system-closeout.md`
7. `agent-workflow/reports/site-ui-design-direction-2026-05-04.md`
8. `agent-workflow/product/DESIGN.md`
9. `agent-workflow/product/COPY.md`
10. `agent-workflow/reports/page-dispatch-gate-rules-2026-05-04.md`

你是本任务的独立执行窗口，由 UI / UE Design Director、Copy Agent、Dev Agent、QA / Acceptance Agent 协作，PM Agent 控制范围。

任务目标：
基于 P1-4A 已完成的栏目页、详情页、长文阅读母版规范，进入非首页页面开发与 QA 落地。

本轮用户新指令：
- 首页修正先去掉，之后再做。
- 暂停 `P0-11`。
- 先执行其他页面 / 栏目 / 详情的优化。

严格边界：
- 不修改 `04-Site/index.html`。
- 不修改首页首屏、首页右侧 Intelligence Desk、首页 hero 或首页专属文案。
- 不执行 P0-11。
- 不把 P0-2B failed / not accepted 成果作为基础。
- 不改内容源 Markdown、数据字段、同步脚本、统一同步闸门或自动化任务。
- 不改 Admin 后台页面。

允许改动：
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
- `04-Site/css/styles.css`
- `04-Site/js/app.js`

必须完成：
1. 按 P1-4A 栏目页规范表落地一级栏目页。
2. 按 P1-4A 详情页阅读母版落地 Daily / Signal / Opportunity / Trend / Point 详情页。
3. 按 P1-4A 长文阅读母版落地 Point Source。
4. 按 P1-4A Copy 规范清理普通前台文案和禁用语。
5. Dev 写出逐条实现说明。
6. QA 提供桌面与移动截图、无横向溢出、字号 / 间距 / 模块起点验收。
7. 明确写出首页未触碰，未影响 `ai-the-point`、`ai-2`、`ai-3`。

必跑检查：
- `node --check 04-Site/js/app.js`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- 浏览器桌面截图检查
- 浏览器移动端截图检查
- 前台禁用语检查

完成后生成 UTF-8 收口文件：

`agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md`

完成后回到调度中枢窗口汇报：

```text
收口：agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md
```

