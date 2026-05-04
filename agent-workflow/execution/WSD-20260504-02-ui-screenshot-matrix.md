# WSD-20260504-02-ui-screenshot-matrix 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue` / `qa`

## 1. 任务目标

对 Signals / Daily / Opportunities / Trends 做 UI / UE 截图矩阵验收，确认一级栏目标题、首屏密度、详情页成品感、移动端布局和横向溢出风险。

## 2. 非目标

- 不做大范围页面重构。
- 不改动数据模型。
- 不调整自动化任务。
- 不新增栏目。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| UI / UE Agent | 依据 DESIGN.md 检查标题、层级、留白、卡片密度 |
| QA Agent | 独立记录浏览器验收结果和阻塞项 |
| Dev Agent | 只修复小范围横向溢出、重叠或明显样式问题 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-02-ui-screenshot-matrix.md`
5. `agent-workflow/agents/ui-ue-agent.md`
6. `agent-workflow/agents/qa-agent.md`
7. `agent-workflow/product/DESIGN.md`

## 5. 允许改动范围

- `04-Site/css/styles.css`
- `04-Site/js/app.js` 仅限样式 class 或渲染结构的小修
- `agent-workflow/reports/*screenshot*.png`
- `agent-workflow/reports/WSD-20260504-02-ui-screenshot-matrix-closeout.md`
- 必要时新增 `agent-workflow/reports/ui-screenshot-matrix-2026-05-04.md`

## 6. 禁止改动范围

- 不改动内容源 Markdown。
- 不改动同步脚本和自动化任务。
- 不改变页面信息架构，除非发现阻塞级问题并在收口中说明。

## 7. 预期输出

- 桌面端和移动端验收结论。
- 截图或截图路径记录。
- 阻塞问题 / 软提醒 / 可接受风险。
- 收口文件：`agent-workflow/reports/WSD-20260504-02-ui-screenshot-matrix-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [x] 如修改 `04-Site/js/app.js`，运行 `node --check 04-Site/js/app.js`
- [x] 浏览器桌面 / 移动端检查

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：否
- 是否可能影响 `ai-2`：否
- 是否可能影响 `ai-3`：否

本任务只验收和小范围修正前台 UI，不改变内容生成、同步和质量闸门。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-02-ui-screenshot-matrix.md

你是本任务的独立执行窗口，只处理派发单中允许的范围。
重点对 Signals / Daily / Opportunities / Trends 做桌面端和移动端 UI / UE 截图矩阵验收，必要时只做小范围样式修正。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-02-ui-screenshot-matrix-closeout.md
```

