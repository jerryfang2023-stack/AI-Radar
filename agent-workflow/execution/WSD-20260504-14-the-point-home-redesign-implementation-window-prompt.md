# WSD-20260504-14 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

任务 ID：
WSD-20260504-14-the-point-home-redesign-implementation

本任务建议在派生工作树中完成。建议工作树名称：
01-WaveSight-p0-1a-the-point-home

建议分支名：
task/WSD-20260504-14-the-point-home-redesign-implementation

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-14-the-point-home-redesign-implementation.md
5. agent-workflow/reports/the-point-home-redesign-plan-2026-05-04.md
6. agent-workflow/product/DESIGN.md
7. agent-workflow/product/COPY.md
8. agent-workflow/product/the-point-model.md
9. agent-workflow/agents/ui-ue-agent.md
10. agent-workflow/agents/copy-agent.md
11. agent-workflow/agents/dev-agent.md
12. agent-workflow/agents/qa-agent.md

你是本任务的独立执行窗口。牵头角色为 UI / UE Agent 和 Dev Agent，协作角色为 Copy Agent、QA Agent、PM Agent。

任务目标：
基于 Strategy / PM 已完成的规划，完成 The Point 首页的页面设计、文案、前端开发和基础验收。不要中途回调度窗口；全部页面修改、检查和截图完成后，再回到调度中枢提交 closeout。

核心方向：
The Point 首页 H1 固定为：
从一线观点中，看见 AI 共识、分歧与边界。

首屏不加小字导语，不解释栏目功能。页面必须突出一线来源、原始观点、观澜解读、判断状态、相关 Signal / Trend / Opportunity。

执行顺序：
1. Copy Agent：定模块标题、字段名、CTA、空状态文案。
2. UI / UE Agent：确定桌面端和移动端结构。
3. Dev Agent：落地 04-Site/the-point.html、04-Site/js/app.js、04-Site/css/styles.css。
4. QA Agent：做桌面端 / 移动端浏览器检查、无横向溢出检查、后台痕迹检查。
5. Workflow：写 UTF-8 closeout。

允许改动：
- 04-Site/the-point.html
- 04-Site/js/app.js
- 04-Site/css/styles.css
- agent-workflow/reports/*the-point-home-redesign*.png
- agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md

禁止改动：
- 05-point/
- 01-Signals/
- 02-Scoring/
- 03-Trends/
- 07-Opportunities/
- 04-Site/data/radar-data.json
- 04-Site/data/radar-data.js
- 04-Site/scripts/
- 自动化任务配置或提示词

必跑检查：
- node --check 04-Site/js/app.js
- node agent-workflow/tools/run-quality-gates.mjs syntax
- 浏览器桌面端 The Point 首页截图
- 浏览器移动端 The Point 首页截图
- 检查桌面端和移动端无横向溢出
- 检查普通前台无 Admin / JSON / 同步 / 编辑 / 恢复痕迹
- 抽查观点详情、每日集合、来源页链接可打开

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md

收口文件必须写清：
- 做了什么
- 改了哪些文件
- 页面设计和文案如何落实规划报告
- 运行了哪些检查
- 截图路径
- 哪些检查未运行及原因
- 是否影响 ai-the-point、ai-2、ai-3
- 是否可以由主调度窗口验收合并
