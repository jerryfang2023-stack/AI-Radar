# WSD-20260504-08-admin-console-requirements 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`pm`

## 1. 任务目标

为 Admin 管理后台独立升级输出开发需求，覆盖管理功能模块设计和页面设计方向，并推进后续 UI / Dev / QA 执行。

## 2. 非目标

- 本任务不直接开发 Admin 页面。
- 不接入真实云端权限、数据库或支付。
- 不把 Admin 能力暴露到普通前台。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| PM Agent | 输出 Admin 模块、页面地图、开发需求和验收标准 |
| UI / UE Agent | 后续输出后台页面结构和操作体验 |
| Dev Agent | 后续实现 Admin 功能模块 |
| QA Agent | 验收普通前台无后台痕迹与 Admin 操作效率 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-08-admin-console-requirements.md`
5. `agent-workflow/agents/pm-agent.md`
6. `agent-workflow/prd/active/PRD-005-membership-access.md`
7. `agent-workflow/feature_list.json`
8. `04-Site/admin.html`

## 5. 允许改动范围

- 可新增或更新 `agent-workflow/prd/active/PRD-007-admin-console.md`
- 可新增 `agent-workflow/reports/admin-console-requirements-2026-05-04.md`
- `agent-workflow/reports/WSD-20260504-08-admin-console-requirements-closeout.md`

## 6. 禁止改动范围

- 不改 `04-Site/admin.html`。
- 不改普通前台页面。
- 不改权限或自动化代码。

## 7. 预期输出

- Admin 后台模块清单。
- 页面地图。
- P0 / P1 开发批次。
- UI / Dev / QA 派发建议。
- 收口文件：`agent-workflow/reports/WSD-20260504-08-admin-console-requirements-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：否。
- 是否可能影响 `ai-2`：否。
- 是否可能影响 `ai-3`：否。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-08-admin-console-requirements.md

你是本任务的独立 PM 执行窗口，只处理派发单中允许的范围。
请输出 Admin 管理后台独立升级的开发需求、模块设计、页面地图、P0/P1 批次和验收标准。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-08-admin-console-requirements-closeout.md
```

