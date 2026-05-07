# V2.0 Long-term Agent System

日期：2026-05-07  
状态：accepted  
owner：`workflow` / `pm`  
参考文章：`Building multi-agent systems: When and how to use them`，Claude Blog，2026-01-23

## 1. 设计依据

V2.0 新长期 Agent 体系采用“上下文边界优先”的拆分方式。

参考文章给出的判断：

- 多 Agent 只在三类场景中稳定有价值：上下文保护、可并行探索、专业化工具 / 领域。
- 多 Agent 会带来协调成本、提示词维护成本和额外失败点。
- 拆分不应按“规划 / 实现 / 测试”这类问题阶段，而应按真正可隔离的上下文拆分。
- 验证型 Agent 是高性价比模式，因为它只需要黑盒检查，不需要完整实现历史。

观澜AI V2.0 的多 Agent 采用这些原则：

```text
少设 Agent，只在上下文足够独立时设长期岗位。
每个 Agent 必须有明确输入、输出、禁止范围和交接文件。
调度中枢负责路由，不让 Agent 彼此自由扩散。
QA / Verification 独立于生产 Agent，但只做黑盒验收与证据检查。
```

## 2. V2 Agent 总结构

V2.0 保留 V1 的八个长期 Agent 作为治理底座，但新增一组 V2 专项长期 Agent。它们是岗位说明书和工作流文件，不是临时聊天线程。

```text
Dispatch Hub / Workflow
├── V2 Strategy & Product Architecture Agent
├── V2 Source Intelligence Agent
├── V2 Signal Evidence Agent
├── V2 Point / Builder Insight Agent
├── V2 Heatmap Algorithm Agent
├── V2 AI Brief Editorial Agent
├── V2 VI / Design System Agent
├── V2 Platform / Dev Migration Agent
└── V2 Verification Agent
```

## 3. 新长期 Agent 分配表

| Agent | 上下文边界 | 核心职责 | 主要输出 |
|---|---|---|---|
| V2 Strategy & Product Architecture Agent | 产品定位、商业内参、栏目关系、会员价值 | 决定 V2 产品结构、AI内参是否进入产品架构、模块取舍、PM 门禁和 WAVE | `v2-product-architecture-prd.md`、模块决策表 |
| V2 Source Intelligence Agent | 外部来源、采集渠道、来源可信度 | 管理海外 AI 新闻、融资、VC、Builder、X/LinkedIn、Product Hunt、YC 等来源分层与采集规则 | `v2-source-intelligence.md`、来源字典、监测规则 |
| V2 Signal Evidence Agent | 原始信息到 Signal / HeatEvidence 的证据转换 | 从 Raw / Pool / Structured 中筛出高质量 Signal，并提取行业、岗位、流程、影响方式 | `v2-signal-evidence-rules.md`、Signal -> HeatEvidence 规则 |
| V2 Point / Builder Insight Agent | 一线观点、实践反馈、反证和争议 | 处理 builder 观点、实践碎片、失败反馈、非共识判断，校准热力方向 | `v2-point-builder-insight.md`、Point Fragment / Cluster / Insight 规则 |
| V2 Heatmap Algorithm Agent | HeatEvidence、热力评分、阶段判断、三元组聚合 | 设计行业 / 岗位 / 流程 / 三元组热力，定义 AIBriefIssue 输入与评分算法 | `v2-heatmap-algorithm.md`、schema、scoring |
| V2 AI Brief Editorial Agent | 周报 / 月报内参、判断摘要、证据表达 | 把热力图结果转为观澜AI商业内参，生成核心判断、证据来源和克制表达 | `v2-ai-brief-editorial.md`、Issue 模板、Copy 规则 |
| V2 VI / Design System Agent | 品牌视觉、热力图体验、内参页面母版 | 设计 V2 VI、AI内参视觉、热力图表现、详情页和移动端规则 | `v2-vi-design-direction.md`、页面母版、视觉规则 |
| V2 Platform / Dev Migration Agent | 代码架构、分支 / worktree、数据同步、迁移 | 规划 V1 baseline、V2 branch/worktree、数据结构落地、回滚与部署隔离 | `v2-dev-workspace-baseline.md`、迁移方案 |
| V2 Verification Agent | 黑盒验收、证据完整性、质量门禁 | 独立检查 Agent 产物是否满足派发单、PM 门禁、SYS-7、自动化影响和数据可追溯 | QA closeout、阻塞项、发布建议 |

## 4. 为什么这样拆

### 4.1 符合上下文隔离

- Source Agent 只关心来源与采集，不需要理解 VI。
- Heatmap Algorithm Agent 只关心证据、schema、评分和聚合，不负责页面。
- VI Agent 只关心视觉系统和体验，不直接定义算法。
- Editorial Agent 只关心内参表达、证据解释和判断边界。

这些上下文足够独立，拆开能减少单一 Agent 上下文污染。

### 4.2 支持并行

可并行执行：

- `V2 Source Intelligence Agent` 调研来源。
- `V2 VI / Design System Agent` 做视觉方向。
- `V2 Strategy & Product Architecture Agent` 做产品边界。

不建议并行执行：

- AI内参正式 PRD 与 Heatmap 算法定稿。
- 页面 Dev 与 VI 未定稿。
- 生产自动化替换与 7 日测试未完成。

### 4.3 支持专业化

V2 会同时涉及来源监测、数据模型、评分算法、商业内参、VI、工程迁移和 QA。单 Agent 同时携带这些工具与规则会增加混淆，因此采用专业化长期 Agent。

## 5. 调度规则

### 5.1 调度中枢

调度中枢仍只负责：

- 派发任务。
- 输出短口令。
- 接收 closeout。
- 按硬闸门验收。
- 回填看板、progress、handoff、feature_list。

调度中枢不直接执行大型算法、页面、VI 或开发任务，除非用户明确要求。

### 5.2 任务分配

| 任务类型 | 默认牵头 |
|---|---|
| V2 产品结构、AI内参是否成立 | V2 Strategy & Product Architecture Agent |
| 来源扩展、监测规则 | V2 Source Intelligence Agent |
| Signal 筛选、HeatEvidence 提取 | V2 Signal Evidence Agent |
| Builder 观点、反证、争议期 | V2 Point / Builder Insight Agent |
| Heatmap schema、评分、聚合 | V2 Heatmap Algorithm Agent |
| 内参 Issue、周报 / 月报表达 | V2 AI Brief Editorial Agent |
| VI、热力图视觉、页面母版 | V2 VI / Design System Agent |
| branch、worktree、代码迁移 | V2 Platform / Dev Migration Agent |
| 验收、阻塞、发布建议 | V2 Verification Agent |

### 5.3 验证模式

每个 V2 关键任务必须有 `V2 Verification Agent` 的独立验收段，尤其是：

- 产品功能类任务：PM 门禁、WAVE、模块决策表。
- 算法类任务：schema、评分、反证、可追溯性。
- 页面 / VI 类任务：SYS-7 证据化审美质检。
- 自动化影响类任务：`ai-the-point`、`ai-2`、`ai-3` 影响说明。

## 6. 第一批任务映射

| 看板编号 | Task ID | 牵头 Agent | 说明 |
|---|---|---|---|
| V2-1 | `WSD-20260507-02-v2-agent-system-design` | Workflow / PM | 已由本文档完成，可标记 accepted |
| V2-2 | `WSD-20260507-03-v2-algorithm-source-architecture` | V2 Source Intelligence Agent + V2 Heatmap Algorithm Agent | 来源、HeatEvidence、热力评分 |
| V2-3 | `WSD-20260507-04-v2-vi-design-direction` | V2 VI / Design System Agent | V2 品牌视觉与热力图体验 |
| V2-4A | `WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan` | V2 Strategy & Product Architecture Agent | AI内参 + 热力图增值产品门禁 |
| V2-4 | `WSD-20260507-05-v2-product-architecture-prd` | V2 Strategy & Product Architecture Agent | V2 总 PRD，吸收 V2-2 / V2-3 / V2-4A |
| V2-5 | `WSD-20260507-06-v2-dev-workspace-baseline` | V2 Platform / Dev Migration Agent | V1 tag、V2 branch/worktree、迁移与回滚 |

## 7. 不新增的 Agent

暂不新增：

- Growth Agent：商业化由 Strategy & Product Architecture 承接，等 AI内参产品成立后再决定。
- Social / Distribution Agent：V2 先把判断产品做实，不先做传播渠道。
- Standalone Poster Agent：视觉资产归 VI / Design System Agent。
- Standalone Prompt Agent：Prompt 归对应上下文 Agent 管理，避免提示词脱离业务规则。

## 8. 后续文件建议

后续可将每个 V2 Agent 拆成独立岗位文件：

```text
agent-workflow/v2/agents/v2-strategy-product-agent.md
agent-workflow/v2/agents/v2-source-intelligence-agent.md
agent-workflow/v2/agents/v2-signal-evidence-agent.md
agent-workflow/v2/agents/v2-point-builder-insight-agent.md
agent-workflow/v2/agents/v2-heatmap-algorithm-agent.md
agent-workflow/v2/agents/v2-ai-brief-editorial-agent.md
agent-workflow/v2/agents/v2-vi-design-system-agent.md
agent-workflow/v2/agents/v2-platform-dev-migration-agent.md
agent-workflow/v2/agents/v2-verification-agent.md
```

当前阶段先以本文档作为 V2 Agent 分配的单一口径。

