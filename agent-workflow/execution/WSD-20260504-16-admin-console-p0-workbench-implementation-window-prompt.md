# WSD-20260504-16 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

任务 ID：
WSD-20260504-16-admin-console-p0-workbench-implementation

牵头 Agent：
UI / UE Agent、Dev Agent

协作 Agent：
Copy Agent、QA Agent、PM Agent

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-16-admin-console-p0-workbench-implementation.md
5. agent-workflow/prd/active/PRD-007-admin-console.md
6. agent-workflow/reports/admin-console-requirements-2026-05-04.md
7. agent-workflow/product/DESIGN.md
8. agent-workflow/product/COPY.md
9. agent-workflow/agents/ui-ue-agent.md
10. agent-workflow/agents/dev-agent.md
11. agent-workflow/agents/qa-agent.md
12. 04-Site/admin.html
13. 04-Site/js/app.js
14. 04-Site/css/styles.css

任务目标：
基于 PRD-007 和 Admin 需求报告，完成 Admin P0 单页工作台的信息架构、页面设计、前端实现和基础验收。把当前 admin.html 从本地控制台原型升级为后台专属管理工作台。

执行要求：
1. 不要接入真实云端数据库、真实支付或复杂权限系统。
2. 不要改内容源 Markdown、网站数据、同步脚本或自动化任务。
3. 保留现有 Admin 能力，不要因重构丢失同步、编辑、用户权限、订阅记录等入口。
4. Admin 使用后台专属导航，不沿用普通前台栏目导航节奏。
5. 首屏要回答“今天能不能发布”，展示同步、内容、质量、用户 / 订单、发布 checklist。
6. 内容管理从纯 JSON 默认编辑升级为列表 / 结构化摘要 / 高级 JSON 展开。
7. 用户与订单采用列表或表格优先。
8. 高风险操作要有明确提示或二次确认。
9. 普通前台不得出现 Admin 导航、编辑、同步、恢复、JSON、质量检查入口。

允许改动：
- 04-Site/admin.html
- 04-Site/js/app.js
- 04-Site/css/styles.css
- agent-workflow/reports/*admin-console-p0*.png
- agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md

必跑检查：
- node --check 04-Site/js/app.js
- node agent-workflow/tools/run-quality-gates.mjs syntax
- Admin 桌面端浏览器截图
- Admin 移动端浏览器截图
- 普通前台后台痕迹检查
- 四种访问状态轻量验收

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-16-admin-console-p0-workbench-implementation-closeout.md

收口文件必须写清：
- 做了什么
- 改了哪些文件
- Admin 工作台如何落实 PRD-007
- 保留了哪些现有 Admin 能力
- 运行了哪些检查
- 截图路径
- 哪些检查未运行及原因
- 是否影响 ai-the-point、ai-2、ai-3
- 是否可以由主调度窗口验收合并
