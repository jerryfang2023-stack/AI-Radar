# V2-WORKFLOW-SKILL-GRAPH-UPGRADE 派发单

日期：2026-05-08  
状态：accepted  
调度窗口：当前主窗口  
牵头 Agent：`workflow` / `pm`

## 0. 快速执行卡

- 看板编号：`V2-WORKFLOW-SKILL-GRAPH-UPGRADE`
- Task ID：`V2-WORKFLOW-SKILL-GRAPH-UPGRADE`
- 任务类型：治理类 / Workflow 能力升级
- 派发单：`agent-workflow/execution/V2-WORKFLOW-SKILL-GRAPH-UPGRADE.md`
- 默认 closeout：`agent-workflow/reports/V2-WORKFLOW-SKILL-GRAPH-UPGRADE-closeout.md`
- 调度口令：`收口：V2-WORKFLOW-SKILL-GRAPH-UPGRADE`
- 是否可能影响自动化：否

执行窗口最短启动提示词：

```text
执行任务：V2-WORKFLOW-SKILL-GRAPH-UPGRADE
请读取 AGENTS.md 和 agent-workflow/execution/V2-WORKFLOW-SKILL-GRAPH-UPGRADE.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/V2-WORKFLOW-SKILL-GRAPH-UPGRADE-closeout.md。
回调度窗口：收口：V2-WORKFLOW-SKILL-GRAPH-UPGRADE
```

## 1. 任务目标

- 为 V2 长期 Agent 协作建立一张可恢复的技能图谱。
- 明确长期 Agent、V2 专项 Agent、项目规范、本地技能、插件能力和质量闸门之间的关系。
- 让后续派发任务时能快速判断应该读取哪些文件、调用哪些能力、写回哪些产物。

## 2. 非目标

- 不创建临时 Agent。
- 不新增第九个基础长期 Agent。
- 不改 V2 前台页面、站点数据生成器、自动化本体或 Netlify 配置。
- 不安装、更新或执行外部 skill / repo。
- 不恢复旧 `04-Site`，不处理 `09-ai-news-radar`。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| Workflow / Automation Agent | 建立技能图谱、更新调度看板、写进度和交接 |
| PM Agent | 确认图谱不新增产品模块、不绕过 PM 门禁 |
| QA / Acceptance Agent | 检查文档范围、语法闸门和自动化影响 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/README.md`
4. `agent-workflow/governance/long-term-agent-dispatch-policy.md`
5. `agent-workflow/governance/agent-memory.md`
6. `agent-workflow/governance/plan-first-policy.md`
7. `agent-workflow/governance/quality-gates.md`
8. `agent-workflow/governance/window-dispatch-hub.md`
9. `agent-workflow/v2/v2-agent-system.md`
10. `agent-workflow/agents/workflow-agent.md`
11. `agent-workflow/agents/pm-agent.md`

## 5. 允许改动范围

- `agent-workflow/v2/v2-workflow-skill-graph.md`
- `agent-workflow/v2/README.md`
- `agent-workflow/execution/V2-WORKFLOW-SKILL-GRAPH-UPGRADE.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/progress.md`
- `docs/agent-handoff.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/reports/V2-WORKFLOW-SKILL-GRAPH-UPGRADE-closeout.md`

## 6. 禁止改动范围

- 不改 `01-SiteV2/site/` 页面、样式、脚本或数据。
- 不改 `01-SiteV2/content/` 内容资产。
- 不改 Codex app automation。
- 不改 Netlify / GitHub 配置。
- 不改旧 V1 归档。

## 7. 预期输出

- 主交付物：`agent-workflow/v2/v2-workflow-skill-graph.md`
- README 索引：`agent-workflow/v2/README.md`
- 调度状态：`dispatch-board.md` 增加本任务 accepted 记录
- 收口文件：`agent-workflow/reports/V2-WORKFLOW-SKILL-GRAPH-UPGRADE-closeout.md`

## 8. 必跑检查

- [x] `node -e "JSON.parse(require('fs').readFileSync('agent-workflow/feature_list.json','utf8')); console.log('feature_list ok')"`
- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`

未运行项：

- 浏览器桌面 / 移动端检查：不适用，本任务不改页面。
- v2content：不适用，本任务不改内容资产。

## 9. 自动化影响

- V1 旧自动化已停止，不再作为 V2 阻塞口径。
- V2 Codex app automation：不影响。
- 本任务只增加治理文档，不改变任何自动化运行时间、提示词、目录或脚本。
