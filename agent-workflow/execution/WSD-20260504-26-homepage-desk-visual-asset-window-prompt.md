# WSD-20260504-26 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-26-homepage-desk-visual-asset.md
5. agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md
6. agent-workflow/reports/site-ui-design-direction-2026-05-04.md
7. agent-workflow/reports/site-module-design-review-2026-05-04.md
8. agent-workflow/product/DESIGN.md
9. agent-workflow/product/COPY.md

你是本任务的独立执行窗口，由 UI / UE Design Director、Copy Agent、Dev Agent、QA / Acceptance Agent 协作。

任务目标：
在 P0-10 已 accepted 的前提下，按 DESIGN v2 的“商业情报桌面”方向，单独优化首页右侧主视觉 / Intelligence Desk 判断样张，并完成桌面与移动端验收。

严格边界：
- 不重做全站 UI。
- 不恢复三图轮播。
- 不沿用旧雷达图、四张 poster 卡或 P0-2B failed 结果。
- 不改内容源 Markdown。
- 不改 `04-Site/data/`。
- 不改同步脚本、关系检查脚本、统一同步闸门。
- 不改自动化任务。

允许改动：
- `04-Site/index.html`
- `04-Site/css/styles.css`
- `04-Site/js/app.js`，仅限首页样张渲染
- 必要视觉资产文件
- `agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md`

必须输出：
1. UI/UE 页面规范表：说明 Intelligence Desk 的构图、位置、字号、间距、移动端裁切和审美阻塞项。
2. Copy 文案规范表：样张内短文案、首页 CTA、禁用语检查和判断边界。
3. Dev 按表实现说明：逐条说明 UI/UE 与 Copy 规范如何落地。
4. QA 验收：桌面截图、移动端截图、无横向溢出、前台禁用语检查、主视觉是否符合 DESIGN v2。
5. 自动化影响说明：默认不影响 `ai-the-point`、`ai-2`、`ai-3`，如发现会影响必须写清。

主视觉要求：
- 使用 `Intelligence Desk` 判断样张，而不是抽象海报或轮播。
- 样张包含 Brief 摘要、2 条 Signal、1 条 Opportunity、1 个 Trend 状态。
- 真实文字由 HTML/CSS 承载，生成图只负责纸面结构和氛围。
- 禁止出现 `Scoring`、`JSON`、`同步`、`后台`、`字段`、`编辑`。
- 禁止机器人头像、霓虹科技背景、纯雷达网格、股市 K 线堆叠。

必跑检查：
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- `node --check 04-Site/js/app.js`
- 浏览器桌面 / 移动端截图检查
- 首页无横向溢出检查
- 前台禁用语检查

完成后生成 UTF-8 收口文件：
`agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md`

收口文件必须写清：
- 做了什么
- 改了哪些文件
- 是否符合派发单范围
- UI/UE 页面规范表
- Copy 文案规范表
- Dev 逐条实现说明
- QA 桌面 / 移动端截图和验收结论
- 运行了哪些检查
- 哪些检查未运行及风险
- 是否影响 `ai-the-point`、`ai-2`、`ai-3`
- 是否建议调度中枢标记 accepted / blocked / failed

完成后回到调度中枢窗口汇报：
`收口：agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md`
