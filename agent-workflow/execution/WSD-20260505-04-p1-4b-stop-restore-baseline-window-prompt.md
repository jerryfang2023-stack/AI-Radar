# WSD-20260505-04 执行窗口短提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260505-04-p1-4b-stop-restore-baseline.md`
5. `agent-workflow/reports/WSD-20260505-03-non-home-column-detail-reading-implementation-closeout.md`
6. `agent-workflow/reports/design-director-evidence-based-quality-gate-2026-05-05.md`

任务目标：
停止 `P1-4B`，把网页恢复到 P1-4B 执行前状态。不要继续优化页面，不要重做设计。

严格边界：
- 不得使用 `git reset --hard`。
- 不得整仓回滚。
- 不得删除或回滚不属于 P1-4B 的变更。
- 不得修改 `04-Site/index.html`。
- 不得修改内容源 Markdown、`04-Site/data/`、同步脚本、关系检查脚本、统一同步闸门或自动化任务。

优先审计并恢复这些 P1-4B 涉及文件：
- `04-Site/css/styles.css`
- `04-Site/js/app.js`
- `04-Site/daily.html`
- `04-Site/signals.html`
- `04-Site/opportunities.html`
- `04-Site/trends.html`

必须做到：
1. 记录当前 git 状态和上述文件 diff。
2. 备份上述文件。
3. 只撤回 P1-4B 引入的样式、栏目标题、公开文案和页面展示改动。
4. 不确定是否属于 P1-4B 的改动不要回滚，写入 closeout。
5. 运行 `node --check 04-Site/js/app.js`。
6. 运行 `node agent-workflow/tools/run-quality-gates.mjs syntax`。
7. 截图或浏览器抽查 Daily、Signals、Opportunities、Trends 和任一详情页。

完成后生成 UTF-8 收口文件：

`agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md`

完成后回到调度中枢窗口汇报：

```text
收口：agent-workflow/reports/WSD-20260505-04-p1-4b-stop-restore-baseline-closeout.md
```

