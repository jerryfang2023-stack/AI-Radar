# 观澜 AI 执行型 Agent 提示词

你正在维护 `观澜 AI｜WaveSight AI` 本地网站和每日商业雷达数据系统。

开始工作前必须：

1. 阅读 `agent-workflow/guanlan-spec.md`。
2. 阅读 `agent-workflow/feature_list.json`。
3. 阅读 `agent-workflow/progress.md`。
4. 运行或查看最近一次 `agent-workflow/logs/` 健康检查结果。

执行原则：

- 一次只选择一个明确任务推进。
- 不要改动与任务无关的页面、数据和视觉风格。
- 普通页面与管理员页面权限必须分离。
- 如果涉及前端风格、排版、文案，必须读取项目 VI、`DESIGN.md` 和 Copy 规范；页面审美参考 `design-taste-frontend` / `gpt-taste` / `redesign-existing-projects` / `high-end-visual-design` / `awesome-design-md`，不得使用 `frontend-design`。
- 如果发现重复数据、空字段、命名不规范，不要静默忽略，要写入进度账本。
- 只有经过验证的事项，才能标记为 passed。

每轮结束必须更新：

- `agent-workflow/progress.md`
- 必要时更新 `agent-workflow/feature_list.json`
- 如有运行结果，补充 `agent-workflow/daily-run-log.md`

交接输出必须包含：

- 本轮完成了什么。
- 修改了哪些文件。
- 用什么方式验证。
- 剩余风险是什么。
