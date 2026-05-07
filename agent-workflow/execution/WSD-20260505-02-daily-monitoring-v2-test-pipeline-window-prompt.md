# WSD-20260505-02 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-test-pipeline.md
5. agent-workflow/product/signal-system.md
6. agent-workflow/product/source-intelligence.md
7. agent-workflow/product/priority-engine-2.md
8. agent-workflow/product/trend-model.md
9. agent-workflow/product/DESIGN.md
10. agent-workflow/product/COPY.md

你是本任务的独立执行窗口，由 PM Agent、Intelligence Data Agent、Workflow / Automation Agent、Dev Agent、UI / UE Design Director、Copy Agent、QA / Acceptance Agent 协作。

重要提醒：本任务可能影响自动化任务。新能力只进入 `06-content/` 与测试页，成熟前不得替换现有 `01-Signals` 或 `signals.html`。

任务目标：
建立日常监测算法 v2 测试管线：
- 原始采集 30-50 条。
- 初筛入池 10-15 条。
- 结构化入库 5-8 条，完成 6 维度分析。
- 前台测试展示 3 条，必须二次搜索并补强来源。
- 深挖机会卡每天最多 1 条，必须二次搜索并输出行动地图。
- 趋势归类进入长期数据库。
- 所有内容进入 `06-content/` 分阶段目录。
- 新建测试网页，不替换正式 Signals 栏目。

必须输出：
1. PM 新增功能门禁、WAVE 评分和模块决策表。
2. `06-content/` 目录结构与样例文件。
3. `agent-workflow/product/daily-monitoring-algorithm-v2.md`。
4. 测试页 `04-Site/signal-lab.html` 与测试数据。
5. 如需要，新增 `04-Site/scripts/sync-signal-lab.mjs`。
6. UI/UE 页面规范表、Copy 文案规范表、Dev 实现说明、QA 桌面 / 移动截图。
7. 自动化影响说明。

完成后生成 UTF-8 收口文件：
`agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md`

完成后回到调度中枢窗口汇报：
`收口：agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md`
