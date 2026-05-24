---
status: current
scope: task-start-template
last_updated: 2026-05-21
use_when:
  - create dispatch prompt
  - start new execution window
do_not_use_when:
  - user gives exact files and asks direct edit
priority: template
---

# Task Start Template｜任务启动模板

```md
本任务禁止全库扫描 Markdown。

请只读取以下文件：
1. AGENTS.md
2. context/00-current-state.md
3. {任务对应 context 文件}
4. {高风险流程读取 context/06-execution-harness.md}
5. {任务对应 Skill，如有}

如果上下文不足，先说明缺什么，不要自行扩大读取范围。
```
