# Agent Handoff Template

更新时间：2026-05-03  
owner：`workflow`  
状态：长期生效

## 1. 定位

本模板用于所有长期 agent 完成阶段性任务后的交接。

交接不是聊天总结，而是让新窗口、新会话或下一个 agent 能继续工作的项目记录。

## 2. 推荐文件位置

任务级交接：

```text
agent-workflow/reports/<module>-handoff-YYYY-MM-DD.md
```

长期总交接：

```text
docs/agent-handoff.md
```

进度账本：

```text
agent-workflow/progress.md
```

## 2.1 文件编码

所有 handoff / 交接类 Markdown 文件必须保存为 UTF-8。

适用范围：

- `docs/agent-handoff.md`
- `agent-workflow/progress.md`
- `agent-workflow/reports/*handoff*.md`
- `agent-workflow/reports/*closeout*.md`
- 其他用于新窗口恢复状态的交接报告

Windows PowerShell 环境下读取中文交接文件时，优先显式使用 UTF-8，例如：

```powershell
Get-Content -Raw -Encoding UTF8 -LiteralPath 'docs/agent-handoff.md'
```

新增或更新交接文件时，也必须保证以 UTF-8 写入，避免后续新会话读取乱码。

## 3. 标准模板

```markdown
# <模块或任务> Handoff

日期：YYYY-MM-DD
owner：`<agent-id>`
状态：passed / verify / in_progress / blocked

## 1. 本轮输入

- 读取了哪些产品规范。
- 读取了哪些 PRD。
- 读取了哪些源文件、报告或脚本。

## 2. 本轮目标

- 本轮要解决的问题。
- 本轮不解决的问题。

## 3. 已完成

- 完成事项 1。
- 完成事项 2。
- 完成事项 3。

## 4. 修改文件

- `path/to/file`
- `path/to/file`

## 5. 验证结果

- 运行了哪些检查。
- 检查结果如何。
- 哪些检查未运行，原因是什么。

## 6. 风险与遗留

- 遗留问题。
- 软提醒。
- 需要人工确认的事项。

## 7. 下一个 Agent

| Agent | 下一步 |
|---|---|
| PM Agent | ... |
| Intelligence Data Agent | ... |
| Dev Agent | ... |
| QA Agent | ... |

## 8. 回填位置

- 是否更新 `feature_list.json`。
- 是否更新 `progress.md`。
- 是否更新 `docs/agent-handoff.md`。
- 是否新增报告。
```

## 4. 最低交接要求

即使任务很小，也至少写清：

- 做了什么。
- 改了哪些文件。
- 验证了什么。
- 还剩什么。

## 5. 多 agent 交接规则

### Strategy -> PM

必须交接：

- 战略判断。
- 做 / 不做的理由。
- 前台、后台或内部能力归属。
- 是否需要 PRD。

### PM -> Intelligence Data / UI / Copy / Dev / QA

必须交接：

- PRD。
- 任务范围。
- 非目标。
- 输入文件。
- 输出文件。
- 验收标准。

### Intelligence Data -> Dev / QA

必须交接：

- 字段变化。
- 关系规则。
- 质量检查规则。
- 待复核清单。
- 哪些可自动化，哪些需人工判断。

### UI/UE + Copy -> Dev

必须交接：

- 页面结构。
- 阅读路径。
- 文案规则。
- 禁用表达。
- 移动端注意点。

### Dev -> QA

必须交接：

- 改动文件。
- 本地验证命令。
- 已知风险。
- 多身份验收点。
- 未运行的检查。

### QA -> Workflow

必须交接：

- 通过项。
- 阻塞项。
- 软提醒。
- 发布建议。
- 下一轮任务。

## 6. 禁止事项

- 不只写“已完成”。
- 不省略未运行检查。
- 不把需要人工确认的事项埋在长段落里。
- 不让临时结论只留在对话中。
