# Agent Workflow｜当前工作流

本目录只保留当前调度、规则、Agent、自动化和验收所需文件。

## 当前原则

- 默认入口是 `AGENTS.md`、`context/` 和当前派发单。
- Agent 按流程节点设置。
- Skill 按能力模块沉淀。
- 已停止版本、重复版本、过程文档和无效文档直接删除。
- 发布路径只保留 GitHub Pages；Netlify 已退役，不得推送或部署。

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

- Data Center / Business Signals：本地统一控制器每日 08:10（Asia/Shanghai）按需启动生产，09:15 只做一次定向恢复，09:50 统一收口；10:30 GitHub 健康任务仅作为云端安全兜底，不得盲目重复全链采集。
- First-Line Viewpoints 与 Community Intelligence：保持独立监测、门禁和 PR 边界，站点发布仍统一进入 GitHub Pages。
- Data Center V4：处于双写迁移期，以 `context/12-data-center-v4.md` 和数据中心专属 Supervisor / Integrity Gate 为准；V3 Card 与前台链仅是冻结兼容投影。

## 当前任务

当前动作索引见：

```text
context/09-v3-3-current-action-index.md
```
