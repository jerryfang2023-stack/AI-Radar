# WSD-20260504-23 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

任务 ID：
WSD-20260504-23-ai-3-judgment-node-sync-gate

优先级：
P0 / highest

任务目标：
升级 ai-3 统一网站同步闸门，加入 Priority Engine 2.0 Judgment Node 覆盖率与硬错误检查。重点是让每日内容入站前确认 Priority Row 已全部进入 Judgment Node，Judgment Node 没有断链，覆盖率摘要可信；失败时必须阻止同步并恢复备份。

牵头角色：
Workflow / Automation Agent、Dev Agent

协作角色：
Intelligence Data Agent、QA / Acceptance Agent、PM Agent

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/governance/quality-gates.md
5. agent-workflow/governance/automation-fallback-policy.md
6. agent-workflow/execution/WSD-20260504-23-ai-3-judgment-node-sync-gate.md
7. agent-workflow/product/priority-engine-2.md
8. agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md
9. agent-workflow/reports/relation-check-latest.md
10. agent-workflow/execution/daily-automation-coordination-2026-05-03.md
11. agent-workflow/tools/unified-site-sync.mjs
12. agent-workflow/tools/run-quality-gates.mjs
13. 04-Site/scripts/sync-data.mjs
14. 04-Site/scripts/check-relations.mjs
15. 04-Site/scripts/check-tags.mjs
16. 04-Site/scripts/check-point-quality.mjs
17. 04-Site/data/radar-data.json

必须完成：
1. 在统一同步闸门中增加 Priority Engine 2.0 Judgment Node 覆盖率检查。
2. 明确硬错误和软提醒边界：Priority Row 无 Judgment Node、Judgment Node 无 Priority、覆盖率摘要缺失或不一致、Judgment Node 断链必须阻止入站。
3. 保持失败恢复策略：同步后检查失败时恢复同步前备份，不覆盖上一版有效数据。
4. 更新 ai-3 运行说明或实际自动化提示词；如果无法直接更新实际自动化配置，写清阻塞和替代文档。
5. 不批量重写历史 Markdown，不修改普通前台，不新增栏目。
6. 生成 UTF-8 closeout 文件。

允许改动：
- agent-workflow/tools/unified-site-sync.mjs
- agent-workflow/tools/run-quality-gates.mjs
- 04-Site/scripts/check-relations.mjs
- 04-Site/scripts/sync-data.mjs（仅限必要兼容字段）
- 04-Site/data/radar-data.json
- 04-Site/data/radar-data.js
- agent-workflow/execution/daily-automation-coordination-2026-05-03.md
- agent-workflow/reports/unified-site-sync-*.md
- agent-workflow/reports/relation-check-*.md
- agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md

禁止：
- 不改普通前台页面结构或视觉。
- 不改 ai-the-point 自动化，除非只是说明本任务不影响它。
- 不改 ai-2 提示词，除非发现必须修复的 P0 阻塞，并在 closeout 单独说明。
- 不批量重写历史内容源。
- 不删除旧 30 分评分表兼容逻辑。
- 不把软提醒一律升级为硬错误。

必跑检查：
- node --check agent-workflow/tools/unified-site-sync.mjs
- node --check agent-workflow/tools/run-quality-gates.mjs
- node --check 04-Site/scripts/sync-data.mjs
- node --check 04-Site/scripts/check-relations.mjs
- node 04-Site/scripts/sync-data.mjs
- node 04-Site/scripts/check-relations.mjs
- node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04
- node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04 --run-sync-gate

建议运行：
- node 04-Site/scripts/check-tags.mjs
- node 04-Site/scripts/check-point-quality.mjs
- node agent-workflow/tools/run-quality-gates.mjs syntax

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md

收口文件必须写清：做了什么、改了哪些文件、Judgment Node 覆盖率规则、硬错误和软提醒边界、是否更新实际 ai-3 自动化配置、运行了哪些检查、哪些检查未运行及风险、是否影响 ai-the-point / ai-2 / ai-3、失败时是否恢复备份、是否可以由主调度窗口验收。

完成后回到主调度窗口汇报：

收口：agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md
