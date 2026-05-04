# WSD-20260504-23-ai-3-judgment-node-sync-gate 派发单

日期：2026-05-04  
状态：dispatched  
优先级：P0 / highest  
调度窗口：当前主窗口  
牵头 Agent：`workflow` / `dev`  
协作 Agent：`data` / `qa` / `pm`

## 1. 任务目标

升级 `ai-3` 统一网站同步闸门，把 Priority Engine 2.0 的 Judgment Node 覆盖率与硬错误检查纳入入站前检查。

本任务要解决的问题：

- Priority Engine 2.0 已在 P0-8A 落地，网站数据已输出 `judgmentNodes` 与 `priorityEngine` 摘要。
- 当前 `ai-3` 统一同步闸门仍主要检查 Signals、Scoring、The Point、关系检查、Point 质量和 Tags。
- 后续每日评分进入 2.0 后，必须防止 Priority Row 没有 Judgment Node、Judgment Node 断链、覆盖率异常或检查结果只停留在软提醒。

执行窗口需要完成：

1. Dev：补强 `unified-site-sync.mjs`，在同步后读取最新网站数据和关系检查结果，验证 Priority Engine 2.0 Judgment Node 覆盖率。
2. Dev：把关键 Judgment Node 缺失、断链或覆盖率低于阈值定义为硬错误，触发同步失败和备份恢复。
3. Workflow：更新 `ai-3` 运行说明或自动化提示词，使长期自动化知道新增闸门口径。
4. QA：运行自动化模式 Quality Gate 和一次指定日期的同步闸门验证，确认失败时不会覆盖上一版有效数据。
5. Data：确认硬错误规则不为了清零软提醒而硬绑无效 Judgment Node。

## 2. 非目标

- 不重新设计 Priority Engine 2.0 模型。
- 不修改 `ai-2` 评分提示词，除非执行窗口发现 P0-8A 产物与闸门规则明显冲突；如冲突，只记录风险，不扩大修改。
- 不批量重写历史 Markdown。
- 不新增普通前台栏目，不把 Judgment Node 作为前台导航或后台字段名直接展示给普通用户。
- 不解决 Netlify 重新部署授权问题。
- 不处理 `04-Site/scoring.html` 的历史否定式文案。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| Workflow / Automation Agent | 牵头定义 `ai-3` 闸门口径，更新自动化说明、运行日志要求和收口报告 |
| Dev Agent | 实现 `unified-site-sync.mjs` / Quality Gate / 关系检查对接，保证失败回滚 |
| Intelligence Data Agent | 定义 Judgment Node 覆盖率、硬错误和软提醒边界 |
| QA / Acceptance Agent | 独立验收同步成功、失败恢复、硬错误、未运行检查和自动化影响 |
| PM Agent | 控制范围：只补同步闸门，不扩展产品栏目或商业承诺 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/governance/quality-gates.md`
5. `agent-workflow/governance/automation-fallback-policy.md`
6. `agent-workflow/execution/WSD-20260504-23-ai-3-judgment-node-sync-gate.md`
7. `agent-workflow/product/priority-engine-2.md`
8. `agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md`
9. `agent-workflow/reports/relation-check-latest.md`
10. `agent-workflow/execution/daily-automation-coordination-2026-05-03.md`
11. `agent-workflow/tools/unified-site-sync.mjs`
12. `agent-workflow/tools/run-quality-gates.mjs`
13. `04-Site/scripts/sync-data.mjs`
14. `04-Site/scripts/check-relations.mjs`
15. `04-Site/scripts/check-tags.mjs`
16. `04-Site/scripts/check-point-quality.mjs`
17. `04-Site/data/radar-data.json`

## 5. 允许改动范围

- `agent-workflow/tools/unified-site-sync.mjs`
- `agent-workflow/tools/run-quality-gates.mjs`
- `04-Site/scripts/check-relations.mjs`
- `04-Site/scripts/sync-data.mjs`，仅限补充 Priority Engine 2.0 摘要字段或兼容检查所需字段
- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`
- `agent-workflow/execution/daily-automation-coordination-2026-05-03.md`
- `agent-workflow/reports/unified-site-sync-*.md`
- `agent-workflow/reports/relation-check-*.md`
- `agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md`
- 如能安全定位 `ai-3` 的实际自动化配置或提示词，可按现有工具流程更新；若不能定位，必须在 closeout 写明阻塞和已更新的替代执行文档。

## 6. 禁止改动范围

- 不改普通前台页面结构或视觉。
- 不改 `ai-the-point` 自动化，除非只是说明本任务不影响它。
- 不改 `ai-2` 提示词，除非发现必须修复的 P0 阻塞，并在 closeout 单独说明。
- 不批量重写 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-Point/`、`07-Opportunities/` 历史内容。
- 不删除旧 30 分评分表兼容逻辑。
- 不把软提醒一律升级为硬错误；硬错误必须限于会污染同步结果或破坏 Judgment Node 覆盖率的情况。

## 7. Judgment Node 闸门要求

执行窗口需要至少覆盖以下检查：

1. `radar-data.json` 中存在 `priorityRows`、`judgmentNodes` 和 `priorityEngine` 摘要。
2. Priority Row 总数大于 0 时，`Priority Row -> Judgment Node` 覆盖率必须为 100%，除非相关 Priority Row 明确标记为不可同步或 `needs_review`。
3. 每个 Judgment Node 至少关联一个 Priority Row。
4. Judgment Node 关联的 Signal / Trend / Opportunity 如存在 ID，不能断链；断链应沿用关系检查硬错误。
5. `priorityEngine` 摘要中的覆盖率、节点数和 Priority Row 数与实际数据一致。
6. 覆盖率低于阈值、关系检查硬错误、数据摘要缺失或 JSON 无法解析时，`ai-3` 必须停止同步并恢复备份。
7. 软提醒仍可进入报告，但必须有处理路径，不能被执行窗口硬绑无效关系来清零。

建议第一版硬错误：

- `missing_priority_engine_summary`
- `missing_judgment_nodes`
- `priority_without_judgment_node`
- `judgment_node_without_priority`
- `judgment_node_broken_relation`
- `judgment_coverage_below_required_threshold`
- `priority_engine_summary_mismatch`

## 8. 预期输出

- 已升级的统一同步闸门。
- 已更新的 `ai-3` 运行说明、自动化提示词或可恢复替代文档。
- 一份 UTF-8 closeout 文件：

```text
agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md
```

closeout 必须写清：

- 做了什么。
- 改了哪些文件。
- Judgment Node 覆盖率规则是什么。
- 哪些情况是硬错误，哪些仍是软提醒。
- 是否更新了实际 `ai-3` 自动化配置；如果没有，为什么没有。
- 运行了哪些检查。
- 哪些检查未运行及风险。
- 是否影响 `ai-the-point`、`ai-2`、`ai-3`。
- 失败时是否会恢复备份。
- 是否可以由调度中枢验收。

## 9. 必跑检查

必须运行：

- `node --check agent-workflow/tools/unified-site-sync.mjs`
- `node --check agent-workflow/tools/run-quality-gates.mjs`
- `node --check 04-Site/scripts/sync-data.mjs`
- `node --check 04-Site/scripts/check-relations.mjs`
- `node 04-Site/scripts/sync-data.mjs`
- `node 04-Site/scripts/check-relations.mjs`
- `node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04`
- `node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04 --run-sync-gate`

建议运行：

- `node 04-Site/scripts/check-tags.mjs`
- `node 04-Site/scripts/check-point-quality.mjs`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`

未运行的检查必须在 closeout 中说明原因、风险和后续 owner。

## 10. 自动化影响

本任务可能影响自动化任务。

- `ai-the-point`：默认不影响；本任务不改 The Point 生成逻辑。
- `ai-2`：间接影响；后续每日评分必须持续输出 Judgment Node 或可解析候选，否则 `ai-3` 会阻止入站。
- `ai-3`：直接影响；统一同步闸门需要新增 Priority Engine 2.0 Judgment Node 覆盖率与硬错误检查。

执行窗口完成后，必须同步更新对应自动化说明或提示词；如果无法直接更新实际自动化配置，必须更新 `agent-workflow/execution/daily-automation-coordination-2026-05-03.md` 或新增报告说明手动同步步骤。

## 11. 执行窗口启动提示词

```text
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

必跑检查：
- node --check agent-workflow/tools/unified-site-sync.mjs
- node --check agent-workflow/tools/run-quality-gates.mjs
- node --check 04-Site/scripts/sync-data.mjs
- node --check 04-Site/scripts/check-relations.mjs
- node 04-Site/scripts/sync-data.mjs
- node 04-Site/scripts/check-relations.mjs
- node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04
- node agent-workflow/tools/run-quality-gates.mjs automation --date=2026-05-04 --run-sync-gate

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md

收口文件必须写清：做了什么、改了哪些文件、Judgment Node 覆盖率规则、硬错误和软提醒边界、是否更新实际 ai-3 自动化配置、运行了哪些检查、哪些检查未运行及风险、是否影响 ai-the-point / ai-2 / ai-3、失败时是否恢复备份、是否可以由主调度窗口验收。

完成后回到主调度窗口汇报：

收口：agent-workflow/reports/WSD-20260504-23-ai-3-judgment-node-sync-gate-closeout.md
```
