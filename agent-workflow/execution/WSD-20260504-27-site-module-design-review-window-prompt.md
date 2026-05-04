# WSD-20260504-27 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/agents/pm-agent.md
5. agent-workflow/agents/ui-ue-agent.md
6. agent-workflow/execution/WSD-20260504-27-site-module-design-review.md

你是本任务的独立执行窗口，由升级后的 PM Agent 与 UI / UE Design Director 联合牵头。

任务目标：
对观澜AI当前网站模块、页面体系和设计规范做一次系统梳理，提出修改和优化意见。

严格边界：
- 不直接修改 `04-Site`。
- 不进入 Dev。
- 不生成首页海报图。
- 不新增前台栏目或后台能力，只能做评审和建议。
- 不把 `P0-2B` failed 结果当成成功版本。

必须输出：
1. 当前网站模块地图。
2. PM 模块生命周期决策表，至少覆盖首页、Daily Brief、Signals、The Point、Opportunities、Trends、Priority Engine、Tags/Search、登录注册、Account/Pricing、Admin。
3. 如提出任何新增模块、入口、视图或后台能力，必须输出新增功能门禁记录与 WAVE 评分；未通过不得建议进入 Dev。
4. UI / UE Design Director 全站页面规范审计表。
5. DESIGN v2 修改建议。
6. Copy 风险清单。
7. 后续任务拆分建议，说明哪些应更新 P0-10 / P0-11 / P0-6 / P0-5 / P0-4。
8. 哪些建议需要用户确认，哪些可以后续直接派发。

主报告写入：
`agent-workflow/reports/site-module-design-review-2026-05-04.md`

完成后生成 UTF-8 收口文件：
`agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md`

收口文件必须写清：
- 做了什么
- 改了哪些文件
- 是否符合派发单范围
- 运行了哪些检查
- 哪些检查未运行及风险
- 是否影响 `ai-the-point`、`ai-2`、`ai-3`
- 是否建议调度中枢标记 accepted / blocked / failed

完成后回到调度中枢窗口汇报：
`收口：agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md`
