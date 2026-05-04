# <TASK-ID> 派发单

日期：YYYY-MM-DD  
状态：dispatched  
调度窗口：当前主窗口  
牵头 Agent：`pm` / `workflow` / `data` / `ui-ue` / `copy` / `dev` / `qa` / `strategy`

## 1. 任务目标

- 要解决什么问题。
- 用户期望看到什么结果。

## 2. 非目标

- 本任务不做什么。
- 哪些事项必须等下一轮或用户确认。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| PM Agent | 定义范围和验收 |
| Workflow / Automation Agent | 记录进度和收口 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. 本派发单

按任务类型补充：

- `agent-workflow/product/DESIGN.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/reports/relation-check-latest.md`

## 5. 允许改动范围

- `path/to/file`
- `path/to/folder/`

## 6. 禁止改动范围

- 不改动与本任务无关的文件。
- 不改变自动化运行顺序，除非派发单明确允许。
- 不改变 Markdown 字段或同步脚本口径，除非派发单明确允许。

## 7. 预期输出

- 主交付物：
- 收口文件：`agent-workflow/reports/<TASK-ID>-closeout.md`

## 8. 必跑检查

根据任务类型勾选：

- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] `node 04-Site/scripts/sync-data.mjs`
- [ ] `node 04-Site/scripts/check-relations.mjs`
- [ ] `node 04-Site/scripts/check-tags.mjs`
- [ ] 浏览器桌面 / 移动端检查
- [ ] 多身份权限检查

未运行的检查必须在收口文件中说明原因和风险。

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：
- 是否可能影响 `ai-2`：
- 是否可能影响 `ai-3`：
- 如影响，需要同步更新的文件或提示词：

## 10. 外部 GitHub skill / repo 安全审查

如本任务涉及安装、更新、学习或引用外部 GitHub skill / repo，执行窗口必须在 closeout 中写清：

- 来源 URL、安装路径或读取路径。
- 是否包含脚本、依赖安装、远程执行、凭证读取或破坏性文件操作。
- 静态安全检查方式和风险等级。
- 哪些规则可吸收，哪些规则不适合观澜AI。
- 是否需要重启 Codex 或后续复查。

未完成上述说明的外部 skill / repo 任务，不得在调度中枢标记为 `accepted`。

## 11. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. <本派发单路径>

你是本任务的独立执行窗口，只处理派发单中允许的范围。
完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/<TASK-ID>-closeout.md

收口文件必须写清：做了什么、改了哪些文件、运行了哪些检查、哪些检查未运行及风险、是否影响自动化任务、下一步回到调度中枢窗口处理什么。
```
