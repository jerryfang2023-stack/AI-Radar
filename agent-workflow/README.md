# Agent Workflow｜当前工作流

本目录只保留当前调度、规则、Agent、自动化和验收所需文件。

## 当前原则

- 默认入口是 `AGENTS.md`、`context/` 和当前派发单。
- Agent 按流程节点设置。
- Skill 按能力模块沉淀。
- 已停止版本、重复版本、过程文档和无效文档直接删除。
- GitHub / Netlify 暂停状态下不得推送或部署。

## 当前目录

| 目录 | 用途 |
|---|---|
| `agents/` | 4 个流程节点轻 Agent |
| `automation-prompts/` | 当前自动化提示词 |
| `execution/` | 当前派发单和看板 |
| `governance/` | 当前治理规则 |
| `product/` | 当前产品、数据、文案、设计和监测规则 |
| `reports/` | 当前自动化运行所需报告 |

## 当前 Agent

1. Product Commander
2. Intelligence Engine
3. Experience & Editorial
4. Build & Release

详见 `agent-workflow/agents/README.md`。

## 当前自动化

- `guanlan-daily-monitor`：PAUSED，按需手动触发。
- `guanlan-daily-assets-chain`：PAUSED，按需手动触发。
- `daily-observation-writer`：PAUSED。

## 当前任务

当前任务看板见：

```text
agent-workflow/execution/dispatch-board.md
```
