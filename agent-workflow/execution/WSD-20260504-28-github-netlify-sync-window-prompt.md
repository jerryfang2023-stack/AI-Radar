# WSD-20260504-28 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/dispatch-board.md
5. agent-workflow/reports/dispatch-hub-handoff-2026-05-04.md
6. agent-workflow/reports/github-baseline-sync-2026-05-04.md
7. agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md
8. agent-workflow/execution/WSD-20260504-28-github-netlify-sync.md

你是本任务的独立执行窗口，由 Dev Agent 与 Workflow / Automation Agent 牵头。

任务目标：
将当前已验收、应进入版本管理的网站代码与项目工作流文件同步到 GitHub，并将最新可部署网站更新到 Netlify。

严格边界：
- 不做正式 production launch。
- 不配置正式域名。
- 不改网站 UI、文案、数据模型或自动化逻辑。
- 不合并、提交或部署 `P0-2A` void / abandoned 成果。
- 不合并、提交或部署 `P0-2B` failed / not accepted 成果。
- 不使用 `git reset --hard`、`git checkout --` 或删除陌生文件。
- Netlify Preview 可访问不等于正式上线完成。

执行要求：
1. 先审计 git status、当前分支、remote 和未提交文件。
2. 判断哪些变更属于 accepted / ready / failed / void，提交前写清范围。
3. 只提交应进入版本管理的文件。
4. 推送到 GitHub，记录 branch、commit hash、remote URL。
5. 更新 Netlify 站点部署，记录 Site ID、Deploy ID、部署 URL。
6. 检查远端首页、Daily、Signals、The Point、Opportunities、Trends、CSS、JS、data 是否可访问。
7. 生成主报告：
`agent-workflow/reports/github-netlify-sync-2026-05-04.md`
8. 生成 UTF-8 收口文件：
`agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md`

收口文件必须写清：
- 做了什么
- 提交了哪些文件类别
- 未提交/未部署哪些内容及原因
- GitHub branch、commit hash、remote URL、push 结果
- Netlify Site ID、Deploy ID、部署 URL、默认 URL
- 运行了哪些检查
- 哪些检查未运行及风险
- 是否影响 `ai-the-point`、`ai-2`、`ai-3`
- 是否建议调度中枢标记 accepted / blocked / failed

完成后回到调度中枢窗口汇报：
`收口：agent-workflow/reports/WSD-20260504-28-github-netlify-sync-closeout.md`
