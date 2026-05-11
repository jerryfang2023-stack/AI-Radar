# WSD-20260504-25-site-ui-design-direction 独立执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/agents/ui-ue-agent.md`
5. `agent-workflow/product/DESIGN.md`
6. `agent-workflow/product/COPY.md`
7. `agent-workflow/execution/WSD-20260504-25-site-ui-design-direction.md`
8. `agent-workflow/reports/site-module-design-review-2026-05-04.md`
9. `agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md`
10. `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md`
11. `agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md`

你是本任务的独立执行窗口，由 UI / UE Design Director 牵头。只处理派发单中的范围，不要直接改网站代码，不要修改 `04-Site/`，不要生成最终首页海报图，不改变栏目、数据模型、权限或自动化任务。

任务目标：

- 重新定义观澜AI网站 UI 优化方向。
- 输出全站 Art Direction。
- 输出首页、栏目页、详情页、Admin、会员页、移动端的页面母版方向。
- 输出 DESIGN v2 草案或明确升级建议。
- 输出首页右侧主视觉 / Intelligence Desk 样张方向。
- 输出审美阻塞项。
- 输出后续 Dev / Visual Asset / QA 任务拆分。

特别注意：

- 必须读取并吸收 `P0-10A / WSD-20260504-27-site-module-design-review` 的结论。
- 不得把 `P0-2B / WSD-20260504-18-homepage-ui-copy-redesign` 当成成功版本。
- 首页旧雷达图、四张 poster 卡和泛营销利益表达应作为需要替换的旧方向处理。
- P0-11 只有在本任务 accepted 后才能执行。

允许改动：

- `agent-workflow/product/DESIGN.md`，仅限新增 DESIGN v2 草案或明确升级方向。
- `agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md`
- 必要时新增 `agent-workflow/reports/site-ui-design-direction-2026-05-04.md`

必须运行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
```

完成后生成 UTF-8 收口文件：

```text
agent-workflow/reports/WSD-20260504-25-site-ui-design-direction-closeout.md
```

收口文件必须写清：

- 做了什么。
- 改了哪些文件。
- Art Direction、页面母版、DESIGN v2 草案、首页主视觉方向和审美阻塞项。
- PM 后续任务拆分。
- Copy 文案边界检查。
- 运行了哪些检查。
- 哪些检查未运行及风险。
- 是否影响自动化任务。
- 下一步应回到调度中枢窗口处理什么。
