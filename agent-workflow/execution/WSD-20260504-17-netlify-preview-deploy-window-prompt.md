# WSD-20260504-17 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

任务 ID：
WSD-20260504-17-netlify-preview-deploy

本任务目标：
把当前项目网站部署到 Netlify 预览环境，并返回一个可访问链接。请直接执行到预览 URL 可访问为止，再写 UTF-8 收口文件回主调度窗口。

牵头角色：
Dev Agent

协作角色：
PM Agent、QA / Acceptance Agent、Workflow / Automation Agent

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/governance/quality-gates.md
5. agent-workflow/governance/plan-first-policy.md
6. agent-workflow/execution/WSD-20260504-17-netlify-preview-deploy.md
7. agent-workflow/execution/WSD-20260504-11-launch-readiness-plan.md
8. 04-Site/README.md
9. 04-Site/config/content-paths.json

重要边界：
- 这是 Netlify Preview 部署任务，不是正式生产发布。
- 不配置正式域名，不接入真实数据库，不做生产发布切换。
- 不改内容源 Markdown，不改同步脚本，不改自动化任务。
- 不合并任何已作废的首页轮播图任务成果。
- 普通前台不能暴露 Admin、JSON、同步、编辑、恢复等后台痕迹。

部署要求：
1. 优先使用 Netlify 插件 / connector 能力完成部署；如果当前窗口不可用，再使用 Netlify CLI 或 Netlify Web 流程。
2. 优先将 `04-Site/` 作为发布目录。
3. 如需新增 Netlify 配置，优先使用最小配置，例如 `netlify.toml`、`04-Site/_redirects` 或 `04-Site/_headers`。
4. 不要把 token、账号信息或敏感配置写入仓库。
5. 部署完成后必须给出 Netlify Preview URL，并确认外部可访问。

允许改动：
- netlify.toml
- 04-Site/_redirects
- 04-Site/_headers
- agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md
- 必要截图或部署验证报告

原则上不要改：
- 04-Site/index.html
- 04-Site/js/app.js
- 04-Site/css/styles.css

禁止改动：
- 01-Signals/
- 02-Scoring/
- 03-Trends/
- 05-Point/
- 07-Opportunities/
- 04-Site/data/
- 04-Site/scripts/
- agent-workflow/tools/unified-site-sync.mjs
- 自动化任务提示词或运行顺序

必跑检查：
- node --check 04-Site/js/app.js
- node agent-workflow/tools/run-quality-gates.mjs syntax
- 确认 `04-Site/` 内首页和关键静态资产存在

部署后必须检查：
- Netlify Preview URL 可访问
- 首页可访问
- Daily Brief 可访问
- Signals 可访问
- The Point 可访问
- Opportunities 可访问
- Trends 可访问
- CSS / JS / data 文件加载正常
- 普通前台不出现 Admin、JSON、同步、编辑、恢复等后台痕迹

如果部署失败：
- 不要假装完成。
- 写明失败阶段、错误摘要、已尝试方案、是否需要 Netlify 授权或 token、下一步阻塞点。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md

收口文件必须写清：
- 任务状态：done / blocked
- Netlify Preview URL
- 使用的部署方式：Netlify 插件 / CLI / Web
- 发布目录
- 创建或使用的 Netlify 站点名称
- 改了哪些文件
- 运行了哪些检查
- 部署后访问了哪些页面
- 哪些检查未运行及原因
- 是否影响 ai-the-point、ai-2、ai-3
- 是否可以由主调度窗口验收

完成后回到主调度窗口汇报：

收口：agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md
