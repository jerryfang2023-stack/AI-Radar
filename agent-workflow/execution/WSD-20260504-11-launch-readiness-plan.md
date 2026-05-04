# WSD-20260504-11-launch-readiness-plan 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`pm` / `dev`

## 1. 任务目标

制定上线前准备计划，覆盖服务器、数据库、版本管理、备份、回滚、权限、数据写入、构建部署和发布验收。

## 2. 非目标

- 本任务不直接上线。
- 不购买服务器或配置真实云资源。
- 不接入真实支付。
- 不迁移数据库。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| PM Agent | 定义上线范围、阶段和发布标准 |
| Dev Agent | 输出技术方案、服务器/数据库/部署/备份/回滚清单 |
| QA Agent | 输出 release checklist 和阻塞项 |
| Workflow Agent | 记录上线准备状态 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-11-launch-readiness-plan.md`
5. `agent-workflow/agents/dev-agent.md`
6. `04-Site/README.md`
7. `agent-workflow/governance/quality-gates.md`
8. `agent-workflow/prd/active/PRD-005-membership-access.md`

## 5. 允许改动范围

- 可新增 `agent-workflow/reports/launch-readiness-plan-2026-05-04.md`
- 可新增 `agent-workflow/execution/launch-readiness-checklist-2026-05-04.md`
- `agent-workflow/reports/WSD-20260504-11-launch-readiness-plan-closeout.md`

## 6. 禁止改动范围

- 不改生产或云端配置。
- 不改现有代码。
- 不运行破坏性命令。
- 不接入真实用户、支付或数据库。

## 7. 预期输出

- 上线准备路线图。
- 服务器和数据库方案候选。
- 版本管理、备份、回滚方案。
- 发布前 Quality Gates。
- P0/P1 技术任务拆分。
- 收口文件：`agent-workflow/reports/WSD-20260504-11-launch-readiness-plan-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：规划阶段否。
- 是否可能影响 `ai-2`：规划阶段否。
- 是否可能影响 `ai-3`：规划阶段否。

上线实施阶段会影响自动化和同步闸门，必须另起 Plan-first 任务。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-11-launch-readiness-plan.md

你是本任务的独立执行窗口，只处理派发单中允许的范围。
请输出上线前准备计划，覆盖服务器、数据库、版本管理、备份、回滚、权限、数据写入、构建部署和发布验收。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-11-launch-readiness-plan-closeout.md
```

