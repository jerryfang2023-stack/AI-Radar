# WaveSight AI Agent Architecture

WaveSight AI 使用两层 Agent：

1. **流程角色**：描述责任边界与 handoff，不代表每个角色都要成为常驻子 Agent。
2. **Codex 运行 Agent**：位于仓库 `.codex/agents/`，只为适合并行、只读、可独立验收的窄任务提供运行配置。

## 当前事实主链

```text
Product Commander
        |
        v
Intelligence Engine
SourceArtifact -> RawDocument -> Claim / Entity -> CanonicalEvent
        |
        +--> evidence-backed projections / exports
        |
        v
Experience & Editorial
        |
        v
Build & Release
```

V3 `Raw -> Pool -> Card`、关系图和趋势候选是兼容或下游应用支线。只有任务明确要求时才进入范围，不能反向污染 V4 规范数据。

## 四个流程角色

| 角色 | 责任 | 主要产物 |
|---|---|---|
| Product Commander | 入口、路由、边界和验收 | 派发单、成功标准、handoff |
| Intelligence Engine | 来源、证据、事实结构化 | Claim、Entity、CanonicalEvent、事实投影、完整性问题 |
| Experience & Editorial | 信息架构与前台表达 | 页面规格、字段映射、文案与体验验收 |
| Build & Release | 实现、质量门和授权后的发布 | 代码改动、验证结果、发布状态 |

详细边界见同目录四个 Agent 文档和 `agent-registry.json`。

## Codex 运行 Agent

仓库仅配置三个只读 Agent：

| Agent | 用途 | 默认模型 |
|---|---|---|
| `evidence-explorer` | 查找来源、证据链和数据血缘 | GPT-5.6 Terra / medium |
| `quality-reviewer` | 审查规则、数据契约和 gate 风险 | GPT-5.6 Sol / high |
| `experience-reviewer` | 审查页面契约、信息层级和前台边界 | GPT-5.6 Sol / medium |

Product Commander 保留为主 Agent；Build & Release 涉及写入与可能的外部动作，也由主 Agent执行。这样可以避免把模糊决策或写操作交给自治子 Agent。

静态检查三个配置：

```text
npm run check:custom-agent-smoke
```

端到端调用并验证只读委派、预期判断、Skill 加载错误和描述预算：

```text
npm run eval:custom-agent-smoke
```

自定义 Agent 委派必须使用 `fork_turns="none"`；全历史 fork 会继承父 Agent 类型，无法保留指定的自定义 Agent。

## Handoff 最小字段

- `goal`
- `scope`
- `inputs`
- `non_goals`
- `constraints`
- `deliverables`
- `validation`
- `risks`
- `next_owner`

## 路由规则

- Data Center V4 事实任务优先进入 Intelligence Engine。
- 页面表达任务进入 Experience & Editorial，但事实缺口退回 Intelligence Engine。
- 实现和验证进入 Build & Release。
- 高风险、多阶段任务由 Product Commander 指定 execution harness。
- 栏目能力优先做 Skill；只有任务能独立、只读、可评测且值得并行时，才增加 Codex 运行 Agent。

## 禁止事项

- 不把 First-Line Viewpoints 或 Community Intelligence 当作商业事件证据。
- 不把重要性、价值、机会、建议或趋势判断写进 V4 规范数据。
- 不恢复退役 V2/V3 前台。
- 不让只读 Agent 修改文件、运行发布或替用户做重大取舍。
